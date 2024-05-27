import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthRepository } from './auth.interface';
import { JwtPayload } from 'src/strategy/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(IAuthRepository) private authRepository: IAuthRepository,
  ) {}

  generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }
    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
      name: userExists.name,
    });
  }

  async registerUser(user) {
    try {
      const newUser = this.authRepository.create(user);

      const result = await this.authRepository.save(newUser);

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
        name: newUser.name,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email) {
    const user = await this.authRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }
}
