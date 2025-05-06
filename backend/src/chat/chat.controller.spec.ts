import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { SessionGuard } from '../session/guards/validate-session.guard';
import { SessionService } from '../session/session.service';

interface RequestWithSession extends Request {
  sessionToken: string;
}

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  const mockChatService = {
    sendMessage: jest.fn(),
    getMessage: jest.fn(),
  };

  const mockSessionService = {
    validateSession: jest.fn(),
  };

  const mockRequest = {
    sessionToken: 'test-token',
  } as RequestWithSession;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    })
    .overrideGuard(SessionGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
