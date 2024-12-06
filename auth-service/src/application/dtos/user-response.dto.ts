import { UserRole } from "@auth/domain/entities/user.entity";

export interface UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}