import { UserRole } from "@auth/domain/entities/user.entity";

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
}