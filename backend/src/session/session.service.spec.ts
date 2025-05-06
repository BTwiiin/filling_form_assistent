import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionService } from './session.service';
import { Session } from './entities/session.entity';

describe('SessionService', () => {
  let service: SessionService;
  let repository: Repository<Session>;

  // Mock repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    repository = module.get<Repository<Session>>(getRepositoryToken(Session));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSessionToken', () => {
    it('should generate a valid UUID', () => {
      const token = service.generateSessionToken();
      expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('createSession', () => {
    it('should create a new session with correct properties', async () => {
      const mockToken = 'test-uuid';
      const mockDate = new Date();
      
      // Mock the token generation
      jest.spyOn(service, 'generateSessionToken').mockReturnValue(mockToken);
      
      // Mock the repository responses
      const mockSession = {
        token: mockToken,
        expiresAt: new Date(mockDate.getTime() + service['SESSION_DURATION']),
        createdAt: mockDate,
      };
      
      mockRepository.create.mockReturnValue(mockSession);
      mockRepository.save.mockResolvedValue(mockSession);

      const result = await service.createSession();

      expect(mockRepository.create).toHaveBeenCalledWith({
        token: mockToken,
        expiresAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      
      expect(mockRepository.save).toHaveBeenCalledWith(mockSession);
      
      expect(result).toEqual({
        token: mockToken,
        expiresAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      
      // Verify the expiration date is set correctly
      const expectedExpiry = new Date(mockDate.getTime() + service['SESSION_DURATION']);
      expect(result.expiresAt.getTime()).toBeCloseTo(expectedExpiry.getTime(), -2);
    });
  });

  describe('validateSession', () => {
    it('should return true for valid session', async () => {
      const mockToken = 'valid-token';
      const mockSession = {
        token: mockToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour in future
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.validateSession(mockToken);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
      expect(result).toBe(true);
    });

    it('should return false for expired session', async () => {
      const mockToken = 'expired-token';
      const mockSession = {
        token: mockToken,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour in past
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.validateSession(mockToken);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
      expect(result).toBe(false);
    });

    it('should return false for non-existent session', async () => {
      const mockToken = 'non-existent-token';
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.validateSession(mockToken);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
      expect(result).toBe(false);
    });
  });

  describe('getSession', () => {
    it('should return session when it exists', async () => {
      const mockToken = 'test-token';
      const mockSession = {
        token: mockToken,
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.getSession(mockToken);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
      expect(result).toEqual(mockSession);
    });

    it('should return null when session does not exist', async () => {
      const mockToken = 'non-existent-token';
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getSession(mockToken);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
      expect(result).toBeNull();
    });
  });
});
