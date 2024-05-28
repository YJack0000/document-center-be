import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { User } from 'src/users/user.entity';
import { IUserRepository } from 'src/users/user.interface';
import { UserRepository } from 'src/repositories/user.repository';
import { GithubStrategy } from 'src/strategy/github.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    GithubStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
