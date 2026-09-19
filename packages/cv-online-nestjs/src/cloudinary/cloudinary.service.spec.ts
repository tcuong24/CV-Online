import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { PassThrough } from 'stream';

const mockUploadStream = jest.fn();

// 1. Mock SDK Cloudinary và luồng Upload Stream
jest.mock('cloudinary', () => ({
    v2: {
        uploader: {
            upload_stream: (options: any, callback: any) =>
                mockUploadStream(options, callback),
        },
    },
}));

describe('CloudinaryService', () => {
    let service: CloudinaryService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [CloudinaryService],
        }).compile();

        service = module.get<CloudinaryService>(CloudinaryService);
    });

    it('service phải được khởi tạo thành công', () => {
        expect(service).toBeDefined();
    });

    describe('uploadImage()', () => {
        it('upload ảnh thành công và trả về URL đám mây', async () => {
            // Arrange: Giả lập stream ghi thành công và gọi callback
            const mockResult = {
                secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            };
            mockUploadStream.mockImplementation((options, callback) => {
                const stream = new PassThrough();
                stream.on('finish', () => callback(null, mockResult));
                return stream;
            });

            const mockFile = {
                buffer: Buffer.from('fake image binary content'),
            } as Express.Multer.File;

            // Act
            const result = await service.uploadImage(mockFile);

            // Assert
            expect(mockUploadStream).toHaveBeenCalledWith(
                { folder: 'cv-online' },
                expect.any(Function),
            );
            expect(result).toEqual(mockResult);
        });

        it('báo lỗi khi Cloudinary upload thất bại', async () => {
            // Arrange: Giả lập lỗi từ Cloudinary
            mockUploadStream.mockImplementation((options, callback) => {
                const stream = new PassThrough();
                stream.on('finish', () =>
                    callback(new Error('Cloudinary server unavailable'), null),
                );
                return stream;
            });

            const mockFile = {
                buffer: Buffer.from('fake image binary content'),
            } as Express.Multer.File;

            // Act & Assert
            await expect(service.uploadImage(mockFile)).rejects.toThrow(
                'Cloudinary server unavailable',
            );
        });
    });

    describe('uploadPdf()', () => {
        it('upload file PDF với cấu hình folder cv-online-pdfs và resource_type auto', async () => {
            const mockResult = {
                secure_url: 'https://res.cloudinary.com/demo/raw/upload/cv.pdf',
            };
            mockUploadStream.mockImplementation((options, callback) => {
                const stream = new PassThrough();
                stream.on('finish', () => callback(null, mockResult));
                return stream;
            });

            const mockFile = {
                buffer: Buffer.from('%PDF-1.4 fake pdf data'),
            } as Express.Multer.File;

            const result = await service.uploadPdf(mockFile);

            expect(mockUploadStream).toHaveBeenCalledWith(
                { folder: 'cv-online-pdfs', resource_type: 'auto' },
                expect.any(Function),
            );
            expect(result).toEqual(mockResult);
        });
    });
});
