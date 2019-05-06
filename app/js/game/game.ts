import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";
import { Player } from "../players/player";
import { GameMove } from "./move-states/game-move";

export abstract class Game {
  protected settings: Settings = Settings.instance;
  protected conf: Configuration = Configuration.instance;
  readonly gameTurn = new GameMove();

  constructor() {
  }

  protected activatePlayer(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    activePlayer.piecesContainerElement.classList.add("active");
    inactivePlayer.piecesContainerElement.classList.remove("active");
  }

  protected activateGameTurn(): void {
    this.gameTurn.state.enablePieceActivation();
  }
}