export interface NewElement {
  type: string;
  class?: string;
  id?: string;
  text?: string;
  eventlistener?: NewElementEventListener;
  parent: HTMLElement;
}

export interface NewElementEventListener {
  type: string;
  function: (e?: any) => void;
}