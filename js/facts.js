SharkGame.FunFacts = {
    dilutedResources: ["shark", "ray", "crab", "fish"], // dilute these while not in starter to keep the fun facts fresher

    showFact() {
        log.addMessage(this.getFact());
    },

    getFact() {
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
            _.each(this.worldBased[currentWorld].messages, (fact) => {
                pool.push(sharktext.boldString("Fun fact: ") + `<i>${fact}</i>`);
            });
        }

        let anyAvailableResource = false;
        $.each(this.resourceBased, (resource, facts) => {
            // purposefully dilute some facts if we are not on the starter world
            // I want these facts to be more likely relevant than not
            if (world.doesResourceExist(resource) && res.getTotalResource(resource)) {
                anyAvailableResource = true;
                if (!this.dilutedResources.includes(resource) || currentWorld === "start" || Math.random() < 0.25) {
                    _.each(facts, (fact) => {
                        pool.push(
                            sharktext.boldString(
                                `${sharktext.getResourceName(
                                    resource,
                                    false,
                                    1,
                                    SharkGame.Log.isNextMessageEven()
                                        ? sharkcolor.getVariableColor("--color-dark")
                                        : sharkcolor.getVariableColor("--color-med"),
                                )} fact: `,
                            ) + `<i>${fact}</i>`,
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
                _.each(this.default, (fact) => {
                    pool.push(sharktext.boldString("Fun fact: ") + `<i>${fact}</i>`);
                });
            }
            return pool;
        } else {
            return ["Fun fact: <i>New fun facts are unlocked as you see new stuff. Keep playing to unlock some!</i>"];
        }
    },

    worldBased: {
        frigid: {},
        volcanic: {
            messages: [
                "This world was originally called Violent, now it's Volcanic. Playtesters got confused and thought the world had violence, when really, it just has the threat of violence.",
                "Hydrothermal vents do not spew fire in real life. They spew smoke.",
                "Hydrothermal vents support a diverse array of sea life due to their high output of minerals. Bacteria eat these minerals, forming the base of a food chain.",
                "Hydrothermal vents are found at fault lines in the earth's crust, where water becomes superheated due to magma rising close to the ocean floor.",
            ],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("thermalVents");
            },
        },
        shrouded: {},
        abandoned: {
            messages: ["This world was the first one to be remade for New Frontiers."],
        },
        haven: {
            messages: ["Kelp paper is real. You cannot write on it though."],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("sunObservation");
            },
        },
        marine: {},
        tempestuous: {
            messages: ["'Tempestuous' does not mean stormy. It means emotionally turbulent. But it's close enough."],
        },
    },

    resourceBased: {
        // add fish facts at some point
        shark: [
            "There are many species of sharks that investigate things with their mouths. This can end badly for the subject of investigation.",
            "There have been social behaviours observed in lemon sharks, and evidence that suggests they prefer company to being alone.",
            "Some shark species display 'tonic immobility' when rubbed on the nose. They stop moving, appear deeply relaxed, and can stay this way for up to 15 minutes before swimming away.",
            "In some shark species eggs hatch within their mothers, and in some of these species the hatched babies eat unfertilised or even unhatched eggs.",
            "More people are killed by lightning every year than by sharks.",
            "White sharks have been observed to have a variety of body language signals to indicate submission and dominance towards each other without violence.",
            "A kiss from a shark can make you immortal. But only if they want you to be immortal.",
            "A shark is worth one in the bush, and a bunch in the sea water. Don't put sharks in bushes.",
            "Sharks are very old, evolutionarily speaking. The first sharks emerged some time around 400 million years ago.",
            "Sharks have very rough skin, like sandpaper. In fact, shark skin was literally used as sandpaper in the past.",
            "Sharks do not have bones. Neither do rays.",
        ],
        crystal: ["Magic crystals are probably not real."],
        ray: [
            "Rays can be thought of as flattened sharks. The two are very closely related evolutionarily.",
            "Rays are pancakes of the sea. (note: probably not true)",
            "Rays do not have bones. Neither do sharks.",
        ],
        crab: [
            "Throughout history, many species of crustaceans have independently evovled into crabs for no discernable reason. The phenomenon is called carcinisation.",
            "Some species of crab exhibit a kind of claw asymmetry. Called the crusher and cutter, they have different shapes that give their claws more specialized purposes.",
        ],
        octopus: [
            "It's octopuses, not octopi.",
            "Octopuses are capable of extremely advanced camoflague. They can change color, pattern, and texture to match their surroundings, enough to easily fool anything, even humans.",
            "In novel circumstances, octopuses are capable of simple problem-solving. They show visible confusion when confronted with difficult problems, and take time to contemplate possible solutions.",
            "Octopuses can get bored in captivity. They may fiddle with toys or interact with humans for entertainment.",
            "Octopuses have great dexterity. They can use their tentacles in a surprising variety of ways to manipulate objects.",
            "Octopuses have no bones whatsoever.",
            "Each limb of an octopus is considered to individually have a brain to itself. They can be thought of as soldiers (the little brains) being commanded by a general in the center (a big brain).",
        ],
        dolphin: [
            "Dolphins are considered some of the most intelligent animal problem-solvers, next to monkeys, elephants and parrots as examples.",
            "Dolphins are not smug in real life. Probably. Maybe.",
            "Dolphins are creative and capable of abstract thought. In captivity, they can be asked to invent new tricks, and will often succeed.",
            "Dolphins have been seen directly communicating with each other. In fact, it is believed that they can hold full, coherent conversations.",
        ],
        whale: [
            "The top 10 largest animal species are all whales.",
            "While some whales are active hunters, others are merely supersized filter feeders. This game's whales are of unspecified type.",
            "Most whales are very social creatures. Most whales travel in small groups called pods, which might make up clans, and then communities. (some, however, are solitary)",
            "It is not completely understood why whales sing, but scientists agree it serves some kind of social purpose." /* Whales are observed to react to each other's songs and come to */,
        ],
        urchin: [
            "Sea urchins primarily eat kelp. A lot of kelp.",
            "Sea urchins have been observed to wear various items on top of themselves, such as rocks. If you give them little hats, they will wear those too. It is not agreed upon why they do this.",
            "Most sea urchins are not venomous.",
            "The spines on most sea urchins are not very sharp. Many species of urchin can be held in the palm.",
        ],
        squid: [
            "Squid eat crabs. They're not eating yours out of politeness.",
            "Giant squid are real. They live incredibly deep in the ocean.",
            "Squid have no bones whatsoever.",
            // Squid have camoflague look into it
        ],
        lobster: [
            "Lobsters really do eat clams. They instinctively know how to crack them open.",
            "Due to a biological quirk, lobsters are highly resistant to aging and can live for an extremely long time. Some will live longer than humans.",
            "Lobsters have teeth in their stomach, not in their mouth, and they chew with those teeth.",
            "Lobsters have asymmetric claws. One of them, called the crusher, is used for...crushing. The other, called the pincer, is used for...pincing. Marine biologists were feeling creative, clearly.",
        ],
        shrimp: [
            "There are real eusocial shrimps that live in communities in sponges on reefs, complete with queens.",
            "Shrimp are close relatives of lobsters. They have a lot of similarities, and in some ways are just smaller, narrower lobsters.",
        ],
        // eel: [
        // "Eels come in a wide range of sizes, from just a few inches to multiple meters.",
        // migratory eels, look into it
        // ],
        chimaera: [
            "Chimaera are closely related to sharks and rays.",
            "Chimaera are deep-sea animals, usually found more than 500 meters (~1500 feet) below the surface of the ocean.",
            "Chimaera have a venomous spine in front of their dorsal fin.",
            "Chimaera are not purple, they are completely pale. They don't bother with colors because deep-sea animals like chimaera cannot be seen anyways.",
            "Chimaera do not have bones. Neither do sharks or rays.",
        ],
        billfish: [
            "Billfish do indeed have bones, unlike sharks and rays.",
            "Swordfish and marlins are large, predatory fish. At adulthood, their only natural predators are sharks (oh no) and whales.",
            "The top speed of marlins is commonly reported to be 60 mph, but this is not accurate. It's actually closer to 30 mph.",
            "The bill of a billfish is used to slash like a sword, not stab like a spear.",
            "Swordfish are not a group of fish, they are a single species: Xiphias gladius.",
            "Swordfish, spearfish, and marlins are part of a larger group of fish called billfish (the group featured in this game), of which there are only 12 species.",
        ],
        seaApple: [
            "Sea apples are a type of sea cucumber. They feed on debris and detritus.",
            "Sea apples are in no way actually attracted to kelp. The apples in this game are weird.",
        ],
        jellyfish: [
            // "Sharks would definitely not have a way of acquiring most kinds of jellyfish in real life.",
            "Jellyfish can be extremely dangerous. Some kinds of box jellyfish have fatal stings.",
            "Turritopsis dohrnii is a species of jellyfish that can restart its lifecycle at will. In theory, this grants it an infinite lifespan.",
            // do more research into jellies
        ],
        sharkonium: [
            "There is nothing suspicious about the machines.",
            "Small and medium-scale sharkonium machines do not require a power source. This is because sharkonium is made with crystals, which contain latent magic.",
            "Sharkonium would remind a person of steel tinted purple. To a shark, it looks like shiny nothing.",
            "Sharkonium has a ",
        ],
        porite: [
            "The idea for porite comes from the structure of bones, which have spongey insides that reduce their weight while retaining their strength.",
            "Porite is stronger than glass, but brittle under pressure, so it's only appropriate to make tools, not machines.",
            "Porite is a kind of glass. It melts at a low temperature and sets nicely, so broken tools are easily recycled.",
        ],
        calcinium: [
            "Calcinium was inspired by the appearance and texture of limestone and seashells.",
            "It take a lot of heat to make, and once formed, calcinium doesn't melt easily. Every batch needs to be molded quickly, or it will go to waste.",
            "Calcinium is a very versatile material. Cooled quickly, it is a brittle ceramic - but cooled slowly, it's a rigid plastic. The lobsters make use of both methods.",
        ],
        laser: [
            "Sharks with lasers were overdone, okay? 'Laser ray' is a pun, so it's obviously superior.",
            "Sand probably does not actually fuse into magic crystals. Unless you count glass.",
            "We do not know how the rays strap lasers to themselves. It is known only to the sharks.",
            "Laser rays take power directly from the heat of hydrothermal vents, so they are each tethered to a small operating area.",
            "By default, the laser ray's laser is quite low-temperature. It takes quite a bit of effort (and sand) to properly fuse anything.",
        ],
        coral: [
            "Some coral can actually catch small fish.",
            "Coral is not a plant, it is an animal. A weird, stationary animal.",
            "Coral are primarily carnivores. They eat plankton (teeny tiny things that can't swim), grabbing them with little tentacles and pulling them into their mouths.",
            "Many kinds of coral have a mutualistic relationship with species of alage, who produce nutrients in exchange for carbon dioxide and shelter.",
        ],
        sponge: [
            "Sponges are incredibly distinct from all other animals. They are asymmetric, have no organs, and their cells can change specialization at will.",
            "Sponges are incredibly, incredibly old, evolutionarily speaking. They probably date back at least 600 million years.",
            "Sponge is not a plant, it is an animal. A weird, amorphous animal.",
            "The pores in sponges are designed to help them filter water for food at maximum efficiency.",
            "Many species of sponge have a mualistic realitionship with species of algae. The algaes use photosynthesis to produce food for the sponges.",
        ],
        algae: [
            "Algae comes in many different shapes, sizes, and forms. A very notable one is 'valonia ventricosa,' a species where every individual cell can grow larger than a grape.",
            "Algae is neither plant nor animal. It is something else entirely (a 'protist').",
            "Kelp is a kind of algae. In fact, all seaweed is algae. The sea has very few true plants.",
        ],
        kelp: ["Kelp is not a plant, it's a kind of algae. Algae is also not a plant."],
        seagrass: [
            "Unlike kelp, seagrass is a true plant. It is one of very few under the sea.",
            "Seagrass flowers don't exactly look like the kind we are used to.",
        ],
        arcana: [
            "Arcane, super-charged energy crystals are definitely not real.",
            "These things snap like fireworks when you break them. It's pretty cool.",
        ],
        sacrifice: ["Nobody knows how the energy of the crystals gets into the frenzy."],
        science: ["Real sharks do not know how to do science. Probably."],
        sand: [
            "In the real world, the ocean floor is not always sand. The deep ocean usually has much finer sediment.",
            "Sand gets transported very long distances by ocean currents. The longer it takes to travel to its destination beach, the finer the sand will be.",
        ],
        ancientPart: [
            "What do they do? We still aren't sure.",
            "These parts would probably remind a person of train parts. To a shark, they just look like nothing.",
            "What are they made of? I don't know, you tell me!",
            "The ancient parts have a texture like painted-over concrete. They clink together with a sound like ceramic.",
        ],
        investigator: ["We are not sure where the octopuses get their funny hats. Presumably they just find them."],
        eggBrooder: ["This is gross."],
        delphinium: [
            "To a person, delphinium is glitter on blue gold. To a shark, it's headache-inducing.",
            "The dolphin recipe for delphinium is ancient. It took them many generations to perfect the process, or so they say.",
            "The dolphins are rather fond of delphinium. They appreciate the practicality of sharkonium, however.",
            "Delphinium is rather heavy, and doesn't do well under stress - but soft enough to be crafted into complex shapes.",
        ],
        ice: ["In the original shark game, ice used to eat away your resources instead of slowing their production."],
        tar: ["In the original shark game, tar was gained passively. Machines produced basically none of it."],

    },

    default: [
        "Shark Game's initial bare minimum code came from an abandoned idle game about bees. Almost no trace of bees remains!",
        "The existence of resources that create resources that create resources in this game were inspired by Derivative Clicker!",
        "Kitten Game was an inspiration for this game! This surprises probably no one. The very first message the game gives you is a nod of sorts.",
        "There is a surprising deficit of cookie in this game.",
        "Remoras were banished from the oceans in the long bygone eras. The sharks hope they never come back.",
        "Fun facts will only talk about things you have already seen in-game.",
        "Fun facts have always been in the game's code, but have never been exposed until this system for displaying them was added.",
        "New Frontiers, this Shark Game mod, was inspired by the unfolding nature of the Candy Box games and A Dark Room.",
        "Any timewalls in this game can be completely bypassed with good strategy.",
        "This game has keybinds. They are more useful than you might think. Check the options menu.",
        "Shark Game: New Frontiers is a mod of Cirrial's Untitled Shark Game. It started as a refurbishment, but quickly evolved into a total remake.",
    ],
};
