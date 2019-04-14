const _players = new WeakMap();
const _playersEstTranslation = new WeakMap();

export class Game {
  constructor() {
    _players.set(this, ["one", "two"]);
    _playersEstTranslation.set(this, ["Mängija 1", "Mängija 2"]);
  }

  get players() {
    return _players.get(this);
  }
  get playersEstLang() {
    return _playersEstTranslation.get(this);
  }

  init() {

  }
}