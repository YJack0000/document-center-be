import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { GithubOauthGuard } from 'src/guard/github-oauth.guard';
import { GoogleOauthGuard } from 'src/guard/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('github')
  @UseGuards(GithubOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.signIn(req.user);

    return res
      .status(HttpStatus.OK)
      .cookie('access_token', token)
      .json({ message: 'User authenticated' });
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.signIn(req.user);

    return res
      .status(HttpStatus.OK)
      .cookie('access_token', token)
      .json({ message: 'User authenticated' });
  }
}
