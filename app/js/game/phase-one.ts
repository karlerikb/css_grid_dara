import { Game } from "./game";
import { Player } from "../players/player";
import { Piece } from "../players/piece";

export class PhaseOne extends Game {
  active: boolean = true;
  readonly phase: string = "one";

  constructor() {
    super();
  }

  init(): void {
    this.activatePlayer();
    this.activateGameTurn();
  }

  activatePiece(e: MouseEvent): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const activatedPiece: Piece = <Piece>activePlayer.pieces.find(piece => piece.element === e.target);
    this.conf.acitvePiece = activatedPiece;
    this.gameTurn.state.enablePieceHighlight();
  }
}