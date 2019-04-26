export interface NewElement {
  type: string;
  class?: string;
  id?: string;
  text?: string;
  area?: string;
  parent: HTMLElement | DocumentFragment;
}