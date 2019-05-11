import { Configuration } from "../../conf/configuration";
import { GameboardAreas } from "../../conf/custom-types";

export class FourInRow {
  private conf: Configuration = Configuration.instance;
  private area: string = "";

  constructor() {
  }

  exists(area: string): boolean {
    this.area = area;
    return this.fourInRowExists();
  }

  private fourInRowExists(): boolean {
    const horizontalRowExists: boolean = this.searchHorizontally();
    const verticalRowExists: boolean = this.searchVertically();
    return horizontalRowExists || verticalRowExists;
  }

  private searchHorizontally(): boolean {
    const reach: GameboardAreas = this.getReachOfSevenHorizontally();
    const reachValidation: number[] = this.getReachValidation(reach);
    const validCount: number = reachValidation.reduce((valid, area) => valid + area);
    if (validCount > 3) return this.divideReachIntoFours(reachValidation);
    return false;
  }

  private searchVertically(): boolean {
    const reach: GameboardAreas = this.getReachOfSevenVertically();
    const reachValidation: number[] = this.getReachValidation(reach);
    const validCount: number = reachValidation.reduce((valid, area) => valid + area);
    if (validCount > 3) return this.divideReachIntoFours(reachValidation);
    return false;
  }

  private getReachOfSevenHorizontally(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      (column < 4) ? null : `a${row}${column - 3}`,
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      this.area,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`,
      (column > 3) ? null : `a${row}${column + 3}`
    ];
    return reach;
  }

  private getReachOfSevenVertically(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      (row < 4) ? null : `a${row - 3}${column}`,
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      this.area,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`,
      (row > 3) ? null : `a${row + 3}${column}`
    ];
    return reach;
  }

  private getReachValidation(reach: GameboardAreas): number[] {
    const areas: string[] = this.conf.activePlayer.gameboardPieceAreas;
    const reachValidation: number[] = reach.map(area => {
      if (!area) return 0;
      if (area === this.conf.activePiece!.area) return 0;
      if (area === this.area) return 1;
      if (areas.includes(area)) return 1;
      return 0;
    });
    return reachValidation;
  }

  private divideReachIntoFours(reachValidation: number[]): boolean {
    for (let i = 0; i < 4; i++) {
      const fourReachValidation: number[] = reachValidation.slice(i, i + 4);
      const validCount = fourReachValidation.reduce((valid, area) => valid + area);
      if (validCount === 4) return true;
    }
    return false;
  }
}