// this puns.js is a wip. it runs on the facts.js code so there's most likely going to be bugs. --ThreeEels
// suggested by base4 (spencers145) in 2021, initiated by ThreeEels in Jan 2026.

SharkGame.Puns = {
    dilutedResources: ["shark", "ray", "crab", "fish"], // dilute these while not in starter to keep the bad puns fresher

    showPun() {
        log.addMessage(this.getPun());
    },

    getPun() {
        const pool = this.getPunPool();
        return SharkGame.choose(pool);
    },

    getPunPool() {
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
            // purposefully dilute some puns if we are not on the starter world just like with the facts
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
            // only 10% chance to include the 'default' puns
            // this is because those puns are seen all over the place
            // they would end up diluting the world-specific and resource-specific puns
            //
            // also acts as a failsafe in case there are no other puns to display
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
            messages: ["Placeholder :D"],
        },
    },

    resourceBased: {
        fish: [
            "A shark detective was inspecting the crime scene. He felt sus-fish-ous.",
            "Clownfish aren't popular. They taste funny.",
        ],
        crystal: [
            "Placeholder :D",
        ],
        sand: [
            "No matter who's dead, the seafloor always sands its regards.",
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
            "A shark detective was inspecting the crime scene. He felt sus-fish-ous.",
        ],
        ray: [
            "To a ray, stinging is pretty mantastic.",
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
            "Being large means you can catch a lot of fish, which is whaley good.",
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
        ],
        eel: [
            "Placeholder :D",
        ],
        chimaera: [
            "Placeholder :D",
        ],
        billfish: [
            "To a shark, a nose-spear would be quite unwieldy. The billfish say it's great. They have a point.",
        ],
        mudskipper: [
            "Placeholder :D",
        ],
        caracara: [
            "Placeholder :D",
        ],

    },

    default: [
        "This puns system was based off of the facts system.<br>That's it. There's no punchline to this.",
    ],
};
