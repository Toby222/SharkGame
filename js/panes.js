SharkGame.Panes = {
    credits:
        "<p>Este jogo foi originalmente criado em 3 dias para o Seamergency 2014.<br/>" +
        "<span class='smallDesc'>(Tecnicamente foram em 4 dias, mas algumas vezes planos molham.)</span></p>" +
        "<p>Feito por <a href='http://cirri.al'>Cirr</a> que precisa atualizar o site.<br/>" +
        "Ele também tem um <a href='https://twitter.com/Cirrial'>Twitter</a> onde ele quase não posta.</p>" +
        "<p>Ajuda adicional com código e créditos foram vindo de Dylan e Sam Red.<br/>" +
        "<span class='smallDesc'>Dylan também está graciosamente mantendo o jogo original no ar.</span></p>" +
        "<br><p><a href='https://github.com/spencers145/SharkGame'>NEW FRONTIERS</a> created by base4/spencers145.<br/>" +
        "Arte e contribuições de íncones por Jay, <a href='https://www.imdb.com/name/nm12683932/'>Noah Deibler,</a> e <a href='https://twitter.com/vhs_static'>@vhs_static</a> e amigões.<br/>" +
        "Ajuda adicional de <a href='https://github.com/stampyzfanz'>Ixbixbam</a>.<br/>" +
        "<span class='smallDesc'>Jogos do Ixbix estão dinsponíveis </span><a href='https://stampyzfanz.github.io/'>neste cantinho da internet</a><span class='smallDesc'>.</span><br/>" +
        '<span>Com ajuda de <a href="https://github.com/Toby222">Toby</a></span><br/>',

    ending:
        "<p>Parabéns! Você conseguiu.<br/>Você salvou os tubarões!</p>" +
        "<p>O portal te leva desse oceano estranho...</p>" +
        "<p>De volta para os oceanos que você nasceu e cresceu!</p>" +
        "<h3>...Será mesmo?</h3>",
    cheats:
        "<p>Tu irrompe no entre-mundos.</p>" +
        "<p><strong>1000 de essência.</strong> Teu corpo brilha. O éter flui dentro de tu como sangue.</p>" +
        "<p>Essa longa jornada te fez forte, rápido, esperto; poderoso. Tua força cresce a cada mundo visitado.</p>" +
        "<p>Tua energia radiante reluz desde os abismos mais profundos até os sorrisos mais esnobes; dos frios mais congelantes até as cidades mais mortas. És algo além de um tubarão.</p>" +
        "<p>Ainda assim...não achaste teu lar.</p>" +
        "<p><italic>Você toma um momento para ponderar este enigma.</italic></p>" +
        "<p>Se tua casa realmente se foi, então por que continuas?</p>" +
        "<p>A jornada é o que importa? Ou talvez o poder? Na verdade, não sou eu que posso dizer, esta é a tua decisão. Ninguém pode tomá-la por você.</p>" +
        "<p>De qualquer forma, sua aventura acaba aqui...por enquanto. Podes sempre voltar novamente. Talvez haverá mais lugares a visitar, eventos a presenciar, coisas a descorbrir. Talvez o que procuras seja achado.</p>" +
        "<hr>" +
        "<p><strong>Trapaças desbloqueadas.</strong></p>" +
        "<p>Visite um mundo para fazer dele a cada da Mãe Joana.</p>" +
        "<p>Muito obrigado por jogar Novas Fronteiras! Esperamos ver você na próxima atualização.</p>",
    help:
        "<p>This game is a game about resources and discovery, and does not demand your full attention. " +
        "It will happily run in the background, and works even while closed.</p>" +
        "<p>To begin, you should catch fish. Once you have some fish, more actions will become available.</p>" +
        "<p>If you are ever stuck, double-check that you have already bought everything, then make sure there's not a resource you've been neglecting.</p>" +
        "<p>If you are still stuck, or if you think it's a bug, you can always ask for help on the <a href='https://discord.gg/nN7BQDJR2G' target='blank_'>discord server</a>.</p>",

    donate:
        "<h2>Você pode doar para os vários projetos e organizações abaixo para apoiar vida marinha:</h2>" +
        "<span class='smallDescAllowClicks'>(parece justo, já que o jogo original foi feito para um evento de caridade)</span>" +
        "<p>O<strong> Shark Trust</strong> é uma organização que existe para apoiar pesquisa em, educação sobre e proteção de tubarões. Você pode <a href='https://www.sharktrust.org/Listing/Category/donate' target='_blank'>doe para o Shark Trust aqui</a>.</p>" +
        "<p><span class='smallDescAllowClicks'>(Mas se você quiser, você também pode " +
        "<a href='https://www.paypal.com/cgi-bin/" +
        "webscr?cmd=_donations&business=G3WPPAYAWTJCJ&lc=GB&" +
        "item_name=Shark%20Game%20Developer%20Support&" +
        "item_number=Shark%20Game%20Support&no_note=1&" +
        "no_shipping=1&currency_code=USD&" +
        "bn=PP%2dDonationsBF%3adonate%2epng%3aNonHosted' " +
        "target='_blank'>apoiar o desenvolvedor do Jogo do Tubarão original,</a>" +
        " se você quiser, claro.)</span></p>" +
        "<p>Os desenvolvedores deste mod não estão aceitando doações por enquanto.</p>",

    notice:
        "<p>Welcome to the open <b>alpha</b> of v0.2 for New Frontiers.</p>" +
        "<p>v0.2 is a total rework.<br/>Right now only four worlds (besides the starter world) are playable.<br><b>Things will be missing.</b> New stuff will be added.</p>" +
        "<p>To give feedback or contribute, check out our <a href='https://discord.gg/eYqApFkFPY'>Discord</a>.</p>" +
        "<p>To play the stable (OUTDATED) version (with all planets), visit <a href='https://spencers145.github.io/SharkGame/'>this link</a>.</p>",

    safariNotice:
        "Parece que você está usando Safari.<br />Esse navegador ainda não foi muito testado devido à falta de equipamento do time.<br />" +
        "Se estiver disposto a nos ajudar a testar, por favor se junte a nós em <a href='https://discord.gg/s4tTj7y72z'>Discord</a>, ou mande uma mensagem a" +
        " <a target='_blank' href='https://www.reddit.com/user/toby_prime'>Toby</a> ou a" +
        " <a target='_blank' href='https://www.reddit.com/user/SpencerS145/'>Base</a> no Reddit.",
};

SharkGame.PaneHandler = {
    paneStack: [],
    currentPane: undefined,

    init() {
        SharkGame.PaneHandler.wipeStack();
        SharkGame.PaneHandler.buildPane();
    },

    buildPane() {
        const pane = $("<div>").attr("id", "pane");
        $("body").append(pane);

        // set up structure of pane
        const titleDiv = $("<div>").attr("id", "paneHeader");
        titleDiv.append($("<div>").attr("id", "paneHeaderTitleDiv"));
        titleDiv.append(
            $("<div>")
                .attr("id", "paneHeaderCloseButtonDiv")
                .append(
                    $("<button>")
                        .attr("id", "paneHeaderCloseButton")
                        .addClass("min close-button")
                        .html("✕")
                        .on("click", SharkGame.PaneHandler.nextPaneInStack),
                ),
        );
        pane.append(titleDiv);
        pane.append($("<div>").attr("id", "paneHeaderEnd").addClass("clear-fix"));
        pane.append($("<div>").attr("id", "paneContent"));

        pane.hide();
        SharkGame.paneGenerated = true;
        return pane;
    },

    addPaneToStack(title, contents, notCloseable, fadeInTime = 600, customOpacity) {
        const stackObject = [title, contents, notCloseable, fadeInTime, customOpacity];
        if (this.currentPane) {
            this.paneStack.push(_.cloneDeep(this.currentPane));
        }
        this.currentPane = stackObject;
        this.showPane(title, contents, notCloseable, fadeInTime, customOpacity, true);
    },

    swapCurrentPane(title, contents, notCloseable, fadeInTime = 600, customOpacity) {
        const stackObject = [title, contents, notCloseable, fadeInTime, customOpacity];
        this.currentPane = stackObject;
        this.showPane(title, contents, notCloseable, fadeInTime, customOpacity);
    },

    wipeStack() {
        SharkGame.PaneHandler.paneStack = [];
        SharkGame.PaneHandler.currentPane = undefined;
        SharkGame.PaneHandler.hidePane();
    },

    nextPaneInStack() {
        const panehandler = SharkGame.PaneHandler;
        panehandler.currentPane = panehandler.paneStack.pop();
        if (panehandler.currentPane) {
            panehandler.showPane(
                panehandler.currentPane[0],
                panehandler.currentPane[1],
                panehandler.currentPane[2],
                panehandler.currentPane[3],
                panehandler.currentPane[4],
            );
        } else {
            panehandler.hidePane();
        }
    },

    isStackClosable() {
        let canCloseAll;
        if (this.currentPane) {
            canCloseAll = !this.currentPane[2];
        } else {
            return true;
        }

        _.each(this.paneStack, (pane) => {
            canCloseAll = canCloseAll && !pane[2];
        });

        return canCloseAll;
    },

    tryClosePane() {
        if (this.isPaneUp() && this.isCurrentPaneCloseable()) {
            this.nextPaneInStack();
            return true;
        }
    },

    tryWipeStack() {
        while (this.currentPane) {
            if (!this.tryClosePane()) {
                return false;
            }
        }
        return true;
    },

    isPaneUp() {
        return !$("#pane").is(":hidden") && $("#pane").html();
    },

    isCurrentPaneCloseable() {
        if (this.currentPane) {
            return !this.currentPane[2];
        }
        return false;
    },

    isPaneAlreadyUp(title) {
        let alreadyUp;
        if (this.currentPane) {
            alreadyUp = this.currentPane[0] === title;
        } else {
            return false;
        }

        _.each(this.paneStack, (pane) => {
            alreadyUp = alreadyUp || pane[0] === title;
        });

        return alreadyUp;
    },

    showPane(title, contents, notCloseable, fadeInTime, customOpacity, preserveElements) {
        const pane = $("#pane");

        // begin fading in/displaying overlay if it isn't already visible
        const overlay = $("#overlay");
        const overlayOpacity = $("#overlay").hasClass("gateway") ? 1.0 : customOpacity || 0.5;

        SharkGame.OverlayHandler.revealOverlay(fadeInTime, overlayOpacity);

        // adjust header
        const titleDiv = $("#paneHeaderTitleDiv");
        const closeButtonDiv = $("#paneHeaderCloseButtonDiv");

        if (!title || title === "") {
            titleDiv.hide();
        } else {
            titleDiv.show();
            if (!notCloseable) {
                // put back to left
                titleDiv.css({ float: "left", "text-align": "left", clear: "none" });
                titleDiv.html("<h3>" + title + "</h3>");
            } else {
                // center
                titleDiv.css({ float: "none", "text-align": "center", clear: "both" });
                titleDiv.html("<h2>" + title + "</h2>");
            }
        }
        if (notCloseable) {
            closeButtonDiv.hide();
        } else {
            closeButtonDiv.show();
        }

        let paneContent;
        if (!preserveElements) {
            paneContent = $("#paneContent");
            paneContent.empty();
        } else {
            const originalContent = $("#paneContent");
            originalContent.detach();

            pane.append($("<div>").attr("id", "paneContent"));
            paneContent = $("#paneContent");
        }

        // adjust content
        paneContent.append(contents);
        if (SharkGame.Settings.current.showAnimations && customOpacity) {
            pane.show().css("opacity", 0).animate({ opacity: 1.0 }, fadeInTime);
        } else {
            pane.show();
        }

        if (!notCloseable) {
            document.getElementById("overlay").addEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
            overlay.addClass("pointy");
        } else {
            document.getElementById("overlay").removeEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
            overlay.removeClass("pointy");
        }
    },

    hidePane() {
        document.getElementById("overlay").removeEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
        $("#overlay").removeClass("pointy");
        SharkGame.OverlayHandler.hideOverlay();
        $("#pane").hide();
    },

    showOptions() {
        const optionsContent = SharkGame.PaneHandler.setUpOptions();
        SharkGame.PaneHandler.addPaneToStack("Options", optionsContent);
    },

    setUpOptions() {
        const optionsTable = $("<table>").attr("id", "optionTable");

        // add settings specified in settings.js
        const categories = {};
        $.each(SharkGame.Settings, (name, setting) => {
            if (typeof setting.category === "string") {
                if (!categories[setting.category]) {
                    categories[setting.category] = [];
                }
                categories[setting.category].push(name);
            }
        });

        $.each(categories, (category, settings) => {
            optionsTable.append(
                $("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString(category) + "</span></h3>"),
            );
            _.each(settings, (settingName) => {
                const setting = SharkGame.Settings[settingName];
                if (settingName === "current") {
                    return;
                }
                const optionRow = $("<tr>");

                // show setting name
                optionRow.append(
                    $("<td>")
                        .addClass("optionLabel")
                        .html(setting.name + ":" + "<br/><span class='smallDesc'>(" + setting.desc + ")</span>"),
                );

                const currentSetting = SharkGame.Settings.current[settingName];

                // show setting adjustment buttons
                $.each(setting.options, (index, optionValue) => {
                    const isSelectedOption = optionValue === currentSetting;
                    optionRow.append(
                        $("<td>").append(
                            $("<button>")
                                .attr("id", "optionButton-" + settingName + "-" + index)
                                .addClass("option-button" + (isSelectedOption ? " disabled" : ""))
                                .html(typeof optionValue === "boolean" ? (optionValue ? "on" : "off") : optionValue)
                                .on("click", SharkGame.PaneHandler.onOptionClick),
                        ),
                    );
                });

                optionsTable.append(optionRow);
            });
        });

        // SAVE IMPORT/EXPORT
        // add save import/export
        let row = $("<tr>");
        row.append(
            $("<td>").html(
                "Import/Export Save:<br/><span class='smallDesc'>(Transforme seu progresso em texto para mandar para outras pessoas ou para guarda você mesmo.)</span>",
            ),
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("import")
                    .addClass("option-button")
                    .on("click", function callback() {
                        if ($(this).hasClass("disabled")) return;
                        const importText = $("#importExportField").val();
                        if (importText === "") {
                            SharkGame.PaneHandler.nextPaneInStack();
                            log.addError("Você precisa botar algum texto antes!");
                        } else if (confirm("Você tem certeza? O seu progresso atual vai ser perdido.")) {
                            SharkGame.Save.importData(importText);
                        }
                    }),
            ),
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("export")
                    .addClass("option-button")
                    .on("click", function callback() {
                        if ($(this).hasClass("disabled")) return;
                        $("#importExportField").val(SharkGame.Save.exportData());
                    }),
            ),
        );
        // add the actual text box
        row.append($("<td>").attr("colSpan", 4).append($("<input>").attr("type", "text").attr("id", "importExportField")));
        optionsTable.append(row);

        // BACKUP MANAGEMENT
        row = $("<tr>");
        const row2 = $("<tr>");
        row.append($("<td>").html("Save Backups:<br/><span class='smallDesc'>(Criar uma cópia de segurança.)</span>"));
        row2.append($("<td>").html("Load Backups:<br/><span class='smallDesc'>(Carregar uma cópia de segurança.)</span>"));

        _.each(["1", "2", "3"], (tag) => {
            row.append(
                $("<td>").append(
                    $("<button>")
                        .html(`save ${tag}`)
                        .addClass("option-button")
                        .on("click", () => {
                            if (SharkGame.Save.savedGameExists(`Backup${tag}`)) {
                                if (!confirm("Já tem um jogo salvo neste local. Sobrescrevê-lo?")) {
                                    return;
                                }
                            }
                            SharkGame.Save.createTaggedSave(`Backup${tag}`);
                            $(`#load${tag}`).removeClass("disabled");
                        }),
                ),
            );

            const loadButton = $("<button>")
                .html(`load ${tag}`)
                .attr("id", `load${tag}`)
                .addClass("option-button")
                .on("click", () => {
                    if (!$(`#load${tag}`).hasClass("disabled") && SharkGame.Save.savedGameExists(`Backup${tag}`)) {
                        if (
                            confirm(
                                `Você tem certeza que quer carregar este jogo${SharkGame.Save.getTaggedSaveCharacteristics(`Backup${tag}`)}?`,
                            )
                        ) {
                            SharkGame.Save.loadTaggedSave(`Backup${tag}`);
                        }
                    }
                });

            if (!SharkGame.Save.savedGameExists(`Backup${tag}`)) {
                loadButton.addClass("disabled");
            }

            row2.append($("<td>").append(loadButton));
        });

        optionsTable.append(row);

        if (SharkGame.persistentFlags.unlockedDebug) {
            const loadButton = $("<button>")
                .html("cópia pré-trapaças")
                .attr("id", "loadCheats")
                .addClass("option-button")
                .on("click", () => {
                    if (!$("#loadCheats").hasClass("disabled") && SharkGame.Save.savedGameExists("BackupCheats")) {
                        if (
                            confirm(
                                `Você tem certeza que quer carregar este jogo${SharkGame.Save.getTaggedSaveCharacteristics("BackupCheats")}?`,
                            )
                        ) {
                            SharkGame.Save.loadTaggedSave("BackupCheats");
                        }
                    }
                });

            if (!SharkGame.Save.savedGameExists("BackupCheats")) {
                loadButton.addClass("disabled");
            }
            row2.append(loadButton);
        }

        optionsTable.append(row2);

        // SETTING WIPE
        row = $("<tr>");
        row.append($("<td>").html("Redefinir configurações:<br/><span class='smallDesc'>(Limpar todas as configurações.)</span>"));
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("limpar")
                    .addClass("option-button")
                    .on("click", () => {
                        if (confirm("Tem certeza que você quer redifinir suas configurações?")) {
                            $.each(SharkGame.Settings.current, (settingName) => {
                                if (SharkGame.Settings[settingName]) {
                                    SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].defaultSetting;
                                    if (typeof SharkGame.Settings[settingName].onChange === "function") {
                                        SharkGame.Settings[settingName].onChange();
                                    }
                                }
                            });
                            SharkGame.Keybinds.resetKeybindsToDefault();
                            SharkGame.PaneHandler.nextPaneInStack();
                            SharkGame.PaneHandler.showOptions();
                        }
                    }),
            ),
        );
        optionsTable.append(row);

        // SAVE WIPE
        // add save wipe
        row = $("<tr>");
        row.append(
            $("<td>").html("Apagar jogo:<br/><span class='smallDesc'>(Apaga o seu progresso e recomeça o jogo do zero. COMPLETAMENTE. PARA SEMPRE.)</span>"),
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("apagar")
                    .addClass("option-button")
                    .on("click", () => {
                        if (confirm("Tem certeza que você quer apagar o seu progresso?\nEle não vai ser recuperável!")) {
                            main.resetGame();
                        }
                    }),
            ),
        );
        optionsTable.append(row);

        if (SharkGame.persistentFlags.unlockedDebug) {
            row = $("<tr>");
            row.append($("<td>").html("Esconder trapaças:<br/><span class='smallDesc'>(Esconder a aba de trapaças.)</span>"));
            row.append(
                $("<td>").append(
                    $("<button>")
                        .html("mostrar")
                        .addClass("option-button")
                        .on("click", () => {
                            cad.debug();
                        }),
                ),
            );
            row.append(
                $("<td>").append(
                    $("<button>")
                        .html("ocultar")
                        .addClass("option-button")
                        .on("click", () => {
                            cad.hideDebug();
                        }),
                ),
            );
            optionsTable.prepend(row);

            optionsTable.prepend(
                $("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString("TRAPAÇAS e DEBUG") + "</span></h3>"),
            );
        }

        row = $("<tr>");
        row.append($("<td>").html("Keybinds:<br/><span class='smallDesc'>(Change keybinds.)</span>"));
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("change")
                    .addClass("option-button")
                    .on("click", () => {
                        SharkGame.PaneHandler.showKeybinds();
                    }),
            ),
        );
        optionsTable.prepend(row);

        optionsTable.prepend($("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString("ATALHOS") + "</span></h3>"));

        return optionsTable;
    },

    onOptionClick() {
        if ($(this).hasClass("disabled")) return;
        const buttonLabel = $(this).attr("id");
        const settingInfo = buttonLabel.split("-");
        const settingName = settingInfo[1];
        const optionIndex = parseInt(settingInfo[2]);

        // change setting to specified setting!
        SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].options[optionIndex];

        // update relevant table cell!
        // $('#option-' + settingName)
        //     .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

        // enable all buttons
        $('button[id^="optionButton-' + settingName + '"]').removeClass("disabled");

        // disable this button
        $(this).addClass("disabled");

        // if there is a callback, call it, else call the no op
        (SharkGame.Settings[settingName].onChange || $.noop)();
    },

    showKeybinds() {
        if (SharkGame.Keybinds.waitForKey) {
            SharkGame.Keybinds.waitForKey = false;
        }

        const keybindTable = $("<table>").attr("id", "keybindTable");

        let row = $("<tr>");
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("new bind")
                    .attr("id", "new-bind-button")
                    .on("click", function () {
                        $(this).html("press some keys...");
                        SharkGame.Keybinds.waitForKey = true;
                    }),
            ),
        );
        keybindTable.append(row);

        $.each(SharkGame.Keybinds.keybinds, (boundKey, boundAction) => {
            row = $("<tr>").attr("id", SharkGame.Keybinds.compressKeyID(boundKey));
            row.append($("<td>").html(boundKey));

            if (SharkGame.Keybinds.actions.includes(boundAction)) {
                const selector = $("<select>").on("change", function () {
                    SharkGame.Keybinds.addKeybind(boundKey, $(this)[0].value);
                    console.debug(`bound ${boundKey} to ${$(this)[0].value}`);
                });
                _.each(SharkGame.Keybinds.actions, (potentialBoundAction, i) => {
                    selector.append(
                        `<option${i % 2 === 0 ? ' class="evenMessage"' : ""} ${boundAction === potentialBoundAction ? " selected" : ""}>` +
                            potentialBoundAction +
                            "</option>",
                    );
                });
                row.append(selector);
            } else {
                row.append($("<td>").html(SharkGame.Keybinds.cleanActionID(boundAction)));
            }

            row.append(
                $("<td>").append(
                    $("<button>")
                        .addClass("min close-button")
                        .html("✕")
                        .on("click", () => {
                            $(`#${SharkGame.Keybinds.compressKeyID(boundKey)}`).remove();
                            delete SharkGame.Keybinds.keybinds[boundKey];
                        }),
                ),
            );
            keybindTable.append(row);
        });

        SharkGame.PaneHandler.addPaneToStack("Keybinds", keybindTable);
    },

    showChangelog() {
        const changelogContent = $("<div>").attr("id", "changelogDiv");
        $.each(SharkGame.Changelog, (version, changes) => {
            const segment = $("<div>").addClass("paneContentDiv");
            segment.append($("<h3>").html(version + ": "));
            const changeList = $("<ul>");
            _.each(changes, (changeLogEntry) => {
                changeList.append($("<li>").html(changeLogEntry));
            });
            segment.append(changeList);
            changelogContent.append(segment);
        });
        SharkGame.PaneHandler.addPaneToStack("Changelog", changelogContent);
    },

    showHelp() {
        const helpDiv = $("<div>");
        helpDiv.append($("<div>").append(SharkGame.Panes.help).addClass("paneContentDiv"));
        SharkGame.PaneHandler.addPaneToStack("Help", helpDiv);
    },

    showAspectWarning() {
        const aspectWarnDiv = $("<div>");
        aspectWarnDiv.append(
            $("<div>")
                .attr("id", "aspectInnerWarning")
                .append(
                    "Opa!<br>O seu jogo contém aspectos que não existem mais no jogo!<br>Mil perdões, mas só tem um jeito de consertar isso:<br>seus <strong>aspectos</strong> foram <strong>reembolsados</strong><br>para que você os <strong>substitua</strong> com <strong>novos aspectos</strong>.<br><br>Lembre-se que você sempre pode apertar no botão <strong>'pular'</strong><br>no canto superior esquerdo para voltar ao entremundos.<br>",
                )
                .addClass("paneContentDiv"),
        );
        SharkGame.Button.makeButton(
            "confirmUnderstood",
            "Eu entendo que os meus <br><strong>ASPECTOS</strong> FORAM <strong>REEMBOLSADOS</strong>",
            aspectWarnDiv,
            () => {
                SharkGame.PaneHandler.nextPaneInStack();
                SharkGame.missingAspects = false;
            },
        );
        this.addPaneToStack("ISSO NÃO É NADA BOM...", aspectWarnDiv, true);
    },

    showUnlockedCheatsMessage() {
        this.addPaneToStack("...", SharkGame.Panes.cheats);
    },
};
