export class PressDownTimer {
  private static _instance: PressDownTimer;
  // used a guide https://www.kirupa.com/html5/press_and_hold.htm for hold and press functionality
  private time: number = 0;
  private timerFunctionId: number = 0;
  private timeMaxDuration: number = 40;
  private _element: HTMLElement | null = null;
  private rowSelectedEvent = new CustomEvent("rowselected");
  
  timerFunction(): void {
    if (PressDownTimer.instance.time < PressDownTimer.instance.timeMaxDuration) {
      PressDownTimer.instance.timerFunctionId = requestAnimationFrame(PressDownTimer.instance.timerFunction);
      PressDownTimer.instance.time++;
      (<HTMLElement>PressDownTimer.instance.element).style.setProperty(
        "--opacity-value", PressDownTimer.instance.calculateOpacityValue()
      );
    } else {
      if (PressDownTimer.instance.element) {
        PressDownTimer.instance.element.dispatchEvent(PressDownTimer.instance.rowSelectedEvent);
      }
    }
  }

  cancelTimer(): void {
    cancelAnimationFrame(PressDownTimer.instance.timerFunctionId);
    PressDownTimer.instance.time = 0;
    (<HTMLElement>PressDownTimer.instance.element).style.setProperty("--opacity-value", ".9");
    PressDownTimer.instance.element = null;
  }

  private calculateOpacityValue(): string {
    const minOpacity: number = 0.3, maxOpacity: number = 0.9;
    const increment: number = (maxOpacity - minOpacity) / PressDownTimer.instance.timeMaxDuration;
    return `${(minOpacity + maxOpacity) - (PressDownTimer.instance.time * increment + minOpacity)}`;
  }

  public static get instance(): PressDownTimer {
    if (!PressDownTimer._instance) {
      PressDownTimer._instance = new PressDownTimer();
    }
    return PressDownTimer._instance;
  }

  public get element(): HTMLElement | null {
    return this._element;
  }

  public set element(element: HTMLElement | null) {
    this._element = element;
  }
}