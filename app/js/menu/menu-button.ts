import { Helper } from "../conf/helper";
import { Configuration } from "../conf/configuration";

export abstract class MenuButton {
  active: boolean = false;
  element: HTMLElement | null = null;
  protected conf: Configuration = Configuration.instance;
  readonly type: string = "";
  readonly iconType: string = "";
  protected eventListener: (e: any) => void = () => {};

  constructor() {
  }

  protected createButtonElements(): void {
    this.createMenuButtonElement();
    this.createMenuButtonIconElement();
  }

  protected createMenuButtonElement(): void {
    const gameContainer: HTMLElement = <HTMLElement>document.querySelector(this.conf.selectors.gameContainer);
    this.element = Helper.create({
      type: "div", class: `menuButton ${this.type}MenuButton`,
      parent: gameContainer
    });
  }

  protected createMenuButtonIconElement(): void {
    Helper.create({
      type: "i", class: this.iconType,
      parent: <HTMLElement>this.element
    });
    (<HTMLElement>this.element).addEventListener("click", this.eventListener);
  }

  create(): void {
    if (!this.element) this.createButtonElements();
  }

  remove(): void {
    if (this.element) {
      this.element.removeEventListener("click", this.eventListener);
      this.element.remove();
      this.element = null;
    }
  }
}


export class OpenMenu extends MenuButton {
  active: boolean = true;
  element: HTMLDivElement | null = null;
  readonly type: string = "open";
  readonly iconType: string = "fas fa-bars";
  protected eventListener: (e: any) => void = this.conf.eventListeners.openingMenu;
  private static _instance: OpenMenu;

  private constructor() {
    super();
  }

  public static get instance(): OpenMenu {
    if (!OpenMenu._instance) {
      OpenMenu._instance = new OpenMenu();
    }
    return OpenMenu._instance;
  }
}


export class CloseMenu extends MenuButton {
  active: boolean = false;
  element: HTMLDivElement | null = null;
  readonly type: string = "close";
  readonly iconType: string = "fas fa-times";
  protected eventListener: (e: any) => void = this.conf.eventListeners.closingMenu;
  private static _instance: CloseMenu;

  private constructor() {
    super();
  }

  public static get instance(): CloseMenu {
    if (!CloseMenu._instance) {
      CloseMenu._instance = new CloseMenu();
    }
    return CloseMenu._instance;
  }
}