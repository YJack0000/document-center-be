import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;

    // if email is end with "nycu.edu.tw" then user is Manager
    const isSuperUser = emails[0].value.endsWith('nycu.edu.tw');

    const user = {
      id: id,
      email: emails[0].value,
      name: `${name.givenName || ""} ${name.familyName || ""}`,
      isSuperUser: isSuperUser,
      createAt: new Date(),
    };

    done(null, user);
  }
}
