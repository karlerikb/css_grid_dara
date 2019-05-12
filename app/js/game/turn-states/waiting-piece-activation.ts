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
    if (this.conf.activePhase.name === "two") {
      this.setPlayerTurnPieceClasses();
    }
  }

  enablePieceHighlight(): void {
    throw new Error("Cannot highlight a piece when it is not activated!");
  }

  movingPiece(): void {
    throw new Error("No piece has been activated, cannot move any gamepiece yet!");
  }

  removingOpponentPiece(): void {
    throw new Error("Cannot remove an opponent piece when waiting for a player piece to be activated!");
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
      piece.element.classList.remove(
        this.conf.classes.dehighlighted,
        this.conf.classes.notAllowed,
        this.conf.classes.playerTurn
      );
    });
  }

  private setPlayerTurnPieceClasses(): void {
    this.conf.activePlayer.pieces.forEach(piece => {
      piece.element.classList.add(this.conf.classes.playerTurn);
    });
  }
}