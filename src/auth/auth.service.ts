import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, UserReq } from 'src/strategy/jwt.strategy';
import { IUserRepository } from 'src/users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(IUserRepository) private authRepository: IUserRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user: UserReq) {
    this.logger.log(`CallBack: Sign In`);
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
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    });
  }

  async registerUser(user: UserReq) {
    try {
      const newUser = this.authRepository.create(user);

      const result = await this.authRepository.save(newUser);

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
        name: newUser.name,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.authRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }
}
