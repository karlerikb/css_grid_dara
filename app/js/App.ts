import { Settings } from "./conf/settings";
import { Configuration } from "./conf/configuration";
import { Player } from "./players/player";
import { PhaseOne } from "./game/phase-one";
import { PhaseTwo } from "./game/phase-two";
import { Menu } from "./menu/menu";

class App {
  private static _instance: App;
  private _settings: Settings;
  private _conf: Configuration;
  private menu: Menu = Menu.instance;

  private constructor() {
    this._settings = Settings.instance;
    this._conf = Configuration.instance;
    this.init();
  }

  private init(): void {
    this.createPlayers();
    this.initializePhases();
  }

  private createPlayers(): void {
    const playerOne = new Player("Mängija 1", 1, "one");
    const playerTwo = new Player("Mängija 2", 2, "two");
    this.conf.players.push(playerOne, playerTwo);
    playerOne.active = true;
  }

  private initializePhases(): void {
    const phaseOne = new PhaseOne();
    const phaseTwo = new PhaseTwo();
    this.conf.phases.push(phaseOne, phaseTwo);
    phaseOne.init();
  }

  public static get instance(): App {
    if (!App._instance) {
      App._instance = new App();
    }
    return App._instance;
  }
  public get settings() {
    return this._settings;
  }
  public set settings(settings: Settings) {
    this._settings = settings;
  }
  public get conf() {
    return this._conf;
  }
  public set conf(configuration: Configuration) {
    this._conf = configuration;
  }
}
App.instance;