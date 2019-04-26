import Settings from "../settings/Settings";
import { Piece } from "../Player/Player";

export default abstract class Game {
  firstPhaseMoveHandler: any;
  secondPhaseMoveHandler: any;
  protected activatedPiece: Piece = <Piece>{};
  protected selectedPosition: any;
  protected piecesOnTable: number = 0;

  constructor(protected settings: Settings) {
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
      const inactivePhase = this.settings.phases.find((phase: any) => !phase.active);
      console.log(inactivePhase);
      // inactivePhase!.init();
    }
  }

  protected switchTurn(): void {
    this.piecesOnTable++;
    this.switchPlayers();
    this.activatePlayer();
    this.testPhase();
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