import { Settings } from "./conf/settings";
import { Configuration } from "./conf/configuration";
import { Player } from "./players/player";
import { PhaseOne } from "./game/phaseOne";
import { PhaseTwo } from "./game/phaseTwo";

class App {
  private static _instance: App;
  private _settings: Settings;
  private _conf: Configuration

  private constructor() {
    this._settings = Settings.instance;
    this._conf = Configuration.instance;
    this.init();
  }

  private init(): void {
    this.createPlayers();
    this.initializePhases();
    console.log(this.settings, this.conf);
  }

  private createPlayers(): void {
    const playerOne = new Player("Mängija 1", 1, "one", this.settings, this.conf);
    const playerTwo = new Player("Mängija 2", 2, "two", this.settings, this.conf);
    this.conf.players.push(playerOne, playerTwo);
    playerOne.active = true;
  }

  private initializePhases(): void {
    const phaseOne = new PhaseOne(this.settings, this.conf);
    const phaseTwo = new PhaseTwo(this.settings, this.conf);
    this.conf.phases.push(phaseOne, phaseTwo);
    phaseOne.init();
  }

  public static get instance(): App {
    if (!App._instance) {
      App._instance = new App();
    }
    return App._instance;
  }

  public set settings(settings: Settings) {
    this._settings = settings;
  }
  public set conf(configuration: Configuration) {
    this._conf = configuration;
  }

  public get settings() {
    return this._settings;
  }
  public get conf() {
    return this._conf;
  }
}

App.instance;