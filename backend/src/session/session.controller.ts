import { Controller, Post, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Response } from 'express';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async createSession(@Res({ passthrough: true }) response: Response) {
    const session = await this.sessionService.createSession();

    response.cookie('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: session.expiresAt,
    });

    return { success: true };
  }
}
