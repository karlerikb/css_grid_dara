import Settings from "./app/settings/Settings";
import Player from "./App/Player/Player";
import PhaseOne from "./App/Game/PhaseOne/PhaseOne";
import PhaseTwo from "./App/Game/PhaseTwo/PhaseTwo";
import Menu from "./App/Menu/Menu";

class App {
  private static _instance: App;

  private _settings: Settings | null = null;
  private _menu: Menu | null = null;

  private constructor() {
  }

  private init(): void {
    console.log("App created!");
    this.initializeSettings();
    this.initializePlayers();
    this.initializePhases();
    this.initializeMenu();
  }

  private initializeSettings(): void {
    this.settings = Settings.instance;
  }

  private initializePlayers(): void {
    console.log("Creating players...");
    const playerOne = new Player("Mängija 1", 1, "one");
    const playerTwo = new Player("Mängija 2", 2, "two");
    if (this.settings) this.settings.players.push(playerOne, playerTwo);
    playerOne.active = true;
  }

  private initializePhases(): void {
    console.log("Initializing game phases...");
    const phaseOne = new PhaseOne();
    const phaseTwo = new PhaseTwo();
    if (this.settings) this.settings.phases.push(phaseOne, phaseTwo);
    phaseOne.active = true;
  }

  private initializeMenu(): void {
    this.menu = Menu.instance;
    this.menu.init(<Settings>this.settings);
  }

  public static get instance(): App {
    if (!App._instance) {
      App._instance = new App();
      App._instance.init();
    }
    return App._instance;
  }
  private get settings(): Settings | null {
    return this._settings;
  }
  private get menu(): Menu | null {
    return this._menu;
  }

  private set settings(value: Settings | null) {
    this._settings = value;
  }
  private set menu(value: Menu | null) {
    this._menu = value;
  }  
}
App.instance;

