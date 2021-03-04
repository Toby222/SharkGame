// SECRET PLANS
// SECRET PLANS
//
// secret plans for v0.2, please do not read if you don't wanna be spoiled:
// marine: lobsters, clams
// haven: dolphins, whales, and coral :check:
// chaotic: scrap completely
// tempestuous: swordfish and the storm. lots of stuff related to that storm
// violent: shrimp, coral, sponge, algae, crustacean machines
// abandoned: octopuses, sponge and clams?
// shrouded: eels, chimaera, and jellyfish, no crabs
// frigid: squid and urchins, squids replace rays, maybe sponge or clams? or new resource?
//
// it would be interesting to have clams as a resource in one world but as a frenzy member in another
//
// marine justification: lobsters are often found in coastal regions and hunt clams. they are well-suited to a temperate sea
//
// haven justification: while various species of whale appear everywhere, they are closely tied to dolphins,
// who live primarily in warm environments. coral is also very cleanly tied into dolphin progression
//
// chaotic: idk yet lol
//
// tempestuous justification: swordfish are fast predators, and are likely to survive well in such an environment.
//
// violent justification: shrimp are capable of living in a wide, wide variety of environments.
// so is algae, and coral, and especially sponge. these factors make them more likely to adapt to the heat,
// more specifically, to have a particular species that is adapted to the heat.
//
// abandoned justification: octopuses are sensitive to pollution, but the game establishes that they have dirty machinery and such.
// caring only about efficiency, they fit the bill thematically.
//
// shrouded justification: eels and chimaeras are both arguably mysterious creatures, and the eel pallete somewhat matches the theme.
//
// frigid justification: squids and sea urchin live in arctic seas. urchins eat kelp, giving kelp another use.
//
// SECRET PLANS
// SECRET PLANS

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
        desc: "You shouldn't be seeing this.",
        shortDesc: "strange blue",
        entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
        style: "default",
        includedResources: ["sharks", "rays", "crabs", "basicmaterials", "kelpstuff", "sharkmachines", "essence"],
        modifiers: [],
        // initial gate cost, scaled by planetary level
        gateRequirements: {
            slots: {
                fish: 1e7,
                sand: 1e6,
                crystal: 1e6,
                kelp: 1e5,
                seaApple: 1e5,
                sharkonium: 1e6,
            },
        },
    },
    marine: {
        name: "Marine",
        desc: "A serene blue world. Peaceful, beautiful, so close to home.",
        shortDesc: "strange blue",
        entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
        style: "default",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "lobsters",
            "shrimps",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "crustaceanmachines",
            "coral",
            "
        ], */
        absentResources: ["tar", "ice", "heater", "shrimp", "chimaera", "eel", "jellyfish"],
        modifiers: [{ type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1.5 }],
        gateRequirements: {
            slots: {
                fish: 1e9,
                sand: 1e7,
                crystal: 1e7,
                kelp: 1e7,
                seaApple: 1e6,
                sharkonium: 1e6,
            },
        },
    },
    chaotic: {
        name: "Chaotic",
        desc: "A frenetic world, torn by immaterial force.",
        shortDesc: "swirling teal",
        entry: "You enter a chaotic fray, with no recollection of your former journey. New creatures charge at you from all directions.",
        style: "chaotic",
        absentResources: ["tar", "ice", "heater", "eel", "whale", "octopus", "shrimp", "chimaera", "pit", "queen", "jellyfish"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncome", resource: "frenzy", amount: 0.02 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "crab", amount: 0.04 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "breeders", amount: 0.001 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "animals", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "stuff", amount: 1 },
        ],
        gateRequirements: {
            slots: {
                sponge: 1e6,
                clam: 1e6,
                sand: 1e7,
                crystal: 1e7,
                shark: 1e4,
                sharkonium: 1e6,
            },
        },
    },
    haven: {
        name: "Haven",
        desc: "An aquamarine world of plenty. So beautiful, yet so vulnerable.",
        shortDesc: "thriving aquamarine",
        entry: "Remembering nothing, you find yourself in a beautiful atoll teeming with life. Life will be good here.",
        style: "haven",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "dolphins",
            "whales",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "dolphinmachines",
            "coral"
        ], */
        absentResources: ["tar", "ice", "heater", "chimaera", "eel", "jellyfish"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "breeders", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "animals", amount: 0.5 },
        ],
        gateRequirements: {
            slots: {
                fish: 1e8,
                clam: 1e7,
                sponge: 1e8,
                kelp: 1e8,
                coralglass: 1e6,
                coral: 2e7,
            },
        },
    },
    tempestuous: {
        name: "Tempestuous",
        desc: "A swirling maelstrom of storms where nothing rests.",
        shortDesc: "stormy grey",
        entry: "You recall nothing and know only the storms. The unrelenting, restless storms scattering your possessions and allies.",
        style: "tempestuous",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "shrimps",
            "octopuses",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "octopusmachines",
            "sponge",
            "clam",
            "algae",
        ], */
        absentResources: ["tar", "ice", "heater", "chimaera", "jellyfish"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncome", resource: "sand", amount: -0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "kelp", amount: -0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "coral", amount: -0.1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "algae", amount: -1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "frenzy", amount: -0.001 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "specialists", amount: -0.0005 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "breeders", amount: -0.0005 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "stuff", amount: 0.5 },
        ],
        gateRequirements: {
            slots: {
                junk: 1e9,
                coral: 5e7,
                spronge: 1e6,
                delphinium: 1e6,
                sharkonium: 1e6,
                crystal: 5e7,
            },
        },
    },
    violent: {
        name: "Violent",
        desc: "An ocean close to boiling and choking under sulphuric fumes.",
        shortDesc: "searing red",
        entry: "The burning waters sear the last traces of your past experiences from you. From beneath, the vents spew forth a heavy cloud of sand.",
        style: "violent",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "shrimps",
            "",
            "whales",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "sponge",
            "algae",
            "coral",
        ], */
        absentResources: ["tar", "ice", "heater", "octopus", "eel", "chimaera", "whale", "jellyfish"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeReciprocalMultiplier", resource: "breeders", amount: 1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "sand", amount: 1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "kelp", amount: 0.1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "coral", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "algae", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "sand", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "kelp", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "algae", amount: 1 },
        ],
        gateRequirements: {
            slots: {
                sand: 1e8,
                kelp: 5e6,
                coral: 1e7,
                algae: 5e7,
                sponge: 5e6,
                junk: 1e8,
            },
        },
    },
    abandoned: {
        name: "Abandoned",
        desc: "A dying world filled with machinery.",
        shortDesc: "murky dark green",
        entry: "You do not know who left this world so torn and empty. Was it some predecessor of yours? Was it you yourself?",
        style: "abandoned",
        absentResources: [
            "ice",
            "heater",
            "shrimp",
            "chimaera",
            "eel",
            "jellyfish",
            "algae",
            "whale",
            "dolphin",
            "lobster",
            "coral",
            "kelp",
            "seaApple",
            "planter",
            "autoTransmuter",
        ],
        modifiers: [
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "sponge",
                restriction: "sponge",
            },
            {
                type: "multiplier",
                modifier: "planetaryFixedIncomeMultiplier",
                resource: "crab",
                amount: 2,
            },
        ],
        gateRequirements: { upgrades: ["artifactAssembly"] },
    },
    shrouded: {
        name: "Shrouded",
        desc: "A dark, murky ocean of secrecy and danger.",
        shortDesc: "dark mysterious",
        entry: "Blackness. You know only blindness in these dark forsaken waters. Foggy memory leads you to follow a stream of crystals.",
        style: "shrouded",
        /* includedResources: [
            "sharks",
            "diver",
            "rays",
            "eels",
            "chimaeras",
            "basicmaterials",
            "sharkmachines"
        ], */
        absentResources: ["tar", "ice", "heater", "lobster", "crab", "shrimp", "sponge"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncome", resource: "crystal", amount: 0.01 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "crystal", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "fish", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "clam", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "seaApple", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "kelp", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "coral", amount: 1 },
        ],
        gateRequirements: {
            slots: {
                jellyfish: 1e7,
                clam: 1e6,
                crystal: 1e8,
                science: 1e7,
                sharkonium: 1e7,
                fish: 1e7,
            },
        },
    },
    frigid: {
        name: "Frigid",
        desc: "A cold, chilling ocean freezing slowly to death.",
        shortDesc: "freezing white",
        entry: "As you struggle with sudden amnesia, you notice crystals forming in front of you. So cold.",
        style: "frigid",
        absentResources: ["tar", "dolphin", "whale", "lobster", "chimaera", "shrimp", "seaApple", "coral", "algae", "jellyfish"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "machines", amount: 0.5 },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "sponge",
                restriction: "sponge",
            },
            { type: "multiplier", modifier: "planetaryIncome", resource: "ice", amount: 0.002 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "ice", amount: 0.1 },
        ],
        gateRequirements: {
            slots: {
                sand: 1e7,
                crystal: 1e7,
                clam: 1e6,
                heater: 5,
                sharkonium: 1e8,
                fish: 1e8,
            },
        },
    },
    ethereal: {
        name: "Ethereal",
        desc: "A strange, glowing ocean, where thought escapes into reality.",
        shortDesc: "radiant teal",
        entry: "As you arrive, you feel woozy, and you black out. When you wake up, you feel clear-headed and focused.",
        style: "default",
        absentResources: [
            "stone",
            "gravel",
            "prospector",
            "shoveler",
            "miller",
            "crusher",
            "pulverizer",
            "tar",
            "ice",
            "heater",
            "eel",
            "shrimp",
            "sponge",
            "algae",
            "lobster",
            "chimaera",
        ],
        modifiers: [
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "science", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "science", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "science", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryResourceReciprocalBoost", resource: "animals", amount: 0.5 },
        ],
        gateType: "slots",
        gateCosts: {
            science: 1e9,
            crystal: 1e8,
            coral: 1e8,
            silentArchivist: 5,
            delphinium: 1e8,
            jellyfish: 1e7,
        },
    },
    template: {
        name: "",
        desc: "description in gateway",
        shortDesc: "status",
        entry: "enter world",
        style: "default",
        absentResources: [
            "knowledge",
            "tar",
            "ice",
            "heater",
            "chimaera",
            "stone",
            "gravel",
            "prospector",
            "shoveler",
            "miller",
            "crusher",
            "pulverizer",
        ],
        modifiers: [{ type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1.5 }],
        gateType: "slots",
        gateCosts: {
            fish: 1,
            sand: 1,
            crystal: 1,
            kelp: 1,
            seaApple: 1,
            sharkonium: 1,
        },
    },
    stone: {
        name: "Stone",
        desc: "A world unweathered by ocean currents. It has no natural sand.",
        shortDesc: "rock-bottom",
        entry:
            "As you enter, the usual shades of green and yellow are nowhere to be found. You look down, and there's no sand: just cold, hard slate.",
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
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "worker", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "clamCollector", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "eggBrooder", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "sprongeSmelter", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryFixedIncomeMultiplier", resource: "ray", amount: 5 },
            { type: "restriction", modifier: "planetaryGeneratorRestriction", resource: "ray", restriction: "sand" },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "lobster",
                restriction: "sand",
            },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "scavenger",
                restriction: "sand",
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
