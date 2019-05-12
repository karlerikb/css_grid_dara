import { Helper } from "../conf/helper";
import { Settings } from "../conf/settings";
import { Piece } from "./piece";
import { Configuration } from "../conf/configuration";
import { PlayerThreeInRow } from "../conf/custom-types";


export class Player {
  active: boolean = false;
  readonly name: string;
  readonly number: number;
  readonly numberString: string;
  readonly numberStringUpperCase: string;
  readonly piecesContainerElement: HTMLElement;

  readonly pieces: Piece[] = [];
  readonly gameboardPieceAreas: string[] = [];
  readonly threeInRows: PlayerThreeInRow[] = [];
  
  prohibitedAreas: string[] = [];
  prohibitedAreasMadeByRows: string[] = [];

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

  addAreaToGameboardAreas(area: string): void {
    this.gameboardPieceAreas.push(area);
    this.updatePlayersGameboardAreas(area);
  }

  addAreaToProhibitedAreas(area: string): void {
    this.prohibitedAreasMadeByRows.push(area);
    this.prohibitedAreasMadeByRows.forEach(area => {
      if (!this.prohibitedAreas.includes(area)) this.prohibitedAreas.push(area);
    });
  }

  configureAreasWhenMoving(oldPos: string, newPos: string): void {
    const oldPosAreaIndex: number = this.gameboardPieceAreas.indexOf(oldPos);
    this.gameboardPieceAreas.splice(oldPosAreaIndex, 1);
    this.addAreaToGameboardAreas(newPos);
    this.configureProhibitedPositionWhenMoving(oldPos);
  }

  removePiece(piece: Piece): void {
    this.removePieceElement(piece);
    this.removePieceAreas(piece.area);
    this.removePieceObject(piece);
  }

  private updatePlayersGameboardAreas(area: string): void {
    const thisPlayer: Player = this;
    const opponent: Player = <Player>this.conf.players.find(player => player !== this);
    thisPlayer.prohibitedAreas.push(area);
    opponent.prohibitedAreas.push(area);
  }

  private configureProhibitedPositionWhenMoving(oldPos: string): void {
    this.conf.players.forEach(player => {
      const oldPosAreaIndex: number = player.prohibitedAreas.indexOf(oldPos);
      player.prohibitedAreas.splice(oldPosAreaIndex, 1);
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

  private removePieceElement(piece: Piece): void {
    piece.element.remove();
  }

  private removePieceAreas(area: string): void {
    this.conf.players.forEach(player => {
      const gameboardAreaIndex: number = player.gameboardPieceAreas.indexOf(area);
      const prohibitedAreaIndex: number = player.prohibitedAreas.indexOf(area);
      player.gameboardPieceAreas.splice(gameboardAreaIndex, 1);
      player.prohibitedAreas.splice(prohibitedAreaIndex, 1);
    });
  }

  private removePieceObject(piece: Piece): void {
    const pieceIndex: number = this.pieces.indexOf(piece);
    this.pieces.splice(pieceIndex, 1);
  }
}