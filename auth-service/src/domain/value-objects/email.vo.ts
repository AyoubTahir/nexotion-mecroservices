export class EmailVO {
    private readonly value: string;
  
    constructor(email: string) {
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }
      this.value = email;
    }
  
    private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    toString(): string {
      return this.value;
    }
  }