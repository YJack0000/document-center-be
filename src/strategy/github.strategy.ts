import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-github2';
// import { Strategy } from 'passport-oauth2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      // authorizationURL: 'https://www.github.com/oauth2/authorize',
      // tokenURL: 'https://www.github.com/oauth2/token',
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    cb
  ) {
    const { id, username, emails } = profile;

    const user = {
      id: id,
      email: emails[0].value,
      name: username,
      createAt: new Date(),
    };

    cb(null, user);
  }
}
