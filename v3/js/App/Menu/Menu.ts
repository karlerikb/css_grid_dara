import MenuButton from "./Button/MenuButton";
import Settings from "../settings/Settings";
import Helper from "../Helper/Helper";

export default class Menu {
  private static _instance: Menu;
  private _settings: Settings | null = null;
  private buttons: MenuButton[] = [];

  private constructor() {
  }

  private createMenu(): void {
    const selectors = (this.settings) ? this.settings.selectors : null;
    const element = {
      type: "div",
      class: "menu",
      parent: selectors.gameContainer
    }
    // const menu = Helper.create(element);
    const activeBtn = this.buttons.find(btn => btn.active);
    const inactiveBtn = this.buttons.find(btn => !btn.active);
    if (activeBtn) activeBtn.create(this.settings!.selectors);
    if (inactiveBtn) inactiveBtn.remove(this.settings!.selectors);
  }

  private initializeButtons(): void {
    const openButton = new MenuButton("open", "fas fa-bars");
    const closeButton = new MenuButton("close", "fas fa-times");
    this.buttons.push(openButton, closeButton);
    openButton.active = true;
  }

  private init(settings: Settings | null): void {
    this.settings = settings;
    this.initializeButtons();
    this.createMenu();
  }

  public static create(settings: Settings | null): Menu {
    if (!Menu._instance) {
      Menu._instance = new Menu();
      Menu._instance.init(settings);
    }
    return Menu._instance;
  }
  public get settings(): Settings | null {
    return this._settings;
  }

  public set settings(value: Settings | null) {
    this._settings = value;
  }
}