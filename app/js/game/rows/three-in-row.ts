import { Configuration } from "../../conf/configuration";
import { GameboardAreas, Reach } from "../../conf/custom-types";
import { Piece } from "../../players/piece";

export class ThreeInRow {
  threeInRows: string[][] = [];
  private conf: Configuration = Configuration.instance;
  private playerAreas: string[] = [];
  private area: string = "";

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

  exists(): boolean {
    this.setProperties();
    return this.threeInRowsExist();
  }

  private setProperties(): void {
    this.playerAreas = this.conf.activePlayer.gameboardPieceAreas;
    this.area = this.conf.activePiece!.area;
    this.setThreeInRows();
  }

  private setThreeInRows(): void {
    if (this.topReach) this.threeInRows.push(this.topReach);
    if (this.leftReach) this.threeInRows.push(this.leftReach);
    if (this.bottomReach) this.threeInRows.push(this.bottomReach);
    if (this.rightReach) this.threeInRows.push(this.rightReach);
    if (this.middleTopAndBottomReach) this.threeInRows.push(this.middleTopAndBottomReach);
    if (this.middleLeftAndRightReach) this.threeInRows.push(this.middleLeftAndRightReach);
  }

  private resetProperties(): void {
    this.threeInRows = [];
    this.playerAreas = [];
    this.area = "";
  }

  private threeInRowsExist(): boolean {
    if (this.threeInRows.length === 1) {
      this.initializePieceRemoval();
      this.resetProperties();
      return true;
    } else if (this.threeInRows.length > 1) {
      // ... state for choosing one of the multiple three-in-rows
      console.log("multiple three in rows");
      this.resetProperties();
      return true;
    } else {
      this.resetProperties();
      return false;
    }
  }

  private initializePieceRemoval(): void {
    this.conf.activePhase.gameTurn.removePiece();
  }

  private getReachValidationForCreatingRows(reach: GameboardAreas, areas: string[]): number[] {
    const pieces: Piece[] = this.conf.activePlayer.pieces;
    const phase: string = this.conf.activePhase.name;
    const reachValidation: number[] = reach.map(area => {
      if (!area) return 0;
      if (areas.includes(area)) {
        if (phase === "two" && (pieces.find(piece => piece.area === area))!.partOfThreeInRow) return 0;
        return 1;
      }
      return 0;
    });
    return reachValidation;
  }

  private getValidCount(reach: GameboardAreas, playerAreas: string[]): number {
    const reachValidation: number[] = this.getReachValidationForCreatingRows(reach, playerAreas);
    const validCount: number = reachValidation.reduce((valid, area) => valid + area);
    return validCount;
  }

  private get topReach(): Reach {
    const reach: GameboardAreas = this.reachOfThreeTop;
    const validCount = this.getValidCount(reach, this.playerAreas);
    if (validCount === 3) return <string[]>reach;
    return null;
  }
  private get leftReach(): Reach {
    const reach: GameboardAreas = this.reachOfThreeLeft;
    const validCount = this.getValidCount(reach, this.playerAreas);
    if (validCount === 3) return <string[]>reach;
    return null;
  }
  private get bottomReach(): Reach {
    const reach: GameboardAreas = this.reachOfThreeBottom;
    const validCount = this.getValidCount(reach, this.playerAreas);
    if (validCount === 3) return <string[]>reach;
    return null;
  }
  private get rightReach(): Reach {
    const reach = this.reachOfThreeRight;
    const validCount = this.getValidCount(reach, this.playerAreas);
    if (validCount === 3) return <string[]>reach;
    return null;
  }
  private get middleTopAndBottomReach(): Reach {
    const reach = this.reachOfMiddleTopAndBottom;
    const validCount = this.getValidCount(reach, this.playerAreas);
    if (validCount === 3) return <string[]>reach;
    return null;
  }
  private get middleLeftAndRightReach(): Reach {
    const reach = this.reachOfMiddleLeftAndRight;
    const validCount = this.getValidCount(reach, this.playerAreas);
    if (validCount === 3) return <string[]>reach;
    return null;
  }

  private get reachOfThreeTop(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      this.area
    ];
    return reach;
  }
  private get reachOfThreeBottom(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      this.area,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`
    ];
    return reach;
  }
  private get reachOfThreeLeft(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      this.area
    ];
    return reach;
  }
  private get reachOfThreeRight(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      this.area,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`
    ];
    return reach;
  }
  private get reachOfMiddleTopAndBottom(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      (row < 2) ? null : `a${row - 1}${column}`,
      this.area,
      (row > 5) ? null : `a${row + 1}${column}`
    ];
    return reach;
  }
  private get reachOfMiddleLeftAndRight(): GameboardAreas {
    const row: number = +this.area[1], column: number = +this.area[2];
    const reach: GameboardAreas = [
      (column < 2) ? null : `a${row}${column - 1}`,
      this.area,
      (column > 5) ? null : `a${row}${column + 1}`
    ];
    return reach;
  }
}