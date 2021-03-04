SharkGame.Home = {
    tabId: "home",
    tabDiscovered: true,
    tabName: "Home Sea",
    tabBg: "img/bg/bg-homesea.png",

    currentButtonTab: null,
    currentExtraMessageIndex: null,

    // Priority: later messages display if available, otherwise earlier ones.
    extraMessages: {
        // FIRST RUN
        start: [
            {
                name: "start-you-are-a-shark",
                message: "&nbsp<br>&nbsp",
            },
            {
                name: "start-shark",
                unlock: { resource: { fish: 5 } },
                message: "You attract the attention of a shark. Maybe they can help you catch fish!<br>&nbsp",
            },
            {
                name: "start-sharks",
                unlock: { resource: { shark: 1 } },
                message: "More sharks swim over, curious and watchful.<br>&nbsp",
            },
            {
                name: "start-ray",
                unlock: { resource: { fish: 15 } },
                message: "Some rays drift over.<br>&nbsp",
            },
            {
                name: "start-quite-the-group",
                unlock: { resource: { shark: 1, ray: 1 } },
                message: "You have quite the group going now.<br>&nbsp",
            },
            {
                name: "start-crab",
                unlock: { resource: { shark: 4, ray: 4 } },
                message: "Some curious crabs come over.<br>&nbsp",
            },
            {
                name: "start-tribe",
                unlock: { resource: { shark: 1, ray: 1, crab: 1 } },
                message: "Your new tribe is at your command!<br>&nbsp",
            },
            {
                name: "start-crystals",
                unlock: { resource: { shark: 1, crystal: 10 } },
                message: "The crystals are shiny. Some sharks stare at them curiously.<br>&nbsp",
            },
            {
                name: "start-science",
                unlock: { resource: { scientist: 1 } },
                message: "The science sharks swim in their own school.<br>&nbsp",
            },
            {
                name: "start-discoveries",
                unlock: { upgrade: ["crystalContainer"] },
                message: "More discoveries are needed.<br>&nbsp",
            },
            {
                name: "start-nurse",
                unlock: { resource: { nurse: 1 } },
                message: "The shark community grows with time.<br>&nbsp",
            },
            {
                name: "start-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "You hear faint songs and cries in the distance.<br>&nbsp",
            },
            {
                name: "start-machines",
                unlock: { upgrade: ["automation"] },
                message: "Machines to do things for you.<br>Machines to do things faster than you or any shark.",
            },
            {
                name: "start-chasm",
                unlock: { upgrade: ["farExploration"] },
                message: "This place is not your home. You remember a crystal blue ocean.<br>The chasms beckon.",
            },
            {
                name: "start-gate",
                unlock: { upgrade: ["gateDiscovery"] },
                message: "The gate beckons. The secret must be unlocked.<br>&nbsp",
            },
        ],
        // LATER RUNS
        // INITIAL WORLD STATUSES
        marine: [
            {
                name: "marine-default",
                unlock: { world: "marine" },
                message: "The fish never run dry here. This place feels so familiar.<br>&nbsp",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "lobster-one",
                unlock: { resource: { lobster: 20 }, homeAction: ["getLobster"] },
                message: "The lobsters work, but seem carefree.<br>They worry about nothing.",
            },
            {
                name: "dolphin-one",
                unlock: { resource: { dolphin: 5 }, homeAction: ["getDolphin"] },
                message:
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            {
                name: "octopus-one",
                unlock: { resource: { octopus: 8 }, homeAction: ["getOctopus"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            {
                name: "whale-one",
                unlock: { resource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
        ],

        haven: [
            {
                name: "haven-default",
                unlock: { world: "haven" },
                message: "The oceans are rich with life. But it's still not home.<br>&nbsp",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "shrimp-one",
                unlock: { resource: { shrimp: 50 }, homeAction: ["getShrimp"] },
                message: "The shrimps are tiny, but hard-working.<br>They live for their sponge hives.",
            },
            {
                name: "lobster-one",
                unlock: { resource: { lobster: 20 }, homeAction: ["getLobster"] },
                message: "The lobsters work, but seem carefree.<br>They worry about nothing.",
            },
            {
                name: "dolphin-one",
                unlock: { resource: { dolphin: 5 }, homeAction: ["getDolphin"] },
                message:
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            {
                name: "octopus-one",
                unlock: { resource: { octopus: 8 }, homeAction: ["getOctopus"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            {
                name: "whale-one",
                unlock: { resource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
        ],

        chaotic: [
            {
                name: "chaotic-default",
                unlock: { world: "chaotic" },
                message: "Overwhelming reinforcements. Overwhelming everything. So hard to focus.<br>&nbsp",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "lobster-one",
                unlock: { resource: { lobster: 20 }, homeAction: ["getLobster"] },
                message: "The lobsters work, but seem carefree.<br>They worry about nothing.",
            },
            {
                name: "dolphin-one",
                unlock: { resource: { dolphin: 5 }, homeAction: ["getDolphin"] },
                message:
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
        ],

        tempestuous: [
            {
                name: "tempestuous-default",
                unlock: { world: "tempestuous" },
                message: "The storm never ends, and many are lost to its violent throes.<br>&nbsp",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "shrimp-one",
                unlock: { resource: { shrimp: 50 }, homeAction: ["getShrimp"] },
                message: "The shrimps are tiny, but hard-working.<br>They live for their sponge hives.",
            },
            {
                name: "lobster-one",
                unlock: { resource: { lobster: 20 }, homeAction: ["getLobster"] },
                message: "The lobsters work, but seem carefree.<br>They worry about nothing.",
            },
            {
                name: "eel-one",
                unlock: { resource: { eel: 10 }, homeAction: ["getEel"] },
                message: "The eels chatter among their hiding places.<br>They like the sharks.",
            },
            {
                name: "dolphin-one",
                unlock: { resource: { dolphin: 5 }, homeAction: ["getDolphin"] },
                message:
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            {
                name: "octopus-one",
                unlock: { resource: { octopus: 8 }, homeAction: ["getOctopus"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            {
                name: "whale-one",
                unlock: { resource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
        ],

        violent: [
            {
                name: "violent-default",
                unlock: { world: "violent" },
                message: "Bursts of plenty from the scorching vents, but so hot.<br>No place for the young.",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "shrimp-one",
                unlock: { resource: { shrimp: 50 }, homeAction: ["getShrimp"] },
                message: "The shrimps are tiny, but hard-working.<br>They live for their sponge hives.",
            },
            {
                name: "lobster-one",
                unlock: { resource: { lobster: 20 }, homeAction: ["getLobster"] },
                message: "The lobsters work, but seem carefree.<br>They worry about nothing.",
            },
            {
                name: "dolphin-one",
                unlock: { resource: { dolphin: 5 }, homeAction: ["getDolphin"] },
                message:
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
        ],

        abandoned: [
            {
                name: "abandoned-default",
                message: "The tar clogs the gills of everyone here.<br>This dying world drags everyone down with it.",
            },
            {
                name: "abandoned-octopus-scrutinizes",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "An octopus wanders over.<br>It scrutinizes your attempt at organization.",
            },
            {
                name: "abandoned-octopus",
                unlock: { resource: { octopus: 1 } },
                message: "The octopus works tirelessly.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { resource: { octopus: 2 } },
                message: "More octopuses join. They work in perfect unison.",
            },
            {
                name: "abandoned-production",
                unlock: { upgrade: ["octopusMethodology"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            {
                name: "abandoned-spronge",
                unlock: { resource: { spronge: 1 } },
                message: "Residue pumps through spronge like blood.<br>It pulses and throbs.",
            },
            {
                name: "abandoned-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Great spires loom in the distance.<br>Loose cables are strung together on the horizon.<br>",
            },
            {
                name: "abandoned-gate",
                unlock: { upgrade: ["farAbandonedExploration"] },
                message: "This gate stands inert and lifeless like the city around it.<br>But the slots are already filled.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message: "The components spin and whirr and click together, but their purpose eludes us.<br>What secrets are you hiding, parts?",
            },
            {
                name: "abandoned-high-energy-fusion",
                unlock: { upgrade: ["highEnergyFusion"] },
                message: "The light is blinding, but the output is worth it.<br>The pieces of a broken past unite to create a brighter future.",
            },
            {
                name: "abandoned-done",
                unlock: { upgrade: ["artifactAssembly"] },
                message: "...",
            },
            {
                name: "abandoned-tar-one",
                unlock: { resource: { tar: 5 } },
                message: "The tar is killing everything!<br>Maybe a filter could save us?",
            },
            {
                name: "abandoned-tar-two",
                unlock: { resource: { tar: 200 } },
                message: "Only machines will remain. All is lost.<br><span class='smallDesc'>All is lost.</span>",
            },
        ],

        shrouded: [
            {
                name: "shrouded-default",
                unlock: { world: "shrouded" },
                message: "The crystals are easier to find, but the darkness makes it hard to find anything else.<br>&nbsp",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "eel-one",
                unlock: { resource: { eel: 10 }, homeAction: ["getEel"] },
                message: "The eels chatter among their hiding places.<br>They like the sharks.",
            },
            {
                name: "dolphin-one",
                unlock: { resource: { dolphin: 5 }, homeAction: ["getDolphin"] },
                message:
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            {
                name: "octopus-one",
                unlock: { resource: { octopus: 8 }, homeAction: ["getOctopus"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            {
                name: "whale-one",
                unlock: { resource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?",
            },
            {
                name: "chimaera-one",
                unlock: { resource: { chimaera: 5 }, homeAction: ["getChimaera"] },
                message:
                    "The chimaeras are ancient kin of the shark kind, reunited through wild coincidence.<br>What peerless wonders have they found in the dark?",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
        ],

        frigid: [
            {
                name: "frigid-default",
                unlock: { world: "frigid" },
                message: "So cold. Hard to move. Hard to do anything.<br>&nbsp",
            },
            // BANKED ESSENCE
            {
                name: "essence",
                unlock: { resource: { essence: 100 } },
                message:
                    "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else.",
            },
            // NEW ANIMALS
            {
                name: "eel-one",
                unlock: { resource: { eel: 10 }, homeAction: ["getEel"] },
                message: "The eels chatter among their hiding places.<br>They like the sharks.",
            },
            {
                name: "octopus-one",
                unlock: { resource: { octopus: 8 }, homeAction: ["getOctopus"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            // UNIQUE STATUSES
            {
                name: "chorus",
                unlock: { resource: { chorus: 1 } },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp",
            },
            {
                name: "frigid-ice-one",
                unlock: { world: "frigid", resource: { ice: 50 } },
                message: "Something has to be done before the ice destroys us all!<br>Maybe a machine can save us?",
            },
            {
                name: "frigid-ice-two",
                unlock: { world: "frigid", resource: { ice: 250 } },
                message: "So cold. So hungry.<br><span class='smallDesc'>So hopeless.</span>",
            },
        ],
        /* {
            unlock: { world: "ethereal" },
            message: "The water glows here.<br>It feels familiar.",
        },
        {
            unlock: { world: "stone" },
            message:
                "The jagged seafloor looks ancient, yet pristine.<br>Sponges thrive in great numbers on the rocks.",
        }, */
    },

    init() {
        // rename home tab
        const tabName = SharkGame.WorldTypes[w.worldType].name + " Ocean";
        h.tabName = tabName;

        // register tab
        SharkGame.Tabs[h.tabId] = {
            id: h.tabId,
            name: h.tabName,
            discovered: h.tabDiscovered,
            code: h,
        };
        // populate action discoveries (and reset removals)
        $.each(SharkGame.HomeActions.getActionList(), (actionName, actionData) => {
            actionData.discovered = false;
            actionData.newlyDiscovered = false;
            actionData.isRemoved = false;
        });

        h.currentExtraMessageIndex = -1;
        h.currentButtonTab = "all";
    },

    switchTo() {
        const content = $("#content");
        const tabMessage = $("<div>").attr("id", "tabMessage");
        content.append(tabMessage);
        h.currentExtraMessageIndex = -1;
        h.updateMessage(true);
        // button tabs
        const buttonTabDiv = $("<div>").attr("id", "homeTabs");
        content.append(buttonTabDiv);
        h.createButtonTabs();
        // help button
        const helpButtonDiv = $("<div>");
        helpButtonDiv.css({ margin: "auto", clear: "both" });
        SharkGame.Button.makeButton("helpButton", "Toggle hover descriptions", helpButtonDiv, h.toggleHelp).addClass("min-block");
        content.append(helpButtonDiv);
        // button list
        const buttonList = $("<div>").attr("id", "buttonList");
        content.append(buttonList);
        if (SharkGame.Settings.current.buttonDisplayType === "pile") {
            buttonList.addClass("pileArrangement");
        } else {
            buttonList.removeClass("pileArrangement");
        }
        // background art!
        if (SharkGame.Settings.current.showTabImages) {
            tabMessage.css("background-image", "url('" + h.tabBg + "')");
        }
    },

    discoverActions() {
        $.each(SharkGame.HomeActions.getActionList(), (actionName, actionData) => {
            actionData.discovered = h.areActionPrereqsMet(actionName);
            actionData.newlyDiscovered = false;
        });
    },

    createButtonTabs() {
        const buttonTabDiv = $("#homeTabs");
        const buttonTabList = $("<ul>").attr("id", "homeTabsList");
        buttonTabDiv.empty();
        let tabAmount = 0;

        // add a header for each discovered category
        // make it a link if it's not the current tab
        $.each(SharkGame.HomeActionCategories, (k, v) => {
            const onThisTab = h.currentButtonTab === k;

            let categoryDiscovered = false;
            if (k === "all") {
                categoryDiscovered = true;
            } else {
                $.each(v.actions, (_, actionName) => {
                    if (SharkGame.HomeActions.getActionList()[actionName]) {
                        categoryDiscovered = categoryDiscovered || SharkGame.HomeActions.getActionList()[actionName].discovered;
                    }
                });
            }

            if (categoryDiscovered) {
                const tabListItem = $("<li>");
                if (onThisTab) {
                    tabListItem.html(v.name);
                } else {
                    tabListItem.append(
                        $("<a>")
                            .attr("id", "buttonTab-" + k)
                            .attr("href", "javascript:;")
                            .html(v.name)
                            .on("click", function callback() {
                                if ($(this).hasClass(".disabled")) return;
                                const tab = $(this).attr("id").split("-")[1];
                                h.changeButtonTab(tab);
                            })
                    );
                    if (v.hasNewItem) {
                        tabListItem.addClass("newItemAdded");
                    }
                }
                buttonTabList.append(tabListItem);
                tabAmount++;
            }
        });
        // finally at the very end just throw the damn list away if it only has two options
        // "all" + another category is completely pointless
        if (tabAmount > 2) {
            buttonTabDiv.append(buttonTabList);
        }
    },

    updateTab(tabToUpdate) {
        // return if we're looking at all buttons, no change there
        if (h.currentButtonTab === "all") {
            return;
        }
        SharkGame.HomeActionCategories[tabToUpdate].hasNewItem = true;
        const tabItem = $("#buttonTab-" + tabToUpdate);
        if (tabItem.length > 0) {
            tabItem.parent().addClass("newItemAdded");
        } else {
            h.createButtonTabs();
        }
    },

    changeButtonTab(tabToChangeTo) {
        SharkGame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
        if (tabToChangeTo === "all") {
            $.each(SharkGame.HomeActionCategories, (k, v) => {
                v.hasNewItem = false;
            });
        }
        h.currentButtonTab = tabToChangeTo;
        $("#buttonList").empty();
        h.createButtonTabs();
    },

    updateMessage(suppressAnimation) {
        const u = SharkGame.Upgrades.getUpgradeTable();
        const wi = SharkGame.WorldTypes[w.worldType];
        let selectedIndex = h.currentExtraMessageIndex;
        const events = h.extraMessages[w.worldType];

        $.each(events, (messageIndex, extraMessage) => {
            let showThisMessage = true;
            // check if should show this message
            if (extraMessage.unlock) {
                if (extraMessage.unlock.resource) {
                    $.each(extraMessage.unlock.resource, (key, resource) => {
                        showThisMessage = showThisMessage && r.getResource(key) >= resource;
                    });
                }
                if (extraMessage.unlock.upgrade) {
                    $.each(extraMessage.unlock.upgrade, (i, upgrade) => {
                        showThisMessage = showThisMessage && u[upgrade].purchased;
                    });
                }
                if (extraMessage.unlock.world) {
                    showThisMessage = showThisMessage && w.worldType === extraMessage.unlock.world;
                }
                if (extraMessage.unlock.homeAction) {
                    $.each(extraMessage.unlock.homeAction, (key, action) => {
                        showThisMessage =
                            showThisMessage &&
                            SharkGame.HomeActions.getActionList()[action].discovered &&
                            !SharkGame.HomeActions.getActionList()[action].newlyDiscovered;
                    });
                }
            }
            if (showThisMessage) {
                selectedIndex = messageIndex;
            }
        });

        // only edit DOM if necessary
        if (h.currentExtraMessageIndex !== selectedIndex) {
            h.currentExtraMessageIndex = selectedIndex;
            const messageData = events[selectedIndex];
            const tabMessage = $("#tabMessage");
            let sceneDiv;
            if (SharkGame.Settings.current.showTabImages) {
                sceneDiv = $("#tabSceneImage");
                if (sceneDiv.size() === 0) {
                    sceneDiv = $("<div>").attr("id", "tabSceneImage");
                }
            }
            let message = "You are a shark in a " + wi.shortDesc + " sea.";
            message += "<br><span id='extraMessage' class='medDesc'>&nbsp<br>&nbsp</span>";
            tabMessage.html(message).prepend(sceneDiv);

            const extraMessageSel = $("#extraMessage");
            if (!suppressAnimation && SharkGame.Settings.current.showAnimations) {
                extraMessageSel.animate({ opacity: 0 }, 200, () => {
                    $(extraMessageSel).animate({ opacity: 1 }, 200).html(messageData.message);
                });
                sceneDiv.animate({ opacity: 0 }, 500, () => {
                    if (SharkGame.Settings.current.showTabImages) {
                        SharkGame.changeSprite(SharkGame.spriteHomeEventPath, messageData.name, sceneDiv, "missing");
                    }
                    $(sceneDiv).animate({ opacity: 1 }, 500);
                });
            } else {
                extraMessageSel.html(events[selectedIndex].message);
                if (SharkGame.Settings.current.showTabImages) {
                    SharkGame.changeSprite(SharkGame.spriteHomeEventPath, messageData.name, sceneDiv, "missing");
                }
            }
        }
    },

    update() {
        // for each button entry in the home tab,
        $.each(SharkGame.HomeActions.getActionList(), (actionName, actionData) => {
            const actionTab = h.getActionCategory(actionName);
            const onTab = actionTab === h.currentButtonTab || h.currentButtonTab === "all";
            if (onTab && !actionData.isRemoved) {
                const button = $("#" + actionName);
                if (button.length === 0) {
                    if (actionData.discovered || h.areActionPrereqsMet(actionName)) {
                        if (!actionData.discovered) {
                            actionData.discovered = true;
                            actionData.newlyDiscovered = true;
                        }
                        h.addButton(actionName);
                    }
                } else {
                    // button exists
                    h.updateButton(actionName);
                }
            } else {
                if (!actionData.discovered) {
                    if (h.areActionPrereqsMet(actionName)) {
                        actionData.discovered = true;
                        actionData.newlyDiscovered = true;
                        h.updateTab(actionTab);
                    }
                }
            }
        });

        // update home message
        h.updateMessage();
    },

    updateButton(actionName) {
        const amountToBuy = m.getBuyAmount();

        const button = $("#" + actionName);
        const actionData = SharkGame.HomeActions.getActionList()[actionName];

        if (actionData.removedBy) {
            if (h.shouldRemoveHomeButton(actionData)) {
                button.remove();
                actionData.isRemoved = true;
                actionData.discovered = true;
                return;
            }
        }
        let amount = amountToBuy;
        let actionCost;
        if (amountToBuy < 0) {
            const max = Math.floor(h.getMax(actionData));
            // convert divisor from a negative number to a positive fraction
            const divisor = 1 / (Math.floor(amountToBuy) * -1);
            amount = max * divisor;
            amount = Math.floor(amount);
            if (amount < 1) amount = 1;
            actionCost = h.getCost(actionData, amount);
        } else {
            actionCost = h.getCost(actionData, amountToBuy);
        }
        // disable button if resources can't be met
        let enableButton;
        if ($.isEmptyObject(actionCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = r.checkResources(actionCost);
        }

        let label = actionData.name;
        if (!$.isEmptyObject(actionCost) && amount > 1) {
            label += " (" + m.beautify(amount) + ")";
        }

        if (enableButton) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }

        // check for any infinite quantities
        let infinitePrice = false;
        _.each(actionCost, (num) => {
            if (num === Number.POSITIVE_INFINITY) {
                infinitePrice = true;
            }
        });
        if (infinitePrice) {
            label += "<br>Maxed out";
        } else {
            const costText = r.resourceListToString(actionCost, !enableButton, SharkGame.getElementColor(actionName, "background-color"));
            if (costText !== "") {
                label += "<br>Cost: " + costText;
            }
        }

        if (document.querySelector("#wrapper button.hoverbutton:hover") === null) {
            h.onHomeUnhover();
        }

        label = $('<span id="' + actionName + 'Label" class="click-passthrough">' + label + "</span>");

        // Only redraw the whole button when necessary.
        // This is necessary when buttons are new, or the icon setting has been changed.
        // We can detect both cases for the icon-on settings by making sure we have an icon
        // class that matches the setting.
        // The icon-off setting is a little trickier.  It needs two cases.  We check for a lack of spans to
        // see if the button is new, then check for the presence of any icon to see if the setting changed.
        if (
            !(
                (button.html().includes("button-icon-top") && SharkGame.Settings.current.iconPositions === "top") ||
                (button.html().includes("button-icon-side") && SharkGame.Settings.current.iconPositions === "side") ||
                (button.html().includes("span") && SharkGame.Settings.current.iconPositions === "off")
            ) ||
            (button.html().includes("button-icon") && SharkGame.Settings.current.iconPositions === "off")
        ) {
            button.html(label);

            const spritename = "actions/" + actionName;
            if (SharkGame.Settings.current.iconPositions !== "off") {
                const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-action");
                if (iconDiv) {
                    iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
                    button.prepend(iconDiv);
                }
            }
        } else {
            // The button already exists, so don't waste time drawing the icon.
            // Only redraw the label, and even then only if it's changed.
            const labelSpan = $("#" + actionName + "Label");

            // Quote-insensitive comparison, because the helper methods beautify the labels using single quotes
            // but jquery returns the same elements back with double quotes.
            if (label.html() !== labelSpan.html()) {
                labelSpan.html(label.html());
            }
        }
    },

    areActionPrereqsMet(actionName) {
        let prereqsMet = true; // assume true until proven false
        const action = SharkGame.HomeActions.getActionList()[actionName];
        if (action.unauthorized) {
            return false;
        }
        // check to see if this action should be forcibly removed
        if (action.removedBy) {
            prereqsMet = !h.shouldRemoveHomeButton(action);
        }
        // check resource prerequisites
        if (action.prereq.resource) {
            prereqsMet = prereqsMet && r.checkResources(action.prereq.resource, true);
        }
        // check if resource cost exists
        if (action.cost) {
            $.each(action.cost, (i, v) => {
                const costResource = v.resource;
                prereqsMet = prereqsMet && w.doesResourceExist(costResource);
            });
        }
        // check special worldtype prereqs
        if (action.prereq.world) {
            prereqsMet = prereqsMet && w.worldType === action.prereq.world;
        }

        // check the special worldtype exclusions
        if (action.prereq.notWorlds) {
            prereqsMet = prereqsMet && !action.prereq.notWorlds.includes(w.worldType);
        }

        const ups = SharkGame.Upgrades.getUpgradeTable();

        // check upgrade prerequisites
        if (action.prereq.upgrade) {
            $.each(action.prereq.upgrade, (_, v) => {
                if (ups[v]) {
                    prereqsMet = prereqsMet && ups[v].purchased;
                } else {
                    prereqsMet = false;
                }
            });
        }
        // check if resulting resource exists
        if (action.effect.resource) {
            $.each(action.effect.resource, (k, v) => {
                prereqsMet = prereqsMet && w.doesResourceExist(k);
            });
        }
        return prereqsMet;
    },

    shouldRemoveHomeButton(action) {
        let disable = false;
        $.each(action.removedBy, (kind, by) => {
            switch (kind) {
                case "otherActions":
                    $.each(by, (k, v) => {
                        disable = disable || h.areActionPrereqsMet(v);
                    });
                    break;
                case "upgrades":
                    $.each(by, (k, v) => {
                        disable = disable || SharkGame.Upgrades.getUpgradeTable()[v].purchased;
                    });
                    break;
            }
        });
        return disable;
    },

    addButton(actionName) {
        const buttonListSel = $("#buttonList");
        const actionData = SharkGame.HomeActions.getActionList()[actionName];

        const buttonSelector = SharkGame.Button.makeHoverscriptButton(
            actionName,
            actionData.name,
            buttonListSel,
            h.onHomeButton,
            h.onHomeHover,
            h.onHomeUnhover
        );
        h.updateButton(actionName);
        if (SharkGame.Settings.current.showAnimations) {
            buttonSelector.hide().css("opacity", 0).slideDown(50).animate({ opacity: 1.0 }, 50);
        }
        if (actionData.newlyDiscovered) {
            buttonSelector.addClass("newlyDiscovered");
        }
    },

    getActionCategory(actionName) {
        let categoryName = "";
        $.each(SharkGame.HomeActionCategories, (categoryKey, categoryValue) => {
            if (categoryName !== "") {
                return;
            }
            $.each(categoryValue.actions, (k, v) => {
                if (categoryName !== "") {
                    return;
                }
                if (actionName === v) {
                    categoryName = categoryKey;
                }
            });
        });
        return categoryName;
    },

    onHomeButton() {
        const amountToBuy = m.getBuyAmount();
        // get related entry in home button table
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const buttonName = button.attr("id");
        const action = SharkGame.HomeActions.getActionList()[buttonName];
        let actionCost = {};
        let amount = 0;
        if (amountToBuy < 0) {
            // unlimited mode, calculate the highest we can go
            const max = Math.floor(h.getMax(action));
            // floor max
            if (max > 0) {
                // convert divisor from a negative number to a positive fraction
                const divisor = 1 / (Math.floor(amountToBuy) * -1);
                amount = max * divisor;
                // floor amount
                amount = Math.floor(amount);
                // make it worth entering this function
                if (amount < 1) amount = 1;
                actionCost = h.getCost(action, amount);
            }
        } else {
            actionCost = h.getCost(action, amountToBuy);
            amount = amountToBuy;
        }

        if ($.isEmptyObject(actionCost)) {
            // free action
            // do not repeat or check for costs
            if (action.effect.resource) {
                r.changeManyResources(action.effect.resource);
            }
            SharkGame.Log.addMessage(SharkGame.choose(action.outcomes));
        } else if (amount > 0) {
            // cost action
            // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
            if (r.checkResources(actionCost)) {
                // take cost
                r.changeManyResources(actionCost, true);
                // execute effects
                if (action.effect.resource) {
                    let resourceChange;
                    if (amount !== 1) {
                        resourceChange = r.scaleResourceList(action.effect.resource, amount);
                    } else {
                        resourceChange = action.effect.resource;
                    }
                    r.changeManyResources(resourceChange);
                }
                // print outcome to log
                if (!action.multiOutcomes || amount === 1) {
                    SharkGame.Log.addMessage(SharkGame.choose(action.outcomes));
                } else {
                    SharkGame.Log.addMessage(SharkGame.choose(action.multiOutcomes));
                }
            } else {
                SharkGame.Log.addMessage("You can't afford that!");
            }
        }
        if (button.hasClass("newlyDiscovered")) {
            action.newlyDiscovered = false;
            button.removeClass("newlyDiscovered");
        }
        // disable button until next frame
        button.addClass("disabled");
    },

    onHomeHover() {
        if (!SharkGame.Settings.current.showTabHelp) {
            return;
        }
        const button = $(this);
        const actionName = button.attr("id");
        const effects = SharkGame.HomeActions.getActionList()[actionName].effect;
        const validGenerators = {};
        let numGen = 0;
        if (effects.resource) {
            $.each(effects.resource, (resource) => {
                numGen += 1;
                if (SharkGame.ResourceMap.get(resource).income) {
                    $.each(SharkGame.ResourceMap.get(resource).income, (incomeResource) => {
                        const genAmount = r.getProductAmountFromGeneratorResource(resource, incomeResource, 1);
                        if (genAmount !== 0 && w.doesResourceExist(incomeResource)) {
                            validGenerators[incomeResource] = genAmount;
                        }
                    });
                }
            });
        }

        let appendedProduce = false;
        let appendedConsume = false;
        let text = "";

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount > 0) {
                if (!appendedProduce) {
                    appendedProduce = true;
                    text += "<span class='littleTooltipText'>PRODUCES</span>";
                }
                text +=
                    "<br/>" +
                    m
                        .beautifyIncome(
                            amount,
                            " " + r.getResourceName(incomeResource, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold();
            }
        });

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount < 0) {
                if (!appendedConsume) {
                    appendedConsume = true;
                    if (!appendedProduce) {
                        text += "<span class='littleTooltipText'>CONSUMES</span>";
                    } else {
                        text += "<br/> <span class='littleTooltipText'>CONSUMES</span>";
                    }
                }
                text +=
                    "<br/>" +
                    m
                        .beautifyIncome(
                            -amount,
                            " " + r.getResourceName(incomeResource, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold();
            }
        });

        if (SharkGame.HomeActions.getActionList()[actionName].helpText) {
            if (text !== "") {
                text += "<br><span class='medDesc'>" + SharkGame.HomeActions.getActionList()[actionName].helpText + "</span>";
            } else {
                text += "<span class='medDesc'>" + SharkGame.HomeActions.getActionList()[actionName].helpText + "</span>";
            }
        }

        if (numGen === 1) {
            $.each(effects.resource, (resource) => {
                const determiner = m.getDeterminer(resource);
                if (determiner !== "") {
                    text =
                        m.getDeterminer(resource) +
                        " " +
                        r.getResourceName(resource, false, true, false, SharkGame.getElementColor("tooltipbox", "background-color")).bold() +
                        "<br>" +
                        text;
                } else {
                    text =
                        r.getResourceName(resource, false, true, false, SharkGame.getElementColor("tooltipbox", "background-color")).bold() +
                        "<br>" +
                        text;
                }
            });
        }

        document.getElementById("tooltipbox").innerHTML = text;
    },

    onHomeUnhover() {
        document.getElementById("tooltipbox").innerHTML = "";
    },

    getCost(action, amount) {
        const calcCost = {};
        const rawCost = action.cost;

        $.each(rawCost, (costIndex, costObj) => {
            const resource = SharkGame.PlayerResources.get(action.max);
            let currAmount = resource.amount;
            if (resource.jobs) {
                $.each(resource.jobs, (_, v) => {
                    currAmount += r.getResource(v);
                });
            }
            const k = costObj.priceIncrease;
            let cost = 0;
            switch (costObj.costFunction) {
                case "constant":
                    cost = SharkGame.MathUtil.constantCost(currAmount, currAmount + amount, k);
                    break;
                case "linear":
                    cost = SharkGame.MathUtil.linearCost(currAmount, currAmount + amount, k);
                    break;
                case "unique":
                    cost = SharkGame.MathUtil.uniqueCost(currAmount, currAmount + amount, k);
                    break;
            }
            if (Math.abs(cost - Math.round(cost)) < SharkGame.EPSILON) {
                cost = Math.round(cost);
            }
            calcCost[costObj.resource] = cost;
        });
        return calcCost;
    },

    getMax(action) {
        let max = 1;
        if (action.max) {
            // max is really ambiguous
            // its used as the determining resource for linear cost functions
            const resource = SharkGame.PlayerResources.get(action.max);
            let currAmount = resource.amount;
            if (resource.jobs) {
                $.each(resource.jobs, (_, v) => {
                    currAmount += r.getResource(v);
                });
            }
            max = Number.MAX_VALUE;
            $.each(action.cost, (_, v) => {
                const costResource = SharkGame.PlayerResources.get(v.resource).amount;
                const k = v.priceIncrease;

                let subMax = -1;
                switch (v.costFunction) {
                    case "constant":
                        subMax = SharkGame.MathUtil.constantMax(0, costResource, k);
                        break;
                    case "linear":
                        subMax = SharkGame.MathUtil.linearMax(currAmount, costResource, k) - currAmount;
                        break;
                    case "unique":
                        subMax = SharkGame.MathUtil.uniqueMax(currAmount, costResource, k) - currAmount;
                        break;
                }
                // prevent flashing action costs
                if (Math.abs(subMax - Math.round(subMax)) < SharkGame.EPSILON) {
                    subMax = Math.round(subMax);
                }
                max = Math.min(max, subMax);
            });
        }
        return Math.floor(max);
    },

    toggleHelp() {
        SharkGame.Settings.current.showTabHelp = !SharkGame.Settings.current.showTabHelp;
    },
};
