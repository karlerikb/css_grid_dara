import { Game } from "./game";
import { Player } from "../players/player";
import { Piece } from "../players/piece";
import { Helper } from "../conf/helper";

export class PhaseOne extends Game {
  active: boolean = true;
  readonly phase: string = "one";

  constructor() {
    super();
  }

  init(): void {
    this.activatePlayer();
    this.activateGameTurn();
  }

  activatePiece(target: EventTarget): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const activatedPiece: Piece = <Piece>activePlayer.pieces.find(piece => piece.element === target);
    this.conf.activePiece = activatedPiece;
    this.gameTurn.state.enablePieceHighlight();
  }

  createGameboardPositions(): void {
    const tempPositions: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.temporaryPositions);
    console.log(tempPositions.length);
    if (tempPositions.length === 0) {
      console.log("phase " + this.phase + " creating positions...");
      this.createPositions();
    } else {
      console.log("phase " + this.phase + " removing positions...");
    }
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
}