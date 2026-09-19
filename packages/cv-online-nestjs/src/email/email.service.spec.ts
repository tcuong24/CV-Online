import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { EmailService } from './email.service';

const mockSendTransacEmail = jest.fn();

// 1. Mock Brevo SDK
jest.mock('@getbrevo/brevo', () => {
  return {
    BrevoClient: jest.fn().mockImplementation(() => ({
      transactionalEmails: {
        sendTransacEmail: mockSendTransacEmail,
      },
    })),
  };
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('service phải được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail()', () => {
    it('gửi email thành công với đúng thông số', async () => {
      // Arrange
      const mockResult = { messageId: 'msg-123' };
      mockSendTransacEmail.mockResolvedValue(mockResult);

      // Act
      const result = await service.sendEmail(
        'user@example.com',
        'Xác thực tài khoản',
        '<p>Mã OTP của bạn là 123456</p>',
      );

      // Assert
      expect(mockSendTransacEmail).toHaveBeenCalledWith({
        sender: { name: 'CVision Support', email: 'cuong13112004@gmail.com' },
        to: [{ email: 'user@example.com' }],
        subject: 'Xác thực tài khoản',
        htmlContent: '<p>Mã OTP của bạn là 123456</p>',
      });
      expect(result).toEqual(mockResult);
    });

    it('ném ra InternalServerErrorException khi Brevo API bị lỗi', async () => {
      // Arrange: Giả lập Brevo API ném ra lỗi mạng
      mockSendTransacEmail.mockRejectedValue(new Error('Brevo network timeout'));

      // Act & Assert
      await expect(
        service.sendEmail('user@example.com', 'Test', '<p>Hello</p>'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
