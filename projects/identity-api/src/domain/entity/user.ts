import * as crypto from 'node:crypto';

import { Password } from '@domain/value-object';
import { UserAlreadyHasRoleError } from '@domain/error';

export class User {
  private _id: string;
  private _username: string;
  private _password: Password;
  private _role: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    username: string,
    password: Password,
    role: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._username = username;
    this._password = password;
    this._role = role;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(username: string, password: string) {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const role = 'user';
    const hashedPassword = Password.create(password);
    return new User(id, username, hashedPassword, role, createdAt, updatedAt);
  }

  static restore(
    id: string,
    username: string,
    password: string,
    role: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    const restoredPassword = Password.restore(password);
    return new User(id, username, restoredPassword, role, createdAt, updatedAt);
  }

  changeRole(role: string): void {
    if (this._role === role) throw new UserAlreadyHasRoleError();
    this._role = role;
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get password(): Password {
    return this._password;
  }

  get role(): string {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
