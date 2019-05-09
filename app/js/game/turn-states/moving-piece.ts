import { State } from "../../conf/interfaces";
import { GameTurn } from "../game-turn";
import { Configuration } from "../../conf/configuration";
import { Settings } from "../../conf/settings";

export class MovingPieceState implements State {
  private conf: Configuration = Configuration.instance;
  private settings: Settings = Settings.instance;
  
  constructor(public gameTurn: GameTurn) {
  }
  
  enablePieceActivation(): void {
    throw new Error("Gamepiece is moving, cannot activate it!");
  }

  enablePieceHighlight(): void {
    throw new Error("Gamepiece is moving, cannot highlight it!");
  }
  
  movingPiece(): void {
    this.disablePieceActivation();
    this.disablePositionSelection();
    this.configureAnimation();
  }
  
  private disablePieceActivation(): void {
    this.conf.activePiece!.player.pieces.forEach(piece => {
      piece.element.removeEventListener("click", this.conf.eventListeners.activatingPiece);
      piece.element.classList.add("notAllowed");
    });
  }

  private disablePositionSelection(): void {
    const tempPositions: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.temporaryPositions);
    for (let position of tempPositions) {
      position.removeEventListener("click", this.conf.eventListeners.movingPiece);
      position.classList.add("notAllowed");
    }
  }

  private configureAnimation(): void {
    this.calculateTopPosition();
    this.calculateLeftPosition();
    this.setAnimationLength();
    this.attachAnimation();
  }

  private calculateTopPosition(): void {
    const root: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.root);
    const activatedPieceTop: number = this.conf.activePiece!.element.getBoundingClientRect().top;
    const selectedPositionTop: number = (<HTMLElement>this.conf.selectedPosition).getBoundingClientRect().top;
    const top = selectedPositionTop - activatedPieceTop;
    root.style.setProperty("--targetPositionTop", `${top}px`);
  }

  private calculateLeftPosition(): void {
    const root: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.root);
    const activatedPieceLeft: number = this.conf.activePiece!.element.getBoundingClientRect().left;
    const selectedPositionLeft: number = (<HTMLElement>this.conf.selectedPosition).getBoundingClientRect().left;
    const left = selectedPositionLeft - activatedPieceLeft;
    root.style.setProperty("--targetPositionLeft", `${left}px`);
  }

  private setAnimationLength(): void {
    const root: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.root);
    root.style.setProperty("--animationTime", this.settings.animationTime);
  }

  private attachAnimation(): void {
    this.conf.activePiece!.element.classList.add("animateMovement");
    this.conf.activePiece!.element.addEventListener("animationend", this.conf.eventListeners.movementEnds);
  }
}