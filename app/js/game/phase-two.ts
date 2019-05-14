import { Game } from "./game";
import { GameboardAreas, PlayerThreeInRow } from "../conf/custom-types";
import { Piece } from "../players/piece";
import { Player } from "../players/player";
import { Hints } from "../hints/hints";

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
    this.conf.inactivePlayer.removePiece(piece);
    this.resetPieceRemoval();
    this.switchTurn();
  }

  initializeRowSelection(target: EventTarget): void {
    const indicationElements: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.selectableRows);
    for (let indicationElement of indicationElements) {
      indicationElement.classList.remove(this.conf.classes.selectedRow);
      indicationElement.classList.add(this.conf.classes.unselectedRow);
    }
    (<HTMLElement>target).classList.remove(this.conf.classes.unselectedRow);
    (<HTMLElement>target).classList.add(this.conf.classes.selectedRow);
  }

  finalizeRowSelection(target: EventTarget): void {
    this.determineAreasForSelectedThreeInRow(target);
    this.removeTemporaryThreeInRows();
    this.threeInRow.existsAfterSelection();
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
    // hints
    const lastMovePositions: number[] = [];
    const fourInRowPositions: number[] = [];

    this.surroundingAreas.forEach(area => {
      if (area && !prohibitedAreas.includes(area) && !this.fourInRow.exists(area) && activePlayer.lastMove(area)) {
        this.createAllowedPositionElement(area, tempPositions);
      }
      // lastmove
      if (area && !activePlayer.lastMove(area)) {
        lastMovePositions.push(1);
      } else {
        lastMovePositions.push(0);
      }
      // fourinrows
      if (area && this.fourInRow.exists(area)) {
        fourInRowPositions.push(1);
      } else {
        fourInRowPositions.push(0);
      }

      gameboard.appendChild(tempPositions);
    });
    // lastmove
    const lastMoveCount = lastMovePositions.reduce((valid, area) => valid + area);
    if (lastMoveCount > 0) {
      Hints.instance.setLastMoveNotAllowedDetail();
    } else {
      Hints.instance.removeLastMoveNotAllowedDetail();
    }
    const fourInRowCount = fourInRowPositions.reduce((valid, area) => valid + area);
    if (fourInRowCount > 0) {
      Hints.instance.setNoFourInRowAllowedDetail();
    } else {
      Hints.instance.removeNoFourInRowAllowedDetail();
    }
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

  private get surroundingAreas(): GameboardAreas {
    const row = +this.conf.activePiece!.area[1], column = +this.conf.activePiece!.area[2];
    const topArea = (row > 1) ? `a${row - 1}${column}` : null;
    const bottomArea = (row < 5) ? `a${row + 1}${column}` : null;
    const leftArea = (column > 1) ? `a${row}${column - 1}` : null;
    const rightArea = (column < 6) ? `a${row}${column + 1}` : null;
    return [topArea, leftArea, bottomArea, rightArea];
  }
}