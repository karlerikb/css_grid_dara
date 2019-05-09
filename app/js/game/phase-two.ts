import { Game } from "./game";

export class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";

  constructor() {
    super();
  }

  init(): void {
    console.log("phase two started...");
  }

  createGameboardPositions(): void {

  }

  finalizeMovement(): void {

    // ... this is the places where further states are determined
  }


}