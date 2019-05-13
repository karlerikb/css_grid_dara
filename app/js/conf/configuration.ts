import { Player } from "../players/player";
import { Game } from "../game/game";
import { Phase, EventListenerCollection, ElementClasses, ElementSelectors } from "./custom-types";
import { Piece } from "../players/piece";

export class Configuration {
  private static _instance: Configuration;
  private _acitvePiece: Piece | null = null;
  private _selectedPosition: EventTarget | null = null;

  readonly players: Player[] = [];
  readonly phases: Game[] = [];

  readonly eventListeners: EventListenerCollection = {
    activatingPiece: this.activatePiece.bind(this),
    movingPiece: this.movePiece.bind(this),
    movementEnds: this.movementEnds.bind(this),
    removingOpponentPiece: this.removeOpponentPiece.bind(this),
    initializingRowSelection: this.initializeRowSelection.bind(this),
    finalizingRowSelection: this.finalizeRowSelection.bind(this)
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
    unselectedRow: "unselectedIndication"
  }

  readonly selectors: ElementSelectors = {
    playerOnePiecesContainer: `.${this.classes.playerOne}.${this.classes.piecesContainer}`,
    playerTwoPiecesContainer: `.${this.classes.playerTwo}.${this.classes.piecesContainer}`,
    gameboard: `.${this.classes.gameboard}`,
    temporaryPositions: `.${this.classes.gameboard} > .${this.classes.temporaryPosition}`,
    selectableRows: `.${this.classes.threeInRow}.${this.classes.selectableRow}`,
    root: ":root"
  }

  private constructor() {
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
    this.activePhase.initializeRowSelection(e.target);
  }

  private finalizeRowSelection(e: any): void {
    this.activePhase.finalizeRowSelection(e.target);
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