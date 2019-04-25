import Game from "../Game";

export default class PhaseTwo extends Game {

  readonly phase: string = "two";
  active: boolean = false;

  constructor() {
    super();
  }
}