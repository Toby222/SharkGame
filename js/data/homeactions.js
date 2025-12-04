"use strict";
SharkGame.HomeActions = {
    generated: {},

    getActionTable(worldType = world.worldType) {
        if (typeof SharkGame.HomeActions[worldType] !== "object" || worldType === "generated") {
            worldType = "default";
        }

        if (!_.has(SharkGame.HomeActions.generated, worldType)) {
            return (SharkGame.HomeActions.generated[worldType] = SharkGame.HomeActions.generateActionTable(worldType));
        } else {
            return SharkGame.HomeActions.generated[worldType];
        }
    },

    getActionData(table, actionName) {
        // probably find a way to forego the clonedeep here, but the performance impact seems negligible.
        const data = _.cloneDeep(table[actionName]);

        if (data) {
            if (cad.actionPriceModifier !== 1) {
                _.each(data.cost, (costData) => {
                    costData.priceIncrease *= cad.actionPriceModifier;
                });
            }

            if (home.getActionCategory(actionName) === "frenzy") {
                _.each(data.cost, (costData) => {
                    costData.priceIncrease *= 0.5 ** SharkGame.Aspects.thePlan.level;
                });
            }
        }

        return data;
    },

    generateActionTable(worldType = world.worldType) {
        const defaultActions = SharkGame.MiscUtil.cloneDeep(SharkGame.HomeActions.default);

        if (!_.has(SharkGame.HomeActions, worldType)) {
            return defaultActions;
        }

        /** @type {Record<HomeActionName, HomeAction>} */
        const finalTable = {};
        const worldActions = SharkGame.MiscUtil.cloneDeep(SharkGame.HomeActions[worldType]);

        // _.has
        _.each(Reflect.ownKeys(worldActions), (actionName) => {
            if (!_.has(defaultActions, actionName)) {
                finalTable[actionName] = worldActions[actionName];
            } else {
                finalTable[actionName] = {};

                Object.defineProperties(
                    finalTable[actionName],
                    Object.getOwnPropertyDescriptors(worldActions[actionName]),
                );

                const defaultPropertiesToDefine = _.pickBy(
                    Object.getOwnPropertyDescriptors(defaultActions[actionName]),
                    (_propertyDescriptor, propertyName) => {
                        return !_.has(finalTable, [actionName, propertyName]);
                    },
                );

                Object.defineProperties(finalTable[actionName], defaultPropertiesToDefine);
            }
        });

        return finalTable;
    },

    // something new to keep in mind:
    // the new system for keeping home actions in check at huge numbers doesn't work if the price increase isn't a whole number
    // so fractional costs are banned now
    // that's not a big deal anyways though, just multiply some numbers around to make the equivalent balance work out in the end with a non-fractional cost

    default: {
        // FREEBIES ////////////////////////////////////////////////////////////////////////////////

        catchFish: {
            name: "Caçar peixe",
            effect: {
                resource: {
                    get fish() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {},
            outcomes: [
                "Pegou um peixe à milanesa... Espera, quê?",
                "Pegou um peixe bola gato.",
                "Você pegou um peixe, parabéns!",
                "Você venceu o jogo!",
                "Peixe.",
                "Pegou um tubarão. Espera aí... Não, esquece, não era um tubarão.",
                "Pegou uma anchova.",
                "Pegou um peixe-gato.",
                "Pegou um linguado.",
                "Pegou um eglefim.",
                "Pegou um arenque",
                "Pegou uma cavalinha.",
                "Pegou uma tainha.",
                "Pegou tainha, vinho e muito .",
                "Pegou uma perca.",
                "Pegou um namorado.",
                "Pegou um salmão.",
                "Pegou uma sardinha.",
                "Pegou um pirarucu.",
                "Pegou uma tilápia.",
                "Pegou uma truta.",
                "Pegou um sável.",
                "Pegou um lobo-do-mar.",
                "Pegou uma carpa.",
                "Pegou um bacalhau.",
                "Pegou um halibute.",
                "Pegou um mahi mahi.",
                "Pegou um tamboril.",
                "Pegou uma piranha.",
                "Pegou um pargo.",
                "Pegou um cirurgião-patela.",
                "Pegou uma garoupa.",
                "Pegou um badejo.",
                "Pegou uma albacora.",
                "Pegou um marlim.",
                "Pegou um peixe-relógio.",
                "Pegou um peixe-palhaço.",
                "Pegou um pirá.",
                "Pegou um atum.",
                "Pegou uma barracuda.",
                "Pegou um peixinho dourado.",
                "Pegou o Peixonauta",
            ],
            helpText: "Use os seus instintos de tubarão para caçar um peixe.",
        },

        debugbutton: {
            name: "Cousas de debuggar",
            effect: {
                resource: {
                    fish: 10000000,
                    crystal: 10000000,
                    sharkonium: 100000000,
                    sand: 100000000,
                    kelp: 100000000,
                    science: 1000000000,
                    shark: 10000,
                },
            },
            cost: {},
            prereq: {
                // no prereqs
            },
            outcomes: [
                "Testando, testando. Ei! Oi! Som! Conseguem me ouvir?",
                "Bugs detectados.",
                "Legal... Isso não está funcionando.",
                "Resultados interessantes por aqui.",
                "A gift from the developer.",
                "Espero que você esteja testando algo.",
                "Nada disso deveria ser acessível para um jogador normal.",
                "Ladrão.",
                "Ladrãozinho.",
                "Olha só. Só o anonimos online a essa hora da noite.",
                "Esse é o horário buggado.",
            ],
            helpText: "Use os seus instintos de desenvolvedor para caçar um bug.",
            unauthorized: true,
        },

        prySponge: {
            name: "Arrancar esponja",
            effect: {
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["spongeCollection"],
                notWorlds: ["stone"],
            },
            outcomes: [
                "Tirou uma esponja das pedras. Ele nos chamou para caçar água-vivas.",
                "Tirou uma esponja-lacunosa das pedras.",
                "Tirou uma esponja tão suja que nem conseguimos identificar das pedras.",
                "Tirou uma esponja bola-da-morte das pedras.",
                "Tirou uma esponja-tubo-púrpura das pedras.",
                "Tirou uma esponja de cozinha das pedras... Eca, tem pedaço de comida colado",
                "Tirou uma esponja-rim das pedras.",
                "Tirou uma esponja calcária das pedras.",
                "Tirou uma esponja-pele-de-galinha das pedras.",
                "Tirou uma esponja-carnuda das pedras.",
                "Tirou uma esponja-couro das pedras.",
                "Tirou uma esponja-perfurante-amarela das pedras.",
                "Tirou uma esponja-perfurante-verde das pedras.",
                "Tirou uma esponja-de-fuso das pedras.",
                "Tirou uma esponja-cratera das pedras.",
                "Tirou uma esponja-árvore das pedras.",
                "Tirou uma laranja-do-mar das pedras.",
                "Tirou uma esponja 'Puffball' laranja das pedras.",
                "Tirou uma esponja-cratera-vermelha das pedras..",
                "Tirou uma orelha-de-elefante das pedras.",
                "Tirou uma esponja-amarela das pedras.",
                "Tirou uma esponja-de-fibra das pedras.",
                "Tirou uma esponja-barril-gigante das pedras.",
            ],
            helpText: "Retire uma esponja colada nas pedras para eventual uso.",
        },

        getClam: {
            name: "Coletar mexilhão",
            effect: {
                resource: {
                    get clam() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Conseguiu um mexilhão-galego.",
                "Conseguiu um mexilhão-azul",
                "Conseguiu um mexilhão-chileno.",
                "Conseguiu o Mexilhãozinho. Ele será útil para lutar contra O MAL.",
                "Conseguiu um mexilhão-dourado.",
                "Conseguiu um mexilhão-verde.",
                "Conseguiu um mexilhão-zebra.",
                "Conseguiu um mexilhão-pérola.",
                "Conseguiu uma amêijoa-fina.",
                "Conseguiu um mexilhão-falso. Mentiroso.",
                "Conseguiu um mexilhão-da-califórnia.",
                "Conseguiu um mexilhão-da-coreia.",
                "Conseguiu uma amêijoa-asiática.",
                "Conseguiu uma amêijoa-japonesa.",
                "Conseguiu uma amêijoa-babosa.",
                "Conseguiu uma amêijoa-mercenária.",
                "Conseguiu uma sarnabi.",
                "Conseguiu um mexilhão-Rabbitsfoot.",
                "Conseguiu um mexilhão-Snuffbox.",
                "Conseguiu uma amêijoa-boa.",
                "Conseguiu uma amêijoa-gigante.",
            ],
            helpText: "Pegue um mexilhão. Para que vamos usá-lo? Sei lá, mano, deixa de encheção.",
        },

        getJellyfish: {
            name: "Pegue uma água-viva",
            effect: {
                resource: {
                    get jellyfish() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["jellyfishHunting"],
            },
            outcomes: [
                "Pegou uma água-viva coroada.",
                "Pegou uma água-viva de cristal.",
                "Pegou uma água-viva do Mediterrâneo.",
                "Pegou uma urtiga do Mar Negro.",
                "Pegou uma caravela Portuguesa.",
                "Pegou uma água-viva juba de leão.",
                "Pegou uma água-viva de pente.",
                "Pegou uma água-viva lua.",
                "Pegou uma água-viva caixa australiana.",
                "Pegou uma medusa ovalis.",
                "Pegou uma água-viva malasa.",
                "Pegou uma vespa-do-mar.",
                "Pegou uma água-viva de pérola.",
                "Pegou uma água-viva canhota.",
                "Pegou uma água-viva flor.",
                "Pegou uma medusa irukandji.",
                "Pegou uma água-viva geléia de cristal.",
                "Pegou uma água-viva azul.",
                "Uma água-viva te pegou. Ai!",
                "Pegou uma água-viva de fogo.",
                "Pegou uma água-viva de mancha branca.",
                "Pegou uma água-viva crina de cavalo.",
                "Pegou uma medusa imortal.",
                "Pegou uma medusa-de-riscas-púrpuras.",
                "Pegou uma medusa compasso.",
                "Pegou um botão-azul.",
                "Pegou uma medusa coroa.",
                "Pegou uma água-viva riscada.",
            ],
            helpText: "Arrisque sua integridade física ao caçar águas-vivas sob ameaça de choque.",
        },

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            name: "Estudar holotúrias",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "seaApple", costFunction: "constant", priceIncrease: 1 }],
            max: "seaApple",
            prereq: {
                resource: {
                    seaApple: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "E se essas coisas forem feitas de ciência?",
                "A ciência foi avançada!",
                "Isso talvez tenha a chance de ser esclarecedor!",
                "Por que estamos fazendo isso? Ninguém sabe!",
                "Para que servem essas coisas? Por que eles são tão molengas? Eles estão se remexendo, que nojo!",
                "Resultados ainda inconclusivos! Para a surpresa de ninguém...",
                "Achamos um vale para 4 ciência em cada bicho dissecado.",
                "Passo 1: Holotúria. Passo 2: ??? Passo 3: Ciência!",
            ],
            helpText: "Disseque as holotúria que nossas algas atraem para conseguir ciência.",
        },

        /*
        "spongeToScience": {
            name: "Dissect sponge",
            effect: {
                resource: {
                    science: 1
                }
            },
            cost: [
                {resource: "sponge", costFunction: "constant", priceIncrease: 1}
            ],
            max: "sponge",
            prereq: {
                resource: {
                    sponge: 1
                },
                upgrade: [
                    "xenobiology"
                ]
            },
            outcomes: [
                "Squishy porous science!",
                "The sponge has been breached and the science is leaking out!",
                "This is the best use of a sponge. Teeth dissections are the best.",
                "Sponge is now so many shreds. But so much was learned!",
                "The sponge is apparently not a plant. Yet plants feel more sophisticated than these things."
            ],
            helpText: "Dissect sponges to learn their porous secrets. Science!"
        },
        */

        pearlConversion: {
            name: "Converter pérolas",
            effect: {
                resource: {
                    crystal: 1,
                },
            },
            cost: [
                { resource: "clam", costFunction: "constant", priceIncrease: 1 },
                { resource: "science", costFunction: "constant", priceIncrease: 4 },
            ],
            max: "clam",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["pearlConversion"],
            },
            outcomes: [
                "Pérolas para cristais! Algum dia, eu juro, algum dia nós conseguiremos usar apenas a pérola.",
                "Os cientistas celebraram transformarem pedras em cristais! Mas depois the olhar mais perto, eram mexilões, não pedras.",
                "Então, dessa vez conseguimos converter apenas as pérolas, mas... bem, tivemos que quebrar os mexilhões.",
                "Pérolas para cr... Droga. Mexilhões para cristais.",
                "Com cuidado... Com cuidado... Foi! Convertemos os mexilhões sem pérola em cristais!... espera, quê?",
                "Transformamos cristais em pérolas. Não, calma aí... Perdão, li errado, é o contrário.",
            ],
            helpText: "Transformar uma pérola (com os mexilhões em volta) em cristais.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {
            name: "Transmute coisas em tubarônio",
            effect: {
                resource: {
                    sharkonium: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "sharkonium",
            prereq: {
                upgrade: ["transmutation"],
            },
            outcomes: [
                "Transmutação com satisfação!",
                "Transmutação com perfeição!",
                "Transmogrificação com convicção!",
                "Transformação com ambição!",
                "Transição com dedicação!",
                "Transmute coisas em tubarônioguração com pegação! ...pera quê?",
                "Transmutação com educação!",
                "Tubarônio quentinho saindo do forno!",
                "Barras de tubarônio feitas!",
                "Mais tubarônio!",
                "A substância sem nome! Exceto pelo nome 'tubarônio'!",
                "Eu não sei como descrever tubarônio. Ele só parece tão estranho.",
                "O pilar de um cardume moderno!",
            ],
            helpText: "Converta simples recursos em tubarônio, o material do futuro!",
        },

        smeltCoralglass: {
            name: "Fundir vidro coroso",
            effect: {
                resource: {
                    coralglass: 1,
                },
            },
            cost: [
                { resource: "coral", costFunction: "constant", priceIncrease: 10 },
                { resource: "sand", costFunction: "constant", priceIncrease: 10 },
            ],
            max: "coralglass",
            prereq: {
                upgrade: ["coralglassSmelting"],
            },
            outcomes: [
                "Vidro coroso fundido!",
                "Vidro coroso f*****! Ai, mil perdões, saiu sem querer!",
                "Como que o coral se incorpora em vidro? Bem, é bem simples, as lagostas fazer funcionar.",
                "O pilar d- o exoesqueleto da indústria crustaceana!",
                "Tão frágil. Mas tão útil.",
            ],
            helpText: "Funda coisas para fazer o vidro especial das máquinas dos crustáceos!",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {
            name: "Recrutar tubarão",
            effect: {
                resource: {
                    shark: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 5 }],
            max: "shark",
            prereq: {
                resource: {
                    fish: 5,
                },
            },
            outcomes: [
                "Um tubarão touro se junta a você.",
                "Um tubarão duende se junta a você.",
                "Um tubarão crocodilo se junta a você.",
                "Um tubarão corre costa se junta a você.",
                "Um tubarão de pontas negras do recife se junta a você.",
                "Um tubarão galha branca oceânica se junta a você.",
                "Um tubarão elefante se junta a você.",
                "Um tubarão salmão se junta a você.",
                "Um tubarão galha preta se junta a você.",
                "Um tubarão das galápagos se junta a você.",
                "Um tubarão cabeça chata se junta a você",
                "Um tubarão cobre se junta a você.",
                "Um tubarão cinzento dos recifes se junta a você.",
                "Um tubarão de focinho preto se junta a você.",
                "Um tubarão leopardo se junta a você.",
                "Um tubarão negro se junta a você.",
                "Um tubarão vitamínico se junta a você.",
                "Um tubarão martelo se junta a você.",
                "Um tubarão baleia se junta a você.",
                "Um tubarão epaulette se junta a você.",
                "Um tubarão lixa se junta a você.",
                "Um cação anjo de asa curta se junta a você.",
                "Um anjo do leste africano se junta a você.",
                "Um cação viola se junta a você.",
                "Um tubarão tigre se junta a você.",
                "Um tubarão da Groelândia se junta a você.",
                "Um tubarão porco se junta a você.",
                "Um tubarão charuto se junta a você.",
                "Um tubarão limão se junta a você. ",
                "Um tubarão azul se junta a você.",
                "Um tubarão raposa de olho grande se junta a você.",
                "Uma gata lixa se junta a você.",
                "Um peixe-prego se junta a você.",
                "Um cação bruxa se junta a você.",
                "Uma cahnhabota olho grande se junta a você.",
                "Um tubarão mako se junta a você.",
                "Um tubarão albafar se junta a você.",
                "Um tubarão de sete guelras se junta a você. .",
                "Um tubarão cobra se junta a você.",
                "Um tubarão boca grande se junta a você.",
                "Um tubarão branco se junta a você.",
                "Um tubarão zebra se junta a você.",
            ],
            multiOutcomes: [
                "Um monte de tubarões se juntam a você",
                "Isso são vários tubarões.",
                "A comunidade tubarônica cresce!",
                "Mais tubarões! Mais tubarões! MAIS TUBARÕES!",
                "O povo clama pelos tubarões.",
                "Um cardume de tubarões! Sim, também se usa cardume para tubarões.",
                "Um aglomerado de tubarões!",
                "Um bando de tubarões!",
                "Uma manta de tubarões!",
                "Uma piracema de tubarões! Sim, isso está gramaticalmente correto.",
                "Um cobertor de tubarões! Eles esquentam mais que uma manta.",
            ],
            helpText: "Recrute um tubarão para caçar mais peixes.",
        },

        getManta: {
            name: "Contratar arraia",
            effect: {
                resource: {
                    ray: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "ray",
            prereq: {
                resource: {
                    shark: 5,
                },
            },
            outcomes: [
                "Esse moços realmente estão levantando muita areia!",
                "Uma raia-chita se junta a você.",
                "Uma raia-morcego se junta a você.",
                "Uma raia-borboleta se junta a você.",
                "Uma raia-manteiga se junta a você.",
                "Uma raia-de-pedra se junta a você.",
                "Uma raia-bico-de-remo se junta a você.",
                "Uma raia-viola se junta a você.",
                "Uma raia-viola-de-focinho-curto se junta a você.",
                "Uma raia-treme-treme se junta a você.",
                "Uma raia-viola-de-cunha se junta a você.",
                "Uma raia-viola-malhada se junta a você.",
                "Uma raia-guitarra-embocada se junta a você.",
                "Uma raia-viola-barba-negra se junta a você.",
                "Uma raia-viola-irvine se junta a você.",
                "Uma raia-guitarra comum se junta a você.",
                "Uma raia-de altura se junta a você.",
                "Uma raia-dormideira se junta a você.",
                "Uma tremelga-de-olhos se junta a você.",
                "Uma tremelga-roseta se junta a você.",
                "Uma tremolina de McKay se junta a você.",
                "Uma raia-de-dois-olhos se junta a você.",
                "Uma raia-manchada se junta a você.",
                "Uma uge-de-cardas se junta a você.",
                "Uma uge-margarida se junta a você.",
                "Uma uge-mata se junta a você.",
                "Um ratão se junta a você.",
                "Uma uge-borboleta se junta a você.",
                "Um ratão-leopardo se junta a você.",
                "Uma raia-chuco se junta a você.",
                "Uma raia-bispo se junta a você.",
                "Um gavião-do-mar se junta a você.",
                "Uma jamanta-oceânica se junta a você.",
                "Uma jamanta-de-recife se junta a você.",
                "Uma raia-amarela se junta a você.",
                "Uma raia-cobra se junta a você.",
                "Uma raia-espinho se junta a você.",
                "Uma raia-esculhacho se junta a você.",
                "Uma raia-sapo se junta a você.",
                "Uma raia-olho-de-cão se junta a você.",
                "Uma raia-zebra se junta a você.",
                "Uma raia-olhuda se junta a você.",
                "Uma raia-cururu se junta a você.",
                "Um cação anjo de asa curta se junta a você.",
                "Um anjo do leste africano se junta a você.",
            ],
            multiOutcomes: [
                "Múltiplas arraias se juntam a você.",
                "Arraias de toda raça e credo se juntam a você.",
                "Puxa vida, isso são várias arraias.",
                "A conspiração das arraias cresce!",
                "Eu já perdi conta de quantas arraias temos.",
                "Mais arraia mais mais arraia mais mais mais.",
                "Um cardume de arraias!",
                "A fever of rays! Yes, seriously. Look it up.",
                "Um monte de arraias!",
                "Areia está indo para todo lugar!",
                "Agh! Acho que entrou areia na minha boca!",
                "Arraias demais.",
            ],
            helpText: "Contrate uma arraia para ajudar a pegar peixes. Elas talvez levantem um pouco de areia do solo.",
        },

        getCrab: {
            name: "Adquirir caranguejo",
            effect: {
                resource: {
                    crab: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 10 }],
            max: "crab",
            prereq: {
                resource: {
                    shark: 10,
                    ray: 4,
                },
            },
            outcomes: [
                "Um caranguejo começa a procurar por coisas brilhantes da areia.",
                "Um siri fazendo barra.",
                "Um siri-capeta se junta a você.",
                "Um siri-azul se junta a você.",
                "Um siri-estuarino se junta a você.",
                "Um siri-fedido se junta a você.",
                "Um siri-pintado se junta a você.",
                "Um siri-espadinha se junta a você.",
                "Um siri-candeia se junta a você.",
                "Um siri-chita se junta a você.",
                "Um siri-de-lama se junta a você.",
                "Um siri-de-coral se junta a você.",
                "Um siri-do-mangue se junta a você.",
                "Um caranguejo-das-bermudas se junta a você.",
                "Um caranguejo-verde se junta a você.",
                "Um caranguejo-violinista se junta a você.",
                "Um caranguejo-gigante-japonês se junta a você.",
                "Um caranguejo-vermelho se junta a você.",
                "Um caranguejo-maria-farinha se junta a você.",
                "Um caranguejo-gigante se junta a você.",
                "Um caranguejo-dos-coqueiros se junta a você.",
                "Um caranguejo-anão se junta a você.",
                "Um caranguejo-gigante se junta a você.",
                "Um caranguejo-pedra-da-Flórida se junta a você.",
                "Um caranguejo-negro se junta a você.",
                "Um caranguejo-peludo se junta a você.",
                "Um caranguejo-de-pântano se junta a você.",
                "Um caranguejo-sem-boca se junta a você.",
                "Um caranguejo-de-rochas se junta a você. Como que ele se alimenta?",
            ],
            multiOutcomes: [
                "Um monte de siris se juntam a você.",
                "ELES ESTÃO EM TODO LUGAR",
                "Cara-Angue-Eijos!",
                "O tempo está meio sirizento hoje.",
                "Uma cambada de caranguejos!",
                "Seu idiota! Nós queríamos caranguejos, não carangujeiras!",
                "Um varão de siris! Tá, talvez eu tenha inventado esse.",
                "Tantos caranguejos.",
                "É com tristeza que digo: Uma siririca não é um conjunto de siris.",
            ],
            helpText: "Recrute um caranguejo (ou siri) para pegar coisas que tubarões e arraias deixam passar.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {
            name: "Treinar tubarão cientista",
            effect: {
                resource: {
                    scientist: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "scientist",
            prereq: {
                resource: {
                    crystal: 20,
                    shark: 1,
                },
            },
            outcomes: [
                "Doutor tubarão, pronto para o trabalho!",
                "Um tubarão cientista foi treinado!",
                "Depois de anos de estudo árduo, um tubarão desevolveu abilidades únicas em inventar menti-- quer dizer, em ciência!",
                "Projeto de doutorado aprovado!",
                "Mais um graduado!",
                "A ciência ganhou mais um soldado!",
                "Mais um tubarão dedicando anos de sua vida para o progresso científico!",
                "Uma nova epifania leva um tubarão a se dedicar pela causa científica!",
            ],
            multiOutcomes: [
                "O programa de cotas foi um sucesso!",
                "Olha só toda essa ciência!",
                "Construindo um cardume melhor e mais esperto.",
                "Balões! Balões volumétricos debaixo d'água! Que loucura é essa?!",
                "Conhecimento se alastra pelo cardume!",
                "Mais uma remessa de pranchetas aquáticas! Não tem nenhuma diferença de pranchetas comuns.",
                "Careful teeth record the discoveries!",
                "Fizemos uma festa de colação de grau para uma nova turma.",
                "Um novo time de pesquisa foi criado.",
            ],
            helpText: "Treine um tubarão na arte da pesquisa e na ciência de... bem, da ciência.",
        },

        /*
        getProspector: {
            name: "Recruit shark prospector",
            effect: {
                resource: {
                    prospector: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "prospector",
            prereq: {
                upgrade: ["prospectorSharks"],
            },
            outcomes: [
                "Ready to mine!",
                "Well, there are worse jobs.",
                "Pickaxe? Check. Hard work? Check. Lack of proper safety regulations? Double check.",
                "I'm not sure why sharks think this is a good job? It sucks??",
                "Trained in the art of mine-fu. Ready to bust crystals.",
            ],
            multiOutcomes: [
                "How do you even get leverage underwater? Newton's third law? Anyone?",
                "So, they're back in the mine.",
                "Too bad there isn't something even better than crystal down there, like, diamonds or something.",
                "Go! Collect resources! Give me stone!",
                "No rock left unturned! Then, break the rocks you turn over, there might be goodies inside!",
            ],
            helpText: "Train and equip a shark to break crystals and mine stone in sub-ocean caverns.",
        },
        */

        getNurse: {
            name: "Treinar tubarão enfermeiro",
            effect: {
                resource: {
                    nurse: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "nurse",
            prereq: {
                resource: {
                    shark: 1,
                },
                upgrade: ["biology"],
            },
            outcomes: [
                "Um tubarão enfermeiro foi treinado!",
                "Fazedor de tubarão pronto.",
                "Finalmente alguém para ajudar nos partos.",
                "Foram anos de estudo para formar este enfermeiro.",
                "A residência foi difícil. Mas este tubarão teve vocação.",
                "Ajudar os vulneráveis e enfermos é a maior vocação que se pode ter.",
            ],
            multiOutcomes: [
                "Mais tubarões estão a caminho.",
                "Quem sabe agora a fila para ser atendido ande.",
                "O enxame começou!",
                "Tubarões para todo sempre!",
                "Tubarões infinitos!",
                "Não haverá fim aos tubarões, nós somos eternos!",
                "Mais tubarões fazem mais tubarões fazem mais tubarões fazem mais...",
            ],
            helpText: "Remova um tubarão do trabalho de caça e coloque-o para fazer tubarõezinhos.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {
            name: "Dar laser para uma arraia",
            effect: {
                resource: {
                    laser: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "laser",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["laserRays"],
            },
            outcomes: [
                "Arraia laser na área!",
                "Arraia laser! Com um arraio laser!",
                "Arraia. Laser",
                "Mais uma arraia ignorando as instruções de segurança.",
                "Um laser com uma arraia.",
                "Arraia foi equipada com um laser.",
                "'Eu tenho um laser' -Arraia com laser",
            ],
            multiOutcomes: [
                "Derreta o solo!",
                "Mais cristais!",
                "Destrua a areia!",
                "Não confunda laser com lazer. Mesmo que ambos sejam divertidos.",
                "Exército laser em posição!",
                "O projeto de produção de cristais das arraias cresce a cada dia!",
                "Queime tudo! Mas de preferência apenas areia!",
                "Bem-vindo ao futuro. O futuro é feito de lasers!",
            ],
            helpText: "Dê um laser para uma arraia e deixe-a fundir areia em cristal.",
        },

        /*
        getShoveler: {
            name: "Equip shoveler ray",
            effect: {
                resource: {
                    shoveler: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "shoveler",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["crystalShovel"],
            },
            outcomes: [
                "Shovel ray, at your service!",
                "For shovelry!",
                "The ray is excited to get started.",
                "Gravel is the future...I guess!",
                "Strapped a shovel to a ray. That ray is now a professional. Go get 'em!",
            ],
            multiOutcomes: [
                "Blue heroes with spades!",
                "No sand, only coarse, heavy pebbles!",
                "Let's get shoveling!",
                "Dig in!",
                "And they said shovelry was dead.",
                "The rays seemed bleak before. Now, they're excited.",
            ],
            helpText: "Remove a ray from fish detail and let them collect gravel instead.",
        },
        */

        getMaker: {
            name: "Instruir criador de arraias",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "Mais arraias para você conseguir mais arraias que você usa para mais arraia.",
                "A singul-arraia-dade começou!",
                "Um criador de arraias foi treinado.",
                "[Esta piada é intraduzível]",
                "A arraia parece consternada, mas obedece. Missão dada é missão comprida.",
            ],
            multiOutcomes: [
                "Todos esse criadores. O que estão criandondE para que vai servir? Ah, tendi. Estão criando arraias. E elas vão servir para pega areia ou algo assim.",
                "Mais criadores de arraias significa a mais arraias. Sabe o que isso quer dizer?! Sabe?! Quer dizer mais arraias. Bom. Nós concordamos, então.",
                "A procriação desenfrada de animais provavelmente traz um risco ao ecossistema. Que bom que esses não são os oceanos da Terra, eu acho.",
                "Você já pensou em qual é o desejo das arraias? Porque talvez esse fosse o que elas sempre desejaram, na verdade.",
                "MAIS ARRAIAS LASER PARA O EXÉRCI-- ah. Tá, isso também é aceitável.",
            ],
            helpText: "Tire uma arraia do setor de areia para que ele possa se concentrar em fazer mais arraias.",
        },

        /*
        stoneGetMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 2 },
                { resource: "fish", costFunction: "linear", priceIncrease: 350 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
                world: "stone",
            },
            outcomes: [
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
                "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too.",
            ],
            helpText: "Remove a ray from fish business and let them concentrate on making more rays.",
        },
        */

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {
            name: "Prepare um plantador",
            effect: {
                resource: {
                    planter: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sand", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "planter",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["kelpHorticulture"],
            },
            outcomes: [
                "Um siri recebeu as sementes.",
                "Uma carapaça foi enrolada em alga marinha.",
                "Um caranguejo foi se aventurar. Uma aventura... nas canas.",
                "Plantador equipado e pronto para andar um pouco e plantar coisas!",
                "Caranguejo pronto para a colheita!",
            ],
            multiOutcomes: [
                "Cubra o solo!",
                "Alga alga alga alga alga alga alga alga alga.",
                "A fronteira da agricultura avança!",
                "Colha e plante!",
                "Siris para a colheita!",
                "Carinhosamente faça um buraquinho na areia ponha alga dentro!",
                "Mais alga. As holotúria querem mais. Elas clamam por mais.",
            ],
            helpText: "Dê a um caranguejo equipamento e treinamento para plantar algas pelo fundo do oceano.",
        },

        /*
        getMiller: {
            name: "Equip miller crab",
            effect: {
                resource: {
                    miller: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "gravel", costFunction: "linear", priceIncrease: 25 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "miller",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["gravelMilling"],
            },
            outcomes: [
                "Crab has milling gear.",
                "Why is it milling, and not grinding?",
                "Crab has been prepared for pebble disintegration.",
                "How, you ask? With big, meaty claws, how else?",
                "Making gravel flour, hopefully not for gravel bread.",
            ],
            multiOutcomes: [
                "Doing nature's job for it.",
                "Millions of years of erosion become mere minutes in your hands...",
                "Be gone, gravel!",
                "Sand, come to this world!",
                "Crush the pebbles! Crush them into what is technically just smaller pebbles!",
            ],
            helpText: "Equip a crab with the equipment and training to grind gravel directly into sand.",
        },
        */

        getBrood: {
            name: "Formar uma ninhada",
            effect: {
                resource: {
                    brood: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 20 },
                { resource: "fish", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "brood",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["crabBiology"],
            },
            outcomes: [
                "Um monte de caranguejos se empilham para fazer uma bola estranha de crustáceos.",
                "Time crustáceo, juntem-se! FORMEMOS A NINHADA!",
                "[Essa mensagem foi censurada por ser meio nojenta.]",
                "Ovos, ovos em todo lugar, but never stop and think.",
                "Hoje, no Manual do Mundo, nós fizemos uma bola perfeita de caranguejo.",
                "Uma pilha de siris em constante deformação. Eu nunca esperava ter que falar essas palavras juntas.",
                "A ninhada de caranguejos é um fenômeno raramente visto, porque apenas caranguejos que buscam cristais mágicos têm esse comportamento.",
                "Deveríamos avisá-los que são de espécies diferentes?",
            ],
            multiOutcomes: [
                "As ninhadas crescem. A multidão aumenta.",
                "Todos esses siris parece meio excessivo. ...é o que eu iria dizer se eu não quisesse dizer: MAIS SIRIS!",
                "Um mar de caranguejos no fundo do mar. Clic clac, fazem suas garras.",
                "Snip snap, clic clac, siri caranguejo, caranguejo siri.",
                "Mais caranguejos é sempre bom. Cristais são valiosos.",
                "As ninhadas ficam maiores. Os tubarões se desconcertam, mas suas preocupações passam com o tempo.",
            ],
            helpText: "Aglomere diversos caranguejos em uma ninhada estranha para produzir mais caranguejos de alguma forma incompreensível e nojenta.",
        },

        // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

        /*
        getRockLobster: {
            name: "Train rock lobster",
            effect: {
                resource: {
                    rockLobster: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "rockLobster",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["rockBreaking"],
            },
            outcomes: [
                "Break the rocks, lobster. Break them!",
                "Deployed lobster with a giant crystal nutcracker.",
                "Ready to rock.",
                "Crushing rocks is exactly as difficult as it sounds. This lobster can verify.",
            ],
            multiOutcomes: [
                "Rocks, begone!",
                "Stones? What stones?!",
                "Goodbye, slate.",
                "Goodbye, granite.",
                "Goodbye, generic-looking stone.",
                "Goodbye, pumice.",
                "Goodbye, quartz.",
                "Goodbye, basalt.",
                "Goodbye, limestone.",
                "Goodbye, schist.",
                "Goodbye, diorite.",
            ],
            helpText: "Give a lobster the right gear to crack open stones in the name of gravel.",
        },

        getHarvester: {
            name: "Train lobster harvester",
            effect: {
                resource: {
                    harvester: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 25 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 5 },
            ],
            max: "harvester",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "Yes, lobster, put these claws to better use.",
                "It is time for this one to seek more interesting prey. Wait. Wait, no, it's just as stationary. Never mind. False alarm.",
                "Lobster sticks to seabed!",
            ],
            multiOutcomes: [
                "Cut down the kelp forests!",
                "Rip the sponge and tear the kelp!",
                "Harvest the seafloor!",
                "The lobster tide shall claim the-- wait no you said harvesters. Okay. Adjusting that, then.",
                "These guys are pretty unenthusiastic about everything they do, aren't they.",
            ],
            helpText: "Train a lobster to cut down kelp faster than anything can plant it. Sustainable!",
        },
        */

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {
            name: "Erguer minerador de cristal",
            effect: {
                resource: {
                    crystalMiner: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 200 - 100 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 25 },
            ],
            max: "crystalMiner",
            prereq: {
                resource: {
                    sharkonium: 25,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Minerador de cristal ativado.",
                "Minerador de cristal construído.",
                "Máquina mineradora conectada.",
                "Mineiro de pé.",
                "Construção completa.",
                "Minerador ligado.",
                "Cortar pedra. Remover areia. Pegar cristal.",
            ],
            multiOutcomes: [
                "As máquinas se erguem.",
                "Mais buracos foram feitos.",
                "Os mineradores cavam.",
                "O cristal deve ser extraído.",
                "Projeto de mineração começado.",
                "Caranguejos reclamam de se tornarem obsoletos.",
            ],
            helpText: "Construa uma máquina que pega cristais de forma eficiente sem esforço.",
        },

        getSandDigger: {
            name: "Erguer comedor de areia",
            effect: {
                resource: {
                    sandDigger: 1,
                },
            },
            cost: [
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 500 - 250 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "sandDigger",
            prereq: {
                resource: {
                    sharkonium: 150,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Comedor de areia construído.",
                "Um comedor de areia encosta no solo arenoso.",
                "O comedor começa a sugar areia para dentro de sua boca metálica. Arraias fogem imediatamente.",
                "A máquina faz os seus primeiros barulhos.",
                "A máquina começa imediatamente, cavando o assoalho.",
            ],
            multiOutcomes: [
                "Mais máquinas se juntam.",
                "Os comedores cavam.",
                "Não sobrará areia alguma.",
                "As arraias não gostam de como isso parece.",
                "Devorar a areia. Consumir o chão.",
                "Mais máquinas gigantes levantam areia.",
                "O sol é bloqueado pela poeira arenosa.",
            ],
            helpText: "Construa uma máquina que cave areia por si só.",
        },

        getFishMachine: {
            name: "Erguer armadilha de peixe",
            effect: {
                resource: {
                    fishMachine: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 100 }],
            max: "fishMachine",
            prereq: {
                resource: {
                    sharkonium: 100,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Armadilha ativada.",
                "Armadilha de peixe construída.",
                "Uma armadilha foi ligada.",
                "Construção completa.",
                "The quarry moves. But the machine is faster.",
            ],
            multiOutcomes: [
                "Um dia não restará peixe no oceano. Apenas as máquinas.",
                "Hoje o tubarão é de carne. Mas talvez amanhã, seja de metal.",
                "Apenas os seus serventes metálicos conseguem saciar sua fome. A fome por peixes.",
                "As armadilhas são muito mais eficientes que os tubarões. Mas não são muito espertas.",
                "Caça aumatizada.",
                "O poder de muitos, muitos tubarões, em apenas algumas máquinas.",
            ],
            helpText: "Construa uma máquina que que atrai e automaticame prende peixes em grandes quantidades.",
        },

        getAutoTransmuter: {
            name: "Build auto-transmuter",
            effect: {
                resource: {
                    autoTransmuter: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "autoTransmuter",
            prereq: {
                resource: {
                    sharkonium: 100,
                },
                upgrade: ["engineering"],
            },
            outcomes: [
                "Auto-transmutadora ativada.",
                "Transmutadora automática construída.",
                "Máquina de transmutação ligada.",
                "Construção completa.",
                "Transmutação automatizada.",
                "Dê a matéria-prima. Apenas o produto importa.",
            ],
            multiOutcomes: [
                "Transmutadoras erguidas.",
                "As máquinas. Elas conseguem pensar?",
                "A única diferença de ciência e mágica é poder confiar nela.",
                "Tudo é mudança.",
                "Mudança é tudo.",
                "As máquinas sabem de muitos segredos, mas são incapazes de compartilhá-los.",
            ],
            helpText: "Construa uma máquina para transmutar areia e cristal em tubarônio de forma automática.",
        },

        getSkimmer: {
            name: "Erguer desnatadeira",
            effect: {
                resource: {
                    skimmer: 1,
                },
            },
            cost: [
                {
                    resource: "junk",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 400 - 200 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "skimmer",
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["engineering"],
            },
            outcomes: [
                "Desnatadeira ativada.",
                "Desnatadeira construida.",
                "Produtor de nata funcionando.",
                "Construção completa.",
                "Sacrifícios são o preço do progresso.",
            ],
            multiOutcomes: [
                "O recurso mais inútil se torna o mais importante de todos.",
                "Transmutação é limitada. O reciclador não.",
                "A indústria não para.",
                "Destruição e Produção são dois lados da mesma moeda.",
                "As criações dos tubarões vêm de um padrão tão antigo quanto a sua espécie.",
            ],
            helpText:
                "Construa uma máquina para automaticamente reciclar peixe e areia em nata com total eficiência.",
        },

        // MODDED MACHINES

        /*
        getCoalescer: {
            name: "Construct coalescer",
            effect: {
                resource: {
                    coalescer: 1,
                },
            },
            cost: [
                { resource: "knowledge", costFunction: "linear", priceIncrease: 1 },
                { resource: "science", costFunction: "linear", priceIncrease: 20000000 },
                { resource: "delphinium", costFunction: "linear", priceIncrease: 2500 },
            ],
            max: "coalescer",
            prereq: {
                upgrade: ["knowledgeCoalescers"],
            },
            outcomes: [
                "Accuring thought energy.",
                "Put together a coalescer.",
                "Constructed a thought coalescer.",
                "The structure begins sapping thoughts from the surroundings.",
                "It's not really a machine...it's more like a ritual station.",
                "For something made by dolphins, it might seem smart, but that's just because it's sapping your brainpower.",
            ],
            multiOutcomes: [
                "Now we're thinking with portals...maybe. I think it involves a portal.",
                "Praise be to the brain gods!",
                "Big brain time.",
                "How do the dolphins know to do this?",
                "Free our minds, oh great creations!",
                "The dolphins seem very, very pleased. I'm not sure that I like this anymore.",
            ],
            helpText: "Create a strange structure to consistently siphon knowledge from its surroundings.",
        },

        getCrusher: {
            name: "Build crusher",
            effect: {
                resource: {
                    crusher: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 250 }],
            max: "crusher",
            prereq: {
                resource: {
                    stone: 1,
                },
                upgrade: ["rockProcessing"],
            },
            outcomes: ["Crusher activated.", "Crusher constructed.", "Crushing begins.", "Construction complete."],
            multiOutcomes: [
                "Stone wasn't very useful anyways.",
                "Shoo, rocks!",
                "We can never run out of rocks. The cycle is forever.",
                "CRUSH. KILL. DESTORY. SMALL ROCKS IN PARTICULAR.",
            ],
            helpText: "Construct a machine to break stone down into gravel.",
        },

        getPulverizer: {
            name: "Build pulverizer",
            effect: {
                resource: {
                    pulverizer: 1,
                },
            },
            cost: [
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 250 },
                { resource: "gravel", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "pulverizer",
            prereq: {
                resource: {
                    gravel: 1,
                },
                upgrade: ["gravelPulverizing"],
            },
            outcomes: [
                "Pulverizing begins in T-minus 3...",
                "Flipping the swtich on, the tumblers churn out sand.",
                "Pulverizer, activated.",
                "Construction complete.",
            ],
            multiOutcomes: [
                "The sand. It flows.",
                "The machines take over for the crabs.",
                "Right now, sand is like gold...we can't find it anywhere.",
                "Machines are better than crabs. They won't gravel- er, grovel.",
                "Man, sand is expensive.",
            ],
            helpText: "Construct a machine to break down gravel into sand.",
        },
        */
    },
    abandoned: {
        catchFish: {},

        debugbutton: {},

        prySponge: {
            prereq: {
                upgrade: ["spongeCollection"],
            },
        },
        getClam: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        spongeFiltration: {
            name: "Fabricar filtro de esponja",
            effect: {
                resource: {
                    filter: 1,
                },
            },
            cost: [{ resource: "sponge", costFunction: "linear", priceIncrease: 5 }],
            max: "filter",
            prereq: {
                resource: {
                    sponge: 1,
                },
                upgrade: ["environmentalism"],
            },
            outcomes: [
                "Filtração! Que lindo! Que belo!",
                "Sente só essa água! Daria até para lamber de tão limpa!",
                "Esperança restaurada.",
                "Na escuridão, nós achamos a luz.",
                "Um organismo corrige os erros de outro.",
                "Água restaurada.",
                "Certamente, isso é sustentável.",
                "Nunca mais, lodo!",
                "Salvo pela esponja. Quem imaginaria?",
            ],
            helpText: "Crie filtros de esponja para tirar o óleo da água.",
        },

        breakDownAncientPart: {
            name: "Desmontar partes antigas",
            effect: {
                resource: {
                    science: 2500,
                },
            },
            cost: [{ resource: "ancientPart", costFunction: "constant", priceIncrease: 1 }],
            max: "ancientPart",
            prereq: {
                upgrade: ["reverseEngineering"],
            },
            outcomes: [
                "Fascinante.",
                "Progresso.",
                "Ohh. Agora eu entendi. É... eu... isso é... esquece.",
                "Do que que essas coisas são feitas??",
                "Agora que conseguimos desmontar, como que montamos de volta??",
                "A rebimboca está conectada à...parafuseta. A parafuseta está...hm... não, isso tá errado.",
                "Aprendemos muito com tudo isso! Eu acho!",
            ],
            helpText: "Quebre as partes antigas para análise e ciência.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        forgeSpronge: {
            name: "Transforme esponja em espronja",
            effect: {
                resource: {
                    spronge: 1,
                    // tar: 0.001,
                },
            },
            cost: [
                {
                    resource: "sponge",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "junk",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "spronge",
            prereq: {
                upgrade: ["industrialGradeSponge"],
            },
            outcomes: [
                "Isso parece estar respirando. Isso é desconcertante.",
                "Ele se mexe e treme, mas age como se fosse tubarônio de toda outra forma e isso está meio que me assustando.",
                "Pelo menos os polvos sabem usar isso know how to use this, eu espero.",
                "M- Mas o que... o que é essa <em>coisa</em>?!",
                "Espronja. Mas que nome. Eu, pessoalmente não conseguiria pensar em nenhum nome para isso. Além de 'horripilante'.",
                "Mas que legal, está brilhando... Pera aí, está brilhando?!",
            ],
            helpText: "Transforme essa esponja normalzinha em espronja™, o material do futuro!",
        },

        fuseAncientPart: {
            name: "Fundir coisas em partes antigas",
            effect: {
                resource: {
                    ancientPart: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 100 - 20 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 300 - 60 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "ancientPart",
            prereq: {
                upgrade: ["highEnergyFusion"],
            },
            outcomes: [
                "FUSÃO!",
                "Progresso.",
                "O paassado é irrelevante ao criarmos o futuro.",
                "Pode me lembrar de novo, o que estamos fazendo? Que material é esse???",
                "A água ferve com energia, e o produto final cai no chão.",
                "Fusão completa.",
                "Os lasers se encontram em um ponto, superaquecendo os mexilhões e fundindo eles.",
                "Como que isso foi criado sem as partes já feitas??",
            ],
            helpText: "Converta mexilhões (e cristais) diretamente em partes antigas.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getOctopus: {
            name: "Empregar polvo",
            effect: {
                resource: {
                    octopus: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 15 }],
            max: "octopus",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Um polvo da Califórnia se junta a você.",
                "Um polvo Gigante do Pacífico se junta a você.",
                "Um polvo de Anéis Azuis se junta a você. Cuidado com ele.",
                "Um polvo Comum se junta a você.",
                "Um polvo Pigmeu do Atlântico se junta a você. ",
                "Um polvo Zebra Pigmeu se junta a você.",
                "Um polvo Mimético se junta a você.",
                "Um polvo de Sete Braços se junta a você. Mas que aberração.",
                "Um polvo de Recife do Caribe se junta a você.",
                "Um polvo Vermelho do Pacífico Oriental se junta a você.",
                "Um polvo Pigmeu do Pacífico se junta a você.",
                "Um polvo de Duas Manchas da Califórnia se junta a você.",
                "Um polvo Véu se junta a você.",
                "Um polvo de Duas Manchas de Verril se junta a você.",
                "Um polvo Balão se junta a você.",
                "Um polvo Vermelho se junta a você.",
                "Um polvo Maori se junta a você.",
                "Um polvo do Dia se junta a você.",
                "Um polvo Dumbo se junta a você.",
                "Um polvo do Coco se junta a você.",
                "Um polvo Recife Brasileiro se junta a você.",
                "Um polvo Azul Grande se junta a você.",
                "Um polvo Pigmeu Brasileiro se junta a você, após vocé encontrá-lo fuchicando no seu lixo.",
                "Um polvo Pérola se junta a você.",
                "Um polvo Gigante Africano se junta a você.",
                "Um polvo Gigante do Sul se junta a você.",
                "Um polvo Pigmeu do Pacífico se junta a você.",
                "Um polvo Listrado do Pacífico se junta a você.",
                "Um polvo de Manta Comum se junta a você.",
                "Um polvo Veado se junta a você.",
                "Um polvo do Atlântico Norte se junta a você.",
                "Um polvo Algas se junta a você.",
                "Um polvo Veia se junta a você.",
                "Um polvo Panqueca de Carnarvon se junta a você.",
                "Um polvo Pigmeu Listrado se junta a você.",
                "Uma lula se passando como polvo se junta a você. Todo mundo sabe, mas ninguém se importam, desde que faça o trabalho.",
                "Um polvo Wunderpus se junta a você.",
                "Um polvo Gigante da Patagônia se junta a você.",
                "Um polvo Estrela se junta a você.",
                "Um polvo da Areia se junta a você.",
                "Um polvo de Leste se junta a você.",
            ],
            multiOutcomes: [
                "Eficiência aumeta com o número de membros.",
                "Difícil de entender, mas ainda assim bons trabalhadores.",
                "A mente dos polvos são uma fronteira inexplorável pela maioria dos tubarões.",
                "Eles mal parecem te dar bola. Eles só pegam o pagamento e começam as coletar.",
                "Eles falam algo sobre o programa estar sendo seguido.",
                "Um dos novos contratados te fala para achar união na eficiência.",
                "Você podia jurar que você viu um polvo no meio de todo mundo brilhando como metal.",
                "Pólvos? Não. Polvós? Definitivamente não.",
            ],
            helpText: "Contrate um polvo por seu serviço de coleção de mexilhão.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {},

        getMaker: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 400 },
            ],
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getCollector: {
            name: "Instruir caranguejo-esponja",
            effect: {
                resource: {
                    collector: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 5 },
            ],
            max: "collector",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["agriculture"],
            },
            outcomes: [
                "Um siri entende como cortar esponjas agora.",
                "O caranguejo vai começar a pegar esponjas.",
                "Este caranguejo graduou da faculdade de esponja.",
                "Mais um siri instruído, preparado para fazer um trabalho surpreendentemente difícil.",
            ],
            multiOutcomes: [
                "Os siris agora entendem como cortar esponjas.",
                "Dividir e conquistar. As esponjas. Conquistar as esponjas.",
                "Esponja a caminho!",
                "Esses demônios porosos não conseguem competir com as garras de um caranguejo!",
                "Cristais? Pra que cristal se podemos ter esponja?!",
                "Sim, pegar esponjas é mais difícil do que parece!",
                "Para que que nós queremos isto mesmo?",
                "Não sobrará esponja sobre pedra, pois as esponjas estarão sobre os siris.",
            ],
            helpText: "Instrua caranguejos sobre o jeito correto de tirar esponjas das pedras.",
        },

        getBrood: {},

        // OCTOPUS JOBS ////////////////////////////////////////////////////////////////////////////////

        getInvestigator: {
            name: "Realocar polvo para investigação",
            effect: {
                resource: {
                    investigator: 1,
                },
            },
            cost: [
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "investigator",
            prereq: {
                resource: {
                    octopus: 1,
                },
                upgrade: ["octopusMethodology"],
            },
            outcomes: [
                "Um polvo é um investigador agora",
                "Polvo, investigador.",
                "Seu serviço foi dado. Investigador.",
                "O mandato foi feito. Investigador.",
                "Este indivíduo agora investiga.",
            ],
            multiOutcomes: [
                "Investigadores vão estudar o desconhecido pelo bem coletivo.",
                "Investigadores vão analisar bugingangas que não conseguem entender.",
                "Investigadores vão examinar qualquer coisa estranha.",
                "Investigadores vão agir como instruídos.",
                "Investigação em processo.",
            ],
            helpText: "Delegar um polvo para investigar objetos e fenômenos estranhos pela ciência.",
        },

        getScavenger: {
            name: "Realocar polvo como catador",
            effect: {
                resource: {
                    scavenger: 1,
                },
            },
            cost: [
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "scavenger",
            prereq: {
                resource: {
                    octopus: 1,
                },
                upgrade: ["farExploration"],
            },
            outcomes: [
                "Um polvo é um catador agora.",
                "Polvo, catador.",
                "Seu serviço foi dado. Catador.",
                "O mandato foi feito. Catador.",
                "Este indivíduo agora cata.",
            ],
            multiOutcomes: [
                "Scavengers will retrieve the broken pieces of a once great society.",
                "Scavengers will scavenge from the wreckage of the city.",
                "Catadores cararão apenas o que ainda parece útil.",
                "Scavengers will act as instructed.",
            ],
            helpText: "Delegar um polvo para pegar componentes mecânicos da cidade.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getSkimmer: {
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["recyclerDiscovery"],
            },
        },

        // OCTOPUS MACHINES /////////////////////////////////////////////////////////

        getClamCollector: {
            name: "Contruir coletor mexílico",
            effect: {
                resource: {
                    clamCollector: 1,
                },
            },
            cost: [{ resource: "spronge", costFunction: "linear", priceIncrease: 50 }],
            max: "clamCollector",
            prereq: {
                resource: {
                    spronge: 50,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Máquina: Coletor mexílico. Operação: Em progresso.",
                "Máquina: Coletor mexílico. Operação: Inicializando.",
                "Máquina: Coletor mexílico. Nome: Meio idiota.",
                "Máquina: Coletor mexílico. Resultado: Coleta de mexilhão.",
                "Máquina: Coletor mexílico. Resultado: Comida para o povo.",
            ],
            multiOutcomes: [
                "As máquinas parecem vivas de um jeito estranho. Elas palpitam e latejam.",
                "Mais coletores de mexilhão existem.",
                "A biomáquina aumenta.",
                "Os polvos me contam: Ache união na eficiência. Ache paz na automação.",
            ],
            helpText: "Essa máquina-polvo pega mexilhões. Propósito simples para uma máquina simples.",
        },

        getEggBrooder: {
            name: "Construir chocadeira",
            effect: {
                resource: {
                    eggBrooder: 1,
                },
            },
            cost: [
                { resource: "spronge", costFunction: "linear", priceIncrease: 150 },
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "eggBrooder",
            prereq: {
                resource: {
                    spronge: 150,
                    octopus: 10,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Máquina: Chocadeira. Operação: Em progresso.",
                "Máquina: Chocadeira. Operação: Inicializando.",
                "Máquina: Chocadeira. Result: Manutenção de ovos.",
                "Máquina: Chocadeira. Result: Aumento de população.",
                "Máquina: Chocadeira. Custo: Aceitável.",
            ],
            multiOutcomes: [
                "As máquinas parecem vivas de um jeito estranho. Elas palpitam e latejam.",
                "Existem mais chocadeiras agora.",
                "A biomáquina prolifera.",
                "Os polvos me contam: Ache união na eficiência. Ache paz na geração otimizada.",
            ],
            helpText: "Essa máquina-polvo incuba e choca ovos de polvo.",
        },

        getSprongeSmelter: {
            name: "Construir batedor de espronja",
            effect: {
                resource: {
                    sprongeSmelter: 1,
                },
            },
            cost: [{ resource: "spronge", costFunction: "linear", priceIncrease: 100 }],
            max: "sprongeSmelter",
            prereq: {
                resource: {
                    spronge: 100,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Máquina: Batedor de espronja. Operação: Em progresso.",
                "Máquina: Batedor de espronja. Operação: Inicializando.",
                "Máquina: Batedor de espronja. Resultado: Espronja batida.",
                "Máquina: Batedor de espronja. Resultado: Desenvolvimento industrial.",
            ],
            multiOutcomes: [
                "As máquinas parecem vivas de um jeito estranho. Elas palpitam e latejam.",
                "Existem mais batedores de espronja agora.",
                "A biomáquina cresce.",
                "Os polvos me contam: Ache união na eficiência. Ache paz num futuro assegurado.",
            ],
            helpText: "Essa máquina-polvo embebe esponja com potencial industrial. Necessita de nata para funcionar.",
        },
    },
    haven: {
        catchFish: {},

        debugbutton: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            effect: {
                resource: {
                    get science() {
                        return 4 * (1 + 0.01 * res.getResource("historian"));
                    },
                },
            },
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        fuseDelphinium: {
            name: "Fundir coisas em golfínio",
            effect: {
                resource: {
                    delphinium: 1,
                },
            },
            cost: [
                {
                    resource: "coral",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "delphinium",
            prereq: {
                upgrade: ["aquamarineFusion"],
            },
            outcomes: [
                "Fusão confusão!",
                "Fusão pervesão!",
                "Fusão... fusão... não consegui pensar em nada.",
                "Delfínio, algo que, que nem seus inventores, just isn't quite as legitimate in the ocean.",
                "Delfínio, um dos materiais do oceano!",
                "Delfínio! Nós toleramos, eu acho!",
                "Delfínio! É... é... é algo! Que existe!",
            ],
            helpText: "Fundir recursos preciosos em delfínio, que é tipo tubarônio. Porém pior.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getDolphin: {
            name: "Buscar golfinho",
            effect: {
                resource: {
                    dolphin: 1,
                },
            },
            cost: [
                { resource: "fish", costFunction: "linear", priceIncrease: 5 },
                { resource: "coral", costFunction: "linear", priceIncrease: 2 },
            ],
            max: "dolphin",
            prereq: {
                upgrade: ["cetaceanAwareness"],
            },
            outcomes: [
                "Uma Toninha se junta a você.",
                "Um Golfinho Nariz de Garrafa se junta a você.",
                "Um Golfinho de Dentes Rugosos se junta a você.",
                "Um Golfinho Pintado do Atlântico se junta a você.",
                "Um Boto Cinza se junta a você.",
                "Um Golfinho Rotador se junta a você.",
                "Um Boto Cor de Rosa se junta a você.",
                "Um Boto do Índico se junta a você.",
                "Um Golfinho Pintado Pantropical se junta a você.",
                "Um Golfinho de Hector se junta a você.",
                "Um Golfinho de Commerson se junta a você.",
                "Um Golfinho Clímene se junta a você.",
                "Um Golfinho Chileno se junta a você.",
                "Um Golfinho de Laterais Brancas do Atlântico se junta a você.",
                "Um Golfinho Corcunda se junta a você.",
                "Um Delfim Comum se junta a você.",
                "Um Golfinho de Laterais Brancas do Pacífico se junta a você.",
                "Um Golfinho do Crepúsculo se junta a você.",
                "Um Golfinho de Heaviside se junta a você.",
                "Um Golfinho Comum de Bico Longo se junta a você.",
                "Um Golfinho de Risso se junta a você",
                "Um Delphinus tropicalis se junta a você. Ai ai, esse se acha inteligentinho",
                "Um Boto Tucuxi se junta a você.",
                "Um Golfinho Lacustre Chinês se junta a você.",
                "Um Golfinho de Manges se junta a você.",
                "Um Golfinho Listrado se junta a você.",
                "Um Golfinho de Bico Branco se junta a você.",
                "Um Golfinho Ampulheta se junta a você.",
                "Um Golfinho de Peale se junta a você.",
            ],
            multiOutcomes: [
                "Um grupo social de golfinhos!",
                "Um grupo de golfinhos! Eles nem pensaram em um nome coletivo legal.",
                "Mais deles. Hm.",
                "Mais desse pessoal chioso.",
                "Mais chorões.",
                "Nós precisamos mesmo desses bundas-pálidas?",
                "Eles devem servir para alguma coisa.",
            ],
            helpText: "Pague um golfinho para ajudar a pegar coral ou algo assim. Prepare-se para lidar com o chiado deles.",
        },

        getWhale: {
            name: "Trazer baleia",
            effect: {
                resource: {
                    whale: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 25000 }],
            max: "whale",
            prereq: {
                upgrade: ["whaleCommunication"],
            },
            outcomes: [
                "Uma Baleia Azul se junta a você.",
                "Uma Baleia da Groelândia se junta a você.",
                "Uma Baleia Franca Austral se junta a você.",
                "Uma Baleia Comum se junta a você.",
                "Uma Baleia Minke Boreal se junta a você.",
                "Uma Baleia Sei se junta a você.",
                "Uma Baleia Cinzenta se junta a você.",
                "Uma Baleia Minke Antártica se junta a você.",
                "Uma Baleia de Eden se junta a você.",
                "Uma Baleia Jubarte se junta a você.",
                "Uma Baleia Franca Pigméia se junta a você.",
                "Uma Baleia Beluga se junta a você.",
                "Um Narval se junta a você.",
                "Uma Cachalote se junta a você.",
                "Uma Cachalote Anã se junta a você.",
                "Uma Cachalote Pigméia se junta a você.",
                "Uma Baleia Franca do Atlântico Norte se junta a você.",
                "Uma Baleia Franca do Pacífico se junta a você.",
            ],
            multiOutcomes: [
                "Um baleal de baleias!",
                "Reservados, misteriosos, grandes",
                "Tão lindos... Espera, aquilo são apenas pedronas?",
                "As músicas sâo majestosas.",
                "A água treme com suas canções.",
                "Baleia Azul, Azul Baleia.",
                "Muitos deles podem não comer peixes, mas eles são ótimos em pegá-los.",
            ],
            helpText: "Persuadir uma grande baleia para nos ajudar. Eles conseguem sugar cardumes inteiros.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {},

        getMaker: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {},

        getBrood: {},

        // DOLPHIN JOBS ////////////////////////////////////////////////////////////////////////////////

        getTreasurer: {
            name: "Promover golfinho tesoureiro",
            effect: {
                resource: {
                    treasurer: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "coral", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "treasurer",
            prereq: {
                upgrade: ["coralCollection"],
            },
            outcomes: [
                "Tesoureiro dos tesouros golfinhescos, em ação!",
                "Estamos pondo muita fé nesse gollfinho. Será que é uma boa ideia?",
                "Um golfinho é promovido para um papel em que pode causar mais problemas!",
                "Golfinho tesoureiro pronto para fazer... seja lá o que ele faz.",
                "O golfinho promovido fez um discurso de meia hora sobre a 'honra' que é ser escolhido.",
            ],
            multiOutcomes: [
                "Precisamos de tantos tesoureiros assim?",
                "Isso é algo que deveríamos estar encorajando?",
                "Precisamos de mais cristais.",
                "Pode ser perigoso nós confiarmos tanto nesse pessoal.",
                "A tesouraria cresce!",
                "Que nome idiota, o trabalho deles não tem nada haver com tesouras.",
            ],
            helpText:
                "Promova um golfinho para um trabalho mais complicado envolvendo juros de corais e cristais preciosos ou sei lá mais o quê.",
        },

        getHistorian: {
            name: "Entitular golfinho historiador",
            effect: {
                resource: {
                    historian: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "science", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "historian",
            prereq: {
                resource: {
                    dolphin: 1,
                },
                upgrade: ["retroactiveRecordkeeping"],
            },
            outcomes: [
                "Demos a um golfinho a oportunidadede falar mais que o normal. POR QUÊ?!",
                "Então tá, vamos dar palco para esse golfinho maluco falar.",
                "Esse historiador talvez esteja fazendo um bom ponto.",
                "Talvez este consiga responder por que estamos nós estamos trabalhando com os golfinhos.",
                "There are questions we have that this historian could answer for us.",
            ],
            multiOutcomes: [
                "Nós relutantemente vamos reconhecer que trabalhar junto deles está sendo interessante.",
                "História é contada pelos vencedores. Os golfinhos são perdedores, mas eles vão contá-la mesmo assim.",
                "Esses panacas pretensiosos algumas vezes tem umas ideias boas.",
                "Mas que beleza. Estamos estimulando eles a falar ainda mais.",
                "Se a gente deixar eles falarem bastante mesmo, eles vão deixar de ser tão babacas?",
                "Ah, sim, ótima ideia. Dê títulos para quem já tá com o ego inflado.",
                "Pela última vez, ninguém quer ouvir sobre a Guerra do Golfo de novo!!",
            ],
            helpText:
                "Determine quais dos golfinhos são espertos mesmo, e quais são apenas uma vitrola quebrada com suas histórias inúteis.",
        },

        getBiologist: {
            name: "Treinar um golfinho biólogo",
            effect: {
                resource: {
                    biologist: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 40 },
            ],
            max: "biologist",
            prereq: {
                resource: {
                    dolphin: 1,
                },
                upgrade: ["dolphinBiology"],
            },
            outcomes: [
                "Golfinho biólogo se graduou!",
                "Biólogo treinado.",
                "Golfinho se dedicando para trabalho de golfinho.",
                "Especialista em golfinhos pronto para golfinhar.",
            ],
            multiOutcomes: [
                "Mais deles. Eca.",
                "Golfinhos se proliferam.",
                "Biólogos golfinhos preparados para seja lá o que eles chamam de 'pesquisa'.",
                "Hedonistas convencidos, todos eles!",
                "É com grande pesar que digo: A população de golfinhos cresce.",
            ],
            helpText:
                "Treine um golfinho para se especializar em biologia. Biologia de golfinho, especificamente, e produção, pelo visto.",
        },

        // WHALE JOBS ////////////////////////////////////////////////////////////////////////////////

        getChorus: {
            name: "Juntar o Coro",
            effect: {
                resource: {
                    chorus: 1,
                },
            },
            cost: [
                {
                    resource: "whale",
                    costFunction: "unique",
                    priceIncrease: 3000,
                },
                {
                    resource: "dolphin",
                    costFunction: "unique",
                    priceIncrease: 100000,
                },
            ],
            max: "chorus",
            prereq: {
                resource: {
                    whale: 1,
                },
                upgrade: ["eternalSong"],
            },
            outcomes: [
                "O Coro foi formado.",
                "Os cantores cantam a música imortal.",
                "Eu- eu- ...palavras não conseguem descrever essa música.",
                "Serenidade, eternidade.",
                "Qual é o propósito dessa música? Como ela faz isso?",
                "Infinidade líquida borbulha em volta do Coro.",
            ],
            helpText: "Junte O Coro da canção eterna. Deixe-o espalhar pelo mundo.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        getSkimmer: {},

        // DOLPHIN MACHINES /////////////////////////////////////////////////////////

        getCrimsonCombine: {
            name: "Montar um fusca vermelho",
            effect: {
                resource: {
                    crimsonCombine: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 75 },
                {
                    resource: "coral",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 300 - 150 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "crimsonCombine",
            prereq: {
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "O fusca engata, e navega para o recife mais próximo.",
                "Animais são arrancados da areia em tempo recorde.",
                "Um poeira vermelhar paira em volta da máquina enquanto ela funciona.",
                "Os pistões do fusca aceleram, e suas lâminas começam a colheita excessiva.",
            ],
            multiOutcomes: [
                "Daqui a pouco, o coral vai ser todo nosso, mas a que custo?",
                "Sustentabilidade é algo do passado.",
                "We must resort to drastic measures in the name of progress.",
                "Tesoureiros são lentos. Máquinas são rápidas. Mas não tão rápidas, lembre-seque ainda é feito de delfínio.",
                "Espero que o oceano não precise de todo esse coral para nada.",
                "A névoa vermelha está chegando.",
                "O Agro é tech, o Agro é pop, o Agro é tudo.",
            ],
            helpText: "Essa máquina dos golfinhos retira coral do solo a uma velocidade até meio irresponsável.",
        },

        getKelpCultivator: {
            name: "Montar cultiveira de alga",
            effect: {
                resource: {
                    kelpCultivator: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "seaApple",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 25 - 12.5 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "kelpCultivator",
            prereq: {
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "A cultiveira acende e começa a semear seu jardim.",
                "A cultiveira se dirige a seu local de plantio apropriado.",
                "A cultiveira não vai perturbar o ciclo natural.",
                "A cultiveira de alga trabalha em conjunto da natureza.",
            ],
            multiOutcomes: [
                "Sustentabilidade é um dever do agora.",
                "Essas frágeis máquinas são lentas e metódicas, como se espera de uma máquina feita por golfinhos.",
                "Pelos jardins, essas máquinas quase conseguem sentir amor.",
                "As cultiveiras não gostam de holotúrias. Elas forçosamente tiram elas das algas por nós.",
                "Tipo, isso tudo é bem sustentável, bem verde, mas precisava ser tão lento assim??",
            ],
            helpText: "Essa máquina cuidadosamente zela por jardins algáticos.",
        },

        getTirelessCrafter: {
            name: "Montar artesão infinito",
            effect: {
                resource: {
                    tirelessCrafter: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                {
                    resource: "coral",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "tirelessCrafter",
            prereq: {
                resource: {
                    delphinium: 200,
                },
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "Artesão infinito funde materiais.",
                "Artesão infinito nunca para.",
                "Artesão infinito faz a fundação para um futuro.",
                "Artesão infinito é um acidente esperando para acontecer.",
            ],
            multiOutcomes: [
                "Delfínio. A versão malígna do tubarônio.",
                "Delfínio. Porque nós queremos materiais piores, certo?",
                "Um processo silencioso a temperatura ambiente, que nem como funciona nossos transmutadores automáticos.",
                "Delfínio. Nós não entendemos. Parece muito que nem tubarônio, porém sem fazer direito.",
                "A complexidade dessas máquinas é completamente desnecessária. Os golfinhos acham que isso é esperto, mas existem jeitos tão mais fáceis.",
            ],
            helpText:
                "Essa máquina golfinho produz delfínio. O que de bom sai disso, ninguém sabe. Fazer mais máquinas ruins, eu imagino.",
        },
    },
    frigid: {
        catchFish: {},

        debugbutton: {},

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getSquid: {
            name: "Enlist squid",
            effect: {
                resource: {
                    squid: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "squid",
            prereq: {
                upgrade: ["civilContact"],
            },
            outcomes: [
                "Uma Lula Gigante se junta a você.",
                "Uma Lula Colossal se junta a você.",
                "Uma Lula Mansa se junta a você.",
                "Uma Lula Comum se junta a você.",
                "Uma Lula de Humboldt se junta a você.",
                "Uma Lula Vampira do Inferno se junta a você.",
                "Uma Lula Vaga-lume se junta a você.",
                "Uma Lula de Recifes do Caribe se junta a você.",
                "Uma Lula Vítrea se junta a você.",
                "Uma Lula Luminescente de Mar Profundo se junta a você.",
                "Uma Lula de Barbatana Curta se junta a você.",
                "Uma Lula da Califórnia se junta a você.",
                "Uma Lula Nacional se junta a você.",
                "Uma Lula de Vidro Glacial se junta a você.",
                "Uma Lula Voadora se junta a você.",
                "Um polvo se passando por lula se junta a você. Todos sabem, mas ninguém se importa, ele já é considerado parte do cardume.",
            ],
            multiOutcomes: [
                "Lulas se juntam ao cardume, mas se mantém perto da vila.",
                "As lulas cooperativas e obedientes. Elas fazem o que lhes é dito.",
                "Uma patota de lulas! Não, esse não é o coletivo real de lulas.",
                "Todos vocês. Comecem a caçar. Vai logo.",
                "Lulas estão prontas para a caça.",
                "As lulas saem por aí em busca de peixe.",
                "The squid have no qualms about joining the frenzy.",
                "As lulas não demonstram nada além de respeito para você.",
            ],
            helpText: "Aliste uma lula para ajudar a caçar peixes. Lulas estão acostumadas ao frio.",
        },

        getCrab: {
            prereq: {
                resource: {
                    shark: 6,
                },
            },
            helpText: "Recrute um caranguejo (ou siri) para pegar coisas que tubarões deixam passar.",
        },

        getUrchin: {
            name: "Atrair ouriço",
            effect: {
                resource: {
                    urchin: 1,
                },
            },
            cost: [{ resource: "kelp", costFunction: "linear", priceIncrease: 1 }],
            max: "urchin",
            prereq: {
                upgrade: ["urchinAttraction"],
            },
            outcomes: [
                "Uma Castanha do Mar se junta a você.",
                "Um Ouriço Comestível Europeu se junta a você.",
                "Um Ouriço do Mar da Costa se junta a você.",
                "Um Ouriço de Fogo se junta a você.",
                "Um ouriço terrestre se junta a você. Opa, calma aí, me confundi. É um ouriço marinho mesmo.",
                "Um Ouriço de Espinhos Longos se junta a você.",
                "Um Ouriço Lápis Vermelho se junta a você.",
                "Um Ouriço do Mar Branco se junta a você.",
                "Um Ouriço Flor se junta a você.",
                "Um Ouriço do Mar Preto se junta a você.",
                "Um Ouriço Coletor se junta a você.",
                "Um 'Kina' se junta a você.",
                "Uma Batata do Mar se junta a você.",
            ],
            multiOutcomes: [
                "ai ui ai, espetos dói",
                "Os ouriços se juntam ao cardume. O cardume mantém uma distância.",
                "Pontudo.",
                "Um monte de ouriços. Um monte literal de ouriços.",
                "Os ouriços, em todo lado!",
                "Certamente isso é excessivo, não?",
                "Os ouriços vão direto para a coleta de algas, e, no processo, areia.",
                "E tem certeza de que precisamos de tanto ouriços assim?",
                "Me pergunto se dá para usá-los na ponta de uma arma...",
                "Eles não são venenosos...Certo?",
            ],
            helpText: "Atraia um ouriço que vai coletar alga e areia an. Ouriços estão acostumados ao frio.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // SQUID JOBS ////////////////////////////////////////////////////////////////////////////////

        getExtractionTeam: {
            // i consider this a squid job
            name: "Organizar time de extração",
            effect: {
                resource: {
                    extractionTeam: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "squid", costFunction: "constant", priceIncrease: 1 },
                { resource: "kelp", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "extractionTeam",
            prereq: {
                upgrade: ["assistedExtraction"],
            },
            outcomes: [
                "Time montado.",
                "Trabalho em equipe :D",
                "Cooperação coomeçando.",
                "Eu vos declaro caranguejo e lula.",
                "O caranguejo sobe na cabeça de uma lula. Agora, eles viraram um time.",
                "Caranguejo + Lula = Cristais???",
                "A velocidade e tamanho da lula equilibra o efeito do frio no siri, e os dois saem nadando para extrair cristais.",
                "Um siri fazendo barra na lula. Incrível!",
                "O caranguejo se agarra na alga em volta da lula para se segurar. Funciona, eu acho.",
            ],
            multiOutcomes: [
                "A forma que a cooperação toma difere, mas o resultado é sempre o mesmo.",
                "Alguns desdes times têm...estratégias bem originais. Aquele ali fez um cobertorzinho com a alga.",
                "Os pares voam que nem torpedos pelo oceano.",
                "As duplas se juntam em um pequeno enxame e, então, movem-se a uma direção geral.",
                "Trabalho em equipe faz trabalho sem equiparação, ou algo assim.",
                "Jessiri! Nós precisamos de mais cristais, Jessiri! -Arralter White",
                "Alguém aqui já percebeu que não sabemos por que esses times precisam de alga?",
            ],
            helpText: "Convença uma lula e um caranguejo a se juntarem para coletar mais cristais.",
        },

        getCollective: {
            name: "Juntar coletivo de lulas",
            effect: {
                resource: {
                    collective: 1,
                },
            },
            cost: [
                { resource: "squid", costFunction: "constant", priceIncrease: 10 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "collective",
            prereq: {
                upgrade: ["squidBiology"],
            },
            outcomes: [
                "As lulas se coletaram.",
                "É até meio parecido com ninhadas de caranguejos.",
                "O grupo se junta e começam a fazer seja lá o que lhes é de respeito.",
                "Um coletivo de lulas coletivamente se coletaram.",
                "Eu coleciono coletivos coletivamente coletados.",
                "O correto não é 'uma coleção de lulas'?",
                "Um monte de lulas se juntam para fazer o que eles fazem.",
            ],
            multiOutcomes: [
                "Colecione as lulas. Colecione todas elas!",
                "Juntou um monte de lulas, parabéns.",
                "Por que que tudo é trabalho em equipe com essas lulas???",
                "Estou um pouco preocupado com a questão da moradia para tanta lula.",
                "Quantas lulas será que precisamos para esse trabalho??",
            ],
            helpText: "Junte um grupo de lulas para produzir ainda mais lulas.",
        },

        // CRAB JOB ////////////////////////////////////////////////////////////////////////////////

        getBrood: {},

        // URCHIN JOB ////////////////////////////////////////////////////////////////////////////////////

        getSpawner: {
            name: "Designar ouriços férteis",
            effect: {
                resource: {
                    spawner: 1,
                },
            },
            cost: [
                { resource: "urchin", costFunction: "constant", priceIncrease: 1 },
                { resource: "kelp", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "spawner",
            prereq: {
                upgrade: ["urchinBiology"],
            },
            outcomes: [
                "Espera aí, dá para me explicar de novo como nós fazemos isso?",
                "O ouriço para de coletar alga.",
                "eca eca eca eca eca eca eca",
                "São tantos ovinhos",
                "Se ouriços pudessem falar, eu adoraria perguntar o que eles acham dessa nova profissão.",
            ],
            multiOutcomes: [
                "Calma aí - mais?",
                "Quem disse que nós precisávamos de mais?",
                "Nós não temos o suficiente?",
                "Se continuarmos assim, não vai sobrar chão para tanto ouriço!",
                "Eu não consigo olhar para lugar algum sem ver mais ouricinhos, é sério.",
                "Eu juro, algum dia eu vou acordar com esses bichos todos em cima de mim.",
                "Estou muito preocupado com a questão de espaço para o cardume.",
            ],
            helpText: "Fale para um ouriço fazer mais ouriços.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        getHeater: {
            name: "Erguer aquecedor",
            effect: {
                resource: {
                    heater: 1,
                },
            },
            cost: [
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "kelp",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 750 - 375 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "heater",
            prereq: {
                upgrade: ["artificialHeating"],
            },
            outcomes: [
                "Aquecedor aquecendo.",
                "Aquecedor montado.",
                "Controle climático ativado.",
                "Construção concluída.",
                "Tarde demais, Perry, o derretor de gelo-inator está pronto para funcionar!",
            ],
            multiOutcomes: [
                "O gelo se expande em nossa direção de qualquer forma.",
                "Estamos lutando por uma causa perdida?",
                "As máquinas extender nossa vida, mas conseguem nos salvar?",
                "Ahhh. O quentinho pelo qual tanto rezamos.",
                "Esse oceano gélido sobrevive por um pouco mais tempo.",
                "Esse mundo congela mais lentamente.",
            ],
            get helpText() {
                return SharkGame.Upgrades.purchased.indexOf("rapidRecharging") > -1
                    ? "Construa uma das máquinas que usávamos para desacelerar as paredes de gelo. Não é mais tão útil."
                    : "Construa uma máquina para segurar as paredes gélidas.";
            },
        },
    },

    shrouded: {
        catchFish: {},

        debugbutton: {},

        getJellyfish: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        jellyfishToScience: {
            name: "Desmanchar água-viva",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "jellyfish", costFunction: "constant", priceIncrease: 1 }],
            max: "jellyfish",
            prereq: {
                resource: {
                    jellyfish: 150,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "Eca, mano. Argh, ele é tão molenga e sem forma, poderi- AAAH, ELE ME QUEIMOU!",
                "Esses bichos são uma caixinha de surpresas. Estranhas e insossas surpresas.",
                "Wow, holotúrias eram estranhas, mas esses animais praticamente não existem.",
                "Bem, descobrimos que elas são tão frágeis quanto pareciam.",
                "Que interessante!",
            ],
            helpText: "Examine a geleia dentro das águas de tentáculos picantes! Ciência!",
        },

        makeSacrifice: {
            name: "Performe um Sacrifício Arcano",
            effect: {
                resource: {
                    sacrifice: 1,
                },
            },
            cost: [{ resource: "arcana", costFunction: "constant", priceIncrease: 1 }],
            max: "arcana",
            prereq: {
                upgrade: ["arcaneSacrifice"],
            },
            outcomes: [
                "Pelo bem maior.",
                "Um sacrifício necessário.",
                "The power within these shards is now ours.",
                "O forte brilho te desorienta, mas vale a pena pelo poder.",
                "Os pedaços de mmagia viram cacos sem brilho, que se desintegram em pó.",
                "Que sensação familiar...",
                "Você desmaia por alguns segundos após o clarão.",
                "Sinta a força. Sinta a energia entrando em você.",
            ],
            helpText:
                "Quebre grandes pedaços de arcana, liberando sua energia armazenada, para que possa ser usado pelo bem maior.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {
            name: "Recrutar tubarão",
            effect: {
                resource: {
                    shark: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 5 }],
            max: "shark",
            prereq: {
                resource: {
                    fish: 5,
                },
            },
            outcomes: [
                "Um tubarão touro se junta a você.",
                "Um tubarão duende se junta a você.",
                "Um tubarão crocodilo se junta a você.",
                "Um tubarão corre costa se junta a você.",
                "Um tubarão de pontas negras do recife se junta a você.",
                "Um tubarão galha branca oceânica se junta a você.",
                "Um tubarão elefante se junta a você.",
                "Um tubarão salmão se junta a você.",
                "Um tubarão galha preta se junta a você.",
                "Um tubarão das galápagos se junta a você.",
                "Um tubarão cabeça chata se junta a você",
                "Um tubarão cobre se junta a você.",
                "Um tubarão cinzento dos recifes se junta a você.",
                "Um tubarão de focinho preto se junta a você.",
                "Um tubarão leopardo se junta a você.",
                "Um tubarão negro se junta a você.",
                "Um tubarão vitamínico se junta a você.",
                "Um tubarão martelo se junta a você.",
                "Um tubarão baleia se junta a você.",
                "Um tubarão epaulette se junta a você.",
                "Um tubarão lixa se junta a você.",
                "Um cação anjo de asa curta se junta a você.",
                "Um anjo do leste africano se junta a você.",
                "Um cação viola se junta a você.",
                "Um tubarão tigre se junta a você.",
                "Um tubarão da Groelândia se junta a você.",
                "Um tubarão porco se junta a você.",
                "Um tubarão charuto se junta a você.",
                "Um tubarão limão se junta a você. ",
                "Um tubarão azul se junta a você.",
                "Um tubarão raposa de olho grande se junta a você.",
                "Uma gata lixa se junta a você.",
                "Um peixe-prego se junta a você.",
                "Um cação bruxa se junta a você.",
                "Uma cahnhabota olho grande se junta a você.",
                "Um tubarão mako se junta a você.",
                "Um tubarão albafar se junta a você.",
                "Um tubarão de sete guelras se junta a você. .",
                "Um tubarão cobra se junta a você.",
                "Um tubarão boca grande se junta a você.",
                "Um tubarão branco se junta a você.",
                "Um tubarão zebra se junta a você.",
            ],
            multiOutcomes: [
                "Um monte de tubarões se juntam a você",
                "Isso são vários tubarões.",
                "A comunidade tubarônica cresce!",
                "Mais tubarões! Mais tubarões! MAIS TUBARÕES!",
                "O povo clama pelos tubarões.",
                "Um cardume de tubarões! Sim, também se usa cardume para tubarões.",
                "Um aglomerado de tubarões!",
                "Um bando de tubarões!",
                "Uma manta de tubarões!",
                "Uma piracema de tubarões! Sim, isso está gramaticalmente correto.",
                "Um cobertor de tubarões! Eles esquentam mais que uma manta.",
            ],
            helpText: "Recrute um tubarão para caçar mais peixes.",
        },

        getManta: {
            name: "Contratar arraia",
            effect: {
                resource: {
                    ray: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "ray",
            prereq: {
                resource: {
                    shark: 10,
                },
            },
            outcomes: [
                "Esse moços realmente estão levantando muita areia!",
                "Uma raia-chita se junta a você.",
                "Uma raia-morcego se junta a você.",
                "Uma raia-borboleta se junta a você.",
                "Uma raia-manteiga se junta a você.",
                "Uma raia-de-pedra se junta a você.",
                "Uma raia-bico-de-remo se junta a você.",
                "Uma raia-viola se junta a você.",
                "Uma raia-viola-de-focinho-curto se junta a você.",
                "Uma raia-treme-treme se junta a você.",
                "Uma raia-viola-de-cunha se junta a você.",
                "Uma raia-viola-malhada se junta a você.",
                "Uma raia-guitarra-embocada se junta a você.",
                "Uma raia-viola-barba-negra se junta a você.",
                "Uma raia-viola-irvine se junta a você.",
                "Uma raia-guitarra comum se junta a você.",
                "Uma raia-de altura se junta a você.",
                "Uma raia-dormideira se junta a você.",
                "Uma tremelga-de-olhos se junta a você.",
                "Uma tremelga-roseta se junta a você.",
                "Uma tremolina de McKay se junta a você.",
                "Uma raia-de-dois-olhos se junta a você.",
                "Uma raia-manchada se junta a você.",
                "Uma uge-de-cardas se junta a você.",
                "Uma uge-margarida se junta a você.",
                "Uma uge-mata se junta a você.",
                "Um ratão se junta a você.",
                "Uma uge-borboleta se junta a você.",
                "Um ratão-leopardo se junta a você.",
                "Uma raia-chuco se junta a você.",
                "Uma raia-bispo se junta a você.",
                "Um gavião-do-mar se junta a você.",
                "Uma jamanta-oceânica se junta a você.",
                "Uma jamanta-de-recife se junta a você.",
                "Uma raia-amarela se junta a você.",
                "Uma raia-cobra se junta a você.",
                "Uma raia-espinho se junta a você.",
                "Uma raia-esculhacho se junta a você.",
                "Uma raia-sapo se junta a você.",
                "Uma raia-olho-de-cão se junta a você.",
                "Uma raia-zebra se junta a você.",
                "Uma raia-olhuda se junta a você.",
                "Uma raia-cururu se junta a você.",
                "Um cação anjo de asa curta se junta a você.",
                "Um anjo do leste africano se junta a você.",
            ],
            multiOutcomes: [
                "Múltiplas arraias se juntam a você.",
                "Arraias de toda raça e credo se juntam a você.",
                "Puxa vida, isso são várias arraias.",
                "A conspiração das arraias cresce!",
                "Eu já perdi conta de quantas arraias temos.",
                "Mais arraia mais mais arraia mais mais mais.",
                "Um cardume de arraias!",
                "A fever of rays! Yes, seriously. Look it up.",
                "Um monte de arraias!",
                "Areia está indo para todo lugar!",
                "Agh! Acho que entrou areia na minha boca!",
                "Arraias demais.",
            ],
            helpText: "Contrate uma arraia para ajudar a pegar peixes. Elas talvez levantem um pouco de areia do solo.",
        },

        getEel: {
            name: "Empregar enguia.",
            effect: {
                resource: {
                    eel: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "eel",
            prereq: {
                upgrade: ["seabedGeology"],
            },
            outcomes: [
                "Um Poraquê se junta a você.",
                "Uma Enguia Comum se junta a você.",
                "Uma Enguia Americana se junta a você.",
                "Uma Enguia Verde se junta a você.",
                "Um Congro se junta a você.",
                "Uma Moreia Estrelada se junta a você.",
                "Uma Piramboia se junta a você.",
                "Um Muçum se junta a você.",
                "Uma Enguia de Jardim Pintada se junta a você.",
                "Uma Enguia de Jardim Listrada se junta a você.",
                "Uma Enguia de Jardim Havaiana se junta a você.",
                "Uma Enguia Austral se junta a você.",
                "Uma Enguia Indiana se junta a você.",
                "Uma Enguia de Barbatana Curta se junta a você.",
                "Uma Enguia do Pacífico se junta a você.",
                "Uma Enguia das Celebes se junta a você.",
                "Uma Enguia de Moçambique se junta a você.",
                "Uma Enguia Gigante se junta a você.",
                "Uma Moreia Zebra se junta a você.",
                "Um Safio se junta a você.",
                "Um Moreão se junta a você.",
                "Uma Moreia Preta se junta a você.",
                "Uma Moreia Pintada de Natura se junta a você.",
                "Uma Moreia Serpente se junta a você.",
                "Um Moreão Amarelo se junta a você.",
                "Uma Enguia Lobo se junta a você.",
                "Uma Enguia Fantasma se junta a você.",
            ],
            multiOutcomes: [
                "Enguias juntam elementos de tubarões e de arraias para formar algo que, honestamente, não é tão bom quanto nenhum deles.",
                "O solo treme com a chegada das novas enguias.",
                "Enguias com peixe e areia vão que nem queijo com goiabada! Bem, não sei se existe isso no fundo do mar.",
                "Não bule com as criatura com mandíbulas dentro de suas mandíbulas.",
                "Povo enguia, levantai-vos!",
                "Essas são muitas enguias.",
                "Então fez-se mais enguias. Aeee.",
                "As enguias aumentam em número.",
                "Mais enguias existem. Eba!",
            ],
            helpText: "Ofereça uma nova casa e comida para uma enguia em troca de trabalho. Ela consegue pegar peixes e levantar areia.",
        },

        getChimaera: {
            name: "Ache quimera",
            effect: {
                resource: {
                    chimaera: 1,
                },
            },
            cost: [{ resource: "jellyfish", costFunction: "linear", priceIncrease: 20 }],
            max: "chimaera",
            prereq: {
                resource: {
                    jellyfish: 20,
                },
                upgrade: ["chimaeraReunification"],
            },
            outcomes: [
                "Um Tubarão de São José se junta a você.",
                "Um Papagaio do Mar se junta a você.",
                "Um Ratão Malhado se junta a você.",
                "Um Ratão Molhado se junta a você. Mas é claro, é o fundo do mar, óbvio que seria molhado.",
                "Uma Quimera Azul de Nariz Pontiagudo se junta a você.",
                "Um Peixe Rato Peruviano se junta a você.",
                "Uma Quimera Negra Gigante se junta a você.",
                "Uma Quimera Tailandesa se junta a você.",
                "Uma Quimera de Espinha Pequena se junta a você.",
                "Uma Quimera Focinhada se junta a você.",
                "Uma Quimera Malhada se junta a você.",
                "Uma Ratazana da Fundura se junta a você.",
                "Uma Quimera Marrom se junta a você.",
                "Um Peixe Elefante se junta a você.",
                "Um Tubarão Elefante se junta a você.",
                "Uma Quimera Cubana se junta a você.",
                "Uma Quimera Leopardo se junta a você.",
                "Uma Quimera Púrpura se junta a você.",
                "Uma Quimera do Oceano Pacífico se junta a você.",
                "Uma Quimera Lusitana se junta a você.",
                "Uma Quimera Americana se junta a você.",
                "Uma Quimera de Nove Manchas se junta a você.",
                "Uma Quimera de Carpenter se junta a você.",
                "Um Peixe Espantalho de Nariz Estreito da Australásia se junta a você. Ufa, que nome.",
                "Uma Quimera de Nariz Comprido se junta a você.",
                "Uma Quimera Fantasma Australiana se junta a você.",
                "Uma Quimera Antártica se junta a você.",
                "Uma Quimera do Cabo se junta a você.",
                "Uma Quimera Prateada se junta a você.",
                "Uma Quimera Africana se junta a você.",
                "Uma Quimera de Owston se junta a você.",
            ],
            multiOutcomes: [
                "Muitas quimeras vêm das profundezas.",
                "Como fantasmas, eles se aproximama.",
                "As quimeras se escondem  do seu olhar, mas começam a trabalhar rapidinho.",
                "Nossos estoques de água-viva vão crescer para sempre!",
                "Que bom, não precisamos mais nos por em perigo para pegar as águas-vivas.",
                "Que visões eles tiveram das profundezas do abismo?",
                "Ele não são tubarões, mas parecem tão familiares.",
                "O retorno de primo distante pródigo.",
            ],
            helpText: "Convença uma quimera para caçar nas profundezas mais escuras pelo cardume.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getDiver: {
            name: "Equipar um tubarão mergulhador",
            effect: {
                resource: {
                    diver: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "diver",
            prereq: {
                resource: {
                    shark: 3,
                },
            },
            outcomes: [
                "Melhor você indo do que eu.",
                "Boa sorte lá embaixo!",
                "Estaremos esperando ansiosamente pela sua volta.",
                "Você está fazendo um ótimo trabalho, mergulhador.",
                "Fica com deus na sua aventura, tubarão!",
            ],
            multiOutcomes: [
                "Sigam os cristais!",
                "Descobriremos o que as profundezas guardam para nós.",
                "Desbravem o abismo!",
                "Tragam-nos os cristais pela ciéncia!",
                "Águas escuras, isoladas e medonhas. Que Deus proteja todos vocês.",
            ],
            helpText: "Faça um tubarão adentrar águas profundas em busca de cristais e qualquer coisa mais for achado.",
        },

        getScientist: {
            name: "Treinar tubarão cientista",
            effect: {
                resource: {
                    scientist: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "scientist",
            prereq: {
                resource: {
                    crystal: 20,
                    shark: 1,
                },
            },
            outcomes: [
                "Doutor tubarão, pronto para o trabalho!",
                "Um tubarão cientista foi treinado!",
                "Depois de anos de estudo árduo, um tubarão desevolveu abilidades únicas em inventar menti-- quer dizer, em ciência!",
                "Projeto de doutorado aprovado!",
                "Mais um graduado!",
                "A ciência ganhou mais um soldado!",
                "Mais um tubarão dedicando anos de sua vida para o progresso científico!",
                "Uma nova epifania leva um tubarão a se dedicar pela causa científica!",
            ],
            multiOutcomes: [
                "O programa de cotas foi um sucesso!",
                "Olha só toda essa ciência!",
                "Construindo um cardume melhor e mais esperto.",
                "Balões! Balões volumétricos debaixo d'água! Que loucura é essa?!",
                "Conhecimento se alastra pelo cardume!",
                "Mais uma remessa de pranchetas aquáticas! Não tem nenhuma diferença de pranchetas comuns.",
                "Careful teeth record the discoveries!",
                "Fizemos uma festa de colação de grau para uma nova turma.",
                "Um novo time de pesquisa foi criado.",
            ],
            helpText: "Treine um tubarão na arte da pesquisa e na ciência de... bem, da ciência.",
        },

        getNurse: {
            name: "Treinar tubarão enfermeiro",
            effect: {
                resource: {
                    nurse: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "nurse",
            prereq: {
                resource: {
                    shark: 1,
                },
                upgrade: ["biology"],
            },
            outcomes: [
                "Um tubarão enfermeiro foi treinado!",
                "Fazedor de tubarão pronto.",
                "Finalmente alguém para ajudar nos partos.",
                "Foram anos de estudo para formar este enfermeiro.",
                "A residência foi difícil. Mas este tubarão teve vocação.",
                "Ajudar os vulneráveis e enfermos é a maior vocação que se pode ter.",
            ],
            multiOutcomes: [
                "Mais tubarões estão a caminho.",
                "Quem sabe agora a fila para ser atendido ande.",
                "O enxame começou!",
                "Tubarões para todo sempre!",
                "Tubarões infinitos!",
                "Não haverá fim aos tubarões, nós somos eternos!",
                "Mais tubarões fazem mais tubarões fazem mais tubarões fazem mais...",
            ],
            helpText: "Remova um tubarão do trabalho de caça e coloque-o para fazer tubarõezinhos.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {
            name: "Instruir criador de arraias",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 400 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "Mais arraias para você conseguir mais arraias que você usa para mais arraia.",
                "A singul-arraia-dade começou!",
                "Um criador de arraias foi treinado.",
                "[Esta piada é intraduzível]",
                "A arraia parece consternada, mas obedece. Missão dada é missão comprida.",
            ],
            multiOutcomes: [
                "Todos esse criadores. O que estão criandondE para que vai servir? Ah, tendi. Estão criando arraias. E elas vão servir para pega areia ou algo assim.",
                "Mais criadores de arraias significa a mais arraias. Sabe o que isso quer dizer?! Sabe?! Quer dizer mais arraias. Bom. Nós concordamos, então.",
                "A procriação desenfrada de animais provavelmente traz um risco ao ecossistema. Que bom que esses não são os oceanos da Terra, eu acho.",
                "Você já pensou em qual é o desejo das arraias? Porque talvez esse fosse o que elas sempre desejaram, na verdade.",
                "MAIS ARRAIAS LASER PARA O EXÉRCI-- ah. Tá, isso também é aceitável.",
            ],
            helpText: "Tire uma arraia do setor de areia para que ele possa se concentrar em fazer mais arraias.",
        },

        getScholar: {
            name: "Alfabetizar arraia estudiosa",
            effect: {
                resource: {
                    scholar: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "scholar",
            prereq: {
                upgrade: ["arcaneStudy"],
            },
            outcomes: [
                "Estudo dos pontudo!",
                "Outro estudioso defende uma tese de doutorado sobre coisas mágicas.",
                "A arraia ganhou permissão para estudar magia.",
                "A arraia recebe seu certificado.",
                "Arraia, pronta para estudar!",
                "Parabéns mano, seu trabalho agora é especular em cima de pedaços estranhos de coisinhos brilhante!",
            ],
            multiOutcomes: [
                "Não, não são arraias cientistas, são arraias estudantes!",
                "Criaturas curiosas começam a mexer e testar com as substâncias estranhas que formam a arcana.",
                "Just how much is there to learn about this stuff?",
                "Eles não produzem ciência. Eles estudam.",
                "O outro lado da pesquisa.",
                "Os cientistas e os estudiosos quanse nunca colaboram, então cada um forma sua própria ciência.",
            ],
            helpText: "Ensine uma arraia como estudar as propriedades mágicas da arcana.",
        },

        // EEL JOBS ////////////////////////////////////////////////////////////////////////////////

        getPit: {
            name: "Cavar um poço de enguia",
            effect: {
                resource: {
                    pit: 1,
                },
            },
            cost: [
                { resource: "eel", costFunction: "constant", priceIncrease: 3 },
                { resource: "fish", costFunction: "linear", priceIncrease: 50 },
                { resource: "sand", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "pit",
            prereq: {
                resource: {
                    eel: 1,
                },
                upgrade: ["eelHabitats"],
            },
            outcomes: [
                "Por que que precisa de três enguias? Ãh, talvez seja melhor continuar sem saber.",
                "Eu sou um tubarão e estou cavando um buraco.",
                "Hora da caventura!",
                "Ok, talvez eu tenha feito um poço grande demais.",
                "Esse buraco é um pouco pequeno, mas as enguias cabem direitinho.",
                "Ah, olha só, já achamos esse buraco vazio. Bem, mas que conveniente.",
            ],
            multiOutcomes: [
                "Hora da caventura.",
                "A onda enguiática cresce.",
                "E se ao invés de vários buraquinhos, nós fizéssemos um buracão enorme?",
                "Mais enguias! Quanto mais, melhor.",
                "Olhos te observam dos buracos.",
                "Casinhas secretas!",
                "As enguias estão contentes.",
            ],
            helpText: "Faça um poço adequado para convencer as enguias a criarem mais enguias.",
        },

        getSifter: {
            name: "Ensinar enguias a garimpar",
            effect: {
                resource: {
                    sifter: 1,
                },
            },
            cost: [
                { resource: "eel", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "sifter",
            prereq: {
                upgrade: ["arcaneSifting"],
            },
            outcomes: [
                "Este garimpeiro irá achar recursos!",
                "Enguia está pronta para garimpar a areia!",
                "Dos mesmos criadores de secar gelo: Agora estamos peneirando areia.",
                "Acorda, enguia. Segunda-feira já chegou. Hora do garimpo.",
                "Tá na hora de você, enguia, brilhar.. Literalmente.",
                "É o momento desse carinha comprido nos conseguir vários coisinhos.",
            ],
            multiOutcomes: [
                "Hora de achar coisas!",
                "Essa enguia significa grarimpo! Gra! Rim! Po!",
                "Garimpeiro fuçando a areia em busca de preciosidades.",
                "Grimpeiros prontos para grimpar! Pera. Não, tem algo errado.",
                "Peneirando o solo por um acervo de surpresas!",
                "É quase uma caça ao tesouro.",
            ],
            helpText: "Especialise uma enguia no trabalho de corno que é achar coisas legais em meio à areia.",
        },

        // CHIMAERA JOBS ////////////////////////////////////////////////////////////////////////////////

        getExplorer: {
            name: "Preparar quimera exploradora",
            effect: {
                resource: {
                    explorer: 1,
                },
            },
            cost: [
                { resource: "chimaera", costFunction: "constant", priceIncrease: 1 },
                { resource: "jellyfish", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "explorer",
            prereq: {
                upgrade: ["abyssalEnigmas"],
            },
            outcomes: [
                "Um procurador de mistérios foi preparado.",
                "A quimera exploradora se arruma para sua jornada.",
                "Explorador pronto para trazer respostas!",
                "A quimera se aprofunda no oceano.",
                "Com sua marmita junto dela, a quimera começa explorar.",
            ],
            multiOutcomes: [
                "O time de exploração se apronta.",
                "Hora de descobrir os segredos das profundezas!",
                "Mais mistérios para desvendar.",
                "Enigmas ancestrais para criaturas anciãs.",
                "Achem a verdade sob a escuridão!",
            ],
            helpText:
                "Ajude a preparar uma quimera para explorar mares estranhos em busca de espólios arcanos.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},
    },

    marine: {
        catchFish: {},

        debugbutton: {},

        getClam: {
            name: "Coletar mexilhão",
            effect: {
                resource: {
                    get clam() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Conseguiu um mexilhão-galego.",
                "Conseguiu um mexilhão-azul",
                "Conseguiu um mexilhão-chileno.",
                "Conseguiu o Mexilhãozinho. Ele será útil para lutar contra O MAL.",
                "Conseguiu um mexilhão-dourado.",
                "Conseguiu um mexilhão-verde.",
                "Conseguiu um mexilhão-zebra.",
                "Conseguiu um mexilhão-pérola.",
                "Conseguiu uma amêijoa-fina.",
                "Conseguiu um mexilhão-falso. Mentiroso.",
                "Conseguiu um mexilhão-da-califórnia.",
                "Conseguiu um mexilhão-da-coreia.",
                "Conseguiu uma amêijoa-asiática.",
                "Conseguiu uma amêijoa-japonesa.",
                "Conseguiu uma amêijoa-babosa.",
                "Conseguiu uma amêijoa-mercenária.",
                "Conseguiu uma sarnabi.",
                "Conseguiu um mexilhão-Rabbitsfoot.",
                "Conseguiu um mexilhão-Snuffbox.",
                "Conseguiu uma amêijoa-boa.",
                "Conseguiu uma amêijoa-gigante.",
            ],
            helpText: "Pegue um mexilhão. Para que vamos usá-lo? Sei lá, mano, deixa de encheção.",
        },

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            name: "Estudar holotúrias",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "seaApple", costFunction: "constant", priceIncrease: 1 }],
            max: "seaApple",
            prereq: {
                resource: {
                    seaApple: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "E se essas coisas forem feitas de ciência?",
                "A ciência foi avançada!",
                "Isso talvez tenha a chance de ser esclarecedor!",
                "Por que estamos fazendo isso? Ninguém sabe!",
                "Para que servem essas coisas? Por que eles são tão molengas? Eles estão se remexendo, que nojo!",
                "Resultados ainda inconclusivos! Para a surpresa de ninguém...",
                "Achamos um vale para 4 ciência em cada bicho dissecado.",
                "Passo 1: Holotúria. Passo 2: ??? Passo 3: Ciência!",
            ],
            helpText: "Disseque as holotúria que nossas algas atraem para conseguir ciência.",
        },

        pearlConversion: {
            name: "Converter pérolas",
            effect: {
                resource: {
                    get crystal() {
                        if (SharkGame.Upgrades.purchased.includes("highEnergyFusion")) return 5;
                        return 1;
                    },
                },
            },
            cost: [
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        if (SharkGame.Upgrades.purchased.includes("highEnergyFusion")) return 1;
                        return 5;
                    },
                },
            ],
            max: "clam",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["pearlConversion"],
            },
            outcomes: [
                "Pérolas para cristais! Algum dia, eu juro, algum dia nós conseguiremos usar apenas a pérola.",
                "Os cientistas celebraram transformarem pedras em cristais! Mas depois the olhar mais perto, eram mexilões, não pedras.",
                "Então, dessa vez conseguimos converter apenas as pérolas, mas... bem, tivemos que quebrar os mexilhões.",
                "Pérolas para cr... Droga. Mexilhões para cristais.",
                "Com cuidado... Com cuidado... Foi! Convertemos os mexilhões sem pérola em cristais!... espera, quê?",
                "Transformamos cristais em pérolas. Não, calma aí... Perdão, li errado, é o contrário.",
            ],
            helpText: "Transformar uma pérola (com os mexilhões em volta) em cristais.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {
            name: "Transmute coisas em tubarônio",
            effect: {
                resource: {
                    sharkonium: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "sharkonium",
            prereq: {
                upgrade: ["transmutation"],
            },
            outcomes: [
                "Transmutação com satisfação!",
                "Transmutação com perfeição!",
                "Transmogrificação com convicção!",
                "Transformação com ambição!",
                "Transição com dedicação!",
                "Transfiguração com pegação! ...pera quê?",
                "Transmutação com educação!",
                "Tubarônio quentinho saindo do forno!",
                "Barras de tubarônio feitas!",
                "Mais tubarônio!",
                "A substância sem nome! Exceto pelo nome 'tubarônio'!",
                "Eu não sei como descrever tubarônio. Ele só parece tão estranho.",
                "O pilar de um cardume moderno!",
            ],
            helpText: "Converta simples recursos em tubarônio, o material do futuro!",
        },

        fuseCalcinium: {
            name: "Fundir calcinício",
            effect: {
                resource: {
                    calcinium: 1,
                },
            },
            cost: [
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "calcinium",
            prereq: {
                upgrade: ["calciniumStudies"],
            },
            outcomes: [
                "Fusão feita.",
                "Fusão mexilhão.",
                "Mexilhões sacrificados.",
                "Uma nova fornada de calcinício ferve a água a sua volta enquanto esfria.",
                "Os mexilhões e cristais se juntam em algo único.",
                "A estrutura de conchas e de cristais se ligam e misturam, então solidificam.",
                "Pedaços de detritos se soltam, brilhando de calor enquanto vários pedaços viram um.",
                "Espectadores assistem incrédulos quanto o show de cores e formas acontecendo em sua frente.",
                "A pérola (e o mexilhão em volta) viram o que têm que virar.",
                "Processo terminado.",
            ],
            helpText: "Derreta recursos para fazer calcinício para uso em máquinas crustáceas.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getLobster: {
            name: "Gain lobster",
            effect: {
                resource: {
                    lobster: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 10 }],
            max: "lobster",
            prereq: {
                resource: {
                    clam: 10,
                },
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Uma Lagosta Marroquina se junta a você.",
                "Uma Lagosta Japonesa se junta a você.",
                "Uma Lagosta Comum se junta a você.",
                "Uma Lagosta Gigante se junta a você.",
                "Uma Lagosta de Moçambique se junta a você.",
                "Uma Lagosta do Cabo Verde se junta a você.",
                "Um Scampi se junta a você.",
                "Uma Lagosta Americana se junta a você.",
                "Uma Pitu se junta a você.",
                "Uma Lagosta Africana se junta a você.",
                "Um Lagostim de Água Doce se junta a você.",
                "Uma Lagosta de São Paulo se junta a você. Não, não do estado, da ilha.",
                "Uma Lagosta Espinhosa se junta a você.",
                "Um Lavagante Europeu se junta a você.",
                "Um Lavagante Americano se junta a você.",
                "Uma Lagosta da Nova Zelândia se junta a você.",
                "Uma Lagosta Boxeadora se junta a você.",
                "Uma Lagosta Pintada se junta a você.",
            ],
            multiOutcomes: [
                "Lagostas lagostas lagostas lagostas.",
                "Pera aí, eles estão trazendo pedras?...Hmm. Não, não estão.",
                "A previsão de mexilhão nunca esteve melhor!",
                "Nunca vi ninguém gostar tanto assim de mexilhões!",
                "Mais lagostas, só pra sim.",
                "Uma CACETADA DE LAGOSTAS",
                "Mais lagostas para cortar e pinçar e pegar mais mexilhões!",
                "Patrulha lagostina, aqui vamos nós.",
            ],
            helpText: "Contrate uma lagosta para juntar mexilhões para o cardume.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {},

        getClamScavenger: {
            name: "Aparelhar coletor mexílico",
            effect: {
                resource: {
                    clamScavenger: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "calcinium", costFunction: "linear", priceIncrease: 15 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "clamScavenger",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumRobotics"],
            },
            outcomes: [
                "Coletor pronto para coletar.",
                "Braço robótico operacional.",
                "Treino de braço completo.",
                "Uma arraia, capaz de manejar um braço comicamente grande, é pra já!",
                "Uma arraia com um braço enorme irá fazer seu trabalho.",
                "Arraia aparamentada.",
                "Arraia treinada para indiscriminadamente retirar coisas do solo.",
            ],
            multiOutcomes: [
                "These arms are big.",
                "As arraias gostaram do som que as garras fazem. CLEC CLEC CLEC!",
                "Expensive equipment equipped.",
                "Ordens: cavar mexilhões.",
                "O leve som de pedras se esfregando reverbera pela água.",
                "Por que uma garra de caranguejo? Por que não de lagosta? Na verdade, tem alguma diferença?",
            ],
            helpText: "Insira uma garra grandona numa arraia e a treine para pegar quantias copiosas de mexilhões.",
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {},

        getBrood: {},

        getSeabedStripper: {
            name: "Aparamentar desmatador oceânico",
            effect: {
                resource: {
                    seabedStripper: 1,
                },
            },
            cost: [
                { resource: "calcinium", costFunction: "linear", priceIncrease: 150 },
                { resource: "planter", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "seabedStripper",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumRobotics"],
            },
            outcomes: [
                "Plantador melhorado.",
                "Desmatador oceânico, pronto para desmatar o oceano.",
                "Um desmatador oceânico... fingindo ser uma aranha marinha.",
                "Um caranguejo cheio de garras, é pra já!",
                "Clic.",
                "O siri começa a mexer todos seus novos membros.",
                "Plantador promovido.",
                "Plantador aprimorado.",
            ],
            multiOutcomes: [
                "Clic clac clic clac clic.",
                "The claws rip into kelp like a synchronized dance.",
                "O som de plantas sendo arrancadas ecoa pelo oceano.",
                "Ordens: extrair alga das florestas.",
                "Muitas garrinhas acordam à vida e começam a cortar alga em velocidade recorde.",
                "Os siris juntam outro grupo de desmatadores em busca de uma nova floresta.",
                "Honestamente, acho que isso é braço demais.",
            ],
            helpText: "Incorporar muitos braços extras em um caraguejo em busca de eficiência máxima.",
        },

        // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

        getBerrier: {
            name: "Formar lagosta ovada",
            effect: {
                resource: {
                    berrier: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "berrier",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "Nós não precisávamos ver como isso acontecia.",
                "Uma lagosta cheio de ovinhos prontos para serem chocados.",
                "E a lagosta sortuda a ser caviada é...",
                "Como assim o correto é ovada? Tipo, jogaram ovos na lagosta? É aniversário dela?",
                "Lagosta com caviar pronta. Tá, certo, ova, tá bom, entendi. É só que elas parecem caviar, só que menores e mais deles e... ah, tanto faz, esquece.",
            ],
            multiOutcomes: [
                "Caviada não é nem um palavra!",
                "Caviar e ovos não sãonem a mesma coisa!",
                "Como que esses bichos nadam com tanto ovo colado neles?",
                "Podemos não ter mais recurso, mas o que não vai faltar são voluntários para serem ovados.",
                "Você viu elas brigando por essas vagas de trabalho? Maluco, era garra para todo lado!",
            ],
            helpText: "Escolha uma lagosta voluntária para produzir ovos. Não sabemos como isso funciona. Pergunte a uma lagosta.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        // CRUSTACEAN MACHINES /////////////////////////////////////////////////////////

        getCalciniumConverter: {
            name: "Montar conversor de calcinício",
            effect: {
                resource: {
                    calciniumConverter: 1,
                },
            },
            cost: [
                { resource: "calcinium", costFunction: "linear", priceIncrease: 100 },
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "calciniumConverter",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumCybernetics"],
            },
            outcomes: [
                "Uma lagosta-ciborgue saindo da linha de montagem.",
                "Ciborgue funcionando.",
                "Uma lagosta se aperfeiçoou.",
                "A lagosta começa o seu trabalho imediatamente.",
                "A lagosta ignora você, procurando materiais.",
                "O conversor começa sua conversão.",
                "O conversor demanda materiais",
            ],
            multiOutcomes: [
                "Lasers carregados.",
                "Os raios de fusão brilham.",
                "Futuro!?",
                "Ordens: automatizar.",
                "Setting phasers to fuse...",
                "A força do sol em um órgão mecânico!",
                "Foquem. Foquem. Se preparem...fundam!",
                "Dois se tornam um.",
                "Uma raça nova de lagostas.",
            ],
            helpText: "Modifique uma lagosta para fundir calcinício com seus raios a laser super estilosos a lobster.", // This crustacean machine distributes lobster eggs for optimal hatching conditions.
        },
    },
    volcanic: {
        // FREEBIES ////////////////////////////////////////////////////////////////////////////////

        catchFish: {},

        debugbutton: {},

        prySponge: {
            effect: {
                events: ["volcanicTallyPrySponge"],
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            removedBy: {
                custom() {
                    return SharkGame.flags.prySpongeGained > 200;
                },
                otherActions: ["prySponge2"],
                upgrades: ["agriculture"],
            },
        },

        prySponge2: {
            name: "Arrancar esponja",
            effect: {
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["consistentCommunication"],
            },
            outcomes: [
                "Tirou uma esponja das pedras. Ele nos chamou para caçar água-vivas.",
                "Tirou uma esponja-lacunosa das pedras.",
                "Tirou uma esponja tão suja que nem conseguimos identificar das pedras.",
                "Tirou uma esponja bola-da-morte das pedras.",
                "Tirou uma esponja-tubo-púrpura das pedras.",
                "Tirou uma esponja de cozinha das pedras... Eca, tem pedaço de comida colado",
                "Tirou uma esponja-rim das pedras.",
                "Tirou uma esponja calcária das pedras.",
                "Tirou uma esponja-pele-de-galinha das pedras.",
                "Tirou uma esponja-carnuda das pedras.",
                "Tirou uma esponja-couro das pedras.",
                "Tirou uma esponja-perfurante-amarela das pedras.",
                "Tirou uma esponja-perfurante-verde das pedras.",
                "Tirou uma esponja-de-fuso das pedras.",
                "Tirou uma esponja-cratera das pedras.",
                "Tirou uma esponja-árvore das pedras.",
                "Tirou uma laranja-do-mar das pedras.",
                "Tirou uma esponja 'Puffball' laranja das pedras.",
                "Tirou uma esponja-cratera-vermelha das pedras..",
                "Tirou uma orelha-de-elefante das pedras.",
                "Tirou uma esponja-amarela das pedras.",
                "Tirou uma esponja-de-fibra das pedras.",
                "Tirou uma esponja-barril-gigante das pedras.",
            ],
            helpText: "Retire uma esponja colada nas pedras para eventual uso.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        toggleAutoSmelt: {
            name: "Use vents to smelt porite",
            effect: {
                events: ["volcanicToggleSmelt"],
            },
            cost: {},
            prereq: {
                upgrade: ["superSmelting"],
            },
            outcomes: ["Toggled automatic smelting."],
            helpText: "Toggle automatic smelting of porite.",
            getSpecialTooltip() {
                let text = `AUTOSMELT ${SharkGame.flags.autoSmelt ? "ON" : "OFF"}<br>`;
                if (SharkGame.flags.autoSmelt) {
                    const sponge = res.getResource("sponge");
                    const sand = res.getResource("sand");
                    const spongeCost = SharkGame.HomeActions.volcanic.smeltPorite.cost[0].priceIncrease;
                    const sandCost = SharkGame.HomeActions.volcanic.smeltPorite.cost[1].priceIncrease;
                    const maxSpongeCycles = sponge / spongeCost;
                    const maxSandCycles = sand / sandCost;

                    text += "<span class=\"littleGeneralText\">";
                    if (maxSpongeCycles < maxSandCycles) {
                        text += `${sharktext.getResourceName(
                            "sponge",
                            false,
                            false,
                            sharkcolor.getElementColor("tooltipbox", "background-color"),
                        )}`;
                    }
                    if (maxSandCycles <= maxSpongeCycles) {
                        text += `${sharktext.getResourceName(
                            "sand",
                            false,
                            false,
                            sharkcolor.getElementColor("tooltipbox", "background-color"),
                        )}`;
                    }
                    text += ` is limiting ${sharktext.getResourceName(
                        "porite",
                        false,
                        false,
                        sharkcolor.getElementColor("tooltipbox", "background-color"),
                    )} production</span>`;
                }
                return sharktext.boldString(text);
            },
        },

        smeltPorite: {
            name: "Smelt stuff to porite",
            effect: {
                resource: {
                    porite: 1,
                },
            },
            cost: [
                {
                    resource: "sponge",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - 1 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 20 - 4 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "porite",
            prereq: {
                upgrade: ["secretSmelting"],
            },
            outcomes: [
                "Porita fundida!",
                "Porita f*****! Ai, mil perdões, saiu sem querer",
                "Como que a esponja se incorpora ao vidro? Bem, é bem simples, os camarões fazer funcionar.",
                "O pilar d- o exoesqueleto da indústria camarônica!",
                "Tão frágil. Mas tão útil.",
            ],
            helpText: "Funda coisas para fazer o treco especial das ferramentas dos camarões!",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getManta: {
            prereq: {
                resource: {
                    fish: 15,
                },
            },
        },

        getCrab: {
            prereq: {
                resource: {
                    ray: 4,
                },
            },
        },

        getShrimp: {
            name: "Trazer camarão",
            effect: {
                resource: {
                    shrimp: 1,
                },
            },
            cost: [{ resource: "sponge", costFunction: "linear", priceIncrease: 5 }],
            max: "shrimp",
            prereq: {
                resource: {
                    sponge: 5,
                },
                upgrade: ["consistentCommunication"],
            },
            outcomes: [
                "Um Camarão Lixo se junta a você.",
                "Um Camarão Rosa se junta a você.",
                "Um Camarão Rosado do Norte se junta a você.",
                "Um Camarão Café do Norte se junta a você.",
                "Um Camarão Rosado do Sul se junta a você.",
                "Um Camarão Cristal se junta a você.",
                "Um Camarão Pata Amarela se junta a você.",
                "Um Camarão Carnudo se junta a você.",
                "Um Camarão Tigre Gigante se junta a você.",
                "Um Camarão Tigre Castanho se junta a você.",
                "Um Camarão Branco se junta a você.",
                "Um Camarão Japonês se junta a você.",
                "Um Camarão Banana se junta a você.",
                "Um Camarão Cauda Vermelha se junta a você.",
                "Um Camarão Tigre Verde se junta a você.",
                "Um Camarão Caboclo se junta a você.",
                "Um Camarão Cinza se junta a você.",
                "Um Camarão Branco Nortenho se junta a você.",
                "Um Camarão Azul se junta a você.",
                "Um Camarão Real se junta a você.",
                "Uma Gamba Manchada se junta a você.",
                "Um Camarão Branco Legítimo se junta a você.",
                "Um Camarão Americano do Rio se junta a você.",
                "Um Camarão de Estuário se junta a você.",
                "Um Camarão de Água Doce se junta a você.",
                "Um Camarão Gigante do Rio se junta a você.",
                "Um Camarão Boreal se junta a você.",
                "Um Camarão Akiami se junta a você.",
                "Um Camarão Vermelho se junta a você.",
                "Um Camarão Púrpura se junta a você.",
                "Um Camarão Estilete Argentino se junta a você.",
                "Um Camarão Nailon Chileno se junta a você.",
                "Um Camarão Negro se junta a você.",
                "Uma Gamba Branca se junta a você.",
                "Um Camarão Cristal Rosado se junta a você.",
                "Um Camarão de Bocas se junta a você.",
                "Um Camarão Cristal Branco se junta a você.",
                "Um Camarão Canguru se junta a você.",
                "Um Camarão Guinéu se junta a você.",
                "Um Camarão Nailon Armado se junta a você.",
                "Um Camarão Navalha se junta a você.",
                "Um Camarão Verde se junta a você.",
                "Um Xareu Rei se junta a você.",
                "Um Camarão Aranha Africano se junta a você.",
                "Um Camarão Olhos Grandes se junta a você.",
                "Um Camarão do Oceano Pacífico se junta a você.",
            ],
            multiOutcomes: [
                "Um, dois, três, quatro, cin... Hmmm. Já perdi a conta.",
                "São tantos camarões a sua volta, parece um enxame!",
                "Eu não consigo manter controle algum de tanto camarão!",
                "Camarões, são que nem insetos, só que sem ser insetos ou qualquer coisa coisa remotamente próxima a um inseto!",
                "Eles são tão pequititinhos!",
                "Como pode que animais tão pequenos sejam tão espaçosos?",
                "Esponja pra sempre!",
            ],
            helpText:
                "Recrute camarões para te ajudar a coletar microalgas, que te possibilita manter mais esponjas de uma só vez.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {
            name: "Instruir criador de arraias",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "Mais arraias para você conseguir mais arraias que você usa para mais arraia.",
                "A singul-arraia-dade começou!",
                "Um criador de arraias foi treinado.",
                "[Esta piada é intraduzível]",
                "A arraia parece consternada, mas obedece. Missão dada é missão comprida.",
            ],
            multiOutcomes: [
                "Todos esse criadores. O que estão criando, para que vai servir? Ah, tendi. Estão criando arraias. E elas vão servir para pegar areia ou algo assim.",
                "Mais criadores de arraias significa a mais arraias. Sabe o que isso quer dizer?! Sabe?! Quer dizer mais arraias. Bom. Nós concordamos, então.",
                "A procriação desenfrada de animais provavelmente traz um risco ao ecossistema. Que bom que esses não são os oceanos da Terra, eu acho.",
                "Você já pensou em qual é o desejo das arraias? Porque talvez esse fosse o que elas sempre desejaram, na verdade.",
                "MAIS ARRAIAS LASER PARA O EXÉRCI-- ah. Tá, isso também é aceitável.",
            ],
            helpText: "Tire uma arraia do setor de areia para que ele possa se concentrar em fazer mais arraias.",
        },

        getShoveler: {
            name: "Equipar arraia pazúda",
            effect: {
                resource: {
                    shoveler: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "porite",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("massProduction") ? 10 : 50;
                    },
                },
            ],
            max: "shoveler",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["secretSmithing"],
            },
            outcomes: [
                "Cavador cavando.",
                "Uma arraia sabe como usar uma pá.",
                "Arraia com pá.",
                "O cavador pega uma pá. De forma profissional.",
                "A arraia pazúda começa a cavar a areia saindo das fontes termais.",
                "O cavador se direciona para a fonte termal mais próxima.",
                "A pazúda pega no seu equipamento.",
                "Essa arraia está determinada a aumentar produtividade.",
            ],
            multiOutcomes: [
                "Glória à areia!",
                "PÁ!",
                "Não deixem areia sobre areia!",
                "Pazúdas e seu buracão no solo.",
                "As arraias ganharam uma ferramenta. É uma pá, por isso elas são arraias pazúdas.",
                "As arraias se juntam em voltam da fonte termal mais próxima.",
                "Os cavadores se separam para procurar por fontes termais.",
                "As pazúdas começam a extrair a camada de areia superficial .",
            ],
            helpText: "Treine uma arraia para conseguir nadar direito mesmo com uma pá enorme amarrada nela.",
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        /* getCatcher: {
            name: "Gear up catcher crab",
            effect: {
                resource: {
                    catcher: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sand", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "catcher",
            prereq: {
                upgrade: ["kelpCatching"],
            },
            outcomes: [
                "Crab ready to catch.",
                "Crab has its eyes on a piece of drifting kelp as soon as it reaches a vent.",
                "This one will make a game-winning catch someday, I can just feel it.",
                "Crab ready to pitch- I mean catch.",
                "Equipped crab with extendo-reach.",
                "This crab now reaches farther.",
            ],
            multiOutcomes: [
                "A bunch of claw-doodad-wielding crabs make their way to the nearest vent.",
                "The extendo-grip crabs are gripping stuff.",
                "The crabs test out their new equipment by messing with each other from afar. Hey, get back to work!",
                "The crabs nestle into their chosen spots around the vent output.",
                "Though monotonous, they seem content with this life.",
                "These crabs are ready to have some fun with extendo-reach.",
                "The crabs just seem happy to help.",
            ],
            helpText: "Grant a crab the tools and training to help them catch stuff coming from the vents.",
        }, */

        getCuriousCrab: {
            name: "Incentivar caraguejo curioso",
            effect: {
                resource: {
                    curiousCrab: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "coral", costFunction: "constant", priceIncrease: 10 },
            ],
            max: "curiousCrab",
            prereq: {
                resource: {
                    coral: 5,
                },
            },
            outcomes: [
                "Esse siri não precisa de incentivo. Ele já está curioso o suficiente.",
                "O siri está olhando fixamente um coral de formato engraçado.",
                "O siri começou a questionar até sobre a própria existência.",
                "O siri começa a investigar sujeira aleatória do chão.",
                "As perguntas continuam sempre as mesmas. Quem eu sou? Da onde venho? Aonde vou dá?",
                "Um siri fica muito curioso.",
                "'Eu quero saber' se torna 'Eu PRECISO saber!'",
                "Esse siri não vai parar até tudo for entendido. Tudo mesmo.",
            ],
            multiOutcomes: [
                "Alguns desses parecem felizes só de estarem ajudando.",
                "Curiosos identificados.",
                "Hmm... Análise.",
                "Eles parecem imersos em pensamento coletivo.",
                "Siris conversam entre si sobre perguntas malucas que eles inventaram.",
                "Os caranguejos começam uma discussão sobre umas ideias estranhas que tiveram.",
            ],
            helpText: "Ache um caranguejo que seja curioso e o incentive a ser ainda mais curioso.",
        },

        getResearcher: {
            name: "Financiar pesquisador",
            effect: {
                resource: {
                    researcher: 1,
                },
            },
            cost: [
                { resource: "curiousCrab", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "porite",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("massProduction") ? 5 : 25;
                    },
                },
            ],
            max: "researcher",
            prereq: {
                upgrade: ["secretSmithing"],
            },
            outcomes: ["Pronto para ciência.", "Esses artigos não vão se escrever sozinhos!"],
            multiOutcomes: [
                // All of these are Franjinha quotes from the movie Turma da Mônica: Uma Aventura no Tempo
                "Muita calma nesta hora, Bidu! Agora eu vou juntar.. Os quatro elementos!",
                "Se alguma coisa der errado nesta parte da experiência, pode acontecer muita confusão!",
                "Já pensou Bidu, que invenções os cientistas vão criar daqui a cem, duzentos anos?.",
                "I hope those containment parameters are still nominal.",
                "No, not headcrabs. Just regular crabs.",
                "Ah, tudo muito nominal.",
                "I am rather looking forward to this analysis, aren't you?",
                "Aren't you a bit worried about that exponential cascade scenario we discussed?",
                "The crabs just seem happy to help.",
            ],
            helpText: "Dê equipamento e uma bolsa para um caranguejo curioso para que ele possa fazer experimentos de verdade.",
        },

        getBrood: {
            name: "Formar uma ninhada",
            effect: {
                resource: {
                    brood: 1,
                },
            },
            cost: [
                {
                    resource: "crab",
                    costFunction: "constant",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("broodingBiology") ? 5 : 20;
                    },
                },
                { resource: "fish", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "brood",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["crabBiology"],
            },
            outcomes: [
                "Um monte de caranguejos se empilham para fazer uma bola estranha de crustáceos.",
                "Time crustáceo, juntem-se! FORMEMOS A NINHADA!",
                "[Essa mensagem foi censurada por ser meio nojenta.]",
                "Ovos, ovos em todo lugar, but never stop and think.",
                "Hoje, no Manual do Mundo, nós fizemos uma bola perfeita de caranguejo.",
                "Uma pilha de siris em constante deformação. Eu nunca esperava ter que falar essas palavras juntas.",
                "A ninhada de caranguejos é um fenômeno raramente visto, porque apenas caranguejos que buscam cristais mágicos têm esse comportamento.",
                "Deveríamos avisá-los que são de espécies diferentes?",
            ],
            multiOutcomes: [
                "As ninhadas crescem. A multidão aumenta.",
                "Todos esses siris parece meio excessivo. ...é o que eu iria dizer se eu não quisesse dizer: MAIS SIRIS!",
                "Um mar de caranguejos no fundo do mar. Clic clac, fazem suas garras.",
                "Snip snap, clic clac, siri caranguejo, caranguejo siri.",
                "Mais caranguejos é sempre bom. Cristais são valiosos.",
                "As ninhadas ficam maiores. Os tubarões se desconcertam, mas suas preocupações passam com o tempo.",
            ],
            helpText: "Aglomere diversos caranguejos em uma ninhada estranha para produzir mais caranguejos de alguma forma incompreensível e nojenta.",
        },

        // SHRIMP JOBS ////////////////////////////////////////////////////////////////////////////////

        getQueen: {
            name: "Coroar uma rainha camarão",
            effect: {
                resource: {
                    queen: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "queen",
            prereq: {
                resource: {
                    shrimp: 1,
                },
                upgrade: ["eusociality"],
            },
            outcomes: [
                "Um camarão subiu na sociedade.",
                "Rainha camarão preparada para a realeza!",
                "Uma nova linhagem real se forma!",
                "Mais camarão para o hiperorganismo!",
                "Quanto tempo você acha que vai tomar até ela começar a cantar junto de animais?",
                "Vida longa à pequetuxa rainha camarão!",
            ],
            multiOutcomes: [
                "Então, nós sabemos que fazer mais camarões não é exatamente um papel da realeza, mas elas vão ficar botando ovos em escala 6 por 1. Deixa elas sonharem um pouco.",
                "Essa é a monarquia mais esquisita que eu já vi.",
                "Bem vindos à hiperorganização!",
                "Rainhas para h4. Cheque-mate!",
                "Espero que elas não queiram uma coroa individual para cada uma.",
                "Rainhas para a colônia camarônica! Ovas para o trono ovíparo!",
                "Vamos, precisamos de mais camarões!",
                "O ciclo sem fim de camarão, AVANTE!",
            ],
            helpText: "Coroe uma rainha camarão para fazer mais camarão.",
        },

        getFarmer: {
            name: "Nomear camarão fazendeiro",
            effect: {
                resource: {
                    farmer: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "porite",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("massProduction") ? 2 : 10;
                    },
                },
            ],
            max: "farmer",
            prereq: {
                resource: {
                    shrimp: 1,
                },
                upgrade: ["secretSmithing"],
            },
            outcomes: [
                "Um camarão equipado com um rastelo pequenininho e um chapéu de palha fofinho.",
                "Demos as ferramentas agrárias necessárias para um camarão.",
                "O camarão aceita e agradece por este novo dever.",
                "Sertanejo toca sem parar em volta deste camarão.",
                "De uma forma, isso é uma promoção.",
                "Um (1) camarão, pronto para contribuir ainda mais para a sociedade.",
            ],
            multiOutcomes: [
                "Os camarões estão animados para ajudar a aumentar os estoques de esponja.",
                "Castas não deveriam ser tão fluídas assim.",
                "O gerente ficou maluco! Todo mundo ganha uma promoção!",
                "Irrrrrrá!",
                "Vida longa ao rei! Nós o honramos com nossas foicezinhas fofas.",
                "A esponja deve crescer.",
                "A esponja é vida.",
                "Gloria à esponja. Glória ao povo camarão!",
            ],
            helpText: "Prescreva um camarão para o cultivo de plantas.",
        },

        getAcolyte: {
            name: "Indocrinar seguidor da alga",
            effect: {
                resource: {
                    acolyte: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                { resource: "algae", costFunction: "linear", priceIncrease: 2500 },
            ],
            max: "acolyte",
            prereq: {
                upgrade: ["algaeAcolytes"],
            },
            outcomes: [
                "Seguidor indocrinado.",
                "Outro começa o caminho do esclarecimento algal.",
                "Este despertou seu terceiro olho, meia-noite te conto que olho é esse.",
                "Este camarão vai fazer alguma coisa e por isso mais microalga vai aparecer.",
            ],
            multiOutcomes: [
                "A organização cresce.",
                "Eu tenho certeza que o fomento de uma seita não vai dar nenhum problema futuro para nós. Absolutamente nenhum.",
                "Microalga? Mais tipo Macro...alga... Sente a pressão, nenêm.",
                "Mais alga. MAIS.",
                "Essa exarcebada produção de alga é algo completamente sustentável e com certeza não terá nenhuma consequência a longo prazo.",
                "Precisamos de mais esponja, e só tem um jeito que eu sei de conseguir! Mais microalgas!",
                "As algas devem estar contentes, senão se recusarão a crescer.",
                "Satisfaça a vontade do verde.",
            ],
            helpText: "Indoctrine um camarão para entrar numa seita à microalga que aumenta sua produção.",
        },

        getSpongeFarm: {
            name: "Construir fazenda de esponja",
            effect: {
                events: ["volcanicBoughtFarm"],
                resource: {
                    spongeFarm: 1,
                },
            },
            cost: [
                { resource: "sponge", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("landReform") ? 50 : 250;
                    },
                },
            ],
            max: "spongeFarm",
            prereq: {
                upgrade: ["agriculture"],
            },
            outcomes: [
                "Fazenda de esponja construída, celeiro de esponja erguido.",
                "Agora crescendo esponja por aqui nesta área.",
                "Areia arada. Esponja plantada.",
                "'Bem aqui, isto será uma fazenda!' E então virou.",
            ],
            multiOutcomes: [
                "Nós precisamos mesmo arar o solo para crescer esponja?",
                "Cresça, esponja! Cresça!",
                "Eu espero que nós tenhamos alga o suficiente para sustentar essa quantidade de esponja.",
                "Os camarões gostaram disso.",
                "Tem alguém trabalhando nesses lugares?",
                "Colcozes foram abertos.",
                "Locais de crescimento designados.",
            ],
            helpText: "Escolha um lugar e instale uma fazenda de esponja lá.",
        },

        getCoralFarm: {
            name: "Construct coral farm",
            effect: {
                resource: {
                    coralFarm: 1,
                },
            },
            cost: [
                { resource: "coral", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("landReform") ? 50 : 250;
                    },
                },
            ],
            max: "coralFarm",
            prereq: {
                upgrade: ["coralCloning"],
            },
            outcomes: [
                "Fazenda de coral construída, celeiro de coral erguido.",
                "Agora crescendo coral por aqui nesta área.",
                "Areia arada. Coral plantado.",
                "'Bem aqui, isto será uma fazenda!' E então virou.",
            ],
            multiOutcomes: [
                "Nós precisamos mesmo arar o solo para crescer coral?",
                "Cresça, coral! Cresça!",
                "Os caranguejos gostaram disso.",
                "Tem alguém trabalhando nesses lugares?",
                "Colcozes foram abertos.",
                "Locais de crescimento designados.",
            ],
            helpText: "Escolha um lugar e instale uma fazenda de coral lá.",
        },
    },
    tempestuous: {
        catchFish: {},

        debugbutton: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seagrassToScience: {
            name: "Estudar flores de ervas marinhas",
            effect: {
                resource: {
                    get science() {
                        return SharkGame.Upgrades.purchased.includes("supernaturalSeagrass") ? 10 : 1;
                    },
                },
            },
            cost: [{ resource: "seagrass", costFunction: "constant", priceIncrease: 2 }],
            max: "seagrass",
            prereq: {
                resource: {
                    seagrass: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "Tem ciência dentro dessas coisa, eu pressinto!",
                "A causa da ciência avança!",
                "Isso talvez possa see possivelmente informativo!",
                "Por que estamos fazendo isso? Eu sei lá! Pela ciência!",
                "Resultados ainds inconclusivos! Para a surpresa de ninguém...",
                "Perguntinha. O que é uma flor?",
                "Pelo menos não é nojento.",
                "E se a gente enrolar em papel e sugar uma ponta?",
                "We would learn a lot more from these if they weren't so absolutely tiny.",
            ],
            helpText: "Disseque flores de ervas marinhas para ciência. É provavelmente assim que pesquisa funciona!",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getBillfish: {
            name: "Pedir favor a um peixe-espada",
            effect: {
                resource: {
                    billfish: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 10 }],
            max: "billfish",
            prereq: {
                resource: {
                    fish: 10,
                },
                upgrade: ["cavernousContact"],
            },
            outcomes: [
                "Um Espadim Azul do Atlântico se junta a você.",
                "Um Espadim Raiado se junta a você.",
                "Um Espadim do Mediterrâneo se junta a você.",
                "Um Espadim Peto se junta a você.",
                "Um Espadim de Bico Curto se junta a você.",
                "Um Espadim Branco do Atlântico se junta a você.",
                "Um Espadarte se junta a você.",
                "Um Veleiro se junta a você.",
                "Um Espadim Negro se junta a você.",
                "Um Espadim Bicudo se junta a você.",
            ],
            multiOutcomes: [
                "Os peixes-espada aproximam-se! En garde, tempestade!",
                "Você jura que ouviu um tilintar de espadas vindo do seu cardume.",
                "Entrente a tempestade, amigos. Mostre que vocês não estão de brincadeira.",
                "Esse enxame vai salvar o oceano.",
                "Mais! Mais! Os peixes devem ser aos montes!",
                "Melhor vocês irem lá. Eu fico aqui cuidando da gruta",
                "Por que será que esses caras estão tão felizes?",
                "Um arsenal de peixes-espada! Eles podem agir como armas.",
                "Um cardume de peixes-espada emergem dos fundos da caverna.",
            ],
            helpText: "Ache um peixe-espada lá no fundo da caverna e peça a eles nos ajudar a pegar peixes.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {
            prereq: {
                upgrade: ["statsDiscovery"],
            },
        },

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("laserLenses") ? 10 : 50;
                    },
                },
            ],
        },

        getMaker: {},

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getStormgoer: {
            name: "Gear up crab stormgoer",
            effect: {
                resource: {
                    stormgoer: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "seagrass", costFunction: "constant", priceIncrease: 10 },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes("heavySifting") ? 25 : 100;
                    },
                },
            ],
            max: "stormgoer",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["sandbagging"],
            },
            outcomes: [
                "Here comes one crab ready to NOT collect crystals just because.",
                "Heavy-duty crab coming right up.",
                "This crustacean is ready to pick grass for a living.",
                "Grass me up, stormgoer.",
                "This one goes into the storm.",
                "We salute you, little one.",
                "Bon voyage, little one.",
            ],
            multiOutcomes: [
                "The crabs are reassured that yes, indeed, the sandbags are securely attached.",
                "You have to wonder how they manage to carry all that around.",
                "Surely, that's enough sandbags.",
                "These ones go into the storm.",
                "The crabs double check their sandbags, then set off into the great unknown.",
                "How much sand did this cost us again?",
                "Snip snip snip.",
                "Snip snap snip.",
            ],
            helpText: "Weigh down a crab with sand to keep it from being carried away in the storm.",
        },

        getBrood: {},

        // BILLFISH JOBS ////////////////////////////////////////////////////////////////////////////////

        getBillfishPair: {
            name: "Match billfish pair",
            effect: {
                resource: {
                    billfishPair: 1,
                },
            },
            cost: [
                { resource: "billfish", costFunction: "constant", priceIncrease: 2 },
                { resource: "fish", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "billfishPair",
            prereq: {
                upgrade: ["billfishBiology"],
            },
            outcomes: [
                "Billfish paired.",
                "Two of one makes one of...two...or something.",
                "I pronouce you bill and fish.",
                "Found a match!",
            ],
            multiOutcomes: [
                "Paired some billfish.",
                "Two by two.",
                "Finding a compatible pair is seriously harder than it looks.",
            ],
            helpText: "Do a bit of matchmaking and pair up two billfish to continue the circle of life.",
        },

        getBillfishExplorer: {
            name: "Equip billfish explorer",
            effect: {
                resource: {
                    billfishExplorer: 1,
                },
            },
            cost: [
                { resource: "billfish", costFunction: "constant", priceIncrease: 1 },
                { resource: "seagrass", costFunction: "linear", priceIncrease: 1000 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 25 },
            ],
            max: "billfishExplorer",
            prereq: {
                upgrade: ["powerfulPropulsion"],
            },
            outcomes: [
                "Stay safe out there.",
                "The explorer gives you a determined look, then darts away.",
                "This one charges right into the storm.",
                "The explorer tucks some blank maps away and dashes out of the cave.",
                "The billfish reviews the plan one more time, then charges head first into the current.",
            ],
            multiOutcomes: [
                "Fortune favors the bold.",
                "The school dashes out into the open water.",
                "They seem so calm about it.",
                "The team grabs a big stack of blank maps and quickly swims away.",
                "Seeing this many in a group...perhaps our propulsion system is a little overcomplicated.",
                "The fitting process for these things are a nightmare.",
                "The group valiantly swims out of the cave into the storm.",
            ],
            helpText: "Rig a complex propulsion system to a billfish and train them to chart surrounding waters.",
            removedBy: {
                upgrades: ["cartographicCompleteness"],
            },
        },

        getBillfishMechanic: {
            name: "Instruct billfish mechanic",
            effect: {
                resource: {
                    billfishMechanic: 1,
                },
            },
            cost: [
                { resource: "billfish", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 500 },
            ],
            max: "billfishMechanic",
            prereq: {
                upgrade: ["engineering"],
            },
            outcomes: [
                "This one has read the instruction manual, and is ready to break I MEAN improve stuff.",
                "Tighten this here, and that there, and then this, aaaand...you broke it.",
                "Loosen this screw here, and that bolt there, aaaand...I can't tell the difference.",
                "This one starts a routine maintenance check on a fish machine.",
                "This one starts a routine maintenance check on a sand digger.",
                "The mechanic is ready to mechan...ize. Or whatever.",
                "The mechanic goes to a machine, realizes they forgot their toolbox, and rapidly swims back in the other direction.",
                "New mechanic, fresh from the doc room.",
            ],
            multiOutcomes: [
                "Mechanics acquired.",
                "Mechanics make our operation run like a well-oiled machine. That's great and all, but what's oil?",
                "They all know so many big words. Is this really necessary?",
                "The mechanics swarm on a sand digger, and immeidately break it, only to then fix it better than it started.",
                "The crystal toolsets for these guys are so expensive! But sharkonium would be worse, so, no complaints.",
                "They prepare to tinker.",
                "The mechanics begin observing machines from all angles.",
                "I wonder what they're actually doing. I can't really understand any of it, personally.",
                "They look like they have no idea what they're doing, but they always get results.",
            ],
            helpText: "Train a billfish to operate our machines, and give it the resources needed to tinker with them.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getSandDigger: {
            cost: [
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 500 - 250 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 50 },
            ],
        },

        getFishMachine: {
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 25 }],
        },

        getAutoTransmuter: {},

        getSkimmer: {
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["recyclerDiscovery"],
            },
        },
    },
};

SharkGame.HomeActionCategories = {
    all: {
        // This category should be handled specially.
        name: "Tudo",
        actions: [],
    },

    basic: {
        name: "Básico",
        actions: ["catchFish", "debugbutton", "prySponge", "prySponge2", "getClam", "getJellyfish"],
    },

    frenzy: {
        name: "Cardume",
        actions: [
            "getShark",
            "getManta",
            "getCrab",
            "getShrimp",
            "getLobster",
            "getDolphin",
            "getWhale",
            "getEel",
            "getChimaera",
            "getOctopus",
            "getSquid",
            "getUrchin",
            "getBillfish",
        ],
    },

    professions: {
        name: "Trabalhos",
        actions: [
            "getDiver",
            // "getProspector",
            "getScientist",
            "getLaser",
            "getShoveler",
            "getPlanter",
            "getCollector",
            // "getMiller",
            "getFarmer",
            // "getRockLobster",
            "getPhilosopher",
            "getTreasurer",
            "getTechnician",
            "getSifter",
            "getTransmuter",
            "getExplorer",
            "getInvestigator",
            "getScavenger",
            "getHistorian",
            "getExtractionTeam",
            "getScholar",
            "getExtractor",
            "getCuriousCrab",
            "getResearcher",
            "getAcolyte",
            "getBillfishExplorer",
            "getBillfishMechanic",
            "getStormgoer",
        ],
    },

    breeders: {
        name: "Proliferadores",
        actions: [
            "getNurse",
            "getMaker",
            // "stoneGetMaker",
            "getBrood",
            "getQueen",
            "getBerrier",
            "getBiologist",
            "getPit",
            "getCollective",
            "getSpawner",
            "getBillfishPair",
        ],
    },

    processing: {
        name: "Refinamento",
        actions: [
            "seaApplesToScience",
            // "spongeToScience",
            "jellyfishToScience",
            "pearlConversion",
            "advancedPearlConversion",
            "spongeFiltration",
            "breakDownAncientPart",
            "transmuteSharkonium",
            "smeltCoralglass",
            "fuseDelphinium",
            "forgeSpronge",
            "fuseAncientPart",
            "makeSacrifice",
            "fuseCalcinium",
            "toggleAutoSmelt",
            "smeltPorite",
            "seagrassToScience",
        ],
    },

    machines: {
        name: "Máquinas Tubarônicas",
        actions: [
            "getCrystalMiner",
            "getSandDigger",
            "getAutoTransmuter",
            "getFishMachine",
            "getSkimmer",
            // "getCrusher",
            // "getPulverizer",
            "getHeater",
        ],
    },

    otherMachines: {
        name: "Outras Máquinas",
        actions: [
            "getSpongeFarmer",
            "getBerrySprayer",
            "getGlassMaker",
            "getTirelessCrafter",
            "getClamCollector",
            "getEggBrooder",
            "getSprongeSmelter",
            // "getCoalescer",
            "getCrimsonCombine",
            "getKelpCultivator",
            "getSeabedStripper",
            "getCalciniumConverter",
            "getClamScavenger",
        ],
    },

    places: {
        name: "Lugares",
        actions: ["getSpongeFarm", "getCoralFarm"],
    },

    unique: {
        name: "Único",
        actions: ["getChorus"],
    },
};
