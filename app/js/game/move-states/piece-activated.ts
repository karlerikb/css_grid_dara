import { State, GameMove } from "./game-move";
import { Configuration } from "../../conf/configuration";

export class PieceActivatedState implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameMove: GameMove) {
  }

  enablePieceActivation(): void {
    throw new Error("A piece is already activated!");
  }

  enablePieceHighlight(): void {
    console.log("enabling highlight...");
  }
}