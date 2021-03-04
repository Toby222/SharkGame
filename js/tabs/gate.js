SharkGame.Gate = {
    tabId: "gate",
    tabDiscovered: false,
    tabName: "Strange Gate",
    tabBg: "img/bg/bg-gate.png",

    discoverReq: {
        upgrade: ["gateDiscovery", "farAbandonedExploration"],
    },

    message: "A foreboding circular structure, closed shut.<br/>There are many slots, and a sign you know to mean 'insert items here'.",
    messageOneSlot: "A foreboding circular structure, closed shut.<br/>One slot remains.",
    messageOpened: "A foreboding circular structure, wide open.<br/>The water glows and shimmers within it. A gentle tug pulls at you.",
    messagePaid: "The slot accepts your donation and ceases to be.",
    messageCantPay: "The slot spits everything back out. You get the sense it wants more at once.",
    messagePaidNotOpen: "Every slot is filled, but the structure doesn't open.<br/>Perhaps it needs something else.",
    messageAllPaid: "The last slot closes. The structure opens. The water glows and shimmers within it.<br/>A gentle tug pulls at you.",
    messageEnter: "You swim through the gate...",

    sceneClosedImage: "img/events/misc/scene-gate-closed.png",
    sceneAlmostOpenImage: "img/events/misc/scene-gate-one-slot.png",
    sceneOpenImage: "img/events/misc/scene-gate-open.png",
    sceneClosedButFilledImage: "img/events/misc/scene-gate-closed-but-filled.png",

    requirements: {},
    completedRequirements: {},

    init() {
        const gt = SharkGame.Gate;
        // register tab
        SharkGame.Tabs[gt.tabId] = {
            id: gt.tabId,
            name: gt.tabName,
            discovered: gt.tabDiscovered,
            discoverReq: gt.discoverReq,
            code: gt,
        };
        gt.opened = false;
    },

    createSlots(gateRequirements, planetLevel, gateCostMultiplier) {
        const gt = SharkGame.Gate;
        gt.requirements = {};
        gt.completedRequirements = {};

        if (gateRequirements.slots) {
            gt.requirements.slots = {};
            // create costs
            $.each(gateRequirements.slots, (k, v) => {
                gt.requirements.slots[k] = Math.floor(v * planetLevel * gateCostMultiplier);
            });

            gt.completedRequirements.slots = {};
            // create costsMet
            $.each(gt.requirements.slots, (k, v) => {
                gt.completedRequirements.slots[k] = false;
            });
        }

        if (gateRequirements.upgrades) {
            gt.requirements.upgrades = {};
            $.each(gateRequirements.upgrades, (k, v) => {
                gt.requirements.upgrades[v] = "placeholder";
            });

            gt.completedRequirements.upgrades = {};
            $.each(gt.requirements.upgrades, (k, v) => {
                gt.completedRequirements.upgrades[k] = false;
            });
        }
    },

    switchTo() {
        const gt = SharkGame.Gate;
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "buttonList"));

        let amountOfSlots = 0;
        if (!gt.shouldBeOpen()) {
            if (SharkGame.WorldTypes[w.worldType].gateRequirements.slots) {
                const buttonList = $("#buttonList");
                $.each(gt.requirements.slots, (k, v) => {
                    if (!gt.completedRequirements.slots[k]) {
                        const resourceName = r.getResourceName(k, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color"));
                        SharkGame.Button.makeHoverscriptButton(
                            "gateCost-" + k,
                            "Insert " + m.beautify(v) + " " + resourceName + " into " + resourceName + " slot",
                            buttonList,
                            gt.onGateButton,
                            gt.onHover,
                            gt.onUnhover
                        );
                        amountOfSlots++;
                    }
                });
            }
        } else {
            SharkGame.Button.makeButton("gateEnter", "Enter gate", $("#buttonList"), gt.onEnterButton);
        }

        let message = gt.getMessage();
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + gt.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + gt.tabBg + "')");
        }
        tabMessageSel.html(message);
    },

    getMessage() {
        const gt = SharkGame.Gate;
        if (gt.shouldBeOpen()) {
            return gt.messageOpened;
        }

        const slotsLeft = gt.getSlotsLeft();
        const upgradesLeft = gt.getUpgradesLeft();

        // this intentionally checks for !== false because if it is specifically false, then getSlotsLeft() found that this world has no slots
        if (slotsLeft !== false) {
            if (slotsLeft > 1) {
                return gt.message;
            } else if (slotsLeft === 1) {
                return gt.messageOneSlot;
            }
            // if we get here then slotsLeft somehow took on a value other than a positive integer or false
            // in this situation simply assume slotsLeft === 0 and continue with execution
        }

        // if there are no slots then see if there are any upgrades needed
        if (upgradesLeft !== false) {
            return gt.messagePaidNotOpen;
        }

        // if there are no upgrades needed, then that implies that there are no gate requirements
        // send an error to the log and return a debug message
        SharkGame.Log.addError("No gate requirements found.");
        return "This is a failsafe message. Something has gone wrong internally.";
    },

    getSlotsLeft() {
        const gt = SharkGame.Gate;
        let slots = 0;
        // counts up the number of slots which are *not* filled
        $.each(gt.completedRequirements.slots, (k, v) => {
            slots += v ? 0 : 1;
        });

        // if there are any slots in the first place, return the number of slots unfilled
        // if there are not any slots, return false to identify this fact
        return _.size(gt.requirements.slots) !== 0 ? slots : false;
    },

    getUpgradesLeft() {
        const gt = SharkGame.Gate;
        let upgrades = 0;
        // counts up the number of required upgrades which are *not* purchased
        $.each(gt.completedRequirements.upgrades, (k, v) => {
            upgrades += v ? 0 : 1;
        });

        // if there are any required upgrades in the first place, return the number of still required upgrades
        // if there are not any required upgrades, return false to identify this fact
        return _.size(gt.requirements.upgrades) !== 0 ? upgrades : false;
    },

    onHover() {
        const gt = SharkGame.Gate;
        const button = $(this);
        const resourceName = button.attr("id").split("-")[1];
        const amount = r.getResource(resourceName);
        const required = gt.requirements.slots[resourceName];
        if (amount < required) {
            button.html(
                `Need <span class='click-passthrough' style='color:#FFDE0A'>${m.beautify(required - amount)}</span> more ${r.getResourceName(
                    resourceName,
                    false,
                    false,
                    false,
                    SharkGame.getElementColor(button.attr("id"), "background-color")
                )} for ${r.getResourceName(resourceName, false, false, false, SharkGame.getElementColor(button.attr("id"), "background-color"))} slot`
            );
        }
    },

    onUnhover() {
        const gt = SharkGame.Gate;
        const button = $(this);
        const resourceName = button.attr("id").split("-")[1];
        const required = gt.requirements.slots[resourceName];
        button.html(
            "Insert " +
                m.beautify(required) +
                " " +
                r.getResourceName(resourceName, false, false, false, SharkGame.getElementColor(button.attr("id"), "background-color")) +
                " into " +
                r.getResourceName(resourceName, false, false, false, SharkGame.getElementColor(button.attr("id"), "background-color")) +
                " slot"
        );
    },

    update() {},

    onGateButton() {
        const gt = SharkGame.Gate;
        const resourceId = $(this).attr("id").split("-")[1];

        let message = "";
        const cost = gt.requirements.slots[resourceId] * (r.getResource("numen") + 1);
        if (r.getResource(resourceId) >= cost) {
            gt.completedRequirements.slots[resourceId] = true;
            r.changeResource(resourceId, -cost);
            $(this).remove();
            if (gt.shouldBeOpen()) {
                message = gt.messageAllPaid;
                // add enter gate button
                SharkGame.Button.makeButton("gateEnter", "Enter gate", $("#buttonList"), gt.onEnterButton);
            } else {
                message = gt.messagePaid;
            }
        } else {
            message = gt.messageCantPay + "<br/>";
            const diff = cost - r.getResource(resourceId);
            message += m.beautify(diff) + " more.";
        }
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + gt.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
        }
        $("#tabMessage").html(message);
    },

    onEnterButton() {
        $("#tabMessage").html(SharkGame.Gate.messageEnter);
        $(this).remove();
        SharkGame.wonGame = true;
        m.endGame();
    },

    shouldBeOpen() {
        const gt = SharkGame.Gate;
        let won = true;
        $.each(gt.completedRequirements, (_, v) => {
            $.each(v, (k, req) => {
                won = won && req;
            });
        });
        return won;
    },

    checkUpgradeRequirements(upgradeName) {
        const gt = SharkGame.Gate;
        if (gt.completedRequirements.upgrades) {
            if (gt.completedRequirements.upgrades[upgradeName] === false) {
                gt.completedRequirements.upgrades[upgradeName] = true;
            }
        }
    },

    getSceneImagePath() {
        const gt = SharkGame.Gate;
        const slotsLeft = gt.getSlotsLeft();
        const upgradesLeft = gt.getUpgradesLeft();

        // lots of complicated logic here
        // basically:
        // - if the gate is open, show it as open
        // - if the gate has more than 1 slot left, show it as closed
        // - if the gate has 1 slot left and filling that slot would open it, then do the 1 slot remaining
        // - if the gate has 1 slot left but filling that slot would NOT open it (there's an upgrade requirement), show it as closed
        // - if all slots are filled but an upgrade is still needed then show the closed-but-filled image
        if (gt.shouldBeOpen()) {
            return gt.sceneOpenImage;
        } else if (slotsLeft > 1) {
            return gt.sceneClosedImage;
        } else if (slotsLeft === 1 && !upgradesLeft) {
            return gt.sceneAlmostOpenImage;
        } else if (!slotsLeft && upgradesLeft) {
            return gt.sceneClosedButFilledImage;
        } else {
            return gt.sceneClosedImage;
        }
    },
};
