"use strict";
SharkGame.Settings = {
    current: {},

    // Internal / No category
    buyAmount: {
        defaultSetting: 1,
        options: [1, 10, 100, -3, -2, -1, "custom"],
    },

    grottoMode: {
        defaultSetting: "simples",
        options: ["simples", "avançado"],
    },

    showPercentages: {
        defaultSetting: "absoluto",
        options: ["absoluto", "porcentagem"],
    },

    // PERFORMANCE

    framerate: {
        defaultSetting: 20,
        name: "Taxa de quadros",
        desc: "O quão rápido o jogo é atualizado.",
        category: "PERFORMANCE",
        options: [1, 2, 5, 10, 20, 30],
        onChange() {
            main.applyFramerate();
        },
    },

    showAnimations: {
        defaultSetting: true,
        name: "Mostrar animações",
        desc: "Deveríamos ter transições animadas?",
        category: "PERFORMANCE",
        options: [true, false], // might remove this option? could be a pain to continue supporting it
    },

    // LAYOUT

    minimizedTopbar: {
        defaultSetting: true,
        name: "Minimizar título",
        desc: "Deveríamos minimizar a barra superior com o título?",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            SharkGame.TitleBarHandler.updateTopBar();
        },
    },

    logLocation: {
        defaultSetting: "right",
        name: "Local dos registros",
        desc: "Onde deveríamos botar os registros?",
        category: "LAYOUT",
        options: ["direita", "esquerda", "em cima"],
        onChange() {
            log.moveLog();
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Agrupar recursos",
        desc: "Deveríamos categorizar os recursos em grupinhos?",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    smallTable: {
        defaultSetting: false,
        name: "Tabela menor",
        desc: "Deveríamos fazer a tabela de recursos menor?",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    logMessageMax: {
        defaultSetting: 30,
        name: "Registros máximos",
        desc: "Qual é a quantidade máxima de registros ao mesmo tempo?",
        category: "LAYOUT",
        options: [5, 10, 15, 20, 30, 60],
        onChange() {
            log.correctLogLength();
        },
    },

    sidebarWidth: {
        defaultSetting: "30%",
        name: "Largura da barra lateral",
        desc: "Quanto espaço a barra lateral deveria tomar?",
        category: "LAYOUT",
        options: ["25%", "30%", "35%"],
        onChange() {
            const sidebar = $("#sidebar");
            if (SharkGame.Settings.current.showAnimations) {
                sidebar.animate({ width: SharkGame.Settings.current.sidebarWidth }, 100);
            } else {
                sidebar.width(SharkGame.Settings.current.sidebarWidth);
            }
        },
    },

    // APPEARANCE

    notation: {
        defaultSetting: "default",
        name: "Notação numérica",
        desc: "Como que os números deveriam ser formatados?",
        category: "APARÊNCIA",
        options: ["default", /* "exponen", */ "SI"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    colorCosts: {
        defaultSetting: "colorido",
        name: "Cor dos recursos",
        desc: "Como devem ser a cores dos nomes dos recursos?",
        category: "APARÊNCIA",
        options: ["colorido", "brilhante", "sem cor"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    boldCosts: {
        defaultSetting: true,
        name: "Recursos em negrito",
        desc: "O nome dos recursos deveriam ser escritos em negrito?",
        options: [true, false],
        category: "APARÊNCIA",
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    alwaysSingularTooltip: {
        defaultSetting: false,
        name: "Informações singulares",
        desc: "As informações extras deveriam mostrar a produção de apenas uma unidade do recurso?",
        category: "APARÊNCIA",
        options: [true, false],
    },

    tooltipQuantityReminders: {
        defaultSetting: true,
        name: "Informações de quantidade",
        desc: "As informações extras deveriam te mostrar o quanto que você tem de cada coisa?",
        category: "APPEARANCE",
        options: [true, false],
    },

    enableThemes: {
        defaultSetting: true,
        name: "Habilitar estilos customizados",
        desc: "As cores do jogo deveriam ser baseados no mundo em que você está?",
        options: [true, false],
        category: "APARÊNCIA",
        onChange() {
            if (SharkGame.Settings.current.enableThemes) {
                document.querySelector("body").classList.remove("no-theme");
            } else {
                document.querySelector("body").classList.add("no-theme");
            }
        },
    },

    showIcons: {
        defaultSetting: true,
        name: "Mostrar ícones de ação",
        desc: "Mostrar as imagens nos botões de ação?",
        category: "APARÊNCIA",
        options: [true, false],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Mostar imagens de evento",
        desc: "Mostrar arte dos eventos do mundo?",
        category: "APARÊNCIA",
        options: [true, false],
        onChange() {
            SharkGame.TabHandler.changeTab(SharkGame.Tabs.current);
        },
    },

    // ACCESSIBILITY

    language: {
        defaultSetting: "Português",
        name: "Língua",
        desc: "Qual é o idioma do jogo.",
        category: "ACESSIBILIDADE",
        options: ["Português", "English"],
        onChange() {
        },
    },

    doAspectTable: {
        defaultSetting: "árvore",
        name: "Planilha/Árvore de aspectos",
        desc: "Mostrar uma árvore de aspectos, ou uma planilha de aspectos menos acessível?",
        category: "ACESSIBILIDADE",
        options: ["árvore", "planilha"],
    },

    verboseTokenDescriptions: {
        defaultSetting: false,
        name: "Ficha prolixa",
        desc: "Deveria ter um texto apontando onde as fichas estão?",
        category: "ACESSIBILIDADE",
        options: [true, false],
        onChange() {
            res.tokens.updateTokenDescriptions();
        },
    },

    minuteHandEffects: {
        defaultSetting: true,
        name: "Efeitos especiais do ponteiro dos minutos",
        desc: "O ponteiro dos minutos deveria brilhar muito?",
        category: "ACESSIBILIDADE",
        options: [true, false],
        onChange() {
            res.minuteHand.updatePowers();
        },
    },

    // OTHER

    idleEnabled: {
        defaultSetting: true,
        name: "Guardar progresso desligado",
        desc: "O jogo deveria guardar o tempo para uso posterior? (se não, a produção de recursos vai continuar com o jogo desligado e nenhum tempo extra será ganho)",
        category: "OUTROS",
        options: [true, false],
        onChange() {
            res.minuteHand.setup();
        },
    },

    showTooltips: {
        defaultSetting: true,
        name: "Informações extras",
        desc: "Deveríamos mostrar informações sobre ações, recursos e outras coisas quando seu mouse passa por cima?",
        category: "OUTROS",
        options: [true, false],
    },

    updateCheck: {
        defaultSetting: true,
        name: "Conferir atualizações",
        desc: "Deveríamos te notificar de atualizações?",
        category: "OUTROS",
        options: [true, false],
        onChange() {
            clearInterval(SharkGame.Main.checkForUpdateHandler);
            if (SharkGame.Settings.current.updateCheck) {
                SharkGame.Main.checkForUpdateHandler = setInterval(main.checkForUpdates, 300000);
            }
        },
    },

    truePause: {
        defaultSetting: false,
        name: "Pausa verdadeira",
        desc: "Ao usar o aspecto do botão de pausa, deveríamos impedir que isso conte como tempo extra?",
        category: "OUTROS",
        options: [true, false],
    },

    offlineModeActive: {
        defaultSetting: true,
        name: "Progresso desligado",
        desc: "Deveria ter ALGUM tipo de progresso enquanto o jogo está desligado?",
        category: "OUTROS",
        options: [true, false],
    },

    // SAVES (Needs to come last due to hard-coded import/export/wipe buttons at the bottom)

    autosaveFrequency: {
        // times given in minutes
        defaultSetting: 5,
        name: "Frequência de salvamento automático",
        desc: "Número de minutos entre os salvamentos automáticos.",
        category: "SALVAMENTO",
        options: [1, 2, 5, 10, 30],
        onChange() {
            clearInterval(main.autosaveHandler);
            main.autosaveHandler = setInterval(main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
            log.addMessage(
                "Salvando agora a cada " +
                    SharkGame.Settings.current.autosaveFrequency +
                    " minuto" +
                    sharktext.plural(SharkGame.Settings.current.autosaveFrequency) +
                    ".",
            );
        },
    },
};
