import { App } from "./app.js";

class Menu extends App {
  constructor() {
    super();
  }

  init() {
    console.log("init menu");
    super.selectors.newThing = "stuff";
    console.log(super.selectors);
    delete super.selectors.newThing;
    console.log(super.selectors);
  }
}

const menu = new Menu();
menu.init();
