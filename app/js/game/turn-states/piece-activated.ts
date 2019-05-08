import { GameTurn } from "./game-turn";
import { Configuration } from "../../conf/configuration";
import { State } from "../../conf/interfaces";
import { Phase } from "../../conf/custom-types";

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
    } else {
      this.togglePieceActivation();
      this.highlightActivePiece();
      this.createGameboardPositions();
    }
  }

  private togglePieceActivation(): void {
    this.deactivatePieces();
    this.conf.activePiece!.active = true;
  }

  private removeActivePieceReference(): void {
    this.conf.activePiece = null;
  }

  private deactivatePieces(): void {
    this.conf.activePiece!.player.pieces.forEach(piece => {
      piece.active = false;
      piece.element.classList.remove(this.conf.classes.highlighted, this.conf.classes.dehighlighted);
    });
  }

  private highlightActivePiece(): void {
    this.conf.activePiece!.element.classList.add(this.conf.classes.highlighted);
    this.dehighlightNonActicePieces();
  }

  private dehighlightNonActicePieces(): void {
    this.conf.activePiece!.player.pieces.forEach(piece => {
      if (!piece.active && !piece.movedToTable) {
        piece.element.classList.add(this.conf.classes.dehighlighted);
      }
    });
  }

  private createGameboardPositions(): void {
    const activePhase: Phase = <Phase>this.conf.phases.find((phase: any) => phase.active);
    activePhase.createGameboardPositions();
  }
}