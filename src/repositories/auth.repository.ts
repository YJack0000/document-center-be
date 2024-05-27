import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/auth.entity';
import { IAuthRepository } from 'src/auth/auth.interface';
import { BaseRepostitory } from 'src/common/base.repository';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class AuthRepository
  extends BaseRepostitory<Auth>
  implements IAuthRepository
{
  constructor(
    @InjectRepository(Auth)
    userRepository: Repository<Auth>,
  ) {
    super(userRepository);
  }

  public create(data: DeepPartial<Auth>): Auth {
    data.createAt = new Date();

    return super.create(data);
  }
}
