"use strict";
SharkGame.Settings = {
    current: {},

    // Internal / No category
    buyAmount: {
        defaultSetting: 1,
        options: [1, 10, 100, -3, -2, -1, "custom"],
    },

    grottoMode: {
        defaultSetting: "simple",
        options: ["simple", "advanced"],
    },

    showPercentages: {
        defaultSetting: "absolute",
        options: ["absolute", "percentage"],
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
        name: "Show Animations",
        desc: "Whether to show animated transitions.",
        category: "PERFORMANCE",
        options: [true, false], // might remove this option? could be a pain to continue supporting it
    },

    // LAYOUT

    minimizedTopbar: {
        defaultSetting: true,
        name: "Minimized Title Bar",
        desc: "Whether to minimize the title bar at the top.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            SharkGame.TitleBarHandler.updateTopBar();
        },
    },

    logLocation: {
        defaultSetting: "right",
        name: "Log Location",
        desc: "Where to put the log.",
        category: "LAYOUT",
        options: ["right", "left", "top"],
        onChange() {
            log.moveLog();
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Group Resources",
        desc: "Whether to categorize resources in the table.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    smallTable: {
        defaultSetting: false,
        name: "Smaller Table",
        desc: "Whether to make the stuff table smaller.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    logMessageMax: {
        defaultSetting: 30,
        name: "Max Log Messages",
        desc: "Max number of messages kept in the log.",
        category: "LAYOUT",
        options: [5, 10, 15, 20, 30, 60],
        onChange() {
            log.correctLogLength();
        },
    },

    sidebarWidth: {
        defaultSetting: "30%",
        name: "Sidebar Width",
        desc: "How much screen space the sidebar should take.",
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
        name: "Number Notation",
        desc: "How numbers should be formatted.",
        category: "APPEARANCE",
        options: ["default", /* "exponen", */ "SI"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    colorCosts: {
        defaultSetting: "color",
        name: "Color Resource Names",
        desc: "How to color names of resources.",
        category: "APPEARANCE",
        options: ["color", "bright", "none"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    boldCosts: {
        defaultSetting: true,
        name: "Bold Resource Names",
        desc: "Should resource names be bolded?",
        options: [true, false],
        category: "APPEARANCE",
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    alwaysSingularTooltip: {
        defaultSetting: false,
        name: "Tooltip Always Singular",
        desc: "Should the tooltip only show what one of each thing produces?",
        category: "APPEARANCE",
        options: [true, false],
    },

    tooltipQuantityReminders: {
        defaultSetting: true,
        name: "Tooltip Amount Reminder",
        desc: "Should tooltips tell you much you own of stuff?",
        category: "APPEARANCE",
        options: [true, false],
    },

    enableThemes: {
        defaultSetting: true,
        name: "Enable Planet-dependent Styles",
        desc: "Should page colors change for different planets?",
        options: [true, false],
        category: "APPEARANCE",
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
        name: "Show Action Button icons",
        desc: "Show button icons?",
        category: "APPEARANCE",
        options: [true, false],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Mostrar arte?",
        category: "APPEARANCE",
        options: [true, false],
        onChange() {
            SharkGame.TabHandler.changeTab(SharkGame.Tabs.current);
        },
    },

    // ACCESSIBILITY

    doAspectTable: {
        defaultSetting: "tree",
        name: "Planilha/Árvore de aspectos",
        desc: "Desenha uma árvore de aspectos, ou uma planilha de aspectos menos acessível?",
        category: "ACCESSIBILITY",
        options: ["tree", "table"],
    },

    verboseTokenDescriptions: {
        defaultSetting: false,
        name: "Ficha prolixa",
        desc: "Deveria ter um texto apontando onde as fichas estão?",
        category: "ACCESSIBILITY",
        options: [true, false],
        onChange() {
            res.tokens.updateTokenDescriptions();
        },
    },

    minuteHandEffects: {
        defaultSetting: true,
        name: "Efeitos especiais do ponteiro dos minutos",
        desc: "O ponteiro dos minutos deveria brilhar muito?",
        category: "ACCESSIBILITY",
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
        category: "OTHER",
        options: [true, false],
        onChange() {
            res.minuteHand.setup();
        },
    },

    showTooltips: {
        defaultSetting: true,
        name: "Informações extras",
        desc: "Deveríamos mostrar informações sobre ações, recursos e outras coisas quando seu mouse passa por cima?",
        category: "OTHER",
        options: [true, false],
    },

    updateCheck: {
        defaultSetting: true,
        name: "Conferir atualizações",
        desc: "Deveríamos te notificar de atualizações?",
        category: "OTHER",
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
        category: "OTHER",
        options: [true, false],
    },

    offlineModeActive: {
        defaultSetting: true,
        name: "Progresso desligado",
        desc: "Deveria ter ALGUM tipo de progresso enquanto o jogo está desligado?",
        category: "OTHER",
        options: [true, false],
    },

    // SAVES (Needs to come last due to hard-coded import/export/wipe buttons at the bottom)

    autosaveFrequency: {
        // times given in minutes
        defaultSetting: 5,
        name: "Frequência de salvamento automático",
        desc: "Número de minutos entre os salvamentos automáticos.",
        category: "SAVES",
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
