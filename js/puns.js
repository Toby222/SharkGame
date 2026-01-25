// this puns.js is a wip. it runs on the facts.js code so there's most likely going to be bugs. --ThreeEels
// suggested by base4 (spencers145) in 2021, initiated by ThreeEels in Jan 2026.

SharkGame.Puns = {
    dilutedResources: ["shark", "ray", "crab", "fish"], // dilute these while not in starter to keep the bad puns fresher

    showPun() {
        log.addMessage(this.getPun());
    },

    getPun() {
        const pool = this.getPool();
        return SharkGame.choose(pool);
    },

    getPool() {
        const pool = [];
        const currentWorld = world.worldType;
        if (
            this.worldBased[currentWorld] &&
            (!this.worldBased[currentWorld].areRequirementsMet || this.worldBased[currentWorld].areRequirementsMet())
        ) {
            _.each(this.worldBased[currentWorld].messages, (pun) => {
                pool.push(sharktext.boldString("Pun: ") + `<i>${pun}</i>`);
            });
        }

        let anyAvailableResource = false;
        $.each(this.resourceBased, (resource, puns) => {
            // purposefully dilute some puns if we are not on the starter world
            // I want these facts to be more likely relevant than not
            if (world.doesResourceExist(resource) && res.getTotalResource(resource)) {
                anyAvailableResource = true;
                if (!this.dilutedResources.includes(resource) || currentWorld === "start" || Math.random() < 0.25) {
                    _.each(puns, (pun) => {
                        pool.push(
                            sharktext.boldString(
                                `${sharktext.getResourceName(
                                    resource,
                                    false,
                                    1,
                                    SharkGame.Log.isNextMessageEven()
                                        ? sharkcolor.getVariableColor("--color-dark")
                                        : sharkcolor.getVariableColor("--color-med"),
                                )} pun: `,
                            ) + `<i>${pun}</i>`,
                        );
                    });
                }
            }
        });

        if (anyAvailableResource) {
            // only 10% chance to include the 'default' facts
            // this is because those facts are seen all over the place
            // they would end up diluting the world-specific and resource-specific facts
            //
            // also acts as a failsafe in case there are no other facts to display
            if (Math.random() < 0.1 || pool.length === 0) {
                _.each(this.default, (pun) => {
                    pool.push(sharktext.boldString("Pun: ") + `<i>${pun}</i>`);
                });
            }
            return pool;
        } else {
            return ["Pun: <i>New puns are unlocked with new resources. Keep playing to unlock some!</i>"];
        }
    },

    worldBased: {
        frigid: {
            messages: ["Did you hear about the urchin's pride on its cold resilience? It felt n-ice!"],
        },
        volcanic: {
            messages: [
                "Placeholder :D",
            ],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("thermalVents");
            },
        },
        shrouded: {},
        abandoned: {
            messages: ["Placeholder :D"],
        },
        haven: {
            messages: ["Placeholder :D"],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("sunObservation");
            },
        },
        marine: {},
        tempestuous: {
            messages: ["Placeholder :D"],
        },
        shore: {
            messages: [],
        },
    },

    resourceBased: {
        fish: [
            "What did the fish detective say on the scene of crime? 'Somethinh smells fishy!",
            "After one of your sharks ate a clownfish, do you know what he said?<br>'This tastes like it’s depressed and tired of constantly being seen as a joke!'",
        ],
        crystal: [
            "Placeholder :D",
        ],
        sand: [
            "Placeholder :D",
        ],
        kelp: [
            "Placeholder :D",
        ],
        driftwood: [
            "Placeholder :D",
        ],
        seagrass: [
            "Placeholder :D",
        ],
        coral: [
            "Placeholder :D",
        ],
        sponge: [
            "Placeholder :D",
        ],
        tar: [
            "Placeholder :D",
        ],
        ice: [
            "Placeholder :D",
        ],
        roughSand: [
            "Placeholder :D",
        ],
        shark: [
            "Placeholder :D",
        ],
        ray: [
            "Placeholder :D",
        ],
        crab: [
            "Placeholder :D",
        ],
        octopus: [
            "Placeholder :D",
        ],
        dolphin: [
            "Placeholder :D",
        ],
        whale: [
            "Placeholder :D",
        ],
        urchin: [
            "Placeholder :D",
        ],
        squid: [
            "Placeholder :D",
        ],
        lobster: [
            "Placeholder :D",
        ],
        shrimp: [
            "The shrimp traitor was surrounded. He couldn’t scampi away this time.",
            "An eel went to a restaurant and ordered some rice. He was confused. A <i>shrimp</i> had fried this rice?<br>He then remembered that shrimp are actually decent cooks.",
        ],
        eel: [
            "An eel went to a restaurant and ordered some rice. He was confused. A shrimp had fried this rice?<br>He then remembered that shrimp are actually decent cooks.",
        ],
        chimaera: [
            "Placeholder :D",
        ],
        billfish: [
            "Placeholder :D",
        ],
        mudskipper: [
            "Placeholder :D",
        ],
        caracara: [
            "Placeholder :D",
        ],

    },

    default: [
        "Placeholder :D",
    ],
};
