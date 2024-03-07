import * as bcrypt from 'bcryptjs';
import { InvalidPasswordError } from '@domain/error';

export class Password {
  private value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Password {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%])[A-Za-z\d@#!$%]{8,64}$/;
    if (!regex.test(password)) throw new InvalidPasswordError();
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return new Password(hashedPassword);
  }

  static restore(password: string): Password {
    return new Password(password);
  }

  compare(password: string): boolean {
    return bcrypt.compareSync(password, this.value);
  }

  getValue() {
    return this.value;
  }
}
