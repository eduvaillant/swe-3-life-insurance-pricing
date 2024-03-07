import * as crypto from 'node:crypto';

import { Capital } from '@domain/value-object';
import { InvalidPremiumError } from '@domain/error';
import { PremiumValidator } from '@domain/service';

export class Coverage {
  private _id: string;
  private _name: string;
  private _description: string;
  private _capital: Capital;
  private _premium: number;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  private constructor(
    id: string,
    name: string,
    description: string,
    capital: number,
    premium: number,
    active: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._capital = new Capital(capital);
    this._premium = premium;
    this._active = active;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
  }

  static create(
    name: string,
    description: string,
    capital: number,
    premium: number,
  ) {
    if (!PremiumValidator.isValid(premium, capital))
      throw new InvalidPremiumError();
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const active = true;
    return new Coverage(
      id,
      name,
      description,
      capital,
      premium,
      active,
      createdAt,
      updatedAt,
    );
  }

  static restore(
    id: string,
    name: string,
    description: string,
    capital: number,
    premium: number,
    active: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    return new Coverage(
      id,
      name,
      description,
      capital,
      premium,
      active,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get capital(): number {
    return this._capital.getValue();
  }

  get premium(): number {
    return this._premium;
  }

  get active(): boolean {
    return this._active;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date {
    return this._deletedAt;
  }

  changeName(name: string): void {
    this._name = name;
    this.update();
  }

  changeDescription(description: string): void {
    this._description = description;
    this.update();
  }

  changeCapital(capital: number): void {
    if (!PremiumValidator.isValid(this._premium, capital))
      throw new InvalidPremiumError();
    this._capital = new Capital(capital);
    this.update();
  }

  changePremium(premium: number): void {
    if (!PremiumValidator.isValid(premium, this._capital.getValue()))
      throw new InvalidPremiumError();
    this._premium = premium;
    this.update();
  }

  inactivate(): void {
    this._active = false;
    this._updatedAt = new Date();
    this._deletedAt = new Date();
  }

  private update(): void {
    this._active = true;
    this._updatedAt = new Date();
    this._deletedAt = null;
  }
}
