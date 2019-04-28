import Player from "../Player/Player";
import Game from "../Game/Game";
import { MenuButtons } from "../Menu/Menu";

export default class Settings {
  private static _instance: Settings;

  private _phases: Game[] = [];
  private _players: Player[] = [];
  private _menuBtns: MenuButtons[] = [];
  private _piecesForEachPlayer: number = 4;
  private _animationTime: string = ".5s";

  readonly menuOptions: string[] = ["resume", "exit"];
  readonly menuOptionsEst: string[] = ["Jätka mängu", "Välju mängust"];
  readonly selectors: any = {
    root: document.querySelector(":root"),
    gameContainer: document.querySelector(".gameContainer"),
    gameboard: document.querySelector(".gameboard")
  };
  public animationInProgress: boolean = false;

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
  public get menuBtns(): MenuButtons[] {
    return this._menuBtns;
  }
  public get piecesForEachPlayer(): number {
    return this._piecesForEachPlayer;
  }
  public get animationTime(): string {
    return this._animationTime;
  }

  public set menuBtns(value: MenuButtons[]) {
    this._menuBtns = value;
  }
  public set piecesForEachPlayer(value: number) {
    if (value > 0 && value < 13) this._piecesForEachPlayer = value;
    else throw new Error("The amount of player pieces must be between 1 and 12");
  }
  public set animationTime(value: string) {
    this._animationTime = value;
  }
}