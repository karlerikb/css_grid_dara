import { PhaseOne } from "../game/phase-one";
import { PhaseTwo } from "../game/phase-two";

export type Phase = PhaseOne | PhaseTwo;

export type EventListenerCollection = {
  activatingPiece: (e: MouseEvent) => void,
  movingPiece: (e: MouseEvent) => void
};

export type ElementClasses = {
  playerOne: string,
  playerTwo: string,
  piecesContainer: string,
  activeContainer: string,
  highlighted: string,
  dehighlighted: string,
  temporaryPosition: string,
  gameboard: string,
  piece: string
}

export type ElementSelectors = {
  playerOnePiecesContainer: string,
  playerTwoPiecesContainer: string,
  gameboard: string,
  temporaryPositions: string
}