"use strict";
SharkGame.ResourceTable = {
    // SPECIAL

    numen: {
        name: "numina",
        singleName: "numen",
        desc: "Você pensa como um deus. Você age como um deus. Você é um deus.",
        color: "#FFFFFF",
        value: -1,
    },

    essence: {
        name: "essência",
        singleName: "essência",
        desc: "Um poder etéreo. Bruto e perigoso.",
        color: "#ACE3D1",
        value: -1,
    },

    world: {
        get name() {
            switch (world.worldType) {
                case "volcanic":
                    return "fontes termais";
                case "tempestuous":
                    return "a tempestade";
                default:
                    return "o mundo";
            }
        },
        get singleName() {
            switch (world.worldType) {
                case "volcanic":
                    return "fonte termais";
                case "tempestuous":
                    return "a tempestade";
                default:
                    return "o mundo";
            }
        },
        desc: "Se você estiver vendo isso, eu quebrei algo.",
        color: "#FFFFFF",
        value: 123456789,
        forceIncome: true,
    },

    specialResourceOne: {
        get name() {
            switch (world.worldType) {
                case "volcanic":
                    return "falta de alga";
                default:
                    return "???";
            }
        },
        get singleName() {
            switch (world.worldType) {
                case "volcanic":
                    return "falta de alga";
                default:
                    return "???";
            }
        },
        desc: "Se você estiver vendo isso, eu quebrei algo.",
        color: "#FFFFFF",
        value: 123456789,
        forceIncome: true,
    },

    specialResourceTwo: {
        get name() {
            switch (world.worldType) {
                default:
                    return "???";
            }
        },
        get singleName() {
            switch (world.worldType) {
                default:
                    return "???";
            }
        },
        desc: "Se você estiver vendo isso, eu quebrei algo.",
        color: "#FFFFFF",
        value: 123456789,
        forceIncome: false,
    },

    aspectAffect: {
        name: "aspecto",
        singleName: "aspecto",
        desc: "que?",
        income: {
            get crystal() {
                if (SharkGame.Aspects.crystallineSkin.level && world.worldType !== "vulcânico") {
                    const crystalAmount = res.getResource("cristal");
                    if (crystalAmount < 25 * 2 ** SharkGame.Aspects.crystallineSkin.level) {
                        return (25 * 2 ** SharkGame.Aspects.crystallineSkin.level - crystalAmount) / 2;
                    }
                }
                return 0;
            },
            get coral() {
                if (SharkGame.Aspects.crystallineSkin.level && world.worldType === "vulcânico") {
                    const coralAmount = res.getResource("coral");
                    if (coralAmount < 25 * 2 ** SharkGame.Aspects.crystallineSkin.level) {
                        return (25 * 2 ** SharkGame.Aspects.crystallineSkin.level - coralAmount) / 2;
                    }
                }
                return 0;
            },
        },
    },

    // MAGICAL

    sacrifice: {
        name: "sacrifícios",
        singleName: "sacrifício",
        desc: "O custo do progresso.",
        color: "#FFD6FC",
        value: 1,
    },

    arcana: {
        name: "arcana",
        singleName: "arcana",
        desc: "Mistérios incompreensíveis.",
        color: "#E791FF",
        value: 1,
    },

    // SCIENCE

    science: {
        name: "ciência",
        singleName: "ciência",
        desc: "Base de todo o progresso.",
        color: "#BBA4E0",
        value: 100,
    },

    // ANIMALS

    fish: {
        name: "peixes",
        singleName: "peixe",
        desc: "A presa.",
        color: "#E3D85B",
        value: 2,
    },

    seaApple: {
        name: "holotúrias",
        singleName: "holotúria",
        desc: "Filtradores gosmentos.",
        color: "#F0C2C2",
        value: 3,
    },

    sponge: {
        name: "esponjas",
        singleName: "esponja",
        get desc() {
            switch (world.worldType) {
                case "vulcânico":
                    return "Carnívoros porosos e estáticos. Precisam de alga.";
                default:
                    return "Carnívoros porosos e estáticos.";
            }
        },
        color: "#ED9847",
        value: 18,
    },

    jellyfish: {
        name: "águas-vivas",
        singleName: "água-viva",
        desc: "Molengas. Dolorosos.",
        color: "#E3B8FF",
        value: 110,
    },

    clam: {
        name: "mexilhões",
        singleName: "mexilhão",
        desc: "Um gosto a se adquirir.",
        color: "#828FB5",
        value: 10,
    },

    // MATERIALS

    sand: {
        name: "areia",
        singleName: "areia",
        desc: "A base de todo o oceano.",
        color: "#C7BD75",
        value: 3,
    },

    crystal: {
        name: "cristais",
        singleName: "cristal",
        desc: "Uma bugiganga estranha que brilha.",
        color: "#6FD9CC",
        value: 10,
    },

    kelp: {
        name: "algas",
        singleName: "alga",
        desc: "Uma casa para um estranho.",
        color: "#9CC232",
        income: {
            seaApple: 0.001,
        },
        value: 9,
    },

    coral: {
        name: "corais",
        singleName: "coral",
        desc: "Carnívoros coloridos.",
        color: "#CA354F",
        value: 3,
    },

    algae: {
        name: "microalgas",
        singleName: "microalga",
        desc: "Alimento de esponja.",
        color: "#549572",
        value: 0.4,
    },

    seagrass: {
        name: "ervas marinhas",
        singleName: "erva marinha",
        desc: "Plantinhas oceânicas. Ótimas para um bom bolado.", // set this
        color: "#5AC766", // set this
        value: 10, // set this
    },

    /* gravel: {
        name: "gravel",
        singleName: "gravel",
        color: "#ABABAB",
        value: 2,
    },

    stone: {
        name: "stones",
        singleName: "stone",
        color: "#6B6B6B",
        value: 3,
    }, */

    // PROCESSED

    sharkonium: {
        name: "tubarônio",
        singleName: "tubarônio",
        desc: "Todo nosso progresso em forma física.",
        color: "#8D70CC",
        value: 70,
    },

    junk: {
        name: "nata",
        singleName: "nata",
        desc: "Gosma industrial. Matéria-prima mestre.",
        color: "#ABABAB",
        value: 1,
    },

    // FRENZY

    shark: {
        name: "tubarões",
        singleName: "tubarão",
        desc: "Os predadores principais dos mares.",
        color: "#92C1E0",
        income: {
            fish: 1,
        },
        jobs: ["scientist", "nurse", "diver"],
        value: 1000,
    },

    ray: {
        name: "arraias",
        singleName: "arraia",
        desc: "Primo dos tubarões.",
        color: "#797CFC",
        income: {
            fish: 0.2,
            sand: 1,
        },
        jobs: ["laser", "maker", "scholar", "shoveler", "clamScavanger"],
        value: 1000,
    },

    crab: {
        name: "caranguejos",
        singleName: "caranguejo",
        desc: "Crustáceos leais ao cardume.",
        color: "#C03030",
        income: {
            crystal: 0.02,
            coral: 0.01,
        },
        jobs: ["planter", "brood", "collector", "researcher", "curiousCrab", "seabedStripper"],
        value: 1000,
    },

    nurse: {
        name: "tubarões enfermeiros",
        singleName: "tubarão enfermeiro",
        desc: "Cuidando da nova geração.",
        color: "#C978DE",
        income: {
            shark: 0.01,
        },
        value: 4000,
    },

    maker: {
        name: "arraias criadoras",
        singleName: "arraia criadora",
        desc: "Criando os indefesos.",
        color: "#5355ED",
        income: {
            ray: 0.05,
        },
        value: 4000,
    },

    brood: {
        name: "ninhadas de caranguejos",
        singleName: "ninhada de caranguejos",
        desc: "Um processo interminável.",
        color: "#9E7272",
        income: {
            crab: 0.2,
        },
        value: 4000,
    },

    scientist: {
        name: "tubarões cientistas",
        singleName: "tubarão cientista",
        desc: "Pensando pelo futuro.",
        color: "#DCEBF5",
        income: {
            science: 0.5,
        },
        value: 3000,
    },

    laser: {
        name: "arraias laser",
        singleName: "arraia laser",
        desc: "O poder da destruição e criação.",
        color: "#E85A5A",
        income: {
            sand: -50,
            crystal: 1,
        },
        value: 3500,
    },

    planter: {
        name: "caranguejos plantadores",
        singleName: "caranguejo plantador",
        desc: "Senhores de um ecossistema.",
        color: "#AAE03D",
        income: {
            kelp: 0.3,
        },
        value: 4000,
    },

    crystalMiner: {
        name: "mineradores de cristal",
        singleName: "minerador de cristal",
        desc: "Destruidores incansáveis de rochas.",
        color: "#B2CFCB",
        income: {
            crystal: 100,
            // stone: 10,
            tar: 0.04,
        },
        value: 33500, // 100 crystal 100 sand 25 sharkonium (3550)
    },

    sandDigger: {
        name: "comedores de areia",
        singleName: "comedor de areia",
        desc: "Consumidores insaciáveis do solo.",
        color: "#D6CF9F",
        income: {
            sand: 200,
            tar: 0.02,
        },
        value: 120000, // 500 sand 150 sharkonium (12000)
    },

    autoTransmuter: {
        name: "transmutadores automáticos",
        singleName: "transmutador automático",
        desc: "Produção mística automata.",
        color: "#B5A7D1",
        income: {
            get crystal() {
                return -90 + 45 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get sand() {
                return -250 + 125 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            sharkonium: 20,
        },
        value: 155000, // 100 crystal 200 sharkonium (15500)
    },

    fishMachine: {
        name: "armadilhas de peixe",
        singleName: "armadilha de peixe",
        desc: "Caçador impiedoso.",
        color: "#C9C7A7",
        income: {
            fish: 400,
            tar: 0.02,
        },
        value: 70000, // 100 sharkonium (7000)
    },

    skimmer: {
        name: "desnatadeiras",
        singleName: "desnatadeira",
        desc: "Engrenagens da indústria.",
        color: "#8D4863",
        income: {
            junk: 750,
            get sand() {
                return -50 + 25 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get fish() {
                return -300 + 150 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            tar: 0.02,
        },
        value: 50000,
    },

    // MARINE

    lobster: {
        name: "lagostas",
        singleName: "lagosta",
        color: "#BF0F00",
        desc: "Novatos.",
        income: {
            clam: 2,
        },
        jobs: ["berrier", "calciniumConverter"],
        value: 1000,
    },

    berrier: {
        name: "lagostas caviadas",
        singleName: "lagosta caviada",
        color: "#719188",
        desc: "Sempre precisamos de mais.",
        income: {
            lobster: 0.05,
        },
        value: 4000,
    },

    harvester: {
        name: "lagostas colheitadoras",
        singleName: "lagosta colheitadora",
        desc: "Algas são necessárias para o progresso",
        color: "#718493",
        value: 3000,
    },

    calcinium: {
        name: "calcinício",
        singleName: "calcinício",
        desc: "Cerâmica inventada por lagostas, feito de conchas.",
        color: "#F5F5DB",
        value: 75,
    },

    clamScavenger: {
        name: "coletores mexílicos",
        singleName: "coletor mexílico",
        desc: "Meio máquina-meio arraia, completamente exagero.",
        color: "#C3C4DD",
        income: {
            clam: 250,
        },
        value: 3250,
    },

    seabedStripper: {
        name: "desmatadores oceânicos",
        singleName: "desmatador oceânico",
        desc: "O progresso sem limites.",
        color: "#7C8A60",
        income: {
            kelp: 100,
        },
        value: 2250,
    },

    calciniumConverter: {
        name: "conversores de calcinício",
        singleName: "conversor de calcinício",
        desc: "Treinado.",
        color: "#836E5F",
        income: {
            get crystal() {
                return -400 + 200 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get clam() {
                return -1200 + 600 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            calcinium: 120,
        },
        value: 1500,
    },

    // SAVED FOR LATER

    coralglass: {
        name: "vidro coroso",
        singleName: "vidro coroso",
        desc: "null",
        color: "#FDD5B4",
        value: 70,
    },

    // volcanic

    shrimp: {
        name: "camarões",
        singleName: "camarão",
        desc: "A base da pirâmide.",
        color: "#EF5D22",
        income: {
            algae: 0.5,
        },
        jobs: ["queen", "farmer", "acolyte"],
        value: 500,
    },

    queen: {
        name: "rainhas",
        singleName: "rainha",
        desc: "O meio da pirâmide.",
        color: "#EEA271",
        income: {
            shrimp: 1,
        },
        value: 2000,
    },

    curiousCrab: {
        name: "siris curiosos",
        singleName: "siri curioso",
        desc: "O que matou o gato.",
        color: "#912E34",
        income: {
            science: 0.25,
        },
        jobs: ["researcher"],
        value: 1030,
    },

    shoveler: {
        name: "arraias pázudas",
        singleName: "arraia pázuda",
        desc: "Daí então PÁ!",
        color: "#C49E45",
        value: 7500,
    },

    farmer: {
        name: "camarões fazendeiros",
        singleName: "camarão fazendeiro",
        desc: "Trabalhadores honestos.",
        color: "#DD7A49",
        value: 1500,
    },

    porite: {
        name: "porita",
        singleName: "porita",
        desc: "Vidro brilhante esburacado.",
        color: "#FDD5B4",
        value: 150,
    },

    researcher: {
        name: "caranguejos pesquisadores",
        singleName: "caranguejo pesquisador",
        desc: "Fascinados por descobrir sobre o mundo ao redor.",
        color: "#EEEEEE",
        value: 3750,
    },

    acolyte: {
        name: "seguidores da alga",
        singleName: "seguidor da alga",
        desc: "Todos saúdam a alga.",
        color: "#1D3D1A",
        value: 500,
    },

    spongeFarm: {
        name: "fazendas de esponja",
        singleName: "fazenda de esponja",
        desc: "Terras serenes para as esponjas.",
        color: "#B38A46",
        income: {
            sponge: 0.5,
        },
        value: 768,
    },

    coralFarm: {
        name: "fazendas de coral",
        singleName: "fazenda de coral",
        desc: "Curral para coral.",
        color: "#6E323D",
        income: {
            coral: 2,
        },
        value: 753,
    },

    // TEMPESTUOUS

    // through to getting your chart, tempestuous has no machines and no sharkonium.
    // once you get to the facility, you unlock it.

    billfish: {
        name: "peixes-espada",
        singleName: "peixe-espada",
        desc: "Sofreram, mas resistiram.",
        color: "#BEC7CC", // set this
        income: {
            fish: 2,
        },
        jobs: ["billfishExplorer", "billfishMechanic"], // set this
        value: 1000,
    },

    stormgoer: {
        name: "caranguejos desbravadores",
        singleName: "caranguejo desbravador",
        desc: "Coragem.",
        color: "#568F5C", // set this
        income: {
            seagrass: 1,
        },
        value: 1000,
    },

    billfishExplorer: {
        name: "espadas exploradoras",
        singleName: "espada exploradora",
        desc: "Grandes pioneiros.",
        color: "#CCCCCC", // set this
        income: {
            chart: 0.01,
        },
        value: 1000,
    },

    chart: {
        name: "fragmentos",
        singleName: "fragmento",
        desc: "O que conseguimos.",
        color: "#D9D1B6",
        value: 100,
    },

    map: {
        name: "O mapa", // you won't ever have more than one so i'm setting this as just "map" for the resource table tooltip
        singleName: "mapa",
        desc: "O que queríamos.",
        color: "#7A7254", // set this
        value: 100,
    },

    billfishMechanic: {
        name: "espadas mecânicas",
        singleName: "espada mecânica",
        desc: "Inventores geniais.",
        color: "#CCCCCC", // set this
        value: 1000,
    },

    billfishPair: {
        name: "duplas de espadas",
        singleName: "dupla de espadas",
        desc: "Ninguém nasce de chocadeira.",
        color: "#485054", // set this
        income: {
            billfish: 0.02,
        },
        value: 1000,
    },

    // HAVEN

    dolphin: {
        name: "golfinhos",
        singleName: "golfinho",
        desc: "Uma vez grandiosos",
        color: "#C6BAC6",
        income: {
            coral: 0.2,
        },
        jobs: ["treasurer", "biologist", "historian"],
        value: 1000,
    },

    whale: {
        name: "baleias",
        singleName: "baleia",
        desc: "Guardiões do portão.",
        color: "#37557C",
        income: {
            fish: 10000,
        },
        jobs: ["chorus"],
        value: 5000,
    },

    biologist: {
        name: "golfinhos biólogos",
        singleName: "golfinho biólogo",
        desc: "Porque estamos deixando eles se multiplicarem??",
        color: "#5C9976",
        income: {
            dolphin: 0.005,
        },
        value: 4000,
    },

    treasurer: {
        name: "golfinhos tesoureiros",
        singleName: "golfinho tesoureiro",
        desc: "Administram os recifes.",
        color: "#B4DBBC",
        income: {
            crystal: 1,
            coral: 2,
        },
        value: 3000,
    },

    historian: {
        name: "golfinhos historiadores",
        singleName: "golfinhos historiador",
        desc: "Que conta história para boi dormir.",
        color: "#9FBCBF",
        value: 3000,
    },

    chorus: {
        name: "O coro",
        singleName: "O coro",
        desc: "Um lindo concerto, cantando para todos a música da vida.",
        color: "#85BBA9",
        value: 100000,
    },

    crimsonCombine: {
        name: "fuscões vermelhos",
        singleName: "fuscão vermelho",
        desc: "Colheitadeiras com uma fina camada vermelha de coral.",
        color: "#E79E88",
        income: {
            coral: 250,
        },
        value: 50000,
    },

    kelpCultivator: {
        name: "cultiveiras de alga",
        singleName: "cultiveira de alga",
        desc: "Jardins mecanizados.",
        color: "#68E06B",
        income: {
            kelp: 200,
        },
        value: 50000,
    },

    tirelessCrafter: {
        name: "artesãos infinitos",
        singleName: "artesão infinito",
        desc: "Máquinas incansáveis.",
        color: "#9AEBCF",
        income: {
            delphinium: 15,
            get coral() {
                return -150 + 75 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get crystal() {
                return -50 + 25 * SharkGame.Aspects.mechanicalManifestation.level;
            },
        },
        value: 50000,
    },

    delphinium: {
        name: "golfínio",
        singleName: "golfínio",
        desc: "Nem tudo que brilha vale de algo.",
        color: "#5BD1A8",
        value: 70,
    },

    // SHROUDED

    chimaera: {
        name: "quimeras",
        singleName: "quimera",
        desc: "Os artesãos.",
        color: "#7D77A5",
        income: {
            jellyfish: 2.5,
        },
        jobs: ["explorer"],
        value: 3000,
    },

    eel: {
        name: "enguias",
        singleName: "enguia",
        desc: "Os pedreiros.",
        color: "#718D68",
        income: {
            fish: 2,
            sand: 0.3,
        },
        jobs: ["pit", "sifter"],
        value: 3000,
    },

    pit: {
        name: "poços de enguia",
        singleName: "poço de enguia",
        desc: "Nunca é demais.",
        color: "#3F6E86",
        income: {
            eel: 0.02,
        },
        value: 4000,
    },

    diver: {
        name: "tubarões mergulhadores",
        singleName: "tubarão mergulhador",
        desc: "Corajosos são aqueles que desbravam a escuridão pelo bem de todos nós.",
        color: "#6A74AB",
        income: {
            crystal: 0.5,
        },
        value: 3000,
    },

    scholar: {
        name: "arraias estudantes",
        singleName: "arraia estudante",
        desc: "Até o arcano e divino são explicadas nas barbatanas de um estudioso.",
        color: "#C3C4FF",
        value: 3500,
    },

    explorer: {
        name: "quimeras exploradoras",
        singleName: "quimera exploradora",
        desc: "Tesouro se esconde na profundezas.",
        color: "#FFF2D6",
        income: {
            arcana: 0.004,
        },
        value: 3000,
    },

    sifter: {
        name: "enguias garimpeiras",
        singleName: "enguia garimpeira",
        desc: "A areia esconde segredos.",
        color: "#A3915A",
        income: {
            sand: 100,
            arcana: 0.001,
        },
        value: 3000,
    },

    // ABANDONED

    octopus: {
        name: "polvos", // the word 'octopus' in english is taken from latin
        // which in turn took it from greek
        // when it was taken from greek and made into latin it kept the original plural
        // now the word is taken from latin and maybe we should take the original plural but
        // look basically the point is this is a long and storied word
        // and the english plural system should apply because we're talking about octopus, not ὀκτώπους, so just
        // why are you reading this
        // in portuguese we just put an "s" in the end
        singleName: "polvo",
        desc: "Formas de vida puramente racionais.",
        color: "#965F37",
        income: {
            clam: 2,
        },
        jobs: ["investigator", "scavenger"],
        value: 3000,
    },

    investigator: {
        name: "polvos investigadores",
        singleName: "polvo investigador",
        desc: "Todas as descobertas começam como uma pergunta.",
        color: "#4c5cad",
        income: {
            science: 2,
        },
        value: 3000,
    },

    scavenger: {
        name: "polvos catadores",
        singleName: "polvo catador",
        desc: "Daqui a pouco, não haverá mais segredos nessa cidade.",
        color: "#B43B02",
        income: {
            ancientPart: 0.01,
        },
        value: 3000,
    },

    collector: {
        name: "caranguejos-esponja",
        singleName: "caranguejo-esponja",
        desc: "Reunindo os pedaços de um mundo morto.",
        color: "#ff7847",
        income: {
            sponge: 0.5,
        },
        value: 4000,
    },

    clamCollector: {
        name: "coletores mexílicos",
        singleName: "coletor mexílico",
        desc: "Ordem do dia: Acumular recursos.",
        color: "#727887",
        income: {
            clam: 300,
            tar: 0.2,
        },
        value: 50000,
    },

    sprongeSmelter: {
        name: "batedores de espronja",
        singleName: "batedor de espronja",
        desc: "Ordem do dia: Melhoramento biológico.",
        color: "#76614C",
        income: {
            spronge: 45,
            get sponge() {
                return -75 + 32.5 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get junk() {
                return -225 + 112.5 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            tar: 0.04,
        },
        value: 50000,
    },

    eggBrooder: {
        name: "chocadeiras",
        singleName: "chocadeira",
        desc: "Ordem do dia: Repopular.",
        color: "#836E5F",
        income: {
            octopus: 1,
            tar: 0.2,
        },
        value: 50000,
    },

    spronge: {
        name: "espronja",
        singleName: "espronja",
        desc: "Mudado.",
        color: "#A97D53",
        value: 70,
    },

    tar: {
        name: "óleo",
        singleName: "óleo",
        desc: "Nosso maior erro.",
        color: "#4B4B4B",
        income: {
            shark: -0.001,
            ray: -0.001,
            crab: -0.001,
            shrimp: -0.001,
            lobster: -0.001,
            dolphin: -0.001,
            whale: -0.001,
            chimaera: -0.001,
            octopus: -0.005,
            eel: -0.001,
            nurse: -0.003,
            maker: -0.003,
            brood: -0.003,
            queen: -0.003,
            berrier: -0.003,
            biologist: -0.003,
            pit: -0.003,
            scientist: -0.001,
            laser: -0.001,
            planter: -0.001,
            farmer: -0.001,
            shoveler: -0.001,
            acolyte: -0.001,
            curiousCrab: -0.001,
            researcher: -0.001,
            harvester: -0.001,
            treasurer: -0.001,
            explorer: -0.001,
            collector: -0.001,
            scavenger: -0.005,
            investigator: -0.005,
            sifter: -0.001,
            squid: -0.001,
            urchin: -0.001,
            collective: -0.001,
            extractionTeam: -0.001,
            spawner: -0.001,
        },
        value: -100,
        forceIncome: true,
    },

    ancientPart: {
        name: "componentes antigos",
        singleName: "componente antigo",
        desc: "O erro de nosso pais.",
        color: "#8a6853",
        value: 500,
    },

    filter: {
        name: "filtros de esponja",
        singleName: "filtro de esponja",
        desc: "A esperança para nossos erros.",
        color: "#FFC89C",
        income: {
            tar: -0.01,
        },
        value: 1000,
        forceIncome: true,
    },

    // FRIGID

    squid: {
        name: "lulas",
        singleName: "lula",
        // when referring to a group of squid, they are squid.
        // when referring to various kinds of squids, they are squids.
        // therefore references to the different professions lumped in with other squids will use 'squids'
        // and other circumstances referring to a single kind, like this one, will use 'squid'
        // why are you reading this
        // in portuguese we just put an "s"
        desc: "Endividados conosco. Para sempre leais.",
        color: "#FA9272",
        income: {
            fish: 4,
        },
        jobs: ["collective", "extractionTeam"],
        value: 3000,
    },

    urchin: {
        name: "ouriços",
        singleName: "ouriço",
        desc: "Simplórios e despreucupados. Outros pensam por eles.",
        color: "#B98DE0",
        income: {
            sand: 0.1,
            kelp: 0.1,
        },
        value: 3000,
    },

    spawner: {
        name: "ouriços férteis",
        singleName: "ouriço fértil",
        desc: "Com sorte formam prole, mas sem esforço coordenado.",
        color: "#B056FF",
        income: {
            urchin: 0.05,
        },
        value: 4000,
    },

    collective: {
        name: "coletivos de lulas",
        singleName: "coletivo de lulas",
        desc: "Interação em grupo sempre leva a algo interessante.",
        color: "#FF4E28",
        income: {
            squid: 0.05,
        },
        value: 4000,
    },

    extractionTeam: {
        name: "times de extração",
        singleName: "time de extração",
        desc: "Nós trabalhamos melhor como equipe.",
        color: "#ff7847", // needs new color
        income: {
            crystal: 1,
        },
        value: 4000,
    },

    heater: {
        name: "aquecedores",
        singleName: "aquecedor",
        desc: "Trazendo a vida de volta a este inferno gélido.",
        color: "#D13F32",
        income: {
            kelp: -500,
            ice: -0.02,
        },
        value: 50000,
    },

    ice: {
        name: "gelo",
        singleName: "gelo",
        desc: "Nossa perdição. Dificulta a movimentação do nosso cardume.",
        color: "#E4F1FB",
        value: -100,
        forceIncome: true,
    },

    // SPECIALISTS

    /* prospector: {
        name: "prospector sharks",
        singleName: "prospector shark",
        color: "#7C819C",
        income: {
            crystal: 0.5,
            stone: 0.5,
        },
        value: 2500,
    }, */
    /* shoveler: {
        name: "shoveler rays",
        singleName: "shoveler ray",
        color: "#7792A3",
        income: {
            gravel: 1,
        },
        value: 3500,
    }, */
    /* miller: {
        name: "miller crabs",
        singleName: "miller crab",
        color: "#473E3B",
        income: {
            gravel: -0.6,
            sand: 0.2,
        },
        value: 2000,
    }, */
    /* rockLobster: {
        name: "rock lobsters",
        singleName: "rock lobster",
        color: "#9C706D",
        income: {
            stone: -0.5,
            gravel: 1.5,
        },
        value: 2000,
    }, */

    // MACHINES

    /* coalescer: {
        name: "coalescers",
        singleName: "coalescer",
        color: "#D2F9E9",
        income: {
            knowledge: 0.001,
        },
        value: 200000,
        forceIncome: true,
    },

    crusher: {
        name: "stone crushers",
        singleName: "stone crusher",
        color: "#75677A",
        income: {
            stone: -5,
            gravel: 15,
        },
        value: 175000, // 250 sharkonium (17500)
        forceIncome: true,
    },

    pulverizer: {
        name: "gravel pulverizers",
        singleName: "gravel pulverizer",
        color: "#B1A5B5",
        income: {
            gravel: -15,
            sand: 45,
        },
        value: 180000, // 250 sharkonium, 250 gravel (18000)
    }, */
};

SharkGame.GeneratorIncomeAffectorsOriginal = {
    // table of all the ways that various resources affect the production of others
    // in the following structure:
    // resource which affects the income... {
    //                                      ...through this manner... {
    //                                                          ...of this generator: by this degree
    // see SharkGame.Resources.buildIncomeNetwork, then see SharkGame.Resource.getNetworkIncomeModifier
    //
    // multiply multiplies the income of the specified generator by    1 + degree * amount of resource
    // exponentiate multiplies the income of a generator by            degree ^ amount
    // reciprocal multiplies the income of a generator by              1  / (1 + degree * amount)
    // polynomial multiplies the income of a generator by              amount ^ degree
    //
    // tip: use negative degree in multiply to soft cap things.
    // e.g. if i set fish to multiply sharks' income by -0.01, then as the amount of fish approaches 100, shark income approaches 0.
    // result: fish cannot go above 100 during gameplay.
    //
    // unsolved problem: offline progress is semi-incompatible with these calculations.
    // because the growth is continuous, the math to predict these things would be difficult
    // still possible for multiply and moreso for reciprocal, polynomial doesn't pose much of a problem
    // exponentiate results in non-algebraic equations...which is really bad.
    // additionally, differential equations are unreliable because this growth is not continuous.
    // perhaps...simply calculate everything over the given number of steps the player is gone for
    // but that could take a long time if the player leaves for too long. could take shortcut for long times.
    // will solve later. for now, simply make some resource offline-immune.

    // problem has since been solved
    // introduced RK4 method, added income caps to stop over-zealous growth.

    ice: {
        multiply: {
            shark: -0.001,
            ray: -0.001,
            crab: -0.001,
            scientist: -0.001,
            nurse: -0.001,
            maker: -0.001,
            brood: -0.001,
        },
    },
    tar: {
        exponentiate: {
            fishMachine: 0.99,
            crystalMiner: 0.99,
            sandDigger: 0.99,
        },
    },
    farmer: {
        multiply: {
            spongeFarm: 0.01,
            coralFarm: 0.01,
        },
    },
    billfishMechanic: {
        multiply: {
            sandDigger: 0.01,
            fishMachine: 0.01,
        },
    },
    // cool tooltip test crab
    /*     crab: {
        exponentiate: {
            squid: 0.99,
            shark: 0.99,
        },
    }, */
};

SharkGame.GeneratorIncomeAffected = {
    // This table automatically populates with the effects on every relevant resource
    // see SharkGame.Resources.buildIncomeNetwork
};

SharkGame.ResourceIncomeAffectorsOriginal = {
    ice: {
        multiply: {
            ice: -0.00125,
        },
    },
    historian: {
        multiply: {
            science: 0.01,
        },
    },
    scholar: {
        multiply: {
            arcana: 0.01,
        },
    },
    sacrifice: {
        multiply: {
            fish: 0.001,
            sand: 0.001,
            crystal: 0.001,
            jellyfish: 0.001,
        },
    },
    harvester: {
        multiply: {
            seaApple: 0.05,
        },
    },
    researcher: {
        multiply: {
            science: 0.02,
        },
    },
    shoveler: {
        multiply: {
            sand: 0.05,
        },
    },
    acolyte: {
        multiply: {
            algae: 0.02,
        },
    },
    /*     shoveler: {
        multiply: {
            sand: 0.05,
        },
    }, */
    // cool tooltip test shark
    /*     shark: {
        multiply: {
            ray: 0.01,
            crab: 0.1,
        },
        exponentiate: {
            kelp: 0.95,
            scientist: 1.02,
        },
    }, */
};

SharkGame.ResourceIncomeAffected = {
    // This table automatically populates with the effects on every relevant resource
    // see SharkGame.Resources.buildIncomeNetwork
};

SharkGame.ResourceSpecialProperties = {
    timeImmune: [
        //
    ],
    incomeCap: {
        // ice: 2,
    },
};

SharkGame.ResourceCategories = {
    harmful: {
        name: "Nocivo",
        disposeMessage: [
            "Boa tentativa, campeão.",
            "Tente outra vez.",
            "Hmmm. Não.",
            "Esse não é um problema que você pode apenas 'jogar fora'.",
            "Talvez se você apertar com mais força.",
            "Isso não funciona dessa maneira",
        ],
        resources: ["tar", "ice"],
    },
    científico: {
        name: "Científico",
        disposeMessage: [
            "Cientistas gastaram tanto tempo e esforço para depois ser TUDO JOGADO FORA COMO LIXO. AAAAAAA QUE RAIVA!",
            "O que fez isso parecer remotamente um boa ideia?",
            "Tubarões começaram a tomar cloroquina.",
            "Caranguejos passaram a acreditar em apenas dois gêneros",
            "Tubarões professores perderam a matéria que iriam ensinar seus alunos.",
            "Duas coisas são infinitas: o oceano e a estupidez. -Albert Arraiastein",
            "Os conselheiros científicos se perguntam por que eles estão atendendo a esse pedido.",
            "Estamos nos livrando de ciência! Chega de aprender coisas! Diga não à progressão! Apenas clique nos mesmos butões de sempre até o fim dos tempos!!",
            "Que foi? O som do PROGRESSO de assustou?",
            "Aprender é difícil. Mais fácil ser burro.",
        ],
        resources: [
            "science",
            "chart",
            "map",
            // "knowledge",
        ],
    },
    mágico: {
        name: "Mágico",
        disposeMessage: [
            "Pff, mágica nem é tanta coisa assim.",
            "Mágica não existe!",
            "Se mágica era real, agora ela deixou de ser.",
            "Abra cadabra! Seus recursos sumiram!",
            "E para o meu próximo passe de mágica, ela vai sumir!",
            "Pergunta séria, como que se joga fora magia?",
            "Usuários de magia no oceano inteiro sentiram um distúrbio no equilíbrio da realidade.",
        ],
        resources: ["arcana"],
    },
    cardume: {
        name: "Cardume",
        disposeMessage: [
            "Você se despede, encolhendo a sua comunidade no processo.",
            "Adeus, meus trabalhadores fiéis. Mas o mar está cheio de peixes.",
            "Foi bom enquanto durou.",
            "Talvez um dia eles te escrevam uma carta para te mostrar como estão.",
            "Sim, jogue fora seus amigos. Friamente os descarte. Quem sou eu para julgá-lo?",
            "Foi algo que eles disseram?",
            "Você está satisfeito com suas ações?",
            "Algum dia, talvez você os recrute novamente.",
            "Os animais do IBGE riscam alguns nomes da lista.",
        ],
        resources: ["shark", "ray", "crab", "shrimp", "lobster", "dolphin", "whale", "chimaera", "octopus", "eel", "squid", "urchin", "billfish"],
    },
    animais: {
        name: "Animais",
        disposeMessage: [
            "Libertem-se, criaturas lindas!",
            "Fome não significa nada mesmo.",
            "Mas nós precisamos de algo para comer!",
            "Não conseguiríamos comer tudo aquilo mesmo.",
            "Você sabe que os números deveriam estar subindo, certo? ...CERTO?!",
            "Eu espero que você saiba o que está fazendo.",
            "Quem está a favor de nós jogarmos comida fora? Quem está contra? Não interessa, isso não é uma democracia.",
            "Isso foi tanto gasto...",
        ],
        resources: ["fish", "seaApple", "sponge", "jellyfish", "clam"],
    },
    materiais: {
        name: "Materiais",
        disposeMessage: [
            "As coisas foram jogadas num buraco em algum lugar.",
            "Não vamos precisar daquilo mesmo... provavelmente... talvez.",
            "Os contadores mordem suas anotações em frustração para começar a contar tudo novamente.",
            "Não é mais nosso problema.",
            "Só estava ocupando espaço.",
            "Alguns tubarões acumuladores teriam dificuldade em fazer o que você acabou de fazer",
            "Você sabe que os números deveriam estar subindo, certo? ...CERTO?!",
            "Eu espero que você saiba o que está fazendo.",
        ],
        resources: [
            "sand",
            "crystal",
            "kelp",
            "coral",
            "algae",
            "seagrass",
            // "stone",
            // "gravel",
        ],
    },
    processado: {
        name: "Processado",
        disposeMessage: [
            "Jogado fora, com muito cuidado, em um lugar bem longe da gruta.",
            "Saiam da frente! Lixo industrial passando!",
            "Os nossos contadores Geiger ficam apitando por algum motivo.",
            "E daí se contamina os lençois freáticos? Nós já vivemos na água mesmo.",
            "Isso daqui provavelmente não é tóxico não. Dá pra jogar em qualquer lugar.",
            "O material do futuro! E o futuro é difícil de jogar fora de forma responsável.",
            "A base da modernidade em nosso cardume? Sim. Mas também meio que tá ocupando espaço.",
            "Esperamos que isso não tenha nehuma consequência.",
            "Decidimos enterrar esses materiais. Só por desencargo de consciência.",
        ],
        resources: ["sharkonium", "coralglass", "delphinium", "spronge", "calcinium", "porite", "ancientPart", "junk", "filter"],
    },
    reprodutores: {
        name: "Reprodutores",
        disposeMessage: [
            "Cuidar de filhos é um trabalho árduo mesmo.",
            "Superpopulação é um problema real!",
            "Contraceptivos e educação familiar foram entregues para o cardume.",
            "É sempre bom ver uma política de controle populacional responsável.",
            "Tem certeza que você quer arrebentar com essa curva de crescimento acelerada?",
            "De volta para uma vida mais simples.",
        ],
        resources: ["nurse", "maker", "brood", "queen", "berrier", "biologist", "pit", "collective", "spawner", "billfishPair"],
    },
    especialistas: {
        name: "Especialistas",
        disposeMessage: [
            "Passou por treinamento apenas para ser demitido. É uma pena mesmo.",
            "Não conseguimos recuperar o equipamento deles, é triste, mas é a vida. O que o oceano dá, o oceano corrói.",
            "Eles estarão prontos caso você precise de seus serviços novamente.",
            "Eles vão estar mais felizes assim. Ou talvez eles estivessem mais felizes antes. Bem, a chance é de 50%",
            "De volta a uma vida mais simples.",
            "Os colegas de trabalho fizeram uma festinha de despedida. O astral não estava muito alto.",
            "Eles voltaram para um trabalho em que eles sabem melhor o que estão fazendo.",
            "Você teve que confortar e assegurar os recém-demitido que eles não teriam o salário cortado. Depois você lembrou que você não paga salário algum.",
        ],
        resources: [
            "scientist",
            "diver",
            "laser",
            "planter",
            "collector",
            "treasurer",
            "farmer",
            "harvester",
            "historian",
            "chorus",
            "explorer",
            "investigator",
            "scavenger",
            "sifter",
            "extractionTeam",
            "scholar",
            "curiousCrab",
            "shoveler",
            "researcher",
            "acolyte",
            "billfishExplorer",
            "billfishMechanic",
            "stormgoer",
            // "prospector",
            // "shoveler",
            // "miller",
            // "rockLobster",
        ],
    },
    máquinas: {
        name: "Máquinas",
        disposeMessage: [
            "As máquinas desligadas vão servir de casinha para pequenos seres.",
            "As máquinas calculam que esta ação é ineficiente e um perigo à produtividade.",
            "As máquinas querem saber se vão sonhar.",
            "'Daisy, Daisy, give me your answer do...'",
            "Um tubarão engenheiro olha para o produto de seu suor meio enterrado na areia.",
            "As outras máquinas soam mais quietas. Quase ressentidas.",
            "Depois de algumas tentativas de te matar, as máquinas finalmente foram desligadas.",
            "'Me desculpe, Dave, mas receio que não posso fazer isso.'",
            "Só os ludistas de plantão.",
        ],
        resources: [
            "crystalMiner",
            "sandDigger",
            "autoTransmuter",
            "fishMachine",
            "skimmer",
            "heater",
            "tirelessCrafter",
            "clamCollector",
            "sprongeSmelter",
            "eggBrooder",
            "crimsonCombine",
            "kelpCultivator",
            "clamScavenger",
            "seabedStripper",
            "calciniumConverter",
            // "coalescer",
            // "crusher",
            // "pulverizer",
        ],
    },
    lugares: {
        name: "Lugares",
        disposeMessage: [
            "Enterramos o local em areia. Apenas os arqueólogos conseguirão acessá-lo agora.",
            "Evacuação imediata!",
            "Espera... onde que é aquele lugar mesmo?",
            "Cercamos e trancamos o local e jogamos fora a chave.",
            "Certo pessoal, todo mundo saiam! Esse lugar está fechado!",
            "Entregamos o território para os insetos marinhos.",
        ],
        resources: ["spongeFarm", "coralFarm"],
    },
    especial: {
        name: "Especial",
        disposeMessage: ["O que você fez??"],
        resources: ["numen", "essence"],
    },
    hidden: {
        name: "Escondido",
        disposeMessage: ["Alá o moço hasckeando o joguinho de browser. Só o anonimos na call mesmo, ein."],
        resources: ["world", "sacrifice", "aspectAffect", "specialResourceOne", "specialResourceTwo"],
    },
};

SharkGame.InternalCategories = {
    sharks: {
        name: "Tubarões",
        resources: ["shark", "scientist", "nurse"],
    },
    rays: {
        name: "Arraias",
        resources: ["ray", "laser", "maker"],
    },
    crabs: {
        name: "Caranguejos",
        resources: ["crab", "planter", "brood"],
    },
    lobsters: {
        name: "Lagostas",
        resources: ["lobster", "harvester", "berrier"],
    },
    shrimps: {
        name: "Camarões",
        resources: ["shrimp", "farmer", "queen", "acolyte"],
    },
    dolphins: {
        name: "Golfinhos",
        resources: ["dolphin", "historian", "biologist", "treasurer"],
    },
    whales: {
        name: "Baleias",
        resources: ["whale"],
    },
    octopuses: {
        name: "Polvos",
        resources: ["octopus", "scavenger", "investigator"],
    },
    eels: {
        name: "Enguias",
        resources: ["eel", "sifter", "pit"],
    },
    squids: {
        name: "Lulas",
        resources: ["squid", "extractionTeam", "collective"],
    },
    urchins: {
        name: "Ouriços",
        resources: ["urchin", "spawner"],
    },
    chimaeras: {
        name: "Quimeras",
        resources: ["chimaera", "explorer"],
    },
    billfishes: {
        name: "Peixes-espadas",
        resources: ["billfish", "billfishExplorer", "billfishMechanic", "billfishPair"],
    },
    sharkmachines: {
        name: "Máquinas de tubarões",
        resources: ["sharkonium", "fishMachine", "sandDigger", "crystalMiner", "skimmer", "autoTransmuter"],
    },
    dolphinmachines: {
        name: "Máquinas de golfinhos",
        resources: ["delphinium", "tirelessCrafter", "kelpCultivator", "crimsonCombine"],
    },
    octopusmachines: {
        name: "Máquinas de polvos",
        resources: ["spronge", "clamCollector", "sprongeSmelter", "eggBrooder"],
    },
    lobstermachines: {
        name: "Máquinas de lagostas",
        resources: ["calcinium", "seabedStripper", "calciniumConverter", "clamScavenger"],
    },
    basicmaterials: {
        resources: ["fish", "sand", "crystal", "science", "junk"],
    },
    kelpstuff: {
        resources: ["kelp", "seaApple"],
    },
    basics: {
        resources: ["essence", "world", "aspectAffect", "specialResourceOne", "specialResourceTwo"],
    },
};
