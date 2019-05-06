import { WaitingPieceActivationState } from "./waiting-piece-activation";
import { PieceActivatedState } from "./piece-activated";

export interface State {
  gameMove: GameMove;

  enablePieceActivation(): void;
  enablePieceHighlight(): void;
}

export class GameMove {
  private _state: State = <State>{};

  private waitingPieceActivationState: State;
  private pieceActivatedState: State;


  constructor() {
    this.waitingPieceActivationState = new WaitingPieceActivationState(this);
    this.pieceActivatedState = new PieceActivatedState(this);
    this.initializeGameMove();
  }

  initializeGameMove(): void {
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