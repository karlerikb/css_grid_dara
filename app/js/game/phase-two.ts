import { Game } from "./game";
import { GameboardAreas } from "../conf/custom-types";
import { Piece } from "../players/piece";

export class PhaseTwo extends Game {
  active: boolean = false;
  readonly name: string = "two";

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
    this.surroundingAreas.forEach(area => {
      if (area && !prohibitedAreas.includes(area) && !this.fourInRow.exists(area)) {
        this.createAllowedPositionElement(area, tempPositions);
      }
      gameboard.appendChild(tempPositions);
    });
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
  }

  private checkForThreeInRow(): void {
    if (this.threeInRow.exists()) {
      console.log("remove piece...");
      this.resetPieceReferences();
    } else {
      this.resetPieceReferences();
      this.switchTurn();
    }
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