import { inject } from "inversify";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserResponseDto } from "../dtos/user-response.dto";
import { IUseCase } from "../interfaces/use-case.interface";
import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IAuthService } from "@auth/domain/interfaces/services/auth-service.interface";
import { UserMapper } from "../mappers/user.mapper";

export class RegisterUserUseCase implements IUseCase<CreateUserDto, UserResponseDto> {
    constructor(
      @inject(CONTAINER_TYPES.IAuthService) private authService: IAuthService
    ) {}
  
    async execute(dto: CreateUserDto): Promise<UserResponseDto> {
      
        const registeredUser = await this.authService.register(UserMapper.toDomain(dto))
     
        return UserMapper.toDto(registeredUser);
    }
}