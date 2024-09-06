SharkGame.HomeMessages = {
    // Priority: later messages display if available, otherwise earlier ones.
    messages: {
        // FIRST RUN
        start: [
            {
                name: "start-you-are-a-shark",
                message: "You feel a bit hungry.",
            },
            {
                name: "start-shark",
                unlock: { totalResource: { fish: 5 } },
                message: "You attract the attention of a shark. Maybe they can help you catch fish!",
            },
            {
                name: "start-sharks",
                unlock: { resource: { shark: 2 } },
                message: "More sharks swim over, curious and watchful.",
            },
            {
                name: "start-ray",
                unlock: { resource: { shark: 5 } },
                message: "Some rays drift over.",
            },
            {
                name: "start-quite-the-group",
                unlock: { resource: { shark: 6, ray: 2 } },
                message: "You have quite the group going now.",
            },
            {
                name: "start-crab",
                unlock: { resource: { shark: 10, ray: 4 } },
                message: "Some curious crabs come over.",
            },
            {
                name: "start-tribe",
                unlock: { resource: { shark: 12, ray: 4, crab: 5 } },
                message: "Your new tribe is at your command!",
            },
            {
                name: "start-crystals",
                unlock: { resource: { shark: 1, crystal: 10 } },
                message: "The crystals are shiny. Some sharks stare at them curiously.",
            },
            {
                name: "start-science",
                unlock: { resource: { scientist: 1 } },
                message: "The science sharks swim in their own school.",
            },
            {
                name: "start-discoveries",
                unlock: { upgrade: ["crystalContainer"] },
                message: "More discoveries are needed.",
            },
            {
                name: "start-nurse",
                unlock: { resource: { nurse: 1 } },
                message: "The shark community grows with time.",
            },
            {
                name: "start-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "You hear faint songs and cries in the distance.",
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
                message: "The gate beckons. The secret must be unlocked.",
            },
        ],

        // LATER RUNS
        marine: [
            {
                name: "marine-default",
                message: "Schools of fish fill the vast expanse. This place feels so familiar.",
            },
            {
                name: "marine-noticed-lobsters",
                unlock: { upgrade: ["crystalContainer"] },
                message: "You notice some creatures on the ocean floor. They laze about and ignore your presence.",
            },
            {
                name: "marine-noticed-lobsters-2",
                unlock: { upgrade: ["seabedGeology"] },
                message: "You notice some creatures on the ocean floor. They laze about and ignore your presence.",
            },
            {
                name: "marine-lobsters",
                unlock: { totalResource: { lobster: 1 } },
                message: "The lobsters work, but seem carefree. They worry about nothing.",
            },
            {
                name: "marine-lobsters-talk",
                unlock: { totalResource: { lobster: 125 } },
                message:
                    "The lobsters tell tales of grandiose adventures and vast riches from a time long past. They ask themselves why they ever abandoned that life.",
            },
            {
                name: "marine-calcinium",
                unlock: { totalResource: { calcinium: 1 } },
                message: "Calcinium. It's rough, hard, and chalky. It feels fragile, but isn't.",
            },
            {
                name: "marine-robotics",
                unlock: { totalResource: { clamScavenger: 1 } },
                message: "A cold, rough limb fishes clams out of the seabed. The lobsters watch intently.",
            },
            {
                // do color transition 1 here
                name: "marine-bioengineering",
                unlock: { upgrade: ["bioengineering"] },
                message:
                    "Stone-to-brain interface. Shelbernetic enhancements. Population automation. The lobsters say that calcinium is an extension of life itself.",
            },
            {
                // second color transition
                name: "marine-sentience",
                unlock: { upgrade: ["sentientCircuitBoards"] },
                message: "All of us have boards now. Children are born half-machine. The lobsters call it effective.",
                // we can't understand it, no, we could never hope to understand it like the lobsters do
                // 'they [the circuits] even die...just like us.'
            },
            {
                // final color transition
                name: "marine-abandoned",
                unlock: { upgrade: ["mobiusShells"] },
                message: "Murk spills out of the frenzy. A rancid fog begins to descend. This dying world drags everyone down with it.",
            },
        ],

        haven: [
            {
                name: "haven-default",
                message: "These oceans are rich with life. A thriving reef surrounds you.",
            },
            {
                name: "haven-dolphin-observes",
                unlock: { totalResource: { coral: 75 } },
                message: "A... thing observes us from afar. What the heck is that??",
                scales: true,
            },
            {
                name: "haven-dolphins",
                unlock: { totalResource: { dolphin: 1 }, homeAction: ["getDolphin"] },
                message:
                    "A dolphin joins the frenzy. We told it to go get fish, but it came back with coral. It insists that the coral is more valuable.",
            },
            {
                name: "haven-dolphin-empire",
                unlock: { totalResource: { dolphin: 20 } },
                message:
                    "The dolphin pods that work with us speak of a star-spanning empire of their kind. They ask where our empire is. And they smile.",
                scales: true,
            },
            {
                name: "haven-papyrus",
                unlock: { upgrade: ["sunObservation"] },
                message: "Pieces of condensed kelp (???) are washing up in the currents.<br/>Something is carved into them.",
            },
            {
                name: "haven-stories",
                unlock: { upgrade: ["delphineHistory"] },
                message:
                    "The dolphin's self-indulgent tales make frequent references to a mystical gate. And, they don't know where it is. Of course they don't.",
            },
            {
                name: "haven-whales",
                unlock: { totalResource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean. What do they sing for?",
            },
            {
                name: "haven-history",
                unlock: { upgrade: ["retroactiveRecordkeeping"] },
                message:
                    "The grand sum of all dolphin knowledge is laid out before us,<br/>and it is pitifully small. The original collections have been lost to time.",
            },
            {
                name: "haven-song",
                unlock: { upgrade: ["whaleSong"] },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.",
            },
            {
                name: "haven-done",
                unlock: { resource: { chorus: 1 } },
                message: "The great song booms across the open water, carrying itself to all corners of the ocean.<br/>The gate reacts.",
            },
        ],

        tempestuous: [
            {
                name: "tempestuous-default",
                message: "Horrible wind whips you around, scattering your possessions and allies.",
            },
            {
                name: "tempestuous-cave",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "You take shelter inside the cave. You can still feel the wind, but it's gentle now.",
            },
            {
                name: "tempestuous-cave-rustling",
                unlock: { upgrade: ["crystalBite"] },
                message: "You hear a rustling from the dark backside of the cave.",
            },
            {
                name: "tempestuous-billfish",
                unlock: { upgrade: ["cavernousContact"] },
                message: "The so-called 'billfish' apologize for their behavior. They say no shark has entered this cave in a long, long time.",
            },
            {
                name: "tempestuous-sandbags",
                unlock: { resource: { stormgoer: 10 } },
                message:
                    "Stormgoers tredge slowly across the seabed. They dig through the sand extracting buried seagrass, but are too heavy to bring back crystals.",
            },
            {
                name: "tempestuous-stories",
                unlock: { upgrade: ["billfishBiology"] },
                message:
                    "The billfish tell stories of life before the storm and an ancient visitor who brought them prosperity. They ask if you can bring them prosperity, too.",
            },
            /*
                name: "tempestuous-special",
                unlock: { upgrade: ["cavernousContact"] },
                message: "The billfish watch you with awe. Hope glimmers in their eyes.",
            }, */
            {
                name: "tempestuous-bottles",
                unlock: { upgrade: ["magicBottles"] },
                message: "A silent wind swirls gently in each bottle. You feel the tumbling of a storm inside.",
            },
            {
                name: "tempestuous-expeditions",
                unlock: { upgrade: ["routing"] },
                message:
                    "The billfish line up in droves to volunteer for expeditions, danger or otherwise. They don't need convincing, just equipment.",
            },
            {
                name: "tempestuous-map",
                unlock: { upgrade: ["cartographicCompleteness"] },
                message: "A grand map lays stretched out against the cavern wall. In the top right corner is a strange shape with a door.",
            },
            {
                name: "tempestuous-machine",
                unlock: { upgrade: ["theExpedition"] },
                message: "The hallways of the facility echo with sounds of turning cogs. Billfish swim rapidly up and down the halls.",
            },
            {
                name: "tempestuous-generator",
                unlock: { upgrade: ["internalExploration"] },
                message:
                    "The generator is completely disabled, yet the facility is still running. The wind howls outside as mechanics tinker excitedly with our machines.",
            },
            {
                name: "tempestuous-legends",
                unlock: { upgrade: ["cumulusControl"] },
                message: "As the storm draws its final breath, you overhear two billfish talking. One asks the other why the visitor never returned.",
            },
        ],

        volcanic: [
            {
                name: "volcanic-default",
                message: "Scorching vents fill the sea with white and black smoke. There's not a shark in sight.",
            },
            {
                name: "volcanic-shrimp-contact",
                unlock: { totalResource: { sponge: 1 } },
                message: "You are approached by a single shrimp. They relay a message to you: stop harvesting sponges, or face the wrath of the king of shrimps.",
            },
            {
                name: "volcanic-shrimp-threat",
                unlock: {
                    custom() {
                        return SharkGame.flags.prySpongeGained > 200 && !SharkGame.flags.gotFarmsBeforeShrimpThreat;
                    },
                },
                message: "You are approached by an army of shrimp. They relay a very clear message to you: cooperate, or be destroyed. You decide to stop harvesting sponges.",
            },
            {
                name: "volcanic-shrimp-communication",
                unlock: { upgrade: ["consistentCommunication"] },
                message: "The sponge homes left behind by shrimp joining the frenzy may now be taken for ourselves.",
            },
            {
                name: "volcanic-monarchy",
                unlock: { totalResource: { queen: 1 } },
                message: "The shrimps follow a caste system with the king of shrimps on top. They ask who your king is.",
            },
            {
                name: "volcanic-shrimps",
                unlock: { upgrade: ["sustainableSolutions"] },
                message:
                    "The shrimp speak of an ancient visitor who violated their world, and how they wish to restore it. They work hard for their future.",
            },
            {
                name: "volcanic-smithing",
                unlock: { totalResource: { porite: 1 } },
                message: "Porite: glassy hunks sealed on the outside but porous on the inside: it's lightweight, yet it stays strong.",
            },
            {
                name: "volcanic-noticed",
                unlock: { upgrade: ["glassTempering"] },
                message: "Rumors say the king has caught wind of your plans. They say he plans to destroy the entire frenzy.",
            },
            {
                name: "volcanic-acolytes",
                unlock: { upgrade: ["algaeAcolytes"] },
                message: "The acolytes gather. They pray for their king. They pray for their world. They pray for you.",
            },
            // Rumor has it that the king of shrimps guards the key to a secret, sacred gate in his sandcastle.
            {
                name: "volcanic-beauty",
                unlock: { upgrade: ["finalDraft"] },
                message: "The king is speechless. As he views the great industrial city, his subjects gather and cheer, celebrating his arrival.",
            },
            {
                name: "volcanic-hope",
                unlock: { upgrade: ["apologeticAmnesty"] },
                message: `"Perhaps not all sharks are so vile," says the king of shrimps. "Perhaps, you will be different."`,
            },
        ],

        abandoned: [
            {
                name: "abandoned-default",
                message: "The tar clogs the gills of everyone here. This dying world drags everyone down with it.",
            },
            {
                name: "abandoned-octopus-scrutinizes",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "An octopus wanders over. It scrutinizes your attempt at organization.",
            },
            {
                name: "abandoned-octopus",
                unlock: { totalResource: { octopus: 1 } },
                message: "The octopus works tirelessly.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { totalResource: { octopus: 16 } },
                message: "More octopuses join. They work in perfect unison.",
            },
            {
                name: "abandoned-production",
                unlock: { upgrade: ["octopusMethodology"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency. They regard us with cold, neutral eyes.",
            },
            {
                name: "abandoned-spronge",
                unlock: { resource: { spronge: 1 } },
                message: "Residue pumps through spronge like blood. It pulses and throbs.",
            },
            {
                name: "abandoned-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Great spires loom in the distance. Loose cables are strung together on the horizon.",
            },
            {
                name: "abandoned-gate",
                unlock: { upgrade: ["farAbandonedExploration"] },
                message:
                    "This gate stands inert and lifeless like the city around it. The slots are already filled, but it looks like it's turned off.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message:
                    "The components spin and whirr and click together, but their purpose eludes us. What secrets are you hiding in your mechanisms?",
            },
            {
                name: "abandoned-high-energy-fusion",
                unlock: { upgrade: ["highEnergyFusion"] },
                message: "The light is blinding, but the output is worth it. The pieces of a broken past unite to create a brighter future.",
            },
            {
                name: "abandoned-done",
                unlock: { upgrade: ["artifactAssembly"] },
                message: "The gate buzzes to life, glowing ethereally. If you squint, you can barely make out a blue ocean on the other side.",
            },
            {
                name: "abandoned-tar-one",
                unlock: { resource: { tar: 5 } },
                message: "The tar is killing everything! Maybe a filter could save us?",
                transient: true,
            },
            {
                name: "abandoned-tar-two",
                unlock: { resource: { tar: 500 } },
                message: "Only machines will remain. All is lost. <span class='smallDesc'>All is lost.</span>",
                transient: true,
            },
        ],

        shrouded: [
            {
                name: "shrouded-default",
                message: "The crystals are easier to find, but the darkness makes it hard to find anything else.",
            },
            {
                name: "shrouded-eel-onlookers",
                unlock: { upgrade: ["crystalContainer"] },
                message: "Divers have reported sightings of wiggly things on the ocean floor. They dart into their holes when approached.",
            },
            {
                name: "shrouded-eels",
                unlock: { totalResource: { eel: 1 } },
                message: "The eels chatter among their hiding places. They like the sharks.",
            },
            {
                name: "shrouded-distant-chimaeras",
                unlock: { upgrade: ["exploration"] },
                message: "In the fog of darkness, the shapes of strange creatures can be made out. They dart away when light approaches.",
            },
            {
                name: "shrouded-chimaeras",
                unlock: { totalResource: { chimaera: 1 } },
                message:
                    "The chimaeras imply they are ancient kin of the shark kind, reunited through wild coincidence. We don't understand, but they seem to think we do.",
            },
            {
                name: "shrouded-arcana",
                unlock: { totalResource: { arcana: 5 } },
                message: "These hadal artifacts glow faintly, only in pitch blackness. That glow makes you feel something that you don't understand.",
            },
            {
                name: "shrouded-power",
                unlock: { totalResource: { sacrifice: 100 } },
                message:
                    "Every broken shard disintegrates in a blinding flash of light. That familiar feeling washes over you with every sacrifice. The sharp snap of broken arcana echoes in your mind.",
            },
            {
                name: "shrouded-city",
                unlock: { upgrade: ["arcaneHeart"] },
                message: "The sounds of explorers echo endlessly through the tunnels of the broken city. The eels say they are filled with hope.",
            },
            {
                name: "shrouded-truth",
                unlock: { totalResource: { sacrifice: 9000000000000000 } },
                message: "A team of eels get your attention. They have something from the caverns: it's a book, filled with images of pink crystals.",
            },
        ],

        frigid: [
            {
                name: "frigid-default",
                message: "Giant shards of glassy ice surround you on all sides.",
            },
            {
                name: "frigid-ice-one",
                unlock: { resource: { ice: 20 } },
                message: "You feel tired.",
            },
            {
                name: "frigid-icy-doom",
                unlock: { resource: { ice: 500 } },
                message: "So cold. So hungry. <span class='smallDesc'>So hopeless.</span>",
            },
            {
                name: "frigid-distant-village",
                unlock: { totalResource: { science: 8 } },
                message: "While scanning the horizon, you notice a gap in the ice. You peer through it, and spot something else.",
                scales: true,
            },
            {
                name: "frigid-village",
                unlock: { upgrade: ["civilContact"] },
                message:
                    "A small village of squid greets you respectfully. The water in this place is a little warmer, and you hear a quiet, ambient hum.",
            },
            {
                name: "frigid-urchins",
                unlock: { totalResource: { urchin: 2 } },
                message:
                    "The urchins scuttle along the ground and hop about, gathering kelp and placing it into a large, central pile. They know nothing but the kelp.",
            },
            {
                name: "frigid-teamwork",
                unlock: { totalResource: { extractionTeam: 1 } },
                message: "The squid champion the value of teamwork and the necessity of cooperation. They say they follow by example.",
            },
            {
                name: "frigid-machine",
                unlock: { totalResource: { squid: 125 } },
                message:
                    "In the center of the settlement lies a vibrating...thing, and a strange gate. The thing buzzes loudly, casting enormous energy across the water.",
                scales: true,
            },
            {
                name: "frigid-squid",
                unlock: { totalResource: { squid: 250 } },
                message: "The squid speak of an ancient visitor who saved their world. They ask if you too, have seen this visitor.",
                scales: true,
            },
            {
                name: "frigid-suspicion",
                unlock: { upgrade: ["automation"] },
                message: "The squid describe the machine with fascination. They ask if we feel the same. They see something we do not.",
            },
            {
                name: "frigid-battery",
                unlock: { upgrade: ["internalInquiry"] },
                message:
                    "Buried deep within the complex lies a massive, dimly glowing battery. The squid say replacing it will get the machine running at full power.",
            },
            {
                name: "frigid-heat-returns",
                unlock: { upgrade: ["rapidRecharging"] },
                message: "A wave of heat washes over you, and the dingy complex comes back to life. The gate turns on.",
            },
        ],
        /*
        {
            message:
                "The jagged seafloor looks ancient, yet pristine.<br>Sponges thrive in great numbers on the rocks.",
        },
        */
    },
};
