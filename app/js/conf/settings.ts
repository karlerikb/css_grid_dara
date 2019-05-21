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
    this.createWelcomeMessage();
  }

  resetSettingsMenu(): void {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
    this.showMenuList();
  }

  reset(): void {
    Settings._instance = null;
  }

  open(): void {
    this.hidingMenuList();
    this.createSettingsElements();
  }

  private createWelcomeMessage(): void {
    const welcomeMsg = Helper.create({
      type: "div", class: "welcomeMsg",
      parent: <HTMLElement>document.querySelector(this.conf.selectors.gameContainer)
    });
    this.createWelcomeMessageTitle(welcomeMsg);
    this.createPhaseOneRules(welcomeMsg);
    this.createMainRules(welcomeMsg);
    this.createPhaseTwoRules(welcomeMsg);
    this.createStartGameBtn(welcomeMsg);
  }

  private createWelcomeMessageTitle(welcomeMsg: HTMLElement): void {
    const welcomeHeading: HTMLElement = Helper.create({
      type: "div", class: "welcomeHeading",
      parent: welcomeMsg
    });
    Helper.create({
      type: "h1", class: "mainTitle", text: "Dara",
      parent: welcomeHeading
    });
    Helper.create({
      type: "p", class: "subTitle", text: "Kolm ritta tüüpi mäng",
      parent: welcomeHeading
    });
  }

  private createPhaseOneRules(welcomeMsg: HTMLElement): void {
    const phaseOneRuleTexts: string[] = [
      "Strateegiline mänguosa enne mängu põhifaasi",
      "Nuppe paigutatakse lauale",
      "Ühel mängulaua positsioonil tohib olla vaid üks mängunupp",
      "Oma nuppudega kolmest rida selles faasis tekkida ei tohi"
    ];
    const phaseOneRules: HTMLElement = Helper.create({
      type: "div", class: "phaseRules phaseOneRules",
      parent: welcomeMsg
    });
    Helper.create({
      type: "h2", text: "Esimene faas",
      parent: phaseOneRules
    });
    const rules: HTMLElement = Helper.create({
      type: "ul", class: "rules",
      parent: phaseOneRules
    });
    phaseOneRuleTexts.forEach(rule => {
      Helper.create({
        type: "li", text: rule,
        parent: rules
      });
    });
  }

  private createPhaseTwoRules(welcomeMsg: HTMLElement): void {
    const phaseTwoRuleTexts: string[] = [
      "Nuppe liigutatakse laual ühe positsiooni võrra horisontaalselt või vertikaalselt",
      "Eesmärk on tekitada oma nuppudega kolmene rida ja eemaldada vastase mängunupp",
      "Vastase nuppu ei saa eemaldada kolmesest reast",
      "Tekkida võib ainult üks kolmene rida korraga",
      "Oma nuppudega neljast rida tekkida ei tohi"
    ];
    const phaseTwoRules: HTMLElement = Helper.create({
      type: "div", class: "phaseRules phaseTwoRules",
      parent: welcomeMsg
    });
    Helper.create({
      type: "h2", text: "Teine faas",
      parent: phaseTwoRules
    });
    const rules: HTMLElement = Helper.create({
      type: "ul", class: "rules",
      parent: phaseTwoRules
    });
    phaseTwoRuleTexts.forEach(rule => {
      Helper.create({
        type: "li", text: rule,
        parent: rules
      });
    });
  }

  private createMainRules(welcomeMsg: HTMLElement): void {
    const mainRuleTexts: string[] = [
      "Mäng käib kahes faasis: <strong>nuppude paigutamise</strong> ja <strong>nuppude liigutamise</strong> faasis",
      "Eesmärgiks on tekitada kolmene rida ning selle tekkimisel eemaldada üks vastase mängunupp",
      "Võidab mängija kelle vastane ei saa enam tekitada kolmest rida"
    ];
    const mainRules: HTMLElement = Helper.create({
      type: "div", class: "mainRules",
      parent: welcomeMsg
    });
    const rules: HTMLElement = Helper.create({
      type: "ul", class: "rules",
      parent: mainRules
    });
    mainRuleTexts.forEach(rule => {
      Helper.create({
        type: "li", HTML: rule,
        parent: rules
      });
    });
  }

  private createStartGameBtn(welcomeMsg: HTMLElement): void {
    const createGameBtn: HTMLElement = Helper.create({
      type: "div", class: "startGameBtn", text: "Alusta mängu!",
      parent: welcomeMsg
    });
    createGameBtn.addEventListener("click", () => {
      App.instance.create();
      this.resetWelcomeMessage();
    });
  }

  private resetWelcomeMessage(): void {
    const welcomeMsg: HTMLElement = <HTMLElement>document.querySelector(".welcomeMsg");
    if (welcomeMsg) {
      welcomeMsg.remove();
    }
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