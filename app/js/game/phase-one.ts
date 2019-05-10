import { Game } from "./game";
import { Piece } from "../players/piece";
import { ThreeInRow } from "./rows/three-in-row";

export class PhaseOne extends Game {
  active: boolean = true;
  readonly phase: string = "one";
  private threeInRow = new ThreeInRow();

  constructor() {
    super();
  }

  init(): void {
    this.activatePlayer();
  }

  finalizeMovement(): void {
    this.movePiece();
    this.switchTurn();
  }

  createGameboardPositions(): void {
    const tempPositions: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.temporaryPositions);
    if (tempPositions.length === 0) {
      this.createPositions();
    }
  }

  configureProhibitedPositions(): void {
    this.threeInRow.prohibited();
  }

  private createPositions(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const tempPositions: DocumentFragment = document.createDocumentFragment();
    const prohibitedPositions: string[] = this.conf.activePlayer.prohibitedPositions;
    for (let row = 1; row <= 5; row++) {
      for (let column = 1; column <= 6; column++) {
        const area: string = `a${row}${column}`;
        if (prohibitedPositions.includes(area)) continue;
        this.createAllowedPositionElement(area, tempPositions);
      }
    }
    gameboard.appendChild(tempPositions);
  }

  private movePiece(): void {
    const area: string = this.findGridArea();
    this.movePieceToGameboard();
    this.configureMovedPieceStyles();
    this.configureMovedPieceData(area);
    this.configureGameData(area);
    this.removeAnimation();
    this.removeGameboardPositions();
    this.resetPieceReferences();
  }

  private movePieceToGameboard(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    gameboard.append(this.conf.activePiece!.element);
  }

  private configureGameData(area: string) {
    this.piecesOnGameboard.push(<Piece>this.conf.activePiece);
    this.conf.activePlayer.addPieceAreaToGameboardAreas(area);
  }

  private configureMovedPieceData(area: string): void {
    this.conf.activePiece!.element.style.gridArea = area;
    this.conf.activePiece!.area = area;
    this.conf.activePiece!.movedToTable = true;
    this.conf.activePiece!.active = false;
  }

  private configureMovedPieceStyles(): void {
    const playerClass: string = `player${this.conf.activePiece!.player.numberStringUpperCase}`;
    this.conf.activePiece!.element.classList.remove(this.conf.classes.highlighted, this.conf.classes.notAllowed);
    this.conf.activePiece!.element.classList.add(playerClass);
  }
}