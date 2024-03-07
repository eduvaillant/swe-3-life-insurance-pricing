export class OccupationNotFoundError extends Error {
  constructor() {
    super('Occupation not found');
  }
}
