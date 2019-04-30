import Game from "../Game";
import Settings from "../../settings/Settings";
import Player, { Piece } from "../../Player/Player";
import Helper from "../../Helper/Helper";

export default class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";
  private movePieceHandler: any = this.movePiece.bind(this);
  private animationStartsHandler: any = this.movementStarts.bind(this);
  private animationEndsHandler: any = this.movementEnds.bind(this);
  private removePieceHandler: any = this.initializePieceRemoval.bind(this);

  constructor(protected settings: Settings) {
    super(settings);
  }

  init(): void {
    console.log("phase two started...!");
    this.initializeMovingLogic();
    this.piecesOnTable = (2 * this.settings.piecesForEachPlayer) + 1;
  }

  activatePiece(activatedPiece: Piece): void {
    this.storeActivatedPiece(activatedPiece);
    if (this.activatedPiece.active) {
      this.createGameboardPositions();
    } else {
      this.removeGameboardPositions();
    }
  }

  private initializeMovingLogic(): void {
    this.settings.players.forEach(player => {
      player.pieces.forEach(piece => {
        piece.ontable = false;
        piece.element.addEventListener("click", player.initializePieceHandler);
      });
    });
  }

  private createGameboardPositions(): void {
    this.removeGameboardPositions();
    const temporaryPositions = document.createDocumentFragment();
    const playerProhibitedPositions = this.settings.players.find(player => player.active)!.prohibitedPositions;
    const activePhase = this.settings.phases.find((phase: any) => phase.active);
    const areas = this.getSurroundingPositions();
    areas.forEach(area => {
      if (area) {
        if (!playerProhibitedPositions.includes(area) && activePhase!.fourInRow.exists(area, this.activatedPiece)) {
          this.createAllowedGameboardPositions(area, temporaryPositions);
        }
      }
    });
    this.settings.selectors.gameboard.appendChild(temporaryPositions);
    super.secondPhaseMoveHandler = this.movePieceHandler;
  }

  private createAllowedGameboardPositions(area: string, temporaryPositions: DocumentFragment): void {
    const position = Helper.create({
      type: "div", class: "temporaryPosition", area,
      parent: temporaryPositions
    });
    position.addEventListener("click", this.movePieceHandler);
  }

  private getSurroundingPositions(): (null | string)[] {
    const row = +this.activatedPiece.area[1], column = +this.activatedPiece.area[2];
    const topArea = (row > 1) ? `a${row - 1}${column}` : null;
    const bottomArea = (row < 5) ? `a${row + 1}${column}` : null;
    const leftArea = (column > 1) ? `a${row}${column - 1}` : null;
    const rightArea = (column < 6) ? `a${row}${column + 1}` : null;
    return [topArea, leftArea, bottomArea, rightArea];
  }

  private movePiece(e: any) {
    if (!this.settings.animationInProgress) {
      this.storeSelectedPosition(e.target);
      this.animateMovement();
    }
  }

  private animateMovement() {
    this.calculateTopPosition();
    this.calculateLeftPosition();
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
    this.movePieceWithinGameboard();
    this.resetMovedPiece();
    this.removeGameboardPositions();
    this.animationEnds();
    if (!this.pieceRemovalInProgress) this.switchTurn();
  }

  private movePieceWithinGameboard(): void {
    let area = window.getComputedStyle(this.selectedPosition).gridArea!.split("/")[0].trim();
    if (!area) area = this.selectedPosition.style["gridArea"].split("/")[0].trim();
    const piecePositionBeforeMoving = this.activatedPiece.area;
    this.activatedPiece.element.style.gridArea = area;
    this.configurePiecesData(area);
    this.configureActivatedPiece(area);
    this.checkIfThreeInRowNeedsToBeCreated();
    this.checkIfThreeInRowNeedsToBeRemoved(piecePositionBeforeMoving, area);
  }

  private configurePiecesData(area: string): void {
    const activePlayer = this.settings.players.find(player => player.active);
    const gameboardIndex = activePlayer!.piecePositionsOnGameboard.indexOf(this.activatedPiece.area);
    activePlayer!.piecePositionsOnGameboard.splice(gameboardIndex, 1);
    activePlayer!.piecePositionsOnGameboard.push(area);
  }

  private configureActivatedPiece(area: string): void {
    this.activatedPiece.active = false;
    this.activatedPiece.area = area;
  }

  private checkIfThreeInRowNeedsToBeCreated(): void {
    const activePhase = this.settings.phases.find((phase: any) => phase.active);
    const threeInRowExists = activePhase!.threeInRow.checkIfExists(this.activatedPiece);
    const rowSelectionInProgress = this.threeInRow.rowSelectionInProgress;
    if (threeInRowExists && !rowSelectionInProgress) {
      this.initiateOpponentPieceRemoval();
    }
    if (threeInRowExists && rowSelectionInProgress) {
      this.pieceRemovalInProgress = true;
      this.initiateOpponentPieceRemoval();
    }
    if (!threeInRowExists) this.pieceRemovalInProgress = false;
  }

  private checkIfThreeInRowNeedsToBeRemoved(oldPosition: string, newPosition: string): void {
    const threeInRows = this.activatedPiece.player.threeInRows;
    if (this.activatedPiece.player.threeInRows) {
      threeInRows.forEach((threeInRow, index) => {
        if (threeInRow.positions.includes(oldPosition)) {
          threeInRow.element.remove();
          threeInRows.splice(index, 1);
          this.unmarkPiecesThatAreNotPartOfThreeInRow(threeInRow.positions, oldPosition, newPosition);
        }
      });
    }
  }

  private unmarkPiecesThatAreNotPartOfThreeInRow(threeInRow: string[], oldPos: string, newPos: string) {
    const activePlayer = this.settings.players.find(player => player.active);
    threeInRow.splice(threeInRow.indexOf(oldPos), 1, newPos);
    threeInRow.forEach(position => {
      const piece = activePlayer!.pieces.find(piece => piece.area === position);
      piece!.partOfThreeInRow = false;
    });
  }

  private resetMovedPiece(): void {
    const activePlayer = this.settings.players.find(player => player.active);
    activePlayer!.removeAllHighlighting();
    this.removeActivePlayerClasses(activePlayer);
    this.removeActivePlayerEventListeners();
  }

  private removeActivePlayerClasses(activePlayer: any): void {
    this.activatedPiece.element.classList.add(`player${activePlayer!.numberStringUpperCase}`);
    this.activatedPiece.element.classList.remove("animateMovement");
  }

  private removeActivePlayerEventListeners(): void {
    this.activatedPiece.element.removeEventListener("animationstart", this.animationStartsHandler);
    this.activatedPiece.element.removeEventListener("animationend", this.animationEndsHandler);
  }

  initiateOpponentPieceRemoval(): void {
    this.pieceRemovalInProgress = true;
    const inactivePlayer = this.settings.players.find(player => !player.active);
    inactivePlayer!.pieces.forEach(piece => {
      if (!piece.partOfThreeInRow) {
        piece.element.addEventListener("click", this.removePieceHandler);
        piece.element.classList.add("toBeRemoved");
      }
    });

  }

  private initializePieceRemoval(e: any): void {
    const inactivePlayer: Player = <Player>this.settings.players.find(player => !player.active);
    const piece: Piece = <Piece>inactivePlayer!.pieces.find(piece => piece.element === e.target);
      this.removePiece(piece);
      this.switchTurn();
  }

  private removePiece(piece: Piece) {
    this.removeOpponentPieceEventListeners(piece);
    this.removeOpponentPiece(piece);
    this.removePlayerPieceData(piece.area);
    this.pieceRemovalInProgress = false;
  }

  private removeOpponentPieceEventListeners(piece: Piece): void {
    piece.element.removeEventListener("click", piece.player.initializePieceHandler);
    piece.player.pieces.forEach(piece => {
      piece.element.removeEventListener("click", this.removePieceHandler);
      piece.element.classList.remove("toBeRemoved");
    });
  }

  private removeOpponentPiece(piece: Piece): void {
    const area = piece.area;
    const opponentPieceAreas = piece.player.piecePositionsOnGameboard;
    const opponentProhibitedPositions = piece.player.prohibitedPositions;
    const opponentPieces = piece.player.pieces;
    
    opponentPieceAreas.splice(opponentPieceAreas.indexOf(area), 1);
    opponentProhibitedPositions.splice(opponentProhibitedPositions.indexOf(area), 1);
    piece.element.remove();
    opponentPieces.splice(opponentPieces.indexOf(piece), 1);
  }

  private removePlayerPieceData(area: string): void {
    const activePlayer = this.settings.players.find(player => player.active);
    const activePlayerProhibitedPositions = activePlayer!.prohibitedPositions;
    activePlayerProhibitedPositions.splice(activePlayerProhibitedPositions.indexOf(area), 1);
  }
}
