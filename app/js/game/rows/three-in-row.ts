import { Configuration } from "../../conf/configuration";
import { GameboardAreas } from "../../conf/custom-types";

export class ThreeInRow {
  private conf: Configuration = Configuration.instance;

  constructor() {
  }

  prohibited(): void {
    this.searchHorizontally();
    this.searchVertically();
  }

  private searchHorizontally(): void {
    const areas: string[] = this.conf.activePlayer.gameboardPieceAreas;
    areas.forEach(area => {
      const reach: GameboardAreas = this.getReachOfFiveHorizontally(area);
      this.analyzeReach(reach, areas);
    });
  }

  private searchVertically(): void {
    const areas: string[] = this.conf.activePlayer.gameboardPieceAreas;
    areas.forEach(area => {
      const reach: GameboardAreas = this.getReachOfFiveVertically(area);
      this.analyzeReach(reach, areas);
    });
  }

  private analyzeReach(reach: GameboardAreas, areas: string[]): void {
    const reachValidation: number[] = this.getReachValidation(reach, areas);
    const validCount: number = reachValidation.reduce((valid, area) => valid + area);
    if (validCount > 1) this.divideReachIntoThrees(reach);
  }

  private getReachOfFiveHorizontally(area: string): GameboardAreas {
    const row: number = +area[1], column: number = +area[2];
    const reach: GameboardAreas = [
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      area,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`
    ];
    return reach;
  }
  
  private getReachOfFiveVertically(area: string): GameboardAreas {
    const row: number = +area[1], column: number = +area[2];
    const reach: GameboardAreas = [
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      area,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`
    ];
    return reach;
  }

  private getReachValidation(reach: GameboardAreas, areas: string[]): number[] {
    const reachValidation: number[] = reach.map(area => {
      if (!area) return 0;
      if (areas.includes(area)) return 1;
      return 0;
    });
    return reachValidation;
  }

  private divideReachIntoThrees(reach: GameboardAreas): void {
    const areas: string[] = this.conf.activePlayer.gameboardPieceAreas;
    for (let i = 0; i < 3; i++) {
      const threeReachAreas: GameboardAreas = reach.slice(i, i + 3);
      const threeReachValidation: number[] = this.getReachValidation(threeReachAreas, areas);
      const validCount: number = threeReachValidation.reduce((valid, area) => valid + area);
      if (validCount === 2) this.findProhibitedPosition(threeReachAreas);
    }
  }

  private findProhibitedPosition(threeReachAreas: GameboardAreas): void {
    const prohibited: string[] = this.conf.activePlayer.prohibitedAreasMadeByRows;
    const areas: string[] = this.conf.activePlayer.gameboardPieceAreas;
    threeReachAreas.forEach(area => {
      if (area && !prohibited.includes(area) && !areas.includes(area)) {
        this.conf.activePlayer.addAreaToProhibitedAreas(area);
      }
    });
  }
}