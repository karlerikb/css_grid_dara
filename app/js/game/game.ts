import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";
import { Player } from "../players/player";
import { GameTurn } from "./game-turn";
import { Piece } from "../players/piece";
import { Phase } from "../conf/custom-types";
import { Helper } from "../conf/helper";
import { ThreeInRow } from "./rows/three-in-row";
import { FourInRow } from "./rows/four-in-row";
import { Hints } from "../hints/hints";
import { Menu } from "../menu/menu";

export abstract class Game {
  protected settings: Settings = Settings.instance;
  protected conf: Configuration = Configuration.instance;
  protected threeInRow = new ThreeInRow();
  protected fourInRow = new FourInRow();

  readonly gameTurn = new GameTurn();
  readonly piecesOnGameboard: Piece[] = [];

  constructor() {
  }

  initializeMovement(target: EventTarget): void {
    this.conf.selectedPosition = target;
    this.gameTurn.movePiece();
  }

  activatePiece(target: EventTarget): void {
    const activatedPiece: Piece = <Piece>this.conf.activePlayer.pieces.find(piece => piece.element === target);
    this.conf.activePiece = activatedPiece;
    this.gameTurn.activatePiece();
  }

  removeGameboardPositions(): void {
    const tempPositions: NodeListOf<Element> = document.querySelectorAll(this.conf.selectors.temporaryPositions);
    for (let position of tempPositions) {
      position.removeEventListener("click", this.conf.eventListeners.movingPiece);
      position.remove();
    }
  }

  protected switchTurn(): void {
    this.switchPlayers();
    this.testPhase();
    this.testWinCondition();
  }

  protected activatePlayer(): void {
    this.conf.activePlayer.piecesContainerElement.classList.add(this.conf.classes.activeContainer);
    this.conf.inactivePlayer.piecesContainerElement.classList.remove(this.conf.classes.activeContainer);
    this.gameTurn.initializeGameTurn();
  }

  protected createAllowedPositionElement(area: string, documentFragment: DocumentFragment): void {
    const position: HTMLElement = Helper.create({
      type: "div", class: this.conf.classes.temporaryPosition, area,
      parent: documentFragment
    });
    position.addEventListener("click", this.conf.eventListeners.movingPiece);
  }

  protected removeAnimation(): void {
    this.conf.activePiece!.element.classList.remove(this.conf.classes.animateMovement);
    this.conf.activePiece!.element.removeEventListener("animationend", this.conf.eventListeners.movementEnds);
  }

  protected resetPieceReferences(): void {
    this.conf.activePiece = null;
    this.conf.selectedPosition = null;
  }

  private switchPlayers(): void {
    const activePlayer: Player = this.conf.activePlayer;
    const inactivePlayer: Player = this.conf.inactivePlayer;
    activePlayer.active = false;
    inactivePlayer.active = true;
    this.activatePlayer();
  }

  private testPhase(): void {
    const piecesOnGameboard: number = this.piecesOnGameboard.length;
    const piecesAllowedOnTable: number = 2 * this.settings.piecesForEachPlayer;
    const gamePhases: number = this.conf.phases.length;
    if (piecesOnGameboard === piecesAllowedOnTable && gamePhases === 2) {
      Hints.instance.switchPhaseInHints();
      this.switchPhase();
      this.removeInactivePhase();
    }
  }

  private switchPhase(): void {
    const activePhase: Phase = this.conf.activePhase;
    const inactivePhase: Phase | null = this.conf.inactivePhase;
    activePhase.active = false;
    inactivePhase!.active = true;
    this.conf.activePhase.init();
  }

  private removeInactivePhase(): void {
    const inactivePhaseIndex: number = this.conf.phases.indexOf(<Phase>this.conf.inactivePhase);
    this.conf.phases.splice(inactivePhaseIndex, 1);
  }

  private testWinCondition(): void {
    const gameWon: boolean = this.testPiecesAmountOnTable();
    if (!gameWon) {
      this.testPieceMovementAvailabilityOnTable();
    }
  }

  private testPiecesAmountOnTable(): boolean {
    if (this.conf.activePlayer.pieces.length < 3) {
      this.initiateWinScenario("piecesAmount");
      return true;
    }
    return false;
  }

  private testPieceMovementAvailabilityOnTable(): void {
    if (this.conf.activePhase.name === "two") {
      const piecesWithSomeAvailablePositions: number = <number>this.conf.activePhase.findPiecesWithSomeAvailablePositions();
      if (this.conf.activePlayer.pieces.length > 2 && piecesWithSomeAvailablePositions === 0) {
        this.initiateWinScenario("noPieceCanMove");
      }
    }
  }

  private initiateWinScenario(scenario: string): void {
    this.switchPlayers();
    this.configurePiecesAfterWin();
    Hints.instance.setWinScenarioInHints(scenario);
    Menu.instance.setWinScenarioInMenu();
  }

  private configurePiecesAfterWin(): void {
    this.conf.allPlayerPieces.forEach(piece => {
      piece.element.classList.remove(this.conf.classes.notAllowed, this.conf.classes.playerTurn);
      piece.element.classList.add(this.conf.classes.afterWin);
    });
    this.conf.activePlayer.pieces.forEach(piece => {
      piece.element.classList.add(this.conf.classes.dehighlighted);
      piece.element.removeEventListener("click", this.conf.eventListeners.activatingPiece);
    });
  }


  get threeInRows(): string[][] {
    return this.threeInRow.threeInRows;
  }

  protected get gridArea(): string {
    const computedStyle: string | null = window.getComputedStyle(<Element>this.conf.selectedPosition).gridArea;
    let area: string;
    if (computedStyle) {
      area = computedStyle.split("/")[0].trim();
    } else {
      area = (<HTMLElement>this.conf.selectedPosition).style.gridArea!.split("/")[0].trim();
    }
    return area;
  }
}