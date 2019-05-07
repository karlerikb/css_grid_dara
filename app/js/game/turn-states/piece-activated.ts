import { GameTurn } from "./game-turn";
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
    console.log("enabling highlight...");
  }
}