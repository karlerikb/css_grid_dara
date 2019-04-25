export default class MenuButton {
  readonly type: string;
  readonly iconType: string;
  active: boolean = false;

  constructor(type: string, iconType: string) {
    this.type = type;
    this.iconType = iconType;
  }

  create(selectors: { element: any }) {
    console.log("creating... ", this, selectors);
  }

  remove(selectors: { element: any }) {
    console.log("removing... ", this, selectors);
  }
}