import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './cv.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CvService', () => {
  let service: CvService;

  // 1. Giả lập PrismaService với model 'cV' và 'template'
  const mockPrismaService = {
    cV: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    template: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CvService>(CvService);
  });

  it('service phải được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUser()', () => {
    it('phải trả về danh sách CV của user chỉ định', async () => {
      // Arrange
      const mockCvs = [
        { id: 'cv-1', title: 'Frontend Developer', userId: 'user-123' },
      ];
      mockPrismaService.cV.findMany.mockResolvedValue(mockCvs);

      // Act
      const result = await service.findAllByUser('user-123');

      // Assert
      expect(mockPrismaService.cV.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        include: {
          template: {
            select: {
              id: true,
              name: true,
              thumbnailUrl: true,
              category: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(mockCvs);
    });
  });

  describe('create()', () => {
    it('tạo CV đầu tiên thì tự động đặt isDefault là true', async () => {
      // Arrange: Giả lập user chưa có CV nào (count = 0)
      mockPrismaService.cV.count.mockResolvedValue(0);

      const createdCv = {
        id: 'cv-new',
        userId: 'user-123',
        title: 'CV Mới',
        isDefault: true,
      };
      mockPrismaService.cV.create.mockResolvedValue(createdCv);

      // Act
      const result = await service.create('user-123', {
        title: 'CV Mới',
      });

      // Assert
      expect(mockPrismaService.cV.count).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
      expect(mockPrismaService.cV.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123',
            title: 'CV Mới',
            isDefault: true,
          }),
        }),
      );
      expect(result).toEqual(createdCv);
    });
  });
});
