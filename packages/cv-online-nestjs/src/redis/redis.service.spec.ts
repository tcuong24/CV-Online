import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  // 1. Giả lập (Mock) các hàm của Redis Client
  const mockRedisClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    set: jest.fn().mockResolvedValue('OK'),
    setEx: jest.fn().mockResolvedValue('OK'),
    get: jest.fn(),
    del: jest.fn().mockResolvedValue(1),
    on: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    // Gán mock client vào service thay cho client thật
    (service as unknown as { client: any }).client = mockRedisClient;
  });

  it('service phải được khởi tạo', () => {
    expect(service).toBeDefined();
  });

  describe('get()', () => {
    it('trả về dữ liệu khi key tồn tại', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue('mock_cached_value');

      // Act
      const result = await service.get('user:1');

      // Assert
      expect(result).toBe('mock_cached_value');
      expect(mockRedisClient.get).toHaveBeenCalledWith('user:1');
    });

    it('trả về null khi key không tồn tại', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(null);

      // Act
      const result = await service.get('user:not_found');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('set()', () => {
    it('gọi setEx khi có ttlSeconds', async () => {
      // Act
      await service.set('token:123', 'valid', 3600);

      // Assert
      expect(mockRedisClient.setEx).toHaveBeenCalledWith(
        'token:123',
        3600,
        'valid',
      );
    });

    it('gọi set thông thường khi không truyền ttlSeconds', async () => {
      // Act
      await service.set('config:key', 'data');

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith('config:key', 'data');
    });
  });
});
