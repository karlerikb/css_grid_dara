import { Game } from "./game";
import { GameboardAreas, PlayerThreeInRow } from "../conf/custom-types";
import { Piece } from "../players/piece";
import { Player } from "../players/player";
import { Hints } from "../hints/hints";
import { PressDownTimer } from "../misc/pressdown-timer";

export class PhaseTwo extends Game {
  active: boolean = false;
  temporaryThreeInRows: PlayerThreeInRow[] = [];
  readonly name: string = "two";
  private oldPos: string = "";
  private newPos: string = "";

  constructor() {
    super();
  }

  init(): void {
    this.configurePieces();
    this.resetProhibitedPositions();
    this.gameTurn.initializeGameTurn();
  }

  finalizeMovement(): void {
    this.configure(this.gridArea);
    this.reset();
    this.checkForThreeInRow();
  }

  createGameboardPositions(): void {
    this.removeGameboardPositions();
    this.createPositions();
  }

  removeOpponentPiece(target: EventTarget): void {
    const piece: Piece = <Piece>this.conf.inactivePlayer.pieces.find(piece => piece.element === target);
    if (piece.partOfThreeInRow) {
      this.removeOpponentThreeInRow(piece);
    }
    this.conf.inactivePlayer.removePiece(piece);
    this.resetPieceRemoval();
    this.switchTurn();
  }

  initializeRowSelection(e: any): void {
    e.preventDefault();
    const indicationElements: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.selectableRows);
    for (let indicationElement of indicationElements) {
      indicationElement.classList.remove(this.conf.classes.selectedRow);
      indicationElement.classList.add(this.conf.classes.unselectedRow);
    }
    (<HTMLElement>e.target).classList.remove(this.conf.classes.unselectedRow);
    (<HTMLElement>e.target).classList.add(this.conf.classes.selectedRow);
    this.startPressDownCounter(e.target);
  }

  cancelRowSelection(): void {
    PressDownTimer.instance.cancelTimer();
  }

  finalizeRowSelection(target: EventTarget): void {
    this.determineAreasForSelectedThreeInRow(target);
    this.removeTemporaryThreeInRows();
    this.threeInRow.existsAfterSelection();
  }

  findPiecesWithSomeAvailablePositions(): number {
    let piecesWithSomeAvailablePositions: number = 0;
    this.conf.activePlayer.pieces.forEach(piece => {
      const surroundingAreas: GameboardAreas = this.getSurroundingAreas(piece.area);
      let pieceHasPositions: boolean = false;
      surroundingAreas.forEach(area => {
        if ((area && !this.conf.activePlayer.prohibitedAreas.includes(area) && !this.fourInRow.exists(area) && this.conf.activePlayer.lastMove(area))) {
          pieceHasPositions = true;
        }
      });
      if (pieceHasPositions) piecesWithSomeAvailablePositions++;
    });
    return piecesWithSomeAvailablePositions;
  }

  private removeOpponentThreeInRow(piece: Piece): void {
    piece.player.threeInRows.forEach((threeInRow, index) => {
      if (threeInRow.areas.includes(piece.area)) {
        this.configurePiecesWhenRemovedFromThreeInRow(threeInRow.areas);
        threeInRow.element.remove();
        this.conf.inactivePlayer.threeInRows.splice(index, 1);
      }
    });
  }

  private startPressDownCounter(target: EventTarget): void {
    PressDownTimer.instance.element = <HTMLElement>target;
    requestAnimationFrame(PressDownTimer.instance.timerFunction);
  }

  private determineAreasForSelectedThreeInRow(target: EventTarget): void {
    const chosenRow: PlayerThreeInRow = <PlayerThreeInRow>this.temporaryThreeInRows.find(threeInRow => {
      return threeInRow.element === target;
    });
    this.conf.activePhase.threeInRows.push(chosenRow.areas);
  }

  private removeTemporaryThreeInRows() {
    this.temporaryThreeInRows.forEach(threeInRow => {
      threeInRow.element.remove();
    });
    this.temporaryThreeInRows = [];
  }

  private resetPieceRemoval(): void {
    this.conf.inactivePlayer.pieces.forEach(piece => {
      piece.element.classList.remove(this.conf.classes.removePiece);
      piece.element.removeEventListener("click", this.conf.eventListeners.removingOpponentPiece);
    });
  }

  private configurePieces(): void {
    this.conf.allPlayerPieces.forEach(piece => {
      piece.movedToTable = false;
    });
  }

  private resetProhibitedPositions(): void {
    this.conf.players.forEach(player => {
      player.prohibitedAreas = [];
      player.prohibitedAreasMadeByRows = [];
      player.prohibitedAreas = this.conf.activePlayer.gameboardPieceAreas.concat(
        this.conf.inactivePlayer.gameboardPieceAreas
      );
    });
  }

  private createPositions(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const tempPositions: DocumentFragment = document.createDocumentFragment();
    const prohibitedAreas: string[] = this.conf.activePlayer.prohibitedAreas;
    const activePlayer: Player = this.conf.activePlayer;
    this.surroundingAreas.forEach(area => {
      if (area && !prohibitedAreas.includes(area) && !this.fourInRow.exists(area) && activePlayer.lastMove(area)) {
        this.createAllowedPositionElement(area, tempPositions);
      } else {
        Hints.instance.findNoPositionsAvailableValidation(true);
      }
      if (area) {
        Hints.instance.findLastMoveValidation(!activePlayer.lastMove(area));
        Hints.instance.findFourInRowValidation(this.fourInRow.exists(area));
      }
      gameboard.appendChild(tempPositions);
    });
    Hints.instance.findLastMoveValidCount();
    Hints.instance.findFourInRowValidCount();
    Hints.instance.findNoPositionsAvailableValidCount();
  }

  private configure(area: string): void {
    this.configureMovedPieceStyles();
    this.configureGameData(area);
    this.configureMovedPieceData(area);
  }

  private configureMovedPieceStyles(): void {
    this.conf.activePiece!.element.classList.remove(this.conf.classes.highlighted, this.conf.classes.notAllowed);
  }

  private configureMovedPieceData(area: string): void {
    this.conf.activePiece!.element.style.gridArea = area;
    this.conf.activePiece!.area = area;
    this.conf.activePiece!.active = false;
    this.conf.activePlayer.registerLastMove(this.oldPos);
  }

  private configureGameData(area: string): void {
    this.oldPos = this.conf.activePiece!.area, this.newPos = area;
    this.conf.activePlayer.configureAreasWhenMoving(this.oldPos, this.newPos);
  }

  private reset(): void {
    this.removeAnimation();
    this.removeGameboardPositions();
  }

  private checkForThreeInRow(): void {
    this.checkIfThreeInRowNeedsToBeRemoved();
    this.checkIfThreeInRowNeedsToBeCreated();
    this.resetPieceReferences();
  }

  private checkIfThreeInRowNeedsToBeCreated(): void {
    if (!this.threeInRow.exists()) {
      this.switchTurn();
    }
  }

  private checkIfThreeInRowNeedsToBeRemoved(): void {
    const threeInRows: PlayerThreeInRow[] = this.conf.activePiece!.player.threeInRows;
    if (threeInRows) {
      threeInRows.forEach((threeInRow, index) => {
        if (threeInRow.areas.includes(this.oldPos)) {
          this.configurePiecesAsNotBeingPartOfThreeInRow(threeInRow.areas);
          threeInRow.element.remove();
          threeInRows.splice(index, 1);
        }
      });
    }
  }

  private configurePiecesAsNotBeingPartOfThreeInRow(areas: string[]): void {
    areas.splice(areas.indexOf(this.oldPos), 1, this.newPos); // making an array which can be iterated over
    areas.forEach(area => {
      const piece: Piece = <Piece>this.conf.activePiece!.player.pieces.find(piece => piece.area === area);
      piece.partOfThreeInRow = false;
    });
  }

  private configurePiecesWhenRemovedFromThreeInRow(areas: string[]): void {
    areas.forEach(area => {
      const piece: Piece = <Piece>this.conf.inactivePlayer.pieces.find(piece => piece.area === area);
      piece.partOfThreeInRow = false;
    });
  }

  private getSurroundingAreas(area: string): GameboardAreas {
    const row = +area[1], column = +area[2];
    const topArea = (row > 1) ? `a${row - 1}${column}` : null;
    const bottomArea = (row < 5) ? `a${row + 1}${column}` : null;
    const leftArea = (column > 1) ? `a${row}${column - 1}` : null;
    const rightArea = (column < 6) ? `a${row}${column + 1}` : null;
    return [topArea, leftArea, bottomArea, rightArea];
  }

  private get surroundingAreas(): GameboardAreas {
    const row = +this.conf.activePiece!.area[1], column = +this.conf.activePiece!.area[2];
    const topArea = (row > 1) ? `a${row - 1}${column}` : null;
    const bottomArea = (row < 5) ? `a${row + 1}${column}` : null;
    const leftArea = (column > 1) ? `a${row}${column - 1}` : null;
    const rightArea = (column < 6) ? `a${row}${column + 1}` : null;
    return [topArea, leftArea, bottomArea, rightArea];
  }
}