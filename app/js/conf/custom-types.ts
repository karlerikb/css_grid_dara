import { PhaseOne } from "../game/phase-one";
import { PhaseTwo } from "../game/phase-two";

export type Phase = PhaseOne | PhaseTwo;
export type GameboardAreas = (string | null)[];
export type Reach = string[] | null;

export type EventListenerCollection = {
  activatingPiece: (e: any) => void,
  movingPiece: (e: any) => void,
  movementEnds: (e: any) => void,
  removingOpponentPiece: (e:any) => void,
  initializingRowSelection: (e: any) => void,
  finalizingRowSelection: (e: any) => void,
  openingMenu: (e: any) => void,
  closingMenu: (e: any) => void,
  openingSettings: (e: any) => void,
  closingApp: (e: any) => void
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
  piece: string,
  notAllowed: string,
  animateMovement: string,
  playerTurn: string,
  removePiece: string,
  threeInRow: string,
  selectableRow: string,
  selectedRow: string,
  unselectedRow: string,
  pieceActivated: string,
  gameContainer: string,
  menu: string,
  menuList: string
}

export type ElementSelectors = {
  playerOnePiecesContainer: string,
  playerTwoPiecesContainer: string,
  gameboard: string,
  temporaryPositions: string,
  selectableRows: string,
  root: string,
  gameContainer: string
}

export type PlayerThreeInRow = {
  areas: string[],
  element: HTMLElement
}

export type MenuListItem = {
  option: string,
  text: string,
  eventListener: (e: any) => void
}