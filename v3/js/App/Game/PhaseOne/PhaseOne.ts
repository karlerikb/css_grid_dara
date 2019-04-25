import Game from "../Game";

export default class PhaseOne extends Game {

  readonly phase: string = "one";
  active: boolean = false;

  constructor() {
    super();
  }
}