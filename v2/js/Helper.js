export class Helper {

  static create(element) {
    if (!element.type || !element.parent) {
      throw new Error("Please provide an element type and it's parent element.");
    }
    const child = document.createElement(element.type);
  
    if (element.class) child.className = element.class;
    if (element.text) child.textContent = element.text;

    if (element.event) {
      if ((element.event.type && !element.event.function) || (!element.event.type && element.event.function)) {
        throw new Error("Please provide both the eventlistener type and it's function.");
      } else {
        child.addEventListener(element.event.type, element.event.function);
      }
    }
    if (child) {
      element.parent.appendChild(child);
      return child;
    } else {
      throw new Error("Error creating an HTML element");
    }
  }

  static upperCaseFirstLetter(string) {
    if (string.length === 0) return "";
    const firstLetter = string.charAt(0).toUpperCase();
    if (string.length === 1) return firstLetter;
    if (string.length > 1) return firstLetter + string.slice(1);
    throw new Error("Error uppercasing first letter of the string");
  }
}