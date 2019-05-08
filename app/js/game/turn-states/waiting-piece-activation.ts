import { GameTurn } from "./game-turn";
import { Configuration } from "../../conf/configuration";
import { Player } from "../../players/player";
import { State } from "../../conf/interfaces";
import { Piece } from "../../players/piece";

export class WaitingPieceActivationState implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameTurn: GameTurn) {
  }

  enablePieceActivation(): void {
    this.handlePieceEventListeners();
    this.gameTurn.activatePiece();
  }

  enablePieceHighlight(): void {
    throw new Error("Cannot highlight a piece when it is not activated!");
  }

  private handlePieceEventListeners(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    const allPieces: Piece[] = activePlayer.pieces.concat(inactivePlayer.pieces);

    allPieces.forEach(piece => {
      piece.element.removeEventListener("click", this.conf.eventListeners.activatingPiece);
    });

    activePlayer.pieces.forEach(piece => {
      if (!piece.movedToTable) {
        piece.element.addEventListener("click", this.conf.eventListeners.activatingPiece);
      }
    });
  }
}