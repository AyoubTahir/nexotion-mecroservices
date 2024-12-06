import { UserEntity } from "@auth/domain/entities/user.entity";
import { UserResponseDto } from "../dtos/user-response.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { EmailVO } from "@auth/domain/value-objects/email.vo";
import { PasswordVO } from "@auth/domain/value-objects/password.vo";

export class UserMapper {
    static toDomain(dto: CreateUserDto): UserEntity {
      return new UserEntity({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: new EmailVO(dto.email),
        password: new PasswordVO(dto.password),
        role: dto.role,
        isActive: true,
        loginAttempts: 0,
        tokenVersion: 1
      });
    }
  
    static toDto(user: UserEntity): UserResponseDto {
      return {
        id: user.id!,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toString(),
        role: user.role,
        isActive: user.isActive
      };
    }
  }