SharkGame.FunFacts = {
    dilutedResources: ["shark", "ray", "crab", "fish", "science"], // dilute these while not in starter to keep the fun facts fresher

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
            "Já foi observadoque ouriços vão vestir diferentes items em cima de si mesmos, como pedras. Se você os der um chapeuzinho, eles vão vesti-lo também. Ainda se debate do porquê deles fazerem isso.",
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
            "Lagostas realmente comem mexilhões. Eles instintivamente os quebram para abri-los.",
            "Por causa de uma pequena peculiaridade biológica, lagostar são muito resistentes ao envelhecimento e podem viver por muito tempo. Alguns vão até viver mais que você.",
            "Lagostas tem dentes dentro de seu estômago, não na boca, e eles mastigam com esse dentes.",
            "Lagostas têm garras assimétricas. A maior, chamada de esmagadora, é usada para esmagar. A outra, chamada de estripadora, é usada para estripar. Biólogos marinhos estavam inspirados naquele dia.",
        ],
        shrimp: [
            "Realmente existem camarões sociais que vivem em comunidades ao redor de esponjas de recifes, eles têm até rainhas lá.",
            "Camarões são primos próximos de lagostas. Eles têm muitas similaridades, em algumas maneiras eles são apenas lagostas, só que menores e magrinhas..",
        ],
        eel: [
            "Enguias podem ter tamanhos muito diferentes, desde poucos centímetros até vários metros.",
            "O maior choque já registrado por uma enguia foi de 860 volts, mais do que qualquer outro animal!",
            "Enguias europeias migram uma distância de 5,000 até 10,000 km pelo Oceano Atlântico para chegar no Mar dos Cargaços.",
        ],
        chimaera: [
            "Quimeras têm uma ancestralidade comum próxima a tubarões e arraias.",
            "Quimeras são animais de oceano profundo, normalmente são achados abaixo de 500 metros (~1.5 estádios do Maracanã) da superfície da água.",
            "A maioria das espécies de quimera têm um espinho venenoso na frente de sua barbatana superior.",
            "Quimeras não são roxas, elas são pálidas. Elas não se importam com cores bonitas porque animais das profudezas do mar não conseguem ver nada mesmo.",
            "Quimeras não têm ossos. Da mesma maneira que tubarões e arraias.",
            "Em muitas espécies de quimera, o focinho contém um órgão que detecta campos elétricos, como aqueles presentes em um batimento cardíaco, por exemplo.",
        ],
        billfish: [
            "Billfish do indeed have bones, unlike sharks and rays.",
            "Swordfish and marlins are large, predatory fish. At adulthood, their only natural predators are sharks (oh no) and whales.",
            "Normalmente é noticiado que a velocidade máxima de marlins chega a quase 100 km/h, mas isso está errado. É mais próximo de 50 km/h.",
            "The bill of a billfish is used to slash like a sword, not stab like a spear.",
            "Swordfish are not a group of fish, they are a single species: Xiphias gladius.",
            "Swordfish, spearfish, and marlins are part of a larger group of fish called billfish (the group featured in this game), of which there are only 12 species.",
        ],
        seaApple: [
            "Holotúrias são um tipo de pepino-do-mar. Eles se alimentam de restos e migalhas no solo.",
            "Holotúrias reais não são atraídas de forma alguma a algas. É só as desse jogo que são estranhas.",
        ],
        jellyfish: [
            // "Sharks would definitely not have a way of acquiring most kinds of jellyfish in real life.",
            "Águas-vivas podem ser extremamente perigosas. A picada de algumas vespas-do-mar consegue matar um adulto.",
            "Turritopsis dohrnii is a species of jellyfish that can restart its lifecycle at will. In theory, this grants it an infinite lifespan.",
            "Jellyfish are very old, evolutionarily speaking. A few jellyfish fossils have been dated to approximately 500 million years ago.",
            "O sistema digestivo de águas-vivas só tem um buraco, o que quer dizer que comida sai pelo mesmo lugar que entra. Eca.",
            "Águas-vivas são do filo 'cnidaria', o mesmo filo de anêmonas.",
            "Apesar de seus nomes e aparência, águas-vivas-de-pente não tem nada haver com águas-vivas. Elas são de filos diferentes.",
            // do more research into jellies
            // On it, boss -Biggest Brian
        ],
        sharkonium: [
            "Não tem nada suspeito nas máquinas.",
            "Máquinas de tubarônio de pequeno e médio porte não precisam de uma fonte de energia externa, já que tubarônio é feito com cristais que emana magia de dentro de si.",
            "Para uma pessoa, tubarônio lembra ouro roxo. Para um tubarão, parece como um troço brilhante.",
            "Tubarônio não vai ter gosto algum de uva. Não, eu não vou te deixar testar.",
        ],
        // I just decided to put something in to complete the sentence, it was driving me nuts -Biggest Brian
        porite: [
            "A ideia para porita veio da estrutura de ossos, cuja medula é esponjosa para reduzir o peso enquanto mantém sua força.",
            "Porita é mais forte que vidro, mas quebra sob pressão constante, então só deve ser usado para fazer ferramentas, não máquinas.",
            "Porita é um tipo de vidro. Derrete a uma temperatura relativamente baixa e pode ser moldado facilmente, então ferramentas quebradas podem ser rapidamente recicladas.",
            "Não, você não pode comer.",
        ],
        calcinium: [
            "Calcinício foi inspirado pela aparência e textura de calcário e conchas.",
            "Toma muita energia para fazer e, após formado, calcinício não derrete fácil. Cada fornada tem que ser moldada rápido, se não vai ter que ir pro lixo.",
            "Calcinício é um material bem versátil. Se esfriar rápido, é uma cerâmica frágil - mas esfriado lentamente, é um plástico forte. E as lagostas usam ambas versões.",
            "Enquanto que calcinício pareça com merengue, o gosto não tem nada haver.",
        ],
        laser: [
            "Juntar tubarões com lasers é muito 2010, sabe? 'Arraia laser' é um trocadilho, então é muito melhor.",
            "Areia provavelmente não se funde em crystais mágicos. A não ser que você conte vidro.",
            "Nós não sabemos como que as arraias conseguem amarrar lasers em si mesmas. Apenas os tubarões sabem.",
            "Arraias laser pegam a energia diretamente do calor de fontes hidrotermais, então elas estão presas a uma área relativamente pequena.",
            "Normalmente, a energia do laser de uma arraia não é muito quente. Por isso toma muito tempo (e areia) para fundir qualquer coisa direito.",
        ],
        coral: [
            "Alguns corais conseguem caçar peixes pequenos.",
            "Corais não são plantas, mas sim animais. Um estranho animal estacionário.",
            "Corais são principalmente carnívoros. Eles comem plankton (coisas muito pequenas que não sabem nadar) grudando neles com os tentáculos e os puxando para suas bocas.",
            "Muitos corais têm uma relação mutualística com espécies de algas, que produzem nutrientes em troca de gás carbônico e abrigo.",
            "Mesmo sendo paradão como uma esponja, coral é mais próximo de águas-vivas.",
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
            ". O mar tem poucas plantas de verdade.",
        ],
        kelp: ["Kelp is not a plant, it's a kind of algae. Algae is also not a plant."],
        seagrass: [
            "Unlike kelp, seagrass is a true plant. It is one of very few under the sea.",
            "Seagrass flowers don't exactly look like the kind we are used to.",
        ],
        arcana: [
            "Cristais mágicos super-poderosos definitivamente não existem na real.",
            "Essas pedras estouram que nem estalinho de festa junina quando quebrados.Que daora!",
        ],
        sacrifice: ["Ninguém sabe como a energia dos cristais passa para o cardume."],
        science: [
            "Tubarões reais não sabem como fazer ciência. Provavelmente.",
            "A maior parte da ciência no cardume é feita por tubarões cientistas de instituições públicas.",
            "Os cientistas tubarões que negam a efetividade de vacinas têm um nome: Charlaturões.",
        ],
        sand: [
            "No mundo real, o solo oceânico nem sempre é feito de areia. O sedimento do fundo do mar muitas vezes é bem mais fino.",
            "Correntezas oceânicas podem carregar areia por distâncias enormes até alguma praia. E quanto mais longe é levada, mais fina a areia fica.",
        ],
        ancientPart: [
            "O que eles fazem? Ainda não temos certeza.",
            "Uma pessoa se lembraria de partes de trem olhando para esses pedaços. Mas ao olhar para ela, os tubarões se lembram de nada.",
            "Do que é que são feitos? E eu sei lá!",
            "The ancient parts have a texture like painted-over concrete. Quando batemos eles, faz um barulho de cerâmica.",
        ],
        investigator: ["Não temos certeza de onde os polvos conseguem seus chapéus de investigação. Acreditamos que eles só acham por aí."],
        eggBrooder: ["Isso é nojento."],
        collector: [
            "A Dromia personata é uma espécie de caranguejo que pega esponjas e as grudam em suas costas como um jeito de se camuflar.",
            "Não encoste na esponja em suas costas. Eles são superprotetores dela.",
        ],
        delphinium: [
            "Para uma pessoa, golfínio parece glitter em cima de ouro azul. Para um tubarão, apenas parece como dor nos olhos.",
            "The dolphin recipe for delphinium is ancient. It took them many generations to perfect the process, or so they say.",
            "The dolphins are rather fond of delphinium. They appreciate the practicality of sharkonium, however.",
            "Delphinium is rather heavy, and dosn't do well under stress - but soft enough to be crafted into complex shapes.",
        ],
        ice: ["No jogo original, o gelo apenas consumia seus recursos ao invés de diminuir sua produção."],
        tar: ["No jogo original, graxa se produzia sozinha. Máquinas quase não produziam graxa alguma."],
        calciniumConverter: [
            "Interfaces cérebro-máquina, como as usadas pelas lagostas, já existem desde antes de 2014.",
            "Enquanto que a primeira interface cérebro-máquina tenha sido criada por tubarões cientistas em colaboração com as lagostas, no mundo real, quem desenvolveu foi o time do cientista brasileiro 'Miguel Niconelis'.",
            "Interfaces cérebro-máquina podem ser facilmente feitas sem cirurgia, mas as lagostas acho que seria muito maneiro ter fios enfiados no crânio.",
        ],

    },

    default: [
        "O código original de 'Shark Game' veio de um jogo idle abandonado sobre abelhas. Agora quase não resta nenhum traço de abelhas!",
        "A existênciade recursos que produzem recursos neste jogo foi inspirado pelo jogo 'Derivative Clicker'!",
        "'Kitten Game' foi uma inspiração para esse jogo! Para a surpresa de 0 pessoas. A primeira mensagem do jogo é uma referência.",
        "Tem uma surpreendente falta de biscoitos para um jogo clicker aqui.",
        "Rêmoras foram banidas do oceano há anos. Os tubarões esperam que eles nunca mais voltem.",
        "'Fatos' só vai falar sobre coisas que você tem desbloqueado no jogo.",
        "O sistema de 'fatos' sempre esteve no código do jogo, mas não eram acessíveis até botarem esse botão de fatos.",
        "Novas Fronteiras, esse mod de 'Shark Game', foi inspirado pelo estilo de descoberta de mecânicas dos jogos da série 'Candy Box' e 'A Dark Room'.",
        "Quaisquer barreiras de progressão neste jogo podem ser perpassados com uma boa estratégia. Do latim estrategí.",
        "Esse jogo tem atalhos. Eles podem ser bem úteis. Procure-os no menu de opções.",
        "'Shark Game: Novas Fronteiras' é um mod do jogo feito por Cirrial 'Untitled Shark Game'. Começou como uma melhoria, mas virou um remake completo.",
        "A tradução que você está vendo agora foi feita por uma pessoa sem permissão dos criadores do mod.",
    ],
};
