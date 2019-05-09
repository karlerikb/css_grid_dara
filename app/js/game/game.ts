import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";
import { Player } from "../players/player";
import { GameTurn } from "./game-turn";
import { Piece } from "../players/piece";
import { Phase } from "../conf/custom-types";

export abstract class Game {
  private phaseIsNotSwitched: boolean = true;
  protected settings: Settings = Settings.instance;
  protected conf: Configuration = Configuration.instance;

  readonly gameTurn = new GameTurn();
  readonly piecesOnGameboard: Piece[] = [];

  constructor() {
  }

  initializeMovement(target: EventTarget): void {
    this.conf.selectedPosition = target;
    this.gameTurn.movePiece();
  }

  activatePiece(target: EventTarget): void {
    const activatedPiece: Piece = <Piece>this.conf.activePlayer.pieces.find(piece => piece.element === target);
    this.conf.activePiece = activatedPiece;
    this.gameTurn.activatePiece();
  }

  removeGameboardPositions(): void {
    const tempPositions: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.temporaryPositions);
    for (let position of tempPositions) {
      position.removeEventListener("click", this.conf.eventListeners.movingPiece);
      position.remove();
    }
  }

  protected switchTurn(): void {
    this.switchPlayers();
    this.activatePlayer();
    this.testPhase();
  }

  protected activatePlayer(): void {
    this.conf.activePlayer.piecesContainerElement.classList.add(this.conf.classes.activeContainer);
    this.conf.inactivePlayer.piecesContainerElement.classList.remove(this.conf.classes.activeContainer);
    this.gameTurn.initializeGameTurn();
  }

  private switchPlayers(): void {
    const activePlayer: Player = this.conf.activePlayer;
    const inactivePlayer: Player = this.conf.inactivePlayer;
    activePlayer.active = false;
    inactivePlayer.active = true;
  }

  private testPhase(): void {
    const piecesOnGameboard: number = this.piecesOnGameboard.length;
    const piecesAllowedOnTable: number = 2 * this.settings.piecesForEachPlayer;
    if (piecesOnGameboard === piecesAllowedOnTable && this.phaseIsNotSwitched) {
      this.switchPhase();
      this.phaseIsNotSwitched = false;
    }
  }

  private switchPhase(): void {
    const activePhase: Phase = this.conf.activePhase;
    const inactivePhase: Phase = this.conf.inactivePhase;
    activePhase.active = false;
    inactivePhase.active = true;
    this.conf.activePhase.init();
  }
}