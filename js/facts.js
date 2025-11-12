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
                pool.push(sharktext.boldString("Fato sobre o mundo: ") + `<i>${fact}</i>`);
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
                                `Fato de
                                ${sharktext.getResourceName(
                                    resource,
                                    false,
                                    1,
                                    SharkGame.Log.isNextMessageEven()
                                        ? sharkcolor.getVariableColor("--color-dark")
                                        : sharkcolor.getVariableColor("--color-med"),
                                )}: `,
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
            return ["Fato: <i>Novos fatos são desbloqueados com você vendo. Keep playing to unlock some!</i>"];
        }
    },

    worldBased: {
        frigid: {
            messages: ["Água expande no processo de congelamento. É por isso que garrafas cheias de água quebram ou estouram se forem postas no congelador."],
        },
        volcanic: {
            messages: [
                "Esse mundo originalmente se chamava 'Violento' antes de virar Vulcânico. Jogadores de teste ficaram confusos acharam que o mundo tinha violência quando, na verdade, era apenas a ameaça de violência.",
                "Fontes hidrotermais cospem fogo na vida real. Apenas fumaça.",
                "Fontes hidrotermais mantêm uma grande parte da vida marinha porque liberam grandes quantidades de minerais. Bactérias se alimentam desses minerais e elas servem como a base dale várias cadeias alimentares.",
                "Fontes hidrotermais são encontradas em quebras na crosta terrestre, onde a água fica superaquecida por causa do calor do magma mais perto do solo oceânico que o normal.",
            ],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("thermalVents");
            },
        },
        shrouded: {},
        abandoned: {
            messages: ["'Abandonado' foi o primeiro mundo a ser refeito para Novas Fronteiras."],
        },
        haven: {
            messages: ["Papel de alga é real. Mas não é possível escrever nele."],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("sunObservation");
            },
        },
        marine: {},
        tempestuous: {
            messages: ["Diferente da língua inglesa, o português faz sentido. Portanto 'tempestuoso' significa 'algo que tem tempestades'."],
        },
    },

    resourceBased: {
        // add fish facts at some point
        shark: [
            "Muitas espécies de tubarão investigam coisas usando a boca. Isso tende a não ser bom para quem está sendo investigado.",
            "Comportamentos sociais foram registrados entre tubarões-limão, e toda evidência aponta a eles preferirem estar uns com os outros do que estarem sozinhos.",
            "Algumas espécies de tubarão tem 'imobilidade tônica' quando seu nariz é esfregado. Eles param de se mexer, aparentam extremamente relaxados e podem ficar assim por até 15 minutos antes de voltar ao estado normal.",
            "Em algumas espécies, os ovos se chocam dentro das próprias mães, e entre esses espécies, os tubarõezinhos chocados comem os ovos não fertilizados e até mesmo irmãos dentro do ovo.",
            "Mais pessoas morrem por ano ao serem alvejadas por um raio do que por ataques de tubarão.",
            "Tubarões brancos já foram observados usando linguagem corporal para demonstrar submissão e dominância entre si sem usar violência.",
            "Uma bitoca de um tubarão pode te tornar imortal. Mas apenas se o tubarão quiser.",
            "Mais vale um tubarão na mão do que dois a voar. Isso se dá porque tubarões não conseguem voar.",
            "Em termos evolutivos, tubarões são muito velhos. Os primeiros tubarões surgiram há mais ou menos 400 milhões de anos.",
            "Tubarões tem pele muito grossa, parecendo uma lixa. Tanto que pele de tubarão era usada antigamente para lixar coisas.",
            "Tubarões não tem ossos. Arraias também não.",
        ],
        crystal: ["Cristais mágicos provavelmente não são reais."],
        ray: [
            "Pode-se pensar em arraias como tubarões achatados. Ambos são muito parecidos geneticamente.",
            "Arraias são as tapiocas do oceano. (nota de rodapé: citação necessária)",
            "Arraias não tem ossos. Tubarões também não.",
            "Recentemente, uma terceira espécie de jamanta foi descoberta na costa brasileira. Faz o L.",
            "Algumas arraias tem um ferrão venenoso. Então mesmo que queiramos muito, não deveríamos abraçá-las.",
        ],
        crab: [
            "Ao longo da história, muitas espéciesde crustáceos independentemente se desenvolveram até virarem caranguejos. Deram até o nome de 'carcinização' a esse fenômeno.",
            "Muitas espécies de caranguejos têm algum tipo de assimetria de garra. Eles têm tamanhos e formatos diferentes que dão para cada garra um trabalho especializado.",
        ],
        octopus: [
            "Se tem 8 tentáculos, é um polvo.",
            "Polvos são capazes de se camuflar muito bem. Eles podem mudar de cor, padrãoe textura para combinar com o ambiente, é o suficiente para confundir qualquer animal, até mesmo humanos.",
            "Em condições específicas, polvos conseguem resolverem problemas simples. Eles até ficam confusos com problemas difícieis e tiram tempo de seu dia para contemplar soluções possíveis.",
            "Polvos ficam entediados em cativeiro. Para se distrair, eles podem brincar com objetos ou interagir com humanos em volta.",
            "Polvos são extremamente hábeis. Eles conseguem usar seus tentáculos em uma grande variedade de jeitos para mexer objetos.",
            "Polvos não tem ossos algum.",
            "Cada tentáculo de um polvo é considerado ter um cérebro próprio. Podemos pensar neles como soldados (pequenos cérebros) sendo comandados por um chefe no meio (um cérebro grande).",
        ],
        dolphin: [
            "Golfinhos são considerados um dos animais mais inteligentes de múltiplas formas, semelhantemente a macacos, elefantes e papagaios.",
            "Golfinhos não são tão cheios de si na vida real. Provavelmente. Talvez.",
            "Golfinhos são criativos e capazes de pensamento abstrato. Em cativeiro, eles podem ser pedidos para inventar novos truques e muitas vezes o farão.",
            "Já se observou golfinhos comunicando diretamente uns com os outros. Tanto que, alguns acreditam que eles podem ter conversas coerentes entre si.",
        ],
        whale: [
            "As 10 maiores espécies conhecidas no mundo são todas baleias.",
            "Se uma baleia um dia conseguisse uma arma e atirasse em outra, os jornais diriam: Baleia baleia baleia.",
            "Enquanto algumas baleias caçam ativamente, outras apenas filtram a água em busca de plankton. Nós não especificamos qual tipo são as baleias deste mundo.",
            "A maioria das baleias são criaturas sociais. A maioria das baleias andam juntas em baleais, que podem formar clãn, e então comunidades. (porém, também existem baleias solitárias)",
            "Não se sabe exatamente o porquê do canto das baleias, mas cientistas concordam que tem algum propósito social." /* Whales are observed to react to each other's songs and come to */,
        ],
        urchin: [
            "Ouriços comem principalmente algas. Muita alga.",
            "Jáfoi observadoque ouriços vão vestir diferentes items em cima de si mesmos, como pedras. Se você os der um chapeuzinho, eles vão vesti-lo também. Ainda se debate do porquê deles fazerem isso.",
            "A maioria dos ouriços não são venenosos.",
            "Os espinhos da maioria dos ouriços não são afiados. Tanto que muitas espécies podem ser seguradas na mão.",
        ],
        squid: [
            "Lulas comem caranguejos. Elas só não comem os seus por respeito.",
            "Lulas gigantes são reais. Elas vivem nas produndezas do oceano.",
            "Lulas não tem ossos algum.",
            "Se tem 8 tentáculos, não é uma lula.",
            "Lula da Silva é o 35° e 39° presidente do Brasil, e não tem nenhuma relação com o animal.",
            "Algumas espécies de lula têm sacos de tinta na sua pele que expandem ao ser puxados por músculos específicos, possibilitando sua camuflagem.",
            // Based on https://www.youtube.com/watch?v=0wtLrlIKvJE
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
        eel: [
            "Eels come in a wide range of sizes, from just a few inches to multiple meters.",
            "The highest shock ever produced by an eel was 860 volts, more then any other animal!",
            "Eels migrate a distance of 5,000 to 10,000 km across the Atlantic Ocean to the Sargasso Sea.",
        ],
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
            "Jellyfish are very old, evolutionarily speaking. A few jellyfish fossils have been dated to approximately 500 million years ago.",
            "The gastric system of jellyfish has only one hole, which means that food comes out from the same place as it goes in. Ewwww.",
            "Jellyfish are from the 'cnidaria' phylum, the same phylum of sea anemones.",
            "Despite its name and looking like a jellyfish, comb jellies are not related to jellyfish. They are ctenophores.",
            // do more research into jellies
            // On it, boss -Biggest Brian
        ],
        sharkonium: [
            "There is nothing suspicious about the machines.",
            "Small and medium-scale sharkonium machines do not require a power source. This is because sharkonium is made with crystals, which contain latent magic.",
            "Sharkonium would remind a person of steel tinted purple. To a shark, it looks like shiny nothing.",
            "Sharkonium does not taste like grapes. No, I will not let you taste it for yourself.",
        ],
        // I just decided to put something in to complete the sentence, it was driving me nuts -Biggest Brian
        porite: [
            "The idea for porite comes from the structure of bones, which have spongey insides that reduce their weight while retaining their strength.",
            "Porite is stronger than glass, but brittle under pressure, so it's only appropriate to make tools, not machines.",
            "Porite is a kind of glass. It melts at a low temperature and sets nicely, so broken tools are easily recycled.",
            "No, you can't eat it.",
        ],
        calcinium: [
            "Calcinium was inspired by the appearance and texture of limestone and seashells.",
            "It take a lot of heat to make, and once formed, calcinium doesn't melt easily. Every batch needs to be molded quickly, or it will go to waste.",
            "Calcinium is a very versatile material. Cooled quickly, it is a brittle ceramic - but cooled slowly, it's a rigid plastic. The lobsters make use of both methods.",
            "While calcinium looks like meringue, it most probably doesn't taste anything like.",
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
            "Many kinds of coral have a mutualistic relationship with species of algae, who produce nutrients in exchange for carbon dioxide and shelter.",
            "Despite being as stationary as a sponge, coral is more closely related to jellyfishes.",
        ],
        sponge: [
            "Sponges are incredibly distinct from all other animals. They are asymmetric, have no organs, and their cells can change specialization at will.",
            "Sponges are incredibly, incredibly old, evolutionarily speaking. They probably date back at least 600 million years.",
            "Sponge is not a plant, it is an animal. A weird, amorphous animal.",
            "The pores in sponges are designed to help them filter water for food at maximum efficiency.",
            "Many species of sponge have a mualistic realitionship with species of algae. The algaes use photosynthesis to produce food for the sponges.",
            "Sponges have bacteria inside their own cells that help with the metabolism of many substances. This is called 'endosymbiosis'.",
            "The first animal formed, the 'urmetazoa', was something akin to a sponge.",
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
        collector: [
            "The Dromia personata is a species of crab that take sponges and attach them to their backs as a method of camouflage.",
            "Don't touch the sponge on their backs. They're very protective about it.",
        ],
        delphinium: [
            "To a person, delphinium is glitter on blue gold. To a shark, it's headache-inducing.",
            "The dolphin recipe for delphinium is ancient. It took them many generations to perfect the process, or so they say.",
            "The dolphins are rather fond of delphinium. They appreciate the practicality of sharkonium, however.",
            "Delphinium is rather heavy, and doesn't do well under stress - but soft enough to be crafted into complex shapes.",
        ],
        ice: ["In the original shark game, ice used to eat away your resources instead of slowing their production."],
        tar: ["In the original shark game, tar was gained passively. Machines produced basically none of it."],
        calciniumConverter: [
            "Machine-brain interfaces, such as the ones used by lobsters, actually already exist.",
            "While the first machine-brain interface was created by the science shark team, in the real world, it was developed by brazilian scientist 'Miguel Niconelis'.",
            "Machine-brain interfaces are normally done without any surgery, but the lobsters thought it looked cooler to jam the wires in their skulls.",
        ],

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
