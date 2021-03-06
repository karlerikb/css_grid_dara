import { WaitingPieceActivationState } from "./turn-states/waiting-piece-activation";
import { PieceActivatedState } from "./turn-states/piece-activated";
import { State } from "../conf/interfaces";
import { MovingPieceState } from "./turn-states/moving-piece";
import { RemovingOpponentPiece } from "./turn-states/removing-opponent-piece";
import { WaitingThreeInRowSelection } from "./turn-states/waiting-three-in-row-selection";
import { Hints } from "../hints/hints";

export class GameTurn {
  private _state: State = <State>{};
  private hints: Hints = Hints.instance;

  private waitingPieceActivationState: State;
  private pieceActivatedState: State;
  private movingPieceState: State;
  private removingOpponentPiece: State;
  private waitingThreeInRowSelection: State;


  constructor() {
    this.waitingPieceActivationState = new WaitingPieceActivationState(this);
    this.pieceActivatedState = new PieceActivatedState(this);
    this.movingPieceState = new MovingPieceState(this);
    this.removingOpponentPiece = new RemovingOpponentPiece(this);
    this.waitingThreeInRowSelection = new WaitingThreeInRowSelection(this);
  }

  initializeGameTurn(): void {
    this.hints.setDefaultHints();
    this.state = this.waitingPieceActivationState;
    this.state.enablePieceActivation();
  }

  activatePiece(): void {
    this.hints.setPieceActivationHints();
    this.state = this.pieceActivatedState;
    this.state.enablePieceHighlight();
  }

  movePiece(): void {
    this.hints.setPieceMovingHints();
    this.state = this.movingPieceState;
    this.state.movingPiece();
  }

  removePiece(): void {
    this.hints.setPieceRemovalHints();
    this.state = this.removingOpponentPiece;
    this.state.removingOpponentPiece();
  }

  enableThreeInRowSelection(): void {
    this.hints.setWaitingThreeInRowSelectionHints();
    this.state = this.waitingThreeInRowSelection;
    this.state.enableMultipleThreeInRowSelection();
  }

  get state(): State {
    return this._state;
  }
  set state(state: State) {
    this._state = state;
  }
}