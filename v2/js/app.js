import { Player } from "./Player.js";
import { Game } from "./Game.js";
import { Menu } from "./Menu.js";
import { PhaseOne } from "./PhaseOne.js";

const _selectors = new WeakMap();
const _players = new WeakMap();

const _activePlayer = new WeakMap();
const _deactivePlayer = new WeakMap();
const _activePhase = new WeakMap();

export class App {
  constructor() {
    _selectors.set(this, {
      root: document.querySelector(":root"),
      gameContainer: document.querySelector(".gameContainer"),
      gameboard: document.querySelector(".gameboard")
    });
    _players.set(this, [new Player(1, "one", "Mängija 1"), new Player(2, "two", "Mängija 2")]);
  }

  get selectors() { return _selectors.get(this); }
  get players() { return _players.get(this); }
  get activePlayer() { return _activePlayer.get(this); }
  get deactivePlayer() { return _deactivePlayer.get(this); }
  get activePhase() { return _activePhase.get(this); }
  
  set selectors(value) { _selectors.set(this, value); }
  set activePlayer(value) { _activePlayer.set(this, value); }
  set deactivePlayer(value) { _deactivePlayer.set(this, value); }
  set activePhase(value) { _activePhase.set(this, value); }

  init() {
    const app = this;
    const menu = new Menu(app);
    const gamePhaseOne = new PhaseOne(app);

    menu.init();
    gamePhaseOne.init();
  }
}

const app = new App();
app.init();

