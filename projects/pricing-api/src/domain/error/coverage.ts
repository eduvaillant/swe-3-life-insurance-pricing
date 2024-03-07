export class InvalidPremiumError extends Error {
  constructor() {
    super(
      '`premium` should be greater than 0 and less than 30% of capital value',
    );
  }
}

export class InvalidCapitalError extends Error {
  constructor() {
    super('`capital` should be multiple of 10 and grater than or equal 1000');
  }
}
