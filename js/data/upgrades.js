"use strict";
SharkGame.Upgrades = {
    purchased: [],
    generated: {},

    getUpgradeTable(worldType = world.worldType) {
        if (typeof SharkGame.Upgrades[worldType] !== "object") {
            // This world type doesn't have any special upgrades, so use the default ones.
            // We don't want to generate the same upgrade table multiple times for no reason.
            worldType = "default";
        }
        if (!_.has(SharkGame.Upgrades.generated, worldType)) {
            return (SharkGame.Upgrades.generated[worldType] = SharkGame.Upgrades.generateUpgradeTable(worldType));
        }
        return SharkGame.Upgrades.generated[worldType];
    },

    getUpgradeData(table, upgradeName) {
        if (!table[upgradeName]) {
            return;
        }

        // probably find a way to forego the clonedeep here, but the performance impact seems negligible.
        const data = _.cloneDeep(table[upgradeName]);

        // apply effect of internal calculator aspect if indeed applicable
        // would use getters but there would be too many getters to be reasonable
        let theThing = 150;
        if (SharkGame.Aspects.internalCalculator.level > 1) {
            theThing = 150 * (SharkGame.Aspects.internalCalculator.level - 1) ** 2;
        }

        if (data.cost && data.cost.science && data.cost.science <= theThing) {
            switch (SharkGame.Aspects.internalCalculator.level) {
                case 0:
                    // haha nothing
                    break;
                case 1:
                    data.cost.science *= 0.5;
                    break;
                default:
                    $.each(data.cost, (resource) => {
                        data.cost[resource] *= 0.5;
                    });
            }
        }

        if (cad.upgradePriceModifier !== 1) {
            $.each(data.cost, (resource) => {
                data.cost[resource] *= cad.upgradePriceModifier;
            });
        }

        return data;
    },

    generateUpgradeTable(worldType = world.worldType) {
        /** @type {UpgradeTable} */
        let finalTable = {};
        const defaultUpgrades = SharkGame.MiscUtil.cloneDeep(SharkGame.Upgrades.default);
        if (_.has(SharkGame.Upgrades, worldType)) {
            const worldUpgrades = SharkGame.MiscUtil.cloneDeep(SharkGame.Upgrades[worldType]);
            _.each(Reflect.ownKeys(worldUpgrades), (upgradeName) => {
                if (defaultUpgrades[upgradeName]) {
                    finalTable[upgradeName] = {};
                    const names = Reflect.ownKeys(worldUpgrades[upgradeName]);
                    _.each(names, (theName) => {
                        const descriptor = Object.getOwnPropertyDescriptor(worldUpgrades[upgradeName], theName);
                        Object.defineProperty(finalTable[upgradeName], theName, descriptor);
                    });
                    const defaultNames = Reflect.ownKeys(defaultUpgrades[upgradeName]);
                    _.each(defaultNames, (theName) => {
                        if (!finalTable[upgradeName][theName]) {
                            const descriptor = Object.getOwnPropertyDescriptor(defaultUpgrades[upgradeName], theName);
                            Object.defineProperty(finalTable[upgradeName], theName, descriptor);
                        }
                    });
                } else {
                    finalTable[upgradeName] = worldUpgrades[upgradeName];
                }
            });
        } else {
            finalTable = defaultUpgrades;
        }
        return finalTable;
    },
    default: {
        crystalBite: {
            name: "Mordedura de Cristal",
            desc: "Morda os cristais até eles ficarem num formato que nos ajude a morder ainda melhor!",
            researchedMessage: "Dentaduras estranhas foram feitas, e tubarões conseguem agora caçar peixes melhor.",
            effectDesc: "Com seus novos mordedores, a efetividade dos tubarões é dobrada. Na verdade, funciona ainda melhor se for usado fora da boca!",
            cost: {
                science: 50,
                fish: 100,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        crystalSpade: {
            name: "Chapa de Cristal",
            desc: "Aperte o cristal até produzir uma armadura de cabeça para as raias.",
            researchedMessage: "As arraias conseguem perturbar mais a areia, ou seja, agora coletamos mais areia!",
            effectDesc: "Efetividade das arraias duplica devido a suas novas ferramentas adaptadas ao seus formatos.",
            cost: {
                science: 50,
                sand: 500,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crystalScoop: {
            name: "Coletor de Cristal",
            desc: "Invente uns seguradores engraçados para os caranguejos!",
            researchedMessage: "Nossos caranguejos antes tinham que varrer a areia com as patas para achar os cristais - agora eles podem cavá-los!",
            effectDesc:
                "Caranguejos são duas vezes mais eficientes ao procurar por cristais. Eles estão em êxtase por segurar essas mini ferramentas com suas mini garras.",
            cost: {
                science: 50,
                crystal: 10,
            },
            effect: {
                incomeMultiplier: {
                    crab: 2,
                },
            },
        },
        crystalContainer: {
            name: "Garrafas de Cristal",
            desc: "Faça uns trecos garrafescos usando os nossos cristais. Talvez seja útil??",
            researchedMessage: "Bem, coisas que não são água podem ser guardadas nesse vidrinhos. A ciência ficou mais fácil!",
            effectDesc: "Cientistas têm sua velocidade dobrada ao fazer ciência.",
            cost: {
                science: 100,
                crystal: 50,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        statsDiscovery: {
            name: "Caverna Armazém",
            desc: "Tá na hora de nós acharmos um lugar de verdade para manter nossos estoques. Achamos um cafofo, mas precisa ser arrumado.",
            researchedMessage:
                "Todos as nossas coisas foram guardadas, separadas e categorizadas em um sistema de cavernas inundado. Nós estamos todos organizados! Mais ou menos!",
            effectDesc: "Ao armazenar nossos bens em um local centralizado, finalmente podemos manter controle do que estamos fazendo...em sua maior parte.",
            cost: {
                science: 150,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
        },
        underwaterChemistry: {
            name: "Química Submersa",
            desc: "Com nossas garrafas estrahas, podemos colocar coisas junto com outras coisas e ver o que acontece.",
            researchedMessage: "Então, nada de útil foi descoberto, mas se a gente continuar com isso, vamos fazer grandes passos pela ciência!",
            effectDesc: "Cientistas usam seus novos conhecimentos químicos para dobrar sua eficiência.",
            cost: {
                science: 200,
                crystal: 50,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        seabedGeology: {
            name: "Geologia Oceânica",
            desc: "Estude o fundo do oceano para determinar seus ricos e belos segredinhos.",
            researchedMessage: "Não só descobrimos muitas coisas estranhas, as arraias descobriram que existe mais areia do que apenas areia!",
            effectDesc: "Com um novo entendimento do solo oceânico e seus sedimentos, eficiência de arraias é dobrada.",
            cost: {
                science: 250,
                sand: 750,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        thermalVents: {
            name: "Fontes Termais",
            desc: "Investigue os buracos ferventes que ficam jogando água quente.",
            researchedMessage: "Mas que belo! Nós temos uma nascente de calor interminável! Tenho certeza que algo bom virá disso.",
            effectDesc: "Uma fonte de energia quase infinita foi descoberta. Novas tecnologias são possíveis!",
            cost: {
                science: 300,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {
            name: "Raia LASER",
            desc: "Usa ciência tubarão super mágica e maneira para pegar o calor das fontes para uso.",
            researchedMessage: "As arraias agora podem ser equipadas com um laser para fundir areia em cristal! Bem vindos ao futuro! Tudo no futuro é cromado!",
            effectDesc: "Podemos treinar arraias laser para derreter areia em cristal vítreo.",
            cost: {
                science: 100,
                sand: 5000,
                crystal: 100,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        transmutation: {
            name: "Transmutação",
            desc: "Ao esquentar coisas e fazer ciência, novas coisas podem ser feitas!",
            researchedMessage: "Um novo tipo de material foi descoberto! Foi batizado em homenagem de seu criador, Dr. Tubarão.",
            effectDesc: "Permite a transmutação de umas coisas que nós temos jogadas por aí em tubarônio, o material do futuro.",
            cost: {
                science: 4000,
                crystal: 1500,
                sand: 15000,
            },
            required: {
                upgrades: ["thermalVents", "underwaterChemistry"],
            },
        },
        automation: {
            name: "Automação",
            desc: "Usando tubarônio, podemos fazer coisas que fazem coisas para que nós não precisemos fazer as coisas!",
            researchedMessage: "Agora não precisamos fazer todo o trabalho, já que as máquinas o fazem por nós! FUTUUURO!!",
            effectDesc: "Máquinas podem ser construídas para ajudar na produção do cardume de forma mais eficiente.",
            cost: {
                science: 3500,
                sharkonium: 250,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        engineering: {
            name: "Engenharia",
            desc: "Nossas máquinas são meio ruins. Vamos aprender a montá-las melhor!",
            researchedMessage: "Dobramos a produção das máquinas, e ainda aprendemos a fazer outras máquinas! Dois em um!",
            effectDesc: "Produção das nossas máquinas multiplicada por dois. Desnatadoras e transmutadoras automáticas são agora construíveis.",
            cost: {
                science: 5000,
                sharkonium: 1750,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recicladora",
            desc: "Invente um sistema de destruir recursos em uma gosma para ser reutilizada em outra coisa.",
            researchedMessage:
                "Bem, isso daqui parece que veio de um pesadelo. Eu não atreveria a nadar perto de qualquer buraco dessa máquina. Mas ela certamente pode ser útil para nós!",
            effectDesc: "Possibilita a reciclagem de materiais por meio de uma boca aterrorizante que consume e destrói tudo que chega perto. Futuro?",
            cost: {
                science: 75000,
                sharkonium: 25000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Design Iterado",
            desc: "As máquinas são boas, mas poderiam ser melhores. Vamos refazer nossas máquinas do zero!",
            researchedMessage: "E nós aprendemos que ciência é sobre aprender de erros, é o que diz os cientistas. Sobre seus próprios erros.",
            effectDesc: "Todas as máquinas tubarônicas duplicam sua velocidade. Sim, de novo! Além disso, cientistas quadruplicam sua eficiência.",
            cost: {
                science: 15000,
                sharkonium: 17500,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    skimmer: 2,
                    heater: 2,
                    scientist: 4,
                },
            },
        },
        superprocessing: {
            name: "Superprocessamento",
            desc: "A recicladora não foi feita com o dissolução de milhões de peixes em mente. Considerando que isso é uma demanda bem comum, nós provavelmente deveríamos fazer algo sobre isso.",
            researchedMessage: "Eureca! Se fizermos as coisas grandes ficarem maiores, e os moedores mais moídos, nós poderemos processar muito mais material de uma só vez!",
            effectDesc:
                "A eficiência da recicladora só começa a cair na casa dos 10 milhões de itens de uma só vez, ao invés de 100 mil. A eficiência máxima também aumentou para 100%.",
            cost: {
                science: 1e6,
                sharkonium: 5e5,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        biology: {
            name: "Biologia",
            desc: "O que é um tubarão? O que tem dentro de um tubarão, além de muitos peixes?",
            researchedMessage: "Com uma nova compreensão da própria biologia, tubarões agora podem se especializar em montar novos tubarões.",
            effectDesc:
                "Tubarões produzem duas vezes mais e tubarões enfermeiros podem ser treinados. Você sabia que ovos de tubarão não aparecem apenas porque um tubarão pediu muito a Papai do Céu?",
            cost: {
                science: 600,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        agriculture: {
            name: "Agricultura",
            desc: "Não sabemos por quanto tempo uma sociedade caçadora-coletora irá nos servir. Talvez devêssemos juntar nossos animais e deixá-los crescer.",
            researchedMessage: "É tão mais fácil conseguir coisas quando elas estão todas em um lugar. Como se o oceano inteiro estivesse na nossa gruta!",
            effectDesc: "Avanços na agricultura irão incentivar futuras empreitadas. Quem sabe qual vai ser o nosso próximo passo!",
            cost: {
                science: 500,
                sand: 1500,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        kelpHorticulture: {
            name: "Horticultura de Alga",
            desc: "Descubra o que é necessário para encher o solo de alga marinha. Possivelmente será útil.",
            researchedMessage: "Equipamento caranguêjico foi inventado para eles começarem a plantar alga! Isso é possivelmente útil.",
            effectDesc: "Caranguejos podem se especializar em fazendeiros de algas e crescer um tapete verde pelo fundo do oceano.",
            cost: {
                science: 1500,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
                resources: ["kelp"],
            },
        },
        xenobiology: {
            name: "Xenobiologia",
            desc: "Tente explicar oque que são essas frutinhas que ficam saindo da nossa alga.",
            researchedMessage: "Resultados inconclusivos! Mais pesquisa é necessária. Pode ser um grande benefício para a ciência!",
            effectDesc:
                "Algas produzem holotúrias duas vezes mais rápido. Nós podemos dissecar holotúrias pela ciência. Também, nós descobrimos que holotúrias não são frutas. Que nojo.",
            cost: {
                science: 2000,
            },
            required: {
                upgrades: ["agriculture"],
                resources: ["seaApple", "jellyfish"],
                seen: ["seaApple", "jellyfish"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
        rayBiology: {
            name: "Biologia Arraiística",
            desc: "Mesmo sendo primos de nós, tubarões, não sabemos quase nada das arraias. Nós podemos consertar isso. Só precisamos de uma armadilha.",
            researchedMessage:
                "Aparentemente, poderíamos ter apenas perguntado. Mas conseguimos descobrir como arraias fazem mais arrainhas. É bem parecido como tubarões funcionam, mas com arraias.",
            effectDesc:
                "Arraias e arraias laser são duas vezes mais rápidas e criadores de arraias estão disponíveis. Mas talvez as relações tubarão-arraia nunca voltem ao seu estado original depois de quão vergonhoso isso foi para todos os envolvidos.",
            cost: {
                science: 1500,
                sand: 10000,
            },
            required: {
                upgrades: ["biology", "laserRays"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                    laser: 2,
                },
            },
        },
        crabBiology: {
            name: "Biologia Caranguêsa",
            desc: "Essas criaturinhas são um mistério. Eles são calados e apenas cavam cristais ou plantam coisas. Por que eles fazem isso? E o QUE são siris??",
            researchedMessage:
                "Parece que caranguejos são crustáceos amigáveis que revelaram aos tubarões os segredos de produção de caraguejo. Envolvendo ovos, ou algo parecido. Ovos que se mexem.",
            effectDesc:
                "Caranguejos e plantadores são, respectivamente, 4 e 2 vezes mais rápido, e ninhadas de caranguejo podem ser formadas. Siris aparentemente são apenas um tipo de caranguejo, o que é legal, mas um pouco assustador, porque caranguejos são assustadores. Que bom que eles estão do nosso lado!",
            cost: {
                science: 8500,
                kelp: 1000,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                resources: ["crab"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 2,
                },
            },
        },
        sunObservation: {
            name: "Observação Solar",
            desc: "Precisamos entender que brilho maluco é aquele na superfície da água.",
            researchedMessage: "Cientistas acabaram de descobrir o Sol! Eles também descobriram que olhar para sol dói.",
            effectDesc:
                "Plantadores colhem duas vezes mais alga. Será que um sol vale vários peixes? Nós vemos o Sol, mas onde que está? O que faz um Sol brilhar?",
            cost: {
                science: 7500,
            },
            required: {
                upgrades: ["agriculture", "kelpHorticulture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 2,
                },
            },
        },
        exploration: {
            name: "Exploração",
            desc: "Nade além desse mar conhecido para vez o que mais achamos!",
            researchedMessage: "Achamos um monte de peixes! De todo tipo de cardume possível! E tantas reservas de areia não exploradas!",
            effectDesc: "Tubarões e arraias pegam o dobro de recursos. Você sabia que oceanos eram tão grandes assim? Incrível!",
            cost: {
                science: 10000,
                fish: 50000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    ray: 2,
                },
            },
        },
        farExploration: {
            name: "Exploração Longínqua",
            desc: "Explore as vastas águas além de qualquer expedição já feita.",
            researchedMessage: "Depósitos ricos em cristal foram achados, junto de abismos grandes e profundos.",
            effectDesc: "Caranguejos quadruplicam sua eficiência. Você sabia que os oceanos são maiores do que apenas grande? Fantástico!",
            cost: {
                science: 12000,
                fish: 125000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                },
            },
        },
        gateDiscovery: {
            name: "Exploração Abissal",
            desc: "Múltiplas expedições perigosas e audaciosas ao fundo do abismo, para pegar o que acharmos.",
            researchedMessage: "Nós achamos uma estrutura estranha pelas pistas achadas no abismo. O custo foi alto, mas a descoberta é maior!",
            effectDesc: "Algo ancestral reside nas profundezas.",
            cost: {
                science: 1e6,
                shark: 1000,
                fish: 2500000,
            },
            required: {
                upgrades: ["farExploration"],
            },
        },
    },
    abandoned: {
        // Unless upgrade is defined here, it won't exist on the world
        // hence the empty objects
        crystalBite: {},
        crystalSpade: {},
        crystalContainer: {},
        statsDiscovery: { cost: { science: 75 } },
        underwaterChemistry: {},
        seabedGeology: {},
        thermalVents: {
            cost: {
                science: 500,
                sand: 1000,
            },
        },
        clamScooping: {
            name: "Coleta de Mexilhão",
            desc: "Vemos essas coisas por toda parte, mas não conseguimos diferenciar quais são mexilhões e quais são pedras.",
            researchedMessage:
                "Observação cuidadosa revelou que mexilhões e pedras são realmente coisas diferentes. Agora não vamos mais coletar pedras por acidente!",
            effectDesc: "Mexilhões podem ser coletados como se fosse peixe.",
            cost: {
                science: 250,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {
            cost: {
                crystal: 100,
                sand: 2000,
                science: 500,
            },
        },
        transmutation: {
            cost: {
                science: 2500,
                crystal: 1750,
            },
        },
        spongeCollection: {
            name: "Coleta de Esponja",
            desc: "Nós vemos essas massas em meio aos recifes, mas apenas os polvos sabem como pegá-las sem as destruir.",
            researchedMessage:
                "Ao entender a natureza frágil das esponjas e sua estranha estrutura porosa, descobrimos que podemos coletá-las se mordermos bem de leve apenas.",
            effectDesc: "Esponja pode ser coletada como se fosse peixe.",
            cost: {
                science: 888,
            },
            required: {
                upgrades: ["octopusMethodology"],
            },
        },
        industrialGradeSponge: {
            name: "Esponja de Produção Industrial",
            desc: "Nossos contatos de oito patas informaram que a esponja pode ser muito útil com um pouco de aperfeiçoamento. Vamos ver no que dá.",
            researchedMessage:
                "Infundindo esponja com material processado, nós formamos a famosa 'espronja', um super-material super-versátil que está me dando ânsia só de olhar!",
            effectDesc: "Criação de espronja é possível, a coluna da... ãhh... o material central da tecnologia cefalopódico.",
            cost: {
                science: 2500,
                sponge: 800,
                junk: 4000,
            },
            required: {
                upgrades: ["recyclerDiscovery", "spongeCollection"],
                seen: ["sponge"],
            },
        },
        automation: { cost: { science: 1750 } },
        environmentalism: {
            name: "Ambientalismo",
            desc: "As máquinas estão produzindo o quê?! Rápido, precisamos de uma solução - esponjas filtram a água, certo?!",
            researchedMessage: "Puxando e esmagando as esponjas direitinho, podemos transformá-las em pequenas membranas que servem como filtros!",
            effectDesc: "Esponjas podem ser transformadas em filtros para impedir a graxa de matar a todos nós. Ufa!",
            cost: {
                science: 250,
                sponge: 15,
            },
            required: {
                upgrades: ["spongeCollection", "automation"],
            },
        },
        engineering: {
            effectDesc: "Máquinas de tubarônio são duas vezes mais eficientes.",
            effect: {
                incomeBoost: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            effectDesc:
                "Possibilita a reciclagem de materiais por meio de uma boca aterrorizante que consume e destrói tudo que chega perto. Futuro? Além disso desbloqueia construção de desnatadoras.",
            cost: {
                science: 6000,
                sharkonium: 2000,
            },
            required: {
                upgrades: ["automation"],
            },
        },
        iterativeDesign: {
            cost: {
                science: 100000,
                sharkonium: 17500,
            },
            effect: {
                incomeBoost: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    skimmer: 2,
                },
                incomeMultiplier: {
                    scientist: 4,
                },
            },
        },
        sprongeBiomimicry: {
            name: "Biomimetização Com Espronja",
            desc: "A escola de pensamento pôlvica dita que uma máquina que imita a vida é uma máquina melhor. Nós não entendemos por quê.",
            researchedMessage:
                "Considerando máquinas que imitam vida, essas máquinas soltam poluição pra dar com pau. O que é deveras inquietante. Alarmante, cepá. Preocupante, porventura. Quiçá, até estarrecedor.",
            effectDesc:
                "Nós conseguimos imitar parte da biotecnologia mimetizante que os polvos usam, mas enlamea o oceano rapidamente. Muito perigoso.",
            cost: {
                science: 6000,
                spronge: 200,
            },
            required: {
                upgrades: ["automation", "industrialGradeSponge"],
                resources: ["sponge", "junk"],
                seen: ["spronge"],
            },
        },
        agriculture: {
            researchedMessage:
                "Enquanto que a graxa torna tudo mais difícil, É tão mais fácil conseguir coisas quando elas estão todas em um lugar. Como se o oceano inteiro estivesse na nossa gruta!",
            effectDesc: "Caranguejos podem ser especializar na colheita de esponja.",
            cost: {
                science: 2000,
                sand: 500,
                sponge: 10,
            },
            required: {
                upgrades: ["seabedGeology", "spongeCollection"],
                seen: ["sponge"],
            },
        },
        biology: {
            cost: {
                science: 2250,
            },
        },
        rayBiology: {
            cost: {
                science: 2400,
                sand: 1600,
            },
            required: {
                upgrades: ["biology", "laserRays"],
            },
        },
        crabBiology: {
            desc: "Esse bichos são um mistério. Eles são meio calados e apenas cavam cristais ou pegam esponja. Por que eles fazem isso? E o QUE são siris??",
            effectDesc:
                "Caranguejos e coletores são 4 vezes mais rápido, e ninhadas de caranguejo podem ser formadas. Siris aparentemente são apenas um tipo de caranguejo, o que é legal, mas um pouco assustador, porque caranguejos são assustadores. Que bom que eles estão do nosso lado!",
            cost: {
                science: 2700,
                fish: 2500,
            },
            required: {
                upgrades: ["biology"],
                resources: ["crab"],
                seen: ["collector"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    collector: 4,
                },
            },
        },
        octopusMethodology: {
            name: "Metodologia Pôlvica",
            desc: "Os polvos dizem que conseguem melhorar a eficiência de suas rotinas e máquinas.",
            researchedMessage: "Não fazemos a menor ideia o que passa pela cabeça enorme desses nossos aliados, mas eles sabem como conseguir resultados.",
            effectDesc: "Polvos trabalham duas vezes mais rápido e podem se tornar investigadores.",
            cost: {
                science: 888,
                clam: 888,
            },
            required: {
                upgrades: ["clamScooping"],
                resources: ["octopus"],
                seen: ["octopus"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 2,
                },
            },
        },
        octalEfficiency: {
            name: "Eficiência Octal",
            desc: "Os polvos querem aumentar ainda mais a própria eficiência pelo cardume.",
            researchedMessage:
                "As instruções feitas e disseminadas pelos polvos são complexas e compreendidas apenas por outros polvos. Cabeça dói. Alguma coisa sobre o número oito.",
            effectDesc: "Polvos, investigadores e máquinas de espronja são 2 vezes mais eficientes. Ache união na eficiência.",
            cost: {
                science: 8888,
                clam: 88888,
            },
            required: {
                upgrades: ["sprongeBiomimicry"],
                seen: ["clamCollector", "sprongeSmelter", "eggBrooder"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 2,
                    investigator: 2,
                },
                incomeBoost: {
                    clamCollector: 2,
                    eggBrooder: 2,
                    sprongeSmelter: 2,
                },
            },
        },
        sunObservation: {
            desc: "É difícil de ver, mas tem um brilho estranho na superfície da água e precisamos saber o que é.",
            effectDesc:
                "Polvos investigadores, tubarões cientistas e siris coletores têm a velocidade dobrada. Será que um sol vale vários peixes? Nós vemos o Sol, mas onde que está? O que faz um Sol brilhar?",
            cost: {
                science: 22500,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                    investigator: 2,
                    collector: 2,
                },
            },
        },
        exploration: {
            desc: "Aventure-se em águas distantes para encontrar novas coisas!",
            researchedMessage: "Água, peixes, areia e cristais foram encontrados! E mais afastado, algo a mais emerge.",
            effectDesc: "Caranguejos são 4 vezes e coletores são duas vezes mais rápidos...E nós vimos alguma coisa lá longe.",
            cost: {
                science: 30000,
                fish: 30000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    collector: 2,
                },
            },
        },
        farExploration: {
            name: "Exploração Longínqua",
            desc: "No horizonte, tem muitas estruturas estranhas que os tubarões não arriscaram entrar...mas o que acontece se entrarmos?",
            researchedMessage:
                "Pelo visto, novas descobertas acontecem! Não há sinais de vida algum, mas achamos várias máquinas estranhas e um portal estranho.",
            effectDesc:
                "A cidade distante foi explorada e um portal com máquinas esquisitas foram achadas. Polvos agora podem se especializar em catar os restos da cidade.",
            cost: {
                science: 75000,
                fish: 75000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        superiorSearchAlgorithms: {
            name: "Algoritmos de Busca Superiores",
            desc: "Por que que achar coisas é tão difícil?!?!",
            researchedMessage:
                "Como foi explicado pelos nossos amigos polvos, era difícil porque nossas ordens eram deles andarem em círculos. A palavra que usaram foi 'infradotado'.",
            effectDesc:
                "Os polvos tomaram as rédeas das nossas duas operações de catação e pararam de ouvir as nossas instruções. Mesmo assim, catadores são 8 vezes mais rápidos e coletores são 4 vezes mais eficientes.",
            cost: {
                science: 88888,
                ancientPart: 88,
            },
            required: {
                upgrades: ["farExploration", "octalEfficiency"],
                seen: ["ancientPart"],
            },
            effect: {
                incomeMultiplier: {
                    scavenger: 8,
                    collector: 4,
                },
            },
        },
        reverseEngineering: {
            name: "Engenharia Reversa",
            desc: "O que são esses pedaços? Por que eles têm esse formato?!",
            researchedMessage: "Resultados inconclusivos. Precisamos de mais análises.",
            effectDesc: "Componentes antigos podem ser destruídos por ciência. Cientistas dobram e investigadores quadruplicam suas velocidades.",
            cost: {
                science: 150000,
                ancientPart: 350,
            },
            required: {
                upgrades: ["farExploration", "engineering"],
                seen: ["ancientPart"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                    investigator: 4,
                },
            },
        },
        highEnergyFusion: {
            name: "Fusão de Alta Energia",
            desc: "Essas parte velhas devem servir para algo! Só que, conseguimos decobrir???",
            researchedMessage: "O segredo ancião da fusão de alta energia foi redescoberto. Para que catar? Nós mesmos vamos os construir.",
            effectDesc:
                "Arraias laser conseguem fundir areia em cristal a um ritmo absurdo: 128 vezes mais rápido! Descobrimos também como fazer mais componentes antigos usando mexilhões e cristais.",
            cost: {
                science: 7500000,
                ancientPart: 1000,
            },
            required: {
                upgrades: ["reverseEngineering", "iterativeDesign", "laserRays"],
            },
            effect: {
                incomeBoost: {
                    laser: 128,
                },
            },
        },
        investigatetions: {
            name: "Investigação Portalária",
            desc: "Temporariamente ponha 500 investigadores para analisar o portal. Descubra seus segredos em tempo recorde!",
            researchedMessage: "Usando nossas técnicas de engenharia reversa, os investigadores fizeram uma teoria em como abrir o portal!",
            effectDesc: "Portal investigado. Acho que nós temos um meio de abri-lo, mas uma coisa que não vai ser é fácil...o mecanismo é complicado.",
            cost: {
                science: 4e7,
                investigator: 500,
            },
            required: {
                upgrades: ["reverseEngineering"],
            },
            events: ["abandonedRefundInvestigators"],
        },
        artifactAssembly: {
            name: "Montagem Artefática",
            desc: "Junte as peças. Abra o portal. Nós ordenamos.",
            researchedMessage: "Funcionou perfeitamente! Nosso controlezinho convenceu mesmo o portal a se ligar!",
            effectDesc: "Foi feito.",
            cost: {
                ancientPart: 400000,
            },
            required: {
                upgrades: ["investigatetions"],
            },
        },
        eightfoldOptimisation: {
            name: "Otimização Óctupla",
            desc: "Aumentar produtividade. Otimizar. Melhorar. Aprimorar.",
            researchedMessage: "Chegamos ao cume da produtividade. Mantenha isso. Mantenha eficiência.",
            effectDesc: "Polvos e suas especializações, junto de suas máquinas, estão todos oito vezes mais eficientes. Aperfeiçoados.",
            cost: {
                science: 8e7,
            },
            required: {
                upgrades: ["investigatetions", "octalEfficiency"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 8,
                    investigator: 8,
                    scavenger: 8,
                },
                incomeBoost: {
                    clamCollector: 8,
                    eggBrooder: 8,
                    sprongeSmelter: 8,
                },
            },
        },
        mechanisedAlchemy: {
            name: "Alquimia Mechanizada",
            desc: "Engenharia e transmutação melhores levam à sofisticação de nossas máquinas.",
            researchedMessage: "Estamos cada vez mais apagando a separação entre ciência e magia!",
            effectDesc:
                "Máquinas tubarônicas são quatro vezes mais eficientes, filtros são 8 vezes mais rápidos. Nosso trabalho é melhor junto das máquinas, não contra elas.",
            cost: {
                science: 1e8,
            },
            required: {
                upgrades: ["investigatetions", "iterativeDesign"],
            },
            effect: {
                incomeMultiplier: {
                    filter: 8,
                },
                incomeBoost: {
                    fishMachine: 4,
                    crystalMiner: 4,
                    sandDigger: 4,
                    skimmer: 4,
                },
            },
        },
    },
    haven: {
        crystalBite: {},
        crystalSpade: {},
        cetaceanAwareness: {
            name: "Percepção Cetácea",
            desc: "De longe, é difícil identificar quem são tubarões e quem são... outras coisas. Precisamos entender isso.",
            researchedMessage:
                "Certo, então, golfinhos têm um rabo na horizontal e tubarões tem um rabo na vertical. Também, APARENTEMENTE, eles tem sangue quente e 'cérebros maiores'. Panacas.",
            effectDesc: "Golfinhos podem ser recrutadoes (mesmo que ninguém queira fazer isso).",
            cost: {
                science: 125,
                coral: 100,
            },
            required: {
                totals: {
                    coral: 75,
                },
            },
        },
        crystalContainer: {},
        statsDiscovery: {},
        underwaterChemistry: {},
        seabedGeology: {
            cost: {
                science: 350,
                sand: 7500,
            },
        },
        agriculture: {
            effectDesc: "Efetividade dos golfinhos vezes 2. Descobrimos métodos agriculturais. Vamos ver se isso dá certo.",
            cost: {
                science: 500,
                sand: 10000,
                coral: 100,
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                },
            },
        },
        coralCollection: {
            name: "Coleção de Coral",
            desc: "Os golfinhos ficam falando de corais e cristais e belas artes. Sem para. E??? Quem se importa??",
            researchedMessage: "Pelo visto é um 'coisa cultural'. Então tá, pega aí seu coral. Eu nem quero saber.",
            effectDesc: "Golfinhos podem se especializar em tesouraria.",
            cost: {
                science: 400,
                coral: 250,
            },
            required: {
                upgrades: ["agriculture"],
                seen: ["dolphin"],
            },
        },
        kelpHorticulture: {
            cost: {
                science: 3500,
                sand: 25000,
            },
        },
        xenobiology: {
            effectDesc:
                "Nós sabemos como coletas holotúrias duas vezes mais rápido, além de como dissecá-las por ciência. Também, nós descobrimos que holotúrias não são frutas. Eca.",
            cost: {
                seaApple: 20,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
        },
        dolphinBiology: {
            name: "Biologia Golfinhosa",
            desc: "Precisamos mesmo aprender isso? Sério mesmo? Então tá.",
            researchedMessage:
                "Nós ofendemos tanto os golfinhos com nossas perguntas que eles formaram um próprio time próprio de pesquisa biológica.",
            effectDesc:
                "Golfinhos são quatro vezes mais eficientes, mas 4 vezes nada ainda é nada. Tesoureiros produzem o dobro também. Além disso, conseguimos agora produzir mais golfinhos. <em>êêêê.</em>",
            cost: {
                science: 3000,
                coral: 1000,
            },
            required: {
                upgrades: ["biology", "coralCollection"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 4,
                    treasurer: 2,
                },
            },
        },
        biology: {
            cost: {
                science: 2000,
            },
        },
        rayBiology: {
            effectDesc:
                "Arraias são quatro vezes mais rápidas e criadores de arraias estão disponíveis. Mas talvez as relações tubarão-arraia nunca voltem ao seu estado original depois de quão vergonhoso isso foi para todos os envolvidos.",
            cost: {
                science: 2250,
                sand: 5000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 4,
                },
            },
        },
        delphineHistory: {
            name: "História Delfínica",
            desc: "Esses pedaços finos de alga ficam aparecendo nas correntes. O que são? Por que são crocantes?!",
            researchedMessage: "Um golfinho nos ouviu discutindo sobre, e ele veio e 'leu' coisas da alga. Como assim?!",
            effectDesc:
                "Todos os golfinhos têm sua produção dobrada. Descobrimos os restos de uma civilização de golfinhos por meio de papíro...de alga. Tár??",
            cost: {
                science: 25000,
            },
            required: {
                upgrades: ["sunObservation"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                    biologist: 2,
                    treasurer: 2,
                },
            },
        },
        sunObservation: {
            effectDesc:
                "Plantadores colhem 4 vezes mais alga. Será que um sol vale vários peixes? Nós vemos o Sol, mas onde que está? O que faz um Sol brilhar?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["kelp"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 4,
                },
            },
        },
        crabBiology: {
            name: "Biologia Caranguêsa",
            desc: "Os caranguejos são um mistério. Eles são calados e apenas cavam cristais ou plantam coisas. Por que eles fazem isso? E o QUE são siris??",
            cost: {
                science: 10000,
                kelp: 1000,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                resources: ["crab"],
            },
        },
        exploration: {
            cost: {
                science: 32500,
                fish: 50000,
            },
        },
        whaleCommunication: {
            name: "Comunicação Baleiística",
            desc: "Nós conseguimos ouvir choros distantes. O que está fazendo isso?",
            researchedMessage:
                "Certo, 'baleias' estão fazendo isso. Elas parecem golfinhos, só que menos rudes, e muito grandes. Ah, é mesmo, eles também pegam peixes à farta.",
            effectDesc: "Baleias podem ser recrutadas.",
            cost: {
                fish: 2000000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        aquamarineFusion: {
            name: "Fusão Aquamarinha",
            desc: "Aqueles papíros de alga têm receita de como fazer um treco feio chamado delfínio, então nós nos sentimos obrigados a fazê-lo. É sério que nós queremos fazer isso?",
            researchedMessage:
                "Usando o 'conhecimento' obtidas das placas de alga esquisitas, descobrimos como fazer delfínio e agora estamos questionando todas nossas decisões até agora.",
            effectDesc: "Possibilita a transmutação de recursos potencialmente úteis em lixo.",
            cost: {
                science: 125000,
                coral: 200000,
                crystal: 150000,
            },
            required: {
                upgrades: ["delphineHistory"],
            },
        },
        dolphinTechnology: {
            name: "Tecnologia Cetácea",
            desc: "Independente do material, as máquinas podem ser boas. Provavelmente não, mas nós temos que testar mesmo assim.",
            researchedMessage:
                "A tecnologia dos golfinhos é bem enfeitada. Nós gastamos mais tempo vendo quais partes eram apenas estéticas do que realmente construíndo as máquinas em si!",
            effectDesc: "Desvendamos como funciona uma boa parte da maquinaria dos golfinhos. Para a surpresa de ninguém, não é muito bom - mas é o que tem pra hoje.",
            cost: {
                science: 50000,
                delphinium: 15000,
            },
            required: {
                upgrades: ["aquamarineFusion"],
                seen: ["delphinium"],
            },
        },
        /* Equivalent of farExploration.. named differently for unlocks or smth I think? */
        farExploration: {
            name: "Exploração Longínqua",
            desc: "Explore águas distantes em busca do portal descrito nos textos dos golfinhos.",
            researchedMessage: "Depósitos ricos em cristal foram achados, junto do que parece ser o portal das lendas defínicas.",
            effectDesc: "Caranguejos quadruplicam e plantadores octuplicam suas produções. Você sabia que os oceanos são maiores do que apenas grande? Fantástico!",
            cost: {
                science: 375000,
                fish: 10000000,
            },
            required: {
                upgrades: ["whaleCommunication", "delphineHistory"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 4,
                },
            },
        },
        whaleSong: {
            name: "O Canto das Baleias",
            desc: "As baleias dizem que sabem partes de alguma música etérea anciã que junta mundos. Podemos pegar tudo que elas sabem e juntar.",
            researchedMessage: "Bem, o que nós juntamos é certamente uma das música já existentes...Mas tem que ter algo faltando. Isso não pode ser tudo.",
            effectDesc:
                "Baleias são 4 vezes mais eficientes. As baleias trabalharam conosco para juntar as partes de uma música antiga. Porém não achamos que esteja completo.",
            cost: {
                fish: 500000000,
            },
            required: {
                upgrades: ["whaleCommunication"],
                seen: ["whale"],
            },
            effect: {
                incomeMultiplier: {
                    whale: 4,
                },
            },
        },
        retroactiveRecordkeeping: {
            name: "Registração Retroativa",
            desc: "Nós temos quase uma montanha dessas coisas...papirescas. Acho que deveríamos tentar organizá-las.",
            researchedMessage: "Os golfinhos foram os primeiros a se voluntariar para organizar esses troços. Hm, eu ACHO que vamos dar para eles uma chance.",
            effectDesc:
                "Efetividade de cientistas vezes 16 Podemos agora formar golfinhos como historiadores que vão ajudar a catalogar toda a informação dos nossos negócios de alga.",
            cost: {
                science: 2000000,
            },
            required: {
                totals: {
                    science: 800000,
                },
                upgrades: ["dolphinTechnology"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 16,
                },
            },
        },
        imperialDesigns: {
            name: "Desenhos Imperiais",
            desc: "Finalmente, achamos! Depois de reviear nossa coleção de papiro, encontramos os desenhos originais das máquinas de delfínio.",
            researchedMessage:
                "Olhando melhor, eles são terríveis! Esses planos nunca funcionariam! É por isso que não usamos.  Olha só, deixa eu mostrar-- a. Eles, aparentemente eles...funcionam? Hmm.",
            effectDesc:
                "Cultiveiras e fuscões vermelhos funcionam 4 vezes mais rápido e artesões produzem 4 vezes mais. É com coração pesado que nós temos que admitir que as máquinas não são completamente inúteis.",
            cost: {
                science: 7500000,
                delphinium: 250000,
            },
            required: {
                upgrades: ["dolphinTechnology"],
                seen: ["crimsonCombine", "kelpCultivator", "tirelessCrafter"],
            },
            effect: {
                incomeMultiplier: {
                    crimsonCombine: 4,
                    kelpCultivator: 4,
                },
                incomeBoost: {
                    tirelessCrafter: 4,
                },
            },
        },
        ancientAgriculture: {
            name: "Agricultura Anciã",
            desc: "Agora que juntamos tudo, percebemos que muitas dessas páginas de métodos de plantio são parte de um só livro!",
            researchedMessage:
                "Nós ficamos tanto tempo discutindo com os golfinhos sobre detalhes minúsculos de como proceder que um grupinho de golfinhos e tubarões amadores se juntou e terminou o trabalho antes mesmo de termos algum plano. Ops.",
            effectDesc:
                "Plantadores vezes 16, cultiveiras vezes 2, toda produção de coral vezes 4. Ninguém tocou no assunto daquele argumento idiota que tivemos desde o fim dele...achávamos que os golfinhos iriam estar esfregando na nossa cara, mas eles parecem nem se importar.",
            cost: {
                science: 50000000,
                delphinium: 1000000,
            },
            required: {
                upgrades: ["retroactiveRecordkeeping"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 16,
                    kelpCultivator: 2,
                },
                resourceBoost: {
                    coral: 4,
                },
            },
        },
        crystallineConstruction: {
            name: "Construção Cristalina",
            desc: "Os golfinhos são um bando de patifes, mas talvez nós possamos ensinar algo uns para os outros. Talvez.",
            researchedMessage:
                "Ao juntar a nossa ciência com os desenhos maquinários dos golfinhos, conseguimos criar aparelhos ainda melhores. Talvez nós trabalhemos melhor juntos do que separados...",
            effectDesc:
                "Todas as máquinas de delfínio produzem 8 vezes mais. Piranhas me mordam! Além disso, ciência tubarônica é muito mais edificante agora que nós temos outras perpectivas, então cientistas são 16 vezes mais eficientes.",
            cost: {
                science: 500000000,
                delphinium: 1500000,
            },
            required: {
                upgrades: ["retroactiveRecordkeeping", "ancientAgriculture"],
            },
            effect: {
                incomeMultiplier: {
                    kelpCultivator: 8,
                    crimsonCombine: 8,
                    scientist: 16,
                },
                incomeBoost: {
                    tirelessCrafter: 8,
                },
            },
        },
        eternalSong: {
            name: "O Coro Eterno",
            desc: "O canto das baleias é mencionado nas algas até as mais antigas que nós temos. Acho que nós conseguimos achar algo.",
            researchedMessage:
                "O canto das baleias era apenas metade da composição. O canto dos golfinhos era o que estava faltando. Agora temos tudo o necessário.",
            effectDesc:
                "Baleias, golfinhos e tesoureiros são multiplicados por 16, biólogos por 4. Podemos formar um coro de baleias e golfinhos para cantar a canção eterna, mas não sabemos o que ela fará.",
            cost: {
                science: 2000000000,
            },
            required: {
                upgrades: ["whaleSong", "retroactiveRecordkeeping", "farExploration"],
            },
            effect: {
                incomeMultiplier: {
                    whale: 16,
                    dolphin: 16,
                    treasurer: 16,
                    biologist: 4,
                },
            },
        },
    },
    frigid: {
        crystalBite: {
            cost: {
                science: 40,
                fish: 100,
            },
            required: {
                upgrades: ["civilContact"],
            },
        },
        urchinAttraction: {
            name: "Atração de Ouriços",
            desc: "Podemos ver pequenas bolinhas espetudas andando pelo chão. O que são elas? Por que tem tantos em todo lugar?!",
            researchedMessage: "Fizemos duas descobertas maravilhosas: elas são sencientes (bem pouco), e elas doem de se encostar.",
            effectDesc:
                "Nós conseguimos chamar a atenção de um desses ouriços e ele está nos trazendo coisas. Acho que ele gostou ne nós?? Provavelmente???",
            cost: {
                science: 50,
            },
            required: {
                upgrades: ["civilContact"],
            },
            events: ["frigidAddUrchin"],
        },
        crystalContainer: {
            cost: {
                science: 75,
                crystal: 25,
            },
            required: {
                upgrades: ["civilContact"],
            },
        },
        statsDiscovery: {
            cost: {
                science: 50,
            },
        },
        underwaterChemistry: {
            cost: {
                science: 125,
                crystal: 25,
            },
        },
        seabedGeology: {
            researchedMessage: "Not only did we find a whole bunch of weird things, we found that there was more sand!",
            effectDesc:
                "Ouriços pegam areia duas vezes mais rápido. Não porque eles entendem como pegá-la melhor, mas porque nós mostramos a eles outras técnicas para imitar.",
            cost: {
                science: 200,
                sand: 100,
            },
            required: {
                upgrades: ["urchinAttraction", "crystalContainer"],
            },
            effect: {
                sandMultiplier: {
                    urchin: 2,
                },
            },
        },
        civilContact: {
            name: "Contato Civilizacional",
            desc: "Nós vemos algumas estruturas estranhas através de uma falha no gelo. Mas o que exatamente é aquilo?",
            researchedMessage: "Nós visitamos as estruturas e acabamos descobrindo uma civilização inteira vivendo lá!",
            effectDesc: "Achamos as lulas. Elas podem ser alistadas para ajudar a pegar peixe. Também nos mudamos para um lugar menos congelado.",
            cost: {
                science: 40,
            },
        },
        teamSpirit: {
            name: "Espírito de Equipe",
            desc: "As lulas estão resolutas em nos mostrar a mágica do 'trabalho em equipe'.",
            researchedMessage:
                "Uma lula ficou falando algo sobre eficiência e cooperação e blá blá blá não sei o que lá. É uma conversa de metido, mas não posso discordar que ele tenha um ponto.",
            effectDesc: "Tubarões, caranguejos, ouriços, times de extração, cientistas e lulas todos produzem o dobro de antes. Tudo nosso, time?",
            cost: {
                science: 3000,
            },
            required: {
                upgrades: ["crabBiology", "squidBiology"],
                seen: ["extractionTeam"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    crab: 2,
                    squid: 2,
                    urchin: 2,
                    scientist: 2,
                    extractionTeam: 2,
                },
            },
        },
        agriculture: {
            name: "Agricultura",
            desc: "A vida de caçador-coletor parece ser nossa única possibilidade, mas talvez possamos achar algum jeito mais sustentável?",
            researchedMessage:
                "Meio que funcionou. Tivemos que plantar a alga espalhada por todo lugar, senão os ouriços pegam e comem tudo se estiver em um só lugar.",
            effectDesc: "Ouriços coletam alga duas vezes mais rápido. Toda a alga. E apenas alga.",
            cost: {
                science: 350,
                sand: 400,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
            effect: {
                kelpMultiplier: {
                    urchin: 2,
                },
            },
        },
        assistedExtraction: {
            name: "Extração Assistida",
            desc: "Caranguejos demoram demais para pegar cristais. E as lulas insistem que podem ajudar se trabalharem juntos. Acho que vale a tentativa.",
            researchedMessage:
                "Um caranguejo consegue se enfiar em lugares que lulas não conseguem e uma lula consegue levar um caranguejo de um lado pro outro rapidamente. As lulas estavam certíssimas, isso é do balacobaco!",
            effectDesc: "Nós podemos agora organizar um siri com uma lula para acelerar a coleta de cristais.",
            cost: {
                science: 650,
                kelp: 250,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        biology: {
            cost: {
                science: 1000,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        squidBiology: {
            name: "Biologia Lulenta",
            desc: "Descubra os segredos da reprodução das lulas.",
            researchedMessage: "Quando várias lulas papai e várias lulas mamãe se amam muito mesmo...",
            effectDesc: "Lulas têm o dobro da eficiência. Lulas agora podem formar coletivos para criar mais lulinhas.",
            cost: {
                science: 1500,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    squid: 2,
                },
            },
        },
        crabBiology: {
            cost: {
                science: 2000,
                kelp: 2500,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 2,
                },
            },
        },
        urchinBiology: {
            name: "Biologia Ouriçária",
            desc: "Gente, alguém aqui sabe de onde veio tanto bicho assim?",
            researchedMessage: "Vieram de forma indireta, é o que descobrimos. Eca.",
            effectDesc: "Ouriços são duas vezes mais eficientes. Podemos alistar ouriços para fazer mais ouriços.",
            cost: {
                science: 1750,
                kelp: 750,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    urchin: 2,
                },
            },
        },
        sunObservation: {
            name: "Observação Solar",
            desc: "Precisamos entender que brilho maluco é aquele na superfície da água.",
            researchedMessage: "Cientistas acabaram de descobrir o Sol! Eles também descobriram que olhar para sol dói.",
            effectDesc:
                "Ouriços colhem alga duas vezes mais rápido. Será que um sol vale vários peixes? Nós vemos o Sol, mas onde que está? O que faz um Sol brilhar?",
            cost: {
                science: 1750,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                kelpMultiplier: {
                    urchin: 2,
                },
            },
        },
        exploration: {
            name: "Exploração",
            desc: "Aventure-se em águas distantes para encontrar novas coisas!",
            researchedMessage: "Achamos um monte de peixe, mas também uma parede enorme de gelo a nossa volta. É como se estivéssemos numa bolha congelada!",
            effectDesc: "Tubarões e lulas dobram sua efetividade. Você sabia que oceanos eram tão grandes assim? Incrível!",
            cost: {
                science: 6500,
                fish: 25000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    squid: 2,
                },
            },
        },
        glacialNavigation: {
            name: "Navegação Frígida",
            desc: "Explore os gelos flutuantes além do quentinho. Talvez apredamos algo de bom.",
            researchedMessage:
                "Explorar montanhas de gelo flutuant nos rendeu...mais gelo. É um mundo frio e calculista lá fora, mas tem um monte de cristal na borda.",
            effectDesc: "Times de extração são quatro vezes mais eficientes graças às reservas naturais de cristal que achamos.",
            cost: {
                science: 8000,
                fish: 90000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    extractionTeam: 4,
                },
            },
        },
        transmutation: {
            name: "Transmutação",
            desc: "Ao esquentar coisas e fazer ciência, novas coisas podem ser feitas!",
            researchedMessage: "Um novo tipo de material foi descoberto! Foi batizado em homenagem de seu criador, Dr. Tubarão.",
            effectDesc: "Permite a transmutação de umas coisas que nós temos jogadas por aí em tubarônio, o material do futuro.",
            cost: {
                science: 3500,
                crystal: 1000,
                sand: 10000,
            },
            required: {
                upgrades: ["underwaterChemistry", "seabedGeology"],
            },
        },
        automation: {
            name: "Automação",
            desc: "Usando tubarônio, podemos fazer coisas que fazem coisas para que nós não precisemos fazer as coisas!",
            researchedMessage: "Agora não precisamos fazer todo o trabalho, já que as máquinas o fazem por nós! FUTUUURO!!",
            effectDesc: "Máquinas podem ser construídas para ajudar na produção do cardume de forma mais eficiente.",
            cost: {
                science: 10000,
                sharkonium: 4000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        internalInvestigation: {
            name: "Investigação Interna",
            desc: "Tem algo estranho com essa máquina. Por que está aqui? O que faz? Para que serve aquele portal no lado?",
            researchedMessage:
                "Quando fomos mexer na máquina, achamos uma portinhola secreta. E ela leva para um labirinto enorme debaixo da vila!",
            effectDesc: "Sem querer, nós descobrimos o complexo abaixo da terra. As lulas não sabem ainda o que nós achamos.",
            cost: {
                science: 35000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
        },
        artificialHeating: {
            name: "Aquecimento Sintético",
            desc: "Sério, na boa, estou cansado do meu nariz e minhas barbatanas geladas o tempo inteiro! Como que se esquenta coisas?",
            researchedMessage: "Com máquinas, é claro! E uma cacetada de alga como fonte de energia. Não pergunte.",
            effectDesc: "Desenvolvemos máquinas que produzem calor sozinhas para barrar o gelo.",
            cost: {
                science: 20000,
                kelp: 250000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
        },
        engineering: {
            name: "Engenharia",
            desc: "Nossas máquinas são meio ruins. Vamos aprender a montá-las melhor!",
            researchedMessage: "Dobramos a produção das máquinas, e ainda aprendemos a fazer outras máquinas! Dois em um!",
            effectDesc: "Produção de máquinas multiplicado por dois. Transmutadoras automáticas são agora construíveis.",
            cost: {
                science: 55000,
                sharkonium: 10000,
            },
            required: {
                upgrades: ["automation"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
                heaterMultiplier: {
                    heater: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recicladora",
            desc: "Invente um sistema de destruir recursos em uma gosma para ser reutilizada em outra coisa.",
            researchedMessage:
                "Bem, isso daqui parece que veio de um pesadelo. Eu não atreveria a nadar perto de qualquer buraco dessa máquina. Mas ela certamente pode ser útil para nós!",
            effectDesc: "Possibilita a reciclagem de materiais por meio de uma boca aterrorizante que consume e destrói tudo que chega perto. Futuro?",
            cost: {
                science: 180000,
                sharkonium: 40000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Design Iterado",
            desc: "As máquinas são boas, mas poderiam ser melhores. Vamos refazer nossas máquinas do zero!",
            researchedMessage: "E nós aprendemos que ciência é sobre aprender de erros, é o que diz os cientistas. Sobre seus próprios erros.",
            effectDesc: "Todas as máquinas tubarônicas duplicam sua velocidade. Sim, de novo! Além disso, cientistas quadruplicam sua eficiência.",
            cost: {
                science: 350000,
                sharkonium: 75000,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    scientist: 4,
                },
                heaterMultiplier: {
                    heater: 2,
                },
            },
        },
        superprocessing: {
            name: "Superprocessamento",
            desc: "A recicladora não foi feita com o dissolução de milhões de peixes em mente. Considerando que isso é uma demanda bem comum, nós provavelmente deveríamos fazer algo sobre isso.",
            researchedMessage: "Eureca! Se fizermos as coisas grandes ficarem maiores, e os moedores mais moídos, nós poderemos processar muito mais material de uma só vez!",
            effectDesc:
                "A eficiência da recicladora só começa a cair na casa dos 10 milhões de itens de uma só vez, ao invés de 100 mil. A eficiência máxima também aumentou para 100%.",
            cost: {
                science: 4e6,
                sharkonium: 250000,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        creatureCoalition: {
            name: "Coalizão de Criaturas",
            desc: "Todos sentem; o frio nos faz cada vez mais fracos. As lulas não passam frio pois estão cobertas de razão, temos que ajudar uns aos outros.",
            researchedMessage:
                "Fizemos uma reuniãozinha de equipe para planejar o que vamos fazer. As lulas tinham um discurso motivacional preparado (ou eles só são muito bons improvisar um), isso parece que levantou o astral do cardume.",
            effectDesc: "Tubarões e caranguejos ×8. Ouriços, lulas, times de extração e cientistas ×4. Tudo nosso, nada deles!",
            cost: {
                science: 1250000,
            },
            required: {
                upgrades: ["internalInquiry"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 8,
                    crab: 8,
                    urchin: 4,
                    squid: 4,
                    scientist: 4,
                    extractionTeam: 4,
                },
            },
        },
        internalExpedition: {
            name: "Apuração Interna",
            desc: "Temos os recursos para examinar secretamente a máquina. Seus mistérios devem ser desvendados.",
            researchedMessage: "A apuração foi um sucesso, mas enquanto saíamos da máquina, uma lula nos viu com a boca na butija. Acho que não tem como esconder isso mais.",
            effectDesc:
                "Cientistas são duas vezes mais eficientes. Descobrimos apenas intermináveis corredores com textos incompreesíveis e salas cheias de painéis de controle inexplicados.",
            cost: {
                science: 100000,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
            required: {
                upgrades: ["internalInvestigation"],
            },
        },
        internalInquiry: {
            name: "Consulta Interna",
            desc: "Nós e as lulas não falamos ainda sobre o ocorrido. Talvez nós devêssemos conversar.",
            researchedMessage:
                "Eles não estão zangados, exatamente, apenas desapontados. Se nós queríamos explorar o lugar, nós poderíamos apenas ter pedido. Eles sabem como operar a máquina, mas não como ela funciona.",
            effectDesc:
                "Lulas e coletivos x2, times de extração x4. Fizemos as pazes com as lulas. Elas nos contaram um pouco sobre como manejar a máquina.",
            cost: {
                science: 250000,
            },
            effect: {
                incomeMultiplier: {
                    squid: 2,
                    extractionTeam: 4,
                    collective: 2,
                },
            },
            required: {
                upgrades: ["internalExpedition", "engineering"],
            },
        },
        rapidRecharging: {
            name: "Rapid Recharging",
            desc: "As lulas nos deram a bateria vazia. Nós podemos estudá-la para criar uma nova.",
            researchedMessage:
                "Uma onda de calor se espalha pela cidade no momento que a bateria nova é inserida. O gelo à sua volta rapidamente some e, como um passe de mágica, a geleira que o continha começa a retroceder.",
            effectDesc: "A bateria foi trocada. Todo o gelo nos afligindo derrete rapidamente e podemos agora usar o portal.",
            cost: {
                science: 3250000,
                sharkonium: 250000,
            },
            required: {
                upgrades: ["internalInquiry", "iterativeDesign"],
            },
        },
    },
    shrouded: {
        crystalBite: {},
        crystalSpade: {},
        crystalContainer: {},
        statsDiscovery: {},
        underwaterChemistry: {
            cost: {
                science: 250,
                crystal: 50,
            },
        },
        seabedGeology: {
            name: "Geologia Oceânica",
            desc: "Ache o solo oceânico de uma vez por todas. Chega de entrar em buracos sem fundo.",
            researchedMessage:
                "Não só finalmente descobrimos onde o solo fica, também achamos bichinhos molengas! Eles se desculparam por se esconder de nós. Deram um motivo haver com comida e tubarão.",
            effectDesc: "Arraias coletam duas vezes mais areia uma vez que descobrimos...onde a areia está, além disso, enguias podem ser recrutadas ao cardume.",
            cost: {
                science: 400,
                sand: 750,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        thermalVents: {
            cost: {
                science: 600,
                sand: 1000,
            },
        },
        agriculture: {
            name: "Agricultura",
            desc: "Não sabemos por quanto tempo uma sociedade caçadora-coletora irá nos servir. Talvez devêssemos juntar nossos animais e deixá-los crescer.",
            researchedMessage: "É tão mais fácil conseguir coisas quando elas estão todas em um lugar. Como se o oceano inteiro estivesse na nossa gruta!",
            effectDesc: "Avanços na agricultura irão incentivar futuras empreitadas. Quem sabe qual vai ser o nosso próximo passo!",
            cost: {
                science: 700,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        jellyfishHunting: {
            name: "Caçar Águas-Vivas",
            desc: "Temos águas-vivas aos montes nesse breu, mas, toda vez que tentamos pegá-las, nós terminamos todos doídos. Precisamos de alguma estratégia.",
            researchedMessage: "O truque de caçar água-viva é ter cuidado e não tocar nos tentáculos venenosos, porque eles queimam. Ô, se queimam.",
            effectDesc: "Águas-vivas podem ser caçadas como se fossem peixes. Se nada, então é peixe.",
            cost: {
                science: 750,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        jellyDiving: {
            name: "Mergulho d'Água (Viva)",
            desc: "Problema: Você está cansado de caçar água-viva sozinho. Solução: Faça outros caçarem por você.",
            researchedMessage: "Eba, os mergulhadores agora caçam águas-vivas! Eles est- Uia. Vixe. Aquilo deve ter doído.",
            effectDesc: "Tubarões mergulhadores agora ganharam a responsabilidade de caçar águas-vivas. Esperamos que valha a pena.",
            cost: {
                science: 1000,
                jellyfish: 20,
            },
            required: {
                upgrades: ["jellyfishHunting"],
                seen: ["jellyfish"],
            },
            effect: {
                addJellyIncome: {
                    diver: 0.05,
                },
            },
        },
        biology: {
            name: "Biologia",
            desc: "O que é um tubarão? O que tem dentro de um tubarão, além de muitos peixes?",
            researchedMessage: "Com uma nova compreensão da própria biologia, tubarões agora podem se especializar em montar novos tubarões.",
            effectDesc:
                "Tubarões produzem duas vezes mais e tubarões enfermeiros podem ser treinados. Você sabia que ovos de tubarão não aparecem apenas porque um tubarão pediu muito a Papai do Céu?",
            cost: {
                science: 1750,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        rayBiology: {
            name: "Biologia Arraiística",
            desc: "Mesmo sendo primos de nós, tubarões, não sabemos quase nada das arraias. Nós podemos consertar isso. Só precisamos de uma armadilha.",
            researchedMessage:
                "Aparentemente, poderíamos ter apenas perguntado. Mas conseguimos descobrir como arraias fazem mais arrainhas. É bem parecido como tubarões funcionam, mas com arraias.",
            effectDesc:
                "Arraias são duas vezes mais rápidas e criadores de arraias estão disponíveis. Mas talvez as relações tubarão-arraia nunca voltem ao seu estado original depois de quão vergonhoso isso foi para todos os envolvidos.",
            cost: {
                science: 2000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        eelHabitats: {
            name: "Habitats Enguiáticos",
            desc: "Nós vemos as enguias se enfiando em buracos e surgindo do chão. Não entendemos direito como isso funciona.",
            researchedMessage:
                "Depois de uma conversa - que mais parecia uma aula - com as enguias sobre a existência de poços de enguias e a segurança máxima na forma de buraquinhos na areia, nós...ainda não entendemos direito.",
            effectDesc: "Enguias dobram sua eficiência agora que aprendemos sobre suas moradia favorita. Ademais, elas podem de multiplicar em poços, ou algo assim.",
            cost: {
                science: 2250,
            },
            required: {
                upgrades: ["biology"],
                resources: ["eel"],
                seen: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 2,
                },
            },
        },
        xenobiology: {
            name: "Xenobiologia",
            desc: "Tente explicar oque que são esses bichos sem-rosto nós achamos em todo lugar.",
            researchedMessage: "Resultados inconclusivos! Mais pesquisa é necessária. Pode ser um grande benefício para a ciência!",
            effectDesc: "Nós podemos dissecar águas-vivas pela ciência. Também, nós descobrimos onde fica o rosto das águas-vivas, mas decidimos manter isso como segredo.",
            cost: {
                science: 3250,
                jellyfish: 500,
            },
            required: {
                upgrades: ["jellyfishHunting", "biology"],
                seen: ["jellyfish"],
            },
            effect: {
                resourceBoost: {
                    jellyfish: 2,
                },
            },
        },
        creviceContemplation: {
            name: "Contemplação de Cavidade",
            desc: "O que está escondido nesses buracos de enguia? Por que elas o cavam? COMO que um poço de enguias funciona?",
            researchedMessage:
                "Todas as nossas perguntas, e muito mais, foi esclarecido pelas tão ansiosas enguias. E nós não precisávamos saber de tanta coisa assim, mas obrigado, eu acho??",
            effectDesc:
                "Enguias e seus poços dobram de eficiência. Nós aprendemos coisas que teria sido melhor não saber, mas eu acho que eles estavam apenas tentando ajudar. Eu acho.",
            cost: {
                science: 7500,
            },
            required: {
                upgrades: ["eelHabitats"],
                seen: ["pit"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 2,
                    pit: 2,
                },
            },
        },
        transmutation: {
            name: "Transmutação",
            desc: "Ao esquentar coisas e fazer ciência, novas coisas podem ser feitas!",
            researchedMessage: "Um novo tipo de material foi descoberto! Foi batizado em homenagem de seu criador, Dr. Tubarão.",
            effectDesc: "Permite a transmutação de umas coisas que nós temos jogadas por aí em tubarônio, o material do futuro.",
            cost: {
                science: 10000,
                crystal: 1000,
                sand: 25000,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        automation: {
            name: "Automação",
            desc: "Usando tubarônio, podemos fazer coisas que fazem coisas para que nós não precisemos fazer as coisas!",
            researchedMessage: "Agora não precisamos fazer todo o trabalho, já que as máquinas o fazem por nós! FUTUUURO!!",
            effectDesc: "Máquinas podem ser construídas para ajudar na produção do cardume de forma mais eficiente.",
            cost: {
                sharkonium: 1000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        exploration: {
            name: "Exploração",
            desc: "Nade além desse mar conhecido para vez o que mais achamos!",
            researchedMessage: "Achamos um monte de peixes! E tanta areia! E ainda mais, abismos gigantes no fundo do oceano!",
            effectDesc: "Tubarões, arraias e mergulhadores pegam o dobro de recursos. Você sabia que oceanos eram tão grandes assim? Incrível!",
            cost: {
                science: 22500,
                fish: 15000,
            },
            required: {
                upgrades: ["xenobiology"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    ray: 2,
                    diver: 2,
                },
            },
        },
        engineering: {
            name: "Engenharia",
            desc: "Nossas máquinas são meio ruins. Vamos aprender a montá-las melhor!",
            researchedMessage: "Dobramos a produção das máquinas! Mas não descobrimos como fazer nenhuma outra máquina.",
            effectDesc: "Produção das máquinas multiplicado por dois.",
            cost: {
                science: 30000,
                sharkonium: 10000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        chimaeraReunification: {
            name: "Reunificação Quimérica",
            desc: "Mas o que são essas coisas? Por que parecem com nós? São tubarões? Eles devem ser tubarões sim. Deveríamos nos apresentar.",
            researchedMessage: "É...Eles são mais ou menos tubarões. Tipo, eles são próximos os suficiente! A maioria diz que está feliz em nos ver.",
            effectDesc: "Quimeras podem ser recrutadas. Nós tubarões devemos juntar forças!",
            cost: {
                science: 45000,
                jellyfish: 2500,
            },
            required: {
                upgrades: ["exploration"],
                seen: ["jellyfish"],
            },
        },
        shroudedChasmExploration: {
            name: "Chasm Exploration",
            desc: "As quimeras se ofereceram para ajudar a navegar os abismos. Com isso, nós podemos mandar um time de exploração para ver o que tem lá embaixo.",
            researchedMessage:
                "O grupo que mandamos voltou, e...bem, eles não sabem o que acharam! É sério! Nem mesmo as quimeras sabem o que essas pedras são.",
            effectDesc: "Quimeras caçam o dobro de água-viva. Nós achamos umas peças estranhas que brilham, mas não temos a menor ideia do que são.",
            cost: {
                science: 125000,
                fish: 1500000,
            },
            required: {
                upgrades: ["chimaeraReunification"],
                seen: ["chimaera"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                    diver: 2,
                },
            },
        },
        iterativeDesign: {
            name: "Design Iterado",
            desc: "As máquinas são boas, mas poderiam ser melhores. Vamos refazer nossas máquinas do zero!",
            researchedMessage: "E nós aprendemos que ciência é sobre aprender de erros, é o que diz os cientistas. Sobre seus próprios erros.",
            effectDesc: "Todas as máquinas tubarônicas duplicam sua velocidade. Sim, de novo! Além disso, cientistas quadruplicam sua eficiência.",
            cost: {
                science: 275000,
                sharkonium: 27500,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    scientist: 4,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recicladora",
            desc: "Invente um sistema de destruir recursos em uma gosma para ser reutilizada em outra coisa.",
            researchedMessage:
                "Bem, isso daqui parece que veio de um pesadelo. Eu não atreveria a nadar perto de qualquer buraco dessa máquina. Mas ela certamente pode ser útil para nós!",
            effectDesc: "Possibilita a reciclagem de materiais por meio de uma boca aterrorizante que consume e destrói tudo que chega perto. Futuro?",
            cost: {
                science: 500000,
                sharkonium: 50000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        abyssalEnigmas: {
            name: "Enigmas Abissais",
            desc: "As quimeras voltaram do fundo do oceano com artefatos misteriosos. Elas não parecem se importar, mas nós precisamos entendê-los.",
            researchedMessage:
                "Pelo pouco que descobrimos, nós percebemos que todos esses pedaços se encaixam de alguma maneira; formam parte de algo muito, muito maior... Nós precisamos achar mais!",
            effectDesc:
                "Quimeras dobram sua eficiência, além de poderem ser alistados na exploração dos abismos em busca de mais desses...trequinhos, vamos chamá-lo de 'arcana'. Se juntarmos o suficiente, talvez iremos conhecer seu propósito original?",
            cost: {
                science: 2500000,
                jellyfish: 100000,
            },
            required: {
                upgrades: ["shroudedChasmExploration"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                },
            },
        },
        arcaneSifting: {
            name: "Garimparia Arcana",
            desc: "Uma enguia acabou de nos mostrar uma pedrinha brilhante como arcana, gritando animada sobre como achou na areia. Isso soa interessante.",
            researchedMessage: "Enguias postas para garimpar os solos tendem a voltar com ainda mais arcana. Nós deveríamos continuar essa empreitada!",
            effectDesc: "Pode-se treinar enguias para garimpar a areia em busca de arcana.",
            cost: {
                sand: 5000000,
                arcana: 40,
            },
            required: {
                upgrades: ["shroudedChasmExploration"],
                seen: ["arcana"],
            },
        },
        arcaneStudy: {
            name: "Estudo Arcano",
            desc: "Nós vemos arrais olhando curiosamente para a nossa coleção de arcana. Onde será que eu já vi isso antes?",
            researchedMessage: "Os cientistas ajudaram a ensinar as arraias o básico de seu estudo. O conhecimento possuido pelo Cardume aumenta.",
            effectDesc:
                "Arraias podem ser letradas para praticar ciência, se tornando uma estudiosa nas técnicas da arcana para nos ajudar a compreedê-la melhor. O interesse súbito delas é meio estranho.",
            cost: {
                science: 2000000,
                arcana: 200,
            },
            required: {
                upgrades: ["shroudedChasmExploration"],
                seen: ["arcana"],
            },
        },
        arcaneCompass: {
            name: "Bússola Arcana",
            desc: "Estilhaços retos de arcana parecem girar e apontar a uma direção fixa quando os deixamos quietos. What are they pointing to?",
            researchedMessage:
                "Nós botamos alguns desses pedaços numa caixa transparente e seguimos para onde eles apontavam. Despois de um tempo nadando, eles nos levaram a um portal dilapidado.",
            effectDesc:
                "Todos os ganhos de arcana ×2. Nós aprendemos a usar a arcana para funções navegacionais, o que faz a exploração muito melhor.",
            cost: {
                arcana: 750,
            },
            required: {
                upgrades: ["arcaneStudy"],
                seen: ["scholar"],
            },
            effect: {
                resourceBoost: {
                    arcana: 2,
                },
            },
        },
        chimaeraMysticism: {
            name: "Misticismo Quimérico",
            desc: "Nós podemos conhecer as quimeras, mas não sabemos tanto assim sobre elas. Elas só ficam falando conosco como se não tivéssemos pergunta alguma. Mas nós temos!",
            researchedMessage:
                "Finalmente confrontamos as quimeras sobre como não entendemos nada que elas falam. E depois que reclamamos, houve esse silêncio desconfotável, e então elas começaram a falar feito gente normal. Elas podiam ter feito assim desde o início?",
            effectDesc:
                "Quimeras e exploradoras são duas vezes mais eficientes, uma vez que conseguimos falar direito com elas. Porém elas parecem menos entusiásticas em trabalha com a gente. O que será que deu nelas?",
            cost: {
                science: 7500000,
                jellyfish: 150000,
            },
            required: {
                upgrades: ["arcaneCompass"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                    explorer: 2,
                },
            },
        },
        bioelectricity: {
            name: "Bioelectricity",
            desc: "Further study has revealed arcana to be electrically conductive. They're too brittle to build circuits, but the eels have another idea...",
            researchedMessage: "The eels have developed a tool to pump bioelectricity directly into machines! Brilliant!",
            effectDesc: "Machines are four times as effective. Eel-harnessed energy is weird, but practical.",
            cost: {
                sharkonium: 200000,
                arcana: 2000,
            },
            required: {
                upgrades: ["arcaneCompass", "iterativeDesign"],
            },
            effect: {
                incomeMultiplier: {
                    fishMachine: 4,
                    sandDigger: 4,
                    crystalMiner: 4,
                },
            },
        },
        arcaneSacrifice: {
            name: "Arcane Sacrifice",
            desc: "Further study has revealed arcana to be shards of a sort of huge, abstract battery for...something. If harnessed, this could change everything.",
            researchedMessage:
                "It turns out that the energy within arcana is violently released when shattered. If we do it just right, then we reap all the benefits.",
            effectDesc: "Arcana can now be shattered, sacrificing them for the greater good.",
            cost: {
                arcana: 10000,
            },
            required: {
                upgrades: ["arcaneCompass"],
            },
        },
        superprocessing: {
            name: "Superprocessamento",
            desc: "A recicladora não foi feita com o dissolução de milhões de peixes em mente. Considerando que isso é uma demanda bem comum, nós provavelmente deveríamos fazer algo sobre isso.",
            researchedMessage: "Eureca! Se fizermos as coisas grandes ficarem maiores, e os moedores mais moídos, nós poderemos processar muito mais material de uma só vez!",
            effectDesc:
                "A eficiência da recicladora só começa a cair na casa dos 10 milhões de itens de uma só vez, ao invés de 100 mil. A eficiência máxima também aumentou para 100%.",
            cost: {
                science: 10000000,
                sharkonium: 2e6,
                junk: 1e7,
            },
            required: {
                upgrades: ["bioelectricity", "recyclerDiscovery"],
            },
        },
        ancestralRecall: {
            name: "Lembrança Ancestral",
            desc: "Tubarões, arraias e até quimeras, todos temos algo em comum. Pelo folclore oral mantido vivo pelas quimeras, talvez consigamos entender isso.",
            researchedMessage:
                "Os contos das quimeras falam sobre um cardume, parecido com o nosso. É dito que o que eles fizeram foi glorioso, mas parece que o que especificamente eles fizeram foi perdido ao longo do tempo.",
            effectDesc:
                "Tubarões, arraias, quimeras, e suas especializações, produzem quatro vezes mais. Exceto mergulhadores, que produzem 16 vezes mais. Tivemos um passado glorioso. Agora, iremos para um futuro glorioso.",
            cost: {
                science: 2e7,
            },
            required: {
                upgrades: ["arcaneSacrifice"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 4,
                    diver: 16,
                    scientist: 4,
                    nurse: 4,
                    ray: 4,
                    maker: 4,
                    chimaera: 4,
                    explorer: 4,
                },
            },
        },
        arcaneHeart: {
            name: "Bravura Arcana",
            desc: "As enguias não estão explorando o oceano como todos nós; elas só ficam ao redor de seus buraquinhos. Se pudéssemos ao menos mostrá-las seu potencial, talvez elas ajam diferente.",
            researchedMessage:
                "Juntando tudo que nós sabemos sobre as enguias e as quimera, nós descobrimos uma rede subterrânea de túneis de enguias. No meio de tudo, há restos destruídos de uma cidade industrial das antiga, uma que devia ter abrigado milhões.",
            effectDesc:
                "Enguias e suas especializações são 4 vezes mais eficientes. Com a notícia das ruínas anciãs se espalhando, as enguias começaram a falar e agir diferentemente. Não demorou muito para eles se juntarem às expedições.",
            cost: {
                science: 4e7,
            },
            required: {
                upgrades: ["arcaneSacrifice", "bioelectricity"],
                resources: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 4,
                    pit: 4,
                    sifter: 4,
                },
            },
        },
        arcaneActivation: {
            name: "Ativação Arcana",
            desc: "O portal aguarda.",
            researchedMessage:
                "O poder da arcana estoura em uma luz avassaladora ao ser quebrada. Quando conseguimos ver coisas novamente, o portal tinha voltado à vida.",
            effectDesc: "...",
            cost: {
                science: 2e10,
                arcana: 1000000,
            },
            required: {
                upgrades: ["arcaneSacrifice"],
            },
        },
    },
    marine: {
        crystalBite: {
            name: "Mordedura de Cristal",
            desc: "Morda os cristais até eles ficarem num formato que nos ajude a morder ainda melhor!",
            researchedMessage: "Dentaduras estranhas foram feitas, e tubarões conseguem agora caçar peixes melhor.",
            effectDesc: "Com seus novos mordedores, a efetividade dos tubarões é dobrada. Na verdade, funciona ainda melhor se for usado fora da boca!",
            cost: {
                science: 50,
                fish: 10,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        crystalSpade: {
            name: "Chapa de Cristal",
            desc: "Aperte o cristal até produzir uma armadura de cabeça para as arraias.",
            researchedMessage: "As arraias conseguem perturbar mais a areia, ou seja, agora coletamos mais areia!",
            effectDesc: "Efetividade das arraias duplica devido a suas novas ferramentas adaptadas ao seus formatos.",
            cost: {
                science: 50,
                sand: 20,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crystalContainer: {
            name: "Garrafas de Cristal",
            desc: "Faça uns trecos garrafescos usando os nossos cristais. Talvez seja útil??",
            researchedMessage: "Bem, coisas que não são água podem ser guardadas nesse vidrinhos. A ciência ficou mais fácil!",
            effectDesc: "Cientistas têm sua velocidade dobrada ao fazer ciência.",
            cost: {
                science: 100,
                crystal: 50,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        statsDiscovery: {
            name: "Caverna Armazém",
            desc: "Tá na hora de nós termos um lugar de verdade para manter nossos estoques. Achamos um cafofo, mas precisa ser arrumado.",
            researchedMessage:
                "Todos as nossas coisas foram guardadas, separadas e categorizadas em um sistema de cavernas inundado. Nós estamos todos organizados! Mais ou menos!",
            effectDesc: "Ao armazenar nossos bens em um local centralizado, finalmente podemos manter controle do que estamos fazendo...em sua maior parte.",
            cost: {
                science: 150,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
        },
        seabedGeology: {
            name: "Geologia Oceânica",
            desc: "Estude o fundo do oceano para determinar seus ricos e belos segredinhos.",
            researchedMessage: "Não só descobrimos muitas coisas estranhas, as arraias descobriram que existe mais areia do que apenas areia!",
            effectDesc: "Com um novo entendimento do solo oceânico e seus sedimentos, eficiência de arraias é dobrada.",
            cost: {
                science: 300,
                sand: 250,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        underwaterChemistry: {
            name: "Química Submersa",
            desc: "Com nossas garrafas estrahas, podemos colocar coisas junto com outras coisas e ver o que acontece.",
            researchedMessage: "Então, nada de útil foi descoberto, mas se a gente continuar com isso, vamos fazer grandes passos pela ciência!",
            effectDesc: "Cientistas usam seus novos conhecimentos químicos para dobrar sua eficiência.",
            cost: {
                science: 450,
                crystal: 50,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        clamScooping: {
            name: "Coleta de Mexilhão",
            desc: "Vemos essas coisas por toda parte, mas não conseguimos diferenciar quais são mexilhões e quais são pedras.",
            researchedMessage:
                "Observação cuidadosa revelou que mexilhões e pedras são realmente coisas diferentes. Agora não vamos mais coletar pedras por acidente!",
            effectDesc: "Mexilhões podem ser coletados como se fosse peixe.",
            cost: {
                science: 750,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        thermalVents: {
            name: "Fontes Termais",
            desc: "Investigue os buracos ferventes que ficam jogando água quente.",
            researchedMessage: "Mas que belo! Nós temos uma nascente de calor interminável! Tenho certeza que algo bom virá disso.",
            effectDesc: "Uma fonte de energia quase infinita foi descoberta. Novas tecnologias são possíveis!",
            cost: {
                science: 1500,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        pearlConversion: {
            name: "Conversão de Pérola",
            desc: "Algumas vezes nós achamos essas bolinhas brilhantes dentro dos mexilhões. As lagostas dizem que conseguem usá-las? Como??",
            researchedMessage:
                "Bem, conseguimos transmutar o que chamam de 'pérolas' em cristais agora, porém o resto do mexilhão vai junto. (sim, o mexilhão inteiro)",
            effectDesc:
                "Nós podemos tranformar mexilhão cristal usando as 'pérolas' dentro deles como um foco. Talvez um dia, não precisaremos do mexilhão todo.",
            cost: {
                science: 2000,
                clam: 500,
                crystal: 100,
            },
            required: {
                upgrades: ["thermalVents"],
                seen: ["lobster"],
            },
        },
        agriculture: {
            name: "Agricultura",
            desc: "Não sabemos por quanto tempo uma sociedade caçadora-coletora irá nos servir. Talvez devêssemos juntar nossos animais e deixá-los crescer.",
            researchedMessage: "É tão mais fácil conseguir coisas quando elas estão todas em um lugar. Como se o oceano inteiro estivesse na nossa gruta!",
            effectDesc: "Avanços na agricultura irão incentivar futuras empreitadas. Quem sabe qual vai ser o nosso próximo passo!",
            cost: {
                science: 4250,
                sand: 10000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        biology: {
            name: "Biologia",
            desc: "O que é um tubarão? O que tem dentro de um tubarão, além de muitos peixes?",
            researchedMessage: "Com uma nova compreensão da própria biologia, tubarões agora podem se especializar em montar novos tubarões.",
            effectDesc:
                "Tubarões produzem duas vezes mais e tubarões enfermeiros podem ser treinados. Você sabia que ovos de tubarão não aparecem apenas porque um tubarão pediu muito a Papai do Céu?",
            cost: {
                science: 2500,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        crustaceanBiology: {
            name: "Biologia Crustácea",
            desc: "Essas criaturas esquisitas se parecem com os siris. Precisamos investigar isso...o que é um exoesqueleto?",
            researchedMessage: "Compreendemos como que essas cópias de caranguejo funcionam. Com muitos membros.",
            effectDesc:
                "Lagostas trabalham duas vezes mais. Lagostas podem coletar outras coisas ou se cobrir em ovos brilhantes, também chamado de 'caviar'. Você sabe o que é caviar?",
            cost: {
                science: 2500,
                clam: 1000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    lobster: 2,
                },
            },
        },
        sunObservation: {
            name: "Observação Solar",
            desc: "Precisamos entender que brilho maluco é aquele na superfície da água.",
            researchedMessage: "Cientistas acabaram de descobrir o Sol! Eles também descobriram que olhar para sol dói.",
            effectDesc:
                "Plantadores colhem duas vezes mais alga. Será que um sol vale vários peixes? Nós vemos o Sol, mas onde que está? O que faz um Sol brilhar?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        kelpHorticulture: {
            name: "Horticultura de Alga",
            desc: "Descubra o que é necessário para encher o solo de alga marinha. Possivelmente será útil.",
            researchedMessage: "Equipamento caranguêjico foi inventado para eles começarem a plantar alga! Isso é possivelmente útil.",
            effectDesc: "Caranguejos podem se especializar em fazendeiros de algas e crescer um tapete verde pelo fundo do oceano.",
            cost: {
                science: 1000,
                sand: 5000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
        },
        xenobiology: {
            name: "Xenobiologia",
            desc: "Tente explicar oque que são essas frutinhas que ficam saindo da nossa alga.",
            researchedMessage: "Resultados inconclusivos! Mais pesquisa é necessária. Pode ser um grande benefício para a ciência!",
            effectDesc:
                "Algas produzem holotúrias duas vezes mais rápido. Nós podemos dissecar holotúrias pela ciência. Também, nós descobrimos que holotúrias não são frutas. Que nojo.",
            cost: {
                seaApple: 25,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
        rayBiology: {
            name: "Biologia Arraiística",
            desc: "Mesmo sendo primos de nós, tubarões, não sabemos quase nada das arraias. Nós podemos consertar isso. Só precisamos de uma armadilha.",
            researchedMessage:
                "Aparentemente, poderíamos ter apenas perguntado. Mas conseguimos descobrir como arraias fazem mais arrainhas. É bem parecido como tubarões funcionam, mas com arraias.",
            effectDesc:
                "Arraias e arraias laser são duas vezes mais rápidas e criadores de arraias estão disponíveis. Mas talvez as relações tubarão-arraia nunca voltem ao seu estado original depois de quão vergonhoso isso foi para todos os envolvidos.",
            cost: {
                science: 12500,
                sand: 7500,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crabBiology: {
            name: "Biologia Caranguêsa",
            desc: "Esse bichos são um mistério. Eles são meio calados e apenas cavam cristais ou plantam coisas. Por que eles fazem isso? E o QUE são siris??",
            researchedMessage:
                "Parece que caranguejos são crustáceos amigáveis que revelaram aos tubarões os segredos de produção de caraguejo. Envolvendo ovos, ou algo parecido. Ovos que se mexem.",
            effectDesc:
                "Caranguejos e plantadores são, respectivamente, 4 e 2 vezes mais rápidos, e ninhadas de caranguejo podem ser formadas. Siris aparentemente são apenas um tipo de caranguejo, o que é legal, mas um pouco medonho, porque caranguejos são assustadores. Que bom que eles estão do nosso lado!",
            cost: {
                science: 12500,
                kelp: 500,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 2,
                },
            },
        },
        exploration: {
            name: "Exploração",
            desc: "Nade além desse mar conhecido para vez o que mais achamos!",
            researchedMessage: "Achamos um monte de peixes! De todo tipo de cardume possível! E tantas reservas de areia não exploradas!",
            effectDesc: "Tubarões e arraias pegam o dobro de recursos. Você sabia que oceanos eram tão grandes assim? Incrível!",
            cost: {
                science: 25000,
                fish: 100000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    ray: 2,
                },
            },
        },
        transmutation: {
            name: "Transmutação",
            desc: "Ao esquentar coisas e fazer ciência, novas coisas podem ser feitas!",
            researchedMessage: "Um novo tipo de material foi descoberto! Foi batizado em homenagem de seu criador, Dr. Tubarão.",
            effectDesc: "Permite a transmutação de umas coisas que nós temos jogadas por aí em tubarônio, o material do futuro.",
            cost: {
                science: 125000,
                crystal: 40000,
                sand: 250000,
            },
            required: {
                upgrades: ["thermalVents", "underwaterChemistry"],
            },
        },
        automation: {
            name: "Automação",
            desc: "Usando tubarônio, podemos fazer coisas que fazem coisas para que nós não precisemos fazer as coisas!",
            researchedMessage: "Agora não precisamos fazer todo o trabalho, já que as máquinas o fazem por nós! FUTUUURO!!",
            effectDesc: "Máquinas podem ser construídas para ajudar na produção do cardume de forma mais eficiente.",
            cost: {
                sharkonium: 25000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        engineering: {
            name: "Engenharia",
            desc: "Nossas máquinas são meio ruins. Vamos aprender a montá-las melhor!",
            researchedMessage: "Dobramos a produção das máquinas, e ainda aprendemos a fazer outras máquinas! Dois em um!",
            effectDesc: "Produção das nossas máquinas multiplicada por dois. Transmutadoras automáticas são agora construíveis.",
            cost: {
                sharkonium: 100000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 8,
                    fishMachine: 2,
                    sandDigger: 4,
                },
            },
        },
        calciniumStudies: {
            name: "Estudos de Calcinício",
            desc: "As lagostas viram nosso processo de transmutação, e isso os lembrou de alguma coisa?",
            researchedMessage: "E aqui estamos. Calcinício, aparentemente! Surpreendentemente forte.",
            effectDesc:
                "Aprendemos a manufaturar calcinício. Me pergunto para que serve. As lagostas estão analisando as informações que elas têm sobre.",
            cost: {
                science: 450000,
                clam: 1000000,
                crystal: 5000000,
            },
            required: {
                upgrades: ["transmutation"],
                seen: ["sharkonium"],
            },
        },
        calciniumRobotics: {
            name: "Robótica de Calcinício",
            desc: "Então. As lagostas lembraram para que o calcinício serve.",
            researchedMessage: "Com um pouco de dor de cabeça, conseguimos montar ferramentas com o calcinício para o Cardume.",
            effectDesc:
                "Arraias e plantadores podem ser treinados como coletores mexílicos e desmatadores oceânicos. As ferramentas foram feitas para funcionar sem nenhum comando de seus usuários. Medonho.",
            cost: {
                calcinium: 125000,
            },
            required: {
                upgrades: ["automation", "calciniumStudies"],
                seen: ["calcinium"],
            },
        },
        calciniumCybernetics: {
            name: "Cibernética",
            desc: "Ferramentas roboticas são ótimas e tal, mas sozinhas elas são bem idiotas. Seria muito melhor se aprendessemos a controlá-las.",
            researchedMessage:
                "Um amontoado de diagramas amassados e alguns experimentos de moralidade duvidosa depois, cérebro agora conseguem interfacear diretamente com máquinas de calcinício. Futuríssimo!",
            effectDesc:
                "Coletores mexílicos coletam duas vezes mais e desmatadores desmatam quatro vezes mais. Também, podemos fazer conversoresde calcinício??",
            cost: {
                science: 1250000,
                calcinium: 500000,
            },
            required: {
                upgrades: ["calciniumRobotics"],
            },
            effect: {
                incomeMultiplier: {
                    clamScavenger: 2,
                    seabedStripper: 4,
                },
            },
        },
        farExploration: {
            name: "Exploração Longínqua",
            desc: "Explore as vastas águas além de qualquer expedição já feita.",
            researchedMessage: "Depósitos ricos em cristal foram achados, junto de abismos grandes e profundos.",
            effectDesc: "Caranguejos quadruplicam e mineradores de cristal dobram suas eficiências. Você sabia que os oceanos são maiores do que apenas grande? Fantástico!",
            cost: {
                science: 5000000,
                clam: 7500000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 8,
                    crystalMiner: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recicladora",
            desc: "Invente um sistema de destruir recursos em uma gosma para ser reutilizada em outra coisa.",
            researchedMessage:
                "Bem, isso daqui parece que veio de um pesadelo. Eu não atreveria a nadar perto de qualquer buraco dessa máquina. Mas ela certamente pode ser útil para nós!",
            effectDesc: "Possibilita a reciclagem de materiais por meio de uma boca aterrorizante que consume e destrói tudo que chega perto. Futuro?",
            cost: {
                science: 7500000,
                sharkonium: 1000000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Design Iterado",
            desc: "As máquinas são boas, mas poderiam ser melhores. Vamos refazer nossas máquinas do zero!",
            researchedMessage: "E nós aprendemos que ciência é sobre aprender de erros, é o que diz os cientistas. Sobre seus próprios erros.",
            effectDesc: "Todas as máquinas tubarônicas duplicam sua velocidade. Sim, de novo! Além disso, cientistas quadruplicam sua eficiência.",
            cost: {
                science: 40000000,
                sharkonium: 5000000,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 8,
                    fishMachine: 4,
                    sandDigger: 8,
                    autoTransmuter: 4,
                    scientist: 16,
                },
            },
        },
        superprocessing: {
            name: "Superprocessamento",
            desc: "A recicladora não foi feita com o dissolução de milhões de peixes em mente. Considerando que isso é uma demanda bem comum, nós provavelmente deveríamos fazer algo sobre isso.",
            researchedMessage: "Eureca! Se fizermos as coisas grandes ficarem maiores, e os moedores mais moídos, nós poderemos processar muito mais material de uma só vez!",
            effectDesc:
                "A eficiência da recicladora só começa a cair na casa dos 10 milhões de itens de uma só vez, ao invés de 100 mil. A eficiência máxima também aumentou para 100%.",
            cost: {
                science: 100000000,
                sharkonium: 1e7,
                junk: 1e7,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        bioengineering: {
            name: "Bioengenharia",
            desc: "As lagostas propõem uma distribuição cibernética mais extensa.",
            researchedMessage: "Nós instalamos chipes em todo mundo que achamos. Nossa eficiência aumentou enormemente!",
            effectDesc: "128× produção de tubarões e plantadores, 64× para cientistas, caranguejos e lagostas, 32× para arraias. Agora sim!",
            cost: {
                science: 250000000,
                calcinium: 7500000,
            },
            required: {
                upgrades: ["calciniumCybernetics", "iterativeDesign"],
                seen: ["clamScavenger", "seabedStripper"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 128,
                    ray: 32,
                    crab: 32,
                    lobster: 64,
                    scientist: 64,
                    planter: 128,
                },
            },
        },
        highEnergyFusion: {
            name: "Fusão de Alta Energia",
            desc: "As lagostas estão excitadas em nos mostrar algo, mas elas vão precisar de muita ajuda antes.",
            researchedMessage: "O processo faz tanta luz que poderia derreter nossos olhos - mas o resultado é tão melhor que o jeito que fazíamos.",
            effectDesc: "Melhoramos a proporção mexilhão para cristal de 5-1 para 1-5. Esqueça a recicladora, agora temos FUSÃO!!",
            cost: {
                science: 1e9,
            },
            required: {
                upgrades: ["iterativeDesign", "pearlConversion"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("clam", false, 2, background)} to ${sharktext.getResourceName(
                    "crystal",
                    false,
                    2,
                    background,
                )} eficiência de conversão ×25`;
            },
        },
        gateDiscovery: {
            name: "Exploração Abissal",
            desc: "Múltiplas expedições perigosas e audaciosas ao fundo do abismo, para pegar o que acharmos.",
            researchedMessage: "Nós achamos uma estrutura estranha pelas pistas achadas no abismo. O custo foi alto, mas a descoberta é maior!",
            effectDesc: "Algo ancestral reside nas profundezas.",
            cost: {
                science: 1e10,
                shark: 100000,
                fish: 50000000,
            },
            required: {
                upgrades: ["farExploration"],
            },
        },
        sentientCircuitBoards: {
            name: "Circuitos Sencientes",
            desc: "As lagostas propõem um último passo.",
            researchedMessage: "Mesmo com objeções de múltiplas parcelas do Cardume, seguimos o plano. Reprodutores agora devem instalar suas próteses cibernéticas para cada filhote que criam.",
            effectDesc:
                "Enfermeiros, criadores de arraia e ninhadas produzem ×64 mais. Lagostas caviadas trabalham 128 vezes mais. Isso tudo é em prol do Cardume. Isso é o melhor para nosso futuro.",
            cost: {
                calcinium: 1e8,
                science: 2e10,
            },
            required: {
                upgrades: ["bioengineering"],
            },
            effect: {
                incomeMultiplier: {
                    nurse: 64,
                    maker: 64,
                    brood: 64,
                    berrier: 128,
                },
            },
        },
        mobiusShells: {
            name: "Cascas de Möbius",
            desc: "Nós não entendemos. As lagostas sugeriram algo...Indescritível.",
            researchedMessage:
                "Elas fizeram. Nem tivemos a chance de argumentar. Agora, quando vemos o que uma vez foram as lagostas, não sabemos para o que estamos olhando. Na verdade, nós preferiríamos parar de olhar agora.",
            effectDesc: "Tentamos perguntar a elas o que aconteceu. Mas elas não nos respondem mais.",
            cost: {
                calcinium: 5e10,
                lobster: 1e8,
            },
            required: {
                upgrades: ["sentientCircuitBoards", "gateDiscovery", "highEnergyFusion"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    lobster: 4096,
                    berrier: 4096,
                    calciniumConverter: 4096,
                },
            },
        },
    },
    volcanic: {
        packHunting: {
            name: "Caça em Bando",
            desc: "Convença as arraias a caçarem juntas em bando para maior sucesso.",
            researchedMessage: "Ao caçar em grupos, agora as arraias conseguem pegar grandes cardumes de peixe antes que eles consigam fugir.",
            effectDesc: "Caçar em grupos dobra a eficiência das arraias. A estratégia (do latim strategi) dos tubarões funciona para não tubarões também.",
            cost: {
                science: 25,
                fish: 1000,
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        curiousCollection: {
            name: "Coleção Curiosa",
            desc: "Nós temos coletado esse tal de 'coral'. Mas o que que é isso?",
            researchedMessage:
                "É um tipo de animal, já que se mexe. Obviamente, corais comem alguma coisa, mas o que não sei. Ele apenas meio que pega algo da água e come de vez em quando. Esquisito.",
            effectDesc:
                "Nós temos o conhecimento mais basal do que é o coral. Caranguejos, siris e curiosos produzem duas vezes mais por causa disso.",
            cost: {
                science: 125,
                coral: 20,
            },
            effect: {
                incomeMultiplier: {
                    crab: 2,
                    curiousCrab: 2,
                },
            },
        },
        seabedGeology: {
            name: "Geologia Oceânica",
            desc: "Estude o fundo do oceano para determinar seus ricos e belos segredinhos.",
            researchedMessage: "Não só descobrimos muitas coisas estranhas, as arraias descobriram que existe mais areia do que apenas areia!",
            effectDesc: "Com um novo entendimento do solo oceânico e seus sedimentos, eficiência de arraias é dobrada e caranguejos pegam coral em dobro.",
            cost: {
                science: 600,
                sand: 5000,
            },
            required: {},
            effect: {
                incomeMultiplier: {
                    ray: 2,
                    crab: 2,
                },
            },
        },
        thermalVents: {
            name: "Fontes Termais",
            desc: "Investigue os buracos ferventes que ficam jogando água fervente.",
            researchedMessage: "Além de água, as fontes também estão cuspindo recursos que nos interessa! Então é daqui que toda essa areia vem.",
            effectDesc: "Uma fonte de energia foi descoberta. Mas o mais importante é que agora podemos pegar as coisas que saem delas!",
            cost: {
                science: 1500,
                sand: 5000,
                coral: 100,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
            effect: {
                addAlgaeIncome: {
                    world: 1,
                },
                addSandIncome: {
                    world: 5,
                },
            },
        },
        spongeCollection: {
            name: "Coleta de Esponja",
            desc: "Nós vemos essas massas em meio aos recifes, mas não temos ideia de como pegá-las sem as destruir.",
            researchedMessage:
                "Ao entender a natureza frágil das esponjas e sua estranha estrutura porosa, descobrimos que podemos coletá-las se mordermos bem de leve apenas.",
            effectDesc: "Esponja pode ser coletada como se fosse peixe.",
            cost: {
                science: 2500,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        statsDiscovery: {
            name: "Caverna Armazém",
            desc: "Tá na hora de nós acharmos um lugar de verdade para manter nossos estoques. Achamos um cafofo, mas precisa ser arrumado.",
            researchedMessage:
                "Todos as nossas coisas foram guardadas, separadas e categorizadas em um sistema de cavernas inundado. Nós estamos todos organizados! Mais ou menos!",
            effectDesc: "Ao armazenar nossos bens em um local centralizado, finalmente podemos manter controle do que estamos fazendo...em sua maior parte.",
            cost: {
                science: 4000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        /*         kelpCatching: {
            name: "Kelp Catching",
            desc: `The vents spew out kelp, but we just pick it up when it hits the ground. Maybe it's more efficient (maybe sustainable?????) to grab it while it's still flying around.`,
            researchedMessage: `We have found that crabs are great at catching things. Y'know, since, like, claws and stuff. With proper instruction, we can direct them to increase our kelp yield.`,
            effectDesc: "Through careful observation and training, crabs can be made catchers to increase our kelp output from vents.",
            cost: {
                sand: 30000,
                science: 500,
            },
            required: {
                upgrades: ["sustainableSolutions"],
            },
        },
        coralSymbiosis: {
            name: "Coral Symbiosis",
            desc: `Alright, so according to some very "helpful" comments from the shrimp, we need to live alongside the environment instead of taking advantage of it. Suuuure.`,
            researchedMessage: `Almost all of the coral we find can catch small fish, and through that, we've found a way to live alongside them. By "hiring" them. To get us fish.`,
            effectDesc:
                "We don't just throw coral in a pile anymore; now they're all on payroll, and we take a cut of their fish. I hope you're happy, shrimps.",
            cost: {
                coral: 100,
                science: 1000,
            },
            required: {
                upgrades: ["sustainableSolutions"],
            },
            effect: {
                addFishIncome: {
                    coral: 0.2,
                },
            },
        }, */
        agriculture: {
            name: "Agricultura",
            desc: "Aparentemente, nós não deveríamos estar roubando esponja do chão. Mas roubando de quem, exatamente???",
            researchedMessage:
                "Em defesa dos camarões, realmente é bem mais fácil conseguir esponja quando nós mesmos a crescemos. Botar a esponja em um lugar e deixá-la crescer é uma solução boa.",
            effectDesc: "Fazendas de esponja estão disponíveis para construção.",
            cost: {
                sand: 80000,
            },
            required: {
                upgrades: ["spongeCollection"],
                seen: ["sponge"],
            },
        },
        consistentCommunication: {
            name: "Comunicação Consistente",
            desc: "Camarões, olhem! Nós temos alga para alimentar as esponjas! Não precisamos mais das suas esponjas!",
            researchedMessage: "Com uma ampla demonstração de que conseguimos fazer esponja mais do que o suficiente com as fazendas, alguns camarões se convenceram das nossas intenções serem boas.",
            effectDesc: "Camarões podem ser recrutados, mas eles foram meio grossos. Como que iríamos sabe que esponjas precisam de alga para crescer por algum motivo?",
            cost: {
                sponge: 250,
            },
            required: {
                upgrades: ["spongeCollection"],
                seen: ["sponge"],
            },
        },
        biology: {
            name: "Biologia",
            desc: "O que nós somos? Do que somos feitos? Por que nadamos e outros não?",
            researchedMessage: "Com um conceito melhor da nossa biologia, entendemos melhor nossas limitações. Talvez devêssemos manter essa linha de pensamento.",
            effectDesc:
                "Arraias e caranguejos são duas vezes mais eficientes em seus respectivos trabalhos. Você sabia que é porque temos uma coisa chamada barbatanas e por isso conseguimos nadar, mas siris não??",
            cost: {
                science: 15000,
            },
            required: {
                upgrades: ["consistentCommunication"],
                seen: ["shrimp"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                    crab: 2,
                },
            },
        },
        sociology: {
            name: "Sociologia",
            desc: "O que é um cardume? Por que obedecemos ordens? Por que trabalhamos juntos?",
            researchedMessage: "Progresso, prosperidade, organização, ordem. Nós escolhemos ser parte desta sociedade e é assim que ela é criada.",
            effectDesc: "Camarões e fazendas de esponja são duas vezes mais eficientes agora que conseguimos compreender o conceito de um grupo social estruturado diferentemente do nosso.",
            cost: {
                science: 15000,
                sponge: 1000,
            },
            required: {
                upgrades: ["consistentCommunication"],
                seen: ["shrimp"],
            },
            effect: {
                incomeMultiplier: {
                    shrimp: 2,
                    spongeFarm: 2,
                },
            },
        },
        rayBiology: {
            name: "Biologia Arraiística",
            desc: "Mesmo sendo meus primos, não sei quase nada das arraias. Posso consertar isso. Eu só preciso de uma armadilha.",
            researchedMessage:
                "Aparentemente, eu poderia ter apenas perguntado. Mas consegui descobrir como arraias fazem mais arrainhas. É bem parecido como eu funciono, mas com arraias.",
            effectDesc:
                "Arraias são duas vezes mais rápidas e criadores de arraias estão disponíveis. Mas talvez as relações tubarão-arraia nunca voltem ao seu estado original depois de quão vergonhoso isso foi para todos os envolvidos.",
            cost: {
                science: 25000,
                sand: 100000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        eusociality: {
            name: "Eusocialidade",
            desc: "Os camarões são estranhíssimos. A sociedade deles é incompreensível. Qual é a deles?",
            researchedMessage: "Nós aprendemos muito mais do que nós queríamos sobre o dever de rainhas em estágio reprodutivo nas colônias eusociais.",
            effectDesc: "Rainha camarões estão disponíveis, fazendas de esponja produzem duas vezes mais e nossos pesadelos nunca mais serão os mesmos.",
            cost: {
                sponge: 7500,
            },
            required: {
                upgrades: ["sociology"],
            },
            effect: {
                incomeMultiplier: {
                    spongeFarm: 2,
                },
            },
        },
        crabBiology: {
            name: "Biologia Caranguêsa",
            desc: "Esse bichos são um mistério. Eles são meio calados e apenas cavam cristais ou plantam coisas. Por que eles fazem isso? E o QUE são siris??",
            researchedMessage:
                "Parece que caranguejos são crustáceos amigáveis que revelaram aos tubarões os segredos de produção de caraguejo. Envolvendo ovos, ou algo parecido. Ovos que se mexem.",
            effectDesc:
                "Caranguejos e caranguejos curiosos dobram sua velocidade, e ninhadas de caranguejo podem ser formadas. Siris aparentemente são apenas um tipo de caranguejo, o que é legal, mas um pouco medonho, porque caranguejos são assustadores. Que bom que eles estão do nosso lado!",
            cost: {
                science: 35000,
                coral: 750,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 2,
                    curiousCrab: 2,
                },
            },
        },
        xenobiology: {
            name: "Xenobiologia",
            desc: "Tá...arraias, caranguejos, camarões, todos nós temos biologia. Mas e essas massas sem rosto?",
            researchedMessage: "Sim, elas estão vivas! Elas vivem! Mas não como nós. Por algum motivo, elas não saem do lugar!",
            effectDesc: "Após desvendar os secredos poríferos da esponja, nossas fazendas produzem o dobro de esponja agora.",
            cost: {
                science: 100000,
            },
            required: {
                upgrades: ["eusociality", "biology"],
            },
            effect: {
                incomeMultiplier: {
                    spongeFarm: 2,
                },
            },
        },
        properPractices: {
            name: "Normas de Conduta",
            desc: "Nós só temos jogado esponjas pela areia esperando que elas crescessem. O que, pensando melhor, não foi a melhor ideia.",
            researchedMessage: "Ao organizar as esponjas em fileiras, nós podemos dar o espaço necessário para elas crescerem direito! Um viva para a ciência!",
            effectDesc: "Semear as esponjas com um método certo faz elas crescerem 4 vezes mais rápido.",
            cost: {
                science: 200000,
                sponge: 25000,
            },
            required: {
                upgrades: ["xenobiology"],
            },
            effect: {
                incomeMultiplier: {
                    spongeFarm: 4,
                },
            },
        },
        wormWarriors: {
            name: "Caça Aos Vermes",
            desc: "As colônias de esponja dos camarões estão sendo atacadas o tempo inteiro por invasores externos (que não somos nós!). Uma colaboração seria ótimo para eles.",
            researchedMessage: "Nossos esforços levaram à formação de uma nova casta de camarões - os exterminadores de vermes.",
            effectDesc: "Camarões rainhas são duas vezes mais eficientes, uma vez que elas não precisam se preocupar mais com minhocas enormes as devorando.",
            cost: {
                sponge: 75000,
                shrimp: 5000,
            },
            required: {
                upgrades: ["eusociality"],
            },
            effect: {
                incomeMultiplier: {
                    queen: 2,
                },
            },
        },
        coralCloning: {
            name: "Clonagem de Coral",
            desc: "Essa outra massa. Coral. Também não tem rosto. Também não nada. Será que está viva também?",
            researchedMessage: "Cacete! Isso também está vivo! Que mundo incrível, que bichos fantásticos. Vamos multiplicá-los.",
            effectDesc: "Desbloqueamos fazendas de corais. Eu me pergunto o que mais está vivo! Será que as fontes termais estão vivas? Que tal essas pedras?",
            cost: {
                science: 250000,
                coral: 2500,
            },
            required: {
                upgrades: ["xenobiology"],
            },
        },
        sustainableSolutions: {
            name: "Soluções Sustentáveis",
            desc: "Que dizer, soluções que os camarões preferem.",
            researchedMessage:
                "Pelo visto, a preferência dos camarões é plantar safras de esponja e coral ao invés de coletá-los por aí. Justo.",
            effectDesc:
                "Fazendas de esponja são 32 vezes mais eficiêntes, fazendas de coral dobram a produção. Estamos dando muita atenção para as fazendas agora. Será que é demais? Ha! Nem perto.",
            cost: {
                science: 1250000,
                sponge: 500000,
            },
            required: {
                upgrades: ["wormWarriors", "coralCloning"],
            },
            effect: {
                incomeMultiplier: {
                    spongeFarm: 32,
                    coralFarm: 2,
                },
            },
        },
        broodingBiology: {
            name: "Biologia de Ninhada",
            desc: "Ninhadas de caranguejo ocupam...muitos caranguejos.",
            researchedMessage: "Após uma pesquisa extremamente minuciosa, parece que na verdade nós precisamos de menos de 20 caranguejos para formar uma ninhada.",
            effectDesc: "Apenas 5 caranguejos são necessários por cada ninhada. Ainda é nojento.",
            cost: {
                science: 2500000,
            },
            required: {
                upgrades: ["sustainableSolutions"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("brood", false, 2, background)} cost only 5 ${sharktext.getResourceName(
                    "crab",
                    false,
                    2,
                    background,
                )}`;
            },
        },
        feedingTechniques: {
            name: "Técnicas de Alimentação",
            desc: "Certo, então as esponjas se alimentam das microalgas. Mas como???",
            researchedMessage:
                "Os camarões estão estupefatos com a nossa ignorância. Eles tentaram explicar até desenhando, mas nós ainda não entendemos. Algo sobre 'fotosintése'???'",
            effectDesc:
                "A esponja precisa de apenas um quarto de microalga para sobreviver. Os camarões falaram para mudar as fazendas para locais onde pega mais luz solar. O que que é um solar?",
            cost: {
                science: 3500000,
                sponge: 10000000,
            },
            required: {
                upgrades: ["sustainableSolutions"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("sponge", false, 2, background)} requires 4× less ${sharktext.getResourceName(
                    "algae",
                    false,
                    2,
                    background,
                )}`;
            },
        },
        secretSmelting: {
            name: "Fundição Secreta",
            desc: "Os camarões do nosso Cardume têm uma receita secreta...",
            researchedMessage:
                "Se chama porita e é feito com areia e esponjas. Infelizmente, consome muita, mas <strong>muita</strong> areia. Felizmente, você está no oceano.",
            effectDesc: "Descobrimos o segredo da <strikethrough>receita do hambuguer de siri</strikethrough> porita. Vidro nunca foi tão útil quanto agora, provavelmente.",
            cost: {
                sponge: 40000000,
                sand: 8000000,
            },
            required: {
                upgrades: ["sustainableSolutions"],
            },
        },
        antipestPatrols: {
            name: "Patrulhas Anti-Peste",
            desc: "Eita, todo o coral da nossa fazenda sumiu! Hmm... droga. Droga, droga! Vermes! Mais vermes!.",
            researchedMessage: "Acabamos com as minhocas. Para sempre. Sai daqui!",
            effectDesc:
                "Fazendas de coral são 4 vezes mais produtivas sem as minhocas comendo tudo. Os camarões exterminadores se asseguraram disso.",
            cost: {
                science: 4500000,
            },
            required: {
                upgrades: ["sustainableSolutions"],
            },
            effect: {
                incomeMultiplier: {
                    coralFarm: 4,
                },
            },
        },
        secretSmithing: {
            name: "Modelagem Secreta",
            desc: "Com a força da porita, nós podemos finalmente...não...pera, o QUE nós podemos fazer com isso?",
            researchedMessage: "After consulting our shrimp informants about it, they have suggested that we use the glass to forge tools.",
            effectDesc: "Farmer shrimp, researcher crabs, and shoveler rays are now available. ",
            cost: {
                science: 6500000,
                porite: 1500000,
            },
            required: {
                upgrades: ["secretSmelting"],
                seen: ["porite"],
            },
        },
        medicallyAssistedReproduction: {
            name: "Medically Assisted Reproduction",
            desc: "For all the rays and crabs and shrimp that we DO make, there's a lot that don't make it to adulthood in these boiling waters.",
            researchedMessage:
                "We have given breeders the necessary medical knowledge to address common problems at birth, greatly increasing survival rates.",
            effectDesc: "All breeders are 4 times more effective because a lot more children are making it through to adulthood.",
            cost: {
                science: 1.75e8,
            },
            required: {
                upgrades: ["secretSmithing"],
            },
            effect: {
                incomeMultiplier: {
                    maker: 4,
                    brood: 4,
                    queen: 4,
                },
            },
        },
        glassTempering: {
            name: "Glass Tempering",
            desc: "Glass hardening techniques can improve the usefulness of our tools.",
            researchedMessage:
                "The shrimp have taught us all they know about the properties of glass, and by rapidly heating and cooling it, we can make it stronger!",
            effectDesc:
                "Hardened tools make farmers, shovelers, and researchers twice as impactful. No more comedically timed shattering of vials during important experiments!",
            cost: {
                science: 1e9,
                porite: 2.5e7,
            },
            required: {
                upgrades: ["secretSmithing"],
                seen: ["shoveler", "farmer", "researcher"],
            },
            events: ["volcanicGlassTempering"],
            customEffect(background) {
                return `${sharktext.getResourceName("farmer", false, 2, background)} impact ×2, ${sharktext.getResourceName(
                    "shoveler",
                    false,
                    2,
                    background,
                )} impact ×2, ${sharktext.getResourceName("researcher", false, 2, background)} impact ×2`;
            },
        },
        superSmelting: {
            name: "Super Smelting",
            desc: "Vents make heat. Glass needs heat. ...this gives me an idea!",
            researchedMessage: "Using the giant geothermal vents as supersized forges, we can mass-produce porite!",
            effectDesc:
                "Gained the ability to skim sand and sponge production to auto-smelt porite! See, I told you those vents would be a source for future technology!",
            cost: {
                science: 2e9,
                porite: 1e8,
            },
            required: {
                upgrades: ["secretSmithing"],
                seen: ["shoveler", "farmer", "researcher"],
            },
        },
        firstDraft: {
            name: "First Draft",
            desc: "We need to convince the king not to kill us. Diplomacy seems like the only good option.",
            researchedMessage: "We sent a letter with a ray. The ray came back in a panic, holding another note. The king is not impressed by our \"vapid flattery.\"",
            effectDesc:
                "Tried and failed to resolve this issue via diplomacy. Our messenger has been inconsolable. They won't tell us what happened. This has stressed out the rays and shovelers, who are both working twice as hard.",
            cost: {
                science: 7.5e9,
            },
            required: {
                upgrades: ["glassTempering"],
            },
            events: ["volcanicFirstDraft"],
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
            customEffect(background) {
                return `${sharktext.getResourceName("shoveler", false, 2, background)} impact ×2`;
            },
        },
        superShovels: {
            name: "Super Shovels",
            desc: "We're running out of sand. We need more sand. Time to get more sand.",
            researchedMessage: "With enough thinking, we agreed on an amazing solution: we simply make the shovels bigger.",
            effectDesc: "Rays and their professions are four times as effective and impactful thanks to huge tools. These things are big, so it's good that the sea has basically infinite sand.",
            cost: {
                science: 1.75e10,
                porite: 2.5e9,
            },
            required: {
                upgrades: ["firstDraft"],
            },
            events: ["volcanicSuperShovels"],
            effect: {
                incomeMultiplier: {
                    ray: 4,
                    maker: 4,
                },
            },
            customEffect(background) {
                return `${sharktext.getResourceName("shoveler", false, 2, background)} impact ×4`;
            },
        },
        massProduction: {
            name: "Mass Production",
            desc: "Bigger. Better. More. We can't defend ourselves without more of everything. We need to ramp up production, NOW!",
            researchedMessage: "Production increased. Factories constructed.",
            effectDesc: "Our ability to mass-produce tools makes farmers, shovelers, and researchers cost a fifth as much porite.",
            cost: {
                porite: 2e11,
            },
            required: {
                upgrades: ["firstDraft"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("farmer", false, 2, background)} and ${sharktext.getResourceName(
                    "shoveler",
                    false,
                    2,
                    background,
                )} and ${sharktext.getResourceName("researcher", false, 2, background)} cost 80% less ${sharktext.getResourceName(
                    "porite",
                    false,
                    2,
                    background,
                )}`;
            },
        },
        secondDraft: {
            name: "Second Draft",
            desc: "Though we have bolstered our production, we realize that the shrimp still outnumber us. We have to try again.",
            researchedMessage: "We tried again, this time sending a group of shrimp. Only one returned.",
            effectDesc:
                "The shrimp were traitors, so said the king. All but one was locked in the dungeons below his castle. Shrimp and their professions are working twice as hard now. They hope to prove that they are still loyal to him.",
            cost: {
                science: 1e12,
            },
            required: {
                upgrades: ["firstDraft"],
            },
            effect: {
                incomeMultiplier: {
                    shrimp: 2,
                    queen: 2,
                },
            },
            events: ["volcanicSecondDraft"],
        },
        algaeAcolytes: {
            name: "Algae Acolytes",
            desc: "More algae. Feed the sponges. Feed them.",
            researchedMessage: "We may have accidentally created a bit of a cult.",
            effectDesc: "There is now a cult. Of algae. Algae worship and total dedication. I'm not sure if this is a good thing.",
            cost: {
                algae: 2e9,
                sponge: 5e12,
            },
            required: {
                upgrades: ["secondDraft"],
            },
        },
        centralCollection: {
            name: "Central Collection",
            desc: "By taking out the middleshrimps, we can speed up production of sponge.",
            researchedMessage:
                "The haphazard spread of people bringing in sponge has finally come to an end as the Central Collection Agency (CCA) gets to work.",
            effectDesc: "A more organized system of sponge collection has quadrupled sponge profits.",
            cost: {
                sponge: 5e15,
            },
            required: {
                upgrades: ["secondDraft"],
            },
            effect: {
                incomeMultiplier: {
                    spongeFarm: 4,
                },
            },
        },
        rumoredRecollections: {
            name: "Rumored Recollections",
            desc: "Help the acolytes properly investigate all the rumors about the king so that we stand the best chance of averting this war.",
            researchedMessage: "Rumors say the king has a secret, otherworldly portal in his castle. They also say he thinks you aim to replace him.",
            effectDesc:
                "Researchers are four times as impactful. Also, rumors say the king knows you personally. What??? That's clearly not true! Then again, not every rumor is a winner.",
            cost: {
                science: 1e13,
                sponge: 2e16,
            },
            required: {
                upgrades: ["algaeAcolytes"],
            },
            events: ["volcanicCrabReform"],
            customEffect(background) {
                return `${sharktext.getResourceName("researcher", false, 2, background)} impact ×4`;
            },
        },
        sandReform: {
            name: "Sand Reform",
            desc: "We have too many rays collecting sand willy-nilly when we could get more sand if only we were more organized.",
            researchedMessage:
                "Delegated the task of chopping up sand duties to a central agency. Rays have been grouped up and things are back on track.",
            effectDesc:
                "Rays and their professions are four times as effective and impactful. We really have a bad habit of being disorganized, don't we?",
            cost: {
                science: 3e13,
                sand: 1e16,
                sponge: 4e16,
            },
            required: {
                upgrades: ["rumoredRecollections"],
            },
            events: ["volcanicSuperShovels"], // reusing old event that does what we want to do here
            effect: {
                incomeMultiplier: {
                    ray: 4,
                    maker: 4,
                },
            },
            customEffect(background) {
                return `${sharktext.getResourceName("shoveler", false, 2, background)} impact ×4`;
            },
        },
        crabReform: {
            name: "Crab Reform",
            desc: "Okay, these reforms are getting a little ridiculous.",
            researchedMessage:
                "Honestly I'm not sure what the crabs did here, we just let them do their thing. They'll figure it out, they're smart.",
            effectDesc:
                "Crabs and their professions are four times as effective and impactful. Reason is unknown because we don't feel like asking the researchers. If it works, it works.",
            cost: {
                science: 4e13,
                coral: 1e16,
                sponge: 2e17,
            },
            required: {
                upgrades: ["sandReform"],
            },
            events: ["volcanicCrabReform"],
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    brood: 4,
                    curiousCrab: 4,
                },
            },
            customEffect(background) {
                return `${sharktext.getResourceName("researcher", false, 2, background)} impact ×4`;
            },
        },
        landReform: {
            name: "Land Reform",
            desc: "We have too many farms placed willy-nilly when we could use less space if only we were more organized.",
            researchedMessage: "Delegated the task of chopping up land to a central agency. Farms have been moved and things are back on track.",
            effectDesc: "Farms cost a fifth of the sand. We really have a bad habit of being disorganized, don't we?",
            cost: {
                science: 5e15,
                sponge: 5e18,
            },
            required: {
                upgrades: ["secondDraft"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("spongeFarm", false, 2, background)} and ${sharktext.getResourceName(
                    "coralFarm",
                    false,
                    2,
                    background,
                )} cost 80% less ${sharktext.getResourceName("sand", false, 2, background)}`;
            },
        },
        finalDraft: {
            name: "Final Draft",
            desc: "Third time's the charm. We're out of options here.",
            researchedMessage:
                "You went personally. The king's guard captured you and brought you to him, but as he started to speak, he stopped suddenly. Confusion replaced the hostility in his voice as he examined you from afar, and he asked you to speak instead.",
            effectDesc: "You expressed that you didn't mean to replace him. He agreed to follow you to the city to see that for himself.",
            cost: {
                science: 2e16,
            },
            required: {
                upgrades: ["landReform"],
            },
        },
        apologeticAmnesty: {
            name: "Apologetic Amnesty",
            desc: "The king is willing to show some mercy. Give him what he wants - repayment for what we stole, apparently.",
            researchedMessage: "The king has decided to open the gate for us, on the condition that he takes control of the frenzy. A deal's a deal.",
            effectDesc:
                "The king took us into an old, secret room behind the throne. His assistants flipped the right levers and switches, and the gate opened.",
            cost: {
                sponge: 1e21,
            },
            required: {
                upgrades: ["finalDraft"],
            },
        },
        /* passivePores: {
            name: "Passive Pores",
            desc: "You mean to tell me that sponge has been coming out of the vents this whole time, and we just didn't notice?",
            researchedMessage:
                "We've equipped our catchers to help them carefully retreieve sponge that flies out of the vents every once in a while.",
            effectDesc: `Vents now provide a passive sponge income.`,
            cost: {
                porite: 25000,
            },
            required: {
                upgrades: ["secretSmithing"],
            },
            effect: {
                addSpongeIncome: {
                    world: 0.5,
                },
            },
        },
        agricaching: {
            name: "Agricaching",
            desc: "No, not agri<i>catching</i>, we already did that. It's agri<i>caching</i>; we're caching this time.",
            researchedMessage:
                "Decided to split up kelp and sponge into many groups, hopefully attracting more sea apples and evenly consuming algae that way.",
            effectDesc:
                "We're twice as effective at finding sea apples on kelp, and sponges grow and consume twice as fast. Organization is the future.",
            cost: {
                sand: 2500000,
                porite: 50000,
            },
            required: {
                upgrades: ["secretSmithing"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                    sponge: 2,
                },
            },
        },
        ventFunneling: {
            name: "Vent Funneling",
            desc: "The vents spew stuff all over the place, making it hard to collect things from them. Maybe we could construct a way to condense, or at least aim, the stuff coming out?",
            researchedMessage: "Porite can resist the heat of the smaller vents, so we've built tubes to make their output less all-over-the-place.",
            effectDesc: `We are 3 times more effective at collecting resources from the vents, but also, we're 500 times better at collecting sand from them. It all collects into a neat little pile.`,
            cost: {
                porite: 50000,
            },
            required: {
                upgrades: ["passivePores"],
            },
            effect: {
                sandMultiplier: {
                    world: 500,
                },
                kelpMultiplier: {
                    world: 3,
                },
            },
        }, */

        /* culturalCoalescence: {
            name: "Cultural Coalescence",
            desc: "Despite our rich working relationship, we have a poor understanding of shrimp society.",
            researchedMessage: "The shrimp gave us all lessons in how their society functions, held thrice weekly.",
            effectDesc:
                "Shrimp and shrimp queens are twice as effective. Fun fact: the king has lived for a very, very long time. Nobody quite knows how.",
            cost: {
                science: 2000000,
                porite: 5000000,
            },
            required: {
                upgrades: ["superShovels"],
            },
            effect: {
                incomeMultiplier: {
                    shrimp: 2,
                    queen: 2,
                },
            },
        },
        centralizedVentSystem: {
            name: "Centralized Venting System",
            desc: "It's about time we finished organizing this loosely-tied-together vent operation.",
            researchedMessage:
                "By building even more tubes, we have centralized our vents' output to a single area, greatly improving efficiency of extraction and sorting!",
            effectDesc:
                "Now that all the resources end up in one convenient location, we take advantage our vents' production 3 times more efficiently.",
            cost: {
                science: 2000000,
                porite: 5000000,
            },
            required: {
                upgrades: ["ventFunneling", "superShovels"],
            },
            effect: {
                incomeMultiplier: {
                    world: 3,
                },
            },
        }, */

        /*         speedySponges: {
            name: "Speedy Sponges",
            desc: "The algae acolytes have an idea.",
            researchedMessage: "We have no idea what they did, but it worked.",
            effectDesc: "Sponges reproduce 4 times faster. The acolytes won't tell us how they did it. They keep secrets from us now.",
            cost: {
                science: 15000000,
                porite: 100000000,
            },
            required: {
                upgrades: ["algaeAcolytes"],
            },
            effect: {
                incomeMultiplier: {
                    sponge: 4,
                },
            },
        },
        superiorSmelting: {
            name: "Superior Smelting",
            desc: "We think we have a way to improve the process of creating porite.",
            researchedMessage:
                "By preparing and exercising more control over the smelting process, we have lowered the sand requirement significantly.",
            effectDesc:
                "Porite needs 10 times less sand to be made. I knew our process before was bad, but I didn't think it had THAT MUCH room for improvement...",
            cost: {
                science: 15000000,
                porite: 100000000,
            },
            required: {
                upgrades: ["algaeAcolytes"],
            },
        },
        inventiveIndustry: {
            name: "Inventive Industry",
            desc: "Shrimp industry is booming! Others, not so much.",
            researchedMessage: "Division of resources is necessary for a stable economy. ",
            effectDesc:
                "Crabs, rays, ray makers, crab broods, times 8. Putting resources toward our non-shrimp members has paved the way for universal prosperity.",
            cost: {
                science: 100000000,
                porite: 500000000,
            },
            required: {
                upgrades: ["speedySponges"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 8,
                    ray: 8,
                    maker: 8,
                    brood: 8,
                },
            },
        },
        treatiesOfSustainability: {
            name: "Treaties Of Sustainability",
            desc: "To convince the king of our honesty, we will need to do a lot of thinking.",
            researchedMessage: "The king is wary of our progress. He questions if our use of the vents is healthy for other sea life.",
            effectDesc:
                "We need to suck up to the king if we want the gate activated, so that's what we'll deign to do. In the meantime, times 8 to crabs, rays, ray makers, and broods.",
            cost: {
                science: 1e11,
            },
            required: {
                upgrades: ["consistentCommunication"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 8,
                    ray: 8,
                    maker: 8,
                    brood: 8,
                },
            },
        }, */
    },
    tempestuous: {
        statsDiscovery: {
            name: "A Cave",
            desc: "You spot a cave.",
            researchedMessage: "Finally, some rest.",
            effectDesc:
                "Found a place to stay that's not being assaulted by horrible wind. The frenzy can make short trips outside without much risk.",
            cost: {
                fish: 500,
            },
            required: {},
            events: ["tempestuousFindCave"],
        },
        crystalBite: {
            name: "Crystal Bite-Gear",
            desc: "Bite the crystals we have into something to help biting!",
            researchedMessage: "Weird teeth-wear has been developed, and sharks can now catch fish better as a result.",
            effectDesc: "Sharks are twice as effective with their new biting gear. Turns out they work better outside the mouth!",
            cost: {
                science: 50,
                fish: 10,
                crystal: 5,
            },
            required: {
                seen: ["science"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        cavernousContact: {
            name: "Cavernous Contact",
            desc: "The scientists have reported noises from the dark backside of the cave.",
            researchedMessage: "Found weird long-nose fish. Long, pointy noses... It was an awkward first encounter.",
            effectDesc: "Billfish can be recruited to brave the storm for more fish.",
            cost: {
                science: 50,
                fish: 250,
            },
            required: {
                upgrades: ["crystalBite"],
            },
        },
        crystalSpade: {
            name: "Crystal Spades",
            desc: "Fashion strange harness-tools for the rays.",
            researchedMessage: "The rays can now bother the sand more effectively, and dig up more sand now!",
            effectDesc: "Rays are twice as effective with their specially adapted digging tools.",
            cost: {
                science: 50,
                sand: 500,
                crystal: 5,
            },
            required: {
                seen: ["science"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crystalContainer: {
            name: "Crystal Containers",
            desc: "Make weird bottle things from the crystals we have. Maybe useful??",
            researchedMessage: "Well, things can go into these containers that aren't water. This makes science easier!",
            effectDesc: "Scientists are twice as effective at making with the science.",
            cost: {
                science: 100,
                crystal: 50,
            },
            required: {
                seen: ["science"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        crystalSpear: {
            name: "Crystal Spear",
            desc: "Our spear-wielding friends could use an upgrade.",
            researchedMessage: "We've designed various pointy implements for billfish to use. A sharper slash is a better slash.",
            effectDesc: "Billfish catch fish two and a half times faster thanks to a diversified toolset.",
            cost: {
                science: 125,
                fish: 1000,
                crystal: 25,
            },
            required: {
                upgrades: ["cavernousContact"],
                seen: ["billfish"],
            },
            effect: {
                incomeMultiplier: {
                    billfish: 2.5,
                },
            },
        },
        seabedGeology: {
            name: "Seabed Geology",
            desc: "The billfish have volunteered to survey the seafloor for us. It's a risky mission, but it's a necessary one.",
            researchedMessage:
                "They came back with a bunch of weird stuff, but were particularly happy about 'seagrass'. They say it will come in handy.",
            effectDesc: "Rays are twice as effective with their understanding of the seabed and its varieties of sediment. Also got seagrass. Yay?",
            cost: {
                science: 250,
                sand: 750,
            },
            required: {
                upgrades: ["cavernousContact", "crystalContainer"],
                seen: ["billfish"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
            events: ["tempestuousGiveSeagrass"],
        },
        underwaterChemistry: {
            name: "Underwater Chemistry",
            desc: "With the weird bottles, we can now put things and other things into them and see what happens.",
            researchedMessage: "Well, nothing useful was determined, but if we keep on doing it we make tremendous leaps for science!",
            effectDesc: "Scientists are twice as effective with their new chemical insights.",
            cost: {
                science: 250,
                crystal: 50,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        sandbagging: {
            name: "Sandbagging",
            desc: "If crabs venture out too far, they risk getting lost. The billfish have a suggestion.",
            researchedMessage: "The billfish showed us how to tie seagrass into bundles. By filling them with sand, we can weigh down crabs!",
            effectDesc: "We can equip crabs with sandbags to make them into stormgoers. They can venture much farther from the cave.",
            cost: {
                science: 500,
                sand: 5000,
                seagrass: 10,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        xenobiology: {
            name: "Xenobiology",
            desc: "This seagrass stuff is mostly just green or whatever, but what are these THINGS growing on it?",
            researchedMessage: "Flowers! What does that even mean!? Further research required. It could be such a benefit for science!",
            effectDesc: "We can now dissect seagrass flowers to further the cause of science.",
            cost: {
                science: 1250,
                seagrass: 500,
            },
            required: {
                upgrades: ["sandbagging"],
                seen: ["stormgoer"],
            },
        },
        biology: {
            name: "Biologia",
            desc: "O que é um tubarão? O que tem dentro de um tubarão, além de muitos peixes?",
            researchedMessage: "Com uma nova compreensão da própria biologia, tubarões agora podem se especializar em montar novos tubarões.",
            effectDesc:
                "Tubarões produzem duas vezes mais e tubarões enfermeiros podem ser treinados. Você sabia que ovos de tubarão não aparecem apenas porque um tubarão pediu muito a Papai do Céu?",
            cost: {
                science: 3250,
            },
            required: {
                upgrades: ["xenobiology"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or tear up grass. What is even up with that? What ARE crabs??",
            researchedMessage:
                "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
            effectDesc:
                "Crabs and crab stormgoers are four and two times as effective, respectively, and crab broods are available. Crabs are alright but they are also sort of terrifying and weird. Good thing they're on our side!",
            cost: {
                science: 3500,
                seagrass: 1750,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    stormgoer: 2,
                },
            },
        },
        billfishBiology: {
            name: "Billfish Biology",
            desc: "We still don't know much about our lance-wielding friends. They zip around in the water and slash at stuff, but what are they REALLY?",
            researchedMessage:
                "We refuse to accept the narrative the billfish are pushing on us, but the scientists are adamant. They say they are literally just fish with big noses.",
            effectDesc:
                "Billfish are four times more effective, and billfish pairs are available. I swear, our scientists must be losing it - these things are not fish, surely.",
            cost: {
                science: 4000,
                fish: 20000,
            },
            required: {
                upgrades: ["biology"],
                seen: ["billfish"],
            },
            effect: {
                incomeMultiplier: {
                    billfish: 4,
                },
            },
        },
        rayBiology: {
            name: "Ray Biology",
            desc: "Though kindred to the sharks, we know so little about the rays. If only we could fix this. We need to bait a sand trap.",
            researchedMessage:
                "Apparently we could have just asked. We learned how rays make more rays. It's kinda similar to sharks, really, but rays.",
            effectDesc:
                "Rays are four times as effective, and ray makers are available. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 8000,
                sand: 25000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 4,
                },
            },
        },
        thermalVents: {
            name: "Thermal Vents",
            desc: "Investigate the boiling vents that just seem to keep on heating things up.",
            researchedMessage: "This is a wondrous, unending source of heat! Something good must come from this.",
            effectDesc: "A power source for future technologies has been discovered.",
            cost: {
                science: 10000,
                sand: 40000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {
            name: "Laser Rays",
            desc: "Using arcane shark mystery science, capture the heat of the vents for use by rays.",
            researchedMessage: "The rays can now be granted gear that will let them fuse sand into crystal! Future!",
            effectDesc: "Laser rays can now be geared up to burn the very sand to glassy crystal.",
            cost: {
                science: 1000,
                sand: 20000,
                crystal: 100,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        heavySifting: {
            name: "Heavy Sifting",
            desc: "The billfish have pointed out that our method of sandbagging could still use a little work.",
            researchedMessage:
                "The billfish showed us their seagrass sifters, and we helped them build more. Now we filter the heaviest sand for sandbagging, and leave the rest for smelting!",
            effectDesc:
                "Stormgoers cost 75% less sand, rays are 4 times as effective at picking up sand, and laser rays are 8 times better at fusing it. We have so, so much to learn about sand...",
            cost: {
                science: 35000,
                seagrass: 15000,
            },
            required: {
                upgrades: ["crabBiology", "laserRays"],
            },
            effect: {
                sandMultiplier: {
                    ray: 4,
                },
                incomeBoost: {
                    laser: 8,
                },
            },
            customEffect(background) {
                return `${sharktext.getResourceName("stormgoer", false, 2, background)} cost 75% less ${sharktext.getResourceName(
                    "sand",
                    false,
                    2,
                    background,
                )}`;
            },
        },
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage:
                "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts. But the plants seem to like it.",
            effectDesc:
                "Stormgoers and scientists are four times as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 50000,
            },
            required: {
                upgrades: ["crabBiology"],
            },
            effect: {
                incomeMultiplier: {
                    stormgoer: 4,
                    scientist: 4,
                },
            },
        },
        magicBottles: {
            name: "Magic Bottles",
            desc: "The billfish have found something very, very strange outside: bottles full of wind!",
            researchedMessage: "With enough study, we were finally able to reproduce them. Now the question is, what to do with them?",
            effectDesc: "We can now make magic bottles that spew endless wind. Further study is DEFINITELY required.",
            cost: {
                science: 250000,
                crystal: 20000,
            },
            required: {
                upgrades: ["xenobiology", "crystalSpear"],
            },
        },
        powerfulPropulsion: {
            name: "Powerful Propulsion",
            desc: "We have no idea what's out there. If only we could find a way to fight the storm...",
            researchedMessage:
                "Eureca! Using our newly-made magic bottles, we've devised a mechanism that can turn billfish into high-speed explorers!",
            effectDesc:
                "Bottles and an elaborate system of pulleys to operate them can make billfish into explorers. It's time to go see what's out there.",
            cost: {
                seagrass: 300000,
                crystal: 2500,
            },
            required: {
                upgrades: ["magicBottles"],
            },
        },
        senseOfDirection: {
            name: "Sense of Direction",
            desc: "Just because we can move in the storm does not mean we can get anything done in it.",
            researchedMessage: "Our scientists have devised a method of charting that should help us stay oriented. No more getting lost! Maybe!",
            effectDesc:
                "Explorers are five times as effective and scientists are 32 times as effective - and as a bonus, we can actually read the maps now!",
            cost: {
                science: 500000,
                chart: 80,
            },
            required: {
                seen: ["chart"],
                upgrades: ["sunObservation", "powerfulPropulsion"],
            },
            effect: {
                incomeMultiplier: {
                    billfishExplorer: 5,
                    scientist: 32,
                },
            },
        },
        laserLenses: {
            name: "Laser Lenses",
            desc: "Some ray 'accidentally' shot through a bottle with a laser, and we noticed that the point of impact was distorted... Maybe this is useful.",
            researchedMessage: "It turns out that a more focused beam is also a hotter beam. And hotter probably equals better.",
            effectDesc:
                "Thanks to more focused beams, laser rays need a lot less equipment to start smelting. We shall call this new field of science 'sharkoptics!' Okay, no, we won't.",
            cost: {
                science: 1000000,
                crystal: 25000,
            },
            required: {
                upgrades: ["powerfulPropulsion"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("laser", false, 2, background)} cost 80% less ${sharktext.getResourceName(
                    "crystal",
                    false,
                    2,
                    background,
                )}`;
            },
        },
        crystalClippers: {
            name: "Crystal Clippers",
            desc: "How did we not think of this sooner?",
            researchedMessage: "Crystal clippers deployed. The stormgoers rejoice.",
            effectDesc: "Stormgoers are three times as effective at picking up seagrass thanks to actual tools.",
            cost: {
                science: 1000000,
                crystal: 50000,
            },
            required: {
                upgrades: ["senseOfDirection"],
            },
            effect: {
                incomeMultiplier: {
                    stormgoer: 3,
                },
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of vents, grass, and more empty space! There's really not much out here.",
            effectDesc: "Explorers are four times as effective and scientists are twice as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 5000000,
                fish: 2000000,
            },
            required: {
                upgrades: ["senseOfDirection"],
            },
            effect: {
                incomeMultiplier: {
                    billfishExplorer: 4,
                    scientist: 2,
                },
            },
        },
        routing: {
            name: "Routing",
            desc: "We can't see a complete picture yet, be we have just enough that we can see all the best paths to take.",
            researchedMessage:
                "Using the charts we currently have, we've developed a system for moving explorers around with optimal pacing and distribution.",
            effectDesc:
                "Explorers are twice as effective and scientists are four times as effective. So long as everyone follows their instructions. (we can hope)",
            cost: {
                science: 5000000,
                chart: 2500,
            },
            required: {
                upgrades: ["senseOfDirection"],
            },
            effect: {
                incomeMultiplier: {
                    billfishExplorer: 2,
                    scientist: 4,
                },
            },
        },
        heatHarnesses: {
            name: "Heat Harnesses",
            desc: "We've found a lot of vents, but we can't really use them since they're so far away. The billfish point out that crystals retain heat.",
            researchedMessage: "Crystal vests! Remarkable! If we can't go to the heat, we'll just bring the heat to us!",
            effectDesc:
                "Laser rays operate eight times as fast. The heat harnesses will harness heat. Then we will harness heat harness heat to heat things.",
            cost: {
                science: 25000000,
                crystal: 175000,
            },
            required: {
                upgrades: ["laserLenses"],
            },
            effect: {
                incomeMultiplier: {
                    laser: 8,
                },
            },
        },
        superclippers: {
            name: "Superclippers",
            desc: "Bigger.",
            researchedMessage:
                "After a few failed designs (too small), we have landed on a comically sized pair of scissors that will surely increase productivity.",
            effectDesc: "Stormgoers clip eight times as much seagrass. You should have seen the look on their faces.",
            cost: {
                science: 75000000,
                crystal: 1000000,
            },
            required: {
                upgrades: ["crystalClippers"],
            },
            effect: {
                incomeMultiplier: {
                    stormgoer: 8,
                },
            },
        },
        farExploration: {
            name: "Far Exploration",
            desc: "Explore the vast reaches beyond the home ocean.",
            researchedMessage: "Mostly nothing still. But we're not done yet.",
            effectDesc: "Explorers are eight times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 125000000,
                fish: 2500000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    billfishExplorer: 8,
                },
            },
        },
        universalNavigation: {
            name: "Universal Navigation",
            desc: "With an even bigger view of the world, we need to re-examine our routing techniques.",
            researchedMessage: "This is getting complicated, though we doubt the billfish will struggle with these new instructions.",
            effectDesc: "Explorers are eight times as effective. One way or another, we will uncover the secrets of this world.",
            cost: {
                chart: 50000,
            },
            required: {
                upgrades: ["routing"],
            },
            effect: {
                incomeMultiplier: {
                    billfishExplorer: 8,
                },
            },
        },
        cartographicCompleteness: {
            name: "Cartographic Completeness",
            desc: "Once we've charted enough of the world, we can assemble the pieces into a map.",
            researchedMessage: "We've done it! The grand map is assembled, and...what's that? You found something?",
            effectDesc:
                "All explorers have been dismissed and all charts have been assembled into a single super-map. Nothing else to find, I guess.",
            cost: {
                chart: 1000000,
            },
            required: {
                upgrades: ["powerfulPropulsion"],
                seen: ["chart"],
            },
            customEffect(background) {
                return `1 ${sharktext.getResourceName("map", false, 1, background)}`;
            },
        },
        theExpedition: {
            name: "The Expedition",
            desc: "This is it. That door is the key to everything, I just know it.",
            researchedMessage:
                "We've discovered the giant weather machine making the superstorm. If we want to stop the storm, we'll need to start by understanding this facility.",
            effectDesc:
                "Moved our base of operations to the inside of the weather machine. We'll have to find a way to shut it down from the inside.",
            cost: {
                science: 2e8,
                fish: 5000000,
            },
            required: {
                upgrades: ["cartographicCompleteness"],
            },
        },
        supernaturalSeagrass: {
            name: "Supernatural Seagrass",
            desc: "The stormgoer crabs have adjourned a meeting discussing the new seagrass in this area. They tell us there's something off about it.",
            researchedMessage: "Indeed, something's strange; this seagrass is immune to undersea currents! MUCH more study is required.",
            effectDesc: "Studying seagrass now gives 10 times the science that it used to. MAGIC SUPER SCIENCE, GO!",
            cost: {
                seagrass: 50000000,
            },
            required: {
                upgrades: ["theExpedition"],
            },
            customEffect(background) {
                return `${sharktext.getResourceName("science", false, 1, background)} from ${sharktext.getResourceName(
                    "seagrass",
                    false,
                    1,
                    background,
                )} ×10`;
            },
        },
        secretStudies: {
            name: "Secret Studies",
            desc: "This place is BRIMMING with the weirdest stuff. The scientists seem especially interested in 'documents.' What?",
            researchedMessage:
                "Our scientists, with the help of the billfish, have learned to interpret these strange things. Perhaps we can learn something?",
            effectDesc: "Learned to read these so-called 'documents.' What are the scientists so riled up about? Are they magic or something?",
            cost: {
                science: 3.5e8,
            },
            required: {
                upgrades: ["theExpedition"],
            },
        },
        transmutation: {
            name: "Transmutation",
            desc: "The documents in this place contain the recipe for a strange, new material. If we want to understand the machine, we should probably start here.",
            researchedMessage: "Huzzah! We've replicated this strange material, and named after the first synthesizer, Dr. Sharkonium!",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 4e8,
                crystal: 5000000,
                sand: 10000000,
            },
            required: {
                upgrades: ["secretStudies"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Our documents say we can use sharkonium to do things so we dont have to do the things!",
            researchedMessage:
                "Now we don't have to do all the work - well, mostly. One of these schematics doesn't work because of the winds... Otherwise, FUTURE!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                sharkonium: 750000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        sharkoniumReceptors: {
            name: "Sharkonium Receptors",
            desc: "Using our new miracle material, we believe we can enhance the lasers that our rays work with.",
            researchedMessage:
                "Upgraded laser containers can withstand a higher temperature with a more intense beam. Powering up, please stand by...",
            effectDesc: "Laser rays are twice as efficient. It's that whole 'hotter equals better' thing again.",
            cost: {
                science: 7.5e8,
                sharkonium: 1e6,
            },
            required: {
                upgrades: ["transmutation"],
            },
            effect: {
                incomeBoost: {
                    laser: 2,
                },
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines suck, but we're not sure how to make them much better.",
            researchedMessage: "After some intense studying, the billfish have volunteered to help us run the machines!",
            effectDesc: "Billfish mechanics can now tinker with machines to keep them running optimally! Auto-transmuters are also possible now.",
            cost: {
                science: 1e9,
                sharkonium: 5e6,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "sandDigger"],
            },
            effect: {},
        },
        heatCoils: {
            name: "Heat Coils",
            desc: "The bowels of the machine contain numerous parts that act like hydrothermal vents.",
            researchedMessage:
                "Specialized coupling instruments have given us a method for extracting heat - and maybe this does something to the weather machine, who knows!",
            effectDesc:
                "Laser rays transmute four times as fast, and let me tell you, having the heat right next to us is sooooooo much better than across the ocean.",
            cost: {
                science: 1.25e9,
                sand: 1.5e8,
            },
            required: {
                upgrades: ["sharkoniumReceptors"],
            },
            effect: {
                incomeMultiplier: {
                    laser: 16,
                },
            },
        },
        internalExploration: {
            name: "Internal Exploration",
            desc: "Our documents tell us an important piece of the puzzle lies deep inside the facility.",
            researchedMessage:
                "The maps led us to a massive generator that's been completely destroyed, and a strange, malfunctioning gate. We don't yet know what this means for us.",
            effectDesc: "Mechanics are five times as effective at tinkering. We now also know that the facility has no power.",
            cost: {
                science: 2e9,
            },
            required: {
                upgrades: ["engineering"],
            },
            events: ["tempestuousInternalExploration"],
            customEffect(background) {
                return `${sharktext.getResourceName("billfishMechanic", false, 1, background)} impact ×5`;
            },
        },
        recyclerDiscovery: {
            name: "Recycler",
            desc: "Devise a system of pulverising unwanted resources into a component paste, and reusing them as something else.",
            researchedMessage:
                "Well this thing is frankly terrifying. I wouldn't swim anywhere near the input holes if I were you. Maybe it'll help though!",
            effectDesc: "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future?",
            cost: {
                science: 4e9,
                sharkonium: 2.5e7,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "Our billfish friends are naturals at this. They have organized a committee to suggest an improved set of designs.",
            researchedMessage:
                "Eureca! These new designs are brilliant, I think! I can't understand what's going on anymore! Half of what they said has gone over our heads.",
            effectDesc: "All shark machines run four times as fast, but now laser rays now run 4 times faster too. Yay!",
            cost: {
                science: 8e9,
                sharkonium: 4e8,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    fishMachine: 4,
                    sandDigger: 4,
                    autoTransmuter: 4,
                    laser: 4,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc: "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureca! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 100 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 12e9,
                junk: 1e9,
            },
            required: {
                upgrades: ["recyclerDiscovery"],
            },
        },
        schematicSalvaging: {
            name: "Schematic Salvaging",
            desc: "Among the documents we found in the generator room is the disorganized, scattered operator's manual. It's in our best interest to put it back together.",
            researchedMessage:
                "The manual, right here, it says that the machine goes haywire when it runs out of power! So we don't need to shut it down, we need to <i>turn it on!</i>",
            effectDesc:
                "With the power off, everything's caught in a magical feedback loop. We fix this place, we fix the world. Who would build such a dangerous machine?",
            cost: {
                science: 17.5e9,
            },
            required: {
                upgrades: ["internalExploration"],
            },
        },
        supernaturalHarvest: {
            name: "Supernatural Harvest",
            desc: "There's magic inside this grass, surely.",
            researchedMessage: "Indeed, there is! But we have no idea how to use it. So we'll just wrap stuff in it and hope for the best.",
            effectDesc: "New, magic sandbags make stormgoers 99 times better at harvesting stuff. We genuinely have no idea! It just works.",
            cost: {
                seagrass: 4e9,
            },
            required: {
                upgrades: ["supernaturalSeagrass", "internalExploration"],
            },
            effect: {
                incomeMultiplier: {
                    stormgoer: 99,
                },
            },
        },
        cumulusControl: {
            name: "Cumulus Control",
            desc: "Let's put an end to this madness. If we power up the facility, it should finally stop the storm.",
            researchedMessage:
                "As the lights flicker on, an intense feeling of relief washes over you. You can sense it. The storm has stopped...and the gate is open.",
            effectDesc:
                "The billfish are swimming wildly outside. Their frenzied cheering makes anything you try to say inaudible. From one storm, and into the next...",
            cost: {
                science: 4e12,
            },
            required: {
                upgrades: ["schematicSalvaging", "iterativeDesign"],
            },
        },
    },
};
