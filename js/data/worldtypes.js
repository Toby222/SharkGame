"use strict";
SharkGame.WorldTypes = {
    test: {
        name: "Test",
        desc: "You REALLY shouldn't be seeing this.",
        shortDesc: "testing",
        entry: "You enter a debug ocean.",
        style: "default",
        absentResources: [],
        modifiers: [],
        gateRequirements: {
            slots: {
                fish: 1e3,
                sand: 1e3,
                crystal: 1e3,
                kelp: 1e3,
                seaApple: 1e3,
                sharkonium: 1e3,
            },
        },
    },
    start: {
        name: "Home",
        desc: "...",
        shortDesc: "strange blue",
        foresight: {
            longDesc: "...Home.",
            missing: [],
            present: [],
            tip: "...",
        },
        entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
        style: "default",
        includedResources: ["basics", "sharks", "rays", "crabs", "basicmaterials", "kelpstuff", "sharkmachines"],
        modifiers: [],
        // initial gate cost, scaled by planetary level
        gateRequirements: {
            slots: {
                fish: 1e7,
                sand: 1e6,
                crystal: 1e6,
                kelp: 1e6,
                seaApple: 5e5,
                sharkonium: 8e5,
            },
        },
    },
    marine: {
        name: "Marine",
        vagueDesc: "Feels familiar.",
        desc: "A serene, blue marble.",
        shortDesc: "strange blue",
        foresight: {
            vagueLongDesc: "This place is so familiar.",
            longDesc: "A vast, blue ocean, swarming with fish.",
            missing: ["laser"],
            present: ["clam", "lobster"],
            tip: "",
        },
        entry: "You enter a serene blue sea, all your previous knowledge a dim memory.",
        style: "default",
        includedResources: [
            "basics",
            "sharks",
            "rays",
            "crabs",
            "lobsters",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "clam",
            "lobstermachines",
            "clamAspectSacrifice",
        ],
        absentResources: ["laser"],
        modifiers: [{ type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 2 }],
        gateRequirements: {
            slots: {
                fish: 1e11,
                clam: 1e22,
                crystal: 1e11,
                kelp: 1e9,
                calcinium: 1e10,
                sharkonium: 1e10,
            },
        },
        par: 55,
    },
    haven: {
        name: "Haven",
        vagueDesc: "Feels lively.",
        desc: "An aquamarine world of plenty. So beautiful, yet so vulnerable.",
        shortDesc: "thriving aquamarine",
        foresight: {
            vagueLongDesc: "You can sense a lot of activity in this world.",
            longDesc: "The water is clear, the sand is clean, and the fish are plenty. A paradise in every way.",
            missing: ["laser", "sharkonium"],
            present: ["coral", "dolphin", "whale"],
            tip: "The abundance of resources might make your stay here shorter than others.",
        },
        entry: "Remembering nothing, you find yourself in a beautiful atoll. Life will be good here.",
        style: "haven",
        includedResources: [
            "basics",
            "sharks",
            "rays",
            "crabs",
            "dolphins",
            "whales",
            "basicmaterials",
            "kelpstuff",
            "dolphinmachines",
            "coral",
            "chorus",
            "coralAspectSacrifice",
        ],
        absentResources: ["laser"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "breeders", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1 },
        ],
        gateRequirements: { resources: { chorus: 1 } },
        par: 35,
    },
    tempestuous: {
        name: "Tempestuous",
        desc: "A swirling maelstrom where nothing rests.",
        vagueDesc: "Feels turbulent.",
        shortDesc: "swirling grey",
        foresight: {
            vagueLongDesc: "It's hard to feel out this place. Everything's constantly moving.",
            longDesc:
                "A terrible storm has taken up residence here. It's hard to think, much less get anything done, with all the strong currents whipping stuff around.",
            missing: ["kelp", "seaApple", "crystalMiner"],
            present: ["billfish", "seagrass"],
        },
        entry: "You recall nothing and know only the storms. The unrelenting, restless storms scattering your possessions and allies.",
        style: "tempestuous",
        includedResources: [
            "basics",
            "sharks",
            "rays",
            "crabs",
            "stormgoer",
            "billfishes", // gramatically awful but thats just how it is
            "sharkmachines",
            "basicmaterials",
            "seagrass",
            "chart",
            "map",
            "seagrassAspectSacrifice",
        ],
        absentResources: ["planter", "crystalMiner"],
        modifiers: [{ type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "sandDigger", amount: 24 }],
        gateRequirements: { upgrades: ["cumulusControl"] },
        par: 55,
    },
    volcanic: {
        name: "Volcanic",
        vagueDesc: "Feels hot.",
        desc: "An ocean close to boiling and choking under sulphuric fumes.",
        shortDesc: "searing red",
        foresight: {
            vagueLongDesc: "Horrible heat sears your mind from afar.",
            longDesc: "Despite its seemingly inhospitable atmosphere, this world is teeming with life.",
            missing: ["crystal", "shark", "kelp"],
            present: ["coral", "sponge", "algae", "shrimp"],
        },
        entry: "The burning waters sear the last traces of your past experiences from you. From beneath, the vents spew forth a heavy cloud of smoke.",
        style: "volcanic",
        includedResources: [
            "basics",
            "rays",
            "shoveler",
            "crabs",
            "curiousCrab",
            "researcher",
            "shrimps",
            "spongeFarm",
            "coralFarm",
            "basicmaterials",
            "porite",
            "sponge",
            "algae",
            "coral",
            "volcanicAspectSacrifice",
        ],
        absentResources: ["crystal", "laser", "planter"],
        modifiers: [{ type: "multiplier", modifier: "planetaryFishMultiplier", resource: "ray", amount: 15 }],
        gateRequirements: { upgrades: ["apologeticAmnesty"] },
        par: 55,
    },
    abandoned: {
        name: "Abandoned",
        vagueDesc: "Feels grimy.",
        desc: "A dying world filled with machinery.",
        shortDesc: "murky dark green",
        foresight: {
            vagueLongDesc: "This world has an aura of death and apathy.",
            get longDesc() {
                return (
                    "The water here is dank and tinted green by " +
                    (gateway.isWorldBeaten("abandoned")
                        ? sharktext.getResourceName("tar", undefined, undefined, sharkcolor.getElementColor("pane")) + "."
                        : "an unrecognizable substance.") +
                    " Husks of machinery litter the ocean floor."
                );
            },
            missing: ["seaApple", "kelp"],
            present: ["octopus", "sponge", "clam", "tar"],
            get tip() {
                return (
                    "This ocean is polluted with " +
                    (gateway.isWorldBeaten("abandoned")
                        ? sharktext.getResourceName("tar", undefined, undefined, sharkcolor.getElementColor("pane"))
                        : "an unrecognizable substance" + ". It is only harmful when machines produce it.")
                );
            },
        },
        entry: "The water is tainted. The pungent smell snaps you awake to the lifeless landscape. You do not know who left this world so torn and empty.",
        style: "abandoned",
        bonus: 1,
        includedResources: [
            "essence",
            "sharks",
            "rays",
            "crabs",
            "octopuses",
            "basicmaterials",
            "sharkmachines",
            "octopusmachines",
            "sponge",
            "clam",
            "collector",
            "tar",
            "filter",
            "ancientPart",
            "world",
            "aspectAffect",
            "spongeAspectSacrifice",
        ],
        absentResources: ["kelp", "seaApple", "planter"],
        modifiers: [{ type: "multiplier", modifier: "planetaryIncome", resource: "tar", amount: -0.02 }],
        gateRequirements: { upgrades: ["artifactAssembly"] },
        par: 45,
    },
    shrouded: {
        name: "Shrouded",
        vagueDesc: "Feels mysterious.",
        desc: "A dark, murky ocean of secrecy.",
        foresight: {
            vagueLongDesc: "You feel a strange power radiating from this world.",
            get longDesc() {
                return `This place is completely shrouded in darkness. Glowing ${sharktext.getResourceName(
                    "crystal",
                    false,
                    69,
                    sharkcolor.getElementColor("pane"),
                )} litter the water and strange figures lurk among the endless shadows.`;
            },
            missing: ["kelp", "crab", "laser"],
            present: ["jellyfish", "chimaera", "eel"],
        },
        shortDesc: "dark mysterious",
        entry: "Blackness. You know only blindness in these dark forsaken waters. Foggy memory leads you to follow a stream of crystals.",
        style: "shrouded",
        includedResources: [
            "essence",
            "sharks",
            "diver",
            "rays",
            "eels",
            "chimaeras",
            "basicmaterials",
            "sharkmachines",
            "arcana",
            "scholar",
            "jellyfish",
            "sacrifice",
            "aspectAffect",
            "jellyAspectSacrifice",
        ],
        absentResources: ["laser"],
        modifiers: [{ type: "multiplier", modifier: "planetaryIncomeReciprocalMultiplier", resource: "scientist", amount: 1 }],
        gateRequirements: {
            upgrades: ["arcaneActivation"],
        },
        par: 50,
    },
    frigid: {
        name: "Frigid",
        vagueDesc: "Feels chilly.",
        desc: "An arctic ocean dangling on the edge of frozen doom.",
        shortDesc: "freezing white",
        foresight: {
            vagueLongDesc: "Bitter cold stings your mind from afar.",
            longDesc: "The world is mostly frozen, but a small pocket of warmer water seems to preserve what little chance life has here.",
            missing: ["seaApple", "ray"],
            present: ["squid", "urchin"],
            get tip() {
                return (
                    "This world has " +
                    sharktext.getResourceName("ice", undefined, undefined, sharkcolor.getElementColor("pane")) +
                    ". " +
                    sharktext.getResourceName("ice", undefined, undefined, sharkcolor.getElementColor("pane")) +
                    " will slow some of the frenzy, and will be present from the start."
                );
            },
        },
        entry: "The arctic water freezes away whatever thoughts you may have had. So cold.",
        style: "frigid",
        includedResources: [
            "sharks",
            "crabs",
            "squids",
            "urchins",
            "basicmaterials",
            "kelp",
            "sharkmachines",
            "ice",
            "heater",
            "essence",
            "world",
            "aspectAffect",
            "kelpAspectSacrifice",
        ],
        modifiers: [
            {
                type: "multiplier",
                modifier: "planetaryIncome",
                resource: "ice",
                amount: 1,
            },
        ],
        gateRequirements: {
            slots: {
                sand: 1e7,
                crystal: 1e7,
                kelp: 5e7,
                heater: 40,
                sharkonium: 1e6,
                fish: 2e8,
            },
        },
        par: 45,
    },
    template: { // this version updated by Three Eels
        name: "template",
        vagueDesc: "feels ______", // before scouting
        desc: "description in gateway", // after you've scouted it
        shortDesc: "status", // you are a shark in a ____ ____ sea
        foresight: { // field for the info the foresight aspect gives
            vagueLongDesc: "", // more detailed description, before scouting
            longDesc: "", // more detailed description, after scouting
            missing: [], // states the absent resources
            present: [], // states the world-specific resources included
            tip: "", // give a tip for gameplay
        },
        entry: "enter world", // message put in the log upon entry. describe the setting, and emphasise a lack of memory of previous events.
        style: "default", // change to the ocean's name
        includedResources: [ // for every present resource, e.g. the normal things + the world's frenzy member, special resource, clams/jellyfish/sponge, machine-making material, and machines
            "essence",
            "world",
            "aspectAffect",
            "basicmaterials", // sand, fish, crystals, etc.
            "sharks",
            "rays",
            "crabs",
            "kelpstuff", // includes kelp and sea apples
            "sharkmachines", // remove if sharks or their machines are absent from the narrative
        ],
        absentResources: ["knowledge", "tar", "ice", "heater", "chimaera"], // replace with resources that are essentially incapable of existing in the ocean
        modifiers: [{ type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1.5 }], // for any world-applied multipliers/generation
        // gateType: "slots",
        // the above field doesn't seem to do anything, nor is it present in the other worldtypes, so I removed it
        gateRequirements: { // can also be an upgrade or the presence of a resource, e.g. the whale chorus
            slots: {
                fish: 1,
                sand: 1,
                crystal: 1,
                kelp: 1,
                seaApple: 1,
                sharkonium: 1,
            },
        },
        par: 45, // how long the par time is in minutes
    },
    shore: { // around 4/5ths done
        name: "Shore",
        vagueDesc: "Feels shallow.",
        desc: "A shallow, sandy beachfront cornered by a vicious sandstorm.",
        shortDesc: "small sandy",
        foresight: {
            vagueLongDesc: "Something coarse pelts your mind from afar.",
            longDesc: "A shifting ocean of coarse sand - a wall of it on one side and a storm of it on the other. It seems that to thrive here, one must venture beyond.",
            missing: ["kelp", "laser", "sandDigger"],
            present: ["mudskipper", "caracara", "driftwood", /* "coral", */"seagrass"],
            tip: "This world has rough sand, which will slowly devour the frenzy.<br>Be vigilant of how many resources you have left.",
        },
        entry: "Rough sand pelts your skin, and swirling clouds of sand obscure your vision. No time for pondering - not that you can remember much, anyway.",
        style: "shore",
        includedResources: [
            // "coral",
            "driftwood",
            "intel",
            "seagrass",
            "sharks",
            "rays",
            "crab",
            "brood",
            "stabilizer",
            "mudskippers",
            "caracaras",
            "basicmaterials",
            "sharkmachines",
            "mudskipperpuppets",
            // "coralFarm",
            "seagrassFarm",
            "exchangeStation",
            // "receiverNode",
            "roughSand",
            "essence",
            "world",
            "aspectAffect",
            "seagrassAspectSacrifice",
        ],
        absentResources: ["kelp", "seaApple", "laser", "planter", "sandDigger"],
        modifiers: [
            // { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "crab", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "sand", amount: 2.5 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "crystal", amount: 2 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "roughSand", amount: 1.75 },
        ],
        // gateType: "slots",
        gateRequirements: { resources: { gatemasterPuppet: 1 } },
        par: 50,
    },
    stone: {
        name: "Stone",
        desc: "A world unweathered by ocean currents. It has no natural sand.",
        shortDesc: "rock-bottom",
        entry: "As you enter, the usual shades of green and yellow are nowhere to be found. You look down, and there's no sand: just cold, hard slate.",
        style: "default",
        absentResources: [
            "knowledge",
            "tar",
            "ice",
            "heater",
            "chimaera",
            "dolphin",
            "kelp",
            "coral",
            "eel",
            "sandDigger",
            "treasurer",
            "philosopher",
            "jellyfish",
        ],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "sponge", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "shrimp", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "clamCollector", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "eggBrooder", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "sprongeSmelter", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "ray", amount: 5 },
            { type: "restriction", modifier: "planetaryGeneratorRestriction", resource: "ray", amount: "sand" },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "lobster",
                amount: "sand",
            },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "scavenger",
                amount: "sand",
            },
        ],
        gateType: "slots",
        gateCosts: {
            gravel: 1e9,
            sand: 1e6,
            crystal: 1e8,
            pulverizer: 2,
            sponge: 1e9,
            clam: 1e7,
        },
    },
};
