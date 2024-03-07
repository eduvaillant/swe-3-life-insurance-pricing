import { InvalidCapitalError } from '@domain/error';

export class Capital {
  private value: number;

  constructor(capital: number) {
    if (!this.isValidCapital(capital)) throw new InvalidCapitalError();
    this.value = capital;
  }

  private isValidCapital(capital: number): boolean {
    return capital % 10 === 0 && capital >= 1000;
  }

  getValue() {
    return this.value;
  }
}
