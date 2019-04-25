import { NewElement } from "../../interfaces/Interfaces";

export default class Helper {
  
  public static create(element: NewElement): HTMLElement {
    const newElement = document.createElement(element.type);
    if (element.id) newElement.id = element.id;
    if (element.class) newElement.className = element.class;
    if (element.text) newElement.textContent = element.text;
    if (element.eventlistener) newElement.addEventListener(element.eventlistener.type, element.eventlistener.function);
    element.parent.appendChild(newElement);
    return newElement;
  }
}