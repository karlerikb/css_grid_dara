import { Menu } from "./Menu.js";
import { Game } from "./Game.js";

class App {
  static init() {
    const game = new Game();
    const menu = new Menu(game);

    game.init();
    menu.init();
  }
}

App.init();

