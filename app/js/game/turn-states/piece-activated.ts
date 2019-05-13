import { GameTurn } from "../game-turn";
import { Configuration } from "../../conf/configuration";
import { State } from "../../conf/interfaces";

export class PieceActivatedState implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameTurn: GameTurn) {
  }

  enablePieceActivation(): void {
    throw new Error("A piece is already activated!");
  }

  enablePieceHighlight(): void {
    if (this.conf.activePiece!.active) {
      this.deactivatePieces();
      this.removeActivePieceReference();
      this.removeGameboardPositions();
    } else {
      this.togglePieceActivation();
      this.highlightActivePiece();
      this.createGameboardPositions();
    }
  }

  movingPiece(): void {
    throw new Error("Gamepiece is highlighted, but moving it is not yet initiated!")
  }

  removingOpponentPiece(): void {
    throw new Error("Cannot remove an opponent piece when player piece is activated, but no game-move has been made!");
  }

  enableMultipleThreeInRowSelection(): void {
    throw new Error("Cannot enable multiple three-in-row selectin when placing a piece on the gameboard!");
  }

  private togglePieceActivation(): void {
    this.deactivatePieces();
    this.conf.activePiece!.active = true;
  }

  private removeActivePieceReference(): void {
    this.conf.activePiece = null;
  }

  private deactivatePieces(): void {
    this.conf.activePlayer.pieces.forEach(piece => {
      piece.active = false;
      piece.element.classList.remove(this.conf.classes.highlighted, this.conf.classes.dehighlighted);
    });
  }

  private highlightActivePiece(): void {
    this.conf.activePiece!.element.classList.add(this.conf.classes.highlighted);
    this.dehighlightNonActicePieces();
  }

  private dehighlightNonActicePieces(): void {
    this.conf.activePlayer.pieces.forEach(piece => {
      if (!piece.active && !piece.movedToTable) {
        piece.element.classList.add(this.conf.classes.dehighlighted);
      }
    });
  }

  private createGameboardPositions(): void {
    this.conf.activePhase.createGameboardPositions();
  }

  private removeGameboardPositions(): void {
    this.conf.activePhase.removeGameboardPositions();
  }
}