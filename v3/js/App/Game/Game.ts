import Settings from "../settings/Settings";
import Player, { Piece } from "../Player/Player";
import Helper from "../Helper/Helper";

export default abstract class Game {
  firstPhaseMoveHandler: any;
  secondPhaseMoveHandler: any;
  pieceRemovalInProgress: boolean = false;
  protected activatedPiece: Piece = <Piece>{};
  protected selectedPosition: any;
  protected piecesOnTable: number = 0;
  readonly threeInRow: ThreeInRow = <ThreeInRow>{};
  readonly fourInRow: fourInRow = <fourInRow>{};

  constructor(protected settings: Settings) {
    this.threeInRow = new ThreeInRow(this.settings);
    this.fourInRow = new fourInRow(this.settings);
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
  protected doubleRowSelectionHandler: any = this.initializeDoubleRowSelection.bind(this);
  protected selectRowHandler: any = this.selectedThreeInRow.bind(this);
  rowSelectionInProgress: boolean = false;

  private threeInRowSelections: any = [];

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
  }

  checkIfExists(activatedPiece: Piece): boolean {
    const threeInRows: string[][] = [];
    const topReach: (boolean | string[]) = this.getTopReach(activatedPiece);
    const leftReach: (boolean | string[]) = this.getLeftReach(activatedPiece);
    const bottomReach: (boolean | string[]) = this.getBottomReach(activatedPiece);
    const rightReach: (boolean | string[]) = this.getRightReach(activatedPiece);
    const topAndBottomReach: (boolean | string[]) = this.getTopAndBottomReach(activatedPiece);
    const leftAndRightReach: (boolean | string[]) = this.getLeftAndRightReach(activatedPiece);

    if (topReach) threeInRows.push(<string[]>topReach);
    if (leftReach) threeInRows.push(<string[]>leftReach);
    if (bottomReach) threeInRows.push(<string[]>bottomReach);
    if (rightReach) threeInRows.push(<string[]>rightReach);
    if (topAndBottomReach) threeInRows.push(<string[]>topAndBottomReach);
    if (leftAndRightReach) threeInRows.push(<string[]>leftAndRightReach);
    return this.markThreeInRows(threeInRows, activatedPiece.player);
  }

  private getTopReach(piece: Piece): boolean | string[] {
    const reach = this.getReachOfThreeTop(piece.area);
    const reachValidation = this.getReachValidation(reach, piece.player);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount === 3) return <string[]>reach;
    return false;
  }

  private getLeftReach(piece: Piece): boolean | string[] {
    const reach = this.getReachOfThreeLeft(piece.area);
    const reachValidation = this.getReachValidation(reach, piece.player);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount === 3) return <string[]>reach;
    return false;
  }

  private getBottomReach(piece: Piece): boolean | string[] {
    const reach = this.getReachOfThreeBottom(piece.area);
    const reachValidation = this.getReachValidation(reach, piece.player);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount === 3) return <string[]>reach;
    return false;
  }

  private getRightReach(piece: Piece): boolean | string[] {
    const reach = this.getReachOfThreeRight(piece.area);
    const reachValidation = this.getReachValidation(reach, piece.player);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount === 3) return <string[]>reach;
    return false;
  }

  private getTopAndBottomReach(piece: Piece): boolean | string[] {
    const reach = this.getReachOfMiddleTopAndBottom(piece.area);
    const reachValidation = this.getReachValidation(reach, piece.player);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount === 3) return <string[]>reach;
    return false;
  }

  private getLeftAndRightReach(piece: Piece): boolean | string[] {
    const reach = this.getReachOfMiddleLeftAndRight(piece.area);
    const reachValidation = this.getReachValidation(reach, piece.player);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount === 3) return <string[]>reach;
    return false;
  }

  private markThreeInRows(threeInRows: string[][], player: Player): boolean {
    if (threeInRows.length === 1) {
      this.determineIndicationDimension(threeInRows, player);
      return true;
    }
    if (threeInRows.length > 1) {
      this.rowSelectionInProgress = true;
      this.determineIndicationDimensions(threeInRows, player);
      return true;
    }
    return false;
  }

  private determineIndicationDimension(threeInRows: string[][], player: Player) {
    const [positions] = threeInRows;
    const [firstPos, secondPos, thirdPos] = positions;
    if (firstPos[1] === secondPos[1]) this.createHorizontalIndication(firstPos, secondPos, thirdPos, player);
    if (firstPos[2] === secondPos[2]) this.createVerticalIndication(firstPos, secondPos, thirdPos, player);
    this.markPiecesAsPartOfThreeInRow(positions);
  }

  private determineIndicationDimensions(threeInRows: string[][], player: Player) {
    threeInRows.forEach(threeInRow => {
      const [firstPos, secondPos, thirdPos] = threeInRow;
      if (firstPos[1] === secondPos[1]) {
        const indicationElement = this.createHorizontalIndication(firstPos, secondPos, thirdPos, player);
        this.addRowSelectionEventListeners(indicationElement);
        this.threeInRowSelections.push({ indicationElement, positions: threeInRow });
      }
      if (firstPos[2] === secondPos[2]) {
        const indicationElement = this.createVerticalIndication(firstPos, secondPos, thirdPos, player);
        this.addRowSelectionEventListeners(indicationElement);
        this.threeInRowSelections.push({ indicationElement, positions: threeInRow });
      }
    });
  }

  private markPiecesAsPartOfThreeInRow(threeInRow: string[]) {
    const activePlayer = this.settings.players.find(player => player.active);
    threeInRow.forEach(area => {
      const piece = activePlayer!.pieces.find(piece => piece.area === area);
      piece!.partOfThreeInRow = true;
    });
  }

  private addRowSelectionEventListeners(indicationElement: HTMLElement): void {
    indicationElement.classList.add("doubleRowIndication");
    indicationElement.addEventListener("click", this.doubleRowSelectionHandler);
    indicationElement.addEventListener("dblclick", this.selectRowHandler);
  }

  private removeSelectionEventListeners(indicationElement: Element): void {
    indicationElement.removeEventListener("click", this.doubleRowSelectionHandler);
    indicationElement.removeEventListener("dblclick", this.selectRowHandler);
    indicationElement.classList.remove("selectedRow", "doubleRowIndication");
  }

  private initializeDoubleRowSelection(e: any): void {
    const threeInRows = Array.from(document.querySelectorAll(".threeInRow.doubleRowIndication"));
    threeInRows.forEach(threeInRow => {
      threeInRow.classList.remove("selectedRow");
    });
    e.target.classList.add("selectedRow");
  }

  private selectedThreeInRow(e: any): void {
    const activePhase = <any>this.settings.phases.find((phase: any) => phase.active);
    const doubleThreeInRows = Array.from(document.querySelectorAll(".threeInRow.doubleRowIndication"));
    doubleThreeInRows.forEach(threeInRow => {
      this.removeSelectionEventListeners(threeInRow);
    });
    this.markOnlySelectedPiecesAsPartOfThreeInRow(e.target);
    this.removeNotSelectedRowIndicationElement(doubleThreeInRows, e.target);
    this.resetPieceRemovalFlags(activePhase);
    activePhase!.initiateOpponentPieceRemoval();

    const threeInRows = this.settings.players.find(player => player.active)!.threeInRows;
    const toBeRemovedObj = threeInRows.find(row => row.element !== e.target);
    threeInRows.splice(threeInRows.indexOf(toBeRemovedObj), 1);
  }

  private markOnlySelectedPiecesAsPartOfThreeInRow(selectedRow: Element) {
    const threeInRow = this.threeInRowSelections.find((row: any) => row.indicationElement === selectedRow);
    this.markPiecesAsPartOfThreeInRow(threeInRow.positions);
  }

  private removeNotSelectedRowIndicationElement(doubleThreeInRows: Element[], selectedRow: Element): void {
    const notSelectedRow = doubleThreeInRows.find(row => row !== selectedRow);
    notSelectedRow!.remove();
  }

  private resetPieceRemovalFlags(activePhase: any): void {
    this.rowSelectionInProgress = false;
    activePhase!.pieceRemovalInProgress = false;
  }

  private createHorizontalIndication(firstPos: string, secondPos: string, thirdPos: string, player: Player): HTMLElement {
    const area = `${firstPos} / ${firstPos} / ${firstPos} / ${thirdPos}`;
    const threeInRow = Helper.create({
      type: "div", class: `player${player.numberStringUpperCase} threeInRow`, area,
      parent: this.settings.selectors.gameboard
    });
    player.threeInRows.push({
      positions: [firstPos, secondPos, thirdPos],
      element: threeInRow
    });
    return threeInRow;
  }

  private createVerticalIndication(firstPos: string, secondPos: string, thirdPos: string, player: Player): HTMLElement {
    const area = `${firstPos} / ${firstPos} / ${thirdPos} / ${firstPos}`;
    const threeInRow = Helper.create({
      type: "div", class: `player${player.numberStringUpperCase} threeInRow`, area,
      parent: this.settings.selectors.gameboard
    });
    player.threeInRows.push({
      positions: [firstPos, secondPos, thirdPos],
      element: threeInRow
    });
    return threeInRow;
  }

  private getReachOfThreeTop(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      position
    ];
    return reach;
  }

  private getReachOfThreeBottom(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      position,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`
    ];
    return reach;
  }

  private getReachOfThreeLeft(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      position
    ];
    return reach;
  }

  private getReachOfThreeRight(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      position,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`
    ];
    return reach;
  }

  private getReachOfMiddleTopAndBottom(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (row < 2) ? null : `a${row - 1}${column}`,
      position,
      (row > 5) ? null : `a${row + 1}${column}`
    ];
    return reach;
  }

  private getReachOfMiddleLeftAndRight(position: string): (null | string)[] {
    const row = +position[1], column = +position[2];
    const reach = [
      (column < 2) ? null : `a${row}${column - 1}`,
      position,
      (column > 5) ? null : `a${row}${column + 1}`
    ];
    return reach;
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
      if (player.piecePositionsOnGameboard.includes(position)) {
        if (player.pieces.find(piece => piece.area === position)!.partOfThreeInRow) return 0;
        else return 1;
      }
      if (!player.piecePositionsOnGameboard.includes(position)) return 0; 
      return 1;
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
}

class fourInRow {
  private activePiece: Piece = <Piece>{};
  private activePlayer: Player = <Player>{};
  private selectedPosition: string = "";
  
  constructor(private settings: Settings) {
  }

  exists(area: string, activatedPiece: Piece): boolean {
    this.setProperties(activatedPiece, area);
    return this.searchForFourInRow();
  }

  private setProperties(activatedPiece: Piece, area: string): void {
    this.setActivatedPiece(activatedPiece);
    this.setSelectedPosition(area);
    this.setActivePlayer();
  }

  private searchForFourInRow(): boolean {
    const horizontalFourInRow = this.searchHorizontallyFours();
    const verticalFourInRow = this.searchVerticallyFours();
    return !(horizontalFourInRow || verticalFourInRow);
  }

  private setActivatedPiece(activatedPiece: Piece): void {
    this.activePiece = activatedPiece;
  }

  private setActivePlayer(): void {
    this.activePlayer = <Player>this.settings.players.find(player => player.active);
  }

  private setSelectedPosition(area: string): void {
    this.selectedPosition = area;
  }

  private searchHorizontallyFours(): boolean {
    const reach = this.getReachOfSevenHorizontally();
    const reachValidation = this.getReachValidation(reach);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount > 3) return this.divideReachIntoFours(reachValidation);
    return false;
  }

  private searchVerticallyFours(): boolean {
    const reach = this.getReachOfSevenVertically();
    const reachValidation = this.getReachValidation(reach);
    const validCount = reachValidation.reduce((valid, area) => valid + area);
    if (validCount > 3) return this.divideReachIntoFours(reachValidation);
    return false;
  }

  private getReachOfSevenHorizontally(): (null | string)[] {
    const row = +this.selectedPosition[1], column = +this.selectedPosition[2];
    const reach = [
      (column < 4) ? null : `a${row}${column - 3}`,
      (column < 3) ? null : `a${row}${column - 2}`,
      (column < 2) ? null : `a${row}${column - 1}`,
      this.selectedPosition,
      (column > 5) ? null : `a${row}${column + 1}`,
      (column > 4) ? null : `a${row}${column + 2}`,
      (column > 3) ? null : `a${row}${column + 3}`
    ];
    return reach;
  }

  private getReachOfSevenVertically(): (null | string)[] {
    const row = +this.selectedPosition[1], column = +this.selectedPosition[2];
    const reach = [
      (row < 4) ? null : `a${row - 3}${column}`,
      (row < 3) ? null : `a${row - 2}${column}`,
      (row < 2) ? null : `a${row - 1}${column}`,
      this.selectedPosition,
      (row > 5) ? null : `a${row + 1}${column}`,
      (row > 4) ? null : `a${row + 2}${column}`,
      (row > 3) ? null : `a${row + 3}${column}`
    ];
    return reach;
  }

  private getReachValidation(reach: (null | string)[]): number[] {
    const reachValidation = reach.map(position => {
      if (!position) return 0;
      if (position === this.activePiece.area) return 0;
      if (position === this.selectedPosition) { return 1; }
      if (!this.activePlayer.piecePositionsOnGameboard.includes(position)) return 0;
      return 1;
    });
    return reachValidation;
  }

  private divideReachIntoFours(reachValidation: number[]): boolean {
    let fourInRow: boolean = false;
    for (let i = 0; i < 4; i++) {
      const fourReachValidation: number[] = reachValidation.slice(i, i + 4);
      const validCount: number = fourReachValidation.reduce((valid, area) => valid + area);
      if (validCount === 4) {
        fourInRow = true;
        break;
      }
    }
    return fourInRow;
  }
}