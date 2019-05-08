import { Settings } from "../conf/settings";
import { Configuration } from "../conf/configuration";
import { Player } from "../players/player";
import { GameTurn } from "./turn-states/game-turn";

export abstract class Game {
  protected settings: Settings = Settings.instance;
  protected conf: Configuration = Configuration.instance;
  readonly gameTurn = new GameTurn();

  constructor() {
  }

  protected activatePlayer(): void {
    const activePlayer: Player = <Player>this.conf.players.find(player => player.active);
    const inactivePlayer: Player = <Player>this.conf.players.find(player => !player.active);
    activePlayer.piecesContainerElement.classList.add(this.conf.classes.activeContainer);
    inactivePlayer.piecesContainerElement.classList.remove(this.conf.classes.activeContainer);
  }

  protected activateGameTurn(): void {
    this.gameTurn.state.enablePieceActivation();
  }

  protected removeGameboardPositions(): void {

  }
}