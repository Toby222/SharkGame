"use strict";
// welcome to the events system!
// events are an important piece of a larger puzzle I'm trying to solve related to adding lots of behavior into the game
// events will allow miscellaneous behavior to be organized into a single object
// miscellaneous behavior is anything which does not belong in the core game loop.
// Toby: Then why is it running in the core game loop?
// this has the same purpose of the modifier system: flexibility while retaining performance and organization.
//
// events have triggers; they are very rigid, so we also need a system with which to trigger them
// the ways we might trigger events:
// - on buying an upgrade
// - purposefully queuing up an event to have its requirements checked every tick until success
// - on using the recycler
// - on using a home button
//
// a system will be implemented to handle events which will simply be called every tick before and after regular processing.
//
SharkGame.Events = {
    frigidInitiateIcyDoom: {
        handlingTime: "beforeTick",
        priority: 2,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.includes("civilContact")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            SharkGame.ResourceIncomeAffectors.ice.multiply.ice = -(1 / 666);
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidThaw: {
        handlingTime: "beforeTick",
        priority: 3,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.indexOf("rapidRecharging") > -1) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.applyModifier("planetaryIncome", "ice", -51);
            SharkGame.ResourceMap.get("heater").baseIncome = {
                kelp: 0,
                ice: 0,
            };
            SharkGame.ResourceMap.get("heater").desc = "Kept ice at bay. Not very useful anymore.";
            res.reapplyModifiers("heater", "kelp");
            res.reapplyModifiers("heater", "ice");
            SharkGame.ResourceIncomeAffectors.ice.multiply.ice = 0;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidEmergencyIceCap: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            if (res.getResource("ice") > 999) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.setResource("ice", 999);
            return true;
        },
    },
    frigidAddUrchin: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.frigidAddedUrchin) {
                SharkGame.Resources.changeResource("urchin", 1);
                SharkGame.flags.frigidAddedUrchin = true;
            }
        },
    },
    abandonedRefundInvestigators: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.abandonedRefundedInvestigators) {
                SharkGame.Resources.changeResource("investigator", 500);
                SharkGame.flags.abandonedRefundedInvestigators = true;
            }
        },
    },
    volcanicEnsureSponge: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "volcanic") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.includes("agriculture") && res.getResource("sponge") < 1) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.changeResource("sponge", 1); // sponge should never ever go below one once you have access to farms
            return true;
        },
    },
    volcanicHandleAlgaeSpongeRelationship: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "volcanic") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.includes("spongeCollection")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            const underfeeding = SharkGame.ResourceMap.get("specialResourceOne");
            if (!underfeeding.baseIncome) {
                underfeeding.baseIncome = { sponge: 0 };
                underfeeding.income = { sponge: 0 };
            }

            const sponge = res.getResource("sponge");
            const algae = res.getResource("algae");
            const limitRatio = SharkGame.Upgrades.purchased.includes("feedingTechniques") ? 4 : 1;
            if (sponge / algae > limitRatio) {
                underfeeding.baseIncome.sponge = -(sponge - algae * limitRatio);
            } else {
                underfeeding.baseIncome.sponge = 0;
            }
            res.reapplyModifiers("specialResourceOne", "sponge");
            return true;
        },
    },
    volcanicToggleSmelt: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (SharkGame.flags.autoSmelt) {
                SharkGame.flags.autoSmelt = false;
            } else {
                SharkGame.flags.autoSmelt = true;
            }
        },
    },
    volcanicHandleAutoSmelt: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "volcanic") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.includes("superSmelting")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            const sponge = res.getResource("sponge");
            const sand = res.getResource("sand");
            const vents = SharkGame.ResourceMap.get("world");

            vents.baseIncome.sponge = 0;
            vents.baseIncome.sand = 0;
            vents.baseIncome.porite = 0;

            if (SharkGame.flags.autoSmelt) {
                const spongeCost = SharkGame.HomeActions.volcanic.smeltPorite.cost[0].priceIncrease;
                const sandCost = SharkGame.HomeActions.volcanic.smeltPorite.cost[1].priceIncrease;
                const maxSpongeCycles = sponge / spongeCost;
                const maxSandCycles = sand / sandCost;
                if (maxSpongeCycles >= 1 && maxSandCycles >= 1) {
                    const max = Math.min(maxSpongeCycles, maxSandCycles);
                    vents.baseIncome.sponge = (-max * spongeCost) / 2;
                    vents.baseIncome.sand = (-max * sandCost) / 2;
                    vents.baseIncome.porite = max / 2;
                }
            }
            res.reapplyModifiers("world", "sponge");
            res.reapplyModifiers("world", "sand");
            res.reapplyModifiers("world", "porite");
            return true;
        },
    },
    volcanicGlassTempering: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.farmer.multiply.spongeFarm *= 2;
            SharkGame.GeneratorIncomeAffectors.farmer.multiply.coralFarm *= 2;
            SharkGame.ResourceIncomeAffectors.researcher.multiply.science *= 2;
            SharkGame.ResourceIncomeAffectors.shoveler.multiply.sand *= 2;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    volcanicFirstDraft: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.ResourceIncomeAffectors.shoveler.multiply.sand *= 2;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    volcanicSuperShovels: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.ResourceIncomeAffectors.shoveler.multiply.sand *= 4;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    volcanicSecondDraft: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.farmer.multiply.spongeFarm *= 2;
            SharkGame.GeneratorIncomeAffectors.farmer.multiply.coralFarm *= 2;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    volcanicCrabReform: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.ResourceIncomeAffectors.researcher.multiply.science *= 4;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    volcanicTallyPrySponge: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.prySpongeGained) SharkGame.flags.prySpongeGained = 0;
            SharkGame.flags.prySpongeGained += SharkGame.HomeActions.getActionData(
                SharkGame.HomeActions.getActionTable(),
                "prySponge",
            ).effect.resource.sponge;
        },
    },
    volcanicBoughtFarm: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (SharkGame.flags.prySpongeGained < 200) {
                SharkGame.flags.gotFarmsBeforeShrimpThreat = true;
            }
        },
    },
    revealBuyButtons: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.persistentFlags.revealedBuyButtons) {
                return "remove";
            }
            if (res.getTotalResource("crab") > 12 || res.getTotalResource("crystal") > 12) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            SharkGame.persistentFlags.revealedBuyButtons = true;
            SharkGame.TabHandler.setUpTab();
        },
    },
    revealButtonTabs: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (world.worldType === "start" && !SharkGame.persistentFlags.revealedButtonTabs) {
                if (res.getTotalResource("scientist") > 0) {
                    return "trigger";
                }
                return "pass";
            }
            SharkGame.persistentFlags.revealedButtonTabs = true;
            return "remove";
        },
        trigger() {
            SharkGame.persistentFlags.revealedButtonTabs = true;
            SharkGame.TabHandler.setUpTab();
        },
    },
    /* getAllAffordableUpgrades */
    updateLabNotifier: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.TabHandler.isTabUnlocked("lab")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            if (SharkGame.Lab.findAllAffordableUpgrades().length) {
                $("#tab-lab").html(`(<strong>!</strong>) ${SharkGame.Lab.tabName}`);
            } else {
                $("#tab-lab").html(`${SharkGame.Lab.tabName}`);
            }
            return true;
        },
    },
    remindAboutBuyMax: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.persistentFlags.individuallyBoughtSharkonium === -1) {
                return "remove";
            }
            if (SharkGame.persistentFlags.individuallyBoughtSharkonium >= 50) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            if (sharkmath.getBuyAmount() === 1 && SharkGame.Tabs.current === "home") {
                $("#buy--1").addClass("reminderShadow");
            } else {
                $("#buy--1").removeClass("reminderShadow");
                SharkGame.persistentFlags.individuallyBoughtSharkonium = 49;
            }
            return true;
        },
    },
    aspectRefresh: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "trigger";
        },
        trigger() {
            if (world.worldType === "volcanic") {
                res.reapplyModifiers("aspectAffect", "coral");
            } else {
                res.reapplyModifiers("aspectAffect", "crystal");
            }
            return true;
        },
    },
    resetPressAllButtonsKeybind: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (!SharkGame.gameOver) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            SharkGame.flags.pressedAllButtonsThisTick = false;
            return true;
        },
    },
    tempestuousHandleStorm: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "tempestuous") {
                return "remove";
            }
            return "trigger";
        },
        trigger() {
            if (!SharkGame.flags.storm) {
                SharkGame.flags.storm = {
                    fish: -0.02,
                    sand: -0.02,
                    crystal: -0.02,
                    shark: -0.02,
                    ray: -0.02,
                    crab: -0.02,
                };
            }

            const storm = SharkGame.ResourceMap.get("world");
            const predictedTimeUntilNextTick = res.getGameSpeedModifier();
            if (!storm.baseIncome) {
                storm.baseIncome = {};
                storm.income = {};
            }
            $.each(SharkGame.flags.storm, (resourceName, removalRatio) => {
                if (world.doesResourceExist(resourceName)) {
                    storm.baseIncome[resourceName] =
                        (predictedTimeUntilNextTick * res.getResource(resourceName) * removalRatio) / (1 - predictedTimeUntilNextTick * removalRatio);
                }
                res.reapplyModifiers("world", resourceName);
            });
            $.each(SharkGame.flags.storm, (name, ratio) => {
                if (ratio === 0) {
                    delete SharkGame.flags.storm[name];
                }
            });
            return true;
        },
    },
    tempestuousFindCave: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.storm) {
                SharkGame.flags.storm = {
                    fish: -0.02,
                    sand: -0.02,
                    crystal: -0.02,
                    shark: -0.02,
                    ray: -0.02,
                    crab: -0.02,
                };
            }
            _.each(["fish", "sand", "crystal", "shark", "ray", "crab"], (resourceName) => {
                SharkGame.flags.storm[resourceName] = 0;
                const resourceAmount = res.getResource(resourceName);
                res.setResource(resourceName, Math.floor(resourceAmount));
            });
        },
    },
    tempestuousGiveSeagrass: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.gaveSeagrass) {
                SharkGame.flags.gaveSeagrass = true;
                res.changeResource("seagrass", 20);
            }
        },
    },
    tempestuousEmergencySeagrass: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "tempestuous") {
                return "remove";
            } else if (SharkGame.flags.gaveSeagrass && res.getResource("seagrass") < 10 && res.getResource("stormgoer") < 1) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.setResource("seagrass", 20);
        },
    },
    tempestuousMapSequence: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "tempestuous") {
                return "remove";
            } else if (SharkGame.Upgrades.purchased.includes("cartographicCompleteness")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.setResource("map", 1);
            res.setTotalResource("map", 1);
            res.changeResource("billfish", res.getResource("billfishExplorer"));
            SharkGame.Lab.addUpgrade("senseOfDirection");
            SharkGame.Lab.addUpgrade("routing");
            SharkGame.Lab.addUpgrade("universalNavigation");

            _.each(res.tokens.list, (token) => {
                if (
                    SharkGame.flags.tokens[token.attr("id")].includes("chart") ||
                    SharkGame.flags.tokens[token.attr("id")].includes("billfishExplorer")
                ) { res.tokens.tryReturnToken(null, false, token); }
            });
            SharkGame.flags.mapSequenceCompleted = true;

            res.setResource("chart", 0);
            res.setTotalResource("chart", 0);
            res.setResource("billfishExplorer", 0);
            res.setTotalResource("billfishExplorer", 0);
            SharkGame.PlayerResources.get("chart").discovered = false;
            res.reconstructResourcesTable();
            SharkGame.TabHandler.setUpTab();
        },
    },
    tempestuousInternalExploration: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.billfishMechanic.multiply.sandDigger *= 5;
            SharkGame.GeneratorIncomeAffectors.billfishMechanic.multiply.fishMachine *= 5;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
};
