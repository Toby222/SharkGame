"use strict";
SharkGame.Lab = {
    tabId: "lab",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Laboratory",
    tabBg: "img/bg/bg-lab.png",

    sceneImage: "img/events/misc/scene-lab.png",
    sceneDoneImage: "img/events/misc/scene-lab-done.png",

    discoverReq: { resource: { science: 10 } },

    listEmpty: true,

    message: "Sort of just off to the side, the science sharks congregate and discuss things with words you've never heard before.",
    messageDone:
        "Sort of just off to the side, the science sharks quietly wrap up their badly disguised party and pretend to work.<br/>" +
        "Looks like that's it! No more things to figure out.",

    init() {
        const lab = SharkGame.Lab;
        SharkGame.TabHandler.registerTab(this);
        // add default purchased state to each upgrade
        lab.resetUpgrades();
    },

    setup() {
        /* doesnt need to do anything */
    },

    resetUpgrades() {
        SharkGame.Upgrades.purchased.splice(0);

        const upgradeObject = {};
        $.each(SharkGame.ModifierTypes.upgrade, (type, modifiers) => {
            upgradeObject[type] = {};
            $.each(modifiers, (modifierName, object) => {
                // additionally set values for the types and categories of stuff
                object.category = "upgrade";
                object.type = type;
                upgradeObject[type][modifierName] = object.defaultValue;
            });
        });

        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            SharkGame.ModifierMap.get(resourceId).upgrade = _.cloneDeep(upgradeObject);
        });
    },

    switchTo() {
        const lab = SharkGame.Lab;
        const content = $("#content");
        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();

        const tabMessageSel = $("<div>").attr("id", "tabMessage");
        content.append(tabMessageSel);
        lab.updateMessage(true);

        const buttonListContainer = $("<div>").attr("id", "buttonLeftContainer");
        buttonListContainer.append($("<div>").attr("id", "buttonList").addClass("lab").append($("<h3>").html("Available Upgrades")));
        content.append(buttonListContainer);
        content.append($("<div>").attr("id", "upgradeList"));
        content.append($("<div>").addClass("clear-fix"));

        lab.updateUpgradeList();
        lab.update();
        lab.setHint(upgradeTable);

        /* FIXME Make purchasable upgrades sticky if shorter than than window height
            Css sticky does not work as #content has overflow: hidden because
            of the float layout. Solution is either to find a hack, rewrite sticky with js,
            or rework layout into flex.
        */
    },

    setHint(upgradeTable, isNotStart) {
        const lab = SharkGame.Lab;
        if (lab.allResearchDone()) {
            $("#buttonList").append($("<p>").html("The scientists rest content, sure that they're done with their work."));
            if (isNotStart) lab.updateMessage();
        } else if (lab.listEmpty) {
            $("#buttonList").append($("<p>").html("The scientists are out of ideas, but there are always more discoveries to be made."));

            const hintedUpgrade = _.find(
                upgradeTable,
                (upgrade, upgradeId) =>
                    lab.isUpgradePossible(upgradeId) &&
                    !lab.isUpgradeVisible(upgradeId) &&
                    _.has(upgrade, "required.upgrades") &&
                    _.every(upgrade.required.upgrades, (requiredUpgradeId) => SharkGame.Upgrades.purchased.includes(requiredUpgradeId))
            );

            if (hintedUpgrade === undefined) return;
            let hintResource;
            if (_.has(hintedUpgrade, "required.seen"))
                hintResource = _.find(hintedUpgrade.required.seen, (resource) => world.doesResourceExist(resource));
            if (hintResource) {
                $("#buttonList").append(
                    $("<p>").html("You get the feeling that " + sharktext.getResourceName(hintResource, false, 2) + " may be the key.")
                );
            } else {
                log.addError(`There is a possible, undiscovered upgrade (${hintedUpgrade}), but no valid hint resource.`);
            }
        }
    },

    update() {
        const lab = SharkGame.Lab;

        // cache a selector
        const buttonList = $("#buttonList");

        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        lab.listEmpty = true;

        // for each upgrade not yet bought
        $.each(upgradeTable, (upgradeId, upgrade) => {
            if (SharkGame.Upgrades.purchased.includes(upgradeId)) {
                return; // skip this upgrade altogether
            }

            // check if a button exists
            const button = $("#" + upgradeId);
            if (button.length > 0) {
                lab.listEmpty = false;
                // button exists
                lab.updateLabButton(upgradeId);
            } else {
                // add it if prequisite upgrades have been completed
                let prereqsMet = true; // assume true until proven false

                // check upgrade prerequisites
                if (upgrade.required) {
                    // check previous upgrades
                    if (upgrade.required.upgrades) {
                        prereqsMet = prereqsMet && this.areRequiredUpgradePrereqsPurchased(upgradeId);
                    }
                    // validate if upgrade is possible
                    prereqsMet = prereqsMet && lab.isUpgradePossible(upgradeId) && lab.isUpgradeVisible(upgradeId);
                }
                if (prereqsMet) {
                    lab.listEmpty = false;

                    // add button
                    const effects = SharkGame.Lab.getResearchEffects(upgrade);
                    const buttonSelector = SharkGame.Button.makeButton(
                        upgradeId,
                        upgrade.name + "<br/>" + upgrade.desc + "<br/>" + effects,
                        buttonList,
                        lab.onLabButton
                    );
                    lab.updateLabButton(upgradeId);
                    if (SharkGame.Settings.current.showAnimations) {
                        buttonSelector
                            .hide()
                            .css("opacity", 0)
                            .slideDown(50)
                            .animate(
                                { opacity: 1.0 },
                                {
                                    duration: 50,
                                    done: (anim) => (anim.elem.style = null),
                                }
                            );
                    }
                }
            }
        });
    },

    areRequiredUpgradePrereqsPurchased(upgradeId) {
        const upgradeData = SharkGame.Upgrades.getUpgradeData(SharkGame.Upgrades.getUpgradeTable(), upgradeId);

        if (upgradeData.required) {
            return _.every(upgradeData.required.upgrades, (requiredUpgradeId) => SharkGame.Upgrades.purchased.includes(requiredUpgradeId));
        }
        return true;
    },

    updateLabButton(upgradeName) {
        const button = $("#" + upgradeName);
        const upgradeData = SharkGame.Upgrades.getUpgradeData(SharkGame.Upgrades.getUpgradeTable(), upgradeName);
        const upgradeCost = upgradeData.cost;

        let enableButton;
        if ($.isEmptyObject(upgradeCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = res.checkResources(upgradeCost);
        }

        const effects = SharkGame.Lab.getResearchEffects(upgradeData, !enableButton);
        let label = upgradeData.name + "<br/>" + upgradeData.desc + "<br/>" + effects;
        const costText = sharktext.resourceListToString(upgradeCost, !enableButton);
        if (costText !== "") {
            label += "<br/>Cost: " + costText;
        }
        if (enableButton) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }

        const newButton = $(document.createElement("button"));
        newButton.html(label);

        const spritename = "technologies/" + upgradeName;
        if (SharkGame.Settings.current.showIcons) {
            const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-technology");
            if (iconDiv) {
                iconDiv.addClass("button-icon");
                newButton.prepend(iconDiv);
            }
        }

        if (button.html() !== newButton.html()) {
            button.html(newButton.html());
        }
    },

    updateMessage(suppressAnimation) {
        const lab = SharkGame.Lab;
        const allResearchDone = lab.allResearchDone();
        let message = allResearchDone ? lab.messageDone : lab.message;
        const imgSrc = allResearchDone ? lab.sceneDoneImage : lab.sceneImage;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = `<img width=400 height=200 src='${imgSrc}' id='tabSceneImage'>${message}`;
            tabMessageSel.css(`background-image", "url('${lab.tabBg}')`);
        }

        if (!suppressAnimation && SharkGame.Settings.current.showAnimations) {
            tabMessageSel.animate({ opacity: 0 }, 200, () => {
                $(tabMessageSel).animate({ opacity: 1 }, 200).html(message);
            });
        } else {
            tabMessageSel.html(message);
        }
    },

    onLabButton(upgradeId) {
        if ($(this).hasClass("disabled")) return;

        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        let upgrade;

        if (typeof upgradeId === `object`) {
            if ($(this).hasClass("disabled")) return;

            upgradeId = $(this).attr("id");
            upgrade = SharkGame.Upgrades.getUpgradeData(upgradeTable, upgradeId);
            if (SharkGame.Upgrades.purchased.includes(upgradeId)) {
                $(this).remove();
                return; // something went wrong don't even pay attention to this function
            }

            if (res.checkResources(upgrade.cost)) {
                // kill button
                $(this).remove();
                // take resources
                res.changeManyResources(upgrade.cost, true);
                // purchase upgrade
                SharkGame.Lab.addUpgrade(upgradeId);

                if (upgrade.researchedMessage) {
                    log.addMessage(upgrade.researchedMessage);
                }
            }
            SharkGame.Lab.update();
            SharkGame.Lab.setHint(upgradeTable);
        } else if (!_.isUndefined(upgradeId)) {
            upgrade = SharkGame.Upgrades.getUpgradeData(upgradeTable, upgradeId);
            if (SharkGame.Upgrades.purchased.includes(upgradeId)) {
                return; // something went wrong don't even pay attention to this function
            }

            if (res.checkResources(upgrade.cost)) {
                // take resources
                res.changeManyResources(upgrade.cost, true);
                // purchase upgrade
                SharkGame.Lab.addUpgrade(upgradeId);

                if (upgrade.researchedMessage) {
                    log.addMessage(upgrade.researchedMessage);
                }
            }

            if (SharkGame.Tabs.current === "lab") {
                $(`#${upgradeId}`).remove();
                SharkGame.Lab.update();
                SharkGame.Lab.setHint(upgradeTable);
            }
        }
        SharkGame.Lab.update();
        SharkGame.Lab.setHint(upgradeTable, true);
    },

    addUpgrade(upgradeId) {
        const upgrade = SharkGame.Upgrades.getUpgradeData(SharkGame.Upgrades.getUpgradeTable(), upgradeId);
        if (upgrade && !SharkGame.Upgrades.purchased.includes(upgradeId)) {
            SharkGame.Upgrades.purchased.push(upgradeId);
            //l.updateResearchList();
            SharkGame.Gate.checkUpgradeRequirements(upgradeId);

            // if the upgrade has effects, do them
            if (upgrade.effect) {
                $.each(upgrade.effect, (effectType, effects) => {
                    $.each(effects, (affectedResource, degree) => {
                        res.applyModifier(effectType, affectedResource, degree);
                    });
                });
            }

            // if the upgrade is tied to events, trigger them
            if (upgrade.events) {
                _.each(upgrade.events, (eventName) => {
                    SharkGame.Events[eventName].trigger();
                });
            }

            // Add upgrade to DOM
            const list = $("#upgradeList > ul");
            const upgradeElt = $("<li>").html(`${upgrade.name}<br/><span class='medDesc'>${upgrade.effectDesc}</span>`);
            const showAnims = SharkGame.Settings.current.showAnimations;
            if (showAnims) {
                upgradeElt.hide().css("opacity", 0).prependTo(list).slideDown(50).animate({ opacity: 1.0 }, 100);
            } else {
                upgradeElt.prependTo(list);
            }

            console.debug(`Added upgrade ${upgrade.name} at: ${sharktext.formatTime(_.now() - SharkGame.timestampRunStart)}`);
            res.updateResourcesTable();
        }
    },

    allResearchDone() {
        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        const lab = SharkGame.Lab;
        let allDone = true;
        $.each(upgradeTable, (upgradeId) => {
            if (lab.isUpgradePossible(upgradeId)) {
                allDone = allDone && SharkGame.Upgrades.purchased.includes(upgradeId) && lab.isUpgradeVisible(upgradeId);
            }
        });
        return allDone;
    },

    findAllAffordableUpgrades() {
        const which = [];
        const table = SharkGame.Upgrades.getUpgradeTable();
        $.each(table, (upgradeName) => {
            if (!this.isUpgradePossible(upgradeName) || !this.isUpgradeVisible(upgradeName) || SharkGame.Upgrades.purchased.includes(upgradeName)) {
                return true;
            }

            if (
                res.checkResources(SharkGame.Upgrades.getUpgradeData(table, upgradeName).cost) &&
                this.areRequiredUpgradePrereqsPurchased(upgradeName)
            ) {
                which.push(upgradeName);
            }
        });
        return which;
    },

    isUpgradePossible(upgradeName) {
        const lab = SharkGame.Lab;
        const upgradeData = SharkGame.Upgrades.getUpgradeData(SharkGame.Upgrades.getUpgradeTable(), upgradeName);
        let isPossible = true;

        if (!upgradeData) {
            return false;
        }

        if (upgradeData.required) {
            if (upgradeData.required.resources) {
                // check if any related resources exist in the world for this to make sense
                // unlike the costs where all resources in the cost must exist, this is an either/or scenario
                let relatedResourcesExist = false;
                _.each(upgradeData.required.resources, (resourceId) => {
                    relatedResourcesExist = relatedResourcesExist || world.doesResourceExist(resourceId);
                });
                isPossible = isPossible && relatedResourcesExist;
            }

            // (recursive) check requisite techs
            isPossible = isPossible && _.every(upgradeData.required.upgrades, (upgrade) => lab.isUpgradePossible(upgrade));

            isPossible =
                isPossible &&
                _.every(upgradeData.required.totals, (requiredTotal, resourceName) => res.getTotalResource(resourceName) >= requiredTotal);

            // check resource cost
            isPossible = isPossible && _.every(upgradeData.cost, (_amount, resource) => world.doesResourceExist(resource));
        }

        return isPossible;
    },

    isUpgradeVisible(upgradeId) {
        const upgrade = SharkGame.Upgrades.getUpgradeData(SharkGame.Upgrades.getUpgradeTable(), upgradeId);
        if (_.has(upgrade, "required.seen")) {
            // Checks if any of the required resources has been seen
            // change to _.every to make it require all to have been seen
            return _.some(upgrade.required.seen, (requiredSeen) => res.getTotalResource(requiredSeen) > 0);
        }
        return true;
    },

    getResearchEffects(upgrade, _darken) {
        const effects = [];
        $.each(upgrade.effect, (effectType, effectsList) => {
            $.each(effectsList, (resource, degree) => {
                const effectText = SharkGame.ModifierReference.get(effectType).effectDescription(degree, resource);
                if (world.doesResourceExist(resource) && effectText !== "") {
                    effects.push(effectText);
                }
            });
        });
        return "<span class='medDesc' class='click-passthrough'>(Effects: " + (effects.length > 0 ? effects.join(", ") : "???") + ")</span>";
    },

    updateUpgradeList() {
        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        const upgradeList = $("#upgradeList");
        upgradeList.empty();
        upgradeList.append($("<h3>").html("Researched Upgrades"));
        const list = $("<ul>");

        // reverse object keys
        const upgrades = [];
        $.each(upgradeTable, (upgradeId) => {
            if (SharkGame.Upgrades.purchased.includes(upgradeId)) {
                upgrades.unshift(upgradeId);
            }
        });

        for (const upgradeId of upgrades) {
            const upgrade = SharkGame.Upgrades.getUpgradeData(upgradeTable, upgradeId);
            list.append($("<li>").html(`${upgrade.name}<br/><span class='medDesc'>${upgrade.effectDesc}</span>`));
        }
        upgradeList.append(list);
    },
};
