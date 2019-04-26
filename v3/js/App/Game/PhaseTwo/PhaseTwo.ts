import Game from "../Game";
import Settings from "../../settings/Settings";

export default class PhaseTwo extends Game {
  active: boolean = false;
  readonly phase: string = "two";

  constructor(protected settings: Settings) {
    super(settings);
  }

  protected initiateMoving() {
    console.log("in phase two moving");
  }

  init() {
    console.log("phase two started...!");
  }
}