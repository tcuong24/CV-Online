import { Test, TestingModule } from '@nestjs/testing';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvParserService } from './cv-parser.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('CvController', () => {
  let controller: CvController;

  // 1. Khai báo mock object trực tiếp ở phạm vi test suite
  const mockCvService = {
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  const mockCvParserService = {
    parse: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    // Reset lịch sử gọi hàm trước mỗi bài test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvController],
      providers: [
        { provide: CvService, useValue: mockCvService },
        { provide: CvParserService, useValue: mockCvParserService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<CvController>(CvController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllByUser()', () => {
    it('phải gọi cvService.findAllByUser và trả về danh sách CV của user', async () => {
      // Arrange
      const mockResult = [{ id: 'cv-1', title: 'CV Lập trình viên' }];
      mockCvService.findAllByUser.mockResolvedValue(mockResult);

      const req = { user: { id: 'user-123' } };

      // Act
      const result = await controller.findAll(req as any);

      // Assert
      expect(mockCvService.findAllByUser).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockResult);
    });
  });
});
