import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../session.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionToken = (request.cookies as Record<string, string>)[
      'session_token'
    ];

    if (!sessionToken) {
      throw new UnauthorizedException('No session token found');
    }

    try {
      // Validate session token and check expiration
      const isValid = await this.sessionService.validateSession(sessionToken);

      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired session');
      }

      // Attach session token to request for use in controllers
      request['sessionToken'] = sessionToken;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Session validation failed');
    }
  }
}
