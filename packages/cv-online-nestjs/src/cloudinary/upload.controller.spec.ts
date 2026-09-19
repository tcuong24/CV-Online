import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { CloudinaryService } from './cloudinary.service';

describe('UploadController', () => {
  let controller: UploadController;

  // 1. Giả lập CloudinaryService
  const mockCloudinaryService = {
    uploadImage: jest.fn(),
    uploadPdf: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage()', () => {
    it('gọi cloudinaryService.uploadImage và trả về object chứa url', async () => {
      // Arrange
      const mockResult = {
        secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      };
      mockCloudinaryService.uploadImage.mockResolvedValue(mockResult);

      const mockFile = {
        buffer: Buffer.from('fake image'),
      } as Express.Multer.File;

      // Act
      const result = await controller.uploadImage(mockFile);

      // Assert
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual({ url: mockResult.secure_url });
    });
  });
});
