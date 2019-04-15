const _playerNumber = new WeakMap();
const _playerNumberString = new WeakMap();
const _playerName = new WeakMap();

export class Player {
  constructor(number, numberString, name) {
    _playerNumber.set(this, number);
    _playerNumberString.set(this, numberString);
    _playerName.set(this, name);
  }

  get number() { return _playerNumber.get(this); }
  get numberString() { return _playerNumberString.get(this); }
  get name() { return _playerName.get(this); }
}