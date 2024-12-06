import { EmailVO } from "../value-objects/email.vo";
import { PasswordVO } from "../value-objects/password.vo";

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MODERATOR = 'MODERATOR'
  }
  
  export interface UserProps {
    id?: number;
    firstName: string;
    lastName: string;
    email: EmailVO;
    password: PasswordVO;
    role: UserRole;
    isActive: boolean;
    mfaSecret?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: number;
  }
  
  export class UserEntity {
    private props: UserProps;
  
    constructor(props: UserProps) {
      this.props = props;
    }
  
    // Getters
    get id(): number | undefined { return this.props.id; }
    get firstName(): string { return this.props.firstName; }
    get lastName(): string { return this.props.lastName; }
    get fullName(): string { return `${this.firstName} ${this.lastName}`; }
    get email(): EmailVO { return this.props.email; }
    get password(): PasswordVO { return this.props.password; }
    get role(): UserRole { return this.props.role; }
    get isActive(): boolean { return this.props.isActive; }
  
    // Business logic methods
    isLocked(): boolean {
      return this.props.lockUntil ? Date.now() < this.props.lockUntil : false;
    }

    //check if its meet login attempt
    hasExceededLoginAttempts(): boolean {
      return this.props.loginAttempts >= 5;
    }

    // new login
    newlogin(): void {
      this.props.loginAttempts = 0;
      this.props.lockUntil = undefined;
      this.props.lastLogin = new Date();
    }
  
    setPassword(callback: (password: PasswordVO) => void): void {
      callback(this.props.password)
    }

    incrementLoginAttempts(): void {
      this.props.loginAttempts++;
    }
  
    resetLoginAttempts(): void {
      this.props.loginAttempts = 0;
    }
  
    lock(duration: number): void {
      this.props.lockUntil = Date.now() + duration;
    }
  
    unlock(): void {
      this.props.lockUntil = undefined;
    }
  }