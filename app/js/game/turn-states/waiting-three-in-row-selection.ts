import { Configuration } from "../../conf/configuration";
import { GameTurn } from "../game-turn";
import { State } from "../../conf/interfaces";
import { Helper } from "../../conf/helper";

export class WaitingThreeInRowSelection implements State {
  private conf: Configuration = Configuration.instance;

  constructor(public gameTurn: GameTurn) {
  }

  enablePieceActivation(): void {
    throw new Error("Cannot activate a player piece when selecting a three-in-row!");
  }

  enablePieceHighlight(): void {
    throw new Error("Cannot highlight pieces when selecting a three-in-row!");
  }

  movingPiece(): void {
    throw new Error("Cannot move a piece when selecting a three-in-row!");
  }

  removingOpponentPiece(): void {
    throw new Error("Cannot remove an opponent piece just yet! Choose a three-in-row first!");
  }

  enableMultipleThreeInRowSelection(): void {
    this.disableOpponentPieces();
    this.determineRowsDimensions();
  }

  private disableOpponentPieces(): void {
    this.conf.inactivePlayer.pieces.forEach(piece => {
      piece.element.classList.add(this.conf.classes.notAllowed);
      piece.element.classList.add(this.conf.classes.dehighlighted);
    });
  }

  private determineRowsDimensions(): void {
    this.conf.activePhase.threeInRows.forEach(threeInRow => {
      const [firstPos, secondPos, thirdPos] = threeInRow;
      if (firstPos[1] === secondPos[1]) this.createHorizontalIndication(threeInRow);
      if (firstPos[2] === secondPos[2]) this.createVerticalIndication(threeInRow);
    });
  }

  private createIndicationElement(area: string, areas: string[]): void {
    const gameboard: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameboard);
    const numberString: string = this.conf.activePlayer.numberStringUpperCase;
    const indicationElement: HTMLElement = Helper.create({
      type: "div", class: `player${numberString} ${this.conf.classes.threeInRow} ${this.conf.classes.selectableRow}`, 
      area, parent: gameboard
    });
    this.conf.activePhase.temporaryThreeInRows.push({
      areas, element: indicationElement
    });
    this.configureIndicationElements(indicationElement);
  }

  private configureIndicationElements(indicationElement: HTMLElement): void {
    indicationElement.addEventListener("click", this.conf.eventListeners.initializingRowSelection);
    indicationElement.addEventListener("dblclick", this.conf.eventListeners.finalizingRowSelection);
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
}