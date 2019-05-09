import { GameTurn } from "../game-turn";
import { Configuration } from "../../conf/configuration";
import { State } from "../../conf/interfaces";

export class WaitingPieceActivationState implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameTurn: GameTurn) {
  }

  enablePieceActivation(): void {
    this.resetPieceClasses();
    this.handlePieceEventListeners();
  }

  enablePieceHighlight(): void {
    throw new Error("Cannot highlight a piece when it is not activated!");
  }

  movingPiece(): void {
    throw new Error("No piece has been activated, cannot move any gamepiece yet!");
  }

  private handlePieceEventListeners(): void {
    this.conf.allPlayerPieces.forEach(piece => {
      piece.element.removeEventListener("click", this.conf.eventListeners.activatingPiece);
    });
    this.conf.activePlayer.pieces.forEach(piece => {
      if (!piece.movedToTable) {
        piece.element.addEventListener("click", this.conf.eventListeners.activatingPiece);
      }
    });
  }

  private resetPieceClasses(): void {
    this.conf.allPlayerPieces.forEach(piece => {
      piece.element.classList.remove(this.conf.classes.dehighlighted, this.conf.classes.notAllowed);
    });
  }
}