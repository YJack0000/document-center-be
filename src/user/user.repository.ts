import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { BaseAbstractRepostitory } from "src/common/base.repository";
import { User } from "./user.entity";
import { BaseInterfaceRepository } from "src/common/base.interface";


export class UserRepository extends BaseAbstractRepostitory<User> implements BaseInterfaceRepository<User> {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
        super(userRepository)
    }
}