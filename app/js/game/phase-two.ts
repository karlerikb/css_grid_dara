import { Game } from "./game";
import { GameboardAreas } from "../conf/custom-types";
import { FourInRow } from "./rows/four-in-row";

export class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";
  private fourInRow = new FourInRow();

  constructor() {
    super();
  }

  init(): void {
    this.configurePieces();
    this.resetProhibitedPositions();
    this.gameTurn.initializeGameTurn();
  }

  finalizeMovement(): void {
    this.movePiece();
    this.switchTurn();
  }

  createGameboardPositions(): void {
    this.removeGameboardPositions();
    this.createPositions();
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
    this.surroundingAreas.forEach(area => {
      if (area && !prohibitedAreas.includes(area) && !this.fourInRow.exists(area)) {
        this.createAllowedPositionElement(area, tempPositions);
      }
      gameboard.appendChild(tempPositions);
    });
  }

  private movePiece(): void {
    this.configure(this.gridArea);
    this.reset();
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
    // temp
    this.conf.activePiece!.element.textContent = area;
  }

  private configureGameData(area: string): void {
    const oldPos = this.conf.activePiece!.area, newPos = area;
    this.conf.activePlayer.configureAreasWhenMoving(oldPos, newPos);
  }

  private reset(): void {
    this.removeAnimation();
    this.removeGameboardPositions();
    // ... this is the places where further states are determined
    this.resetPieceReferences();
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