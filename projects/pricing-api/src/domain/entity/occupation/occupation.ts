import * as crypto from 'node:crypto';

export class Occupation {
  private _id: string;
  private _name: string;
  private _code: string;
  private _active: boolean;
  private _factor: number;
  private _createdAt: Date;

  private constructor(
    id: string,
    name: string,
    code: string,
    active: boolean,
    factor: number,
    createdAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._code = code;
    this._active = active;
    this._factor = factor;
    this._createdAt = createdAt;
  }

  static create(name: string, code: string, active: boolean, factor: number) {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    return new Occupation(id, name, code, active, factor, createdAt);
  }

  static restore(
    id: string,
    name: string,
    code: string,
    active: boolean,
    factor: number,
    createdAt: Date,
  ) {
    return new Occupation(id, name, code, active, factor, createdAt);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  get active(): boolean {
    return this._active;
  }

  get factor(): number {
    return this._factor;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
