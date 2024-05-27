import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from 'src/auth/auth.interface';

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(IAuthRepository) private readonly authRepository: IAuthRepository,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      } else {
        let pairs = req.headers.cookie.split(';');
        pairs.forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key.trim() === 'access_token') {
            token = value;
          }
        });
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
