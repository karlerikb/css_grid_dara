import Settings from "../settings/Settings";
import Helper from "../Helper/Helper";

export default class Menu {
  private static _instance: Menu;
  private _settings: Settings = <Settings>{};

  private constructor() {
  }

  private initializeMenuButtons(): void {
    const openBtn = new OpenMenu(this.settings);
    const closeBtn = new CloseMenu(this.settings);
    this.settings.menuBtns.push(openBtn, closeBtn);
  }

  private initializeMenuCreation(): void {
    const activeBtn: any = this.settings.menuBtns.find((btn: any) => btn.active);
    activeBtn!.init();
  }

  public init(settings: Settings): void {
    this.settings = settings;
    this.initializeMenuButtons();
    this.initializeMenuCreation();
  }

  public static get instance(): Menu {
    if (!Menu._instance) {
      Menu._instance = new Menu();
    }
    return Menu._instance;
  }
  private get settings(): Settings {
    return this._settings;
  }
  private set settings(value: Settings) {
    this._settings = value;
  }
}

export abstract class MenuButtons {
  constructor(protected settings: Settings) {}

  protected createMenuButton(btn: any): HTMLElement {
    const menuBtn = Helper.create({
      type: "div",
      class: `${btn.type}MenuButton`,
      parent: this.settings.selectors.gameContainer
    });
    const icon = Helper.create({
      type: "i",
      class: btn.iconType,
      parent: menuBtn
    });
    return icon;
  }

  protected toggleBtn(button: any): void {
    const btn: any = this.switchBtns(button);
    btn.init();
  }

  private switchBtns(button: any): any {
    const activeBtn: any = button;
    const inactiveBtn: any = this.settings.menuBtns.find(btn => btn !== button);
    activeBtn.active = false;
    inactiveBtn.active = true;
    return inactiveBtn;
  }

}

class OpenMenu extends MenuButtons {
  active: boolean = true;
  readonly type: string = "open";
  readonly iconType: string = "fas fa-bars";
  private openMenuHandler: any = this.openMenu.bind(this);

  constructor(settings: Settings) {
    super(settings);
  }

  private openMenu(e: any): void {
    e.target.removeEventListener("click", this.openMenuHandler);
    e.target.parentElement.remove();
    this.createMenu();
    this.toggleBtn(this);
  }

  private createMenu(): void {
    const menu = Helper.create({
      type: "div",
      class: "menu",
      parent: this.settings.selectors.gameContainer
    });
    this.settings.players.forEach(player => {
      const number = Helper.upperCaseFirstLetter(player.numberString);
      Helper.create({
        type: "div", class: `player${number}Title`, text: player.name,
        parent: menu
      });
    });
    const menuList = Helper.create({
      type: "ul", class: "gameMenuList",
      parent: menu
    });
    this.settings.menuOptions.forEach((option, index) => {
      Helper.create({
        type: "li", class: option,
        text: this.settings.menuOptionsEst[index],
        parent: menuList
      });
    });
  }

  init(): void {
    const icon = this.createMenuButton(this);
    icon.addEventListener("click", this.openMenuHandler);
  }
}

class CloseMenu extends MenuButtons {
  active: boolean = false;
  readonly type: string = "close";
  readonly iconType: string = "fas fa-times";
  private closeMenuHandler: any = this.closeMenu.bind(this);

  constructor(settings: Settings) {
    super(settings);
  }

  private closeMenu(e: any): void {
    e.target.removeEventListener("click", this.closeMenuHandler);
    e.target.parentElement.remove();
    document.querySelector(".menu")!.remove();
    this.toggleBtn(this);
  }

  init(): void {
    const icon = this.createMenuButton(this);
    icon.addEventListener("click", this.closeMenuHandler);
  }
}















// class MenuButton extends Menu {
//   active: boolean = false;
//   readonly type: string;
//   readonly iconType: string;

//   openMenuHandler = this.openMenu.bind(this);
//   closeMenuHandler = this.closeMenu.bind(this);

//   constructor(type: string, iconType: string, settings: Settings) {
//     super(settings);
//     this.type = type;
//     this.iconType = iconType;
//   }

//   createMenu(): void {
//     console.log(this.buttons);
//     const icon = this.createMenuButton();
//     icon.addEventListener("click", this.openMenuHandler);
//   }

//   removeMenu(): void {
//     const icon = this.createMenuButton();
//     icon.addEventListener("click", this.closeMenuHandler);
//   }

//   private openMenu(e): void {
//     e.target.removeEventListener("click", this.openMenuHandler);
//     const btn = this.toggleButton(e);
//     console.log(btn);
//     btn!.removeMenu();

//     const menu = Helper.create({
//       type: "div",
//       class: "menu",
//       parent: this.settings.selectors.gameContainer
//     });
//   }

//   private closeMenu(e): void {
//     e.target.removeEventListener("click", this.closeMenuHandler);
//     const btn = this.toggleButton(e);
//     btn!.createMenu();

//     document.querySelector(".menu")!.remove();
//   }

//   private toggleButton(e) {
//     const inactiveBtn = this.buttons.find(btn => btn !== this);
//     e.target.parentElement.remove();
//     return inactiveBtn;
//   }

//   private createMenuButton(): HTMLElement {
//     console.log(this.settings);
//     const menuBtn = Helper.create({
//       type: "div",
//       class: `${this.type}MenuButton`,
//       parent: this.settings.selectors.gameContainer
//     });
//     const icon = Helper.create({
//       type: "i",
//       class: this.iconType,
//       parent: menuBtn
//     });
//     return icon;
//   }
// }