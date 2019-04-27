import Settings from "../settings/Settings";
import Player, { Piece } from "../Player/Player";

export default abstract class Game {
  firstPhaseMoveHandler: any;
  secondPhaseMoveHandler: any;
  protected activatedPiece: Piece = <Piece>{};
  protected selectedPosition: any;
  protected piecesOnTable: number = 0;
  protected threeInRow: ThreeInRow = <ThreeInRow>{};

  constructor(protected settings: Settings) {
    this.threeInRow = new ThreeInRow(this.settings);
  }

  protected activatePlayer(): void {
    const activePlayer = this.settings.players.find(player => player.active);
    const inactivePlayer = this.settings.players.find(player => !player.active);
    activePlayer!.piecesContainer.classList.add("active");
    inactivePlayer!.piecesContainer.classList.remove("active");
  }

  protected switchPlayers(): void {
    const activePlayer = this.settings.players.find(player => player.active);
    const inactivePlayer = this.settings.players.find(player => !player.active);
    activePlayer!.active = false;
    inactivePlayer!.active = true;
  }

  protected testPhase(): void {
    if (this.piecesOnTable === (2 * this.settings.piecesForEachPlayer)) {
      this.switchPhases();
      this.activatePhase();
      this.configurePiecesDataForPhaseTwo();
    } else {
      this.configurePiecesDataForPhaseOne();
    }
  }

  private switchPhases(): void {
    const activePhase = (<any>this.settings.phases).find((phase: any) => phase.active);
    const inactivePhase = (<any>this.settings.phases).find((phase: any) => !phase.active);
    activePhase.active = false;
    inactivePhase.active = true;
  }

  private activatePhase(): void {
    const activePhase = (<any>this.settings.phases).find((phase: any) => phase.active);
    activePhase.init();
  }

  protected switchTurn(): void {
    this.switchPlayers();
    this.activatePlayer();
    this.testPhase();
  }

  private configurePiecesDataForPhaseOne(): void {
    this.piecesOnTable++;
    this.threeInRow.prohibitPositionsForPhaseOne();
  }

  private configurePiecesDataForPhaseTwo(): void {
    // ...
  }

  protected removeGameboardPositions(): void {
    const temporaryPositionAmount = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition")).length;
    if (temporaryPositionAmount) {
      Array.from(document.querySelectorAll(".gameboard > .temporaryPosition")).forEach(position => {
        position.removeEventListener("click", this.firstPhaseMoveHandler);
        position.remove();
      });
    }
  }

  private storeActivatedPiece(activatedPiece: Piece): void {
    this.activatedPiece = activatedPiece;
  }

  activatePiece(activatedPiece: Piece): void {
    this.storeActivatedPiece(activatedPiece);
    const activePhase: any = this;
    if (activatedPiece.active) {
      activePhase.initiateMoving(activatedPiece);
    } else {
      this.removeGameboardPositions();
    }
  }
}


class ThreeInRow {

  private activePlayer: Player = <Player>{};
  private inactivePlayer: Player = <Player>{};
  private playerPositions: string[] = [];

  constructor(private settings: Settings) {
  }

  prohibitPositionsForPhaseOne() {
    this.setPlayers();
    this.combinePlayerPositions();
    this.searchForPlayerProhibitedPositions();
  }

  private combinePlayerPositions(): void {
    const activePlayerPositions = this.activePlayer.piecePositionsOnGameboard;
    const inactivePlayerPositions = this.inactivePlayer.piecePositionsOnGameboard;
    const playerPositions = activePlayerPositions.concat(inactivePlayerPositions);
    this.playerPositions = playerPositions;
  }

  private setPlayers(): void {
    this.activePlayer = <Player>this.settings.players.find(player => player.active);
    this.inactivePlayer = <Player>this.settings.players.find(player => !player.active);
  }

  private searchForPlayerProhibitedPositions(): void {
    this.settings.players.forEach(player => {
      this.searchHorizontally(player);
      this.searchVertically(player);
    });
  }

  private searchHorizontally(player: Player): void {
    player.piecePositionsOnGameboard.forEach(position => {
      const reach = this.getReachHorizontally(position);
      const reachValidation = this.getReachValidation(reach, player);
      const validCount = reachValidation.reduce((valid, area) => valid + area);
      if (validCount > 1) this.divideReachIntoThrees(reach, player);
    });
  }

  private searchVertically(player: Player): void {
    player.piecePositionsOnGameboard.forEach(position => {
      const reach = this.getReachVertically(position);
      const reachValidation = this.getReachValidation(reach, player);
      const validCount = reachValidation.reduce((valid, area) => valid + area);
      if (validCount > 1) this.divideReachIntoThrees(reach, player);
    });
  }

  private getReachVertically(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      position,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`
    ];
    return reach;
  }

  private getReachHorizontally(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      position,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`
    ];
    return reach;
  }

  private getReachValidation(reach: (null | string)[], player: Player): number[] {
    const reachValidation = reach.map(position => {
      if (!position) return 0;
      else if (!player.piecePositionsOnGameboard.includes(position)) return 0; 
      else return 1;
    });
    return reachValidation;
  }

  private divideReachIntoThrees(reach: (null | string)[], player: Player): void {
    for (let i = 0; i < 3; i++) {
      const threeReachPositions: (null | string)[] = reach.slice(i, i + 3);
      const threePositions: number[] = threeReachPositions.map(position => {
        if (!position) return 0;
        return (player.piecePositionsOnGameboard.includes(position) ? 1 : 0);
      });
      const validCount: number = threePositions.reduce((valid, area) => valid + area);
      if (validCount === 2) this.determineProhibitedPositions(threeReachPositions, player);
    }
  }

  private determineProhibitedPositions(threeReachPositions: (null | string)[], player: Player): void {
    threeReachPositions.forEach(position => {
      if (position) {
        if (!this.playerPositions.includes(position) && !player.prohibitedPositions.includes(position)) {
          player.prohibitedPositions.push(position);
        }
      }
    });
  }
}