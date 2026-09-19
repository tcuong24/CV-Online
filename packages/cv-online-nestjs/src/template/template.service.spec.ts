import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TemplateService } from './template.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TemplateService', () => {
  let service: TemplateService;

  // 1. Giả lập PrismaService với model 'template'
  const mockPrismaService = {
    template: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('service phải được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('phải trả về danh sách template', async () => {
      // Arrange
      const mockTemplates = [
        { id: 'tpl-1', name: 'Standard IT Template', category: 'IT' },
      ];
      mockPrismaService.template.findMany.mockResolvedValue(mockTemplates);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockPrismaService.template.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockTemplates);
    });
  });

  describe('findOne()', () => {
    it('trả về template nếu tìm thấy id', async () => {
      // Arrange
      const mockTemplate = { id: 'tpl-1', name: 'Standard IT Template' };
      mockPrismaService.template.findUnique.mockResolvedValue(mockTemplate);

      // Act
      const result = await service.findOne('tpl-1');

      // Assert
      expect(mockPrismaService.template.findUnique).toHaveBeenCalledWith({
        where: { id: 'tpl-1' },
        include: { sampleData: true },
      });
      expect(result).toEqual(mockTemplate);
    });

    it('báo lỗi NotFoundException nếu không tìm thấy template', async () => {
      // Arrange: Giả lập database trả về null
      mockPrismaService.template.findUnique.mockResolvedValue(null);

      // Act & Assert: Kỳ vọng hàm ném ra lỗi NotFoundException
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
