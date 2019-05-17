import { Player } from "../players/player";
import { Game } from "../game/game";
import { Phase, EventListenerCollection, ElementClasses, ElementSelectors, MenuListItem } from "./custom-types";
import { Piece } from "../players/piece";
import { Menu } from "../menu/menu";
import { App } from "../app";
import { Settings } from "./settings";

export class Configuration {
  private static _instance: Configuration | null;
  private _acitvePiece: Piece | null = null;
  private _selectedPosition: EventTarget | null = null;

  players: Player[] = [];
  phases: Game[] = [];

  readonly eventListeners: EventListenerCollection = {
    activatingPiece: this.activatePiece.bind(this),
    movingPiece: this.movePiece.bind(this),
    movementEnds: this.movementEnds.bind(this),
    removingOpponentPiece: this.removeOpponentPiece.bind(this),
    initializingRowSelection: this.initializeRowSelection.bind(this),
    cancellingRowSelection: this.cancelRowSelection.bind(this),
    finalizingRowSelection: this.finalizeRowSelection.bind(this),
    openingMenu: this.openMenu.bind(this),
    closingMenu: this.closeMenu.bind(this),
    openingSettings: this.openSettings.bind(this),
    closingApp: this.closeApp.bind(this),
    resettingApp: this.resetApp.bind(this)
  };

  readonly classes: ElementClasses = {
    playerOne: "playerOne",
    playerTwo: "playerTwo",
    piecesContainer: "piecesContainer",
    activeContainer: "active",
    highlighted: "active",
    dehighlighted: "inactive",
    temporaryPosition: "temporaryPosition",
    gameboard: "gameboard",
    piece: "piece",
    notAllowed: "notAllowed",
    animateMovement: "animateMovement",
    playerTurn: "playerTurn",
    removePiece: "toBeRemoved",
    threeInRow: "threeInRow",
    selectableRow: "selectableIndication",
    selectedRow: "selectedIndication",
    unselectedRow: "unselectedIndication",
    pieceActivated: "pieceActivated",
    gameContainer: "gameContainer",
    menu: "menu",
    menuList: "gameMenuList",
    hintsContainer: "hintsContainer",
    playerInHints: "playerInHints",
    turnInHints: "turnInHints",
    gamePhase: "gamePhase",
    currentPhase: "currentPhase",
    additionalDetails: "additionalDetails",
    hidden: "hidden",
    detail: "detail",
    noThreeInRow: "noThreeInRow",
    pieceChangeAllowed: "pieceChangeAllowed",
    lastMoveNotAllowed: "lastMoveNotAllowed",
    removingFromThreeInRowNotAllowed: "removingFromThreeInRowNotAllowed",
    removingFromThreeInRowIsAllowed: "removingFromThreeInRowIsAllowed",
    noFourInRow: "noFourInRow",
    waitingThreeInRowSelection: "waitingThreeInRowSelection",
    afterWin: "afterWin",
    winScenarioTitle: "winScenarioTitle",
    menuButton: "menuButton",
    removed: "removed",
    settingsMenu: "settingsMenu",
    settingItem: "settingItem"
  }

  readonly selectors: ElementSelectors = {
    playerOnePiecesContainer: `.${this.classes.playerOne}.${this.classes.piecesContainer}`,
    playerTwoPiecesContainer: `.${this.classes.playerTwo}.${this.classes.piecesContainer}`,
    gameboard: `.${this.classes.gameboard}`,
    temporaryPositions: `.${this.classes.gameboard} > .${this.classes.temporaryPosition}`,
    selectableRows: `.${this.classes.threeInRow}.${this.classes.selectableRow}`,
    root: ":root",
    gameContainer: `.${this.classes.gameContainer}`,
    playerOneInHints: `.${this.classes.hintsContainer} .${this.classes.playerInHints}.${this.classes.playerOne}`,
    playerTwoInHints: `.${this.classes.hintsContainer} .${this.classes.playerInHints}.${this.classes.playerTwo}`,
    playerOneTurnInHints: `.${this.classes.hintsContainer} .${this.classes.turnInHints}.${this.classes.playerOne}`,
    playerTwoTurnInHints: `.${this.classes.hintsContainer} .${this.classes.turnInHints}.${this.classes.playerTwo}`,
    gamePhase: `.${this.classes.hintsContainer} .${this.classes.gamePhase}`,
    gamePhaseName: `.${this.classes.hintsContainer} .${this.classes.gamePhase} > .${this.classes.currentPhase}`,
    detailsInHints: `.${this.classes.hintsContainer} .${this.classes.additionalDetails}`
  }

  readonly menuItems: MenuListItem[] = [
    { active: true, option: "resume", text: "Jätka mängu", eventListener: this.eventListeners.closingMenu },
    { active: true, option: "restart", text: "Uus mäng", eventListener: this.eventListeners.resettingApp },
    { active: true, option: "settings", text: "Mängu seaded", eventListener: this.eventListeners.openingSettings },
    { active: true, option: "exit", text: "Välju mängust", eventListener: this.eventListeners.closingApp }
  ];

  private constructor() {
  }

  reset(): void {
    Configuration._instance = null;
  }

  private activatePiece(e: any): void {
    this.activePhase.activatePiece(e.target);
  }

  private movePiece(e: any): void {
    this.activePhase.initializeMovement(e.target);
  }

  private movementEnds(): void {
    this.activePhase.finalizeMovement();
  }

  private removeOpponentPiece(e: any): void {
    this.activePhase.removeOpponentPiece(e.target);
  }

  private initializeRowSelection(e: any): void {
    this.activePhase.initializeRowSelection(e);
  }

  private cancelRowSelection(): void {
    this.activePhase.cancelRowSelection();
  }

  private finalizeRowSelection(e: any): void {
    this.activePhase.finalizeRowSelection(e.target);
  }

  private openMenu(): void {
    Menu.instance.open();
  }

  private closeMenu(): void {
    Menu.instance.close();
  }

  private resetApp(): void {
    App.instance.reset();
  }

  private openSettings(): void {
    Settings.instance.open();
  }

  private closeApp(): void {
    console.log("closing app...");
  }

  public static get instance(): Configuration {
    if (!Configuration._instance) {
      Configuration._instance = new Configuration();
    }
    return Configuration._instance;
  }
  public get activePiece(): Piece | null {
    return this._acitvePiece;
  }
  public set activePiece(piece: Piece | null) {
    this._acitvePiece = piece;
  }
  public get selectedPosition(): EventTarget | null {
    return this._selectedPosition;
  }
  public set selectedPosition(position: EventTarget | null) {
    this._selectedPosition = position;
  }

  public get activePlayer(): Player {
    return <Player>this.players.find(player => player.active);
  }
  public get inactivePlayer(): Player {
    return <Player>this.players.find(player => !player.active);
  }
  public get allPlayerPieces(): Piece[] {
    return this.activePlayer.pieces.concat(this.inactivePlayer.pieces);
  }

  public get activePhase(): Phase {
    return <Phase>this.phases.find((phase: any) => phase.active);
  }
  public get inactivePhase(): Phase | null {
    const inactivePhase: Phase | undefined = <Phase | undefined>this.phases.find((phase: any) => !phase.active);
    if (inactivePhase) {
      return <Phase>inactivePhase;
    }
    return null;
  }
}