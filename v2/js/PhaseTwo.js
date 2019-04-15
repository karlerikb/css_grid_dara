import { Game } from "./Game.js";

const _phaseName = new WeakMap();

export class PhaseTwo extends Game {
  constructor() {
    _phaseName.set(this, "one");
  }

  init() {

  }
}