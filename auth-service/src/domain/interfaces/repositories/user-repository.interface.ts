import { UserEntity } from "@auth/domain/entities/user.entity";

export interface IUserRepository {
    findByEmail(email: string): Promise<UserEntity | null>;
    create(user: UserEntity): Promise<UserEntity>;
    update(user: UserEntity): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity | null>;
}