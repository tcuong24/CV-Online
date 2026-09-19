import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

describe('ExportController', () => {
  let controller: ExportController;

  const mockExportService = {
    exportToPDF: jest.fn(),
    exportToHTML: jest.fn(),
    getExportHistory: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: ExportService,
          useValue: mockExportService,
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('exportPDF()', () => {
    it('gọi exportService.exportToPDF và gán header tải file PDF', async () => {
      const mockPdfBuffer = Buffer.from('mock pdf content');
      mockExportService.exportToPDF.mockResolvedValue(mockPdfBuffer);

      const mockRes = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as any;

      await controller.exportPDF('cv-123', { pageSize: 'A4' }, mockRes);

      expect(mockExportService.exportToPDF).toHaveBeenCalledWith('cv-123', {
        pageSize: 'A4',
      });
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(mockRes.send).toHaveBeenCalledWith(mockPdfBuffer);
    });
  });

  describe('getExportHistory()', () => {
    it('trả về lịch sử xuất CV', async () => {
      const mockHistory = [{ id: '1', cvId: 'cv-123', format: 'pdf' }];
      mockExportService.getExportHistory.mockResolvedValue(mockHistory);

      const result = await controller.getExportHistory('cv-123');

      expect(mockExportService.getExportHistory).toHaveBeenCalledWith('cv-123');
      expect(result).toEqual(mockHistory);
    });
  });
});
