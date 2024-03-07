export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super('An User with this `username` already exists');
  }
}

export class InvalidUsernameOrPasswordError extends Error {
  constructor() {
    super('`username` or `password` are invalid');
  }
}
