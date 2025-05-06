import { Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionService {
  private readonly SESSION_DURATION = 3600000 * 24 * 30; // 1 month in milliseconds

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  generateSessionToken(): string {
    return crypto.randomUUID();
  }

  async createSession(): Promise<{token: string, expiresAt: Date, createdAt: Date}> {
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    const session = this.sessionRepository.create({
      token,
      expiresAt,
      createdAt: new Date()
    });

    await this.sessionRepository.save(session);
    
    return {
      token,
      expiresAt,
      createdAt: session.createdAt
    };
  }

  async validateSession(token: string): Promise<boolean> {
    const session = await this.getSession(token);
    return session !== null && session.expiresAt > new Date();
  }

  async getSession(token: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { token } });
  }
}
