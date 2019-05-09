import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";
import { Player } from "../players/player";
import { GameTurn } from "./game-turn";
import { Piece } from "../players/piece";
import { Phase } from "../conf/custom-types";

export abstract class Game {
  private phaseIsNotSwitched: boolean = true;
  protected settings: Settings = Settings.instance;
  protected conf: Configuration = Configuration.instance;

  readonly gameTurn = new GameTurn();
  readonly piecesOnGameboard: Piece[] = [];

  constructor() {
  }

  initializeMovement(target: EventTarget): void {
    this.conf.selectedPosition = target;
    this.gameTurn.movePiece();
  }

  activatePiece(target: EventTarget): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const activatedPiece: Piece = <Piece>activePlayer.pieces.find(piece => piece.element === target);
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
    this.activatePlayer();
    this.testPhase();
  }

  protected activatePlayer(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    activePlayer.piecesContainerElement.classList.add(this.conf.classes.activeContainer);
    inactivePlayer.piecesContainerElement.classList.remove(this.conf.classes.activeContainer);
    this.gameTurn.initializeGameTurn();
  }

  private switchPlayers(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    activePlayer.active = false;
    inactivePlayer.active = true;
  }

  private testPhase(): void {
    const piecesOnGameboard: number = this.piecesOnGameboard.length;
    const piecesAllowedOnTable: number = 2 * this.settings.piecesForEachPlayer;
    if (piecesOnGameboard === piecesAllowedOnTable && this.phaseIsNotSwitched) {
      this.switchPhase();
      this.phaseIsNotSwitched = false;
    }
  }

  private switchPhase(): void {
    const activePhase: Phase = <Phase>this.conf.phases.find((phase: any) => phase.active);
    const inactivePhase: Phase = <Phase>this.conf.phases.find((phase: any) => !phase.active);
    activePhase.active = false;
    inactivePhase.active = true;
    this.activatePhase();
  }

  private activatePhase(): void {
    const activePhase: Phase = <Phase>this.conf.phases.find((phase: any) => phase.active);
    activePhase.init();
  }
}