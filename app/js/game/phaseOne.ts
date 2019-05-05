import { Game } from "./game";
import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";

export class PhaseOne extends Game {
  active: boolean = true;
  readonly phase: string = "one";

  constructor(settings: Settings, conf: Configuration) {
    super(settings, conf);
  }

  init(): void {
    this.activatePlayer();
  }
}