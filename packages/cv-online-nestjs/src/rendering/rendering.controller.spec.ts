import { Test, TestingModule } from '@nestjs/testing';
import { RenderingController } from './rendering.controller';
import { RenderingService } from './rendering.service';

describe('RenderingController', () => {
  let controller: RenderingController;

  const mockRenderingService = {
    renderCV: jest.fn(),
    clearCache: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RenderingController],
      providers: [
        {
          provide: RenderingService,
          useValue: mockRenderingService,
        },
      ],
    }).compile();

    controller = module.get<RenderingController>(RenderingController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('renderCV()', () => {
    it('gọi renderCV và trả về object { html }', async () => {
      mockRenderingService.renderCV.mockResolvedValue('<div>CV Preview HTML</div>');

      const result = await controller.renderCV('cv-123');

      expect(mockRenderingService.renderCV).toHaveBeenCalledWith('cv-123');
      expect(result).toEqual({ html: '<div>CV Preview HTML</div>' });
    });
  });

  describe('clearCache()', () => {
    it('gọi clearCache và trả về message', async () => {
      mockRenderingService.clearCache.mockResolvedValue(undefined);

      const result = await controller.clearCache('cv-123');

      expect(mockRenderingService.clearCache).toHaveBeenCalledWith('cv-123');
      expect(result).toEqual({ message: 'Cache cleared' });
    });
  });
});
