import { State, GameMove } from "./game-move";
import { Configuration } from "../../conf/configuration";
import { Player } from "../../players/player";

export class WaitingPieceActivationState implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameMove: GameMove) {
  }

  enablePieceActivation(): void {
    this.handlePieceEventListeners();
    this.gameMove.activatePiece();
  }

  enablePieceHighlight(): void {
    throw new Error("Cannot highlight a piece when it is not activated!");
  }

  private handlePieceEventListeners(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    activePlayer.pieces.forEach(piece => {
      if (!piece.movedToTable) {
        piece.element.addEventListener("click", this.conf.eventListeners.pieceActivation);
      }
    });
    inactivePlayer.pieces.forEach(piece => {
      piece.element.removeEventListener("click", this.conf.eventListeners.pieceActivation);
    });
  }
}