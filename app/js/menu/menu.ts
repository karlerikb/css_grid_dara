import { MenuButton, OpenMenu, CloseMenu } from "./menu-button";
import { Helper } from "../conf/helper";
import { Configuration } from "../conf/configuration";

export class Menu {
  private element: HTMLElement | null = null;
  private menuButtons: MenuButton[] = [OpenMenu.instance, CloseMenu.instance];
  private conf: Configuration = Configuration.instance;
  private static _instance: Menu;

  private constructor() {
    this.init();
  }

  private init(): void {
    (<MenuButton>this.menuButtons.find(btn => btn.active)).create();
  }

  open(): void {
    if (!this.element) {
      this.toggleMenuButton();
      this.create();
    }
  }

  close(): void {
    if (this.element) {
      this.toggleMenuButton();
      this.removeMenuElement();
    }
  }

  private create(): void {
    this.createMenuElement();
    this.createPlayerTitles();
    this.createMenuList();
  }

  private removeMenuElement(): void {
    (<HTMLElement>this.element).remove();
    this.element = null;
  }

  private createMenuElement(): void {
    const gameContainer: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameContainer);
    this.element = Helper.create({
      type: "div", class: this.conf.classes.menu,
      parent: gameContainer
    });
  }

  private createPlayerTitles(): void {
    this.conf.players.forEach(player => {
      const numberString: string = player.numberStringUpperCase;
      Helper.create({
        type: "div", class: `player${numberString}Title`, text: player.name,
        parent: <HTMLElement>this.element
      });
    });
  }

  private createMenuList(): void {
    const menuList: HTMLElement = Helper.create({
      type: "ul", class: this.conf.classes.menuList,
      parent: <HTMLElement>this.element
    });
    this.conf.menuItems.forEach(item => {
      const listItem = Helper.create({
        type: "li", class: item.option, text: item.text,
        parent: menuList
      });
      listItem.addEventListener("click", item.eventListener);
    });
  }

  private toggleMenuButton(): void {
    const activeBtn: MenuButton = <MenuButton>this.menuButtons.find(btn => btn.active);
    const inactiveBtn: MenuButton = <MenuButton>this.menuButtons.find(btn => !btn.active);
    activeBtn.active = false; activeBtn.remove();
    inactiveBtn.active = true; inactiveBtn.create();
  }

  public static get instance(): Menu {
    if (!Menu._instance) {
      Menu._instance = new Menu();
    }
    return Menu._instance;
  }
}