import { Helper } from "./Helper.js";

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
const _initMenu = new WeakMap();
const _app = new WeakMap();

export class Menu {
  constructor(app) {

    // Properties
    _app.set(this, app);
    _activeButton.set(this, "open");
    _buttonTypes.set(this, ["open", "close"]);
    _buttonIcons.set(this, ["fas fa-bars", "fas fa-times"]);
    _menuListItems.set(this, ["resume", "exit"]);
    _menuListItemsEstTranslation.set(this, ["Jätka mängu", "Välju mängust"]);


    // Methods
    _createMenuButton.set(this, (type) => {
      const buttonIndex = this.buttonTypes.findIndex(button => button === type);
      const gameContainer = this.app.selectors.gameContainer;
      const menuButton = Helper.create({
        type: "div", class: `${type}MenuButton`, text: "",
        event: { type: "click", function: this.toggleMenu },
        parent: gameContainer
      });
      const menuButtonIcon = Helper.create({
        type: "i", class: this.buttonIcons[buttonIndex],
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
        if (this.app.selectors.menuContainer) { 
          this.app.selectors.menuContainer.remove();
          delete this.app.selectors.menuContainer;
        }
      }
    });

    _createMenu.set(this, () => {
      const gameContainer = this.app.selectors.gameContainer;
      const menu = Helper.create({
        type: "div", class: "menu",
        parent: gameContainer
      });
      if (!this.app.selectors.menuContainer) this.app.selectors.menuContainer = menu;
    });

    _createPlayerTitles.set(this, () => {
      const menuContainer = this.app.selectors.menuContainer;
      this.app.players.forEach(player => {
        const number = Helper.upperCaseFirstLetter(player.numberString);
        const playerTitle = Helper.create({
          type: "div", class: `player${number}Title`, text: player.name,
          parent: menuContainer
        });
      });
    });

    _createMenuList.set(this, () => {
      const menuContainer = this.app.selectors.menuContainer;
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

    _initMenu.set(this, () => {
      this.createMenuButton("open");
    });
  }

  // Properties
  get app() { return _app.get(this); }
  get activeButton() { return _activeButton.get(this); }
  get buttonTypes() { return _buttonTypes.get(this); }
  get buttonIcons() { return _buttonIcons.get(this); }
  get newButtonType() {
    const buttonTypes = _buttonTypes.get(this);
    const active = buttonTypes.findIndex(button => button === this.activeButton);
    return buttonTypes[+(!active)];
  }
  get menuOptions() { return _menuListItems.get(this); }
  get menuOptionsEstLang() { return _menuListItemsEstTranslation.get(this); }

  set activeButton(value) { _activeButton.set(this, value); }


  // Methods
  get initMenu() { return _initMenu.get(this); }
  get createMenuButton() { return _createMenuButton.get(this); }
  get toggleMenu() { return _toggleMenu.get(this); }
  get createMenuButton() { return _createMenuButton.get(this); }


  init() {
    this.initMenu();
  }
}