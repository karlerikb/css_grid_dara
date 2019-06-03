import { GameTurn } from "../game-turn";
import { Configuration } from "../../conf/configuration";
import { State } from "../../conf/interfaces";
import { Piece } from "../../players/piece";

export class WaitingPieceActivationState implements State {
  private conf: Configuration = Configuration.instance;
  // private pieceActivationAnimation: (() => void) = this.removePieceActivationAnimation.bind(this);

  constructor(public gameTurn: GameTurn) {
  }

  enablePieceActivation(): void {
    this.handlePiecesStyles();
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

  enableMultipleThreeInRowSelection(): void {
    throw new Error("Cannot enable multiple three-in-row selection when activating a player piece!");
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

  private handlePiecesStyles(): void {
    this.resetPieceClasses();
    // this.enableSwitchTurnIndication();
    this.disableOpponentPieces();
    this.disablePlayersPiecesOnGameboard();
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

  // private enableSwitchTurnIndication(): void {
  //   this.conf.activePlayer.pieces.forEach(piece => {
  //     if (!piece.movedToTable) {
  //       piece.element.classList.add(this.conf.classes.pieceActivated);
  //       piece.element.addEventListener("animationend", this.pieceActivationAnimation.bind(this));
  //     }
  //   });
  // }

  private disableOpponentPieces(): void {
    this.conf.inactivePlayer.pieces.forEach(piece => {
      this.disablePieces(piece);
    });
  }

  private disablePlayersPiecesOnGameboard(): void {
    this.conf.activePlayer.pieces.forEach(piece => {
      if (piece.movedToTable) this.disablePieces(piece);
    });
  }

  private disablePieces(piece: Piece): void {
    piece.element.classList.add(this.conf.classes.dehighlighted, this.conf.classes.notAllowed);
  }

  // private removePieceActivationAnimation(): void {
  //   this.conf.activePlayer.pieces.forEach(piece => {
  //     if (!piece.movedToTable) {
  //       piece.element.classList.remove(this.conf.classes.pieceActivated);
  //       piece.element.removeEventListener("animationend", this.pieceActivationAnimation.bind(this));
  //     }
  //   });
  // }
}