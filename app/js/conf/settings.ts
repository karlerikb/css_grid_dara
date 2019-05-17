import { Configuration } from "./configuration";
import { Helper } from "./helper";
import { App } from "../app";

export class Settings {
  private static _instance: Settings | null;
  private conf: Configuration = Configuration.instance;
  private _piecesForEachPlayer: number = 12;
  private _animationTime: string = ".5s";
  private element: HTMLElement | null = null;

  private settingItems = [
    {
      name: "piecesAmount", text: "Mängijanuppude arv:", details: {
        type: "range", step: 1, min: 3, max: 12, value: 12
      },
      settingValue: `<span class="settingValue"></span>`
    },
    {
      name: "movingSpeed", text: "Nuppude liikumise kiirus:", details: {
        type: "range", step: 1, min: 1, max: 20, value: 5,
      },
      settingValue: `<span class="detailsForValue"><span class="settingValue"></span>s</span>`
    }
  ];

  private constructor() {
  }

  reset(): void {
    Settings._instance = null;
  }

  open(): void {
    this.hidingMenuList();
    this.createSettingsElements();
  }

  private createSettingsElements(): void {
    this.createSettingsMenu();
    this.createSettingsCloseBar();
    this.createSettingListItems();
    this.createSettingsConfirmBar();
  }

  private createSettingsMenu(): void {
    const menu: HTMLElement = <HTMLElement>document.querySelector(`.${this.conf.classes.menu}`);
    if (!this.element) {
      this.element = Helper.create({
        type: "div", class: "settingsMenu",
        parent: menu
      });
    }
  }

  private createSettingsCloseBar(): void {
    Helper.create({
      type: "div", class: "settingsControlsTop",
      HTML: `<span class="closeSettings"><i class="fas fa-times"></i></span>`,
      parent: <HTMLElement>this.element
    });
    this.attachCloseSettingsEventListener();
  }

  private createSettingsConfirmBar(): void {
    Helper.create({
      type: "div", class: "settingsControlsBottom",
      HTML: `
        <span class="confirmText">Seadete muutmisel alustatakse mängu algusest</span>
        <span class="confirmSettings"><i class="fas fa-check"></i></span>
      `,
      parent: <HTMLElement>this.element
    });
    this.attachConfirmSettingsEventListener();
  }

  private createSettingListItems(): void {
    this.settingItems.forEach(setting => {
      const classes: string = `${this.conf.classes.settingItem} ${setting.name}`;
      Helper.create({
        type: "div", class: classes, 
        HTML: `
          <p class="settingText">${setting.text} ${setting.settingValue}</p>
          <input
            type="${setting.details.type}",
            step="${setting.details.step}",
            min="${setting.details.min}",
            max="${setting.details.max}"
            value="${setting.details.value}">
        `,
        parent: <HTMLElement>this.element
      });
      this.attachInputEventListener(setting.name, setting.details.value);
    });
  }

  private attachInputEventListener(setting: string, value: number): void {
    const settingValue: HTMLElement = <HTMLElement>document.querySelector(
      `.${setting} .settingValue`
    );
    const input: HTMLElement = <HTMLElement>document.querySelector(
      `.${setting} input`
    );
    if ((<HTMLElement>settingValue.parentElement).classList.contains("detailsForValue")) {
      settingValue.textContent = `${value / 10}`;
    } else {
      settingValue.textContent = `${value}`;
    }
    input.addEventListener("input", (e: any) => {
      if (e.target.parentElement.classList.contains("movingSpeed")) {
        settingValue.textContent = `${+e.target.value / 10}`;
      } else {
        settingValue.textContent = e.target.value;
      }
    });
  }

  private attachCloseSettingsEventListener(): void {
    const closeSettingsBtn: HTMLElement = <HTMLElement>document.querySelector(".closeSettings");
    closeSettingsBtn.addEventListener("click", () => {
      this.resetSettingsMenu();
    });
  }

  private attachConfirmSettingsEventListener(): void {
    const confirmSettingsBtn: HTMLElement = <HTMLElement>document.querySelector(".confirmSettings");
    confirmSettingsBtn.addEventListener("click", () => {
      const gamePieces: HTMLInputElement = <HTMLInputElement>document.querySelector(".piecesAmount input");
      const movingSpeed: HTMLInputElement = <HTMLInputElement>document.querySelector(".movingSpeed input");
      this.piecesForEachPlayer = +gamePieces.value;
      this.animationTime = movingSpeed.value;
      App.instance.reset();
    });
  }

  private hidingMenuList(): void {
    const menuList: HTMLElement = <HTMLElement>document.querySelector(`.${this.conf.classes.menuList}`);
    menuList.classList.add(this.conf.classes.removed);
  }

  private showMenuList(): void {
    const menuList: HTMLElement = <HTMLElement>document.querySelector(`.${this.conf.classes.menuList}`);
    if (menuList) {
      menuList.classList.remove(this.conf.classes.removed);
    }
  }

  resetSettingsMenu(): void {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
    this.showMenuList();
  }

  public static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }
  public get piecesForEachPlayer(): number {
    return this._piecesForEachPlayer;
  }
  public set piecesForEachPlayer(value: number) {
    if (value > 2 && value < 13) {
      this._piecesForEachPlayer = value;
    }
  }
  public get animationTime(): string {
    return this._animationTime;
  }
  public set animationTime(value: string) {
    if (+value > 0 && +value < 21) {
      const duration: string = `${+value / 10}s`;
      this._animationTime = duration;
    }
  }
}