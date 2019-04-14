const _selectors = new WeakMap();
const _players = new WeakMap();
const _playersEstTranslation = new WeakMap();

export class App {
  constructor() {
    _selectors.set(this, {
      gameContainer: document.querySelector(".gameContainer")
    });
    _players.set(this, ["one", "two"]);
    _playersEstTranslation.set(this, ["Mängija 1", "Mängija 2"]);
  }

  get selectors() { return _selectors.get(this); }
  get players() { return _players.get(this); }
  get playersEstLang() { return _playersEstTranslation.get(this); }
  
  set selectors(value) { _selectors.set(this, value); }
}

