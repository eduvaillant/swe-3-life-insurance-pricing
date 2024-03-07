export class Password {
  private value: string;

  constructor(password: string) {
    if (!this.isValidPassowrd(password)) throw new Error('Invalid Password');
    this.value = password;
  }

  private isValidPassowrd(password: string): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%])[A-Za-z\d@#!$%]{8,64}$/;
    return regex.test(password);
  }

  getValue() {
    return this.value;
  }
}
