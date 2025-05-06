import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Response } from 'express';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  // Mock repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  // Mock response
  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new session and set cookie', async () => {
      const mockSession = {
        token: 'test-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(service, 'createSession').mockResolvedValue(mockSession);

      const result = await controller.createSession(mockResponse);

      expect(service.createSession).toHaveBeenCalled();
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'session_token',
        mockSession.token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: mockSession.expiresAt,
        }
      );
      expect(result).toEqual({ success: true });
    });
  });
});
