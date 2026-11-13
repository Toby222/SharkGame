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
    },

    resourceBased: {
        fish: [
            "A shark detective was inspecting the crime scene. He felt sus-fish-ous.",
            "Clownfish aren't popular. They taste funny.",
            "Efficiency? Yeah, that's where the fish usually is.",
            "Why was the jackfish fined so harshly? Weeks of unpaid pike-ing tickets.",
        ],
        // The hogfish rooted around the sand, uncovering its target. “You’re under awrasst!” he shouted.
        // “Please! I’m a single fish with a fish family to feed!” exclaimed the snail thief, “A fish child! A catfish, a dogf-“
        // “Stop refishting!!” responded the offisher, as he unloaded 28 rounds into the slippery d**k point blank with extreme prejudice.
        // -- courtesy of Morally Unethical
        sand: [
            "No matter who's dead, the seafloor always sands its regards.",
        ],
        tar: [
            "This black clogging gunk is absolutely tarrifying.",
        ],
        seaApple: [
            "'I don’t eel too good, doc,' said the pearlfish.<br>'That was terrible,' responded the sea cucumber, 'and you aren’t even sick. Get out of my orifice.'",
        ],
        shark: [
            "A shark detective was inspecting the crime scene. He felt sus-fish-ous.",
        ],
        ray: [
            "To a ray, stinging is pretty mantastic.",
        ],
        whale: [
            "Being large means you can catch a lot of fish, which is whaley good.",
        ],
        shrimp: [
            "The shrimp traitor was surrounded. He couldn’t scampi away this time.",
        ],
        eel: [
            "Attempting to breathe underwater is eel-advised.",
            "Electric eels are so agreeable, they always take the path of least refishtance.",
            "Electric eels are usually up to date on current events. Shocking, I know.",
        ],
        billfish: [
            "To a shark, a nose-spear would be quite unwieldy. The billfish say it's great. They have a point.",
        ],
        caracara: [
            "A caracara got scammed of all her fish. She never knew she could be so gull-ible.", // this actually doesn't work as caracaras are falcons, not gulls -- Three Eels
        ],
        // one to add if we ever get sea snakes:
        // "The sea snake pirate was never a fan of the rickety cannons. He was always wary lest they blow the ship to slithereens."

    },

    default: [
        "This puns system was based off of the facts system.<br>That's it. There's no punchline to this.",
        "A lot of these puns are community-contributed from the Discord server. Pretty much anyone can submit a pun if they're there!",
    ],
};
