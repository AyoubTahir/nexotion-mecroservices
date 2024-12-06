export class DomainError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
}
  
export class InvalidCredentialsError extends DomainError {
    constructor() {
        super('Invalid username or password');
    }
}
  
export class UserAlreadyExistsError extends DomainError {
    constructor() {
        super('User with this email already exists');
    }
}

export class UnauthorizedError extends DomainError {
    constructor() {
        super("Unauthorized User"); //
    }
}

export class InvalidTokenError extends DomainError {
    constructor() {
        super("Invalid token");
    }
}

export class AccountLockedError extends DomainError {
    constructor() {
        super("Account locked due to multiple failed attempts");
    }
}