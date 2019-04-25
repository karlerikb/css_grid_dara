import Player from "../Player/Player";
import Game from "../Game/Game";

export default class Settings {
  private static _instance: Settings;

  private _phases: Game[] = [];
  private _players: Player[] = [];
  private _piecesForEachPlayer: number = 12;
  public readonly selectors: any = {
    root: document.querySelector(":root"),
    gameContainer: document.querySelector(".gameContainer"),
    gameboard: document.querySelector(".gameboard")
  };

  private constructor() {
  }

  public static get instance(): Settings {
    if (!Settings._instance) Settings._instance = new Settings();
    return Settings._instance;
  }

  public get players(): Player[] {
    return this._players;
  }

  public get phases(): Game[] {
    return this._phases;
  }

  public get piecesForEachPlayer(): number {
    return this._piecesForEachPlayer;
  }

  public set piecesForEachPlayer(value: number) {
    if (value > 0 && value < 13) this._piecesForEachPlayer = value;
    else throw new Error("The amount of player pieces must be between 1 and 12");
  }
}