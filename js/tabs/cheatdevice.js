"use strict";
SharkGame.CheatsAndDebug = {
    tabId: "cheats",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Trapaçarias",
    tabBg: "img/bg/bg-gate.png",

    sceneImage: "img/events/misc/scene-reflection.png",

    discoverReq: {
        flag: {
            debug: true,
        },
    },

    pause: false,
    stop: false,
    speed: 1,
    upgradePriceModifier: 1,
    actionPriceModifier: 1,
    noNumberBeautifying: false,
    cycling: false,
    frozen: false,

    defaultParameters: {
        pause: false,
        stop: false,
        speed: 1,
        upgradePriceModifier: 1,
        actionPriceModifier: 1,
        noNumberBeautifying: false,
        cycling: false,
        frozen: false,
    },

    cheatButtons: {
        giveEverything: {
            get name() {
                return "Ganhar " + sharktext.beautify(sharkmath.getBuyAmount(true)) + " de Tudo";
            },
            type: "numeric",
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveEverything(sharkmath.getBuyAmount(true)));
            },
        },
        removeEverything: {
            get name() {
                return "Perder " + sharktext.beautify(sharkmath.getBuyAmount(true)) + " de Tudo";
            },
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveEverything(-sharkmath.getBuyAmount(true)));
            },
        },
        giveSomething: {
            get name() {
                const resource = $("#somethingSelector")[0].value;
                return (
                    "Ganhar " +
                    sharktext.beautify(sharkmath.getBuyAmount(true)) +
                    " " +
                    sharktext.getResourceName(resource, false, sharkmath.getBuyAmount(true), sharkcolor.getVariableColor("--color-light"))
                );
            },
            type: "choice",
            choiceId: "somethingSelector",
            getChoices() {
                const existingStuff = [];
                SharkGame.ResourceMap.forEach((_resource, resourceId) => {
                    if (world.doesResourceExist(resourceId)) {
                        existingStuff.push(resourceId);
                    }
                });
                return existingStuff;
            },
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveSomething($("#somethingSelector")[0].value, sharkmath.getBuyAmount(true)));
            },
        },
        removeSomething: {
            get name() {
                const resource = $("#somethingSelector")[0].value;
                return (
                    "Remove " +
                    sharktext.beautify(sharkmath.getBuyAmount(true)) +
                    " " +
                    sharktext.getResourceName(resource, false, sharkmath.getBuyAmount(true), sharkcolor.getVariableColor("--color-light"))
                );
            },
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveSomething($("#somethingSelector")[0].value, -sharkmath.getBuyAmount(true)));
            },
        },
        pause: {
            get name() {
                return cad.pause ? "Despausar Jogo" : "Pausar Jogo";
            },
            updates: true,
            category: "debug",
            click() {
                cad.togglePausePlease();
            },
        },
        stop: {
            get name() {
                return cad.stop ? "Continuar Execução" : "Para Execução";
            },
            updates: true,
            category: "debug",
            click() {
                cad.toggleStopPlease();
            },
        },
        changeSpeed: {
            name: "Velocidade do Jogo",
            type: "up-down",
            category: "modifiers",
            clickUp() {
                const msg = cad.goFasterPlease();
                if (msg) log.addMessage(msg);
            },
            clickDown() {
                const msg = cad.goSlowerPlease();
                if (msg) log.addMessage(msg);
            },
        },
        changeUpgradePrices: {
            name: "Custo de Melhorias",
            type: "up-down",
            category: "modifiers",
            clickUp() {
                const msg = cad.expensiveUpgradesPlease();
                if (msg) log.addMessage(msg);
            },
            clickDown() {
                const msg = cad.cheaperUpgradesPlease();
                if (msg) log.addMessage(msg);
            },
        },
        changeStuffPrices: {
            name: "Preço de Coisas",
            type: "up-down",
            category: "modifiers",
            clickUp() {
                const msg = cad.expensiveStuffPlease();
                if (msg) log.addMessage(msg);
            },
            clickDown() {
                const msg = cad.cheaperStuffPlease();
                if (msg) log.addMessage(msg);
            },
        },
        toggleFreeStuff: {
            get name() {
                return cad.actionPriceModifier ? "Habilitar coisas grátis" : "Disabilitar coisas grátis";
            },
            category: "modifiers",
            updates: true,
            click() {
                const msg = cad.toggleFreeStuff();
                if (msg) log.addMessage(msg);
            },
        },
        toggleFreeUpgrades: {
            get name() {
                return cad.upgradePriceModifier ? "Habilitar melhorias grátis" : "Desativar melhorias grátis";
            },
            category: "modifiers",
            updates: true,
            click() {
                const msg = cad.toggleFreeUpgrades();
                if (msg) log.addMessage(msg);
            },
        },
        toggleDebugButton: {
            get name() {
                if (SharkGame.HomeActions.getActionTable().debugbutton.unauthorized) {
                    return "Habilitar botão de debug";
                } else {
                    return "Desativar botão de debug";
                }
            },
            category: "debug",
            updates: true,
            click() {
                cad.toggleDebugButton();
            },
        },
        toggleBeautify: {
            get name() {
                if (cad.noNumberBeautifying) {
                    return "Formatar números";
                } else {
                    return "Tirar formatação de números";
                }
            },
            category: "debug",
            updates: true,
            click() {
                cad.toggleBeautify();
            },
        },
        beatWorld: {
            name: "Vencer este mundo imediatamante",
            category: "misc",
            click() {
                log.addMessage(cad.beatWorldPlease());
            },
        },
        addUpgrades: {
            name: "Conseguir todas as melhorias",
            category: "misc",
            click() {
                cad.addUpgradesPlease();
            },
        },
        addIdleTime: {
            name: "Adicionar tempo extra",
            category: "misc",
            click() {
                cad.addIdleTimePlease();
            },
        },
        rollDice: {
            name: "Role um dado, efeitos malucos",
            location: "right",
            category: "nonsense",
            click() {
                log.addMessage(cad.rollTheDicePlease());
            },
        },
        freezeGame: {
            get name() {
                return cad.frozen ? "Descongelar recursos" : "Congelar recursos";
            },
            updates: true,
            category: "nonsense",
            click() {
                log.addMessage(cad.toggleFreezePlease());
            },
        },
        forceExistence: {
            name: "Fazer todas as coisas existirem",
            location: "right",
            category: "nonsense",
            click() {
                log.addMessage(cad.forceAllExist());
            },
        },
        // challengeMe: {
        //     name: "Spin the wheel of challenges",
        //     location: "right",
        //     click() {
        //         log.addMessage(cad.challengeMePlease());
        //     },
        // },
        egg: {
            name: "egg",
            category: "nonsense",
            click() {
                log.addMessage(cad.doEgg());
            },
        },
    },

    init() {
        SharkGame.TabHandler.registerTab(this);
    },

    setup() {
        if (SharkGame.persistentFlags.debug) {
            // unlock cheats for anyone who already has debug mode access
            gateway.unlockCheats();
        }
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "aspectList"));
        let message = "";
        if (SharkGame.Settings.current.showTabImages) {
            message =
                "<img width=400 height=200 src='" +
                cad.sceneImage +
                "' id='tabSceneImageEssence'>" +
                "Serve como um menu de debug e um painel de trapaças.";
            $("#tabMessage").css("background-image", "url('" + cad.tabBg + "')");
        }
        $("#tabMessage").html(message);

        content.append($("<table>").attr("id", "leftButtons"));
        content.append($("<table>").attr("id", "rightButtons"));
        content.append($("<table>").attr("id", "cheatsDisplay").html("<br>"));
        $.each(cad.defaultParameters, (parameter) => {
            $("#cheatsDisplay").append($("<tr>").attr("id", parameter + "Row"));
        });

        const categories = [];
        let placeLeft = true;
        _.each(cad.cheatButtons, (buttonData) => {
            const category = buttonData.category;
            if (!categories.includes(category)) {
                categories.push(category);
                if (placeLeft) {
                    $("#leftButtons").append(
                        $("<tr>")
                            .attr("id", category)
                            .html("<h3>" + category + "</h3>"),
                    );
                    placeLeft = false;
                } else {
                    $("#rightButtons").append(
                        $("<tr>")
                            .attr("id", category)
                            .html("<h3>" + category + "</h3>"),
                    );
                    placeLeft = true;
                }
            }
        });

        let selector;
        let container;
        let buttonContainer; // prettier gets angry at me if i try to declare these case-specific variables inside the case
        $.each(cad.cheatButtons, (buttonName, buttonData) => {
            // const toAppendTo = buttonData.location === "right" ? $("#rightButtons") : $("#leftButtons");
            const toAppendTo = $("#" + buttonData.category);
            switch (buttonData.type) {
                case "up-down":
                    if (!buttonData.clickUp || !buttonData.clickDown) {
                        log.addError("Cheat button is up-down type, but has no functions for its buttons.");
                        return true;
                    }
                    container = $("<div>").attr("id", buttonName).addClass("up-down");
                    container.append("<span class='up-downText'>" + buttonData.name + "</span>");
                    buttonContainer = $("<div>").addClass("up-downButtonContainer");
                    buttonContainer.append(
                        $("<button id='" + buttonName + "Up' class='min close-button'>⯅</button>").on("click", buttonData.clickUp),
                    );
                    buttonContainer.append(
                        $("<button id='" + buttonName + "Down' class='min close-button'>⯆</button>").on("click", buttonData.clickDown),
                    );
                    container.append(buttonContainer);
                    toAppendTo.append(container);
                    break;
                case "numeric":
                    main.createBuyButtons("cheat", toAppendTo, "append", true);
                    SharkGame.Button.makeButton(buttonName, buttonData.name, toAppendTo, buttonData.click);
                    break;
                case "choice":
                    selector = $("<select>").attr("id", buttonData.choiceId);
                    _.each(buttonData.getChoices(), (choice) => {
                        selector.append("<option>" + choice + "</option>");
                    });
                    toAppendTo.append(selector);
                    SharkGame.Button.makeButton(buttonName, buttonData.name, toAppendTo, buttonData.click);
                    break;
                default:
                    SharkGame.Button.makeButton(buttonName, buttonData.name, toAppendTo, buttonData.click);
            }
        });

        if (cad.pause) {
            $("#stop").addClass("disabled");
        } else {
            $("#stop").removeClass("disabled");
        }

        if (cad.stop) {
            $("#pause").addClass("disabled");
        } else {
            $("#pause").removeClass("disabled");
        }

        this.update();
        SharkGame.persistentFlags.seenCheatsTab = true;
    },

    update() {
        $.each(cad.defaultParameters, (which, defaultValue) => {
            let msg = "<br>";
            if (defaultValue !== cad[which]) {
                switch (which) {
                    case "pause":
                        msg = "Jogo pausado.";
                        break;
                    case "stop":
                        msg = "Processamento do jogo parado.";
                        break;
                    case "speed":
                        msg = "Velocidade do tempo x" + cad.speed + ".";
                        break;
                    case "upgradePriceModifier":
                        msg = "Melhorias têm " + cad.upgradePriceModifier + "x o preço normal.";
                        break;
                    case "actionPriceModifier":
                        msg = "Preço de compra multiplicado por " + cad.actionPriceModifier + "x.";
                        break;
                    case "noNumberBeautifying":
                        msg = "Formatação numérica desativada.";
                        break;
                    case "cycling":
                        msg = "Mudando estilos.";
                        break;
                }
            }
            if ($("#" + which + "Row").html() !== msg) {
                $("#" + which + "Row").html(msg);
            }
        });

        $.each(cad.cheatButtons, (buttonName, buttonData) => {
            if (buttonData.updates) {
                switch (buttonData.type) {
                    case "up-down":
                        // does nothing yet
                        break;
                    default:
                        if ($("#" + buttonName).html() !== buttonData.name) {
                            $("#" + buttonName).html(buttonData.name);
                        }
                }
            }
        });
    },

    cycleStyles(time = 2000) {
        if (cad.cycling) return;
        cad.cycling = true;
        let i = 0;
        let intervalId = NaN;
        function nextStyle() {
            if (i >= gateway.allowedWorlds.length && !isNaN(intervalId)) {
                clearInterval(intervalId);
            } else {
                world.worldType = gateway.allowedWorlds[i++];
                console.debug(`worldType now ${world.worldType}`);
            }
        }
        setTimeout(nextStyle);
        intervalId = setInterval(nextStyle, time);
        cad.cycling = false;
    },

    discoverAll() {
        $.each(SharkGame.Tabs, (tabName) => {
            if (tabName !== "current") {
                SharkGame.TabHandler.discoverTab(tabName);
            }
        });
    },

    giveEverything(amount = 1) {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            res.changeResource(resourceId, amount);
        });
        return (amount > 0 ? "Gave " + sharktext.beautify(amount) : "Removed " + sharktext.beautify(-amount)) + " stuff.";
    },

    giveSomething(resourceId = "fish", amount = 1) {
        res.changeResource(resourceId, amount);
        let returnText;
        const resourceName = sharktext.getResourceName(
            resourceId,
            false,
            sharkmath.getBuyAmount(true),
            log.isNextMessageEven() ? sharkcolor.getVariableColor("--color-dark") : sharkcolor.getVariableColor("--color-med"),
        );
        if (amount > 0) {
            returnText = `Gave ${sharktext.beautify(amount)} ${resourceName}.`;
        } else {
            returnText = `Removed ${sharktext.beautify(-amount)} ${resourceName}.`;
        }
        return returnText;
    },

    debug() {
        SharkGame.persistentFlags.debug = true;
        SharkGame.persistentFlags.unlockedDebug = true;
    },

    hideDebug() {
        SharkGame.persistentFlags.debug = false;
        SharkGame.Tabs.cheats.discovered = false;
        SharkGame.Tabs.cheats.seen = false;
        if (!SharkGame.gameOver) {
            if (SharkGame.Tabs.current === "cheats") {
                SharkGame.Tabs.current = "home";
            }
            SharkGame.TabHandler.setUpTab();
        }
    },

    toggleDebugButton() {
        if (SharkGame.HomeActions.getActionTable().debugbutton.unauthorized) {
            SharkGame.HomeActions.getActionTable().debugbutton.unauthorized = false;
        } else {
            SharkGame.HomeActions.getActionTable().debugbutton.unauthorized = true;
            SharkGame.HomeActions.getActionTable().debugbutton.discovered = false;
        }
    },

    togglePausePlease() {
        if (cad.stop) {
            log.addError("O jogo parou. Você não consegue pausá-lo.");
            return;
        }
        if (!cad.pause) {
            cad.pause = true;
            $("#stop").addClass("disabled");
        } else {
            cad.pause = false;
            $("#stop").removeClass("disabled");
        }
        this.update();
    },
    toggleStopPlease() {
        if (cad.pause) {
            log.addError("O jogo está pausado. Você não consegue pará-lo.");
            return;
        }
        if (!cad.stop) {
            cad.stop = true;
            $("#pause").addClass("disabled");
        } else {
            cad.stop = false;
            $("#pause").removeClass("disabled");
        }
        this.update();
    },
    toggleFreezePlease() {
        if (cad.frozen) {
            cad.frozen = false;
            res.setResource("ice", 0);
            return "Movimento volta ao oceano.";
        }
        cad.frozen = true;
        world.forceExistence("ice");
        SharkGame.PlayerResources.get("ice").discovered = true;
        res.setResource("ice", 1000);
        res.setTotalResource("ice", 1000);
        res.clearNetworks();
        res.buildIncomeNetwork();
        res.reconstructResourcesTable();
        return "Zero absoluto atingido!";
    },
    freeEssencePlease(howMuch = 15) {
        res.changeResource("essence", howMuch);
        return "Certo, mas só porque você foi tão bonzinho.";
    },
    goFasterPlease() {
        if (cad.speed === 512) {
            return "Acho que já está rápido o suficiente.";
        }
        let msg = "";
        cad.speed *= 2;
        switch (cad.speed) {
            case 2:
                msg = "Acelerando o tempo para o dobro.";
                break;
            case 512:
                msg = "Acelerando o tempo para...muito rápido.";
                break;
            default:
                msg = "Acelerando o tempo para " + cad.speed + "x.";
                break;
        }
        return msg;
    },
    reallyFastPlease() {
        cad.speed = 512;
        return "Tudo está 512x a velocidade normal.";
    },
    goSlowerPlease() {
        if (cad.speed === 1 / 512) {
            return "O mundo já me parece meio lento, não acha?";
        }
        let msg = "";
        cad.speed *= 0.5;
        switch (cad.speed) {
            case 1 / 2:
                msg = "Desacelerando o tempo pela metade.";
                break;
            case 1 / 512:
                msg = "Desacelerando o tempo para...muito lento.";
                break;
            default:
                msg = "Desacelerando o tempo para " + cad.speed + "x.";
                break;
        }
        return msg;
    },
    reallySlowPlease() {
        cad.speed = 1 / 512;
        return "Set game speed to 1/512th speed.";
    },
    resetSpeedPlease() {
        cad.speed = 1;
        return "Reset game speed to 1x.";
    },
    giveMeMoreOfEverythingPlease(multiplier) {
        SharkGame.ResourceMap.forEach((_value, key) => {
            SharkGame.PlayerResources.get(key).amount *= multiplier;
        });
        return "Gave you ten times more of everything.";
    },
    setAllResources(howMuch = 1) {
        SharkGame.ResourceMap.forEach((_value, key) => {
            res.setResource(key, 0);
            res.changeResource(key, howMuch);
        });
    },
    doSomethingCoolPlease() {
        return "Uma coisa muito legal foi feita.";
        // this doesn't do anything
    },
    beatWorldPlease() {
        SharkGame.wonGame = true;
        main.endGame();
        return "You got it, boss.";
    },
    toggleBeautify() {
        cad.noNumberBeautifying = !cad.noNumberBeautifying;
    },
    rollTheDicePlease(number = Math.floor(Math.random() * 20 + 1)) {
        switch (number) {
            case 1:
                world.forceExistence("tar");
                if (!SharkGame.ResourceMap.get("world").income) {
                    SharkGame.ResourceMap.get("world").income = {};
                }
                if (!SharkGame.ResourceMap.get("world").baseIncome) {
                    SharkGame.ResourceMap.get("world").baseIncome = {};
                }
                SharkGame.ResourceMap.get("world").income.tar = 1;
                SharkGame.ResourceMap.get("world").baseIncome.tar = 1;
                res.reconstructResourcesTable();
                return "Rolou um 1... Oh não.";
            case 2:
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "fish", "exponentiate", "shark", 0.999);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "sand", "exponentiate", "ray", 0.999);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "crystal", "exponentiate", "crab", 0.999);
                res.clearNetworks();
                res.buildIncomeNetwork();
                return "Rolou um 2. Peixes fazem tubarões lentos. Areia faz arraias lentas. Cristais fazem siris lento. Foi mal.";
            case 3:
                if (world.doesResourceExist("fish")) {
                    if (!SharkGame.ResourceMap.get("fish").income) {
                        SharkGame.ResourceMap.get("fish").income = {};
                    }
                    if (!SharkGame.ResourceMap.get("fish").baseIncome) {
                        SharkGame.ResourceMap.get("fish").baseIncome = {};
                    }
                    SharkGame.ResourceMap.get("fish").income.shark = -0.001;
                    SharkGame.ResourceMap.get("fish").income.ray = -0.001;
                    SharkGame.ResourceMap.get("fish").income.crab = -0.001;
                    SharkGame.ResourceMap.get("fish").income.whale = -0.001;
                    SharkGame.ResourceMap.get("fish").income.squid = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.shark = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.ray = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.crab = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.whale = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.squid = -0.001;
                    SharkGame.ResourceMap.get("fish").forceIncome = true;
                    return "Rolou um 3. O peixes estão se revoltando!";
                }
                return "Rolou um 3, mas peixes não existem, então nada aconteceu.";
            case 4:
                if (SharkGame.ResourceMap.get("shark").baseIncome.fish) {
                    SharkGame.ResourceMap.get("shark").baseIncome.fish = -1;
                    res.reapplyModifiers("shark", "fish");
                    return "Rolou um 4. Os tubarões estão comendo todos os peixes!";
                } else {
                    SharkGame.ResourceMap.get("shark").baseIncome.shark = -1;
                    res.reapplyModifiers("shark", "shark");
                    return "Rolou um 4. Os tubarões estariam comendo peixes, mas eles não caçam peixes. ELES ESTÃO PRATICANDO CANIBALISMO! AAAAAAAAAAAAAAAA";
                }
            case 5:
                res.applyModifier("resourceBoost", "fish", 0.125);
                return "Rolou um 5. Eu acabei de fazer todos os peixes em perigo de extinção. Agora o cardume produz 87.5% menos peixes.";
            case 6:
                SharkGame.ResourceMap.forEach((_value, key) => {
                    if (key !== "essence") {
                        res.setResource(key, 0);
                        res.changeResource(key, 1);
                    }
                });
                return "Rolou um 6...Você agora tem 1 unidade de tudo. Apena uma.";
            case 7:
                res.changeResource("shark", res.getResource("shark") * 255);
                return "Rolou um 7. Seus tubarões foram duplicados. Algumas vezes seguidas.";
            case 8:
                res.addNetworkNode(SharkGame.ResourceIncomeAffectors, "sand", "multiply", "sand", 0.001);
                res.clearNetworks();
                res.buildIncomeNetwork();
                return "Rolou um 8. Areia acelera a sua própria produção.";
            case 9:
                res.changeResource("fish", 10000000000 * Math.random() ** 3);
                return "Rolou um 9. Você pode comer peixes agora! Eba!";
            case 10:
                if (!SharkGame.ResourceMap.get("shark").income) {
                    SharkGame.ResourceMap.get("shark").income = {};
                }
                if (!SharkGame.ResourceMap.get("shark").baseIncome) {
                    SharkGame.ResourceMap.get("shark").baseIncome = {};
                }
                SharkGame.ResourceMap.get("shark").income.fish = 0;
                SharkGame.ResourceMap.get("shark").baseIncome.fish = 0;
                SharkGame.ResourceMap.get("shark").income.shark = 0.1;
                SharkGame.ResourceMap.get("shark").baseIncome.shark = 0.1;
                SharkGame.ResourceMap.get("shark").income.ray = 0.05;
                SharkGame.ResourceMap.get("shark").baseIncome.ray = 0.05;
                SharkGame.ResourceMap.get("shark").income.crab = 0.01;
                SharkGame.ResourceMap.get("shark").baseIncome.crab = 0.01;
                res.reapplyModifiers("shark", "shark");
                res.reapplyModifiers("shark", "ray");
                res.reapplyModifiers("shark", "crab");
                return "Rolou um 10. Tubarões produzem mais tubarões. E arraias. E caranguejos. Mas não peixes. Não mais.";
            case 11:
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "nurse", "exponentiate", "nurse", 1.01);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "nurse", "exponentiate", "shark", 0.98);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "maker", "exponentiate", "maker", 1.01);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "maker", "exponentiate", "ray", 0.98);
                res.clearNetworks();
                res.buildIncomeNetwork();
                return "Rolou um 11. Enfermeiros aceleram uns ao outros, mas atrapalham tubarões. Mesma coisa com arraias criadoras.";
            case 12:
                if (!SharkGame.ResourceMap.get("world").income) {
                    SharkGame.ResourceMap.get("world").income = {};
                }
                if (!SharkGame.ResourceMap.get("world").baseIncome) {
                    SharkGame.ResourceMap.get("world").baseIncome = {};
                }
                SharkGame.ResourceMap.get("world").income.shark = 1;
                SharkGame.ResourceMap.get("world").baseIncome.shark = 1;
                return "Rolou um 12. O mundo te dá tubarões grátis. Perfeito!";
            case 13:
                if (world.doesResourceExist("fish")) {
                    res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "fish", "multiply", "shark", 0.0005);
                    res.clearNetworks();
                    res.buildIncomeNetwork();
                    return "Rolou um 13. Tubarões ficam mais rápidos com cada peixe. Trabalhadores sempre trabalham melhor depois do almoço.";
                }
                return "Rolou um 13, mas peixes não existem. Então nada aconteceu.";
            case 14:
                if (world.doesResourceExist("crab")) {
                    world.worldResources.get("crab").exists = false;
                    res.setResource("crab", 0);
                    res.setTotalResource("crab", 0);
                    world.worldResources.get("brood").exists = false;
                    res.setResource("brood", 0);
                    res.setTotalResource("brood", 0);
                    world.worldResources.get("planter").exists = false;
                    res.setResource("planter", 0);
                    res.setTotalResource("planter", 0);
                    world.worldResources.get("collector").exists = false;
                    res.setResource("collector", 0);
                    res.setTotalResource("collector", 0);
                    world.worldResources.get("extractionTeam").exists = false;
                    res.setResource("extractionTeam", 0);
                    res.setTotalResource("extractionTeam", 0);
                    res.reconstructResourcesTable();
                    if (world.worldType === "start") {
                        delete SharkGame.HomeActions.generated.default.getCrab;
                        delete SharkGame.HomeActions.generated.default.getBrood;
                        delete SharkGame.HomeActions.generated.default.getPlanter;
                        delete SharkGame.HomeActions.generated.default.getCollector;
                        delete SharkGame.HomeActions.generated.default.getExtractionTeam;
                    } else {
                        delete SharkGame.HomeActions.generated[world.worldType].getCrab;
                        delete SharkGame.HomeActions.generated[world.worldType].getBrood;
                        delete SharkGame.HomeActions.generated[world.worldType].getPlanter;
                        delete SharkGame.HomeActions.generated[world.worldType].getCollector;
                        delete SharkGame.HomeActions.generated[world.worldType].getExtractionTeam;
                    }
                    SharkGame.TabHandler.setUpTab();
                    return "Rolou um 14. O que foi isso? Caraguejos? Siris? Nunca ouvi falar. Eu não acho que eles existem.";
                }
                return "Rolou um 14, mas caranguejos não existem, então nada aconteceu.";
            case 15:
                SharkGame.ResourceMap.get("science").baseIncome = { scientist: 0.01 };
                SharkGame.ResourceMap.get("science").income = { scientist: 0.01 };
                return "Rolou um 15. Ciência produz cientistas. Que nem o poste que mija no cachorro.";
            case 16:
                SharkGame.ResourceMap.get("crystal").income = { sand: 1 };
                SharkGame.ResourceMap.get("crystal").baseIncome = { sand: 1 };
                SharkGame.ResourceMap.get("sand").income = { fish: 1 };
                SharkGame.ResourceMap.get("sand").baseIncome = { fish: 1 };
                if (!SharkGame.ResourceMap.get("fish").income) {
                    SharkGame.ResourceMap.get("fish").income = {};
                }
                return "Rolou um 16. Cristais produzem areia. E areia produzem peixe. Peixes... Acho que nada aconteceu com eles, aconteceu?";
            case 17:
                world.forceExistence("crab");
                world.forceExistence("brood");
                res.changeResource("crab", 10);
                SharkGame.ResourceMap.get("crab").baseIncome.brood = 0.01;
                res.reapplyModifiers("crab", "brood");
                return "Rolou um 17. Os caranguejos. Eles estão proliferando!";
            case 18:
                if (world.doesResourceExist("fish")) {
                    if (!SharkGame.ResourceMap.get("fish").income) {
                        SharkGame.ResourceMap.get("fish").income = {};
                    }
                    SharkGame.ResourceMap.get("fish").income.shark = 0.01;
                    SharkGame.ResourceMap.get("fish").income.ray = 0.002;
                    SharkGame.ResourceMap.get("fish").income.crab = 0.005;
                    SharkGame.ResourceMap.get("fish").income.squid = 0.005;
                    SharkGame.ResourceMap.get("fish").income.whale = 0.00001;
                    SharkGame.ResourceMap.get("fish").income.fish = -0.999;
                    if (!SharkGame.ResourceMap.get("fish").baseIncome) {
                        SharkGame.ResourceMap.get("fish").baseIncome = {};
                    }
                    SharkGame.ResourceMap.get("fish").baseIncome.shark = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.ray = 0.002;
                    SharkGame.ResourceMap.get("fish").baseIncome.crab = 0.005;
                    SharkGame.ResourceMap.get("fish").baseIncome.squid = 0.005;
                    SharkGame.ResourceMap.get("fish").baseIncome.whale = 0.00001;
                    SharkGame.ResourceMap.get("fish").baseIncome.fish = -0.999;
                    return "Rolou um 18. Peixes agora recrutam o seu cardume por você. De nada.";
                }
                return "Rolou um 18, mas peixes não existem, então nada aconteceu.";
            case 19:
                cad.upgradePriceModifier = 0;
                cad.actionPriceModifier = 4;
                return "Rolou um 19. Melhorias são grátis, AEEEE! Mas todo o resto é 4 vezes mais caro... Aeee?";
            case 20:
                res.specialMultiplier *= 20;
                return "Rolou um acerto crítico! Tudo multiplicado por 20.";
        }
    },
    // challengeMePlease() {
    //     switch (world.worldType) {
    //         case "abandoned":
    //             world.forceExistence("tar");
    //             if (!SharkGame.ResourceMap.get("fish").income) SharkGame.ResourceMap.get("fish").income = {};
    //             if (!SharkGame.ResourceMap.get("fish").baseIncome) SharkGame.ResourceMap.get("fish").baseIncome = {};
    //             SharkGame.ResourceMap.get("fish").income.tar = 0.00001;
    //             SharkGame.ResourceMap.get("fish").baseIncome.tar = 0.00001;
    //             res.reapplyModifiers("fish", "tar");
    //             return "Abandoned Challenge:<br>Dirty fish! Fish produce tar!";
    //         case "haven":
    //             SharkGame.ResourceMap.get("nurse").baseIncome.fish = -500000000;
    //             res.reapplyModifiers("nurse", "fish");
    //             SharkGame.ResourceMap.get("maker").baseIncome.fish = -50000000;
    //             res.reapplyModifiers("maker", "fish");
    //             SharkGame.ResourceMap.get("brood").baseIncome.fish = -500000000;
    //             res.reapplyModifiers("brood", "fish");
    //             SharkGame.ResourceMap.get("scientist").baseIncome.crystal = -10000;
    //             res.reapplyModifiers("scientist", "crystal");
    //             SharkGame.ResourceMap.get("treasurer").baseIncome.kelp = -5000;
    //             res.reapplyModifiers("treasurer", "kelp");
    //             SharkGame.ResourceMap.get("planter").baseIncome.sand = -100000;
    //             res.reapplyModifiers("planter", "sand");
    //             return "Haven Challenge:<br>Unionization! Specialists and breeders demand real paychecks!";
    //     }
    // },
    expensiveUpgradesPlease() {
        if (cad.upgradePriceModifier === 512) {
            return "Eu não vou deixar você piorar essa situação ainda mais.";
        }
        let msg = "";
        cad.upgradePriceModifier *= 2;
        switch (cad.upgradePriceModifier) {
            case 0:
                log.addError("Não dá para mudar o preço das melhorias porque elas estão grátis.");
                break;
            case 2:
                msg = "Melhorias custam o dobro do normal.";
                break;
            case 512:
                msg = "Melhorias custam os olhos da cara.";
                break;
            default:
                msg = "Melhorias custam " + cad.upgradePriceModifier + " vezes o normal.";
                break;
        }
        return msg;
    },
    cheaperUpgradesPlease() {
        if (cad.upgradePriceModifier === 1 / 512) {
            return "Ainda está difícil demais para você??";
        }
        let msg = "";
        cad.upgradePriceModifier *= 0.5;
        switch (cad.upgradePriceModifier) {
            case 0:
                log.addError("Não dá para mudar o preço das melhorias porque elas estão grátis.");
                break;
            case 1 / 2:
                msg = "Melhorias custam a metado do normal.";
                break;
            case 1 / 512:
                msg = "Melhorias a preço de banana.";
                break;
            default:
                msg = "Melhorias custam " + cad.upgradePriceModifier + " vezes o normal.";
                break;
        }
        return msg;
    },
    expensiveStuffPlease() {
        if (cad.actionPriceModifier === 512) {
            return "Na moral? Na moralzinha?";
        }
        let msg = "";
        cad.actionPriceModifier *= 2;
        switch (cad.actionPriceModifier) {
            case 0:
                log.addError("Não dá para mudar o preço de nada poque já está grátis.");
                break;
            case 2:
                msg = "Preço das coisas dobrado.";
                break;
            case 512:
                msg = "Tudo isso é folheado a ouro por acaso?";
                break;
            default:
                msg = "Preço das coisas está " + cad.actionPriceModifier + " vezes o normal.";
                break;
        }
        return msg;
    },
    cheaperStuffPlease() {
        if (cad.actionPriceModifier === 1 / 512) {
            return "E você quer mais barato??";
        }
        let msg = "";
        cad.actionPriceModifier *= 0.5;
        switch (cad.actionPriceModifier) {
            case 0:
                log.addError("Não dá para mudar o preço de nada poque já está grátis.");
                break;
            case 1 / 2:
                msg = "Preço das coisas está pela metade.";
                break;
            case 1 / 512:
                msg = "As coisas estão uma pechincha!";
                break;
            default:
                msg = "Preço das coisas está " + cad.actionPriceModifier + " vezes o normal.";
                break;
        }
        return msg;
    },
    toggleFreeStuff() {
        if (cad.actionPriceModifier === 0) {
            cad.actionPriceModifier = 1;
            return "Capitalismo implementado novamente.";
        } else {
            cad.actionPriceModifier = 0;
            return "Coisas estão grátis.";
        }
    },
    toggleFreeUpgrades() {
        if (cad.upgradePriceModifier === 0) {
            cad.upgradePriceModifier = 1;
            return "Melhorias não são mais grátis.";
        } else {
            cad.upgradePriceModifier = 0;
            return "Melhorias grátis.";
        }
    },
    addUpgradesPlease() {
        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        $.each(upgradeTable, (upgradeId) => {
            SharkGame.Lab.addUpgrade(upgradeId);
        });
        return "Adicionou todas as melhorias. Isso talvez fique estranho.";
    },
    addIdleTimePlease(time = Math.random() * 120000 + 30000) {
        SharkGame.flags.minuteHandTimer += time;
        res.minuteHand.addBonusTime(time);
        res.minuteHand.updateDisplay();
    },
    forceAllExist() {
        SharkGame.ResourceMap.forEach((resource, resourceId) => {
            if (resource.desc && resource.desc !== "") world.forceExistence(resourceId);
        });
        $("#content").empty();
        cad.switchTo();
        return "Então tá... Lá vamos nós.";
    },
    doEgg() {
        if (SharkGame.flags.egg) {
            SharkGame.flags.egg = false;
        } else {
            SharkGame.flags.egg = true;
        }
        res.reconstructResourcesTable();
        return "egg";
    },
};
