import { inject } from "inversify";
import { IUseCase } from "../interfaces/use-case.interface";
import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IAuthService } from "@auth/domain/interfaces/services/auth-service.interface";
import { UserMapper } from "../mappers/user.mapper";
import { LoginUserDto } from "../dtos/login-user.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";

export class LoginUserUseCase implements IUseCase<LoginUserDto, LoginResponseDto> {
    constructor(
      @inject(CONTAINER_TYPES.IAuthService) private authService: IAuthService
    ) {}
  
    async execute(dto: LoginUserDto): Promise<LoginResponseDto> {
      
        const loggedInUser = await this.authService.login(dto.email, dto.password)
     
        return {
          user: UserMapper.toDto(loggedInUser.user),
          token: loggedInUser.token
        };
    }
}