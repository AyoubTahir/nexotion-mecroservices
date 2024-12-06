import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IOrmAdapter } from "@auth/core/interfaces/database/orm-adapter.interface";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IUserRepository } from "@auth/domain/interfaces/repositories/user-repository.interface";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(CONTAINER_TYPES.IOrmAdapter) private orm: IOrmAdapter
    ){}

    findByEmail(email: string): Promise<UserEntity | null>{
        return this.orm.findOne<UserEntity>("User", { email });
    }
    create(user: UserEntity): Promise<UserEntity>{
        return this.orm.create<UserEntity>("User", user);
    }
    update(user: UserEntity): Promise<UserEntity>{
        return this.orm.update<UserEntity>("User", {id: user.id}, user);
    }
    findById(id: number): Promise<UserEntity | null>{
        return this.orm.findById<UserEntity>("User", id.toString());
    }
}