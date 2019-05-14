import { Game } from "./game";
import { Piece } from "../players/piece";
import { PlayerThreeInRow } from "../conf/custom-types";
import { Hints } from "../hints/hints";

export class PhaseOne extends Game {
  active: boolean = true;
  temporaryThreeInRows: PlayerThreeInRow[] = [];
  readonly name: string = "one";

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

  removeOpponentPiece(target: EventTarget): void {
    throw new Error("Cannot remove opponent pieces in phase one!");
  }

  initializeRowSelection(target: EventTarget): void {
    throw new Error("Cannot initialize three-in-row selection in phase one!");
  }

  finalizeRowSelection(target: EventTarget): void {
    throw new Error("Cannot finalize three-in-row selection in phase one!");
  }

  private createPositions(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const tempPositions: DocumentFragment = document.createDocumentFragment();
    const prohibitedAreas: string[] = this.conf.activePlayer.prohibitedAreas;
    for (let row = 1; row <= 5; row++) {
      for (let column = 1; column <= 6; column++) {
        const area: string = `a${row}${column}`;
        if (prohibitedAreas.includes(area)) {
          if (this.conf.activePlayer.prohibitedAreasMadeByRows.length > 0) {
            Hints.instance.setNoThreeInRowAllowedDetail();
          }
          continue;
        }
        this.createAllowedPositionElement(area, tempPositions);
      }
    }
    gameboard.appendChild(tempPositions);
  }

  private movePiece(): void {
    this.move();
    this.configure(this.gridArea);
    this.reset();
  }

  private move(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    gameboard.append(this.conf.activePiece!.element);
  }

  private configure(area: string): void {
    this.configureMovedPieceStyles();
    this.configureMovedPieceData(area);
    this.configureGameData(area);
  }

  private configureGameData(area: string) {
    this.piecesOnGameboard.push(<Piece>this.conf.activePiece);
    this.conf.activePlayer.addAreaToGameboardAreas(area);
    this.threeInRow.prohibited();
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

  private reset(): void {
    this.removeAnimation();
    this.removeGameboardPositions();
    this.resetPieceReferences();
  }
}