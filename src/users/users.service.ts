import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from './user.interface';

@Injectable()
export class UsersService {
    constructor(
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository,
        private readonly logger: Logger
    ) {
        this.logger = new Logger(UsersService.name);
    }

    async getAllUsers() {
        this.logger.log(`Get All Users`);
        return await this.userRepository.findAll();
    }

    async getUserById(id: string) {
        this.logger.log(`Get User by ID`);
        return await this.userRepository.findOneById(id);
    }
}
