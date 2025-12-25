"use strict";
SharkGame.TitleBar = {
    saveLink: {
        name: "salvar",
        main: true,
        onClick() {
            try {
                SharkGame.Save.saveGame();
            } catch (err) {
                log.addError(err);
            }
            log.addMessage("Jogo salvo.");
        },
    },

    optionsLink: {
        name: "opções",
        main: true,
        onClick() {
            SharkGame.PaneHandler.showOptions();
        },
    },

    /*     helpLink: {
        name: "help",
        main: true,
        onClick() {
            SharkGame.PaneHandler.showHelp();
        },
    }, */

    skipLink: {
        name: "pular",
        main: true,
        onClick() {
            if (main.isFirstTime()) {
                // save people stranded on home world
                if (confirm("Você quer reiniciar o seu jogo?")) {
                    // just reset
                    main.resetGame();
                }
            } else if (confirm("Esse mundo está te causando problemas? Você quer voltar para o entre-mundos?")) {
                SharkGame.wonGame = false;
                main.endGame();
            }
        },
    },

    funFactsLink: {
        name: "Fatos curiosos",
        main: false,
        onClick() {
            SharkGame.FunFacts.showFact();
        },
    },

    changelogLink: {
        name: "registro de atualização",
        main: false,
        onClick() {
            SharkGame.PaneHandler.showChangelog();
        },
    },

    /* creditsLink: {
        name: "credits",
        main: false,
        onClick() {
            SharkGame.PaneHandler.addPaneToStack("Credits", SharkGame.Panes.credits);
        },
    }, */ // credits now at bottom of page

    donateLink: {
        name: "doações",
        main: false,
        onClick() {
            SharkGame.PaneHandler.addPaneToStack("Donate", SharkGame.Panes.donate);
        },
    },

    discordLink: {
        name: "discord",
        main: false,
        link: "https://discord.gg/eYqApFkFPY",
    },

    hubLink: {
        name: "para o menu principal",
        main: false,
        onClick() {
            try {
                SharkGame.Save.saveGame();
            } catch (err) {
                log.addError(err);
            }
            log.addMessage("Jogo salvo.");
            window.location.href = "https://shark.tobot.dev/";
        },
    },

    /* noticeLink: {
        name: "notice",
        main: false,
        onClick() {
            SharkGame.PaneHandler.addPaneToStack("v0.2 OPEN ALPHA NOTICE", SharkGame.Panes.notice);
        },
    }, */
};

SharkGame.TitleBarHandler = {
    init() {
        SharkGame.TitleBarHandler.wipeTitleBar();
    },

    correctTitleBar() {
        if (main.isFirstTime()) {
            SharkGame.TitleBar.skipLink.name = "reiniciar";
        } else {
            // and then remember to actually set it back once it's not
            SharkGame.TitleBar.skipLink.name = "pular";
        }
        this.setUpTitleBar();
    },

    updateTopBar() {
        if (SharkGame.Settings.current.minimizedTopbar) {
            document.querySelector("body").classList.add("top-bar");
            $("#wrapper").removeClass("notMinimized");
            $("#tabList").removeClass("notFixed");
        } else {
            document.querySelector("body").classList.remove("top-bar");
            $("#wrapper").addClass("notMinimized");
            $("#tabList").addClass("notFixed");
        }
    },

    wipeTitleBar() {
        $("#titlemenu").empty();
        $("#subtitlemenu").empty();
    },

    setUpTitleBar() {
        const titleMenu = $("#titlemenu");
        const subTitleMenu = $("#subtitlemenu");
        SharkGame.TitleBarHandler.wipeTitleBar();
        $.each(SharkGame.TitleBar, (linkId, linkData) => {
            let option;
            if (linkData.link) {
                option = "<li><a id='" + linkId + "' href='" + linkData.link + "' target='_blank'>" + linkData.name + "</a></li>";
            } else {
                option = "<li><a id='" + linkId + "' href='javascript:;'>" + linkData.name + "</a></li>";
            }
            if (linkData.main) {
                titleMenu.append(option);
            } else {
                subTitleMenu.append(option);
            }
            $("#" + linkId).on("click", linkData.onClick);
        });
    },
};
