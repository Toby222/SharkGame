SharkGame.Recycler = {
    tabId: "recycler",
    tabDiscovered: false,
    tabName: "Recycler",
    tabBg: "img/bg/bg-recycler.png",

    sceneImage: "img/events/misc/scene-recycler.png",

    discoverReq: {
        upgrade: ["recyclerDiscovery"],
    },

    message:
        "The recycler allows for the repurposing of any and all of your unwanted materials.<br/><span class='medDesc'>Feed the machines. Feed them.</span>",

    recyclerInputMessages: [
        "The machines grind and churn.",
        "Screech clunk chomp munch erp.",
        "Clunk clunk clunk screeeeech.",
        "The recycler hungrily devours the stuff you offer.",
        "The offerings are no more.",
        "Viscous, oily mess sloshes within the machine.",
        "The recycler reprocesses.",
    ],

    recyclerOutputMessages: [
        "A brand new whatever!",
        "The recycler regurgitates your demand, immaculately formed.",
        "How does a weird blackish gel become THAT?",
        "Some more stuff to use! Maybe even to recycle!",
        "Gifts from the machine! Gifts that may have cost a terrible price!",
        "How considerate of this unfeeling, giant apparatus! It provides you stuff at inflated prices!",
    ],

    allowedCategories: {
        machines: "linear",
        stuff: "constant",
        processed: "constant",
        animals: "constant",
    },

    bannedResources: ["essence", "junk", "science", "seaApple", "coalescer", "ancientPart", "filter"],

    efficiency: "NA",
    hoveredResource: "NA",
    expectedOutput: "NA",
    expectedJunkSpent: "NA",

    init() {
        // register tab
        SharkGame.Tabs[y.tabId] = {
            id: y.tabId,
            name: y.tabName,
            discovered: y.tabDiscovered,
            discoverReq: y.discoverReq,
            code: y,
        };
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        const container = $("<div>").attr("id", "recyclerContainer");
        container.append($("<div>").attr("id", "inputButtons"));
        container.append($("<div>").attr("id", "junkDisplay"));
        container.append($("<div>").attr("id", "outputButtons"));
        content.append(container);
        content.append($("<div>").addClass("clear-fix"));
        let message = y.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + y.sceneImage + "' id='tabSceneImageRed'>" + message;
            tabMessageSel.css("background-image", "url('" + y.tabBg + "')");
        }
        tabMessageSel.html(message);

        m.createBuyButtons("eat");
        y.createButtons();
    },

    update() {
        y.updateExpectedOutput();
        y.updateExpectedJunkSpent();
        y.updateJunkDisplay();
        y.updateButtons();
    },

    updateJunkDisplay() {
        const junkAmount = r.getResource("junk");
        const junkDisplay = $("#junkDisplay");

        let junkString = "";
        if (y.expectedOutput !== "NA") {
            junkString = "<span class='click-passthrough' style='color:#FFE436'>" + m.beautify(junkAmount + y.expectedOutput) + "</span> ";
        } else if (y.expectedJunkSpent !== "NA") {
            junkString = "<span class='click-passthrough' style='color:#FFE436'>" + m.beautify(junkAmount - y.expectedJunkSpent) + "</span> ";
        } else {
            junkString = m.beautify(junkAmount);
        }

        const newValue = "CONTAINS:<br/>" + junkString.bold() + " RESIDUE<br/><br/>" + y.getRecyclerEfficiencyString() + y.getTarString().bold();
        const oldValue = junkDisplay.html();

        // Fix up beautified strings to match jquery returns for matching purposes.
        if (oldValue !== newValue.replace(/'/g, '"').replace(/<br\/>/g, "<br>")) {
            junkDisplay.html(newValue);
        }
    },

    updateButtons() {
        SharkGame.ResourceMap.forEach((v, k) => {
            if (r.getTotalResource(k) > 0) {
                const inputButton = $("#input-" + k);
                // If this is a resource that's not in the recycler, skip it entirely.
                if (inputButton.length === 0) {
                    return true;
                }
                const outputButton = $("#output-" + k);
                const resourceAmount = r.getResource(k);

                // determine amounts for input and what would be retrieved from output
                const buy = m.getBuyAmount();
                const forceSingular = buy === 1;
                let inputAmount = buy;
                let outputAmount = buy;
                const maxOutputAmount = y.getMaxToBuy(k);
                if (buy < 0) {
                    const divisor = Math.floor(buy) * -1;
                    inputAmount = Math.floor(resourceAmount / divisor);
                    outputAmount = Math.floor(maxOutputAmount / divisor);
                }

                // update input button
                let disableButton = resourceAmount < inputAmount || inputAmount <= 0;
                let label = "Recycle ";
                if (inputAmount > 0) {
                    if (y.expectedJunkSpent !== "NA" && !disableButton && k === y.hoveredResource) {
                        if (buy < 0) {
                            label +=
                                "<span class='click-passthrough' style='color:#FFDE0A'>" + m.beautify(inputAmount + outputAmount / -buy) + "</span> ";
                        } else {
                            label += "<span class='click-passthrough' style='color:#FFDE0A'>" + m.beautify(inputAmount) + "</span> ";
                        }
                    } else {
                        label += m.beautify(inputAmount) + " ";
                    }
                }

                if (disableButton) {
                    inputButton.addClass("disabled");
                } else {
                    inputButton.removeClass("disabled");
                }

                label += r.getResourceName(k, disableButton, forceSingular, false, SharkGame.getElementColor("input-" + k, "background-color"));
                if (inputButton.html() !== label.replace(/'/g, '"')) {
                    inputButton.html(label);
                }

                // update output button
                disableButton = maxOutputAmount < outputAmount || outputAmount <= 0;
                label = "Convert to ";
                if (outputAmount > 0) {
                    if (y.expectedOutput !== "NA" && !disableButton) {
                        label += "<span class='click-passthrough' style='color:#FFDE0A'>" + m.beautify(outputAmount) + "</span> ";
                    } else {
                        label += m.beautify(outputAmount) + " ";
                    }
                }

                if (disableButton) {
                    outputButton.addClass("disabled");
                } else {
                    outputButton.removeClass("disabled");
                }

                label += r.getResourceName(k, disableButton, forceSingular, false, SharkGame.getElementColor("output-" + k, "background-color"));
                if (outputButton.html() !== label.replace(/'/g, '"')) {
                    outputButton.html(label);
                }
            }
        });
    },

    createButtons() {
        const inputButtonDiv = $("#inputButtons");
        const outputButtonDiv = $("#outputButtons");
        SharkGame.ResourceMap.forEach((v, k) => {
            if (r.getTotalResource(k) > 0 && y.allowedCategories[r.getCategoryOfResource(k)] && y.bannedResources.indexOf(k) === -1) {
                SharkGame.Button.makeHoverscriptButton(
                    "input-" + k,
                    "Recycle " + r.getResourceName(k),
                    inputButtonDiv,
                    y.onInput,
                    y.onInputHover,
                    y.onInputUnhover
                );
                SharkGame.Button.makeHoverscriptButton(
                    "output-" + k,
                    "Convert to " + r.getResourceName(k),
                    outputButtonDiv,
                    y.onOutput,
                    y.onOutputHover,
                    y.onOutputUnhover
                );
            }
        });
    },

    onInput() {
        const l = SharkGame.Log;
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const resourceName = button.attr("id").split("-")[1];
        const resourceAmount = r.getResource(resourceName);
        const junkPerResource = SharkGame.ResourceMap.get(resourceName).value;
        const amount = r.getPurchaseAmount(resourceName);

        if (resourceAmount >= amount) {
            r.changeResource("junk", amount * junkPerResource * y.getEfficiency());
            r.changeResource(resourceName, -amount);
            r.changeResource("tar", Math.max(amount * junkPerResource * 0.0000002 + r.getProductAmountFromGeneratorResource("filter", "tar"), 0));
            l.addMessage(SharkGame.choose(y.recyclerInputMessages));
        } else {
            l.addError("Not enough resources for that transaction. This might be caused by putting in way too many resources at once.");
        }

        y.updateEfficiency(resourceName);

        // disable button until next frame
        button.addClass("disabled");
    },

    onOutput() {
        const l = SharkGame.Log;
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const resourceName = button.attr("id").split("-")[1];
        const junkAmount = r.getResource("junk");
        const junkPerResource = SharkGame.ResourceMap.get(resourceName).value;

        if (y.expectedOutput !== "NA") {
            return;
        }

        const selectedAmount = m.getBuyAmount();
        let amount = selectedAmount;
        if (selectedAmount < 0) {
            const divisor = Math.floor(selectedAmount) * -1;
            amount = y.getMaxToBuy(resourceName) / divisor;
        }

        const currentResourceAmount = r.getResource(resourceName);
        let junkNeeded;

        const costFunction = y.allowedCategories[r.getCategoryOfResource(resourceName)];
        if (costFunction === "linear") {
            junkNeeded = SharkGame.MathUtil.linearCost(currentResourceAmount, currentResourceAmount + amount, junkPerResource);
        } else if (costFunction === "constant") {
            junkNeeded = SharkGame.MathUtil.constantCost(currentResourceAmount, currentResourceAmount + amount, junkPerResource);
        }

        if (junkAmount >= junkNeeded) {
            r.changeResource(resourceName, amount);
            r.changeResource("junk", -junkNeeded);
            l.addMessage(SharkGame.choose(y.recyclerOutputMessages));
        } else {
            l.addMessage("You don't have enough for that!");
        }

        // disable button until next frame
        button.addClass("disabled");
    },

    getMaxToBuy(resource) {
        const resourceAmount = r.getResource(resource);
        const junkPricePerResource = SharkGame.ResourceMap.get(resource).value;
        const category = r.getCategoryOfResource(resource);
        let junkAmount = r.getResource("junk");
        if (y.expectedOutput !== "NA") {
            junkAmount += y.expectedOutput;
        }

        let max = 0;
        if (y.allowedCategories[category]) {
            const costFunction = y.allowedCategories[category];
            if (costFunction === "linear") {
                max = SharkGame.MathUtil.linearMax(resourceAmount, junkAmount, junkPricePerResource) - resourceAmount;
            } else if (costFunction === "constant") {
                max = SharkGame.MathUtil.constantMax(resourceAmount, junkAmount, junkPricePerResource) - resourceAmount;
            }
        }
        return Math.floor(max);
    },

    onInputHover() {
        const button = $(this);
        const resource = button.attr("id").split("-")[1];

        if (button.is(".disabled")) {
            return;
        }

        y.hoveredResource = resource;
        y.updateEfficiency(resource);
        y.updateExpectedOutput();
    },

    onInputUnhover() {
        y.efficiency = "NA";
        y.hoveredResource = "NA";
        y.expectedOutput = "NA";
    },

    onOutputHover() {
        const button = $(this);
        const resource = button.attr("id").split("-")[1];

        if (button.is(".disabled")) {
            return;
        }

        y.efficiency = "NA";
        y.hoveredResource = resource;
        y.updateExpectedJunkSpent();
    },

    onOutputUnhover() {
        y.hoveredResource = "NA";
        y.expectedJunkSpent = "NA";
    },

    getTarString() {
        const buy = m.getBuyAmount();

        if (w.worldType === "abandoned") {
            if (y.efficiency === "NA") {
                return "<br/><br/><br/><br/>";
            }

            const tarTolerance = -r.getProductAmountFromGeneratorResource("filter", "tar");
            let produced = SharkGame.ResourceMap.get(y.hoveredResource).value * 0.0000002;
            if (buy > 0) {
                produced *= buy;
            } else {
                produced *= r.getResource(y.hoveredResource) / -buy;
            }
            let amountstring = m.beautify(produced);
            amountstring = "<br/><br/>AND " + amountstring.bold() + " " + r.getResourceName("tar");
            if (tarTolerance > 0) {
                amountstring +=
                    "<br/>(" +
                    m.beautify(Math.max(produced - tarTolerance, 0)) +
                    " " +
                    r.getResourceName("tar") +
                    " WITH<br/>" +
                    r.getResourceName("filter", false, false, 2) +
                    ")";
            }
            return amountstring;
        }
        return "";
    },

    getRecyclerEfficiencyString() {
        if (y.efficiency === "NA" || y.hoveredResource === "NA") {
            return "<br/><br/><br/><br/><br/><br/>";
        }

        let amountstring = "";
        if (m.getBuyAmount() > 0) {
            amountstring = m.beautify(y.efficiency * m.getBuyAmount());
        } else {
            amountstring = m.beautify((y.efficiency * r.getResource(y.hoveredResource)) / -m.getBuyAmount());
        }

        return (
            (y.getEfficiency() * 100).toFixed(2).toString().bold() +
            "<b>%<br/>EFFICIENCY</b><br/><br/>EQUIVALENT TO:<br/>" +
            amountstring.bold() +
            " " +
            r.getResourceName(y.hoveredResource).bold() +
            "<br/>WORTH OF RESIDUE"
        );
    },

    updateExpectedOutput() {
        const resource = y.hoveredResource;
        if (resource === "NA" || y.expectedJunkSpent !== "NA") {
            y.expectedOutput = "NA";
            return;
        }
        const amount = r.getResource(resource);
        const buy = m.getBuyAmount();

        if (buy > 0) {
            y.expectedOutput = buy * y.getEfficiency() * SharkGame.ResourceMap.get(resource).value;
        } else {
            y.expectedOutput = (amount * y.getEfficiency() * SharkGame.ResourceMap.get(resource).value) / -buy;
        }
    },

    updateExpectedJunkSpent() {
        const resource = y.hoveredResource;
        if (resource === "NA" || y.expectedOutput !== "NA") {
            y.expectedJunkSpent = "NA";
            return;
        }
        const junkAmount = r.getResource("junk");
        const buy = m.getBuyAmount();

        if (buy > 0) {
            y.expectedJunkSpent = buy * SharkGame.ResourceMap.get(resource).value;
        } else {
            y.expectedJunkSpent = junkAmount / -buy;
        }
    },

    getEfficiency() {
        if (y.efficiency === "NA") {
            return 1;
        }
        y.updateEfficiency(y.hoveredResource);
        return y.efficiency.toFixed(4);
    },

    updateEfficiency(resource) {
        let evalue = 5;
        let baseEfficiency = 0.5;

        if (SharkGame.Upgrades.getUpgradeTable().superprocessing) {
            if (SharkGame.Upgrades.getUpgradeTable().superprocessing.purchased) {
                evalue = 8;
                baseEfficiency = 1;
            }
        }

        const n = r.getPurchaseAmount(resource);
        // check if the amount to eat is less than the threshold, currently 100K
        if (n <= Math.pow(10, evalue)) {
            y.efficiency = baseEfficiency;
        } else {
            y.efficiency = 1 / (Math.log10(n) - evalue + Math.round(1 / baseEfficiency));
            //otherwise, scale back based purely on the number to process
            // 'cheating' by lowering the value of n is ok if the player wants to put in a ton of effort
            // the system is more sensible, and people can get a feel for it easier if i make this change
            // the amount that this effects things isn't crazy high either, so
        }
    },
};
