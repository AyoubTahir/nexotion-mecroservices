import { UserEntity } from "@auth/domain/entities/user.entity";

export interface IAuthService {
    register(user: UserEntity): Promise<UserEntity>;
    login(email: string, password: string): Promise<{user: UserEntity, token: string}>; // Returns JWT
    //resetPassword(email: string): Promise<void>;
   // verifyPasswordResetToken(token: string): Promise<boolean>;
}