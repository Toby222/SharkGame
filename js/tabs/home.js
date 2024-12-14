"use strict";
SharkGame.Home = {
    tabId: "home",
    tabDiscovered: true,
    tabSeen: true,
    tabName: "Home Sea",
    tabBg: "img/bg/bg-homesea.png",

    currentButtonTab: null,

    buttonNamesList: [],

    init() {
        SharkGame.TabHandler.registerTab(this);
        SharkGame.HomeActions.generated = {};

        home.currentButtonTab = "all";
        home.lastValidMessage = "";
    },

    setup() {
        // rename home tab
        const tabName = SharkGame.WorldTypes[world.worldType].name + " Ocean";
        home.tabName = tabName;
        if (SharkGame.Tabs.home) {
            SharkGame.Tabs.home.name = tabName;
        }
        home.discoverActions();
    },

    switchTo() {
        this.buttonNamesList = [];
        const content = $("#content");
        const tabMessage = $("<div>").attr("id", "tabMessage");
        content.append(tabMessage);

        if (!SharkGame.flags.seenHomeMessages) {
            SharkGame.flags.seenHomeMessages = [];
        }
        if (!SharkGame.flags.selectedHomeMessage) {
            SharkGame.flags.selectedHomeMessage = SharkGame.HomeMessages.messages[world.worldType][0].name;
        }

        home.tickHomeMessages(true);

        // button tabs
        const buttonTabDiv = $("<div>").attr("id", "homeTabs");
        content.append(buttonTabDiv);
        home.createButtonTabs();

        // buy amount buttons
        if (SharkGame.persistentFlags.revealedBuyButtons) {
            main.createBuyButtons("buy", content, "append");
        }

        // button list
        const buttonList = $("<div>").attr("id", "buttonList").addClass("homeScreen");
        content.append(buttonList);

        // background art!
        if (SharkGame.Settings.current.showTabImages) {
            tabMessage.css("background-image", "url('" + home.tabBg + "')");
        }
        this.update();
    },

    discoverActions() {
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            actionData.discovered = home.areActionPrereqsMet(actionName);
            actionData.newlyDiscovered = false;
        });
    },

    createButtonTabs() {
        const buttonTabDiv = $("#homeTabs");
        const buttonTabList = $("<ul>").attr("id", "homeTabsList");
        buttonTabDiv.empty();
        let tabAmount = 0;

        if (!SharkGame.persistentFlags.revealedButtonTabs) return;

        // add a header for each discovered category
        // make it a link if it's not the current tab
        $.each(SharkGame.HomeActionCategories, (categoryName, category) => {
            const onThisTab = home.currentButtonTab === categoryName;

            let categoryDiscovered = false;
            if (categoryName === "all") {
                categoryDiscovered = true;
            } else {
                // Check if any action in category is discovered
                categoryDiscovered = _.some(category.actions, (actionName) => {
                    const actionTable = SharkGame.HomeActions.getActionTable();
                    // True if it exists and is discovered
                    return _.has(actionTable, actionName) && actionTable[actionName].discovered;
                });
            }

            if (categoryDiscovered) {
                const tabListItem = $("<li>");
                if (onThisTab) {
                    tabListItem.html(category.name);
                } else {
                    tabListItem.append(
                        $("<a>")
                            .attr("id", "buttonTab-" + categoryName)
                            .attr("href", "javascript:;")
                            .html(category.name)
                            .on("click", function callback() {
                                if ($(this).hasClass(".disabled")) return;
                                const tab = $(this).attr("id").split("-")[1];
                                home.changeButtonTab(tab);
                            }),
                    );
                    if (category.hasNewItem) {
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
        if (home.currentButtonTab === "all") {
            return;
        }
        SharkGame.HomeActionCategories[tabToUpdate].hasNewItem = true;
        const tabItem = $("#buttonTab-" + tabToUpdate);
        if (tabItem.length > 0) {
            tabItem.parent().addClass("newItemAdded");
        } else {
            home.createButtonTabs();
        }
    },

    changeButtonTab(tabToChangeTo) {
        SharkGame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
        if (tabToChangeTo === "all") {
            _.each(SharkGame.HomeActionCategories, (category) => {
                category.hasNewItem = false;
            });
        }
        home.currentButtonTab = tabToChangeTo;
        $("#buttonList").empty();
        home.createButtonTabs();
        home.update();
    },

    getButtonTabs() {
        const buttonTabsArray = [];
        $.each(SharkGame.HomeActionCategories, (categoryName) => {
            if ($(`#buttonTab-${categoryName}`).html() || home.currentButtonTab === categoryName) {
                buttonTabsArray.push(categoryName);
            }
        });
        return buttonTabsArray;
    },

    getNextButtonTab() {
        const tabs = this.getButtonTabs();
        const currentTabIndex = tabs.indexOf(home.currentButtonTab);

        if (currentTabIndex === tabs.length - 1) {
            return tabs[0];
        }
        return tabs[currentTabIndex + 1];
    },

    getPreviousButtonTab() {
        const tabs = this.getButtonTabs();
        const currentTabIndex = tabs.indexOf(home.currentButtonTab);

        if (currentTabIndex === 0) {
            return tabs[tabs.length - 1];
        }
        return tabs[currentTabIndex - 1];
    },

    tickHomeMessages(isDuringTabSwitch) {
        const lastValidMessage = home.getLastValidMessage();
        home.lastValidMessage = lastValidMessage.name;
        home.updateMemories();

        const currentMessageData =
            SharkGame.HomeMessages.messages[world.worldType][SharkGame.Memories.messageLookup.get(SharkGame.flags.selectedHomeMessage)];

        // if there's an unseen message, change to it
        const anyUnseen = home.areThereAnyUnseenHomeMessages();
        if (anyUnseen || ((lastValidMessage.transient || currentMessageData.transient) && currentMessageData.name !== lastValidMessage.name)) {
            home.updateMessage(home.lastValidMessage, isDuringTabSwitch);
            _.each(mem.worldMemories, (memory) => {
                if (!SharkGame.flags.seenHomeMessages.includes(memory)) SharkGame.flags.seenHomeMessages.push(memory);
            });
        } else if (isDuringTabSwitch) {
            home.updateMessage(SharkGame.flags.selectedHomeMessage, true);
        }

        home.updateMessageSelectors();
    },

    getLastValidMessage() {
        const lastValidMessageData = _.findLast(SharkGame.HomeMessages.messages[world.worldType], (extraMessage) => {
            // check if all requirements met
            if (_.has(extraMessage, "unlock")) {
                let requirementsMet = true;
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.resource, (requiredAmount, resourceId) => {
                        return res.getResource(resourceId) >= requiredAmount;
                    });
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.totalResource, (requiredAmount, resourceId) => {
                        return res.getTotalResource(resourceId) >= requiredAmount;
                    });
                requirementsMet =
                    requirementsMet && _.every(extraMessage.unlock.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId));
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.homeAction, (actionName) => {
                        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
                        return action.discovered && !action.newlyDiscovered;
                    });
                if (extraMessage.unlock.custom) {
                    requirementsMet = requirementsMet && extraMessage.unlock.custom();
                }

                return requirementsMet;
            }
            return true;
        });

        return lastValidMessageData;
    },

    updateMemories() {
        SharkGame.Memories.addMemory(world.worldType, home.lastValidMessage);
    },

    findNextHomeMessage() {
        const currentIndex = SharkGame.Memories.messageLookup.get(SharkGame.flags.selectedHomeMessage);
        const messages = SharkGame.HomeMessages.messages[world.worldType].slice(
            currentIndex + 1,
            SharkGame.HomeMessages.messages[world.worldType].length,
        );
        const nextMessage = _.find(messages, (messageData) => {
            return mem.worldMemories[world.worldType].includes(messageData.name);
        });

        return nextMessage && !nextMessage.transient ? nextMessage.name : false;
    },

    findPreviousHomeMessage() {
        const currentIndex = SharkGame.Memories.messageLookup.get(SharkGame.flags.selectedHomeMessage);
        const messages = SharkGame.HomeMessages.messages[world.worldType].slice(0, currentIndex);
        const previousMessage = _.findLast(messages, (messageData) => {
            return mem.worldMemories[world.worldType].includes(messageData.name);
        });

        return previousMessage ? previousMessage.name : false;
    },

    incrementHomeMessage() {
        const next = home.findNextHomeMessage();
        if (next) {
            home.updateMessage(next);
            return true;
        }
        return false;
    },

    decrementHomeMessage() {
        if (!home.getLastValidMessage().transient) {
            const previous = home.findPreviousHomeMessage();
            if (previous) {
                home.updateMessage(previous);
                return true;
            }
        }
        return false;
    },

    areThereAnyUnseenHomeMessages() {
        let foundAny = false;
        _.each(mem.worldMemories[world.worldType], (memoryName) => {
            if (!SharkGame.flags.seenHomeMessages.includes(memoryName)) foundAny = true;
        });
        return foundAny;
    },

    updateMessage(requestedMessage, suppressAnimation) {
        const worldType = SharkGame.WorldTypes[world.worldType];
        const homeMessages = SharkGame.HomeMessages.messages[world.worldType];

        const messageData = homeMessages[SharkGame.Memories.messageLookup.get(requestedMessage)];
        const tabMessage = $("#tabMessage");

        let sceneDiv = $("#tabSceneDiv");
        let sceneImageDiv = $("#tabSceneImage");

        if (tabMessage[0].children.length === 0) {
            sceneDiv = $("<div>").attr("id", "tabSceneDiv");
            if (SharkGame.Settings.current.showTabImages) {
                sceneImageDiv = $("<div>").attr("id", "tabSceneImage");
            }
            // ⯇ ⯈
            SharkGame.Button.makeButton("sceneLeft", "⯇", sceneDiv, () => {
                home.decrementHomeMessage();
            });
            sceneDiv.append(sceneImageDiv);
            SharkGame.Button.makeButton("sceneRight", "⯈", sceneDiv, () => {
                home.incrementHomeMessage();
            });
            sceneDiv.append($("<div>").html("").attr("id", "tabSceneTracker"));

            let message = "<strong class='medDesc'>You are a shark in a " + worldType.shortDesc + " sea.</strong>";
            message += "<br><strong id='extraMessage'><br></strong>";
            tabMessage.html(message).prepend(sceneDiv);
        }

        const extraMessageSel = $("#extraMessage");
        if (!suppressAnimation && SharkGame.Settings.current.showAnimations) {
            extraMessageSel.animate({ opacity: 0 }, 300, () => {
                $(extraMessageSel).animate({ opacity: 1 }, 300).html(messageData.message);
            });
            sceneImageDiv.animate({ opacity: 0 }, 300, () => {
                if (SharkGame.Settings.current.showTabImages) {
                    SharkGame.changeSprite(SharkGame.spriteHomeEventPath, "home/" + messageData.name, sceneImageDiv, "home/missing");
                }
                $(sceneImageDiv).animate({ opacity: 1 }, 300);
            });
        } else {
            extraMessageSel.html(messageData.message);
            if (SharkGame.Settings.current.showTabImages) {
                SharkGame.changeSprite(SharkGame.spriteHomeEventPath, "home/" + messageData.name, sceneImageDiv, "home/missing");
            } else {
                sceneImageDiv.empty();
            }
        }

        SharkGame.flags.selectedHomeMessage = requestedMessage;
        if (!SharkGame.flags.seenHomeMessages.includes(requestedMessage)) SharkGame.flags.seenHomeMessages.push(requestedMessage);
        home.updateMessageTracker();
        home.updateMessageSelectors();
    },

    updateMessageSelectors() {
        if (!home.findNextHomeMessage()) {
            $("#sceneRight").addClass("disabled");
        } else {
            $("#sceneRight").removeClass("disabled");
        }

        if (!home.findPreviousHomeMessage() || home.getLastValidMessage().transient) {
            $("#sceneLeft").addClass("disabled");
        } else {
            $("#sceneLeft").removeClass("disabled");
        }
    },

    updateMessageTracker() {
        const tracker = $("#tabSceneTracker");
        tracker.empty();

        if (!home.getLastValidMessage().transient) {
            _.each(SharkGame.HomeMessages.messages[world.worldType], (messageData) => {
                // console.log(messageData.name);
                if (SharkGame.flags.seenHomeMessages.includes(messageData.name) && !messageData.transient) {
                    tracker.append(
                        $("<div>")
                            .html("•")
                            .addClass(messageData.name === SharkGame.flags.selectedHomeMessage ? "" : "inactive"),
                    );
                }
            });
        }
    },

    update() {
        // for each button entry in the home tab,
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            const actionTab = home.getActionCategory(actionName);
            const onTab = actionTab === home.currentButtonTab || home.currentButtonTab === "all";
            if (onTab && !actionData.isRemoved) {
                const button = $("#" + actionName);
                if (button.length === 0) {
                    if (actionData.discovered || home.areActionPrereqsMet(actionName)) {
                        if (!actionData.discovered) {
                            actionData.discovered = true;
                            actionData.newlyDiscovered = true;
                        }
                        home.addButton(actionName);
                        home.createButtonTabs();
                    }
                } else {
                    // button exists
                    home.updateButton(actionName);
                }
            } else {
                if (!actionData.discovered) {
                    if (home.areActionPrereqsMet(actionName)) {
                        actionData.discovered = true;
                        actionData.newlyDiscovered = true;
                        home.updateTab(actionTab);
                    }
                }
            }
        });

        // update home message
        home.tickHomeMessages();

        // update hovering messages
        if (document.getElementById("tooltipbox").className.split(" ").includes("forHomeButtonOrGrotto")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                home.onHomeHover(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    updateButton(actionName) {
        if (!sharkmath.getBuyAmount()) {
            return;
        }
        const amountToBuy = new Decimal(sharkmath.getBuyAmount());

        const button = $("#" + actionName);
        const actionData = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);

        if (actionData.removedBy) {
            if (home.shouldRemoveHomeButton(actionData)) {
                button.remove();
                SharkGame.HomeActions.getActionTable()[actionName].isRemoved = true;
                SharkGame.HomeActions.getActionTable()[actionName].discovered = true;
                return;
            }
        }
        let amount = amountToBuy;
        let enableButton = true;
        if (amountToBuy.lessThan(0)) {
            // unlimited mode, calculate the highest we can go
            const max = home.getMax(actionData);
            const divisor = new Decimal(1).dividedBy(amountToBuy.times(-1));
            amount = max.times(divisor);
            if (amount.lessThan(1)) {
                if (amount.times(amountToBuy.times(-1)).greaterThanOrEqualTo(1 - SharkGame.EPSILON)) {
                    enableButton = true;
                } else {
                    enableButton = false;
                }
                amount = new Decimal(1);
            }
            amount = amount.round();
        }
        const actionCost = home.getCost(actionData, amount);

        // keep button disabled if the max returned less than 1
        if (enableButton) {
            // disable button if resources can't be met
            enableButton = res.checkResources(actionCost);
        }

        if ($.isEmptyObject(actionCost)) {
            enableButton = true; // always enable free buttons
        }

        let label = actionData.name;
        if (!$.isEmptyObject(actionCost) && amount.greaterThan(1)) {
            label += " (" + sharktext.beautify(amount.toNumber()) + ")";
        }

        if (enableButton) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }

        // check for any infinite quantities
        if (_.some(actionCost, (cost) => !cost.isFinite())) {
            label += "<br>Maxed out";
        } else {
            const costText = sharktext.resourceListToString(actionCost, !enableButton, sharkcolor.getElementColor(actionName, "background-color"));
            if (costText !== "") {
                label += "<br>Cost: " + costText;
            }
        }

        label = $('<span id="' + actionName + 'Label" class="click-passthrough">' + label + "</span>");

        // Only redraw the whole button when necessary.
        // This is necessary when buttons are new, or the icon setting has been changed.
        // We can detect both cases for the icon-on settings by making sure we have an icon
        // class that matches the setting.
        // The icon-off setting is a little trickier.  It needs two cases.  We check for a lack of spans to
        // see if the button is new, then check for the presence of any icon to see if the setting changed.
        if (button.html().includes("button-icon") !== SharkGame.Settings.current.showIcons) {
            button.html(label);

            let spritename;
            switch (actionName) {
                case "getUrchin":
                    // disabled until we get a new one.
                    spritename = Math.random() < 0 ? "actions/getUrchinHatted" : "actions/getUrchin";
                    break;
                case "getLobster":
                    spritename = Math.random() < 0.01 ? "actions/getLobter" : "actions/getLobster";
                    break;
                case "getSpawner":
                    spritename = Math.random() < 0.01 ? "actions/getSpawnerHatted" : "actions/getSpawner";
                    break;
                default:
                    spritename = "actions/" + actionName;
            }
            if (SharkGame.Settings.current.showIcons) {
                const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-action");
                if (iconDiv) {
                    iconDiv.addClass("button-icon");
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
        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        if (action.unauthorized) {
            return false;
        } else if (!_.isUndefined(action.unauthorized)) {
            return true;
        }
        // check to see if this action should be forcibly removed
        if (action.removedBy && home.shouldRemoveHomeButton(action)) {
            return false;
        }

        // check resource prerequisites
        if (action.prereq.resource && !res.checkResources(action.prereq.resource, true)) {
            return false;
        }

        // check if resource cost exists
        if (!_.every(action.cost, (cost) => world.doesResourceExist(cost.resource))) {
            return false;
        }

        // check special worldtype prereqs
        if (action.prereq.world && world.worldType !== action.prereq.world) {
            return false;
        }

        // check the special worldtype exclusions
        if (action.prereq.notWorlds && action.prereq.notWorlds.includes(world.worldType)) {
            return false;
        }

        // check upgrade prerequisites
        if (!_.every(action.prereq.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId))) {
            return false;
        }
        // check if resulting resource exists
        if (!_.every(action.effect.resource, (_amount, resourceId) => world.doesResourceExist(resourceId))) {
            return false;
        }
        // if nothing fails, return true
        return true;
    },

    shouldHomeButtonBeUsable(_actionData) {
        let shouldBeUsable = true;

        if (cad.pause || cad.stop) {
            shouldBeUsable = false;
        }
        // this function might contain more stuff later
        // for now, the only exception to being able to
        // use home buttons is if the game is paused
        return shouldBeUsable;
    },

    shouldRemoveHomeButton(action) {
        let disable = false;
        $.each(action.removedBy, (kind, when) => {
            switch (kind) {
                case "totalResourceThreshold":
                    disable = disable || _.some(when, (resourceObject) => res.getTotalResource(resourceObject.resource) >= resourceObject.threshold);
                    break;
                case "otherActions":
                    disable = disable || _.some(when, (otherAction) => home.areActionPrereqsMet(otherAction));
                    break;
                case "upgrades":
                    disable = disable || _.some(when, (upgrade) => SharkGame.Upgrades.purchased.includes(upgrade));
                    break;
                case "custom":
                    disable = disable || when();
            }
        });
        return disable;
    },

    addButton(actionName) {
        this.buttonNamesList.push(actionName);

        const buttonListSel = $("#buttonList");
        const actionData = SharkGame.HomeActions.getActionTable()[actionName];

        const buttonSelector = SharkGame.Button.makeHoverscriptButton(
            actionName,
            actionData.name,
            buttonListSel,
            home.onHomeButton,
            home.onHomeHover,
            home.onHomeUnhover,
        ); // box-shadow: 0 0 6px 3px #f00, 0 0 3px 1px #ff1a1a inset;
        buttonSelector.html($("<span id='" + actionName + "Label' class='click-passthrough'></span>"));
        home.updateButton(actionName);
        if (SharkGame.Settings.current.showAnimations) {
            buttonSelector.hide().css("opacity", 0).slideDown(50).animate({ opacity: 1.0 }, 50);
        }
        if (home.shouldBeNewlyDiscovered(actionName, actionData)) {
            buttonSelector.addClass("newlyDiscovered");
        }
        // still need to add increases/decreases check here, but this is not relevant to the actual game yet so i dont care
        if (home.doesButtonGiveNegativeThing(actionData)) {
            buttonSelector.addClass("gives-consumer");
        }
    },

    doesButtonGiveNegativeThing(actionData) {
        let givesBadThing = false;
        $.each(actionData.effect.resource, (resourceName) => {
            // still need to add increases/decreases check here, but this is not relevant to the actual game yet so i dont care
            if (
                _.some(
                    SharkGame.ResourceMap.get(resourceName).income,
                    (incomeAmount, resource) =>
                        world.doesResourceExist(resource) &&
                        ((incomeAmount < 0 && !res.isInCategory(resource, "harmful")) || (res.isInCategory(resource, "harmful") && incomeAmount > 0)),
                )
            ) {
                givesBadThing = true;
                return false;
            }
        });
        return givesBadThing;
    },

    shouldBeNewlyDiscovered(actionName, actionData) {
        if (SharkGame.Aspects.pathOfTime.level) {
            if (actionName === "getCrab" && world.doesResourceExist("crab")) return false;
            if (actionName === "getDiver" && world.doesResourceExist("diver")) return false;
        }
        return actionData.newlyDiscovered;
    },

    getActionCategory(actionName) {
        return _.findKey(SharkGame.HomeActionCategories, (category) => {
            return _.some(category.actions, (action) => action === actionName);
        });
    },

    onHomeButton(_placeholder, actionName) {
        const amountToBuy = new Decimal(sharkmath.getBuyAmount());
        let button;
        if (!actionName) {
            // get related entry in home button table
            button = $(this);
            actionName = button.attr("id");
        } else {
            button = $("#" + actionName);
        }

        if (SharkGame.Keybinds.bindMode) {
            SharkGame.Keybinds.settingAction = actionName;
            SharkGame.Keybinds.updateBindModeState();
            return;
        }

        if (button.hasClass("disabled")) return;
        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        let actionCost = {};
        let amount = new Decimal(0);
        if (amountToBuy.lessThan(0)) {
            // unlimited mode, calculate the highest we can go
            const max = home.getMax(action);
            // floor max
            if (max > 0) {
                // convert divisor from a negative number to a positive fraction
                const divisor = new Decimal(1).dividedBy(amountToBuy.times(-1));
                amount = max.times(divisor);
                // floor amount
                amount = amount.round();
                // make it worth entering this function
                if (amount.lessThan(1)) amount = new Decimal(1);
                actionCost = home.getCost(action, amount);
            } else {
                return;
            }
        } else {
            actionCost = home.getCost(action, amountToBuy);
            amount = amountToBuy;
        }

        if ($.isEmptyObject(actionCost) && !amount.equals(0)) {
            // free action
            // do not repeat or check for costs
            if (action.effect.resource) {
                res.changeManyResources(action.effect.resource);
            }
            if (action.effect.events) {
                _.each(action.effect.events, (eventName) => {
                    SharkGame.Events[eventName].trigger();
                });
            }
            log.addMessage(SharkGame.choose(action.outcomes));
        } else if (amount.greaterThan(0)) {
            // cost action
            if (action.effect.events) {
                _.each(action.effect.events, (eventName) => {
                    SharkGame.Events[eventName].trigger();
                });
            }

            // did the player just purchase sharkonium?
            if (actionName === "transmuteSharkonium") {
                // did they only buy one for some reason?
                if (amountToBuy.equals(1)) {
                    // keep track of how many times they've done that
                    if (!SharkGame.persistentFlags.individuallyBoughtSharkonium) {
                        SharkGame.persistentFlags.individuallyBoughtSharkonium = 0;
                    }
                    if (SharkGame.persistentFlags.individuallyBoughtSharkonium !== -1) {
                        SharkGame.persistentFlags.individuallyBoughtSharkonium += 1;
                    }
                } else {
                    // otherwise they know what they're doing, stop keeping track
                    SharkGame.persistentFlags.individuallyBoughtSharkonium = -1;
                }
                // see remindAboutBuyMax event
            }

            // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
            if (res.checkResources(actionCost)) {
                // take cost
                res.changeManyResources(actionCost, true);
                // execute effects
                if (action.effect.resource) {
                    let resourceChange;
                    if (!amount.equals(1)) {
                        resourceChange = res.scaleResourceList(action.effect.resource, amount);
                    } else {
                        resourceChange = action.effect.resource;
                    }
                    res.changeManyResources(resourceChange);
                }
                // print outcome to log
                if (!action.multiOutcomes || amount.equals(1)) {
                    log.addMessage(SharkGame.choose(action.outcomes));
                } else {
                    log.addMessage(SharkGame.choose(action.multiOutcomes));
                }
            } else {
                log.addMessage("You can't afford that!");
            }
        }
        if (button.hasClass("newlyDiscovered")) {
            SharkGame.HomeActions.getActionTable()[actionName].newlyDiscovered = false;
            button.removeClass("newlyDiscovered");
        }
        // disable button until next frame
        button.addClass("disabled");
    },

    onHomeHover(mouseEnterEvent, actionName) {
        if (!SharkGame.Settings.current.showTooltips || (!actionName && !mouseEnterEvent) || !main.shouldShowTooltips()) {
            return;
        }

        if (!actionName) {
            const button = $(this);
            actionName = button.attr("id");
        }

        $("#tooltipbox").removeClass("gives-consumer");

        const actionData = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        const effects = actionData.effect;
        const validGenerators = {};
        $.each(effects.resource, (resource) => {
            $.each(SharkGame.ResourceMap.get(resource).income, (incomeResource) => {
                const genAmount = res.getProductAmountFromGeneratorResource(resource, incomeResource, 1);
                if (genAmount !== 0 && world.doesResourceExist(incomeResource)) {
                    validGenerators[incomeResource] = genAmount;
                }
            });
        });

        let buyingHowMuch = 1;
        if (
            !SharkGame.Settings.current.alwaysSingularTooltip &&
            actionData.cost.length > 0 &&
            !_.some(actionData.cost, (costData) => {
                return costData.costFunction === "unique";
            })
        ) {
            buyingHowMuch = sharkmath.getPurchaseAmount(undefined, home.getMax(actionData).toNumber());
            if (buyingHowMuch < 1) {
                buyingHowMuch = 1;
            }
        }

        const usePlural =
            (_.some(effects.resource, (_amount, name) => sharktext.getDeterminer(name)) &&
                (buyingHowMuch > 1 || _.some(effects.resource, (amount) => amount > 1))) ||
            _.keys(effects.resource).length > 1;
        let addedAnyLabelsYet = false; // this keeps track of whether or not little tooltip text has already been appended

        // append valid stuff for generators like production
        let text = "";

        if (_.some(validGenerators, (amount) => amount > 0)) {
            if (_.some(validGenerators, (amount, resourceName) => amount > 0 && res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>PRODUCE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
        }

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount > 0) {
                text +=
                    sharktext
                        .beautifyIncome(
                            buyingHowMuch * amount,
                            " " +
                                sharktext.getResourceName(incomeResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")),
                        )
                        .bold() + "<br/>";
            }
        });

        if (_.some(validGenerators, (amount) => amount < 0)) {
            if (_.some(validGenerators, (amount, resourceName) => amount < 0 && !res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "CONSUME" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
        }

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount < 0) {
                text +=
                    sharktext
                        .beautifyIncome(
                            -buyingHowMuch * amount,
                            " " +
                                sharktext.getResourceName(incomeResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")),
                        )
                        .bold() + "<br/>";
            }
        });

        const condensedObject = res.condenseNode(effects.resource);

        if (!$.isEmptyObject(condensedObject.resAffect.increase)) {
            if (_.some(validGenerators, (_degree, resourceName) => res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "INCREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.increase, (affectedResource, degreePerPurchase) => {
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.decrease)) {
            if (_.some(condensedObject.resAffect.decrease, (_degree, resourceName) => !res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "DECREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.decrease, (affectedResource, degreePerPurchase) => {
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.multincrease)) {
            if (_.some(condensedObject.resAffect.multincrease, (_degree, resourceName) => res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY INCREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.multincrease, (affectedResource, degreePerPurchase) => {
                degreePerPurchase = degreePerPurchase ** buyingHowMuch - 1;
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharkmath.beautif(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.multdecrease)) {
            if (_.some(condensedObject.resAffect.multdecrease, (_degree, resourceName) => !res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY DECREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.multdecrease, (affectedResource, degreePerPurchase) => {
                degreePerPurchase = 1 - degreePerPurchase ** buyingHowMuch;
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.increase)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "INCREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.increase, (affectedGenerator, degreePerPurchase) => {
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.decrease)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "DECREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.decrease, (affectedGenerator, degreePerPurchase) => {
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.multincrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY INCREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.multincrease, (affectedGenerator, degreePerPurchase) => {
                degreePerPurchase = degreePerPurchase ** buyingHowMuch - 1;
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.multdecrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY DECREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.multdecrease, (affectedGenerator, degreePerPurchase) => {
                degreePerPurchase = 1 - degreePerPurchase ** buyingHowMuch;
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (actionData.getSpecialTooltip) {
            text += actionData.getSpecialTooltip() + "<br>";
        }

        if (SharkGame.HomeActions.getActionTable()[actionName].helpText) {
            text +=
                "<hr class='hrForTooltipSeparation'><span class='medDesc'>" + SharkGame.HomeActions.getActionTable()[actionName].helpText + "</span>";
        }

        $.each(effects.resource, (resource, amount) => {
            if (buyingHowMuch * amount !== 1) {
                text =
                    sharktext.beautify(buyingHowMuch * amount).bold() +
                    " " +
                    sharktext
                        .getResourceName(resource, false, buyingHowMuch * amount, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        .bold() +
                    "<br>" +
                    (SharkGame.Settings.current.tooltipQuantityReminders
                        ? "<span class='medDesc littleTooltipText'>(you have " + sharktext.beautify(res.getResource(resource)) + ")</span><br>"
                        : "") +
                    text;
            } else {
                const determiner = sharktext.getDeterminer(resource);
                text =
                    (determiner ? determiner + " " : "") +
                    sharktext.getResourceName(resource, false, 1, sharkcolor.getElementColor("tooltipbox", "background-color")).bold() +
                    "<br>" +
                    (SharkGame.Settings.current.tooltipQuantityReminders
                        ? "<span class='medDesc littleTooltipText'>(you have " + sharktext.beautify(res.getResource(resource)) + ")</span><br>"
                        : "") +
                    text;
            }
        });

        if (document.getElementById("tooltipbox").innerHTML !== text.replace(/'/g, '"').replace(/br\//g, "br")) {
            document.getElementById("tooltipbox").innerHTML = text;
        }

        if ($("#tooltipbox").attr("current") !== actionName) {
            $("#tooltipbox").removeClass("forIncomeTable").attr("current", "");
            $("#tooltipbox").addClass("forHomeButtonOrGrotto").attr("current", actionName);
        } else {
            $("#tooltipbox").removeClass("forIncomeTable").addClass("forHomeButtonOrGrotto");
        }
    },

    onHomeUnhover() {
        document.getElementById("tooltipbox").innerHTML = "";
        $("#tooltipbox").removeClass("forHomeButtonOrGrotto").attr("current", "").removeClass("gives-consumer");
    },

    getCost(action, amount) {
        /** @type {Record<Resource, number>} */
        const calcCost = {};
        const rawCost = action.cost;

        _.each(rawCost, (costObj) => {
            const resource = SharkGame.PlayerResources.get(action.max);
            const currAmount = new Decimal(resource.amount);
            const priceIncrease = new Decimal(costObj.priceIncrease);
            let cost = new DecimalHalfRound(0);

            switch (costObj.costFunction) {
                case "constant":
                    cost = sharkmath.constantCost(currAmount, amount, priceIncrease);
                    break;
                case "linear":
                    cost = sharkmath.linearCost(currAmount, amount, priceIncrease);
                    break;
                case "unique":
                    cost = sharkmath.uniqueCost(currAmount, amount, priceIncrease);
                    break;
            }
            if (cost.abs().minus(cost.round()).lessThan(SharkGame.EPSILON)) {
                cost = cost.round();
            }
            calcCost[costObj.resource] = cost;
        });
        return calcCost;
    },

    getMax(action) {
        let max = new Decimal(1);
        if (action.max) {
            // max is used as the determining resource for linear cost functions
            const resource = SharkGame.PlayerResources.get(action.max);
            const currAmount = new Decimal(resource.amount);
            max = new Decimal(1e308);
            _.each(action.cost, (costObject) => {
                const costResource = new Decimal(SharkGame.PlayerResources.get(costObject.resource).amount);
                const priceIncrease = new Decimal(costObject.priceIncrease);
                let subMax = new DecimalHalfRound(-1);

                switch (costObject.costFunction) {
                    case "constant":
                        subMax = sharkmath.constantMax(typeof costResource === "object" ? new Decimal(0) : 0, costResource, priceIncrease);
                        break;
                    case "linear":
                        subMax = sharkmath.linearMax(currAmount, costResource, priceIncrease).minus(currAmount);
                        break;
                    case "unique":
                        subMax = sharkmath.uniqueMax(currAmount, costResource, priceIncrease).minus(currAmount);
                        break;
                }
                // prevent flashing action costs
                if (subMax.minus(subMax.round()).abs().lessThan(SharkGame.EPSILON)) {
                    subMax = subMax.round();
                }
                subMax = new Decimal(subMax);
                max = Decimal.min(max, subMax);
            });
        }
        return max.round();
    },
};
