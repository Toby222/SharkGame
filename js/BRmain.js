"use strict";
window.SharkGame = window.SharkGame || {};

window.onmousemove = (event) => {
    SharkGame.lastActivity = _.now();

    const tooltip = document.getElementById("tooltipbox");
    const posX = event.clientX;
    const posY = event.clientY;

    tooltip.style.top = Math.max(Math.min(posY - 20, window.innerHeight - tooltip.offsetHeight - 10), 20) + "px";
    // Would clip over right screen edge
    if (tooltip.offsetWidth + posX + 35 > window.innerWidth) {
        tooltip.style.left = posX - 10 - tooltip.offsetWidth + "px";
    } else {
        tooltip.style.left = posX + 15 + "px";
    }
};

$(document).on("keyup", (event) => {
    SharkGame.lastActivity = _.now();

    const mkey = SharkGame.Keybinds.modifierKeys;
    if ((mkey.ShiftLeft || mkey.ShiftRight) && !event.shiftKey) {
        mkey.ShiftLeft = 0;
        mkey.ShiftRight = 0;
    } else if ((mkey.AltLeft || mkey.AltRight) && !event.altKey) {
        mkey.AltLeft = 0;
        mkey.AltRight = 0;
    } else if ((mkey.ControlLeft || mkey.ControlRight) && !event.ctrlKey) {
        mkey.ControlLeft = 0;
        mkey.ControlRight = 0;
    }

    if (SharkGame.Keybinds.handleKeyUp(event.code)) {
        event.preventDefault();
    }
});

$(document).on("keydown", (event) => {
    SharkGame.lastActivity = _.now();
    if (SharkGame.Keybinds.handleKeyDown(event.code)) {
        event.preventDefault();
    }
});

// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(SharkGame, {
    GAME_NAMES: [
        "Domingão do Cação",
        "Tubarão. Jogo. Quer que desenhe?",
        "Chega De Mariscos, De Negar o Meu Desejo",
        "Oceano Clicker",
        "Meu Malvado Poriferido",
        "KND: A Truta do Bairro",
        "Psicobagre Americano",
        "Como Treinar o Seu Salmão",
        "Cação e Planeta",
        "Os Oceanos Vêm de Marte e É Pra Lá Que Eu Vou",
        "'Você Precisa Dar Um Nome Para o Jogo",
        "/tubarão/",
        "Tubarão do Faustão",
        "Um Peixoleiro Chamado Papacu",
        "Tubarão Idle",
        "Marzão Foster Para Amêijoas Imaginárias",
        "Siri-dade Alerta",
        "A Divina Co-mar-dia",
        "Capitão Pacueca",
        "Todo Mundo Odeia o Siris",
        "O Lobo de Mar Street",
        "O Atum da Compadecida",
        "Uma Família da Caçada",
        "Clube da Lula",
        "Programa da Tubalmirinha",
        "Jogo Sem Título de Tubarão",
        "PT: Partido dos Trarraiadores",
        "PCO: Partido da Causa Ouriçária",
        "PCB: Partido Cardumista Brasileiro",
        "PSOL: Partido Socialista da Luliberdade",
        "UP: Unidade Polvular",
        "Novas Fronteiras",
        "Guelra Mundial T",
        "Fuga das Tainhas",
        "Golfinho Pooh e a Árvore de Mar",
        "Golfinho Impact",
        "Tubarão",
        "Cardumão do Huck",
        "Two and Arraia Men",
        "Coral of Duty",
        "Uma História de Amor e Holotúria",
        "Polverwatch",
        "Atum Fortress 2",
        "Diário de um Barbatana",
        "Os Peixinhos Mágicos",
        ":jogo do tubarão:",
        "Kick Tubarovski",
        "Contratando",
        "EM DESENVOLVIMENTO",
        "doo doo do-do do-do",
        "DUNGEONS",
        "A Aventura Continua",
        "Guelra Nas Estrelas",
        "Camarêncio: O Otimista",
        "Bedrock? Edição",
        "Edição Java(script)",
        "Você é um Tubarão",
        "O Códigolfinho da Vinci",
        "Tubarões-Anjos e Demônios",
        "A Culpa é das Enguias",
        "Um Dia de Holotúria",
        "Tudarão Em Todo Lugar Ao Mesmo Tempo",
        "A Viagem de Siri-ro",
        "Vale a Pena Ver de Polvo",
        "Deltubarune",
        "Uma Tainha da Pesada",
        "O Cranguejo e a Rosa",
        "Hollow Náutico: Siri Song",
        "Viva a Sociedade Água-viva",
        "Marmonas Arraiassinas",
        "Até Que a Sorte Nos Siri-pare",
        "Meu Peixado Me Condena",
        "Que História É Essa, Peixat?",
        "Camarães de Areia",
        "Ouriço de Tolo",
        "O Jamantalista",
        "Lagosta dos Cisnes",
    ],
    GAME_NAME: null,
    ACTUAL_GAME_NAME: "Shark Game",
    VERSION: "20250127a",
    ORIGINAL_VERSION: 0.71,
    VERSION_NAME: "A Atualização Tempestuosa",
    EPSILON: 1e-6, // floating point comparison is a joy
    BIGGEST_SAFE_NUMBER: 1000000000000,
    MAX: 1e300,

    IDLE_THRESHOLD: 120000,
    IDLE_FADE_TIME: 5000,

    INTERVAL: 1000 / 10, // 20 FPS // I'm pretty sure 1000 / 10 comes out to 10 FPS
    dt: 1 / 10,
    before: _.now(),
    lastMouseActivity: _.now(),
    savedMouseActivity: _.now(),

    timestampLastSave: false,
    timestampGameStart: false,
    timestampRunStart: false,
    timestampRunEnd: false,
    timestampSimulated: false,

    sidebarHidden: true,
    paneGenerated: false,

    gameOver: false,
    wonGame: false,

    flags: {},
    persistentFlags: {},

    spriteIconPath: "img/sprites.png",
    spriteHomeEventPath: "img/homemessagesprites.png",

    /**
     *
     * @param {any[]} choices
     * @returns {any} A random element of choices
     */
    choose(choices) {
        return choices[Math.floor(Math.random() * choices.length)];
    },
    getImageIconHTML(imagePath, width, height) {
        if (!imagePath) {
            imagePath = "http://placekitten.com/g/" + Math.floor(width) + "/" + Math.floor(height);
        }
        let imageHtml = "";
        if (SharkGame.Settings.current.iconPositions !== "off") {
            imageHtml += "<img width=" + width + " height=" + height + " src='" + imagePath + "' class='button-icon'>";
        }
        return imageHtml;
    },
    changeSprite(spritePath, imageName, imageDiv, backupImageName) {
        let spritesData;

        if (spritePath === SharkGame.spriteIconPath) {
            spritesData = SharkGame.Sprites;
        } else if (spritePath === SharkGame.spriteHomeEventPath) {
            spritesData = SharkGame.HomeMessageSprites;
        }

        let spriteData = spritesData[imageName];
        if (!imageDiv) {
            imageDiv = $("<div>");
        }

        // if the original sprite data is undefined, try loading the backup
        if (!spriteData) {
            spriteData = spritesData[backupImageName];
        }

        if (spriteData) {
            imageDiv.css("background-image", "url(" + spritePath + ")");
            imageDiv.css("background-position", "-" + spriteData.frame.x + "px -" + spriteData.frame.y + "px");
            imageDiv.width(spriteData.frame.w);
            imageDiv.height(spriteData.frame.h);
        } else {
            imageDiv.css("background-image", 'url("//placehold.it/50x50")');
            imageDiv.width(50);
            imageDiv.height(50);
        }
        return imageDiv;
    },
});

SharkGame.Main = {
    tickHandler: -1,
    autosaveHandler: -1,

    applyFramerate() {
        SharkGame.INTERVAL = 1000 / SharkGame.Settings.current.framerate;
        SharkGame.dt = 1 / SharkGame.Settings.current.framerate;
        if (main.tickHandler) {
            clearInterval(main.tickHandler);
        }
        main.tickHandler = setInterval(main.tick, SharkGame.INTERVAL);
    },

    // specifically wipe all progress
    resetGame() {
        SharkGame.Save.wipeSave();
        main.wipeGame();
        main.setUpGame();
    },

    // start the game
    init() {
        // check to see if i forgot to categorize something
        main.checkForCategorizationOversights();

        // wipe it
        main.wipeGame();
        // load a save if needed
        main.restoreGame("load");
        // then set up the game according to this data
        main.setUpGame();

        const isSafari =
            /constructor/i.test(window.HTMLElement) ||
            (!window.safari || (typeof safari !== "undefined" && window.safari.pushNotification)).toString() === "[object SafariRemoteNotification]";
        if (isSafari) {
            console.info("Detected Safari browser!");
            SharkGame.PaneHandler.addPaneToStack("Safari Notice", SharkGame.Panes.safariNotice);
        }
    },

    // reset all game variables to their defaults
    // leaves a blank slate
    wipeGame() {
        const now = _.now();
        SharkGame.before = now;
        SharkGame.timestampSimulated = now;
        SharkGame.lastActivity = now;
        if (SharkGame.GAME_NAME === null) {
            SharkGame.GAME_NAME = SharkGame.choose(SharkGame.GAME_NAMES);
            document.title = SharkGame.ACTUAL_GAME_NAME + ": " + SharkGame.GAME_NAME;
        }

        SharkGame.timestampLastSave = now;
        SharkGame.timestampGameStart = now;
        SharkGame.timestampRunStart = now;

        $("#game").removeClass("inGateway");
        $("#sidebar").hide();
        $("#overlay").hide();
        $("#idle-overlay").hide();
        SharkGame.sidebarHidden = true;
        // remove any errant classes
        $("#pane").removeClass("gateway");

        // clear any html and remove errant classes from tooltip
        $("#tooltipbox")
            .removeClass("forHomeButtonOrGrotto")
            .removeClass("forIncomeTable")
            .removeClass("forAspectTree")
            .removeClass("forAspectTreeUnpurchased")
            .removeClass("forAspectTreeAffordable")
            .html("");

        $("#gameName").html("- " + SharkGame.GAME_NAME + " -");
        $("#versionNumber").html(
            `New Frontiers v ${SharkGame.VERSION} - ${SharkGame.VERSION_NAME}<br/>\
Mod of v ${SharkGame.ORIGINAL_VERSION}`,
        );
        $.getJSON("https://api.github.com/repos/Toby222/SharkGame/commits/dev", (data) => {
            SharkGame.COMMIT_SHA = data.sha;
        });
        log.clearMessages(false);
        SharkGame.Settings.current.buyAmount = 1;

        // here to stop timer from saying NaN
        SharkGame.persistentFlags.totalPausedTime = 0;
        SharkGame.persistentFlags.currentPausedTime = 0;

        // wipe all resource tables
        SharkGame.Resources.init();

        // initialise world
        // MAKE SURE GATE IS INITIALISED AFTER WORLD!!
        SharkGame.World.init();

        // reset planetpool and completed worlds and gameover and wongame
        SharkGame.Gateway.init();

        // create homeEvent lookup
        SharkGame.Memories.init();

        // generate requiredBy entries
        SharkGame.AspectTree.init();

        // initialise tabs
        SharkGame.Home.init();
        SharkGame.Lab.init();
        SharkGame.Stats.init();
        SharkGame.Recycler.init();
        SharkGame.Gate.init();
        SharkGame.Reflection.init();
        SharkGame.CheatsAndDebug.init();

        // clear flags
        SharkGame.flags = {};
        SharkGame.persistentFlags = {};

        SharkGame.EventHandler.init();

        SharkGame.TitleBarHandler.init();
        SharkGame.TabHandler.init();
        SharkGame.PaneHandler.init();
        SharkGame.OverlayHandler.init();

        SharkGame.Keybinds.init();

        SharkGame.Resources.minuteHand.init();
        SharkGame.Resources.pause.init();
        SharkGame.Resources.dial.init();
    },

    // load stored game data, if there is anything to load
    restoreGame(goal) {
        switch (goal) {
            case "load":
                if (SharkGame.Save.savedGameExists()) {
                    try {
                        SharkGame.Save.loadGame();
                        log.addMessage("Jogo carregado.");
                    } catch (err) {
                        log.addError(err);
                    }
                }
                break;
            case "loop":
                // idk yet
                break;
            default:
            // nothing to restore
        }
    },

    // interpret and use the data from the previous steps
    setUpGame() {
        const now = _.now();
        SharkGame.timestampLastSave = SharkGame.timestampLastSave || now;
        SharkGame.timestampGameStart = SharkGame.timestampGameStart || now;
        SharkGame.timestampRunStart = SharkGame.timestampRunStart || now;

        // first set up the world because it adds the world resource
        SharkGame.World.setup();

        // refund aspects if necessary
        // create restrictions
        SharkGame.AspectTree.setup();

        SharkGame.Memories.setup();

        // now set up resources because a lot depends on it
        SharkGame.Resources.setup();

        // initialise tabs
        // always set up lab first
        SharkGame.Lab.setup();
        SharkGame.Home.setup();
        SharkGame.Stats.setup();
        SharkGame.Recycler.setup();
        SharkGame.Gate.setup();
        SharkGame.Reflection.setup();
        SharkGame.CheatsAndDebug.setup();

        SharkGame.Resources.minuteHand.setup();
        SharkGame.Resources.tokens.setup();

        SharkGame.EventHandler.setup();

        // end game if necessary
        SharkGame.Gateway.setup();

        // rename a game option if this is a first time run
        SharkGame.TitleBarHandler.correctTitleBar();

        // apply tick settings
        main.applyFramerate();

        // apply settings
        $.each(SharkGame.Settings, (settingId, settingData) => {
            if (_.isUndefined(SharkGame.Settings.current[settingId])) {
                SharkGame.Settings.current[settingId] = settingData.defaultSetting;
                if (typeof settingData.onChange === "function") {
                    settingData.onChange();
                }
            }
        });

        SharkGame.TitleBarHandler.updateTopBar();

        if (main.autosaveHandler === -1) {
            main.autosaveHandler = setInterval(main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
        }

        // window.addEventListener("beforeunload", main.autosave);

        if (SharkGame.Settings.current.updateCheck) {
            main.checkForUpdateHandler = setInterval(main.checkForUpdate, 300000);
        }

        $("#title").on("click", (event) => {
            if (event.clientX < 100 && event.clientY > 150 && event.clientY < 200) {
                event.currentTarget.classList.add("radical");
            }
        });

        if (!SharkGame.persistentFlags.dialSetting) SharkGame.persistentFlags.dialSetting = 1;

        if (SharkGame.persistentFlags.pause) {
            if (!cad.pause) {
                res.pause.togglePause();
            }
            main.showSidebarIfNeeded();
            if (SharkGame.flags.needOfflineProgress && SharkGame.Settings.current.truePause) {
                SharkGame.persistentFlags.currentPausedTime += SharkGame.flags.needOfflineProgress * 1000;
                SharkGame.flags.needOfflineProgress = 0;
            }
        }

        if (SharkGame.flags.needOfflineProgress && SharkGame.Settings.current.offlineModeActive && !SharkGame.gameOver) {
            const secondsElapsed = SharkGame.flags.needOfflineProgress;

            if (SharkGame.Settings.current.idleEnabled) {
                res.minuteHand.allowMinuteHand();
                res.minuteHand.updateMinuteHand(secondsElapsed * 1000);
                if (SharkGame.Aspects.overtime.level) {
                    res.minuteHand.updateMinuteHand(secondsElapsed * 200 * SharkGame.Aspects.overtime.level);
                    res.minuteHand.addBonusTime(secondsElapsed * 200 * SharkGame.Aspects.overtime.level);
                }
            } else {
                main.processSimTime(secondsElapsed / SharkGame.persistentFlags.dialSetting, true);
            }

            // acknowledge long time gaps
            // (update these messages some time later)
            if (secondsElapsed > 3600) {
                let notification = "Bem vindo de volta! Há ";
                const numHours = Math.floor(secondsElapsed / 3600);
                if (numHours > 24) {
                    const numDays = Math.floor(numHours / 24);
                    if (numDays > 7) {
                        const numWeeks = Math.floor(numDays / 7);
                        if (numWeeks > 4) {
                            const numMonths = Math.floor(numWeeks / 4);
                            if (numMonths > 12) {
                                const numYears = Math.floor(numMonths / 12);
                                notification +=
                                    "quase " +
                                    (numYears === 1 ? "um" : numYears) +
                                    " ano" +
                                    sharktext.plural(numYears) +
                                    ", obrigado por lembrar de nós!";
                            } else {
                                notification +=
                                    "mais ou menos " +
                                    (numMonths === 1 ? "um mês" : numMonths + " meses") +
                                    ", está ficando meio apertado aqui.";
                            }
                        } else {
                            notification +=
                                "já " + (numWeeks === 1 ? "uma" : numWeeks) + " semana" + sharktext.plural(numWeeks) + ", você ficou um tempinho fora!";
                        }
                    } else {
                        notification +=
                            (numDays === 1 ? "um" : numDays) + " dia" + sharktext.plural(numDays) + ", olha só tudo que foi produzido até agora!";
                    }
                } else {
                    notification += (numHours === 1 ? "uma" : numHours) + " hora" + sharktext.plural(numHours) + " desde a última vez que te vimos!";
                }
                log.addMessage(notification);
            }
            SharkGame.flags.needOfflineProgress = 0;
        }

        // set up tab after load
        SharkGame.TabHandler.setUpTab();
    },

    purgeGame() {
        // empty out all the containers!
        $("#status").empty();
        log.clearMessages();
        $("#content").empty();
    },

    loopGame() {
        $("body").css("overscroll-behavior-x", "unset");
        if (SharkGame.gameOver) {
            SharkGame.persistentFlags.totalPausedTime = 0;
            SharkGame.persistentFlags.currentPausedTime = 0;

            // populate save data object
            let saveString = "";
            const saveData = {
                version: SharkGame.VERSION,
                resources: {},
                world: { type: world.worldType },
                aspects: {},
            };

            _.each(SharkGame.ResourceCategories.special.resources, (resourceName) => {
                saveData.resources[resourceName] = {
                    amount: res.getResource(resourceName),
                    totalAmount: res.getTotalResource(resourceName),
                };
            });

            _.each(SharkGame.Aspects, ({ level }, aspectId) => {
                if (level) saveData.aspects[aspectId] = level;
            });

            saveData.settings = _.cloneDeep(SharkGame.Settings.current);

            saveData.completedWorlds = _.cloneDeep(SharkGame.Gateway.completedWorlds);
            saveData.persistentFlags = _.cloneDeep(SharkGame.persistentFlags);
            saveData.planetPool = _.cloneDeep(gateway.planetPool);

            // add timestamp
            saveData.timestampLastSave = _.now();
            saveData.timestampGameStart = SharkGame.timestampGameStart;
            saveData.timestampRunStart = _.now();
            saveData.timestampRunEnd = SharkGame.timestampRunEnd;

            saveData.keybinds = _.cloneDeep(SharkGame.Keybinds.keybinds);

            saveData.saveVersion = SharkGame.Save.saveUpdaters.length - 1;
            saveString = ascii85.encode(pako.deflate(JSON.stringify(saveData), { to: "string" }));

            SharkGame.Save.importData(saveString);

            res.minuteHand.applyHourHand();
            res.minuteHand.giveRequestedTime();

            try {
                SharkGame.Save.saveGame();
                log.addMessage("Game saved.");
            } catch (err) {
                log.addError(err);
            }
        }
    },

    tick() {
        if (cad.stop) {
            return;
        }

        const now = _.now();
        const elapsedTime = now - SharkGame.before;

        if (cad.pause) {
            if (SharkGame.Settings.current.truePause) {
                SharkGame.persistentFlags.currentPausedTime += elapsedTime;
            } else {
                if (!SharkGame.persistentFlags.everIdled) {
                    res.minuteHand.allowMinuteHand();
                }
                res.minuteHand.updateMinuteHand(elapsedTime * (1 + SharkGame.Aspects.overtime.level * 0.2));
                res.minuteHand.addBonusTime(elapsedTime * SharkGame.Aspects.overtime.level * 0.2);
            }
            SharkGame.before = now;
            SharkGame.lastActivity = now;
            switch (SharkGame.Tabs.current) {
                case "home":
                    $.each($("#buttonList").children(), (_index, button) => {
                        $(button).addClass("disabled");
                    });
                    break;
                case "lab":
                    $.each($("#buttonList").children(), (_index, button) => {
                        $(button).addClass("disabled");
                    });
                    break;
                case "recycler":
                    $.each($("#inputButtons").children(), (_index, button) => {
                        $(button).addClass("disabled");
                    });
                    $.each($("#outputButtons").children(), (_index, button) => {
                        $(button).addClass("disabled");
                    });
                    break;
                default:
                    SharkGame.Tabs[SharkGame.Tabs.current].code.update();
            }
            res.updateResourcesTable();
            return;
        }

        if (!SharkGame.gameOver) {
            SharkGame.EventHandler.handleEventTick("beforeTick");

            if (SharkGame.persistentFlags.currentPausedTime) {
                SharkGame.persistentFlags.totalPausedTime += SharkGame.persistentFlags.currentPausedTime;
                SharkGame.persistentFlags.currentPausedTime = 0;
            }

            // tick main game stuff
            if (now - SharkGame.lastActivity > SharkGame.IDLE_THRESHOLD && res.idleMultiplier === 1 && SharkGame.Settings.current.idleEnabled) {
                main.startIdle(now, elapsedTime);
            }

            if (res.idleMultiplier < 1) {
                main.continueIdle(now, elapsedTime);
            }

            if (res.minuteHand.active) {
                res.minuteHand.updateMinuteHand(elapsedTime);
            } else if (SharkGame.Aspects.overtime.level) {
                res.minuteHand.updateMinuteHand(elapsedTime * 0.2 * SharkGame.Aspects.overtime.level);
                res.minuteHand.addBonusTime(elapsedTime * 0.2 * SharkGame.Aspects.overtime.level);
            }

            // check if the sidebar needs to come back
            if (SharkGame.sidebarHidden) {
                main.showSidebarIfNeeded();
            }

            if (elapsedTime > SharkGame.INTERVAL) {
                // Compensate for lost time.
                main.processSimTime(SharkGame.dt * (elapsedTime / SharkGame.INTERVAL));
            } else {
                main.processSimTime(SharkGame.dt);
            }

            res.updateResourcesTable();

            const tabCode = SharkGame.Tabs[SharkGame.Tabs.current].code;
            tabCode.update();

            SharkGame.TabHandler.checkTabUnlocks();

            SharkGame.before = now;

            SharkGame.EventHandler.handleEventTick("afterTick");
        } else {
            SharkGame.lastActivity = _.now();
        }

        // see if resource table tooltip needs updating
        if (document.getElementById("tooltipbox").className.split(" ").includes("forIncomeTable")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                res.tableTextEnter(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    startIdle(now, elapsedTime) {
        const idleOverlay = $("#idle-overlay");
        idleOverlay.addClass("pointy").removeClass("click-passthrough");
        idleOverlay.on("click", main.endIdle);
        if (idleOverlay.is(":hidden")) {
            $("#minute-hand-div").addClass("front");
            idleOverlay.show().css("opacity", 0).animate({ opacity: 0.8 }, SharkGame.IDLE_FADE_TIME);
        }
        res.minuteHand.toggleOff();
        SharkGame.savedMouseActivity = SharkGame.lastActivity;
        main.continueIdle(now, elapsedTime);
    },

    continueIdle(now, elapsedTime) {
        const speedRatio = Math.min((now - SharkGame.savedMouseActivity - SharkGame.IDLE_THRESHOLD) / SharkGame.IDLE_FADE_TIME, 1);
        res.idleMultiplier = 1 - speedRatio;

        if (speedRatio > 0.8 && !SharkGame.persistentFlags.everIdled) {
            res.minuteHand.allowMinuteHand();
        }
        res.minuteHand.updateMinuteHand(elapsedTime * speedRatio);
    },

    endIdle() {
        const idleOverlay = $("#idle-overlay");
        if (!idleOverlay.is(":hidden")) {
            idleOverlay.stop(true).animate({ opacity: 0 }, 800, () => {
                $("#minute-hand-div").removeClass("front");
                idleOverlay.hide().stop(true);
            });
        }
        idleOverlay.removeClass("pointy").addClass("click-passthrough");
        SharkGame.lastActivity = _.now();
        res.idleMultiplier = 1;
    },

    processSimTime(numberOfSeconds, load = false) {
        // income calculation
        res.processIncomes(numberOfSeconds, false, load);
    },

    autosave() {
        try {
            SharkGame.Save.saveGame();
            log.addMessage("Salvamento automático.");
        } catch (err) {
            log.addError(err);
        }
    },

    checkForUpdate() {
        $.getJSON("https://api.github.com/repos/Toby222/SharkGame/commits/dev", (data) => {
            if (data.sha !== SharkGame.COMMIT_SHA) {
                $("#updateGameBox")
                    .html(
                        `Você vê uma atualização nadando até você.<br> Nela, você só consegue decifrar as palavras <br>"${
                            data.commit.message.split("\n")[0]
                        }". <br>Clique para atualizar.`,
                    )
                    .on("click", () => {
                        try {
                            SharkGame.Save.saveGame();
                            history.go(0);
                        } catch (err) {
                            log.addError(err);
                            console.error(err);
                            log.addMessage("Algo deu errado ao salvar.");
                        }
                    });
            }
        });
    },

    createBuyButtons(customLabel, addToWhere, appendOrPrepend, absoluteOnly) {
        if (!addToWhere) {
            log.addError("Attempted to create buy buttons without specifying what to do with them.");
            return;
        }

        // add buy buttons
        const buttonList = $("<ul>").attr("id", "buyButtons");
        switch (appendOrPrepend) {
            case "append":
                addToWhere.append(buttonList);
                break;
            case "prepend":
                addToWhere.prepend(buttonList);
                break;
            default:
                log.addError("Attempted to create buy buttons without specifying whether to append or prepend.");
                return;
        }
        _.each(SharkGame.Settings.buyAmount.options, (amount) => {
            if (amount < 0 && absoluteOnly) {
                return true;
            }

            const disableButton = amount === SharkGame.Settings.current.buyAmount;
            buttonList.append(
                $("<li>").append(
                    $("<button>")
                        .addClass("min" + (disableButton ? " disabled" : ""))
                        .attr("id", "buy-" + amount),
                ),
            );
            let label = customLabel ? customLabel + " " : "buy ";
            if (amount < 0) {
                if (amount < -2) {
                    label += "1/3 max";
                } else if (amount < -1) {
                    label += "1/2 max";
                } else {
                    label += "max";
                }
            } else if (amount === "custom") {
                label += "custom";
            } else {
                label += sharktext.beautify(amount);
            }
            $("#buy-" + amount)
                .html(label)
                .on("click", function callback() {
                    const thisButton = $(this);
                    if (thisButton.hasClass("disabled")) return;
                    if (thisButton[0].id === "buy-custom") {
                        $("#custom-input").attr("disabled", false);
                    } else {
                        $("#custom-input").attr("disabled", true);
                    }
                    SharkGame.Settings.current.buyAmount = amount === "custom" ? "custom" : parseInt(thisButton.attr("id").slice(4));
                    $("button[id^='buy-']").removeClass("disabled");
                    thisButton.addClass("disabled");
                })
                .on("mouseenter", () => {
                    $("#tooltipbox").html(`${label} amount of things`);
                })
                .on("mouseleave", () => {
                    $("#tooltipbox").html("");
                });
        });
        buttonList.append(
            $("<li>").append(
                $("<input>")
                    .prop("type", "number")
                    .attr("id", "custom-input")
                    .attr("value", 1)
                    .attr("min", "1")
                    .attr("disabled", SharkGame.Settings.current.buyAmount !== "custom"),
            ),
        );
        document.getElementById("custom-input").addEventListener("input", main.onCustomChange);
        if (SharkGame.Settings.current.customSetting) {
            $("#custom-input")[0].value = SharkGame.Settings.current.customSetting;
        }
    },

    onCustomChange() {
        SharkGame.Settings.current.customSetting = $("#custom-input")[0].value;
    },

    showSidebarIfNeeded() {
        // if we have any non-zero resources, show sidebar
        // if we have any log entries, show sidebar
        if (res.haveAnyResources()) {
            // show sidebar
            if (SharkGame.Settings.current.showAnimations) {
                $("#sidebar").show("500");
            } else {
                $("#sidebar").show();
            }
            res.rebuildTable = true;
            // flag sidebar as shown
            SharkGame.sidebarHidden = false;
        }
    },

    endGame(loadingFromSave) {
        // stop autosaving
        clearInterval(main.autosaveHandler);
        main.autosaveHandler = -1;

        // flag game as over
        SharkGame.gameOver = true;

        // grab end game timestamp
        if (!loadingFromSave) {
            SharkGame.timestampRunEnd = _.now();
        }

        // kick over to passage
        gateway.enterGate(loadingFromSave);
    },

    isFirstTime() {
        return world.worldType === "start" && res.getTotalResource("essence") <= 0;
    },

    resetTimers() {
        SharkGame.timestampLastSave = _.now();
        SharkGame.timestampGameStart = _.now();
        SharkGame.timestampRunStart = _.now();
    },

    shouldShowTooltips() {
        if (!(main.isFirstTime() && res.getResource("shark") < 5)) {
            SharkGame.persistentFlags.tooltipUnlocked = true;
        }
        return SharkGame.persistentFlags.tooltipUnlocked;
    },

    checkForCategorizationOversights() {
        $.each(SharkGame.ResourceTable, (resourceName, resourceObj) => {
            if (!res.getCategoryOfResource(resourceName)) {
                log.addError(new Error(`${resourceName} não tem categoria.`));
            }

            if (!resourceObj.desc) {
                log.addError(new Error(`${resourceName} não tem descrição.`));
            }

            if (!resourceObj.name || !resourceObj.singleName) {
                log.addError(new Error(`${resourceName} não tem nome.`));
            }
        });
        _.each(SharkGame.Gateway.allowedWorlds, (worldName) => {
            $.each(SharkGame.HomeActions[worldName], (actionName) => {
                if (!home.getActionCategory(actionName)) {
                    log.addError(new Error(`${actionName} não tem categoria.`));
                }
            });
        });
    },
};

SharkGame.Button = {
    makeHoverscriptButton(id, name, div, handler, hhandler, huhandler) {
        return $("<button>")
            .html(name)
            .attr("id", id)
            .addClass("hoverbutton")
            .appendTo(div)
            .on("click", handler)
            .on("mouseenter", hhandler)
            .on("mouseleave", huhandler);
    },

    makeButton(id, name, div, handler) {
        return $("<button>").html(name).attr("id", id).appendTo(div).on("click", handler);
    },
};

SharkGame.Changelog = {
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20250630a": [
        "Consertar progressão quebrada do Oceano Abandonado",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20250629a": [
        "Um monte de imagens pendentes foram adicionadas, cortesia de <a href='https://github.com/glowkate'>Glowkate</a> e <a href='https://www.youtube.com/@biggestbrian'>BiggestBrian</a>",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20250127a": [
        "Uma nova imagem de progressão de mundo foi adicionada, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20241214a": [
        "2 novas imagens foram adicionadas, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20241128a": [
        "Adicionamos mais uma nova imagem, cortesia de <a href='https://www.youtube.com/@WorkerDroneMainBattleTrain'>Main Battle Train</a>.",
        "Adicionamos mais duas novas imagens, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20241119a": [
        "Adicionamos mais uma nova imagem, cortesia de <a href='https://www.youtube.com/@WorkerDroneMainBattleTrain'>Main Battle Train</a>.",
        "Adicionamos mais uma nova imagem, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20241106a": [
        "Adicionamos uma nova imagem, cortesia de <a href='https://www.youtube.com/@WorkerDroneMainBattleTrain'>Main Battle Train</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20240909a": [
        "Adicionamos mais uma nova imagem, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>!",
        "Muitos fatos interessantes foram adicionados.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20240906a": [
        "Adicionamos mais 4 novas imagens, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>!",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20240819a": [
        "Adicionamos mais uma nova imagem, cortesia de <a href='https://github.com/glowkate'>Glowkate</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20240818a": [
        "Adicionamos mais uma imagem de progressão de mundo, cortesia de <a href='https://x.com/stormwalker124'>stormwalker</a>.",
        "Adicionamos uma imagem para os pares de espadas, courtesia de <a href='https://github.com/glowkate'>Glowkate</a>.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20240805a": [
        "Adicionamos uma nova imagem de progressão de mundo, cortesia de <a href='https://x.com/stormwalker124'>stormwalker</a>.",
        "Consertamos um problema em que a imagem no Paradiso não estava aparecendo.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20240803a": [
        "Adicionamos uma nova melhoria ao mundo inicial: Pá de Cristal, para acelerar bastante a progressão e fomentar uma competição entre caranguejos e arraias laser mais interessante.",
        "Adicionamos mais 4 novas imagens, cortesia de <a href='https://x.com/stormwalker124'>stormwalker</a>.",
        "Fizemos algumas mudanças para imagens antigas.",
        "Isso aconteceu em janeiro e não falamos nada, mas: consertamos os problema do tempo negativo.",
        "Consertamos um problema em que as imagens no Oceano Vulcânico não apareciam.",
        "Consertamos um problema em que as imagens no Oceano Marinho não apareciam.",
        "Consertamos o ícone dos filtros de esponja não aparecer.",
        "Consertamos o ícone de arrancar esponja desaparecendo no Mundo Vulcânico.",
        "Editamos os pré-requisitos de algumas mensagens de progressão",
        "Editamos o texto do final dos mundos Escuro e Abandonado.",
        "Editamos alguns nomes de aba que estavam meio aleatórios.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20230618a": [
        "Adicionamos os Oceano Tempestuoso.",
        "Adicionamos o histórico de progressão. Você consegue voltar e desvoltar livremente na história de cada mundo.",
        "Pela milionésima vez, tentamos arrumar o problema do tempo negativo (e falhamos).",
        "Muitas imagens novas.",
        "Novos fatos.",
        "Consertamos problemas devido a ações sem categoria.",
        "Consertamos a ficha mostrar nomes internos.",
        "Desabilitar progresso desligado agora desabilita progresso quando o jogo está desligado.",
        "Consertamos erros relacionados com pausa e o reciclador.",
        "Editamos vários textos.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220712a": [
        "Tempo extra pode persistir entre os mundos, mas com algumas ressalvas.",
        "Adicionamos 3 aspectos novos para complementar as mudanças ao ponteiro dos minutos.",
        "Mudamos o preço e o local de aspectos na árvore.",
        "Disabilitar tempo ocioso contando no ponteiro dos minutos não remove o ele da existência mais.",
        "Adicionamos a opção de usar Notação Científica.",
        "Informações extras não ficam presas na tela ao trocar de aba com atalhos do teclado.",
        "Consertamos um problema em que o registro mostra erros ao tentar desabilitar enquanto pausado.",
        "Melhoramos a árvore de aspectos em dispositivos com tela sensível ao toque.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220630a": [
        "Adicionamos a opção de não ganhar tempo extra ao pausar pelo botão.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220629a": [
        "Arrumamos o problema de um certo botão de esponja não aparecendo.",
        "Consertamos um problema relacionado a apertar botões que não existem.",
        "Mexemos no botão de pausa, que agora ativa o modo ocioso a qualquer momento.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220625a": [
        "Adicionamoso Oceano Vulcânico.",
        "Adicionamos FATOS! Aperte para ganhar um fato interessante aleatório! Diferentes fatos vão aparecer dependendode onde você está e o que você tem!",
        "Tempo com o jogo desligado ou ocioso não conta mais como tempo gasto num mundo. Esse tempo extra só é contado se usado pelo ponteiro dos minutos (tempo extra ganho pelo aspecto 'ponteiro das horas' é excluído da conta).",
        "Informações extras na tabela de recursos agora mostram como outros recursos influenciam sua produção.",
        "Começamos a (mas nunca terminamos de) adicionar arte temporária para suplementar arte completa.",
        "Tiramos o aviso de alfa.",
        "Adicionamos o link para o menu principal na barra de título.",
        "Novos créditos (olha lá embaixo da tela).",
        "Consertamos vários erros que precisavam de conserto.",
        "Terminamos muitos outros afazeres.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220603a": [
        "Adicionamos o Oceano Marinho.",
        "Descrições rias são muito mais vagas até você visitá-las.",
        "Previsão Profunda agora especifica as descrições dos planetas.",
        "Mudamos a ordem de alguns aspectos na árvore.",
        "Mexemos no final da história do Oceano Abandonado.",
        "Revisamos em partes da história do Oceano Escuro.",
        "O Oceano Abandonado dá uma essência extra, aumtenando sua recompensa de exploração para 5 e de não-exploração para 3.",
        "Por demanda popular, nós botamos a transmutadora automática no Escuro.",
        "Arrumamos vários probleminhas miscelâneos.",
        "Ixbix - tweaked text visibility system",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20220125a": [
        "Adicionamos atalhos de teclado. Você pode ligar um monte de ações diferentes para combinações de teclas customizadas.",
        "Adicionamos salvamentos de segurança. Você pode copiar seu jogo a qualquer momento em um de três espaços de salvamento!",
        "Adicionamos nomes de espécies/famílias reais ao recrutar ouriços e lulas, ao invés de apenas ter mensagens estranhas no lugar.",
        "When first unlocking cheats at 1000 lifetime essence, a special backup is automatically created.",
        "Fizemos uma opção para esconder trapaças; você não precisa vê-los se não quiser.",
        "Mudamos algumas coisas na interface.",
        "Aspecto removido: 'Anything and Everything' (não traduzido)",
        "Ixbix - fixed issues with gateway time spent in last world",
        "Ixbix - stopped minute hand slider from flopping around",
        "Ixbix - added touchscreen support for the aspect tree",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20211201a": [
        "Algo especial acontece ao chegar em 1000 de essence total.",
        "Tiramos botões desnecessários da árvore de aspectos.",
        "Consertamos alguns problemas causados pelos aspectos Paciência e Culhões.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20211109a": [
        "Última reforma da árvore de aspectos. Porém não a última adição, não confunda.",
        "Adicionamos o modo ocioso. O jogo vai pausar e acumular tempo extra após 2 minutos sem atividade.",
        "O ponteiro dos minutos agora guarda tempo extra quando o jogo está desligado ou ocioso. Você pode usar esse tempo como um multiplicador de produção.",
        "Removemos a escolha de modo de jogo porque o sistema de tempo ocioso funciona melhor para isso",
        "Implementamos exploração. Você ganha mais essência ao completar um mundo pela primeira vez, mas ALGUNS aspectos não podem ser usados.",
        "Implementamos tempo a par. Se você sair do mundo antes do par, você é recompensado com essência extra. Quanto mais rápido, maior recompensa.",
        "Adicionamos e mudamos imagens.",
        "Atualizamos interface.",
        "Arrumamos textinhos que não encaixavam direito.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210814a": [
        "Botamos o Oceano Escuro.",
        "Significantemente melhoramos os aspectos e sua árvore. Porém tivemos que reembolsar a essência de todos os aspectos já comprados. Deculpinha!",
        "Você pode escolher um 'modo de jogo'. O jogo vai ajustar seu ritmo baseado na sua escolha.",
        "Agora você pode acessar as configurações no entre-mundos.",
        "'Limpar Jogo' agora não reinicia sua configurações. Fizemos um botão diferente para redefinir as configurações.",
        "Adicionamos imagens.",
        "Arrumamos estabilidade do jogo ao lidar com números grandes (acima de quadrilhão).",
        "Arrumamos problemas com limpeza do jogo e reinícios.",
        "Arrumamos problemas com a gruta.",
        "Arrumamos problemas com informações extras na árvore de aspectos.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210728a": [
        "The log can now be in one of 3 spots. Change which one in options. Default is now right side.",
        "Adicionamos informações extras na influência de recursos na produção; aponte o seu rato na coluna R da tabela da gruta (no modo avançado) e você poderá ver o que está a afetando.",
        "Adicionamos uma tabela de aspectos funcional (porém ainda não terminada) como alternativa à árvore, especificamente por acessibilidade.",
        "Adicionamos ícone para o time de extração.",
        "Adicionamos ícone para historiador; estamos reutilizando o ícone velho do filósofo do jogo original.",
        "Atualizamos a formatação das informações extras.",
        "Atualizamos a interface do reciclador para acabar com estranhezas.",
        "Consertamos o problema de custos sumires no modo sem ícones.",
        "Consertamos a descrição errada de um aspecto.",
        "Consertamos problemas com a importação de jogos.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210713a": [
        "Informações extras agora mostram quanto você já tem do que você está comprando. Pode ser desligado nas configurações.",
        "Informações extras tem seus números escalarem baseado no quanto você comprou. Pode ser desligado nas configurações.",
        "O botão para modo avançado da gruta foi melhorado... Seja lá o que isso significa.",
        "Abas que você ainda não viu vão brilhar. Isso ocorre por mundo.",
        "Fizemos algo com as barras de deslizamento.",
        "Mudamos a ordem de categorias na tabela de recursos de forma a fazer mais sentido.",
        "Você pode fechar janelas ao clicar fora delas.",
        "Menu de opções é menos prolixo.",
        "Corrigimos um monte de descrições de melhorias.",
        "Consertamos alguns probleminhas, nada de mais.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210709a": [
        "Adicionamos o Oceano Gélido.",
        "Substituimos o sistema de Artefatos com o sistema de Aspectos.",
        "Arrumamos Oceano Paradisíaco.",
        "Arrumamos cores de interface.",
        "A gruta agora mostra como o mundo afeta seus recursos.",
        "Movemos algumas coisas da interface para fazer com que o jogo pare de enfelismente se espindure em telas menores.",
        "Moved buy amount buttons closer to the places you'll need them, they're not in the tab list anymore!",
        "Adicionamos o modo 'claro' ao texto, algumas cores vão a merda mas faz o texto colorido em si mais fácil de ler.",
        "Adicionamos o ajustador de cor visível automático-inator. Serve para mudar ligeiramente a cor de um texto se a cor de fundo torná-lo difícil de ler.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210610a": [
        "Oceano Paradisíaco agora dá essência.",
        "Mudamos um pouco alguns textos da história.",
        "Sumimos com algumas notas de atualização.",
        "Adicionamos ícone para polvo investigador.",
        "Coisas internas.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210515a": ["Adicionamos texto faltante.", "Fizemos coisas internas."],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210422a": [
        "Refizemos a jogabilidade do Oceano Paradisíaco.",
        "Mudanças enormes foram feitas à interface gráfica.",
        "Melhoramos a formatação da gruta.",
        "Mudamos as cores do Oceano Paradisíaco.",
        "Quantia de produtores atualizam na gruta em tempo real.",
        "Ambos tipos de informações extras atualizam em tempo real.",
        "Informações extras estão mais infomativas: por exemplo, agora mostra quanta ciência se consegue por holotúria.",
        "Adicionamos barra de título minimizada. Dá para mudar para título antigo nas configurações.",
        "Adicionamos categorias para o menu de configurações. Agora está legível!",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210314a": [
        "Consertamos erro relacionado a como artefatos são mostrados na gruta.",
        "Consertamos erro de efeitos de artefatos não sendo aplicados direito.",
        "Consertamos o erro em que a gruta mostrava um multiplicador de melhoria permanentemente para tudo, mesmo que fosse x1.",
        "Consertamos erro que poderes de artefatos não iriam sumir ao importar um jogo.",
        "Adicionamos o 'GANHO POR' à gruta simples. Mostra quanto de um recurso você ganha por gerador.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210312a": [
        "Adicionamos a gruta simplificada.",
        "Fizemos a gruta muito mais inteligível.",
        "Adicionamos informações extras à tabela de produção.",
        "Trabalho interno sobre o sistema de multiplicadores, criamos o sistema de modificadores.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 - New Perspectives (2021/??/??)": [
        "Apagamos o Oceano Caótico. Completamente.",
        "Refizemos a jogabilidade de 1 dos 7 planetas que precisam.",
        "Implementamos novos 'assets' (o tradutor também não faz ideia do que eles estão falando).",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.11 - New Foundations (2021/1/27)": [
        "Melhoramos a interface de tudo.",
        "Rebalanceamos coisas.",
        "Adicionamos fundos temáticos, a página agora muda de cor baseado no mundo que você está jogando.",
        "Adicionamos opção de FPS/TPS, para fazer o jogo mais liso e bonito, ou mais grosseiro, mas performar melhor.",
        "Quantias de compra customizáveis.",
        "Adicionamos um tempo de vantagem. Gelo não acumula se vocé não tiver produção alguma.",
        "Descrições de artefatos e previsão profunda são úteis agora.",
        "Veja 5 escolhas de artefatos ao invés de apenas 3. Ao mesmo tempo, essência base de todos os oceanos subiu para 4.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.1 - New is Old (2021/1/7)": [
        "22 IMAGENS NOVAS! Mais estão sendo feitas, mas não conseguimos terminar todas a tempo!",
        "PROGRESSO DESCONECTADO DE VERDADE! Dias inteiros comprimidos a segundos com o cálculo RK4.",
        "Tentamos rebalancear mundos, especialmente Gélido e Abandonado, ao fazer materiais perigosos ainda mais perigosos e importantes.",
        "Efetividade das três máquinas tubarônicas cortada pela metade (exceto o comedor de areia, cuja produção foi multiplicada por 2/3), mas adicionamos uma melhoria para contrabalancear.",
        "Adicionamos um sistema de eficiência da recicladora. Quanto mais você recicla, mais você perde no processo. Adicionamos uma melhoria que faz a mecânica menos brutal.",
        "Addicionamos nova interface à Recicladora para que seja menos chute e mais uma análise de custo-benefício.",
        "Aumentamos a efetividade de muitas máquinas.",
        "Melhoramos a formatação numérica.",
        "Criador de mundo foi desabilitado porque vai quebrar planos futuros de balanceamento.",
        "Distant foresight now has a max level of 5, and reveals 20% of world properties per level, até 100% no nível 5.",
        "Arrumamos mecânicas com abuso, erros, and e erros abusados and abusos errôneos. Nada mais do ciclo de cristais -> mexilhões & esponjas -> ciência & mexilhões -> cristais.",
        "Não existe mais dissecação de esponjas.",
        "Removemos águas-vivas de planeta em que o recurso não fazia nada.",
    ],
    "0.71 (2014/12/20)": [
        "Consertamos, criamos e consertamos problemas que quebravam o jogo. Se o seu jogo foi apagado no processo, peço desculpas.",
        "Recicladora não mente mais sobre o que pode ser feito.",
        "Recicladora não paga mais tanto por animais.",
        "Configurações não são redefinidas após completar um mundo, mas agora de verdade",
        "Arrumamos um monte de custos do portal.",
        "Uma nova máquina, uma nova especialização.",
        "Dez novas tecnologias para gastar quantias imensas de ciência após exploração de abismo.",
    ],
    "0.7 - Stranger Oceans (2014/12/19)": [
        "UMA CACETADA DE COISAS NOVAS ADICIONADAS.",
        "Sistema de recursos levemente mudado para algo legal no futuro.",
        "Novos mundos com algumas diferenças em disponibilidade de recursos, demandas de portal, e outras coisas.",
        "Categorias adicionadas às ações na aba de Mar para ajudar quem estiver tentando entender todos os botões.",
        "Ações recentemente descobertas aparecem brilhando para sua conveniência.",
        "O jeito que o progresso muda após o portal está... um pouco diferente.",
        // o que caralhos isso significa?
        "Configurações não são redefinidas após completar um mundo.",
        "Artefatos existem.",
        "Imagens são um trabalho em progresso. Perdão pelo gráficos temporários nesses tempos ardilosos.",
        "Produção parcial na falta de recursos suficinetes para coisas que consomem coisas. Se divirta vendo sua produção à conta-gotas!",
    ],
    "0.62 (2014/12/12)": [
        "Portal não pede mais infinitos recursos para abrir.",
        "Tentamos arrumar a tabela de recursos quebrando em alguns navegadores e largura debarra lateral.",
    ],
    "0.61 (2014/12/12)": [
        "Adicionamos categorias para botões na aba de Mar, porque terão muitos botões.",
        // Eu tenho certeza que eu já traduzi isto
        "Mexemos em arquivos miscelâneos.",
        // tar???
        "Uma base foi feita para a versão 0.7, que vai ser o lançamento oficial.",
    ],
    "0.6 - Return of Shark (2014/12/8)": [
        "Atualização de gráficos grandona!",
        "Agora temos gráficos! ...Mais ou menos.",
        "Algumas mudanças de interface:" +
            "<ul><li>Tecnologias pesquisadas agora aparecem no laboratório, ao invés da gruta.</li>" +
            "<li>Estatísticas gerais agora na direita da gruta, ao invés da esquerda now on right.</li>" +
            "<li>Espaço vazio grande na coluna direita da gruta, que está reservado para algo legal no futuro!</li></ul>",
        "Subtítulo de versão!",
        "<span class='medDesc'>Adicionamos um link para doações. Ei! Tubarões também precisam comer ;-;</span>",
    ],
    "0.59 (2014/09/30)": [
        "Vários probleminhas sendo consertados!",
        "Tempo do final de uma jogatina agora é mostrado no final da jogatina.",
        "Consertamos problemas que só achamos em IE11.",
        "Arrumamos o problema de conseguir comprar centenas de coisas pelo preço de um por ultrapassar a capacidade do jogo de processar comandos. Espero que esteja consertado.",
        "Mídias sociais enfiadas debaixo do título do jogo. Aproveite!",
    ],
    "0.531 (2014/08/20)": [
        "Banimos holotúrias de entrar na recicladora porque o ciclo holotúria <--> alga é muito mais forte que eu imaginava. Ops!",
    ],
    "0.53 (2014/08/18)": ["Recicladora agora consegue produzir recursos de nata com custo constante, mas máquinas com custo linear."],
    "0.52 (2014/08/18)": [
        "Conserto de emergência.",
        "Custo de produzir coisas por meio de nata é agora LINEAR (fica mais caro quando você tem mais de algo) ao invés de CONSTANTE.",
    ],
    "0.51 (2014/08/18)": [
        "Mudamos nomeclatura de exportação/importação de jogos.",
        "Tornamos a reciclagem de máquinas menos TERRIVELMENTE FORTES em termos de quanto vale uma máquina.",
    ],
    "0.5 (2014/08/18)": [
        "Adicionamos a gruta- um jeito melgor de ver o que você conseguiu fazer até agora.",
        "Adicionamos a Recicladora. Se divirta descobrindo para que serve!",
        "Adicionamos comedores de areia para começão de areia.",
        "Consertamos recursos piscando quando algo está os consumindo e não se tem mais estoque.",
        "Adicionamos 'suporte' para pessoas caindo de paraquedas no site com os scripts desligados.",
        "Se é para o bem de todos e felicidade geral da nação, digo ao povo que aumentamos a quantidade de alga para abrir o portal em 10x.",
        "Adicionamos um cronômetro para você ver quanto tempo da sua vida você investiu neste jogo.",
        "Agrupamos os recursos ao mostrá-los na tabela à esquerda.",
        "Fizemos umas descrições de ação e de ajuda.",
        "Adicionamos um texto à aba de Mar para dar uma ideia para os jogadores o que eles deveriam estar fazendo bem no comecinho do jogo.",
        "Devido à ajuda de outras pessoas, jogos salvos são muito, mas muito menores que antes.",
        "Ninhadas de caranguejo são menos estupidamente explosivos.",
        "Ajustamos as cores de alguns recursos.",
        "Fizemos um favicon... seja lá o que seja isso",
        "<span class='medDesc'>Botamos um aviso de direitos autorais que nós deveríamos já ter feito antes.</span>",
    ],
    "0.48 (2014/08-ish)": [
        "Salvamento de jogos foram comprimidos ambos em armazenamento local e jogos exportados.",
        "Custos altos agora diminuiram bastante.",
        "Botões de comprar 10, 1/3 do max e 1/2 do max foram adicionados.",
        "Impacto das pesquisas agora é mostrado no botão das pesquisas.",
        "Efetividade de multiplicadores de recursos são mostrados na tabela." +
            "<ul><li>Não são multiplicadores de quanto daquele recurso você está produzindo.</li></ul>",
        "Trabalho bobo no código para ele ficar menos espaguetado.",
        "Fizemos esse registro de atualizações!",
        "Removemos a lista de melhorias da esquerda. Não chore, ela vai voltar numa versão futura.",
        "Adicionamos recursos que fazem arraias e caranguejos, e suas respectivas tecnologias.",
    ],
    "0.47 (2014/08-ish)": ["O grosso do jogo foi adicionado.", "Última atualização para 'Seamergency 2014!'"],
    "0.4 (2014/08-ish)": ["Aba de laboratório adicionada.", "Aba de fim de jogo adicionada."],
    "0.3 (2014/08-ish)": ["Adicionamos descrição às configurações.", "Importação e exportação de jogos agora é possível.", "Adicionamos uma tela final."],
    "0.23 (2014/08-ish)": ["Adicionamos salvamento automático.", "Sistema de produção mudado.", "Fizemos menu de configurações."],
    "0.22 (2014/08-ish)": [
        "Modo desconectado criado. Recursos vão ser produzidos mesmo com o jogo desligado!",
        "(Não garantimos que ganho de recursos vai ser 100% acurado.)",
    ],
    "0.21 (2014/08-ish)": ["Salvamemto e carregamento adicionado."],
    "<0.21 (2014/08-ish)": ["Um monte de coisa.", "Tabela de recursos, registros, butões iniciais, ossos do ofício."],
};

$(() => {
    $("#game").show();
    main.init();
});
