export class CoverageAlreadyExistsError extends Error {
  constructor() {
    super('Coverage already exists');
  }
}

export class CoverageNotFoundError extends Error {
  constructor() {
    super('Coverage not found');
  }
}
