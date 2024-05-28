import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepostitory } from 'src/common/base.repository';
import { User } from 'src/users/user.entity';
import { IUserRepository } from 'src/users/user.interface';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserRepository
  extends BaseRepostitory<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  public create(data: DeepPartial<User>): User {
    data.createAt = new Date();

    return super.create(data);
  }
}
