/// <reference path="./decimal.global.d.ts"/>
export namespace SharkGame {}

declare global {
    const DecimalHalfRound: { [K in keyof Decimal.Constructor]: Decimal.Constructor[K] } & { new (n: Decimal.Value): DecimalHalfRound };
    type DecimalHalfRound = { [K in keyof Decimal.Instance]: Decimal.Instance[K] };
}

declare global {
    const res: typeof SharkGame.Resources;
    const main: typeof SharkGame.Main;
    const rec: typeof SharkGame.Recycler;
    const gateway: typeof SharkGame.Gateway;
    const stats: typeof SharkGame.Stats;
    const world: typeof SharkGame.World;
    const home: typeof SharkGame.Home;
    const tree: typeof SharkGame.AspectTree;
    const log: typeof SharkGame.Log;
    const mem: typeof SharkGame.Memories;

    const sharktext: typeof SharkGame.TextUtil;
    const sharkcolor: typeof SharkGame.ColorUtil;
    const sharkmath: typeof SharkGame.MathUtil;
    const sharkmisc: typeof SharkGame.MiscUtil;

    const cad: typeof SharkGame.CheatsAndDebug;
}

declare global {
    const SharkGame: SharkGame;

    //// REGION: Data structure types
    type AspectName = string;
    type HomeActionCategory = "all" | "basic" | "frenzy" | "professions" | "breeders" | "processing" | "machines" | "otherMachines" | "unique";
    type HomeActionName = string;
    type ModifierName = string;
    type OptionCategory = "PERFORMANCE" | "LAYOUT" | "APPEARANCE" | "ACCESSIBILITY" | "OTHER" | "SAVES";
    type OptionName = string;
    type ResourceCategory =
        | "animals"
        | "breeders"
        | "frenzy"
        | "harmful"
        | "hidden"
        | "machines"
        | "magical"
        | "processed"
        | "scientific"
        | "special"
        | "specialists"
        | "stuff";
    type ResourceName = string;
    type SaveString = `<~${string}~>` | `x${string}` | `{${string}}`;
    type SpriteName = string;
    type TabName = string;
    type UpgradeName = string;
    type WorldName = string;

    type ProgressionType = "2-scale";
    type CostFunction = "linear" | "constant";

    type CheatButtonType = undefined | "numeric" | "up-down";
    type CheatButton = {
        readonly name: string;
        type: CheatButtonType;
        updates: boolean;
        click(): void;
        clickUp(): void;
        clickDown(): void;
    };

    type EventName = "beforeTick" | "afterTick";
    type EventAction = "trigger" | "remove" | "pass";
    type SharkEventHandler = {
        handlingTime: EventName;
        priority: number;
        getAction(): EventAction;
        trigger(): boolean;
    };

    type FunFact = string;

    type GateRequirements = Partial<{
        upgrades: Record<UpgradeName, string>;
        slots: Record<ResourceName, number>;
        resources: Record<ResourceName, number>;
    }>;

    type HomeAction = {
        name: string;
        effect: Partial<{
            resource: Record<ResourceName, number>;
            events: EventName[];
        }>;
        cost: {
            resource: ResourceName;
            costFunction: CostFunction;
            priceIncrease: number;
        }[];
        max?: ResourceName;
        prereq: Partial<{
            resource: Record<ResourceName, number>;
            upgrade: UpgradeName[];
            notWorlds: WorldName[];
        }>;
        outcomes: string[];
        multiOutcomes: string[];
        helpText: string;
        unauthorized?: boolean;
        removedBy?: Partial<{
            totalResourceThreshold: Record<ResourceName, number>;
            otherActions: HomeActionName[];
            upgrades: UpgradeName[];
            custom(): boolean;
        }>;
        getSpecialTooltip?(): string;
    };
    type HomeActionTable = Record<HomeActionName, HomeAction>;

    type Upgrade = {
        name: string;
        desc: string;
        researchedMessage: string;
        effectDesc: string;
        cost: Record<ResourceName, number>;
        effect?: Partial<{
            incomeMultiplier: Record<ResourceName, number>;
            sandMultiplier: Record<ResourceName, number>;
            kelpMultiplier: Record<ResourceName, number>;
            addJellyIncome: Record<ResourceName, number>;
            resourceBoost: Record<ResourceName, number>;
            incomeBoost: Record<ResourceName, number>;
        }>;
        required?: Partial<{
            upgrades: UpgradeName[];
            seen: ResourceName[];
            resources: ResourceName[];
            totals?: Record<ResourceName, number>;
        }>;
        events?: EventName[];
        customEffect?(background: string): string;
    };
    type UpgradeTable = Record<UpgradeName, Upgrade>;

    type Modifier =
        | {
              defaultValue: string[];
              name?: string;
              apply(current: string[], degree: number | string, generator: string): string[];
              effectDescription?(degree: number | string, generator: string): string;
              getEffect?(genDegree: number, outDegree: number, gen: string, out: string): number;
              applyToInput(input: number, genDegree: string[], outDegree: string[], gen: string, out: string): number;
          }
        | {
              defaultValue: number;
              name?: string;
              apply(current: number, degree: number | string, generator: string): number;
              effectDescription?(degree: number | string, generator: string): string;
              getEffect?(genDegree: number, outDegree: number, gen: string, out: string): number;
              applyToInput(input: number, genDegree: number, outDegree: number, gen: string, out: string): number;
          };

    type Pane = [title: string, contents: JQuery<HTMLElement>, notCloseable: boolean | undefined, fadeInTime: number, customOpacity: number];

    type WorldModifier = {
        type: string;
        modifier: ModifierName;
        resource: ResourceName;
        amount: number | ResourceName;
    };

    type World = {
        name: WorldName;
        desc: string;
        shortDesc: string;
        entry: string;
        style: string;
        includedResources?: (ResourceName | ResourceCategory)[];
        absentResources: (ResourceName | ResourceCategory)[];
        modifiers: WorldModifier[]; // TODO: Modifier type
        gateRequirements: GateRequirements;
        foresight?: {
            longDesc: string;
            missing: ResourceName[];
            present: ResourceName[];
            tip?: string;
        };
    };
    //// END REGION: Data structure types

    //// REGION: Data structure types
    type Aspect = {
        requiredBy: AspectName[] | undefined;
        /** Whether to use the event spritesheet */
        eventSprite: boolean;
        icon: string;
        posX: number;
        posY: number;
        width: number;
        height: number;
        level: number;
        prerequisites: AspectName[];
        getCost(level: number): number;
        getEffect(level: number): string;
        /**
         * Tells you if miscellaneous requirements have been met.
         * If they have, returns nothing.
         * If they have not, returns a message stating why not.
         */
        getUnlocked(): string;
        clicked(event: JQuery.MouseDownEvent): void;
        apply(time: string): void;
    };

    type StaticButton = {
        posX: number;
        posY: number;
        width: number;
        height: number;
        name: string;
        description: string;
        getEffect(): string;
        clicked(event: MouseEvent): void;
    };
    //// END REGION: Data structure types

    //// REGION: Modules
    type AspectTreeModule = {
        dragStart: { posX: number; posY: number };
        cameraZoom: number;
        cameraOffset: { posX: number; posY: number };
        context?: CanvasRenderingContext2D;
        staticButtons: Record<string, StaticButton>;
        setUp(): void;
        init(): void;
        drawTree(disableCanvas: boolean): HTMLTableElement | HTMLDivElement;
        drawTable(table?: HTMLTableElement): HTMLTableElement;
        drawCanvas(): HTMLCanvasElement;
        getCursorPositionInCanvas(canvas: HTMLCanvasElement, event: MouseEvent): { posX: number; posY: number };
        getButtonUnderMouse(mouseEvent: MouseEvent): StaticButton | Aspect;
        updateMouse(event: MouseEvent): void;
        click(event: MouseEvent): void;
        startPan(event: MouseEvent): void;
        pan(event: MouseEvent): void;
        endPan(): void;
        render(): void;
        /**
         * Helper function that draws a rounded rectangle with an icon using the current state of the canvas
         * @param context
         * @param posX The top left x coordinate
         * @param posY The top left y coordinate
         * @param width The width of the rectangle
         * @param height The height of the rectangle
         * @param icon The icon to draw in the rectangle
         * @param name The name of the button
         */
        renderButton(context: CanvasRenderingContext2D, posX: number, posY: number, width: number, height: number, icon: string, name: string): void;
        getLittleLevelText(aspectName: AspectName): string | undefined;
        increaseLevel(aspect: AspectName): void;
        updateEssenceCounter(): void;
        applyAspects(): void;
    };

    type ButtonModule = {
        makeHoverscriptButton(
            id: string,
            content: string,
            parentDiv: HTMLDivElement | JQuery<HTMLDivElement>,
            onClick: (event: JQuery.MouseDownEvent) => void,
            onMouseEnter: (event: JQuery.MouseEnterEvent) => void,
            onMouseLeave: (event: JQuery.MouseLeaveEvent) => void,
        ): JQuery<HTMLButtonElement>;
        makeButton(
            id: string,
            content: string,
            parentDiv: HTMLDivElement | JQuery<HTMLDivElement>,
            onClick: (event: JQuery.MouseDownEvent) => void,
        ): JQuery<HTMLButtonElement>;
    };

    type ColorUtilModule = {
        colorLum(hex: string, lum: number): string;
        getRelativeLuminance(color: string): number;
        correctLuminance(color: string, luminance: number): string;
        convertColorString(color: string): string;
        getBrightColor(color: string): string;
        getElementColor(id: string, propertyName: string): ReturnType<ColorUtilModule["convertColorString"]>;
    };

    type EventHandlerModule = {
        eventQueue: SharkEventHandler[][];
        init(): void;
        handleEventTick(handlingTime: EventName | "load"): void;
    };

    type FactsModule = {
        dilutedResources: ResourceName[];
        showFact(): void;
        getFact(): FunFact;
        getPool(): FunFact[];
        worldBased: Record<WorldName, FunFact[]>;
        resourceBased: Record<ResourceName, FunFact[]>;
        default: FunFact[];
    };

    type GatewayModule = {
        PresenceFeelings: Record<ResourceName, string>;
        Messages: {
            essenceBased: { min: number; max: number; messages: string[] }[];
            lastPlanetBased: Record<WorldName, string[]>;
            loss: string[];
            generic: string[];
        };
        NUM_PLANETS_TO_SHOW: number;
        transitioning: boolean;
        selectedWorld: WorldName;
        allowedWorlds: WorldName[];
        completedWorlds: WorldName[];
        planetPool: WorldName[];
        ui: {
            showGateway(
                essenceRewarded: number,
                patienceReward: number,
                speedReward: number,
                gumptionRatio: number,
                forceWorldBased: boolean,
                storedTime: number,
            ): void;
            showRunEndInfo(containerDiv: JQuery<HTMLDivElement>): void;
            showAspects(): void;
            prepareBasePane(baseReward: number, patienceReward: number, speedReward: number, gumptionBonus: number, storedTime: number): void;
            showPlanets(foregoAnimation?: boolean): void;
            formatDestinyGamble(): void;
            confirmWorld(): void;
            switchViews(callback: () => void): void;
            showPlanetAttributes(worldData: World, contentDiv: JQuery<HTMLDivElement>): void;
            showWorldVisitMenu(): void;
            updatePlanetButtons(): void;
            showMinuteHandStorageExtraction(worldtype: WorldName): void;
        };
        init(): void;
        enterGate(loadingFromSave?: boolean): void;
        cleanUp(): void;
        rerollWorlds(): void;
        preparePlanetSelection(numPlanets: number): void;
        getVoiceMessage(): string;
        playerHasSeenResource(resource: ResourceName): boolean;
        markWorldCompleted(worldType: WorldName): void;
    };

    type HomeActionsModule = {
        /** Generated cache on-demand */
        generated: Record<WorldName, HomeActionTable>;
        default: HomeActionTable;
        getActionTable(worldType?: WorldName): Record<HomeActionName, HomeAction>;
        /**
         * Retrieves, modifies, and returns the data for an action. Implemented to intercept retreival of action data to handle special logic where alternatives are inconvenient or impossible.
         * @param table The table to retrieve the action data from
         * @param actionName The name of the action
         */
        getActionData(table: HomeActionTable, actionName: HomeActionName): HomeAction;
        generateActionTable(worldType?: WorldName): Record<HomeActionName, HomeAction>;
    };

    type HomeEventsModule = {
        messages: Record<
            WorldName,
            {
                name: string;
                message: string;
                scales?: boolean;
                unlock?: Partial<{
                    resource: Record<ResourceName, number>;
                    totalResource: Record<ResourceName, number>;
                    homeAction: HomeActionName[];
                    upgrade: UpgradeName[];
                    custom(): boolean;
                }>;
            }[]
        >;
    };

    type UpgradesModule = {
        purchased: UpgradeName;
        /** Generated cache on-demand */
        generated: Record<WorldName, UpgradeTable>;
        getUpgradeTable(worldType?: WorldName): UpgradeTable;
        /**
         * Retrieves, modifies, and returns the data for an upgrade. Implemented to intercept retreival of upgrade data to handle special logic where alternatives are inconvenient or impossible.
         * @param table The table to retrieve the upgrade data from
         * @param upgradeName The name of the upgrade
         */
        getUpgradeData(table: UpgradeTable, upgradeName: UpgradeName): Upgrade;
        generateUpgradeTable(worldType: WorldName): UpgradeTable;
    };

    type LogModule = {
        initialised: boolean;
        initialized: boolean;
        messages: JQuery<HTMLLIElement>;
        totalCount: number;
        init(): void;
        moveLog(): void;
        addMessage(message: string | JQuery.Node): JQuery<HTMLLIElement>;
        addError(message: string | JQuery.Node, sanitizeHtml?: boolean): ReturnType<LogModule["addMessage"]>;
        addDiscovery(message: string | JQuery.Node): ReturnType<LogModule["addMessage"]>;
        correctLogLength(): void;
        clearMessages(logThing?: boolean): void;
        toggleExtendedLog(): void;
        haveAnyMessages(): boolean;
    };

    type MainModule = {
        tickHandler: number;
        autosaveHandler: number;
        applyFramerate(): void;
        init(foregoLoad?: boolean): void;
        tick(): void;
        processSimTime(numberOfSeconds: number, load?: boolean): void;
        autosave(): void;
        checkForUpdate(): void;
        createBuyButtons(customLabel: string | undefined, addToWhere: JQuery, appendOrPrepend: "append" | "prepend", absoluteOnly?: boolean): void;
        onCustomChange(): void;
        showSidebarIfNeeded(): void;
        applyProgressionSpeed(): void;
        getProgressionConstant(alternative?: ProgressionType): 1.5 | 1 | 2 | 4;
        endGame(loadingFromSave?: boolean): void;
        purgeGame(): void;
        loopGame(): void;
        isFirstTime(): boolean;
        resetTimers(): void;
    };

    type MathUtilModule = {
        /**
         * @param current current amount
         * @param desired desired amount
         * @param cost constant price
         * @returns cost to get to b from a
         */
        constantCost(current: Decimal | number, difference: Decimal | number, cost: Decimal | number): Decimal | number;
        /**
         * @param current current amount
         * @param available available price amount
         * @param cost constant price
         * @returns absolute max items that can be held with invested and current resources
         */
        constantMax(current: Decimal | number, available: Decimal | number, cost: Decimal | number): Decimal | number;
        /**
         * @param current current amount
         * @param desired desired amount
         * @param cost cost increase per item
         * @returns: cost to get to b from a
         */
        linearCost(current: Decimal | number, difference: Decimal | number, constant: Decimal | number): Decimal | number;
        /**
         * @param current current amount
         * @param available available price amount
         * @param cost cost increase per item
         * @returns absolute max items that can be held with invested and current resources
         */
        linearMax(current: Decimal | number, available: Decimal | number, cost: Decimal | number): Decimal | number;
        /** artificial limit - whatever has these functions for cost/max can only have one of */
        uniqueCost(current: Decimal | number, difference: Decimal | number, cost: Decimal | number): Decimal | number;
        /** this takes an argument to know whether or not to return a Decimal or a Number */
        uniqueMax(current: Decimal | number): Decimal | number;
        getBuyAmount(nomaxBuy: boolean): Decimal | number;
        /** This is weird */
        getPurchaseAmount(resource: ResourceName, owned?: number): Decimal | number;
    };

    type MiscUtilModule = {
        tryAddProperty(object: any, property: keyof any, value: any): any;
        /**
         * There may or may not be some problem with the "this" value.
         * I don't understand it intuitively enough to really check for it.
         */
        cloneDeep<T>(obj: T): T;
    };

    type MemoryModule = {
        worldMemories: Record<WorldName, string[]>;
        persistentMemories: Record<WorldName, string[]>;
        init(): void;
        setup(): void;
        addMemory(worldType: WorldName, messageName: string): void;
        elevateMemories(): void;
    };

    type PaneHandlerModule = {
        paneStack: Pane[];
        currentPane?: Pane;
        buildPane(): JQuery<HTMLDivElement>;
        addPaneToStack(title: string, contents: JQuery<HTMLElement>, notCloseable: boolean, fadeInTime: number, customOpacity: number): void;
        swapCurrentPane(title: string, contents: JQuery<HTMLElement>, notCloseable: boolean, fadeInTime: number, customOpacity: number): void;
        wipeStack(): void;
        showPane(title: string, contents: JQuery<HTMLElement>, notCloseable: boolean, fadeInTime: number, customOpacity: number): void;
        hidePane(): void;
        showOptions(): void;
        setUpOptions(): JQuery<HTMLTableElement>;
        onOptionClick(): void;
        showChangelog(): void;
        showHelp(): void;
        showSpeedSelection(): void;
        showAspectWarning(): void;
    };

    type InternalOption<T> = {
        defaultSetting: T;
        options: T[];
    };
    type Option<T> = InternalOption<T> & {
        category: OptionCategory;
        desc: string;
        name: string;
        onChange?(): void;
    };

    type SettingsModule = Record<OptionName, Option<unknown>> & {
        current: Record<OptionName, unknown>;
    } & {
        buyAmount: InternalOption<number | "custom">;
        grottoMode: InternalOption<"simple" | "advanced">;
        showPercentages: InternalOption<"absolute" | "percentage">;
    };

    type SpritesModule = Record<
        SpriteName,
        {
            frame: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
            rotated: boolean;
            trimmed: boolean;
            spriteSourceSize: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
            sourceSize: {
                w: number;
                h: number;
            };
        }
    >;

    type Save = Record<string, unknown>;
    type MigrationFunction = (save: Save) => Save;
    type SaveModule = {
        saveFileName: "sharkGameSave";
        saveGame(): SaveString;
        loadGame(importSaveData?: SaveString): void;
        importData(data: SaveString): void;
        exportData(): SaveString;
        savedGameExists(): boolean;
        deleteSave(): void;
        wipeSave(): void;
        saveUpdaters: MigrationFunction[];
    };

    type TabHandlerModule = {
        checkTabUnlocks(): void;
        setUpTab(): void;
        createTabMenu(): void;
        registerTab(tab: SharkGameTabBase): void;
        createTabNavigation(): void;
        changeTab(tab: TabName): void;
        discoverTab(tab: TabName): void;
    };

    type TabsModule = {
        current: TabName;
    } & Record<
        TabName,
        {
            id: SharkGameTabBase["tabId"];
            name: SharkGameTabBase["tabName"];
            discovered: SharkGameTabBase["tabDiscovered"];
            code: SharkGameTabBase;
            discoverReq: SharkGameTabBase["discoverReq"];
        }
    >;

    type TextUtilModule = {
        plural(number: number): "" | "s";
        getDeterminer(name: ResourceName): "" | "a" | "an";
        getIsOrAre(name: ResourceName, amount?: number): "is" | "are";
        boldString(string: string): `<span class='bold'>${string}</span>`;
        beautify(number: number, suppressDecimals?: boolean, toPlaces?: number): string;
        beautifyIncome(number: number, also?: string): string;
        formatTime(milliseconds: number): string;
        getResourceName(resourceName: ResourceName, darken?: boolean, arbitraryAmount?: number, background?: string): string;
        applyResourceColoration(resourceName: ResourceName, textToColor: string): string;
        /** make a resource list object into a string describing its contents */
        resourceListToString(resourceList: Record<ResourceName, number>, darken: boolean, backgroundColor?: string): string;
    };

    type TitleBarModule = Record<
        `${string}Link`,
        {
            name: string;
            main: boolean;
            onClick(): void;
        }
    >;

    type TitleBarHandlerModule = {
        correctTitleBar(): void;
        setUpTitleBar(): void;
    };

    type WorldModule = {
        worldType: string;
        worldResources: Map<ResourceName, { exists: boolean }>;
        init(): void;
        apply(): void;
        resetWorldProperties(): void;
        applyWorldProperties(): void;
        applyGateCosts(): void;
        getWorldEntryMessage(): string;
        /**
         * @param resourceName ID of resource to check
         * @returns Whether or not the resource exists on the current planet
         */
        doesResourceExist(resourceName: ResourceName): boolean;
        forceExistence(resourceName: ResourceName): void;
    };
    //// END REGION: Modules

    //// REGION: Tabs
    type SharkGameTabBase = {
        init(): void;
        switchTo(): void;
        update(): void;

        tabId: string;
        tabDiscovered: boolean;
        tabSeen: boolean;
        tabName: string;
        tabBg?: string;
        discoverReq: Partial<{ resource: Record<ResourceName, number>; upgrade: UpgradeName[] }>;
        message?: string;
    };

    type CheatsAndDebugTab = SharkGameTabBase & {
        pause: boolean;
        stop: boolean;
        speed: number;
        upgradePriceModifier: number;
        actionPriceModifier: number;
        noNumberBeautifying: boolean;
        cycling: boolean;

        defaultParameters: {
            pause: boolean;
            stop: boolean;
            speed: number;
            upgradePriceModifier: number;
            actionPriceModifier: number;
            noNumberBeautifying: boolean;
            cycling: boolean;
        };

        cheatButtons: Record<string, CheatButton>;

        cycleStyles(time?: number): void;
        discoverAll(): void;
        giveEverything(amount?: number): void;
        debug(): void;
        hideDebug(): void;
        toggleDebugButton(): void;
        togglePausePlease(): void;
        toggleStopPlease(): void;
        freezeGamePlease(): string;
        unfreezePlease(): string;
        freeEssencePlease(howMuch?: number): string;
        goFasterPlease(): string;
        reallyFastPlease(): string;
        goSlowerPlease(): string;
        reallySlowPlease(): string;
        resetSpeedPlease(): string;
        giveMeMoreOfEverythingPlease(multiplier: number): string;
        setAllResources(howMuch?: number): void;
        doSomethingCoolPlease(): string;
        beatWorldPlease(): string;
        toggleBeautify(): void;
        rollTheDicePlease(number: number): string;
        expensiveUpgradesPlease(): string;
        cheaperUpgradesPlease(): string;
        expensiveStuffPlease(): string;
        cheaperStuffPlease(): string;
    };

    type GateTab = SharkGameTabBase & {
        messageOneSlot: string;
        messageOpened: string;
        messagePaid: string;
        messageCantPay: string;
        messagePaidNotOpen: string;
        messageAllPaid: string;
        messageEnter: string;
        sceneClosedImage: string;
        sceneAlmostOpenImage: string;
        sceneOpenImage: string;
        sceneClosedButFilledImage: string;

        requirements: {
            slots: Record<ResourceName, number>;
            upgrades: Record<UpgradeName, string>;
            resources: Record<ResourceName, number>;
        };
        completedRequirements: {
            slots: Record<ResourceName, boolean>;
            upgrades: Record<UpgradeName, boolean>;
            resources: Record<ResourceName, boolean>;
        };

        createSlots(gateRequirements: GateRequirements): void;
        getMessage(): string;
        getSlotsLeft(): number | false;
        getUpgradesLeft(): number | false;
        getResourcesLeft(): unknown[] | false; // TODO: Find better type
        onHover(): void;
        onUnhover(): void;
        onGateButton(): void;
        onEnterButton(): void;
        shouldBeOpen(): boolean;
        checkUpgradeRequirements(upgradeName: UpgradeName): void;
        checkResourceRequirements(resourceName: ResourceName): void;
        getSceneImagePath(): string;
    };

    type HomeTab = SharkGameTabBase & {
        currentButtonTab: null | HomeActionCategory;
        currentExtraMessageIndex: number;
        discoverActions(): void;
        createButtonTabs(): void;
        updateTab(tabToUpdate: string): void;
        changeButtonTab(tabToChangeTo: HomeActionCategory): void;
        updateMessage(suppressAnimation: boolean): void;
        updateButton(actionName: HomeActionName): void;
        areActionPrereqsMet(actionName: HomeActionName): boolean;
        shouldRemoveHomeButton(action: HomeAction): boolean;
        addButton(actionName: HomeActionName): void;
        getActionCategory(actionName: HomeActionName): string;
        onHomeButton(mouseEnterEvent: JQuery.MouseEnterEvent, actionName: HomeActionName): void;
        onHomeUnhover(): void;
        getCost(action: HomeAction, amount: number): Record<ResourceName, number>;
        getMax(action: HomeAction): Decimal;
    };

    type LabTab = SharkGameTabBase & {
        sceneImage: string;
        sceneDoneImage: string;
        listEmpty: boolean;
        messageDone: string;
        resetUpgrades(): void;
        setHint(upgradeTable: UpgradeTable): void;
        updateLabButton(upgradeName: UpgradeName): void;
        onLabButton(): void;
        addUpgrade(upgradeId: UpgradeName): void;
        allResearchDone(): boolean;
        isUpgradePossible(upgradeName: UpgradeName): boolean;
        isUpgradeVisible(upgradeId: UpgradeName): boolean;
        getResearchEffects(upgrade: Upgrade): string;
        updateUpgradeList(): void;
    };

    type RecyclerTab = SharkGameTabBase & {
        sceneImage?: string;
        recyclerInputMessages: string[];
        recyclerOutputMessages: string[];
        allowedCategories: Record<ResourceCategory, CostFunction | undefined>;
        bannerResources: ResourceName[];
        efficiency: "NA" | number;
        hoveredResource: "NA" | number;
        expectedOutput: "NA" | number;
        expectedJunkSpent: "NA" | number;
        updateJunkDisplay(): void;
        updateButtons(): void;
        createButtons(): void;
        onInput(): void;
        onOutput(): void;
        getMaxToBuy(resource: ResourceName): Decimal;
        onInputHover(): void;
        onInputUnhover(): void;
        onOutputHover(): void;
        onOutputUnhover(): void;
        getTarString(): string;
        getRecyclerEfficiencyString(): string;
        updateExpectedOutput(): void;
        updateExpectedJunkSpent(): void;
        getEfficiency(): number;
        updateEfficiency(resource: ResourceName): void;
    };

    type ReflectionTab = SharkGameTabBase & {
        updateAspectList(): void;
    };

    type StatsTab = SharkGameTabBase & {
        sceneImage: string;
        recreateIncomeTable: null | boolean;
        incomeTableEmpty: boolean;
        bannedDisposeCategories: ResourceCategory[];
        createDisposeButtons(): void;
        updateDisposeButtons(): void;
        onDispose(): void;
        updateIncomeTable(): void;
        updateTotalAmountTable(): void;
        createIncomeTable(): JQuery<HTMLTableElement>;
        createTotalAmountTable(): JQuery<HTMLTableElement>;
        toggleSwitch(): void;
        toggleMode(): void;
        updateTableKey(): void;
        networkTextEnter(_mouseEnterEvent: JQuery.MouseEnterEvent, networkResource: "nothing" | `#network-${ResourceName}-${string}`): void; // TODO: Fix this shitty function god
        networkTextLeave(): void;
    };
    //// END REGION: Tabs

    type SharkGameTabs = {
        CheatsAndDebug: CheatsAndDebugTab;
        Gate: GateTab;
        Home: HomeTab;
        Lab: LabTab;
        Recycler: RecyclerTab;
        Reflection: ReflectionTab;
        Stats: StatsTab;
    };

    type SharkGameModules = {
        AspectTree: AspectTreeModule;
        Button: ButtonModule;
        ColorUtil: ColorUtilModule;
        EventHandler: EventHandlerModule;
        Gateway: GatewayModule;
        HomeActions: HomeActionsModule;
        HomeEvents: HomeEventsModule;
        Log: LogModule;
        Main: MainModule;
        MathUtil: MathUtilModule;
        MiscUtil: MiscUtilModule;
        Memories: MemoryModule;
        PaneHandler: PaneHandlerModule;
        ResourceIncomeAffected;
        ResourceIncomeAffectors;
        ResourceIncomeAffectorsOriginal;
        ResourceMap;
        Resources;
        ResourceSpecialProperties;
        ResourceTable;
        Save: SaveModule;
        Settings: SettingsModule;
        TabHandler: TabHandlerModule;
        Tabs: TabsModule;
        TextUtil: TextUtilModule;
        TitleBar: TitleBarModule;
        TitleBarHandler: TitleBarHandlerModule;
        Upgrades: UpgradesModule;
        World: WorldModule;
    };
    type SharkGameConstants = {
        ACTUAL_GAME_NAME: string;
        BIGGEST_SAFE_NUMBER: number;
        COMMIT_SHA: string;
        EPSILON: number;
        GAME_NAME: string;
        GAME_NAMES: string[];
        INTERVAL: number;
        MAX: number;
        ORIGINAL_VERSION: string;
        VERSION_NAME: string;
        VERSION: string;
        Changelog: Record<string, string[]>;
    };
    type SharkGameUtils = {
        changeSprite(spritePath: string, imageName: string, imageDiv: JQuery<HTMLDivElement>, backupImageName: string): JQuery<HTMLDivElement>;
        choose<T>(choices: T[]): T;
        getImageIconHTML(imagePath: string | undefined, width: number | string, height: number | string): string;

        before: number;
        dt: number;
        flags: Record<string, unknown>; // TODO: Find out unknown type
        gameOver: boolean;
        paneGenerated: boolean;
        persistentFlags: Record<string, any>;
        sidebarHidden: boolean;
        spriteHomeEventPath: string;
        spriteIconPath: string;
        timestampGameStart: number;
        timestampLastSave: number;
        timestampRunEnd: number;
        timestampRunStart: number;
        timestampSimulated: number;
        wonGame: boolean;
    };
    type SharkGameData = {
        Aspects: Record<AspectName, Aspect>;
        Events: Record<string, SharkEventHandler>;
        HomeActionCategories: Record<HomeActionCategory, { name: string; actions: HomeActionName }>;
        HomeActions: Record<WorldName, HomeActionTable>;
        InternalCategories: Record<ResourceName, { name: string; resources: ResourceName[] }>;
        ModifierTypes: Record<"upgrade" | "world" | "aspect", Record<"multiplier" | "other", Record<ModifierName, Modifier>>>;
        Panes: Record<string, string[]>;
        ResourceCategories: Record<ResourceCategory, { name: string; disposeMessage: string[]; resources: ResourceName[] }>;
        Sprites: SpritesModule;
        Upgrades: Record<WorldName, UpgradeTable>;
        WorldTypes: Record<WorldName, World>;
    };
    type SharkGameRuntimeData = {
        BreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
        FlippedBreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
        GeneratorIncomeAffected: SharkGameRuntimeData["GeneratorIncomeAffectorsOriginal"];
        GeneratorIncomeAffectors: SharkGameRuntimeData["GeneratorIncomeAffectorsOriginal"];
        GeneratorIncomeAffectorsOriginal: Record<ResourceName, Record<"multiply" | "exponentiate", Record<ResourceName, number>>>; // TOOD: Might be a better type available later;
        ModifierMap: Map<
            ResourceName,
            Record<"upgrade" | "world" | "aspect", Record<"multiplier" | "other", Record<ModifierName, number | string[]>>>
        >;
        /** Can be indexed with the name of a modifier to return the associated data in SharkGame.ModifierTypes. */
        ModifierReference: Map<ModifierName, Modifier>;
        PlayerIncomeTable: Map<ResourceName, number>;
        PlayerResources: Map<ResourceName, { amount: number; totalAmount: number }>;
    };

    type SharkGame = SharkGameConstants & SharkGameUtils & SharkGameModules & SharkGameData & SharkGameRuntimeData & SharkGameTabs;
}
