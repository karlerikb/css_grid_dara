import { NewElement } from "./interfaces";

export class Helper {

  public static upperCaseFirstLetter(str: string): string {
    const firstLetter: string = str.charAt(0).toUpperCase();
    if (str.length === 1) return firstLetter;
    if (str.length > 1) return firstLetter + str.slice(1);
    return "";
  }

  public static create(element: NewElement): HTMLElement {
    const newElement: HTMLElement = document.createElement(element.type);
    if (element.id) newElement.id = element.id;
    if (element.class) newElement.className = element.class;
    if (element.text) newElement.textContent = element.text;
    if (element.HTML) newElement.innerHTML = element.HTML;
    if (element.area) newElement.style.gridArea = element.area;
    element.parent.appendChild(newElement);
    return newElement;
  }
}