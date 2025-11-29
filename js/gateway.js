"use strict";

SharkGame.Gateway = {
    NUM_PLANETS_TO_SHOW: 3,

    transitioning: false,
    selectedWorld: "",

    allowedWorlds: ["abandoned", "haven", "frigid", "shrouded", "marine", "volcanic", "tempestuous"],

    completedWorlds: [],

    planetPool: [],

    init() {
        this.completedWorlds = [];
        this.planetPool = [];
        SharkGame.wonGame = false;
        SharkGame.gameOver = false;
    },

    setup() {
        this.completedWorlds = this.completedWorlds.filter((worldType) => {
            return Object.keys(SharkGame.WorldTypes).includes(worldType);
        });
        if (SharkGame.gameOver || gateway.badWorld) {
            main.endGame(true);
            gateway.badWorld = false;
        } else {
            gateway.updateScoutingStatus();
            SharkGame.persistentFlags.wasOnScoutingMission = undefined;
        }
    },

    enterGate(loadingFromSave) {
        // To help diagnose negative time bug
        // Can remove if/when that gets fixed
        SharkGame.Save.createTaggedSave("PreGateway");
        SharkGame.PaneHandler.wipeStack();

        SharkGame.OverlayHandler.enterGateway();

        // ensure buy buttons will be revealed
        SharkGame.persistentFlags.revealedBuyButtons = true;

        // be sure minute hand is off
        res.minuteHand.toggleOff();
        // be sure we're not paused
        if (cad.pause) {
            res.pause.togglePause();
        }

        tree.resetScoutingRestrictions();
        gateway.updateWasScoutingStatus();

        if (!loadingFromSave) {
            SharkGame.persistentFlags.lastRunTime = sharktime.getRunTime();
            if (SharkGame.wonGame) {
                gateway.markWorldCompleted(world.worldType);
                SharkGame.persistentFlags.destinyRolls = SharkGame.Aspects.destinyGamble.level;
                gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);
            }
        }

        if (this.planetPool.length === 0) {
            gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);
        }

        if (!SharkGame.persistentFlags.minuteStorage) SharkGame.persistentFlags.minuteStorage = 0;
        if (!SharkGame.flags.minuteHandTimer) SharkGame.flags.minuteHandTimer = 0;
        if (!SharkGame.flags.requestedTimeLeft) SharkGame.flags.requestedTimeLeft = 0;
        if (!SharkGame.flags.hourHandLeft) SharkGame.flags.hourHandLeft = 0;
        const storedTime = SharkGame.flags.minuteHandTimer - SharkGame.flags.requestedTimeLeft - SharkGame.flags.hourHandLeft;
        SharkGame.persistentFlags.minuteStorage += storedTime;

        // make sure the player is flagged as having idled so the minute hand shows up from now on
        res.minuteHand.allowMinuteHand();

        const baseReward = gateway.getBaseReward(loadingFromSave);
        const patienceReward = gateway.getPatienceReward(loadingFromSave);
        const speedReward = gateway.getSpeedReward(loadingFromSave);
        const gumptionBonus = gateway.getGumptionBonus(loadingFromSave);

        gateway.ui.prepareBasePane(baseReward, patienceReward, speedReward, gumptionBonus, storedTime);
        gateway.grantEssenceReward(baseReward, patienceReward, speedReward);

        // store memories
        SharkGame.Memories.elevateMemories();

        // RESET COMPLETED GATE REQUIREMENTS
        SharkGame.Gate.completedRequirements = {};
        // clear non-persistent flags just in case
        SharkGame.flags = {};

        // SAVE
        SharkGame.Save.saveGame();

        $("#game").addClass("inGateway");
    },

    cleanUp() {
        // empty out the game stuff behind
        main.purgeGame();
    },

    rerollWorlds() {
        if (SharkGame.persistentFlags.destinyRolls && SharkGame.persistentFlags.destinyRolls > 0) {
            SharkGame.persistentFlags.destinyRolls -= 1;
            gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);
            gateway.ui.showPlanets(true);
            SharkGame.Save.saveGame();
        }
    },

    preparePlanetSelection(numPlanets) {
        // empty existing pool
        gateway.planetPool = [];

        // create pool of qualified types
        const qualifiedPlanetTypes = gateway.allowedWorlds.slice(0);

        // look for uncompleted planet types
        const uncompletedPlanetTypes = gateway.allowedWorlds.slice(0);
        _.each(gateway.completedWorlds, (worldtype) => {
            const typeIndex = uncompletedPlanetTypes.indexOf(worldtype);
            if (typeIndex > -1) {
                uncompletedPlanetTypes.splice(typeIndex, 1);
            }
        });

        // are there any? if so, set a random index out of the number of planets we're choosing
        // the choice with this index is guaranteed to be an uncompleted planet
        let guaranteeWhichWorld;
        if (uncompletedPlanetTypes.length > 0) {
            guaranteeWhichWorld = Math.floor(Math.random() * numPlanets);
        }

        // pull random types from the pool
        // for each type pulled, generated a random level for the planet
        // then add to the planet pool
        for (let i = 0; i < numPlanets; i++) {
            let choice;
            if (uncompletedPlanetTypes.length > 0 && guaranteeWhichWorld === i) {
                choice = SharkGame.choose(uncompletedPlanetTypes);
            } else {
                choice = SharkGame.choose(qualifiedPlanetTypes);
            }
            const index = qualifiedPlanetTypes.indexOf(choice);
            // take it out of the qualified pool (avoid duplicates)
            qualifiedPlanetTypes.splice(index, 1);

            if (uncompletedPlanetTypes.indexOf(choice) > -1) {
                uncompletedPlanetTypes.splice(uncompletedPlanetTypes.indexOf(choice), 1);
            }

            // add choice to pool
            gateway.planetPool.push({
                type: choice,
            });
        }
    },

    getVoiceMessage(wonGame, forceWorldBased) {
        // the point of this function is to add to the message pool all available qualifying messages and then pick one
        const messagePool = [];
        const totalEssence = res.getTotalResource("essence");

        // if the game wasn't won, add loss messages
        if (!wonGame) {
            messagePool.push(...gateway.Messages.loss);
        } else if (forceWorldBased) {
            const planetPool = gateway.Messages.lastPlanetBased[world.worldType];
            if (planetPool) {
                messagePool.push(...planetPool);
            }
        } else {
            // determine which essence based messages should go into the pool
            _.each(gateway.Messages.essenceBased, (message) => {
                const min = message.min || 0;
                const max = message.max || Number.MAX_VALUE;

                if (totalEssence >= min && totalEssence <= max) {
                    messagePool.push(...message.messages);
                }
            });

            // determine which planet based messages should go into the pool
            const planetPool = gateway.Messages.lastPlanetBased[world.worldType];
            if (planetPool) {
                messagePool.push(...planetPool);
            }

            // finally just add all the generics into the pool
            messagePool.push(...gateway.Messages.generic);
        }

        return '"' + SharkGame.choose(messagePool) + '"';
    },

    playerHasSeenResource(resource) {
        if (res.isCategory(resource)) {
            return true;
        }
        return _.some(gateway.completedWorlds, (completedWorld) =>
            _.some(SharkGame.WorldTypes[completedWorld].foresight.present, (seenResource) => seenResource === resource),
        );
    },

    markWorldCompleted(worldType) {
        if (!gateway.completedWorlds.includes(worldType)) {
            gateway.completedWorlds.push(worldType);
        }
    },

    getTimeInLastWorld(formatLess) {
        if (SharkGame.persistentFlags.lastRunTime) {
            return formatLess ? SharkGame.persistentFlags.lastRunTime : sharktext.formatTime(SharkGame.persistentFlags.lastRunTime);
        } else {
            if (!SharkGame.persistentFlags.totalPausedTime) {
                SharkGame.persistentFlags.totalPausedTime = 0;
            }
            if (!SharkGame.persistentFlags.currentPausedTime) {
                SharkGame.persistentFlags.currentPausedTime = 0;
            }
            const time =
                SharkGame.timestampRunEnd -
                SharkGame.timestampRunStart -
                SharkGame.persistentFlags.totalPausedTime -
                SharkGame.persistentFlags.currentPausedTime;
            return formatLess ? time : sharktext.formatTime(time);
        }
    },

    updateWasScoutingStatus() {
        if (!_.isUndefined(SharkGame.persistentFlags.scouting)) {
            SharkGame.persistentFlags.wasScouting = SharkGame.persistentFlags.scouting;
            SharkGame.persistentFlags.scouting = undefined;
        } else if (_.isUndefined(SharkGame.persistentFlags.wasScouting)) {
            // failsafe, assume we were indeed scouting
            SharkGame.persistentFlags.wasScouting = true;
        }
    },

    updateScoutingStatus() {
        SharkGame.persistentFlags.scouting = !gateway.completedWorlds.includes(world.worldType);
    },

    wasOnScoutingMission() {
        if (!_.isUndefined(SharkGame.persistentFlags.scouting)) {
            gateway.updateWasScoutingStatus();
        }
        return SharkGame.persistentFlags.wasScouting;
    },

    currentlyOnScoutingMission() {
        if (!SharkGame.gameOver && _.isUndefined(SharkGame.persistentFlags.scouting)) {
            gateway.updateScoutingStatus();
        }
        return SharkGame.persistentFlags.scouting;
    },

    getMinutesBelowPar() {
        const time = gateway.getPar() - gateway.getTimeInLastWorld(true) / 60000;
        if (time < 0) {
            return 0;
        }
        return time;
    },

    getPar(type = world.worldType) {
        return SharkGame.WorldTypes[type].par;
    },

    getSpeedReward(loadingFromSave) {
        let reward = 0;
        if (gateway.getPar() && !loadingFromSave && SharkGame.wonGame) {
            let timeBelowPar = gateway.getMinutesBelowPar();
            if (timeBelowPar > 0) {
                while (timeBelowPar > 0) {
                    timeBelowPar -= 5;
                    reward += 1;
                }

                let timeBelowThreshold;
                const rawTime = gateway.getTimeInLastWorld(true) / 60000;
                if (rawTime < 5) {
                    timeBelowThreshold = 5 - rawTime;

                    while (timeBelowThreshold > 0) {
                        timeBelowThreshold -= 1;
                        reward += 1;
                    }
                }

                if (rawTime < 1) {
                    timeBelowThreshold = 1 - rawTime;

                    while (timeBelowThreshold > 0) {
                        timeBelowThreshold -= 1 / 6;
                        reward += 1;
                    }
                }

                if (rawTime < 1 / 6) {
                    timeBelowThreshold = 1 / 6 - rawTime;

                    while (timeBelowThreshold > 0) {
                        timeBelowThreshold -= 1 / 60;
                        reward += 1;
                    }
                }
            }
        }
        return reward;
    },

    getBaseReward(loadingFromSave, whichWorld = world.worldType) {
        let reward = 0;
        if (!loadingFromSave && SharkGame.wonGame) {
            reward = gateway.wasOnScoutingMission() ? 4 : 2;

            const bonus = SharkGame.WorldTypes[whichWorld].bonus;
            if (bonus) {
                reward += bonus;
            }
        }
        return reward;
    },

    getPatienceReward(loadingFromSave) {
        if (!loadingFromSave && SharkGame.wonGame) {
            if (SharkGame.persistentFlags.dialSetting > 1) {
                return (SharkGame.Aspects.patience.level * 2 * Math.log(SharkGame.persistentFlags.dialSetting)) / Math.log(4);
            } else {
                return SharkGame.Aspects.patience.level;
            }
        }
        return 0;
    },

    getGumptionBonus(loadingFromSave) {
        if (!loadingFromSave && SharkGame.wonGame) {
            const bonus = SharkGame.Aspects.gumption.level * 0.01 * res.getResource("essence");
            return Math.min(1, bonus);
        }
        return 0;
    },

    grantEssenceReward(essenceReward, patienceReward, speedReward) {
        const gumptionBonus = gateway.getGumptionBonus();
        res.changeResource("essence", Math.ceil((1 + gumptionBonus) * (essenceReward + speedReward) + patienceReward));
    },

    isWorldBeaten(worldType = "") {
        return gateway.completedWorlds.indexOf(worldType) > -1;
    },

    shouldCheatsBeUnlocked() {
        return res.getTotalResource("essence") >= 1000 && !SharkGame.persistentFlags.unlockedDebug;
    },

    unlockCheats() {
        if (!SharkGame.persistentFlags.debug && !SharkGame.persistentFlags.unlockedDebug) {
            SharkGame.PaneHandler.showUnlockedCheatsMessage();
            SharkGame.Save.createTaggedSave("BackupCheats");
            cad.debug();
        }
        SharkGame.persistentFlags.unlockedDebug = true;
    },

    ui: {
        showGateway(baseReward, patienceReward, speedReward, gumptionRatio = gateway.getGumptionBonus(), forceWorldBased = false, storedTime = 0) {
            const gumptionBonus = Math.ceil(gumptionRatio * (baseReward + speedReward));

            // get some useful numbers
            const essenceHeld = res.getResource("essence");
            const numenHeld = res.getResource("numen");

            // construct the gateway content
            const gatewayContent = $("<div>");
            gatewayContent.append($("<p>").html("Você é um tubarão num espaço entre mundos."));
            if (!SharkGame.wonGame) {
                gatewayContent.append(
                    $("<p>").html("Não lhe é claro como você veio para aqui, mas você se lembra de uma triste derrota.").addClass("medDesc"),
                );
            }
            gatewayContent.append($("<p>").html(sharktext.boldString("Algo transcendental diz,")).addClass("medDesc"));
            gatewayContent.append(
                $("<em>")
                    .attr("id", "gatewayVoiceMessage")
                    .html(sharktext.boldString(gateway.getVoiceMessage(SharkGame.wonGame, forceWorldBased))),
            );

            // figure out all our rewards
            if (baseReward > 0) {
                gatewayContent.append(
                    $("<p>").html(
                        "Entrar aqui te mudou, aumentando a sua essência por <span class='essenceCount'>" +
                            sharktext.beautify(baseReward) +
                            "</span>.",
                    ),
                );
            }
            if (speedReward > 0) {
                gatewayContent.append(
                    $("<p>").html(
                        "Você completou este mundo " +
                            sharktext.beautify(gateway.getMinutesBelowPar()) +
                            ` minuto${gateway.getMinutesBelowPar() === 1 ? "" : "s"} mais rápido que o normal, e você conseguiu <span class='essenceCount'>` +
                            sharktext.beautify(speedReward) +
                            "</span> de essência adicional.",
                    ),
                );
            } else if (SharkGame.wonGame && !gateway.wasOnScoutingMission() && !gateway.getMinutesBelowPar()) {
                gatewayContent.append(
                    $("<p>").html("Você não venceu esse oceano rápido o suficiente. Se tivesse o feito, você teria mais essência."),
                );
            }
            if (gumptionBonus) {
                gatewayContent.append(
                    $("<p>").html(
                        "Seus culhões te dão mais <span class='essenceCount'>" +
                            sharktext.beautify(gumptionBonus, false, 2) +
                            "</span> de essência extra.",
                    ),
                );
            }
            if (patienceReward > 0) {
                gatewayContent.append(
                    $("<p>").html(
                        "Sua paciência é recompensada, te proporcionando <span class='essenceCount'>" +
                            sharktext.beautify(patienceReward) +
                            "</span> de essência adicional.",
                    ),
                );
            }
            if (speedReward || gumptionBonus || patienceReward) {
                gatewayContent.append(
                    $("<p>").html(
                        "Ao todo, sua essência aumentou em <span class='essenceCount'>" +
                            sharktext.beautify(speedReward + patienceReward + baseReward + gumptionBonus, false, 2) +
                            "</span>.",
                    ),
                );
            }
            gatewayContent.append(
                $("<p>").html(
                    sharktext.boldString(
                        "Você tem <span id='essenceHeldDisplay' class='essenceCount'>" +
                            sharktext.beautify(essenceHeld, false, 2) +
                            "</span> de essência.",
                    ),
                ),
            );
            if (storedTime >= 1000) {
                gatewayContent.append(
                    $("<p>").html(
                        `(E também, você trouxe ${sharktext.boldString(res.minuteHand.formatMinuteTime(storedTime))} de tempo extra não usado com você.)`,
                    ),
                );
            }
            if (numenHeld > 0) {
                const numenName = numenHeld > 1 ? "numina" : "numen";
                gatewayContent.append(
                    $("<p>").html(
                        "Você também tem <span class='numenCount'>" +
                            sharktext.beautify(numenHeld) +
                            "</span> " +
                            numenName +
                            " radiando a luz divina dentro de você.",
                    ),
                );
            }
            gatewayContent.append($("<p>").attr("id", "gatewayStatusMessage").addClass("medDesc"));

            // show end time
            const endRunInfoDiv = $("<div>");
            gateway.ui.showRunEndInfo(endRunInfoDiv);
            gatewayContent.append(endRunInfoDiv);

            // add navigation buttons
            const navButtons = $("<div>").addClass("gatewayButtonList");
            SharkGame.Button.makeButton("backToGateway", "aspectos", navButtons, () => {
                gateway.ui.switchViews(gateway.ui.showAspects);
            });
            SharkGame.Button.makeButton("toOptions", "configurações", navButtons, SharkGame.PaneHandler.showOptions);
            SharkGame.Button.makeHoverscriptButton(
                "toWorlds",
                "mundos",
                navButtons,
                () => {
                    if (SharkGame.Aspects.pathOfEnlightenment.level) {
                        gateway.ui.switchViews(gateway.ui.showPlanets);
                    }
                },
                () => {
                    if (!SharkGame.Aspects.pathOfEnlightenment.level) {
                        $("#tooltipbox").addClass("forAspectTreeUnpurchased").html("Você não entende o que isto significa.");
                    }
                },
                () => {
                    $("#tooltipbox").removeClass("forAspectTreeUnpurchased").html("");
                },
            );
            gatewayContent.append(navButtons);

            SharkGame.PaneHandler.swapCurrentPane("GATEWAY", gatewayContent, true, 500, true);
            gateway.transitioning = false;
            if (!SharkGame.Aspects.pathOfEnlightenment.level) {
                $("#toWorlds").addClass("disabled");
            }
            if (SharkGame.missingAspects) {
                SharkGame.PaneHandler.showAspectWarning();
            }
        },

        showRunEndInfo(containerDiv) {
            if (gateway.getTimeInLastWorld(true) < 0) {
                containerDiv.append(
                    $("<p>").html(
                        "You appear to have experienced a major bug that causes negative world-times.<br> The source of this bug is unknown.<br>" +
                            "Por favor, mande uma cópia do seu jogo (o <code>sharkGameSavePreGateway</code> no seu Armazenamento Local) para nós, ou pelo canal #bugs-and-issues do nossos servidor do Discord ou por email para <pre>timebug@shark.tobot.dev</pre>.<br> E, sei lá, aproveite a essência grátis?<br>" +
                            "(Para remover a essência em excesso, digite a seguinte mensagem no console do seu navegador <code>res.changeResource(\"essence\", -1000)</code>, substituindo 1000 com o número de essência em excesso que você ganhou; desculpa pela inconveniência)<br>" +
                            `tempo de começo: ${SharkGame.timestampRunStart}   tempo verdadeiramente pausado: ${SharkGame.persistentFlags.totalPausedTime}   tempo atual pausado: ${SharkGame.persistentFlags.currentPausedTime}<br>` +
                            `ponteiro dos minutos: ${SharkGame.flags.minuteHandTimer}    ponteiro das horas: ${SharkGame.flags.hourHandLeft}    bônus: ${SharkGame.flags.bonusTime}<br>` +
                            `tempo calculado no mundo: ${gateway.getTimeInLastWorld(true)}   o provável tempo verdadeiro: ${
                                _.now() - SharkGame.timestampRunStart
                            }<br>`,
                    ),
                );
            } else {
                containerDiv.append($("<p>").html(`<em>Tempo gasto no último oceano:</em><br/>${gateway.getTimeInLastWorld()}`));
            }
        },

        prepareBasePane(baseReward, patienceReward, speedReward, gumptionBonus, storedTime) {
            // PREPARE GATEWAY PANE
            // set up classes
            let pane;
            if (!SharkGame.paneGenerated) {
                pane = SharkGame.PaneHandler.buildPane();
            } else {
                pane = $("#pane");
            }
            pane.addClass("gateway");

            // make overlay opaque
            if (SharkGame.Settings.current.showAnimations) {
                gateway.transitioning = true;
            }

            SharkGame.OverlayHandler.revealOverlay(1000, 1.0, () => {
                gateway.cleanUp();
                gateway.ui.showGateway(baseReward, patienceReward, speedReward, gumptionBonus, true, storedTime);
                if (gateway.shouldCheatsBeUnlocked()) {
                    gateway.unlockCheats();
                }
            });
        },

        showAspects() {
            tree.updateRequirementReference();
            const aspectTreeContent = $("<div>");
            aspectTreeContent.append(
                $("<strong>")
                    .attr("id", "essenceCount")
                    .attr("contenteditable", SharkGame.persistentFlags.debug ? "true" : "false")
                    .html(sharktext.beautify(res.getResource("essence"), false, 2))
                    .on("keydown", function (event) {
                        if (event.code === "Enter") {
                            event.preventDefault();
                            window.getSelection().removeAllRanges();

                            const html = $(this).html();
                            if (!isNaN(html)) {
                                res.setResource("essence", Number(html));
                            }
                            tree.updateEssenceCounter();
                        }
                    }),
            );
            aspectTreeContent.append($("<strong>").html(" ESSÊNCIA"));
            aspectTreeContent.append($("<p>").html("Sua vontade flui sobre coisas sólidas além do seu controle.<br>Tenha foco."));
            aspectTreeContent.append(tree.drawTree(SharkGame.Settings.current.doAspectTable === "table"));

            const buttonDiv = $("<div>").attr("id", "aspectTreeNavButtons").addClass("gatewayButtonList");

            // add return to gateway button
            SharkGame.Button.makeButton("backToGateway", "voltar ao entre-mundos", buttonDiv, () => {
                gateway.ui.switchViews(gateway.ui.showGateway);
                $("#tooltipbox").empty().removeClass("forAspectTree forAspectTreeUnpurchased");
            });

            if (SharkGame.Settings.current.doAspectTable === "table") {
                if (SharkGame.Aspects.cleanSlate.level) {
                    SharkGame.Button.makeButton("respecModeButton", "modo reembolso", buttonDiv, tree.toggleRefundMode);
                    SharkGame.Button.makeButton("respecButton", "reembolsar tudo", buttonDiv, () => {
                        if (confirm("Tem certeza que quer reembolsar todos os aspectos reembolsáveis?")) {
                            tree.respecTree();
                        }
                    });
                }

                if (SharkGame.persistentFlags.debug) {
                    SharkGame.Button.makeButton("debugModeButton", "modo debug", buttonDiv, tree.toggleDebugMode);
                }
            }

            tree.debugMode = false;
            tree.refundMode = false;

            aspectTreeContent.append(buttonDiv);

            SharkGame.PaneHandler.swapCurrentPane("ASPECT TREE", aspectTreeContent, true, 500, true);

            if (SharkGame.Settings.current.doAspectTable === "tree") {
                tree.initTree();
            }

            gateway.transitioning = false;
        },

        showPlanets(foregoAnimation) {
            // construct the gateway content
            const planetSelectionContent = $("<div>");
            planetSelectionContent.append($("<p>").html("Outros mundos esperam."));

            // show planet pool
            const planetPool = $("<div>").addClass("gatewayButtonList");
            _.each(gateway.planetPool, function callback(planetInfo) {
                SharkGame.Button.makeButton("planet-" + planetInfo.type, planetInfo.type + " " + planetInfo.level, planetPool, function onClick() {
                    gateway.selectedWorld = $(this).attr("id").split("-")[1];
                    gateway.ui.switchViews(gateway.ui.confirmWorld);
                }).addClass("planetButton");
            });
            planetSelectionContent.append(planetPool);

            planetSelectionContent.append(
                $("<p>").html("NOTA: Quando você entra num mundo pela primeira vez, você está o EXPLORANDO. Se você entrar de novo nele, você NÃO está mais EXPLORANDO."),
            );

            if (SharkGame.Aspects.destinyGamble.level > 0) {
                SharkGame.Button.makeButton("destinyGamble", "foobar", planetSelectionContent, gateway.rerollWorlds);
            }

            if (SharkGame.persistentFlags.debug) {
                SharkGame.Button.makeButton("visitButton", "visitar qualquer mundo", planetSelectionContent, gateway.ui.showWorldVisitMenu);
            }

            // add return to gateway button
            const returnButtonDiv = $("<div>");
            SharkGame.Button.makeButton("backToGateway", "voltar ao entre-mundos", returnButtonDiv, () => {
                gateway.ui.switchViews(gateway.ui.showGateway);
            });
            planetSelectionContent.append(returnButtonDiv);

            SharkGame.PaneHandler.swapCurrentPane("WORLDS", planetSelectionContent, true, foregoAnimation ? 0 : 500, true);
            gateway.transitioning = false;
            gateway.ui.updatePlanetButtons();
            gateway.ui.formatDestinyGamble();
        },

        formatDestinyGamble() {
            if (!_.isUndefined(SharkGame.persistentFlags.destinyRolls)) {
                switch (SharkGame.persistentFlags.destinyRolls) {
                    case 0:
                        $("#destinyGamble").html("Não há mais mudança. Entre em um mundo para recarregar.").addClass("disabled");
                        break;
                    case 1:
                        $("#destinyGamble").html("Mudar Mundos (1 mudança resta)");
                        break;
                    default:
                        $("#destinyGamble").html("Mudar Mundos (" + SharkGame.persistentFlags.destinyRolls + " mudanças restam)");
                }
            }
        },

        confirmWorld() {
            const selectedWorldData = SharkGame.WorldTypes[gateway.selectedWorld];
            const seenWorldYet = gateway.completedWorlds.includes(gateway.selectedWorld);

            // construct the gateway content
            const gatewayContent = $("<div>").append(
                $("<p>").html(seenWorldYet ? "Re-entrar no Mundo " + selectedWorldData.name + "?" : "Explorar este mundo?"),
            );

            gatewayContent.append(
                $("<p>")
                    .attr("id", "predicted-gain")
                    .html(
                        `${seenWorldYet ? "O tempo normal" : "Isso"} te presenteará com <strong>` +
                            sharktext.beautify(
                                Math.ceil(
                                    (1 + gateway.getGumptionBonus()) *
                                        ((seenWorldYet ? 2 : 4) + (selectedWorldData.bonus ? selectedWorldData.bonus : 0)) +
                                        SharkGame.Aspects.patience.level *
                                            (SharkGame.persistentFlags.dialSetting > 1
                                                ? Math.round((2 * Math.log(SharkGame.persistentFlags.dialSetting)) / Math.log(4))
                                                : 1),
                                ),
                                false,
                                2,
                            ) +
                            "</strong> de " +
                            sharktext.getResourceName("essence", undefined, undefined, sharkcolor.getElementColor("pane")) +
                            " ao todo.",
                    ),
            );

            // add world image
            const spritename = seenWorldYet ? "planets/" + gateway.selectedWorld : "planets/missing";
            const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
            if (iconDiv) {
                iconDiv.addClass("planetDisplay");
                const containerDiv = $("<div>").attr("id", "planetContainer");
                containerDiv.append(iconDiv);
                gatewayContent.append(containerDiv);
            }

            const attributeDiv = $("<div>");
            gateway.ui.showPlanetAttributes(selectedWorldData, seenWorldYet, attributeDiv);
            gatewayContent.append(attributeDiv);

            if (seenWorldYet && selectedWorldData.par) {
                gatewayContent.append(
                    $("<p>").html("Tempo normal: <strong>" + selectedWorldData.par + " minutes</strong><br> Passe por esse mundo mais rápido para ganhar mais essência."),
                );
            }

            if (SharkGame.Aspects.theDial.level) {
                gatewayContent.append($("<hr>"));
                const dial = $("<input>")
                    .attr("id", "dial-slider")
                    .attr("list", "ticks")
                    .attr("type", "range")
                    .attr("min", 1)
                    .attr("max", 8)
                    .attr("step", 1)
                    .attr("value", Math.round(Math.log(SharkGame.persistentFlags.dialSetting) / Math.log(4)) + 1)
                    .on("input", gateway.dial.changeSetting);
                gatewayContent.append(dial);
                const ticks = $("<datalist>")
                    .attr("id", "ticks")
                    .append($("<option>").html(1))
                    .append($("<option>").html(2))
                    .append($("<option>").html(3))
                    .append($("<option>").html(4))
                    .append($("<option>").html(5))
                    .append($("<option>").html(6))
                    .append($("<option>").html(7))
                    .append($("<option>").html(8));
                gatewayContent.append(ticks);
                let dialLabel;
                if (SharkGame.persistentFlags.dialSetting > 1) {
                    dialLabel = $("<p>")
                        .attr("id", "dial-label")
                        .html(
                            sharktext.boldString(`velocidade do jogo está ${SharkGame.persistentFlags.dialSetting}× mais lento<br>
                    patience rewards ×${
                        SharkGame.persistentFlags.dialSetting > 1
                            ? Math.round((2 * Math.log(SharkGame.persistentFlags.dialSetting)) / Math.log(4))
                            : 1
                    }`),
                        );
                } else {
                    dialLabel = $("<p>")
                        .attr("id", "dial-label")
                        .html("Ajuste O Seletor para mudar as recompensas de Paciência.<br>...ou não. Não estou te obrigando a nada.");
                }

                gatewayContent.append(dialLabel);
                gatewayContent.append($("<hr>"));
            }

            // add confirm button
            const confirmButtonDiv = $("<div>");
            SharkGame.Button.makeButton("progress", "continuar", confirmButtonDiv, () => {
                function checkAspects() {
                    let doProceed = true;
                    $.each(SharkGame.Aspects, (_aspectName, aspectData) => {
                        if (aspectData.level && !aspectData.core) {
                            doProceed = confirm(
                                "Opa, espera aí! Apenas ASPECTOS CENTRAIS funcionam durante uma exploração, e você tem alguns aspectos que não são! Se continuar, esses aspectos não centrais vão parar de funcionar até você voltar aqui. Tem certeza que quer continuar?",
                            );
                            return false;
                        }
                    });
                    return doProceed;
                }
                if (gateway.completedWorlds.includes(gateway.selectedWorld) || checkAspects()) {
                    if (SharkGame.persistentFlags.minuteStorage > 1000) {
                        gateway.ui.showMinuteHandStorageExtraction(gateway.selectedWorld);
                    } else {
                        // kick back to main to start up the game again
                        world.worldType = gateway.selectedWorld;
                        main.loopGame();
                    }
                }
            });
            gatewayContent.append(confirmButtonDiv);

            // add return to planets button
            const returnButtonDiv = $("<div>");
            SharkGame.Button.makeButton("backToGateway", "reconsiderar", returnButtonDiv, () => {
                gateway.ui.switchViews(gateway.ui.showPlanets);
            });
            gatewayContent.append(returnButtonDiv);

            SharkGame.PaneHandler.swapCurrentPane("CONFIRM", gatewayContent, true, 500, true);
            gateway.transitioning = false;
        },

        switchViews(callback) {
            if (!gateway.transitioning) {
                gateway.transitioning = true;
                if (SharkGame.Settings.current.showAnimations) {
                    $("#pane").animate(
                        {
                            opacity: 0.0,
                        },
                        500,
                        "swing",
                        callback,
                    );
                } else {
                    callback();
                }
            }
        },

        showPlanetAttributes(worldData, seenWorldYet, contentDiv) {
            switch (SharkGame.Aspects.distantForesight.level) {
                case 1:
                    contentDiv.prepend($("<p>").html(worldData.foresight.longDesc));
                    if (worldData.foresight.missing && worldData.foresight.missing.length > 0) {
                        const missingList = $("<ul>").addClass("gatewayPropertyList");
                        _.each(worldData.foresight.missing, (missingResource) => {
                            missingList.append(
                                $("<li>").html(
                                    "Esse mundo não possui " +
                                        sharktext.getResourceName(missingResource, false, 2, sharkcolor.getElementColor("pane")) +
                                        ".",
                                ),
                            );
                        });
                        contentDiv.prepend(missingList);
                    }
                    if (worldData.foresight.present && worldData.foresight.present.length > 0) {
                        const presentList = $("<ul>").addClass("gatewayPropertyList");
                        _.each(worldData.foresight.present, (presentResource) => {
                            presentList.append(
                                $("<li>").html(
                                    "Você sente a presença de " +
                                        sharktext.getResourceName(
                                            presentResource,
                                            false,
                                            2,
                                            sharkcolor.getElementColor("pane", "background-color"),
                                            gateway.playerHasSeenResource(presentResource) ? undefined : gateway.PresenceFeelings[presentResource],
                                        ) +
                                        ".",
                                ),
                            );
                        });
                        contentDiv.prepend(presentList);
                    }
                    if (worldData.modifiers && worldData.modifiers.length > 0) {
                        const modifierList = $("<ul>").addClass("gatewayPropertyList");
                        _.each(worldData.modifiers, (modifier) => {
                            if (gateway.playerHasSeenResource(modifier.resource) || !(worldData.foresight.present.indexOf(modifier.resource) > -1)) {
                                modifierList.append(
                                    $("<li>").html(
                                        SharkGame.ModifierReference.get(modifier.modifier).effectDescription(
                                            modifier.amount,
                                            modifier.resource,
                                            "#246c54",
                                        ),
                                    ),
                                );
                            } else {
                                modifierList.append(
                                    $("<li>").html(
                                        SharkGame.ModifierReference.get(modifier.modifier)
                                            .effectDescription(modifier.amount, modifier.resource, sharkcolor.getElementColor("pane"))
                                            .replace(new RegExp(modifier.resource, "g"), gateway.PresenceFeelings[modifier.resource]),
                                    ),
                                );
                            }
                        });
                        contentDiv.prepend(modifierList);
                        contentDiv.prepend($("<p>").html("ATTRIBUTES:"));
                    } else {
                        contentDiv.prepend($("<p>").html("SEM ATRIBUTOS CONHECIDOS"));
                    }
                    break;
                default:
                    if (seenWorldYet) {
                        contentDiv.prepend($("<p>").html(worldData.foresight.longDesc));
                    } else {
                        contentDiv.prepend($("<p>").html(worldData.foresight.vagueLongDesc));
                    }
            }
        },

        showWorldVisitMenu() {
            const menuContent = $("<div>").append($("<p>").html("Escolha um mundo para visitar:"));
            const visitButtons = $("<div>").attr("id", "visitButtons");

            _.each(gateway.allowedWorlds, (planetName) => {
                SharkGame.Button.makeButton(planetName + "VisitButton", "visitar " + planetName, visitButtons, () => {
                    if (SharkGame.persistentFlags.minuteStorage > 1000) {
                        gateway.ui.showMinuteHandStorageExtraction(planetName);
                    } else {
                        // kick back to main to start up the game again
                        world.worldType = planetName;
                        main.loopGame();
                    }
                });
            });

            menuContent.append(visitButtons);
            SharkGame.Button.makeButton("backButton", "voltar", menuContent, () => {
                gateway.ui.switchViews(gateway.ui.showPlanets);
            });

            SharkGame.PaneHandler.swapCurrentPane("VISITA DE DEBUG", menuContent, true, 500, true);
            gateway.transitioning = false;
        },

        updatePlanetButtons() {
            _.each(gateway.planetPool, (planetData) => {
                const buttonSel = $("#planet-" + planetData.type);
                if (buttonSel.length > 0) {
                    const seenWorldYet = gateway.completedWorlds.includes(planetData.type);
                    const deeperPlanetData = SharkGame.WorldTypes[planetData.type];
                    const label =
                        sharktext.boldString(seenWorldYet ? deeperPlanetData.name : "???") +
                        "<br>" +
                        (seenWorldYet ? deeperPlanetData.desc : deeperPlanetData.vagueDesc) +
                        (seenWorldYet && gateway.getPar(planetData.type)
                            ? "<br>Tempo normal: <strong>" + gateway.getPar(planetData.type) + " minutos</strong>"
                            : "");

                    buttonSel.html(label);

                    const spritename = seenWorldYet ? "planets/" + planetData.type : "planets/missing";
                    if (SharkGame.Settings.current.showIcons) {
                        const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
                        if (iconDiv) {
                            iconDiv.addClass("button-icon");
                            buttonSel.prepend(iconDiv);
                        }
                    }
                }
            });
        },

        showMinuteHandStorageExtraction(worldtype) {
            function getRequestedTime() {
                let years = 0;
                let months = 0;
                let weeks = 0;
                let days = 0;
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                if (!$.isEmptyObject($("#storage-years")) && $("#storage-years")[0] && $("#storage-years")[0].value) {
                    years = Number($("#storage-years")[0].value);
                }
                if (!$.isEmptyObject($("#storage-months")) && $("#storage-months")[0] && $("#storage-months")[0].value) {
                    months = Number($("#storage-months")[0].value);
                }
                if (!$.isEmptyObject($("#storage-weeks")) && $("#storage-weeks")[0] && $("#storage-weeks")[0].value) {
                    weeks = Number($("#storage-weeks")[0].value);
                }
                if (!$.isEmptyObject($("#storage-days")) && $("#storage-days")[0] && $("#storage-days")[0].value) {
                    days = Number($("#storage-days")[0].value);
                }
                if (!$.isEmptyObject($("#storage-hours")) && $("#storage-hours")[0] && $("#storage-hours")[0].value) {
                    hours = Number($("#storage-hours")[0].value);
                }
                if (!$.isEmptyObject($("#storage-minutes")) && $("#storage-minutes")[0] && $("#storage-minutes")[0].value) {
                    minutes = Number($("#storage-minutes")[0].value);
                }
                if (!$.isEmptyObject($("#storage-seconds")) && $("#storage-seconds")[0] && $("#storage-seconds")[0].value) {
                    seconds = Number($("#storage-seconds")[0].value);
                }

                const result = (years * 29030400 + months * 2419200 + weeks * 604800 + days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000;
                return result;
            }

            function updateRequestedTime() {
                let requestedTime = getRequestedTime();
                const storage = SharkGame.persistentFlags.minuteStorage;

                if (requestedTime > storage) {
                    requestedTime = storage;
                }

                if (requestedTime > 600000 && !gateway.completedWorlds.includes(worldtype)) {
                    requestedTime = 600000;
                }

                $("#remaining-time").html(
                    `De acordo com a sua escolha, você deixará ${sharktext.boldString(
                        res.minuteHand.formatMinuteTime(storage - requestedTime, true),
                    )} guardados.`,
                );
                $("#requested-time").html(`Você levará ${sharktext.boldString(res.minuteHand.formatMinuteTime(requestedTime, true))} com você.`);
            }

            const menuContent = $("<div>").append(
                $("<p>").html(`Você tem algum ${SharkGame.Settings.current.idleEnabled ? "tempo extra" : "tempo"} armazenado.`),
            );
            const timeSelection = $("<div>").attr("id", "minute-storage-selection");

            const timeLeft = res.minuteHand.formatMinuteTime(SharkGame.persistentFlags.minuteStorage, true);
            timeSelection.append($("<p>").html(`Há ${sharktext.boldString(timeLeft)} restante.`));

            if (!gateway.completedWorlds.includes(worldtype)) {
                timeSelection.append(
                    $("<p>").html(sharktext.boldString("Já que você está indo para uma missão de exploração, você pode levar até 10 minutos com você.")),
                );
            }

            timeSelection.append($("<p>").html("Quanto que você gostaria de levar com você para esse próximo mundo?"));

            const times = timeLeft.split(" ");
            times.reverse();
            const precision = times.length;
            if (gateway.completedWorlds.includes(worldtype)) {
                switch (precision) {
                    case 7:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-years")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("Y "));
                        // fallthrough
                    case 6:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-months")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("M "));
                        // fallthrough
                    case 5:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-weeks")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("W "));
                        // fallthrough
                    case 4:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-days")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("D "));
                        // fallthrough
                    case 3:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-hours")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("h "));
                        // fallthrough
                    case 2:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-minutes")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("m "));
                        // fallthrough
                    case 1:
                        timeSelection.append(
                            $("<input>")
                                .attr("id", "storage-seconds")
                                .attr("type", "number")
                                .attr("min", 0)
                                .attr("max", 9999)
                                .on("input", updateRequestedTime),
                        );
                        timeSelection.append($("<strong>").html("s"));
                }
            } else {
                if (precision > 1) {
                    timeSelection.append(
                        $("<input>")
                            .attr("id", "storage-minutes")
                            .attr("type", "number")
                            .attr("min", 0)
                            .attr("max", 9999)
                            .on("input", updateRequestedTime),
                    );
                    timeSelection.append($("<strong>").html("m "));
                }
                timeSelection.append(
                    $("<input>")
                        .attr("id", "storage-seconds")
                        .attr("type", "number")
                        .attr("min", 0)
                        .attr("max", 9999)
                        .on("input", updateRequestedTime),
                );
                timeSelection.append($("<strong>").html("s"));
            }
            timeSelection.append(
                $("<p>").html(sharktext.boldString("EVITE O DESPERDÍCIO, LEVE APENAS O NECESSÁRIO!<br>O que você levar mas não usar vai sumir no final de tudo.")),
            );
            timeSelection.append($("<hr>"));
            timeSelection.append($("<p>").attr("id", "remaining-time"));
            timeSelection.append($("<p>").attr("id", "requested-time"));

            menuContent.append(timeSelection);
            SharkGame.Button.makeButton("minute-storage-confirm", "confirm", menuContent, () => {
                let requestedTime = getRequestedTime();
                const storage = SharkGame.persistentFlags.minuteStorage;
                if (requestedTime > storage) {
                    requestedTime = storage;
                }

                if (requestedTime > 600000 && !gateway.completedWorlds.includes(worldtype)) {
                    requestedTime = 600000;
                }

                SharkGame.persistentFlags.minuteStorage -= requestedTime;
                SharkGame.persistentFlags.requestedTime = requestedTime;

                world.worldType = worldtype;
                main.loopGame();
            });

            SharkGame.PaneHandler.swapCurrentPane("THE TIME BANK", menuContent, true, 500, true);
            updateRequestedTime();
            gateway.transitioning = false;
        },
    },

    dial: {
        init() {
            SharkGame.persistentFlags.dialSetting = 1;
        },
        changeSetting(_event, arbitrary) {
            if (arbitrary) {
                SharkGame.persistentFlags.dialSetting = arbitrary;
            } else {
                SharkGame.persistentFlags.dialSetting = Math.round(4 ** (document.getElementById("dial-slider").value - 1));
            }
            gateway.dial.updateVisuals();
        },
        updateVisuals() {
            if (SharkGame.persistentFlags.dialSetting > 1) {
                $("#dial-label").html(
                    sharktext.boldString(`velocidade do jogo ${SharkGame.persistentFlags.dialSetting}× mais lento<br>
                Patience rewards ×${
                    SharkGame.persistentFlags.dialSetting > 1 ? Math.round((2 * Math.log(SharkGame.persistentFlags.dialSetting)) / Math.log(4)) : 1
                }`),
                );
            } else {
                $("#dial-label").html("Ajuste O Seletor para mudar as recompensas de Paciência.<br>...ou não. Não estou te obrigando a nada.");
            }

            const selectedWorldData = SharkGame.WorldTypes[gateway.selectedWorld];
            const seenWorldYet = gateway.completedWorlds.includes(gateway.selectedWorld);
            $("#predicted-gain").html(
                `${seenWorldYet ? "O tempo normal" : "Isso"} te presenteará com <strong>` +
                    sharktext.beautify(
                        Math.ceil(
                            (1 + gateway.getGumptionBonus()) * ((seenWorldYet ? 2 : 4) + (selectedWorldData.bonus ? selectedWorldData.bonus : 0)) +
                                SharkGame.Aspects.patience.level *
                                    (SharkGame.persistentFlags.dialSetting > 1
                                        ? Math.round((2 * Math.log(SharkGame.persistentFlags.dialSetting)) / Math.log(4))
                                        : 1),
                        ),
                        false,
                        2,
                    ) +
                    "</strong> " +
                    sharktext.getResourceName("essence", undefined, undefined, sharkcolor.getElementColor("pane")) +
                    " ao todo.",
            );
        },
    },
};

SharkGame.Gateway.PresenceFeelings = {
    clam: "coisinhas duras?",
    sponge: "coisas porosas?",
    jellyfish: "coisas molengas?",
    coral: "coisas coloridas?",
    dolphin: "pentelhos eruditos?",
    whale: "gigantes sábios?",
    octopus: "entidades lógicas?",
    squid: "caçadores leais?",
    urchin: "criaturas sem cérebro?",
    shrimp: "seguidores simples?",
    lobster: "crutáceos irresponsáveis?",
    chimaera: "predadoras familiares?",
    eel: "caçadores rastejantes?",
    tar: "algo nojento?",
    algae: "algo microscópico?",
    seagrass: "umas planta?",
    billfish: "sobreviventes determinados?",
};

SharkGame.Gateway.Messages = {
    essenceBased: [
        {
            min: 5,
            max: 10,
            messages: [
                "Eu sinto e percebo, tua aptidão cresce.",
                "Tua presença ainda está fraca, mas ela vem aumentando.",
                "Que novas paisagens tens visto nessas jornadas?",
                "O que está achando de tua jornada?",
                "Percebeste como quase ninguém consegue te seguir aqui?",
            ],
        },
        {
            min: 11,
            max: 30,
            messages: [
                "O quão rápido viajas pelos mundos?",
                "Me pareces estar ficando familiar com isso.",
                "De volta já?",
                "Bem vinde de volta, ao espaço entre os espaços.",
            ],
        },
        {
            min: 31,
            max: 50,
            messages: [
                "És um viajante como qualquer outro.",
                "Eu te vejo mais do que nunca. Consegues tu me ver?",
                "Do que te lembras?",
                "Me lembras de uma versão minha, de um época se se foi há muito tempo.",
                "Bem vinde de novo à irrealidade irregular.",
            ],
        },
        {
            min: 51,
            max: 200,
            messages: [
                "Já achaste tua casa?",
                "Certamente teu lar jaz no próximo mundo, não?",
                "Já retornaste a algum dos mundos os quais exploraras?",
                "Consegues achar outro alguém que viaja tanto quanto tu?",
                "Tens ficado tão forte. Tão poderoso.",
                "Me lembro da tua primeira vez aqui, tomade por confusão e horror.",
            ],
        },
        {
            min: 201,
            messages: [
                "Tua devoção à essa jornada é pavorosa.",
                "Ultrapassas qualquer coisa que já vi antes.",
                "You are a force of will within the shell of a shark.",
                "Me surpreende teu foco e dedicação. Mas talvez possas alojar-te no próximo mundo?",
                "Teu lar realmente existe?",
                "Haverá um fim à tua procura?",
                "Por que ainda procuras? Tantos outros já teriam desistido a este ponto.",
            ],
        },
    ],
    lastPlanetBased: {
        start: ["O que lhe traz aqui, pequenino forasteiro?", "Tua jornada acabou de começar.", "Bem vinde ao fim de teu início."],
        marine: [
            "Teu último oceano lhe pareceu familiar?",
            "Trazes vida, ou trazes morte, criador de mundos?",
            "Uma tragédia; ou, talvez, meramente o custo do progresso.",
            "Nós confrontamos nossos erros como escolhas. Nós os repetimos, ou aprendemos a evitá-los.",
        ],
        haven: [
            "Um paraíso maravilhoso. Talvez leve um tempo até achares um mundo tão lindo novamente.",
            "Que atol vislumbrante deixaste para trás? Aqueles que não puderam te seguir certamente viverão felizes.",
            "Por que saíste?",
            "The incessant chatter of the dolphins has stopped.",
            "Something echoed from the gate into this realm. Was that you?",
            "Do you wonder how the dolphins arrived in this state?",
        ],
        tempestuous: [
            "Desbravaste a tempestade e saiste são e salvo.",
            "Avança pelo redemoinho. Não dê trégua à tempestade.",
            "Já perguntaste quem contruiu essa grande máquina?",
            "Os peixes-espada são rápidos, mas não corajosos. Foste tu que os mostrou sua bravura.",
        ],
        volcanic: [
            "The boiling ocean only stirred you on.",
            "You are forged from the geothermal vents.",
            "The shrimp are no simpletons. You have demonstrated as much.",
            "That environment is ideal for life. Just not for your kind.",
            "Do you wonder why that world had no sharks?",
            "Do you wonder why the king was so startled when he finally saw you?",
        ],
        abandoned: [
            "Do you wonder who abandoned the machines?",
            "Sabes os polvos quem veio antes deles? Sabes tu?",
            "Nós confrontamos nossos erros como escolhas. Nós os repetimos, ou aprendemos a evitá-los.",
        ],
        shrouded: [
            "As quimeras te reconheceram?",
            "O que aprendeste do mundo sombrio?",
            "Para fitar o abismo é fácil, mas aguentar quando o abismo fita de volta é difícil.",
            "Forças estranhas guiavam as quimeras, assim como forças estranhas te guiam.",
            "Já ponderaste de onde vieram os fragmentos mágicos?",
            "Perguntas-te quem eram os anciões?",
        ],
        frigid: [
            "...sentiste falta das arraias?",
            "Conta-me: Como tu diferencias amigos de comida? Os ouriços são tão cabeça oca quanto um peixe.",
            "Indagas a quem será que as lulas admiravam?",
            "Perguntas-te que construiu a grande máquina?",
        ],
    },
    loss: [
        "Não importa. Vais ter êxito na próxima vez, sem dúvida.",
        "Nunca desistas. Nunca te dê por vencide. Bordões vazios, possivelmente, mas um conselho sábio independentemente.",
        "Erros são preenchidos de aprendizados. Aprenda a não os repetir.",
        /*         "How does it feel to know that everyone who trusted you has perished?",
        "Another world dies. Was this one significant to you?", */
        "Lamentável. Mas terás tempo para redimir-te.",
        /*         "What a pity. What a shame. I hear the mournful cries of a dying ocean.", */
        "Consegues melhor. Farás melhor. Acredita.",
        /*         "You wish to get back here so quickly?",
        "You and everything you knew has died. Perhaps not you. Perhaps not.", */
        "Tenta outra vez, quem sabe?",
        "A excelencia é um hábito. Somos o que sempre fazemos. Tenta de novo, e faça melhor.",
    ],
    generic: [
        "Aqui não há calor, não há frio, não há dor. Apenas um torpor.",
        "O que procuras?",
        "Estamos na borda do infinito, contemplando um oceano de potencial.",
        "Tu não me vês. Não te preocupa. Eu consigo te ver muito bem.",
        "Quem sou eu? Ora, isso não é importante. Não agora.",
        "Será isto um sonho de ume tubarão entre mundos, ou serão os mundos os sonhos e este lugar tua realidade?",
        "Uma encruzilhada. Decisões. Decisões a serem tomadas seriamente.",
        "Há cousas para se apreciar por aqueles que conseguem enxegar neste local.",
        "És ao oceano o que somos às trilhas.",
        "Nadas em infinidade líquida. Tu estás agora, sempre, e eternamente.",
        "Ê tubarão pródigo retorna.",
        "Tua perpétua vontade continua te levando a superar a ti mesmo.",
        "Não há espaço neste universo que não consigas transformar em teu.",
    ],
};
