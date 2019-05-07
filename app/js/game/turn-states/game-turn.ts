import { WaitingPieceActivationState } from "./waiting-piece-activation";
import { PieceActivatedState } from "./piece-activated";
import { State } from "../../conf/interfaces";



export class GameTurn {
  private _state: State = <State>{};

  private waitingPieceActivationState: State;
  private pieceActivatedState: State;


  constructor() {
    this.waitingPieceActivationState = new WaitingPieceActivationState(this);
    this.pieceActivatedState = new PieceActivatedState(this);
    this.initializeGameTurn();
  }

  initializeGameTurn(): void {
    this.state = this.waitingPieceActivationState;
  }

  activatePiece(): void {
    this.state = this.pieceActivatedState;
  }

  get state(): State {
    return this._state;
  }
  set state(state: State) {
    this._state = state;
  }
}