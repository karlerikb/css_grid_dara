import { Game } from "./game";
import { GameboardAreas } from "../conf/custom-types";

export class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";

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

  configureProhibitedPositions(): void {

  }

  private configurePieces(): void {
    this.conf.allPlayerPieces.forEach(piece => {
      piece.movedToTable = false;
    });
  }

  private resetProhibitedPositions(): void {
    this.conf.players.forEach(player => {
      player.prohibitedPositions = [];
      player.prohibitedPositionsMadeByRows = [];
      player.prohibitedPositions = this.conf.activePlayer.gameboardPieceAreas.concat(
        this.conf.inactivePlayer.gameboardPieceAreas
      );
    });
    console.log(this.conf.players);
  }

  private createPositions(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const tempPositions: DocumentFragment = document.createDocumentFragment();
    const prohibitedPositions: string[] = this.conf.activePlayer.prohibitedPositions;
    this.surroundingAreas.forEach(area => {
      if (area) {
        if (!prohibitedPositions.includes(area)) {
          this.createAllowedPositionElement(area, tempPositions);
        }
      }
      gameboard.appendChild(tempPositions);
    });
  }

  private movePiece(): void {
    const area: string = this.findGridArea();
    this.configureMovedPieceStyles();
    this.configureGameData(area);
    this.configureMovedPieceData(area);
    this.removeAnimation();
    this.removeGameboardPositions();
    // ... this is the places where further states are determined
    this.resetPieceReferences();
  }

  private configureMovedPieceStyles(): void {
    this.conf.activePiece!.element.classList.remove(this.conf.classes.highlighted, this.conf.classes.notAllowed);
  }

  private configureMovedPieceData(area: string): void {
    this.conf.activePiece!.element.style.gridArea = area;
    this.conf.activePiece!.area = area;
    this.conf.activePiece!.active = false;
  }

  private configureGameData(area: string): void {
    const oldPos = this.conf.activePiece!.area, newPos = area;
    this.configurePlayerPieceData(oldPos, newPos);
    this.configurePlayersProhibitedPosition(oldPos, newPos);
    console.clear();
    console.log(this.conf.players);
  }

  private configurePlayerPieceData(oldPos: string, newPos: string): void {
    const oldPosAreaIndex: number = this.conf.activePlayer.gameboardPieceAreas.indexOf(oldPos);
    this.conf.activePlayer.gameboardPieceAreas.splice(oldPosAreaIndex, 1);
    this.conf.activePlayer.addPieceAreaToGameboardAreas(newPos);
  }

  private configurePlayersProhibitedPosition(oldPos: string, newPos: string): void {
    this.conf.players.forEach(player => {
      const oldPosAreaIndex: number = player.prohibitedPositions.indexOf(oldPos);
      player.prohibitedPositions.splice(oldPosAreaIndex, 1);
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