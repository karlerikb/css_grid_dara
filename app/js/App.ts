import Settings from "./app/settings/Settings";
import Player from "./App/Player/Player";
import PhaseOne from "./App/Game/PhaseOne/PhaseOne";
import PhaseTwo from "./App/Game/PhaseTwo/PhaseTwo";
import Menu from "./App/Menu/Menu";

// ...
class App {
  private static _instance: App;

  private _settings: Settings = <Settings>{};
  private _menu: Menu = <Menu>{};

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
    const playerOne = new Player("Mängija 1", 1, "one", this.settings);
    const playerTwo = new Player("Mängija 2", 2, "two", this.settings);
    this.settings!.players.push(playerOne, playerTwo);
    playerOne.active = true;
  }

  private initializePhases(): void {
    console.log("Initializing game phases...");
    const phaseOne = new PhaseOne(this.settings);
    const phaseTwo = new PhaseTwo(this.settings);
    this.settings!.phases.push(phaseOne, phaseTwo);
    phaseOne.init();
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
  private get settings(): Settings {
    return this._settings;
  }
  private get menu(): Menu {
    return this._menu;
  }

  private set settings(value: Settings) {
    this._settings = value;
  }
  private set menu(value: Menu) {
    this._menu = value;
  }  
}
App.instance;

