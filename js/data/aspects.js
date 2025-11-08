"use strict";

// idea: aspect which helps to reveal more of the tree
SharkGame.Aspects = {
    apotheosis: {
        posX: 350,
        posY: 350,
        width: 40,
        height: 40,

        max: 8,
        level: 0,
        name: "Apoteose",
        description: "Seu caminho começa aqui.",
        noRefunds: true,
        core: true,
        getCost(level) {
            switch (level) {
                case 0:
                    return 1;
                default:
                    return 4;
            }
        },
        getEffect(level) {
            return "Coleção manual de recursos é <strong>" + (level > 0 ? level * 4 : 1) + "×</strong> mais forte.";
        },
        getUnlocked() {},
        prerequisites: [],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    pathOfIndustry: {
        posX: 450,
        posY: 450,
        width: 40,
        height: 40,

        max: 20,
        level: 0,
        name: "Rumo Industrial",
        description: "Desbloqueie o potencial daquele a sua volta.",
        getCost(level) {
            return 2 * level + 2;
        },
        getEffect(level) {
            return (
                "Multiplica a eficiência dos " +
                sharktext.getResourceName("shark", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                ", suas especializações, e suas máquinas por <strong>" +
                (level + 1) +
                "×</strong>."
            );
        },
        getUnlocked() {
            if (!SharkGame.Aspects.pathOfEnlightenment.level) {
                return "???";
            }
            if (gateway.completedWorlds.length < 3) {
                return "Explore pelo menos dois mundos para desbloquear";
            }
        },
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("pathOfIndustry", "shark", this.level + 1);
                res.applyModifier("pathOfIndustry", "diver", this.level + 1);
                res.applyModifier("pathOfIndustry", "scientist", this.level + 1);
                res.applyModifier("pathOfIndustry", "fishMachine", this.level + 1);
                res.applyModifier("pathOfIndustry", "crystalMiner", this.level + 1);
                res.applyModifier("pathOfIndustry", "sandDigger", this.level + 1);
                res.applyModifier("pathOfIndustry", "nurse", this.level + 1);
                res.applyModifier("pathOfIndustry", "skimmer", this.level + 1);
                res.applyModifier("pathOfIndustry", "autoTransmuter", this.level + 1);
            }
        },
    },
    tokenOfIndustry: {
        posX: 250,
        posY: 250,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Ficha da Indústria",
        description: "Você é quem manda, chefe.",
        core: true,
        getCost(level) {
            switch (level) {
                case 0:
                    return 1;
                case 1:
                    return 24;
                case 2:
                    return 100;
            }
        },
        getEffect(level) {
            switch (level) {
                case 1:
                    return "Desbloqueia uma <strong>ficha móvel</strong> que <strong>multiplica</strong> a produção de qualquer recurso na qual é colocada.";
                case 2:
                    return "Desbloqueia uma segunda ficha (fichas não acumulam no mesmo recurso).";
                case 3:
                    return "Desbloqueia uma terceira ficha (fichas não acumulam no mesmo recurso).";
            }
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    pathOfEnlightenment: {
        posX: 200,
        posY: 350,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Rumo do Esclarecimento",
        description: "Desbloqueie o pontential de si mesmo.",
        noRefunds: true,
        core: true,
        getCost(_level) {
            return 2;
        },
        getEffect(_level) {
            return "Ganhe o poder de atravessar por mundos.";
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    distantForesight: {
        posX: 200,
        posY: 475,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Previsão Profunda",
        description: "Perceba o imperceptível.",
        noRefunds: true,
        core: true,
        getCost(_level) {
            return 2;
        },
        getEffect(_level) {
            return "Mostra muito mais informação sobre um mundo antes de visitá-lo.";
        },
        getUnlocked() {
            if (gateway.completedWorlds.length < 2) {
                return "Explore pelo menos um mundo para desbloquear.";
            }
        },
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    patience: {
        posX: -25,
        posY: 250,
        width: 40,
        height: 40,

        max: 6,
        level: 0,
        name: "Paciência",
        description: "Não há lugar para a sabedoria onde não há paciência. -Santo Agolfinho",
        core: true,
        getCost(level) {
            return level > 0 ? (level + 1) ** 2 : 4;
        },
        getEffect(level) {
            return (
                "Não ganhe nada agora. Toda vez que se completa um mundo, ganhe <strong>" +
                level + " " +
                sharktext.getResourceName("essence", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                "</strong> adicional (Esse bônus <strong>não</strong> aumenta com Culhões)."
            );
        },
        getUnlocked() {},
        prerequisites: ["meditation"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    theDial: {
        posX: -125,
        posY: 300,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "O seletor",
        description: "Não importa o quanto demore. Eu sei que você conseguirá.",
        noRefunds: true,
        core: true,
        getCost(_level) {
            return 8;
        },
        getEffect(_level) {
            return (
                "Desbloqueia a opção de desacelerar o tempo em troca de um grande " +
                sharktext.boldString("multiplicador") +
                " na recompensa de " +
                sharktext.boldString("Paciência")
            );
        },
        getUnlocked() {
            if (res.getTotalResource("essence") < 32) {
                return "Consiga um total de 32 essência para desbloquear.";
            }
        },
        prerequisites: ["patience"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    pathOfTime: {
        posX: 450,
        posY: 250,
        width: 40,
        height: 40,

        max: 10,
        level: 0,
        name: "Rumo do Tempo",
        description: "Paciência é a escolha para quem preferem a inação.",
        getCost(level) {
            return 3 * level + 2;
        },
        getEffect(level) {
            return (
                "Começa com <strong>" +
                25 * 2 ** level +
                "</strong> " +
                sharktext.getResourceName("crab", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                ". Se eles não existirem, começa com um equivalente."
            );
        },
        getUnlocked() {
            if (!SharkGame.Aspects.pathOfEnlightenment.level) {
                return "???";
            }
            if (gateway.completedWorlds.length < 3) {
                return "Explore dois mundos para desbloquear.";
            }
        },
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
        apply(when) {
            if (when === "init" && res.getResource("crab") === 0 && !SharkGame.flags.pathOfTimeApplied) {
                const base = 25 * 2 ** this.level;
                switch (world.worldType) {
                    case "shrouded":
                        res.changeResource("diver", base * 0.5);
                        break;
                    default:
                        res.changeResource("crab", base);
                }
                SharkGame.flags.pathOfTimeApplied = true;
            }
        },
    },
    coordinatedCooperation: {
        posX: 150,
        posY: 200,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Cooperação Coordenada",
        description: "Maybe the squid had a point. Maybe teamwork really is the key.",
        core: true,
        getCost(level) {
            return 16 * (level + 1) ** 2;
        },
        getEffect(level) {
            return "Fichas aumentam a produção em <strong>" + (level + 2) + "×</strong>.";
        },
        getUnlocked() {
            return gateway.completedWorlds.includes("frigid") ? "" : "Complete o mundo Gélido para desbloquear.";
        },
        prerequisites: ["tokenOfIndustry"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    syntheticTransmutation: {
        posX: 530,
        posY: 550,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Transmutação Sintética",
        description: "Nossos materiais não precisam ser totalmente, 100% puros. Certo?",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return "Materiais artificias são <strong>" + 20 * level + "%</strong> mais baratos de serem produzidos manualmente.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    amorphousAssembly: {
        posX: 575,
        posY: 650,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Montagem Amorfa",
        description: "Máquinas que usam componentes substituíveis são máquinas melhores.",
        getCost(level) {
            return 3 + 4 * level;
        },
        getEffect(level) {
            return "Os custos de materiais não artificiais são reduzidas em <strong>" + 50 * level + "%</strong> para todas as máquinas.";
        },
        getUnlocked() {},
        prerequisites: ["syntheticTransmutation"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    mechanicalManifestation: {
        posX: 630,
        posY: 510,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Manifestação Mecânica",
        description: "Com a energia etérea desse Além, máquinas podem produzir mais com menos.",
        getCost(level) {
            return 2 + 2 * level;
        },
        getEffect(level) {
            return "Máquinas produtoras de material artificial tem seu consumo reduzido em <strong>" + 50 * level + "%</strong>.";
        },
        getUnlocked() {},
        prerequisites: ["syntheticTransmutation"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    thePlan: {
        posX: 550,
        posY: 375,
        width: 40,
        height: 40,

        max: 8,
        level: 0,
        name: "O plano",
        description: "'Eu estou bolando o melhor plano infalível que você ja viu. Nos tornaremos donos do mundo!' -Cetaceolinha",
        getCost(level) {
            return 2 * level ** 2 + 4;
        },
        getEffect(level) {
            return "O custo dos membros do cardume são <strong>" + 100 * (1 - 0.5 ** level) + "%</strong> menores.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    collectiveCooperation: {
        posX: 675,
        posY: 425,
        width: 40,
        height: 40,

        max: 8,
        level: 0,
        name: "Cooperação Coletiva",
        description: "Direcione seu cardume. Aprenda a controlá-lo.",
        getCost(level) {
            return 10 * level + 5;
        },
        getEffect(level) {
            return "O efeito da ficha de industria é <strong>" + (level + 1) + "×</strong> mais forte.";
        },
        getUnlocked() {},
        prerequisites: ["thePlan"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    constructedConception: {
        posX: 675,
        posY: 350,
        width: 40,
        height: 40,

        max: 8,
        level: 0,
        name: "Concepção Arquitetada",
        description: "Reprodução natural não é eficient. Controle a biologia como uma ferramenta sua.",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return "Todos os reprodutores são <strong>" + 2 ** level + "×</strong> mais rápidos.";
        },
        getUnlocked() {},
        prerequisites: ["thePlan"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
        apply(when) {
            if (when === "init") {
                _.each(SharkGame.ResourceCategories.breeders.resources, (breeder) => {
                    res.applyModifier("constructedConception", breeder, this.level + 1);
                });
            }
        },
    },
    destinyGamble: {
        posX: 300,
        posY: 550,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Apostas do Destino",
        description: "Nosso caminho se dá por sorte, mas tem vezes que nós podemos viciar os dados.",
        noRefunds: true,
        core: true,
        getCost(level) {
            return 2 + level;
        },
        getEffect(level) {
            return (
                "Ao escolher os mundos, você terá a oportunidade de mudar a seleção do seu destino <strong>" +
                level +
                " vez" +
                (level > 1 ? "es" : "") +
                "</strong>."
            );
        },
        getUnlocked() {},
        prerequisites: ["distantForesight"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
        apply(when) {
            if (when === "levelUp") {
                if (_.isUndefined(SharkGame.persistentFlags.destinyRolls)) {
                    SharkGame.persistentFlags.destinyRolls = this.level;
                } else {
                    SharkGame.persistentFlags.destinyRolls += 1;
                }
            }
        },
    },
    cleanSlate: {
        posX: 100,
        posY: 550,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Tela em Branco",
        description: "Para construir algo novo, primeiro deve-se apagar o que já foi construido.",
        noRefunds: true,
        core: true,
        getCost(_level) {
            return 3;
        },
        getEffect(_level) {
            return "Desbloqueia a abilidade de reembolsar alguns aspectos.";
        },
        getUnlocked() {
            if (gateway.completedWorlds.length < 2) {
                return "Explore dois mundos para desbloquear.";
            }
        },
        prerequisites: ["distantForesight"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
        apply(when) {
            if (when === "levelUp" && SharkGame.Settings.current.doAspectTable === "table") {
                SharkGame.Button.makeButton("respecModeButton", "respec mode", $("#aspectTreeNavButtons"), tree.toggleRefundMode);
                SharkGame.Button.makeButton("respecButton", "respec all", $("#aspectTreeNavButtons"), () => {
                    if (confirm("Tem certeza que queres vender TODOS os aspectos reembolsáveis?")) {
                        tree.respecTree();
                    }
                });
            }
        },
    },
    crystallineSkin: {
        posX: 575,
        posY: 300,
        width: 40,
        height: 40,

        max: 16,
        level: 0,
        name: "Alma Crystalina",
        description: "Vire um com as pedras.",
        getCost(level) {
            return 3 + level ** 2;
        },
        getEffect(level) {
            return (
                "Enquanto você tiver menos que <strong>" +
                25 * 2 ** level +
                "</strong> " +
                sharktext.getResourceName("crystal", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                ", eles vão ser produzidos rapidamente. Se eles não existirem, este aspecto se aplicará a um recurso equivalente."
            );
        },
        getUnlocked() {},
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    /*     keenEyesight: {
        posX: 0,
        posY: 50,
        width: 40,
        height: 40,

        max: 10,
        level: 0,
        name: "Keen Eyesight",
        description: "Learn to stop overlooking the small stuff.",
        getCost(level) {
            return 3 * level + 5;
        },
        getEffect(level) {
            return (
                "Unlocks a button to manually gather " +
                sharktext.getResourceName("crystal", false, 420) +
                ". " +
                0.01 * level * SharkGame.Aspects.apotheosis.level +
                " " +
                sharktext.getResourceName("crystal", false, 420) +
                " per click."
            );
        },
        getUnlocked() {
            //return SharkGame.Gateway.completedWorlds.includes("shrouded") ? "" : "Complete the Shrouded worldtype to unlock this aspect.";
            return "This aspect will be implemented in a future update.";
        },
        prerequisites: ["crystallineSkin"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    }, */
    internalCalculator: {
        posX: 575,
        posY: 200,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Calculadora Interna",
        description: "Os polvos sempre se mostraram racionais mesmo em situações confusas. Desenvolva sua mente e desenvolva essa eficiência.",
        getCost(_level) {
            return 3;
        },
        getEffect(level) {
            if (level === 1) {
                return (
                    "Se uma pesquisa custa <strong>" +
                    150 +
                    "</strong> " +
                    sharktext.getResourceName("science", false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    " ou menos, seu custo de " + sharktext.getResourceName("science", false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) + " é dividido pela metade."
                );
            } else {
                return (
                    "Se uma pesquisa custa <strong>" +
                    150 * (level - 1) ** 2 +
                    "</strong> " +
                    sharktext.getResourceName("science", false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    " ou menos, todos os seus custos são divididos pela metade."
                );
            }
        },
        getUnlocked() {
            return gateway.completedWorlds.includes("abandoned") ? "" : "Complete o mundo Abandonado para desbloquear.";
        },
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    extensiveOrganization: {
        posX: 700,
        posY: 175,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Organização Prévia",
        description: "Esteja preparado. Organize-se. Não gaste tempo.",
        getCost(_level) {
            return 2;
        },
        getEffect(level) {
            if (level === 1) {
                return "Comece com a gruta já desbloqueada.";
            } else {
                return "Comece com a gruta e o laboratório já desbloqueados.";
            }
        },
        getUnlocked() {
            // return SharkGame.Gateway.completedWorlds.includes("tempestuous") ? "" : "Complete the Tempestuous worldtype to unlock this aspect.";
        },
        prerequisites: ["internalCalculator"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
        apply(when) {
            if (when === "init") {
                SharkGame.Lab.addUpgrade("statsDiscovery");
                if (this.level > 1) {
                    SharkGame.TabHandler.discoverTab("lab");
                }
            }
        },
    },
    theHourHand: {
        posX: 350,
        posY: 175,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "O Ponteiro das Horas",
        description: "O tempo é um conceito da mente.",
        core: true,
        getCost(level) {
            return 3 + level;
        },
        getEffect(level) {
            return (
                "O Ponteiro dos Minutos começara com " +
                sharktext.boldString(60 * level + "s") +
                " ao entrar num mundo. Isso " +
                sharktext.boldString("NÃO VAI") +
                " contar no seu tempo de conclusão se usado."
            );
        },
        getUnlocked() {
            if (gateway.completedWorlds.length < 2) {
                return "Explore um mundo para desbloquear.";
            }
        },
        prerequisites: ["tokenOfIndustry"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    doubleTime: {
        posX: 450,
        posY: 150,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Expansão Temporal",
        description: "E se, ao invés de trabalhar mais duro, nós tivermos mais tempo?",
        core: false,
        getCost(level) {
            return 3 * level + 3;
        },
        getEffect(level) {
            return (
                "O Ponteiro dos Minutos ganha " +
                sharktext.boldString(level + 1 + "×") +
                " mais tempo de todas as fontes (exceto do Ponteiro das Horas). " +
                "Esse tempo bônus vai contar no seu tempo de conclusão se usado."
            );
        },
        getUnlocked() {
            if (res.getTotalResource("essence") < 32) {
                return "Consiga um total de 32 essência para desbloquear.";
            }
        },
        prerequisites: ["theHourHand"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    overtime: {
        posX: 450,
        posY: 75,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Escala 6x1",
        description: "Sem tempo pra descanso!",
        core: false,
        getCost(level) {
            return 3 * level + 3;
        },
        getEffect(level) {
            return (
                "O Ponteiro dos Minutos ganha " +
                sharktext.boldString(sharktext.beautify(0.2 * level) + "s") +
                " por segundo enquanto desativado. " +
                "Esse tempo bônus vai contar no seu tempo de conclusão se usado."
            );
        },
        getUnlocked() {
            if (res.getTotalResource("essence") < 32) {
                return "Consiga um total de 32 essência para desbloquear.";
            }
        },
        prerequisites: ["theHourHand"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    gumption: {
        posX: -25,
        posY: 350,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Culhões",
        description: "Prosperidade gera prosperidade.",
        core: true,
        getCost(level) {
            return level !== 4 ? 5 + level : 4;
        },
        getEffect(level) {
            return (
                "Para cada " +
                sharktext.getResourceName("essence", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                " não gasta, aumente os ganhos de " +
                sharktext.getResourceName("essence", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                " (não contando ganhos por Paciência) por <strong>" +
                level +
                "%</strong>. Efeito máximo em <strong>100%</strong>."
            );
        },
        getUnlocked() {},
        prerequisites: ["meditation"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    meditation: {
        posX: 75,
        posY: 300,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Meditação",
        description: "Respire. Foque. Sinta a correnteza. Controle-a.",
        noRefunds: true,
        core: true,
        getCost(_level) {
            return 2;
        },
        getEffect(_level) {
            if (SharkGame.Settings.current.idleEnabled) {
                return "Desbloqueie um botão para pausar a qualquer momento.";
            } else {
                return "Desbloqueie um botão para parar a maioria dos timers e todos os recursos.";
            }
        },
        getUnlocked() {
            if (gateway.completedWorlds.length < 2) {
                return "Explore pelo menos um mundo para desbloquear.";
            }
        },
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
    infinityVision: {
        posX: 200,
        posY: 600,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Visão Infinita",
        description: "Nada fica escondido para observadores espertos.",
        noRefunds: true,
        core: true,
        getCost(_level) {
            return 10;
        },
        getEffect(_level) {
            return "Revela todos os aspectos não bloqueados.";
        },
        getUnlocked() {},
        prerequisites: ["distantForesight"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },

    // deprecated

    theMinuteHand: {
        deprecated: true,
        level: 0,
        getCost(level) {
            switch (level) {
                case 0:
                    return 4;
                default:
                    return 3 + level;
            }
        },
        prerequisites: ["theSecondHand"],
    },
    theSecondHand: {
        deprecated: true,
        level: 0,
        getCost(level) {
            return 6 * (level + 1);
        },
        prerequisites: ["theMinuteHand"],
    },
    anythingAndEverything: {
        posX: 675,
        posY: 100,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        deprecated: true,
        name: "Anything and Everything",
        description: "Could I interest you in a little bit of everything?",
        getCost(_level) {
            return 5;
        },
        getEffect(_level) {
            return "Unlock a button which presses all the buy buttons (pressed in order from left-to-right, top-to-bottom).";
        },
        getUnlocked() {},
        prerequisites: ["extensiveOrganization"],
        clicked(_event) {
            tree.handleClickedAspect(this);
        },
    },
};
