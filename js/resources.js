SharkGame.PlayerResources = new Map(); // stats about resources player has
SharkGame.PlayerIncomeTable = new Map(); // every resource and how much is produced
SharkGame.ResourceMap = new Map(); // every resource and what it produces at base income
SharkGame.CalculationMap = new Map(); // a map which keeps track of incomes after upgrade and world multipliers to make calculations faster

SharkGame.Resources = {
    INCOME_COLOR: "#909090",
    TOTAL_INCOME_COLOR: "#A0A0A0",
    UPGRADE_MULTIPLIER_COLOR: "#707070",
    BOOST_MULTIPLIER_COLOR: "#60A060",
    WORLD_MULTIPLIER_COLOR: "#6060A0",
    ARTIFACT_MULTIPLIER_COLOR: "#70B5A0",
    RESOURCE_AFFECT_MULTIPLIER_COLOR: "#BFBF5A",

    specialMultiplier: null,
    rebuildTable: false,

    collapsedRows: new Set(),

    init() {
        // set all the amounts and total amounts of resources to 0
        $.each(SharkGame.ResourceTable, (key, value) => {
            SharkGame.ResourceMap.set(key, _.cloneDeep(value));
            SharkGame.CalculationMap.set(key, _.cloneDeep(value));
        });

        SharkGame.ResourceMap.forEach((v, key) => {
            SharkGame.PlayerResources.set(key, {
                amount: 0,
                totalAmount: 0,
                incomeMultiplier: 1,
                upgradeBoostMultiplier: 1,
                incomeBoost: 1,
            });
        });

        // populate income table with an entry for each resource!!
        SharkGame.ResourceMap.forEach((v, key) => {
            SharkGame.PlayerIncomeTable.set(key, 0);
        });

        r.specialMultiplier = 1;
        r.clearNetworks();
        r.buildIncomeNetwork();
    },

    processIncomes(timeDelta, debug) {
        r.recalculateIncomeTable();
        if (r.testGracePeriod()) {
            return;
        }

        if (!debug && timeDelta > 51) {
            for (let i = 0; i < 50; i++) {
                SharkGame.PlayerIncomeTable.forEach((value, key) => {
                    r.changeResource(key, value);
                });
                r.recalculateIncomeTable();
                timeDelta -= 1;
            }
            if (timeDelta > 172800) {
                timeDelta = r.doRKMethod(timeDelta, timeDelta / 1728, 50000);
            }
            if (timeDelta > 43200) {
                timeDelta = r.doRKMethod(timeDelta, 100, 8000);
            }
            if (timeDelta > 7200) {
                timeDelta = r.doRKMethod(timeDelta, 75, 2250);
            }
            if (timeDelta > 2000) {
                timeDelta = r.doRKMethod(timeDelta, 40, 500);
            }
            if (timeDelta > 50) {
                timeDelta = r.doRKMethod(timeDelta, 20, 50);
            }
        }
        while (timeDelta > 1) {
            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, value);
                } else {
                    r.changeResource(key, value);
                }
            });
            r.recalculateIncomeTable();
            timeDelta -= 1;
        }
        SharkGame.PlayerIncomeTable.forEach((value, key) => {
            if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                r.changeResource(key, value * timeDelta);
            } else {
                r.changeResource(key, value);
            }
        });
    },

    doRKMethod(time, h, stop) {
        let originalResources;
        let originalIncomes;
        let stepTwoIncomes;
        let stepThreeIncomes;

        while (time > stop) {
            originalResources = _.cloneDeep(SharkGame.PlayerResources);
            originalIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, (value * h) / 2, true);
                }
            });

            r.recalculateIncomeTable();
            stepTwoIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, (value * h) / 2, true);
                }
            });

            r.recalculateIncomeTable();
            stepThreeIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, value * h, true);
                }
            });

            r.recalculateIncomeTable();
            SharkGame.PlayerResources = originalResources;

            SharkGame.PlayerIncomeTable.forEach((v, resource) => {
                r.changeResource(
                    resource,
                    (h *
                        (originalIncomes.get(resource) +
                            2 * stepTwoIncomes.get(resource) +
                            2 * stepThreeIncomes.get(resource) +
                            SharkGame.PlayerIncomeTable.get(resource))) /
                        6,
                    true
                );
            });

            r.recalculateIncomeTable();
            time -= h;
        }
        return time;
    },

    recalculateIncomeTable() {
        // clear income table first
        SharkGame.ResourceMap.forEach((v, key) => {
            SharkGame.PlayerIncomeTable.set(key, 0);
        });

        const worldResources = w.worldResources;

        SharkGame.ResourceMap.forEach((properties, name) => {
            const worldResourceInfo = worldResources.get(name);
            if (worldResourceInfo.exists) {
                // for this resource, calculate the income it generates
                if (properties.income) {
                    let costScaling = 1;
                    const changeMap = new Map();

                    $.each(properties.income, (key) => {
                        if (w.doesResourceExist(key)) {
                            changeMap.set(key, r.getProductAmountFromGeneratorResource(name, key));
                        }
                    });

                    changeMap.forEach((change, resource) => {
                        // run over all resources first to check if costs can be met
                        // if the cost can't be taken, scale the cost and output down to feasible levels
                        if (!properties.forceIncome) {
                            if (change < 0) {
                                const resourceHeld = r.getResource(resource);
                                if (resourceHeld + change <= 0) {
                                    const scaling = resourceHeld / -change;
                                    if (scaling >= 0 && scaling < 1) {
                                        // sanity checking
                                        costScaling = Math.min(costScaling, scaling);
                                    } else {
                                        costScaling = 0; // better to break this way than break explosively
                                    }
                                }
                            }
                        }
                        if (change > 0) {
                            SharkGame.PlayerResources.get(resource).discovered = true;
                        }
                    });

                    changeMap.forEach((change, resource) => {
                        SharkGame.PlayerIncomeTable.set(resource, SharkGame.PlayerIncomeTable.get(resource) + change * costScaling);
                    });
                }

                // calculate any world income that should be added to this resource
                if (worldResourceInfo) {
                    SharkGame.PlayerIncomeTable.set(
                        name,
                        SharkGame.PlayerIncomeTable.get(name) + worldResourceInfo.income * worldResources.get(name).boostMultiplier * cad.speed
                    );
                }
            }
        });

        $.each(SharkGame.ResourceSpecialProperties.incomeCap, (k, v) => {
            if (SharkGame.PlayerIncomeTable.get(k) > v) {
                SharkGame.PlayerIncomeTable.set(k, v);
            }
        });
    },

    getProductAmountFromGeneratorResource(generator, product, numGenerator = r.getResource(generator)) {
        const rp = SharkGame.ResourceSpecialProperties;
        const playerResource = SharkGame.PlayerResources.get(generator);
        if (!r.getResourceCombinationAllowed(generator, product)) {
            return 0;
        }
        let generated =
            SharkGame.CalculationMap.get(generator).income[product] *
            numGenerator *
            r.getSpecialMultiplier() *
            r.getNetworkIncomeModifier("generator", generator) *
            r.getNetworkIncomeModifier("resource", product) *
            cad.speed;
        if (generated > 0) {
            generated *= w.getWorldBoostMultiplier(product) * r.getBoost(product);
        }
        return generated;
    },

    getNetworkIncomeModifier(network, resource) {
        switch (network) {
            case "generator":
                network = SharkGame.GeneratorIncomeAffectedApplicable;
                break;
            case "resource":
                network = SharkGame.ResourceIncomeAffectedApplicable;
        }

        const node = network[resource];
        let multiplier = 1;
        if (node) {
            if (node.multiply) {
                $.each(node.multiply, (key, val) => {
                    multiplier = multiplier * (1 + val * r.getResource(key));
                });
            }
            if (node.reciprocate) {
                $.each(node.reciprocate, (key, val) => {
                    multiplier = multiplier / (1 + val * r.getResource(key));
                });
            }
            if (node.exponentiate) {
                $.each(node.exponentiate, (key, val) => {
                    multiplier = multiplier * Math.pow(val, r.getResource(key));
                });
            }
            if (node.polynomial) {
                $.each(node.polynomial, (key, val) => {
                    multiplier = multiplier * (1 + Math.pow(r.getResource(key), val));
                });
            }
        }
        return multiplier;
    },

    // arg2 is here because "futureproofing", remove this comment when it is used.
    // eslint-disable-next-line no-unused-vars
    changeBaseIncome(method, generator, arg1, arg2) {
        const mapEntry = SharkGame.CalculationMap.get(generator);
        switch (method) {
            case "multiply":
                $.each(mapEntry.income, (resource, income) => {
                    mapEntry.income[resource] = income * arg1;
                });
                break;
            case "boost":
                $.each(mapEntry.income, (resource, income) => {
                    if (income > 0 && resource !== "tar") {
                        mapEntry.income[resource] = income * arg1;
                    }
                });
            //     break;
            // case "modify":
            //     if(mapEntry.income[arg1]) {
            //         mapEntry.income[arg1] = arg2;
            //     }
            //     break;
            // case "set":
            //     mapEntry.income[arg1] = arg2;
            // these two cases will require some special handling
            // modify will need to simply divide by the old base income and multiply by the new one
            // set will need to call a function to apply all multipliers to itself
        }
    },

    getResourceCombinationAllowed(generator, product) {
        return !w.worldRestrictedCombinations.has(generator) || !w.worldRestrictedCombinations.get(generator).includes(product);
    },

    getSpecialMultiplier() {
        return r.specialMultiplier;
    },

    getIncome(resource) {
        return SharkGame.PlayerIncomeTable.get(resource);
    },

    getBoost(resource) {
        return SharkGame.PlayerResources.get(resource).upgradeBoostMultiplier;
    },

    setBoost(resource, multiplier) {
        SharkGame.PlayerResources.get(resource).upgradeBoostMultiplier = multiplier;
        r.recalculateIncomeTable();
    },

    getMultiplier(resource) {
        return SharkGame.PlayerResources.get(resource).incomeMultiplier;
    },

    setMultiplier(resource, multiplier) {
        SharkGame.PlayerResources.get(resource).incomeMultiplier = multiplier;
        r.recalculateIncomeTable();
    },

    getIncomeBoost(resource, boosted) {
        if (SharkGame.ResourceMap.get(resource).income[boosted] < SharkGame.EPSILON) {
            return 1;
        }
        if (boosted === "tar") {
            return 1;
        }
        return SharkGame.PlayerResources.get(resource).incomeBoost;
    },

    setIncomeBoost(resource, multiplier) {
        SharkGame.PlayerResources.get(resource).incomeBoost = multiplier;
        r.recalculateIncomeTable();
    },

    // Adds or subtracts resources based on amount given.
    changeResource(resource, amount, norecalculation) {
        if (Math.abs(amount) < SharkGame.EPSILON) {
            return; // ignore changes below epsilon
        }

        const resourceTable = SharkGame.PlayerResources.get(resource);
        const prevTotalAmount = resourceTable.totalAmount;

        if (!w.doesResourceExist(resource)) {
            return; // don't change resources that don't technically exist
        }

        resourceTable.amount += amount;
        if (resourceTable.amount < 0) {
            resourceTable.amount = 0;
        }

        if (amount > 0) {
            resourceTable.totalAmount += amount;
        }

        if (prevTotalAmount < SharkGame.EPSILON) {
            // we got a new resource
            r.rebuildTable = true;
        }

        if (!norecalculation) {
            r.recalculateIncomeTable();
        }
    },

    setResource(resource, newValue) {
        const resourceTable = SharkGame.PlayerResources.get(resource);

        resourceTable.amount = newValue;
        if (resourceTable.amount < 0) {
            resourceTable.amount = 0;
        }
        r.recalculateIncomeTable();
    },

    setTotalResource(resource, newValue) {
        SharkGame.PlayerResources.get(resource).totalAmount = newValue;
    },

    getResource(resource) {
        return SharkGame.PlayerResources.get(resource).amount;
    },

    getTotalResource(resource) {
        return SharkGame.PlayerResources.get(resource).totalAmount;
    },

    isCategoryVisible(category) {
        let visible = false;
        $.each(category.resources, (_, resourceName) => {
            visible =
                visible ||
                ((SharkGame.PlayerResources.get(resourceName).totalAmount > 0 || SharkGame.PlayerResources.get(resourceName).discovered) &&
                    w.doesResourceExist(resourceName));
        });
        return visible;
    },

    getCategoryOfResource(resourceName) {
        let categoryName = "";
        $.each(SharkGame.ResourceCategories, (categoryKey, categoryValue) => {
            if (categoryName !== "") {
                return;
            }
            $.each(categoryValue.resources, (_, value) => {
                if (resourceName === value) {
                    categoryName = categoryKey;
                }
            });
        });
        return categoryName;
    },

    getResourcesInCategory(categoryName) {
        const resources = [];
        $.each(SharkGame.ResourceCategories[categoryName].resources, (i, value) => {
            resources.push(value);
        });
        return resources;
    },

    isCategory(name) {
        return !(typeof SharkGame.ResourceCategories[name] === "undefined");
    },

    isInCategory(resource, category) {
        return SharkGame.ResourceCategories[category].resources.indexOf(resource) !== -1;
    },

    getBaseOfResource(resourceName) {
        // if there are super-categories/base jobs of a resource, return that, otherwise return null
        let baseResourceName = null;
        SharkGame.ResourceMap.forEach((value, key) => {
            if (baseResourceName) {
                return;
            }
            if (value.jobs) {
                $.each(value.jobs, (_, jobName) => {
                    if (baseResourceName) {
                        return;
                    }
                    if (jobName === resourceName) {
                        baseResourceName = key;
                    }
                });
            }
        });
        return baseResourceName;
    },

    haveAnyResources() {
        let anyResources = false;
        SharkGame.PlayerResources.forEach((value) => {
            if (!anyResources) {
                anyResources = value.totalAmount > 0;
            }
        });
        return anyResources;
    },

    // returns true if enough resources are held (>=)
    // false if they are not
    checkResources(resourceList, checkTotal) {
        let sufficientResources = true;
        $.each(resourceList, (resource, required) => {
            const currentResource = checkTotal ? r.getTotalResource(resource) : r.getResource(resource);
            if (currentResource < required) {
                sufficientResources = false;
                return false;
            }
        });
        return sufficientResources;
    },

    changeManyResources(resourceList, subtract) {
        if (typeof subtract === "undefined") {
            subtract = false;
        }

        $.each(resourceList, (resource, amount) => {
            r.changeResource(resource, subtract ? -amount : amount);
        });
    },

    scaleResourceList(resourceList, amount) {
        const newList = {};
        $.each(resourceList, (k, v) => {
            newList[k] = v * amount;
        });
        return newList;
    },

    // update values in table without adding rows
    updateResourcesTable() {
        // if resource table does not exist, there are no resources, so do not construct table
        // if a resource became visible when it previously wasn't, reconstruct the table
        if (r.rebuildTable) {
            r.reconstructResourcesTable();
        } else {
            // loop over table rows, update values
            SharkGame.PlayerResources.forEach((resource, resourceName) => {
                const oldValue = $("#amount-" + resourceName).html();
                const newValue = m.beautify(resource.amount, true);
                if (oldValue !== newValue.replace(/'/g, '"')) {
                    $("#amount-" + resourceName).html(newValue);
                }

                const income = r.getIncome(resourceName);
                if (Math.abs(income) > SharkGame.EPSILON) {
                    const changeChar = income > 0 ? "+" : "";
                    const newIncome = "<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautifyIncome(income) + "</span>";
                    const oldIncome = $("#income-" + resourceName).html();
                    if (oldIncome !== newIncome.replace(/'/g, '"')) {
                        $("#income-" + resourceName).html(newIncome);
                    }
                } else {
                    $("#income-" + resourceName).html("");
                }
            });
        }
    },

    // add rows to table (more expensive than updating existing DOM elements)
    reconstructResourcesTable() {
        let resourceTable = $("#resourceTable");

        const statusDiv = $("#status");
        // if resource table does not exist, create
        if (resourceTable.length <= 0) {
            statusDiv.prepend("<h3>Stuff</h3>");
            const tableContainer = $("<div>").attr("id", "resourceTableContainer");
            tableContainer.append($("<table>").attr("id", "resourceTable"));
            statusDiv.append(tableContainer);
            resourceTable = $("#resourceTable");
        }

        // remove the table contents entirely
        resourceTable.empty();

        let anyResourcesInTable = false;

        if (SharkGame.Settings.current.groupResources) {
            $.each(SharkGame.ResourceCategories, (categoryName, category) => {
                if (r.isCategoryVisible(category)) {
                    const icon = r.collapsedRows.has(categoryName) ? "⯈" : "⯆";
                    const headerRow = $("<tr>")
                        .append(
                            $("<td>")
                                .attr("colSpan", 3)
                                .append(
                                    $("<h3>").html(`<span class="collapser">${icon}</span><span>${categoryName}</span>`).css("text-align", "left")
                                )
                        )
                        .on("click", () => SharkGame.Resources.collapseResourceTableRow(categoryName));

                    resourceTable.append(headerRow);
                    $.each(category.resources, (_resourceName, resourceValue) => {
                        if (r.getTotalResource(resourceValue) > 0 || SharkGame.PlayerResources.get(resourceValue).discovered) {
                            if (!r.collapsedRows.has(categoryName)) {
                                const row = r.constructResourceTableRow(resourceValue);
                                resourceTable.append(row);
                            }
                            anyResourcesInTable = true;
                        }
                    });
                }
            });
        } else {
            // iterate through data, if total amount > 0 add a row
            SharkGame.ResourceMap.forEach((v, key) => {
                if ((r.getTotalResource(key) > 0 || SharkGame.PlayerResources.get(key).discovered) && w.doesResourceExist(key)) {
                    const row = r.constructResourceTableRow(key);
                    resourceTable.append(row);
                    anyResourcesInTable = true;
                }
            });
        }

        // if the table is still empty, hide the status div
        // otherwise show it
        if (!anyResourcesInTable) {
            statusDiv.hide();
        } else {
            statusDiv.show();
        }

        // debugger;
        resourceTable.css("min-width", resourceTable.outerWidth() + "px");

        r.rebuildTable = false;
    },

    collapseResourceTableRow(categoryName) {
        if (this.collapsedRows.has(categoryName)) {
            this.collapsedRows.delete(categoryName);
        } else {
            this.collapsedRows.add(categoryName);
        }
        this.reconstructResourcesTable();
    },

    constructResourceTableRow(resourceKey) {
        const k = resourceKey;
        const pr = SharkGame.PlayerResources.get(k);
        const income = r.getIncome(k);
        const row = $("<tr>");
        if (pr.totalAmount > 0 || SharkGame.PlayerResources.get(k).discovered) {
            row.append(
                $("<td>")
                    .attr("id", "resource-" + k)
                    .html(r.getResourceName(k))
            );

            row.append(
                $("<td>")
                    .attr("id", "amount-" + k)
                    .html(m.beautify(pr.amount))
            );

            const incomeId = $("<td>").attr("id", "income-" + k);

            row.append(incomeId);

            if (Math.abs(income) > SharkGame.EPSILON) {
                const changeChar = income > 0 ? "+" : "";
                incomeId.html("<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautifyIncome(income) + "</span>");
            }
        }
        return row;
    },

    getResourceName(resourceName, darken, forceSingle, arbitraryAmount, background) {
        if (r.isCategory(resourceName)) {
            return SharkGame.ResourceCategories[resourceName].name;
        }
        const resource = SharkGame.ResourceMap.get(resourceName);
        const amount = arbitraryAmount ? arbitraryAmount : Math.floor(SharkGame.PlayerResources.get(resourceName).amount);
        let name = amount - 1 < SharkGame.EPSILON || forceSingle ? resource.singleName : resource.name;
        let extraStyle = "";

        if (SharkGame.Settings.current.boldCosts) {
            name = name.bold();
        }

        if (SharkGame.Settings.current.colorCosts) {
            let color = resource.color;
            if (darken) {
                color = SharkGame.colorLum(resource.color, -0.5);
            } else if (background) {
                // this code takes the HSV of the text and its background, if its color is provided,
                // and compares their Values. If they are less than 20 away, then they're too close
                // then calculate exactly how much it takes to get them up to 20 away
                // if the text's value is less, make it 20 below that of the background
                // if the text's value is more, make it 20 above that of the background
                const backValue = SharkGame.getColorValue(background);
                const colorValue = SharkGame.getColorValue(color);
                if (Math.abs(colorValue - backValue) < 20) {
                    if (colorValue > backValue) {
                        color = SharkGame.colorLum(color, (backValue + 20) / colorValue - 1);
                    } else {
                        color = SharkGame.colorLum(color, (backValue - 20) / colorValue - 1);
                    }
                }
            }
            extraStyle = " style='color:" + color + "'";
        }
        return "<span class='click-passthrough'" + extraStyle + ">" + name + "</span>";
    },

    // make a resource list object into a string describing its contents
    resourceListToString(resourceList, darken, backgroundcolor) {
        if ($.isEmptyObject(resourceList)) {
            return "";
        }
        let formattedResourceList = "";
        SharkGame.ResourceMap.forEach((v, key) => {
            const listResource = resourceList[key];
            // amend for unspecified resources (assume zero)
            if (listResource > 0 && w.doesResourceExist(key)) {
                const isSingular = Math.floor(listResource) - 1 < SharkGame.EPSILON;
                formattedResourceList += m.beautify(listResource);
                formattedResourceList += " " + r.getResourceName(key, darken, isSingular, listResource, backgroundcolor) + ", ";
            }
        });
        // snip off trailing suffix
        formattedResourceList = formattedResourceList.slice(0, -2);
        return formattedResourceList;
    },

    getResourceSources(resource) {
        const sources = { income: [], actions: [] };
        // go through all incomes
        SharkGame.ResourceMap.forEach((v, key) => {
            if (v.income) {
                const incomeForResource = v.income[resource];
                if (incomeForResource > 0) {
                    sources.income.push(key);
                }
            }
        });
        // go through all actions
        $.each(SharkGame.HomeActions.getActionList(), (homeActionName, homeAction) => {
            const resourceEffect = homeAction.effect.resource;
            if (resourceEffect) {
                if (resourceEffect[resource] > 0) {
                    sources.actions.push(homeActionName);
                }
            }
        });
        return sources;
    },

    buildIncomeNetwork(specifically) {
        // completes the network of resources whose incomes are affected by other resources
        // takes the order of the gia and reverses it to get the rgad.

        const gia = SharkGame.GeneratorIncomeAffectors;
        const rgad = SharkGame.GeneratorIncomeAffected;
        const rc = SharkGame.ResourceCategories;
        if (!specifically) {
            // recursively parse the gia
            $.each(gia, (resource) => {
                $.each(gia[resource], (type) => {
                    $.each(gia[resource][type], (generator, value) => {
                        // check for issues worth throwing over
                        if (SharkGame.ResourceMap.get(generator)) {
                            if (!SharkGame.ResourceMap.get(generator).income) {
                                throw new Error(
                                    "Issue building income network, generator has no income, not actually a generator! Try changing resource table generators."
                                );
                            }
                        }
                        // is it a category or a generator?
                        const nodes = r.isCategory(generator) ? rc[generator].resources : [generator];
                        // recursively reconstruct the table with the keys in the inverse order
                        $.each(nodes, (k, v) => {
                            r.addNetworkNode(rgad, v, type, resource, value);
                        });
                    });
                });
            });
        }
        // resources incomes below, generators above
        const ria = SharkGame.ResourceIncomeAffectors;
        const rad = SharkGame.ResourceIncomeAffected;
        if (!specifically) {
            // recursively parse the ria
            $.each(ria, (affectorResource) => {
                $.each(ria[affectorResource], (type) => {
                    $.each(ria[affectorResource][type], (affectedResource, degree) => {
                        // s: is it a category?
                        const nodes = r.isCategory(affectedResource) ? rc[affectedResource].resources : [affectedResource];

                        // recursively reconstruct the table with the keys in the inverse order
                        $.each(nodes, (k, v) => {
                            r.addNetworkNode(rad, v, type, affectorResource, degree);
                        });
                    });
                });
            });
        }
    },

    buildApplicableNetworks() {
        // this function builds two networks that contain all actually relevant relationships for a given world
        // this is meant to save on calculations when searching the network
        const apprgad = SharkGame.GeneratorIncomeAffectedApplicable;
        const apprad = SharkGame.ResourceIncomeAffectedApplicable;
        const rgad = SharkGame.GeneratorIncomeAffected;
        const rad = SharkGame.ResourceIncomeAffected;
        $.each(rgad, (generator) => {
            $.each(rgad[generator], (type) => {
                $.each(rgad[generator][type], (affector, degree) => {
                    if (w.worldResources.get(generator).exists && w.worldResources.get(affector).exists) {
                        r.addNetworkNode(apprgad, generator, type, affector, degree);
                    }
                });
            });
        });
        $.each(rad, (resource) => {
            $.each(rad[resource], (type) => {
                $.each(rad[resource][type], (affector, degree) => {
                    if (w.worldResources.get(resource).exists && w.worldResources.get(affector).exists) {
                        r.addNetworkNode(apprad, resource, type, affector, degree);
                    }
                });
            });
        });
    },

    clearNetworks() {
        SharkGame.GeneratorIncomeAffectedApplicable = {};
        SharkGame.ResourceIncomeAffectedApplicable = {};
    },

    addNetworkNode(network, main, effect, sub, degree) {
        if (!network[main]) {
            network[main] = {};
        }
        if (!network[main][effect]) {
            network[main][effect] = {};
        }
        network[main][effect][sub] = degree;
    },

    getPurchaseAmount(resource) {
        const buy = m.getBuyAmount();
        const owned = r.getResource(resource);

        if (buy > 0) {
            return buy;
        } else {
            return Math.floor(owned / -buy);
        }
    },

    testGracePeriod() {
        let grace = true;
        SharkGame.PlayerIncomeTable.forEach((v, key) => {
            if (!r.isInCategory(key, "harmful")) {
                if (v !== 0) {
                    grace = false;
                }
            }
        });
        return grace;
    },

    // TESTING FUNCTIONS
    giveMeSomeOfEverything(amount) {
        SharkGame.ResourceMap.forEach((v, key) => {
            r.changeResource(key, amount);
        });
    },

    // this was going to be used to randomise what resources were available but it needs better work to point out what is REQUIRED and what is OPTIONAL
    // create all chains that terminate only at a cost-free action to determine how to get to a resource
    // will return a weird vaguely tree structure of nested arrays (ughhh I need to learn how to OOP in javascript at some point, what a hack)
    getResourceDependencyChains(resource, alreadyKnownList) {
        const dependencies = [];
        if (!alreadyKnownList) {
            alreadyKnownList = []; // tracks resources we've already seen, an effort to combat cyclic dependencies
        }

        const sources = r.getResourceSources(resource);
        // get resource costs for actions that directly get this
        // only care about the resource types required
        $.each(sources.actions, (_key, action) => {
            const actionCost = SharkGame.HomeActions.getActionList()[action].cost;
            $.each(actionCost, (k, costProp) => {
                const costResource = costProp.resource;
                if (w.doesResourceExist(costResource)) {
                    dependencies.push(costResource);
                    alreadyKnownList.push(costResource);
                }
            });
        });

        // get dependencies for income resources
        $.each(sources.income, (_, v) => {
            if (w.doesResourceExist(v)) {
                if (alreadyKnownList.indexOf(v) === -1) {
                    dependencies.push(r.getResourceDependencyChains(v, alreadyKnownList));
                }
            }
        });
        return dependencies;
    },
};
