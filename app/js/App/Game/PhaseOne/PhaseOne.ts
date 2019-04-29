import Game from "../Game";
import Settings from "../../settings/Settings";
import Helper from "../../Helper/Helper";
import { Piece } from "../../Player/Player";

export default class PhaseOne extends Game {
  active: boolean = true;
  readonly phase: string = "one";
  private movePieceHandler: any = this.movePiece.bind(this);
  private animationStartsHandler: any = this.movementStarts.bind(this);
  private animationEndsHandler: any = this.movementEnds.bind(this);

  constructor(protected settings: Settings) {
    super(settings);
  }

  activatePiece(activatedPiece: Piece): void {
    this.storeActivatedPiece(activatedPiece);
    if (this.activatedPiece.active) {
      this.createGameboardPositions();
    } else {
      this.removeGameboardPositions();
    }
  }

  private createGameboardPositions(): void {
    const temporaryPositionAmount = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition")).length;
    if (!temporaryPositionAmount) {
      const temporaryPositions = document.createDocumentFragment();
      const playerProhibitedPositions = this.settings.players.find(player => player.active)!.prohibitedPositions;
      for (let row = 1; row <= 5; row++) {
        for (let column = 1; column <= 6; column++) {
          const area = `a${row}${column}`;
          if (playerProhibitedPositions.includes(area)) continue;
          this.createAllowedGameboardPositions(area, temporaryPositions);
        }
        this.settings.selectors.gameboard.appendChild(temporaryPositions);
        super.firstPhaseMoveHandler = this.movePieceHandler;
      }
    }
  }

  private createAllowedGameboardPositions(area: string, temporaryPositions: DocumentFragment): void {
    const position = Helper.create({
      type: "div", class: "temporaryPosition", area,
      parent: temporaryPositions
    });
    position.addEventListener("click", this.movePieceHandler);
  }

  private movePiece(e: any): void {
    if (!this.settings.animationInProgress) {
      this.storeSelectedPosition(e.target);
      this.animateMovement();
    }
  }

  private movePieceToGameboard(): void {
    this.settings.selectors.gameboard.append(this.activatedPiece.element);
    const area = window.getComputedStyle(this.selectedPosition).gridArea!.split("/")[0].trim();
    this.activatedPiece.element.style.gridArea = area;
    this.configureActivatedPiece(area);
    this.configurePiecesData(area);
  }

  private configureActivatedPiece(area: string): void {
    this.activatedPiece.ontable = true;
    this.activatedPiece.active = false;
    this.activatedPiece.area = area;
  }

  private configurePiecesData(area: string): void {
    this.piecesOnTable++;
    const activePlayer = this.settings.players.find(player => player.active);
    const inactivePlayer = this.settings.players.find(player => !player.active);
    activePlayer!.piecePositionsOnGameboard.push(area);
    activePlayer!.prohibitedPositions.push(area);
    inactivePlayer!.prohibitedPositions.push(area);
  }

  private resetMovedPiece(): void {
    const activePlayer = this.settings.players.find(player => player.active);
    activePlayer!.removeAllHighlighting();
    this.removeActivePlayerClasses(activePlayer);
    this.removeActivePlayerEventListeners(activePlayer);
  }

  private removeActivePlayerClasses(activePlayer: any): void {
    this.activatedPiece.element.classList.add(`player${activePlayer!.numberStringUpperCase}`);
    this.activatedPiece.element.classList.remove("animateMovement");
  }

  private removeActivePlayerEventListeners(activePlayer: any): void {
    this.activatedPiece.element.removeEventListener("click", activePlayer!.initializePieceHandler);
    this.activatedPiece.element.removeEventListener("animationstart", this.animationStartsHandler);
    this.activatedPiece.element.removeEventListener("animationend", this.animationEndsHandler);
  }

  private animateMovement(): void {
    this.calculateTopPosition();
    this.calculateLeftPosition();
    this.setAnimationTime(); // Development setting
    this.attachAnimation(); 
  }

  private attachAnimation(): void {
    this.activatedPiece.element.classList.add("animateMovement");
    this.activatedPiece.element.addEventListener("animationstart", this.animationStartsHandler);
    this.activatedPiece.element.addEventListener("animationend", this.animationEndsHandler);
  }

  private movementStarts(): void {
    this.animationStarts();
  }

  private movementEnds(): void {
    this.movePieceToGameboard();
    this.resetMovedPiece();
    this.removeGameboardPositions();
    this.switchTurn();
    this.animationEnds();
  }

  init(): void {
    this.activatePlayer();
  }
}