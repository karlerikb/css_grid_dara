import { Player } from "../players/player";
import { Game } from "../game/game";
import { Phase, EventListenerCollection, ElementClasses, ElementSelectors } from "./custom-types";
import { Piece } from "../players/piece";

export class Configuration {
  private static _instance: Configuration;
  private _acitvePiece: Piece | null = null;

  readonly players: Player[] = [];
  readonly phases: Game[] = [];

  readonly eventListeners: EventListenerCollection = {
    activatingPiece: this.activatePiece.bind(this),
    movingPiece: this.movePiece.bind(this)
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
  }

  readonly selectors: ElementSelectors = {
    playerOnePiecesContainer: `.${this.classes.playerOne}.${this.classes.piecesContainer}`,
    playerTwoPiecesContainer: `.${this.classes.playerTwo}.${this.classes.piecesContainer}`,
    gameboard: `.${this.classes.gameboard}`,
    temporaryPositions: `.${this.classes.gameboard} > .${this.classes.temporaryPosition}`
  }


  private constructor() {
  }

  private activatePiece(e: MouseEvent): void {
    const activePhase: Phase = <Phase>this.phases.find((phase: any) => phase.active);
    activePhase.activatePiece(<EventTarget>e.target);
  }

  private movePiece(e: MouseEvent): void {
    console.log(e.target);
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
}