import { Game } from "./game";
import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";

export class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";

  constructor(settings: Settings, conf: Configuration) {
    super(settings, conf);
  }
}