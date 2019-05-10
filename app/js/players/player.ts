import { Helper } from "../conf/helper";
import { Settings } from "../conf/settings";
import { Piece } from "./piece";
import { Configuration } from "../conf/configuration";


export class Player {
  active: boolean = false;
  readonly name: string;
  readonly number: number;
  readonly numberString: string;
  readonly numberStringUpperCase: string;
  readonly piecesContainerElement: HTMLElement;

  readonly pieces: Piece[] = [];
  readonly gameboardPieceAreas: string[] = [];
  
  prohibitedPositions: string[] = [];
  prohibitedPositionsMadeByRows: string[] = [];

  private settings: Settings = Settings.instance;
  private conf: Configuration = Configuration.instance;

  constructor(name: string, number: number, numberString: string) {
    this.name = name;
    this.number = number;
    this.numberString = numberString;
    this.numberStringUpperCase = Helper.upperCaseFirstLetter(numberString);
    this.piecesContainerElement = <HTMLElement>document.querySelector(
      this.conf.selectors[`player${this.numberStringUpperCase}PiecesContainer`]
    );
    this.createPieces();
  }

  addPieceAreaToGameboardAreas(area: string): void {
    this.gameboardPieceAreas.push(area);
    this.updatePlayersGameboardPositions();
  }

  private updatePlayersGameboardPositions(): void {
    const thisPlayer: Player = this;
    const opponent: Player = <Player>this.conf.players.find(player => player !== this);
    this.conf.players.forEach(player => {
      player.prohibitedPositions = this.prohibitedPositionsMadeByRows.concat(
        thisPlayer.gameboardPieceAreas,
        opponent.gameboardPieceAreas,
      );
    });
  }

  private createPieces(): void {
    for (let pieceNumber = 1; pieceNumber <= this.settings.piecesForEachPlayer; pieceNumber++) {
      const pieceId = `p${this.number}_${pieceNumber}`;
      const pieceElement = Helper.create({
        type: "div", id: pieceId, class: this.conf.classes.piece,
        text: `${pieceNumber}`, area: pieceId,
        parent: this.piecesContainerElement
      });
      this.pieces.push(new Piece(pieceId, this, pieceElement));
    }
  }
}