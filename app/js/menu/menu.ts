import { MenuButton, OpenMenu, CloseMenu } from "./menu-button";
import { Helper } from "../conf/helper";
import { Configuration } from "../conf/configuration";
import { Settings } from "../conf/settings";

export class Menu {
  private gameOver: boolean = false;
  private element: HTMLElement | null = null;
  private menuButtons: MenuButton[] = [OpenMenu.instance, CloseMenu.instance];
  private conf: Configuration = Configuration.instance;
  private static _instance: Menu | null;

  private constructor() {
    this.init();
  }

  private init(): void {
    OpenMenu.instance.active = true;
    CloseMenu.instance.active = false;
    OpenMenu.instance.element = null;
    CloseMenu.instance.element = null;
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
      Settings.instance.resetSettingsMenu();
    }
  }

  setWinScenarioInMenu(): void {
    this.gameOver = true;
    this.open();
  }

  reset(): void {
    Menu.instance.menuButtons = [];
    Menu._instance = null;
  }

  private create(): void {
    this.createMenuElement();
    this.createPlayerTitles();
    this.createMenuList();
    if (this.gameOver) {
      this.configureWinningPlayer();
      this.createWinScenarioTitle();
      this.createWinScenarioMenu();
    }
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
    this.createMenuListItems(menuList);
  }

  private createMenuListItems(menuList: HTMLElement): void {
    this.conf.menuItems.forEach(item => {
      if (item.active) {
        const listItem = Helper.create({
          type: "li", class: item.option, text: item.text,
          parent: menuList
        });
        listItem.addEventListener("click", item.eventListener);
      }
    });
  }

  private toggleMenuButton(): void {
    const activeBtn: MenuButton = <MenuButton>this.menuButtons.find(btn => btn.active);
    const inactiveBtn: MenuButton = <MenuButton>this.menuButtons.find(btn => !btn.active);
    activeBtn.active = false; activeBtn.remove();
    inactiveBtn.active = true; inactiveBtn.create();
  }

  private configureWinningPlayer(): void {
    const winningPlayerTitle: HTMLElement = <HTMLElement>document.querySelector(
      `.player${this.conf.activePlayer.numberStringUpperCase}Title`
    );
    winningPlayerTitle.innerHTML = `
      <div>${this.conf.activePlayer.name}</div>
      <div class="trophy"><i class="fas fa-trophy"></i></div>
    `;
  }

  private createWinScenarioTitle(): void {
    const winningText: string = `
      <strong>Mäng on läbi!</strong> <span class="winningPlayer">${this.conf.activePlayer.name}</span> võitis!
    `;
    Helper.create({
      type: "div", class: this.conf.classes.winScenarioTitle,
      HTML: winningText,
      parent: <HTMLElement>this.element
    });
  }

  private createWinScenarioMenu(): void {
    const menuList: HTMLElement = (<HTMLElement>document.querySelector(`.${this.conf.classes.menuList}`));
    menuList.innerHTML = "";
    this.conf.menuItems.forEach(item => {
      if (item.option === "restart") item.active = true;
      if (item.option === "resume") item.active = false;
    });
    this.createMenuListItems(menuList);
  }

  public static get instance(): Menu {
    if (!Menu._instance) {
      Menu._instance = new Menu();
    }
    return Menu._instance;
  }
}