export class Settings {
  private static _instance: Settings;
  private _piecesForEachPlayer: number = 3;
  private _animationTime: string = ".5s";

  private constructor() {
  }

  public static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }

  public get piecesForEachPlayer(): number {
    return this._piecesForEachPlayer;
  }
  public get animationTime(): string {
    return this._animationTime;
  }
}