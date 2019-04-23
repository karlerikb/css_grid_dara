import { Player } from "./Player.js";
import { Menu } from "./Menu.js";
import { PhaseOne } from "./PhaseOne.js";
import { PhaseTwo } from "./PhaseTwo.js";

const _selectors = new WeakMap();
const _players = new WeakMap();
const _turnDescription = new WeakMap();
const _phases = new WeakMap();

const _activePlayer = new WeakMap();
const _deactivePlayer = new WeakMap();
const _activePhase = new WeakMap();

const _initializeMenu = new WeakMap();
const _startPhaseOne = new WeakMap();
const _startPhaseTwo = new WeakMap();


export class App {
  constructor() {

    // Properties
    _selectors.set(this, {
      root: document.querySelector(":root"),
      gameContainer: document.querySelector(".gameContainer"),
      gameboard: document.querySelector(".gameboard"),
      gamePhaseDescription: document.querySelector(".hintsContainer .gamePhase"),
      playerTurn: document.querySelector(".hintsContainer .playerTurn"),
      playerTurnDescription: document.querySelector(".hintsContainer .turnDescription")
    });
    _players.set(this, [new Player(1, "one", "Mängija 1"), new Player(2, "two", "Mängija 2")]);
    _phases.set(this, []);

    _turnDescription.set(this, {
      toActivatePiece: "Vali oma mängunupp (vajuta mängunupu peale)",
      toSelectPosition: "Paiguta mängunupp lauale (vajuta mõne mängulauale tekkinud positsiooni peale)",
      whenMoving: "Nuppu paigutatakse...",
      noThreeInRow: "Mängunupu paigutamisel ei saa tekkida kolmest rida"
    });


    // Methods
    _initializeMenu.set(this, (app) => {
      const menu = new Menu(app);
      menu.init();
    });

    _startPhaseOne.set(this, (app) => {
      this.activePhase = "one";
      const gamePhaseOne = new PhaseOne(app);
      this.phases.push(gamePhaseOne);
      gamePhaseOne.init();
    });

    _startPhaseTwo.set(this, () => {
      this.activePhase = "two";
      const app = this;
      const gamePhaseTwo = new PhaseTwo(app);
      this.phases.push(gamePhaseTwo);
      gamePhaseTwo.init();
    });
  }

  // Properties
  get selectors() { return _selectors.get(this); }
  get activePhase() { return _activePhase.get(this); }
  get players() { return _players.get(this); }
  get activePlayer() { return _activePlayer.get(this); }
  get deactivePlayer() { return _deactivePlayer.get(this); }
  get activePhase() { return _activePhase.get(this); }
  get turnDescription() { return _turnDescription.get(this); }
  get phases() { return _phases.get(this); }
  
  set selectors(value) { _selectors.set(this, value); }
  set activePlayer(value) { _activePlayer.set(this, value); }
  set deactivePlayer(value) { _deactivePlayer.set(this, value); }
  set activePhase(value) { _activePhase.set(this, value); }


  // Methods
  get initializeMenu() { return _initializeMenu.get(this); }
  get startPhaseOne() { return _startPhaseOne.get(this); }
  get startPhaseTwo() { return _startPhaseTwo.get(this); }

  init() {
    const app = this;
    this.initializeMenu(app);
    this.startPhaseOne(app);
  }
}

const app = new App();
app.init();

