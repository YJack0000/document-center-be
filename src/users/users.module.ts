import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '../controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IUserRepository } from './user.interface';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    Logger,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
