export interface NewElement {
  type: string;
  id?: string;
  class?: string;
  text?: string;
  area?: string;
  parent: HTMLElement | DocumentFragment;
}