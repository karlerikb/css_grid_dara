import { NewElement } from "../../interfaces/Interfaces";

export default class Helper {

  public static create(element: NewElement): HTMLElement {
    const newElement = document.createElement(element.type);
    if (element.id) newElement.id = element.id;
    if (element.class) newElement.className = element.class;
    if (element.text) newElement.textContent = element.text;
    if (element.area) newElement.style.gridArea = element.area;
    element.parent.appendChild(newElement);
    return newElement;
  }

  public static upperCaseFirstLetter(string: string) {
    if (string.length === 0) return "";
    const firstLetter = string.charAt(0).toUpperCase();
    if (string.length === 1) return firstLetter;
    if (string.length > 1) return firstLetter + string.slice(1);
  }
}