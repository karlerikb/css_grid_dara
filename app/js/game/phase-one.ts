import { Game } from "./game";
import { Helper } from "../conf/helper";
import { Piece } from "../players/piece";

export class PhaseOne extends Game {
  active: boolean = true;
  readonly phase: string = "one";

  constructor() {
    super();
  }

  init(): void {
    this.activatePlayer();
  }

  createGameboardPositions(): void {
    const tempPositions: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.temporaryPositions);
    if (tempPositions.length === 0) {
      this.createPositions();
    }
  }

  finalizeMovement(): void {
    this.movePiece();
    this.removeAnimation();
    this.removeGameboardPositions();
    this.resetPieceReferences();
    this.switchTurn();
  }

  private createPositions(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const tempPositions: DocumentFragment = document.createDocumentFragment();
    const prohibitedPositions: string[] = this.conf.activePiece!.player.prohibitedPositions;
    for (let row = 1; row <= 5; row++) {
      for (let column = 1; column <= 6; column++) {
        const area: string = `a${row}${column}`;
        if (prohibitedPositions.includes(area)) continue;
        this.createAllowedPositionElement(area, tempPositions);
      }
    }
    gameboard.appendChild(tempPositions);
  }

  private createAllowedPositionElement(area: string, documentFragment: DocumentFragment): void {
    const position: HTMLElement = Helper.create({
      type: "div", class: this.conf.classes.temporaryPosition, area,
      parent: documentFragment
    });
    position.addEventListener("click", this.conf.eventListeners.movingPiece);
  }

  private resetPieceReferences(): void {
    this.conf.activePiece = null;
    this.conf.selectedPosition = null;
  }

  private removeAnimation(): void {
    this.conf.activePiece!.element.classList.remove("animateMovement");
    this.conf.activePiece!.element.removeEventListener("animationend", this.conf.eventListeners.movementEnds);
  }

  private movePiece(): void {
    const area: string = this.findGridArea();
    this.movePieceToGameboard();
    this.configureMovedPieceStyles();
    this.configureMovedPieceData(area);
    this.configureGameData(area);
  }

  private movePieceToGameboard(): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    gameboard.append(this.conf.activePiece!.element);
  }

  private findGridArea(): string {
    const computedStyle: string | null = window.getComputedStyle(<Element>this.conf.selectedPosition).gridArea;
    let area: string;
    if (computedStyle) {
      area = computedStyle.split("/")[0].trim();
    } else {
      area = (<HTMLElement>this.conf.selectedPosition).style.gridArea!.split("/")[0].trim();
    }
    return area;
  }

  private configureGameData(area: string) {
    this.piecesOnGameboard.push(<Piece>this.conf.activePiece);
    this.conf.activePiece!.player.addPieceAreaToGameboardAreas(area);
  }

  private configureMovedPieceData(area: string): void {
    this.conf.activePiece!.element.style.gridArea = area;
    this.conf.activePiece!.area = area;
    this.conf.activePiece!.movedToTable = true;
    this.conf.activePiece!.active = false;
  }

  private configureMovedPieceStyles(): void {
    const playerClass: string = `player${this.conf.activePiece!.player.numberStringUpperCase}`;
    this.conf.activePiece!.element.classList.remove("active", "notAllowed");
    this.conf.activePiece!.element.classList.add(playerClass);
  }
}