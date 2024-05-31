import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from './user.interface';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { User } from './user.entity';
import { CheckUserPrivilegeResDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  async getAllUsers(query: PaginationReqDto): Promise<PaginationResDto<User>> {
    this.logger.log(`Get All Users`);
    const { page, limit } = query;
    this.logger.log(`page: ${page} limit: ${limit}`);
    const totalAmount = await this.userRepository.count();
    const data = await this.userRepository.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total: Math.ceil(totalAmount / limit),
    };
  }

  async checkUserPrivilege(user: User): Promise<CheckUserPrivilegeResDto> {
    this.logger.log(`Check User Privilege`);
    return {
      isSuperUser: user.isSuperUser == true,
    };
  }

  async getUserById(id: string) {
    this.logger.log(`Get User by ID`);
    return await this.userRepository.findOneById(id);
  }
}
