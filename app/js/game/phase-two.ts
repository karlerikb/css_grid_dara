import { Game } from "./game";

export class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";

  constructor() {
    super();
  }

  init(): void {
    console.log("phase two started...");
    this.configureSecondPhaseGameData();
  }

  createGameboardPositions(): void {
    console.log("creating gameboard positions...");
  }

  finalizeMovement(): void {
    console.log("finalizing movement...");

    // ... this is the places where further states are determined
  }

  private configureSecondPhaseGameData(): void {
    
  }
}