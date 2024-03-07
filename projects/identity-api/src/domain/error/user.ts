export class UserAlreadyHasRoleError extends Error {
  constructor() {
    super('User already has this role');
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Password does not match requirements');
  }
}
