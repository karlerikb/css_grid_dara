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
    if (this.piecesOnTable < (2 * this.settings.piecesForEachPlayer)) {
      this.configurePiecesDataForPhaseOne();
    } else if (this.piecesOnTable === (2 * this.settings.piecesForEachPlayer)) {
      this.switchPhases();
      this.activatePhase();
      this.configurePiecesDataForPhaseTwo();
    } else {
      this.configurePiecesDataForPhaseTwo();
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
    this.threeInRow.prohibitPositionsForPhaseOne();
  }

  private configurePiecesDataForPhaseTwo(): void {
    this.threeInRow.prohibitPositionsForPhaseTwo();
  }

  removeGameboardPositions(): void {
    const temporaryPositionAmount = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition")).length;
    if (temporaryPositionAmount) {
      Array.from(document.querySelectorAll(".gameboard > .temporaryPosition")).forEach(position => {
        position.removeEventListener("click", this.firstPhaseMoveHandler);
        position.removeEventListener("click", this.secondPhaseMoveHandler);
        position.remove();
      });
    }
  }

  protected storeActivatedPiece(activatedPiece: Piece): void {
    this.activatedPiece = activatedPiece;
  }

  protected storeSelectedPosition(position: HTMLElement): void {
    this.selectedPosition = position;
  }

  protected calculateTopPosition(): void {
    const activatedPieceTop = this.activatedPiece.element.getBoundingClientRect().top;
    const selectedPositionTop = this.selectedPosition.getBoundingClientRect().top;
    const top = selectedPositionTop - activatedPieceTop;
    this.settings.selectors.root.style.setProperty("--targetPositionTop", `${top}px`);
  }

  protected calculateLeftPosition(): void {
    const activatedPieceLeft = this.activatedPiece.element.getBoundingClientRect().left;
    const selectedPositionLeft = this.selectedPosition.getBoundingClientRect().left;
    const left = selectedPositionLeft - activatedPieceLeft;
    this.settings.selectors.root.style.setProperty("--targetPositionLeft", `${left}px`);
  }

  protected setAnimationTime(): void {
    this.settings.selectors.root.style.setProperty("--animationTime", this.settings.animationTime);
  }

  protected animationStarts(): void {
    const activePlayer = this.settings.players.find(player => player.active);
    const temporaryPositions = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition"));
    activePlayer!.pieces.forEach(piece => piece.element.classList.add("notAllowed"));
    temporaryPositions.forEach(position => position.classList.add("notAllowed"));
    this.settings.animationInProgress = true;
  }

  protected animationEnds(): void {
    const activePlayer = this.settings.players.find(player => player.active);
    const inactivePlayer = this.settings.players.find(player => !player.active);
    const temporaryPositions = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition"));
    activePlayer!.pieces.forEach(piece => piece.element.classList.remove("notAllowed"));
    inactivePlayer!.pieces.forEach(piece => piece.element.classList.remove("notAllowed"));
    temporaryPositions.forEach(position => position.classList.remove("notAllowed"));
    this.settings.animationInProgress = false;
  }
}


class ThreeInRow {

  private activePlayer: Player = <Player>{};
  private inactivePlayer: Player = <Player>{};
  private playerPositions: string[] = [];

  constructor(private settings: Settings) {
  }

  prohibitPositionsForPhaseOne(): void {
    this.setPlayers();
    this.combinePlayerPositions();
    this.searchForThreeInRowProhibitedPositions();
  }

  prohibitPositionsForPhaseTwo(): void {
    this.setPlayers();
    this.combinePlayerPositions();
    this.resetProhibitedPositions();
    this.searchForFourInRowProhibitedPositions();
    console.log(this.settings.players);
  }

  private setPlayers(): void {
    this.activePlayer = <Player>this.settings.players.find(player => player.active);
    this.inactivePlayer = <Player>this.settings.players.find(player => !player.active);
  }

  private combinePlayerPositions(): void {
    const activePlayerPositions = this.activePlayer.piecePositionsOnGameboard;
    const inactivePlayerPositions = this.inactivePlayer.piecePositionsOnGameboard;
    const playerPositions = activePlayerPositions.concat(inactivePlayerPositions);
    this.playerPositions = playerPositions;
  }

  private searchForThreeInRowProhibitedPositions(): void {
    this.settings.players.forEach(player => {
      this.searchHorizontallyThrees(player);
      this.searchVerticallyThrees(player);
    });
  }

  private searchHorizontallyThrees(player: Player): void {
    player.piecePositionsOnGameboard.forEach(position => {
      const reach = this.getReachOfFiveHorizontally(position);
      const reachValidation = this.getReachValidation(reach, player);
      const validCount = reachValidation.reduce((valid, area) => valid + area);
      if (validCount > 1) this.divideReachIntoThrees(reach, player);
    });
  }

  private searchVerticallyThrees(player: Player): void {
    player.piecePositionsOnGameboard.forEach(position => {
      const reach = this.getReachOfFiveVertically(position);
      const reachValidation = this.getReachValidation(reach, player);
      const validCount = reachValidation.reduce((valid, area) => valid + area);
      if (validCount > 1) this.divideReachIntoThrees(reach, player);
    });
  }

  private getReachOfFiveVertically(position: string): (null | string)[] {
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

  private getReachOfFiveHorizontally(position: string): (null | string)[] {
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

  private determineProhibitedPositions(reachPositions: (null | string)[], player: Player): void {
    reachPositions.forEach(position => {
      if (position) {
        if (!this.playerPositions.includes(position) && !player.prohibitedPositions.includes(position)) {
          player.prohibitedPositions.push(position);
        }
      }
    });
  }

  private resetProhibitedPositions(): void {
    this.activePlayer.prohibitedPositions = this.playerPositions;
    this.inactivePlayer.prohibitedPositions = this.playerPositions;
  }

  private searchForFourInRowProhibitedPositions(): void {
    this.settings.players.forEach(player => {
      this.searchHorizontallyFours(player);
      this.searchVerticallyFours(player);
    });
  }

  private searchHorizontallyFours(player: Player): void {
    player.piecePositionsOnGameboard.forEach(position => {
      const reach = this.getReachOfSevenHorizontally(position);
      const reachValidation = this.getReachValidation(reach, player);
      const validCount = reachValidation.reduce((valid, area) => valid + area);
      if (validCount > 1) this.divideReachIntoFours(reach, player);
    });
  }

  private searchVerticallyFours(player: Player): void {
    player.piecePositionsOnGameboard.forEach(position => {
      const reach = this.getReachOfSevenVertically(position);
      const reachValidation = this.getReachValidation(reach, player);
      const validCount = reachValidation.reduce((valid, area) => valid + area);
      if (validCount > 1) this.divideReachIntoFours(reach, player);
    });
  }

  private getReachOfSevenHorizontally(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (column < 4) ? null : `a${row}${column - 3}`,
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      position,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`,
      (column > 3) ? null : `a${row}${column + 3}`
    ];
    return reach;
  }

  private getReachOfSevenVertically(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (row < 4) ? null : `a${row - 3}${column}`,
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      position,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`,
      (row > 3) ? null : `a${row + 3}${column}`
    ];
    return reach;
  }

  private divideReachIntoFours(reach: (null | string)[], player: Player): void {
    for (let i = 0; i < 4; i++) {
      const fourReachPositions: (null | string)[] = reach.slice(i, i + 4);
      const fourPositions: number[] = fourReachPositions.map(position => {
        if (!position) return 0;
        return (player.piecePositionsOnGameboard.includes(position) ? 1 : 0);
      });
      const validCount: number = fourPositions.reduce((valid, area) => valid + area);
      if (validCount === 3) this.determineProhibitedPositions(fourReachPositions, player);
    }
  }
}