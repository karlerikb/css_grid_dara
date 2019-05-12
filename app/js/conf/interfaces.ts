import { GameTurn } from "../game/game-turn";

export interface NewElement {
  type: string;
  id?: string;
  class?: string;
  text?: string;
  area?: string;
  parent: HTMLElement | DocumentFragment;
}

export interface State {
  gameTurn: GameTurn;

  enablePieceActivation(): void;
  enablePieceHighlight(): void;
  movingPiece(): void;
  removingOpponentPiece(): void;
}