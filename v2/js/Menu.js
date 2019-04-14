import { Helper } from "./Helper.js";
import { Game } from "./Game.js";

const _gameObj = new WeakMap();
const _selectors = new WeakMap();
const _activeButton = new WeakMap();
const _buttonTypes = new WeakMap();
const _buttonIcons = new WeakMap();
const _menuListItems = new WeakMap();
const _menuListItemsEstTranslation = new WeakMap();

const _createMenuButton = new WeakMap();
const _createMenu = new WeakMap();
const _toggleMenu = new WeakMap();
const _createPlayerTitles = new WeakMap();
const _createMenuList = new WeakMap();


export class Menu {
  constructor(game) {
    _gameObj.set(this, game);
    _activeButton.set(this, "open");
    _buttonTypes.set(this, ["open", "close"]);
    _buttonIcons.set(this, ["fas fa-bars", "fas fa-times"]);
    _menuListItems.set(this, ["resume", "exit"]);
    _menuListItemsEstTranslation.set(this, ["Jätka mängu", "Välju mängust"]);

    _selectors.set(this, {
      gameContainer: document.querySelector(".gameContainer")
    });

    _createMenuButton.set(this, (type) => {
      const buttonIndex = _buttonTypes.get(this).findIndex(button => button === type);
      const gameContainer = _selectors.get(this).gameContainer;
      const menuButton = Helper.create({
        type: "div", class: `${type}MenuButton`, text: "",
        event: { type: "click", function: _toggleMenu.get(this) },
        parent: gameContainer
      });
      const menuButtonIcon = Helper.create({
        type: "i", class: _buttonIcons.get(this)[buttonIndex],
        parent: menuButton
      });
    });

    _toggleMenu.set(this, () => {
      const currentButton = document.querySelector(`.${this.activeButton}MenuButton`);
      if (currentButton) { 
        currentButton.remove();
        _createMenuButton.get(this)(this.newButtonType);
        this.activeButton = this.newButtonType;
      }
      if (this.activeButton === "close") {
        _createMenu.get(this)();
        _createPlayerTitles.get(this)();
        _createMenuList.get(this)();
      }
      if (this.activeButton === "open") {
        if (this.selectors.menuContainer) { 
          this.selectors.menuContainer.remove();
          delete this.selectors.menuContainer;
        }
      }
    });

    _createMenu.set(this, () => {
      const gameContainer = _selectors.get(this).gameContainer;
      const menu = Helper.create({
        type: "div", class: "menu",
        parent: gameContainer
      });
      if (!_selectors.get(this).menuContainer) _selectors.get(this).menuContainer = menu;
    });

    _createPlayerTitles.set(this, () => {
      const menuContainer = _selectors.get(this).menuContainer;
      this.game.players.forEach((player, index) => {
        const number = Helper.upperCaseFirstLetter(player);
        const playerTitle = Helper.create({
          type: "div", class: `player${number}Title`, text: this.game.playersEstLang[index],
          parent: menuContainer
        });
      });
    });

    _createMenuList.set(this, () => {
      const menuContainer = _selectors.get(this).menuContainer;
      const menuList = Helper.create({
        type: "ul", class: "gameMenuList",
        parent: menuContainer
      });
      this.menuOptions.forEach((option, index) => {
        const menuOption = Helper.create({
          type: "li", class: option, text: this.menuOptionsEstLang[index],
          parent: menuList
        });
      });
    });
  }

  get newButtonType() {
    const buttonTypes = _buttonTypes.get(this);
    const active = buttonTypes.findIndex(button => button === this.activeButton);
    return buttonTypes[+(!active)];
  }
  get activeButton() { return _activeButton.get(this); }
  get selectors() { return _selectors.get(this); }
  get game() { return _gameObj.get(this); }
  get menuOptions() { return _menuListItems.get(this); }
  get menuOptionsEstLang() { return _menuListItemsEstTranslation.get(this); }

  set selectors(value) { _selectors.set(this, value); }
  set activeButton(value) { _activeButton.set(this, value); }

  init() {
    _createMenuButton.get(this)("open");
  }
}