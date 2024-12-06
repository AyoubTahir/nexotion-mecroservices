import { UserEntity } from "../entities/user.entity";

export class UserAggregate {
    private user: UserEntity;
  
    constructor(user: UserEntity) {
      this.user = user;
    }
  
    authenticate(password: string): boolean {
      // Implement password verification logic
      console.log(password);
      
      return true; // Placeholder
    }
  
    changePassword(newPassword: string): void {
      // Implement password change logic
      console.log(newPassword);
    }
  
    lockAccount(duration: number): void {
      this.user.lock(duration);
    }
  }