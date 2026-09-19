import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

describe('OtpService', () => {
  let service: OtpService;

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    ttl: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: RedisService, useValue: mockRedis },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('service phải được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('checkRateLimit()', () => {
    it('ném ra BadRequestException nếu gửi yêu cầu OTP quá 3 lần liên tiếp', async () => {
      mockRedis.get.mockResolvedValue('3');
      mockRedis.ttl.mockResolvedValue(120);

      await expect(service.checkRateLimit('user@example.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('cho phép gửi nếu số lần yêu cầu dưới giới hạn', async () => {
      mockRedis.get.mockResolvedValue('1');

      await expect(
        service.checkRateLimit('user@example.com'),
      ).resolves.not.toThrow();
    });
  });
});
