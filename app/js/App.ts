import { Settings } from "./conf/settings";
import { Configuration } from "./conf/configuration";
import { Player } from "./players/player";
import { PhaseOne } from "./game/phase-one";
import { PhaseTwo } from "./game/phase-two";
import { Menu } from "./menu/menu";
import { Hints } from "./hints/hints";

export class App {
  private static _instance: App;

  private constructor() {
    this.init();
  }

  private init(): void {
    Settings.instance;
  }

  create(): void {
    this.createPlayers();
    this.initializePhases();
    Menu.instance;
  }

  private createPlayers(): void {
    const playerOne = new Player("Mängija 1", 1, "one");
    const playerTwo = new Player("Mängija 2", 2, "two");
    Configuration.instance.players.push(playerOne, playerTwo);
    playerOne.active = true;
  }

  private initializePhases(): void {
    const phaseOne = new PhaseOne();
    const phaseTwo = new PhaseTwo();
    Configuration.instance.phases.push(phaseOne, phaseTwo);
    phaseOne.init();
  }

  private resetElements(): void {
    const playerOnePiecesContainer: HTMLElement = (<HTMLElement>document.querySelector(Configuration.instance.selectors.playerOnePiecesContainer));
    const playerTwoPiecesContainer: HTMLElement = (<HTMLElement>document.querySelector(Configuration.instance.selectors.playerTwoPiecesContainer));
    const gameboard: HTMLElement = (<HTMLElement>document.querySelector(Configuration.instance.selectors.gameboard));
    const hintsContainer: HTMLElement = (<HTMLElement>document.querySelector(`.${Configuration.instance.classes.hintsContainer}`));
    const menuButton: HTMLElement = (<HTMLElement>document.querySelector(`.${Configuration.instance.classes.menuButton}`));

    playerOnePiecesContainer.classList.remove(Configuration.instance.classes.activeContainer);
    playerTwoPiecesContainer.classList.remove(Configuration.instance.classes.activeContainer);
    playerOnePiecesContainer.innerHTML = "";
    playerTwoPiecesContainer.innerHTML = "";
    gameboard.innerHTML = "";
    hintsContainer.innerHTML = "";

    if (document.querySelector(`.${Configuration.instance.classes.menu}`)) {
      (<HTMLElement>document.querySelector(`.${Configuration.instance.classes.menu}`)).remove();
    }
    menuButton.remove();
  }
  private resetComponents(): void {
    Hints.instance.reset();
    Menu.instance.reset();
    Configuration.instance.players = [];
    Configuration.instance.phases = [];
    Configuration.instance.reset();
    Settings.instance.resetSettingsMenu();
  }

  reset(): void {
    this.resetElements();
    this.resetComponents();
    this.create();
  }

  public static get instance(): App {
    if (!App._instance) {
      App._instance = new App();
    }
    return App._instance;
  }
}
App.instance;