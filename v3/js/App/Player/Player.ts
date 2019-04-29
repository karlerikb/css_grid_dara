import Helper from "../Helper/Helper";
import Settings from "../settings/Settings";

export default class Player {
  active: boolean = false;
  readonly name: string;
  readonly number: number;
  readonly numberString: string;
  readonly piecesContainer: HTMLElement;
  readonly numberStringUpperCase: string;
  readonly initializePieceHandler: any = this.initializePieceActivation.bind(this);

  private settings: Settings = <Settings>{};
  public pieces: Piece[] = [];
  public piecePositionsOnGameboard: string[] = [];
  public prohibitedPositions: string[] = [];
  public threeInRows: any[] = [];

  constructor(name: string, number: number, numberString: string, settings: Settings) {
    this.name = name;
    this.number = number;
    this.numberString = numberString;
    this.numberStringUpperCase = <string>Helper.upperCaseFirstLetter(numberString);
    this.piecesContainer = <HTMLElement>document.querySelector(`.player${this.numberStringUpperCase}.piecesContainer`);
    this.settings = settings;
    this.createPlayerPieces();
  }

  private createPlayerPieces(): void {
    for (let pieceNumber = 1; pieceNumber <= this.settings.piecesForEachPlayer; pieceNumber++) {
      const pieceId = `p${this.number}_${pieceNumber}`;
      const gamePiece = Helper.create({
        type: "div", id: pieceId, class: "piece",
        text: `${pieceNumber}`, area: pieceId,
        parent: this.piecesContainer
      });
      gamePiece.addEventListener("click", this.initializePieceHandler);
      this.pieces.push(new Piece(this, pieceId, gamePiece));
    }
  }

  private initializePieceActivation(e: any): void {
    const activePhase: any = this.settings.phases.find((phase: any) => phase.active);
    const activatedPiece = this.pieces.find(piece => piece.element === e.target);
    if (this.active && !this.settings.animationInProgress && !activePhase.pieceRemovalInProgress) {
      this.activatePiece(<Piece>activatedPiece);
      activePhase!.activatePiece(<Piece>activatedPiece);
    }
  }

  private deactivateAllPieces(): void {
    this.pieces.forEach(piece => piece.active = false);
  }

  private activatePiece(activatedPiece: Piece): void {
    if (activatedPiece.active) {
      this.deactivateAllPieces();
      this.removeAllHighlighting();
    } else {
      this.deactivateAllPieces();
      activatedPiece.active = true;
      this.highlightPiece(activatedPiece);
      this.dehighlightPieces();
    }
  }

  private highlightPiece(piece: Piece): void {
    piece.element.classList.add("active");
    if (piece.element.classList.contains("inactive")) {
      piece.element.classList.remove("inactive");
    }
  }

  private dehighlightPieces(): void {
    this.pieces.forEach(piece => {
      if (!piece.active && !piece.ontable) {
        piece.element.classList.add("inactive");
        if (piece.element.classList.contains("active")) {
          piece.element.classList.remove("active");
        }
      }
    });
  }

  removeAllHighlighting(): void {
    this.pieces.forEach(piece => {
      piece.element.classList.remove("active");
      piece.element.classList.remove("inactive");
    });
  }
}


export class Piece {
  active: boolean = false;
  ontable: boolean = false;
  partOfThreeInRow: boolean = false;
  readonly player: Player;
  readonly id: string;
  readonly element: HTMLElement;
  private _area: string = "";

  constructor(player: Player, id: string, element: HTMLElement) {
    this.player = player;
    this.id = id;
    this.element = element;
  }

  get area(): string {
    return this._area;
  }

  set area(value: string) {
    if (
      value.length === 3 && 
      value[0] === "a" && 
      +value[1] >= 1 && +value[1] <= 5 &&
      +value[2] >= 1 && +value[2] <= 6) {
      this._area = value;
    }
  }
}