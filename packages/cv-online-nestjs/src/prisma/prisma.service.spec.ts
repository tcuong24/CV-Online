import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'DATABASE_URL') {
        return 'postgresql://user:password@localhost:5432/testdb';
      }
      if (key === 'DATABASE_SSL') {
        return 'false';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Chặn hàm connect/disconnect thật của Prisma
    jest
      .spyOn(PrismaClient.prototype, '$connect')
      .mockImplementation(async () => {});
    jest
      .spyOn(PrismaClient.prototype, '$disconnect')
      .mockImplementation(async () => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('service phải được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit phải gọi $connect để kết nối database', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('onModuleDestroy phải gọi $disconnect khi tắt module', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });
});
