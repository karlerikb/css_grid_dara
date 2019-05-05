import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";
import { Player } from "../players/player";

export abstract class Game {
  protected settings: Settings;
  protected conf: Configuration;

  constructor(settings: Settings, conf: Configuration) {
    this.settings = settings;
    this.conf = conf;
  }

  protected activatePlayer(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    activePlayer.piecesContainerElement.classList.add("active");
    inactivePlayer.piecesContainerElement.classList.remove("active");
  }
}