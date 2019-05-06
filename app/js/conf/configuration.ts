import { Player } from "../players/player";
import { Game } from "../game/game";
import { Phase, EventListenerCollection } from "./custom-types";
import { Piece } from "../players/piece";

export class Configuration {
  private static _instance: Configuration;
  private _players: Player[] = [];
  private _phases: Game[] = [];

  private _eventListeners: EventListenerCollection = {
    pieceActivation: this.activatePiece.bind(this)
  };

  acitvePiece: Piece | null = null;

  private constructor() {
  }

  private activatePiece(e: MouseEvent): void {
    const activePhase: Phase = <Phase>this.phases.find((phase: any) => phase.active);
    activePhase.activatePiece(e);
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
  public get eventListeners(): any {
    return this._eventListeners;
  }
}