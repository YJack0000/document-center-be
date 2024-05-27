import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthRepository } from './auth.interface';
import { AuthRepository } from 'src/repositories/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { AuthController } from '../controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  providers: [
    AuthService,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    GoogleStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
