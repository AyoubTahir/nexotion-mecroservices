export class PasswordVO {
    private readonly value: string;
  
    constructor(password: string) {
      if (!this.isValidPassword(password)) {
        throw new Error('Password does not meet complexity requirements');
      }
      this.value = password;
    }
  
    private isValidPassword(password: string): boolean {
      // At least 8 characters, one uppercase, one lowercase, one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    }
  
    toString(): string {
      return this.value;
    }
  }