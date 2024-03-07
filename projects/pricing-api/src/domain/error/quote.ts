export class InvalidAgeError extends Error {
  constructor() {
    super('`age` must be between 18 and 60');
  }
}
