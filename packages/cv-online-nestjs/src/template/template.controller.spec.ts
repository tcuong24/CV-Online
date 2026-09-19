import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

describe('TemplateController', () => {
  let controller: TemplateController;

  // 1. Giả lập TemplateService
  const mockTemplateService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getCategories: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories()', () => {
    it('phải gọi templateService.getCategories và trả về danh sách category', async () => {
      // Arrange
      const mockCategories = ['IT', 'Design', 'Marketing'];
      mockTemplateService.getCategories.mockResolvedValue(mockCategories);

      // Act
      const result = await controller.getCategories();

      // Assert
      expect(mockTemplateService.getCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });
});
