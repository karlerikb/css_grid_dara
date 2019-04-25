export default class Player {
  name: string;
  number: number;
  numberString: string;
  active: boolean = false;

  constructor(name: string, number: number, numberString: string) {
    this.name = name;
    this.number = number;
    this.numberString = numberString;
  }
}