import { Player } from "./player";

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