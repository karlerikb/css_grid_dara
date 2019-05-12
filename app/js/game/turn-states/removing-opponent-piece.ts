import { State } from "../../conf/interfaces";
import { GameTurn } from "../game-turn";
import { Configuration } from "../../conf/configuration";
import { Helper } from "../../conf/helper";
import { Piece } from "../../players/piece";

export class RemovingOpponentPiece implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameTurn: GameTurn) {
  }

  enablePieceActivation(): void {
    throw new Error("Cannot select a player player piece when an opponent piece removal is in progress!");
  }
  enablePieceHighlight(): void {
    throw new Error("Cannot activate a player piece for movement when an opponent piece removal is in progress!");
  }
  movingPiece(): void {
    throw new Error("Cannot move a player piece when an opponent pieces removal is in progress!");
  }
  removingOpponentPiece(): void {
    const [areas]: string[][] = this.conf.activePhase.threeInRows;
    this.determineRowDimension(areas);
    this.configurePlayerPieces(areas);
    this.enableOpponentPieceRemoval();
  }

  private determineRowDimension(areas: string[]): void {
    const [firstPos, secondPos, thirdPos]: string[] = areas;
    if (firstPos[1] === secondPos[1]) this.createHorizontalIndication(areas);
    if (firstPos[2] === secondPos[2]) this.createVerticalIndication(areas);
  }

  private createIndicationElement(area: string, areas: string[]): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const numberString: string = this.conf.activePlayer.numberStringUpperCase;
    const indicationElement: HTMLElement = Helper.create({
      type: "div", class: `player${numberString} threeInRow`, area,
      parent: gameboard
    });
    this.conf.activePlayer.threeInRows.push({
      areas, element: indicationElement
    });
  }

  private createHorizontalIndication(areas: string[]): void {
    const [firstPos, secondPos, thirdPos]: string[] = areas;
    const area = `${thirdPos} / ${firstPos} / ${firstPos} / ${thirdPos}`;
    this.createIndicationElement(area, areas);
  }

  private createVerticalIndication(areas: string[]): void {
    const [firstPos, secondPos, thirdPos]: string[] = areas;
    const area = `${firstPos} / ${firstPos} / ${thirdPos} / ${thirdPos}`;
    this.createIndicationElement(area, areas);
  }

  private configurePlayerPieces(areas: string[]): void {
    this.configurePlayerPieceStyles();
    this.configurePiecesAsBeingPartOfThreeInRow(areas);
  }

  private configurePlayerPieceStyles(): void {
    this.conf.activePlayer.pieces.forEach(piece => {
      piece.element.classList.remove(this.conf.classes.playerTurn);
      piece.element.classList.add(this.conf.classes.notAllowed);
      piece.element.classList.add(this.conf.classes.dehighlighted);
    });
  }

  private configurePiecesAsBeingPartOfThreeInRow(areas: string[]): void {
    areas.forEach(area => {
      const piece: Piece = <Piece>this.conf.activePlayer.pieces.find(piece => piece.area === area);
      piece.partOfThreeInRow = true;
    });
  }

  private enableOpponentPieceRemoval(): void {
    this.conf.inactivePlayer.pieces.forEach(piece => {
      if (piece.partOfThreeInRow) {
        piece.element.classList.add(this.conf.classes.notAllowed);
      } else {
        piece.element.classList.add(this.conf.classes.removePiece);
        piece.element.addEventListener("click", this.conf.eventListeners.removingOpponentPiece);
      }
    });
  }
}