const _selectors = new WeakMap();

export class App {
  constructor() {
    _selectors.set(this, {
      gameContainer: "gameContainer"
    });
  }

  get selectors() { return _selectors.get(this); }

  set selectors(value) { _selectors.set(this, value); }

  init() {
    console.log("init app");
  }
}