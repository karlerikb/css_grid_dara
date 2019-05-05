import { Configuration } from "../conf/configuration";
import { Helper } from "../conf/helper";
import { Settings } from "../conf/settings";

export class Player {
  active: boolean = false;
  readonly name: string;
  readonly number: number;
  readonly numberString: string;
  readonly numberStringUpperCase: string;
  readonly piecesContainerElement: HTMLElement;

  private _pieces: Piece[] = [];

  private conf: Configuration;
  private settings: Settings;

  constructor(name: string, number: number, numberString: string, settings: Settings, conf: Configuration) {
    this.name = name;
    this.number = number;
    this.numberString = numberString;
    this.numberStringUpperCase = Helper.upperCaseFirstLetter(numberString);
    this.piecesContainerElement = <HTMLElement>document.querySelector(`.player${this.numberStringUpperCase}.piecesContainer`);
    this.conf = conf;
    this.settings = settings;
    this.createPieces();
    console.log(this.piecesContainerElement);
  }

  private createPieces(): void {
    for (let pieceNumber = 1; pieceNumber <= this.settings.piecesForEachPlayer; pieceNumber++) {
      const pieceId = `p${this.number}_${pieceNumber}`;
      const pieceElement = Helper.create({
        type: "div", id: pieceId, class: "piece",
        text: `${pieceNumber}`, area: pieceId,
        parent: this.piecesContainerElement
      });
      this.pieces.push(new Piece(pieceId, this, pieceElement));
    }
  }

  public get pieces(): Piece[] {
    return this._pieces;
  }
}

export class Piece {
  active: boolean = false;
  movedToTable: boolean = false;
  partOfThreeInRow: boolean = false;
  readonly id: string;
  readonly player: Player;
  readonly element: HTMLElement;
  private _area: string = "";

  constructor(id: string, player: Player, element: HTMLElement) {
    this.player = player;
    this.id = id;
    this.element = element;
  }

  get area(): string {
    return this._area;
  }

  set area(areaStr: string) {
    if (
      areaStr.length === 3 && 
      areaStr[0] === "a" && 
      +areaStr[1] >= 1 && +areaStr[1] <= 5 &&
      +areaStr[2] >= 1 && +areaStr[2] <= 6) {
      this._area = areaStr;
    }
  }
}