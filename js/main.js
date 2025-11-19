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
        "Tubarão. Jogo. Preciso falar mais?",
        "Chega De Mariscos, De Negar o Meu Desejo",
        "Oceano Clicker",
        "Os Oceanos Vêm de Marte e É Pra Lá Que Eu Vou",
        "'Você Precisa Dar Um Nome Para o Jogo",
        "/Tubarão/",
        "Tubarão do Faustão",
        "Tubarão Idle",
        "Siri-dade Alerta",
        "A Divina Co-mar-dia",
        "Todo Mundo Odeia o Siris",
        "O Tubarão de Mar Street",
        "Uma Família da Caçada",
        "Clube da Lula",
        "Smells Like Tubarão Spirit",
        "Jogo Sem Título de Tubarão",
        "PT: Partido dos Tubarões",
        "PCO: Partido da Causa Ouriçária",
        "PCB: Partido Cardume Brasileiro",
        "PSOL: Partido Socialista de Lulas",
        "UP: Unidade Polvo",
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
        "Tubarão Fortress 2",
        "Diário de um Barbatana",
        "Os Peixinhos Mágicos",
        ":jogo do tubarão:",
        "Kick Tubarovski",
        "Contratando",
        "A TERMINAR",
        "Deluxe",
        "doo doo do-do do-do",
        "DUNGEONS",
        "A Aventura Continua",
        "Continua",
        "Camarêncio: O Otimista",
        "Bedrock? Edition",
        "Edição Java(script)",
        "Você é um Tubarão",
        "O Códigolfinho da Vinci",
        "Tubarões-Anjos e Demônios",
        "A Culpa é das Enguias",
        "Um Dia de Holotúria",
        "Tubarão Em Todo Lugar Ao Mesmo Tempo",
        "A Viagem de Siri-ro",
        "Vale a Pena Ver de Polvo",
        "Deltubarune",
        "Mansão Foster de Arraias Imaginárias",
        "O Caranguejo e a Rosa",
        "Hollow Náutico: Siri Song",
        "Viva a Sociedade Água-viva",
        "Marmonas Arraiassinas",
        "Camarães de Areia",
        "Ouriço de Tolo",
        "O Arraialista",
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
                        `Vocêvê uma atualização nadando até você.<br> Nela, vocêsó consegue decifrar as palavras <br>"${
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
        "Descrições planetárias são muito mais vagas até você visitá-las.",
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
        "Added 'bright' text color mode, screws up some colors but makes colored text easier to read.",
        "Added auto color-visibility adjuster. Tries to change the color of text if it would be hard to read on a certain background.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210610a": [
        "Fixed bug where haven had no essence. Oops.",
        "Changed home messages a little.",
        "Retconned some previous patch notes.",
        "Added sprite for octopus investigator.",
        "Internal stuff.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210515a": ["Adicionamos texto faltante.", "Fizemos coisas internas."],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210422a": [
        "Implemented reworked gameplay for the Haven worldtype.",
        "Made sweeping changes to the UI.",
        "Melhoramos a formatação da gruta.",
        "Mudamos as cores do Oceano Paradisíaco.",
        "In the grotto, amounts for each producer now update live.",
        "Both kinds of tooltips update live.",
        "Tooltips can tell you more things: for example, it now says how much science you get from sea apples.",
        "Added minimized titlebar. You can switch it back to the old one in the options menu.",
        "Added categories to options menu. Now it's readable!",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210314a": [
        "Fixed bug related to how artifacts display in the grotto.",
        "Fixed bug related to artifact affects not applying properly.",
        "Fixed bug where the grotto would show an upgrade multiplier for everything, even if it was x1.",
        "Fixed bug where artifact effects would not reset when importing.",
        "Added 'INCOME PER' statistic to Simple grotto. Shows absolutely how much of a resource you get per generator.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210312a": [
        "Added simplified grotto.",
        "Made grotto way easier to understand.",
        "Added tooltips to income table.",
        "Did internal rework of the multiplier system, created the modifier system.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 - New Perspectives (2021/??/??)": [
        "Scrapped Chaotic worldtype. Completely.",
        "Implemented gameplay for 1 out of 7 necessary planet reworks.",
        "Implemented new assets.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.11 - New Foundations (2021/1/27)": [
        "New, greatly improved UI for everything.",
        "Rebalanced stuff.",
        "Added world themes, so the page now changes color depending on what world you're in.",
        "Added a TPS/FPS setting, to make the game smoother and nicer to look at, or chunkier and easier on performance.",
        "Custom purchase amounts.",
        "Added a 'grace period'. Ice doesn't build up if you have no income for anything.",
        "Artifact descriptions and distant foresight planet properties are useful.",
        "See 5 artifact choices instead of 3. On that note, buffed base essence to 4 per world.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.1 - New is Old (2021/1/7)": [
        "22 NEW SPRITES! More are coming but we couldn't finish all the sprites in time!",
        "TRUE OFFLINE PROGRESS! Days are compressed to mere seconds with RK4 calculation.",
        "Attempted to rebalance worlds, especially frigid and abandoned, by making hazardous materials more threatening and meaningful.",
        "Halved the effectiveness of the 3 basic shark machines (except sand digger, which is 2/3 as productive), but added a new upgrade to counterbalance it.",
        "Added recycler efficiency system. The more you recycle at once, the more you lose in the process. Added an upgrade which makes the mechanic less harsh.",
        "Added new UI elements to the Recycler to make it less of a guessing game and more of a cost-benefit analysis.",
        "Increased the effectiveness of many machines.",
        "Greatly improved number formatting.",
        "World shaper has been disabled because it will probably break plans for future game balance.",
        "Distant foresight now has a max level of 5, and reveals 20% of world properties per level, up to 100% at level 5.",
        "Fixed exploits, bugs, and buggy exploits and exploitable bugs. No more crystals -> clams & sponges -> science & clams -> crystals loop.",
        "No more science from sponges.",
        "Removed jellyfish from a bunch of worlds where the resource was a dead end.",
    ],
    "0.71 (2014/12/20)": [
        "Fixed and introduced and fixed a whole bunch of horrible game breaking bugs. If your save was lost, I'm sorry.",
        "Made the recycler stop lying about what could be made.",
        "Made the recycler not pay out so much for animals.",
        "Options are no longer reset after completing a run for real this time.",
        "Bunch of tweaked gate costs.",
        "One new machine, and one new job.",
        "Ten new post-chasm-exploration technologies to invest copious amounts of science into.",
    ],
    "0.7 - Stranger Oceans (2014/12/19)": [
        "WHOLE BUNCH OF NEW STUFF ADDED.",
        "Resource system slightly restructured for something in the future.",
        "New worlds with some slight changes to availabilities, gate demands, and some other stuff.",
        "Categories added to Home Sea tab for the benefit of trying to make sense of all the buttons.",
        "Newly added actions show up in highlights for your convenience.",
        "The way progress continues beyond the gate is now... a little tweaked.",
        "Options are no longer reset after completing a run.",
        "Artifacts exist.",
        "Images are a work in progress. Apologies for the placeholder graphics in these trying times.",
        "Partial production when there's insufficient resources for things that take costs. Enjoy watching your incomes slow to a trickle!",
    ],
    "0.62 (2014/12/12)": [
        "Fixed infinity resource requirement for gate.",
        "Attempted to fix resource table breaking in some browsers for some sidebar widths.",
    ],
    "0.61 (2014/12/12)": [
        "Added categories for buttons in the home sea, because there are going to be so many buttons.",
        "Miscellaneous shuffling of files.",
        "Some groundwork laid for v0.7, which will be the actual official release.",
    ],
    "0.6 - Return of Shark (2014/12/8)": [
        "Major graphical update!",
        "Now features graphics sort of!",
        "Some UI rearrangements:" +
            "<ul><li>Researched techs now show in lab instead of grotto.</li>" +
            "<li>General stats now on right of grotto instead of left.</li>" +
            "<li>Large empty space in grotto right column reserved for future use!</li></ul>",
        "Pointless version subtitle!",
        "<span class='medDesc'>Added a donate link. Hey, sharks gotta eat.</span>",
    ],
    "0.59 (2014/09/30)": [
        "Bunch of small fixes and tweaks!",
        "End of run time now shown at the end of a run.",
        "A couple of fixes for issues only found in IE11.",
        "Fixed a bug that could let people buy hundreds of things for cheap by overwhelming the game's capacity for input. Hopefully fixed, anyway.",
        "Gaudy social media share menu shoehorned in below the game title. Enjoy!",
    ],
    "0.531 (2014/08/20)": [
        "Banned sea apples from the recycler because the feedback loop is actually far more crazy powerful than I was expecting. Whoops!",
    ],
    "0.53 (2014/08/18)": ["Changed Recycler so that residue into new machines is linear, but into new resources is constant."],
    "0.52 (2014/08/18)": [
        "Emergency bug-fixes.",
        "Cost to assemble residue into new things is now LINEAR (gets more expensive as you have more things) instead of CONSTANT.",
    ],
    "0.51 (2014/08/18)": [
        "Edited the wording of import/export saving.",
        "Made machine recycling less HORRIBLY BROKEN in terms of how much a machine is worth.",
    ],
    "0.5 (2014/08/18)": [
        "Added the Grotto - a way to better understand what you've accomplished so far.",
        "Added the Recycler. Enjoy discovering its function!",
        "Added sand machines for more machine sand goodness.",
        "Fixed oscillation/flickering of resources when at zero with anything providing a negative income.",
        "Added 'support' for people stumbling across the page with scripts turned off.",
        "Upped the gate kelp requirement by 10x, due to request.",
        "Added time tracking. Enjoy seeing how much of your life you've invested in this game.",
        "Added grouping for displaying resources on the left.",
        "Added some help and action descriptions.",
        "Added some text to the home tab to let people have an idea of where they should be heading in the very early game.",
        "Thanks to assistance from others, the saves are now much, much smaller than before.",
        "Made crab broods less ridiculously explosive.",
        "Adjusted some resource colours.",
        "Added a favicon, probably.",
        "<span class='medDesc'>Added an overdue copyright notice I guess.</span>",
    ],
    "0.48 (2014/08-ish)": [
        "Saves are now compressed both in local storage and in exported strings.",
        "Big costs significantly reduced.",
        "Buy 10, Buy 1/3 max and Buy 1/2 max buttons added.",
        "Research impact now displayed on research buttons.",
        "Resource effectiveness multipliers now displayed in table." +
            "<ul><li>These are not multipliers for how much of that resource you are getting.</li></ul>",
        "Some dumb behind the scenes things to make the code look nicer.",
        "Added this changelog!",
        "Removed upgrades list on the left. It'll come back in a future version.",
        "Added ray and crab generating resources, and unlocking techs.",
    ],
    "0.47 (2014/08-ish)": ["Bulk of game content added.", "Last update for Seamergency 2014!"],
    "0.4 (2014/08-ish)": ["Added Laboratory tab.", "Added the end of the game tab."],
    "0.3 (2014/08-ish)": ["Added description to options.", "Added save import/export.", "Added the ending panel."],
    "0.23 (2014/08-ish)": ["Added autosave.", "Income system overhauled.", "Added options panel."],
    "0.22 (2014/08-ish)": [
        "Modo desligado criado. Recursos vão ser produzidos mesmo com o jogo desligado!",
        "(Não garantimos que ganho de recursos vai ser 100% acurado.)",
    ],
    "0.21 (2014/08-ish)": ["Salvamemto e carregamento adicionado."],
    "<0.21 (2014/08-ish)": ["Um monte de coisa.", "Tabela de recursos, registros, butões iniciais, ossos do ofício."],
};

$(() => {
    $("#game").show();
    main.init();
});
