import { Player } from "../players/player";
import { Game } from "../game/game";

export class Configuration {
  private static _instance: Configuration;
  private _players: Player[] = [];
  private _phases: Game[] = [];

  private constructor() {
  }

  public static get instance(): Configuration {
    if (!Configuration._instance) {
      Configuration._instance = new Configuration();
    }
    return Configuration._instance;
  }

  public get players(): Player[] {
    return this._players;
  }
  public get phases(): Game[] {
    return this._phases;
  }
}