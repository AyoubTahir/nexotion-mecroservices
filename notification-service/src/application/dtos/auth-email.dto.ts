export namespace AuthEmailDto {
    export interface UserRegistration {
      email: string;
      firstName: string;
      lastName: string;
    }
  
    export interface PasswordReset {
      email: string;
      resetToken: string;
    }
}