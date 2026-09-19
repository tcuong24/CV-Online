import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  // 1. Giả lập AuthService
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    loginWithGoogle: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    getMe: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('phải gọi authService.register và trả về kết quả', async () => {
      const dto = {
        email: 'user@example.com',
        password: 'Password123',
        fullName: 'Nguyen Van A',
      };
      const expectedResult = {
        user: { id: '1', email: dto.email },
        access_token: 'token_123',
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login()', () => {
    it('phải gọi authService.login và trả về token', async () => {
      const dto = { email: 'user@example.com', password: 'Password123' };
      const expectedResult = {
        user: { id: '1', email: dto.email },
        access_token: 'token_123',
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('forgotPassword()', () => {
    it('báo lỗi BadRequestException nếu không truyền email', () => {
      expect(() => controller.forgotPassword('')).toThrow(BadRequestException);
    });

    it('gọi authService.forgotPassword khi email hợp lệ', async () => {
      mockAuthService.forgotPassword.mockResolvedValue({ message: 'OTP sent' });

      const result = await controller.forgotPassword('user@example.com');

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('user@example.com');
      expect(result).toEqual({ message: 'OTP sent' });
    });
  });

  describe('getMe()', () => {
    it('lấy thông tin user từ req.user.id', async () => {
      const req = { user: { id: 'user-123' } };
      const expectedUser = { id: 'user-123', email: 'me@example.com' };
      mockAuthService.getMe.mockResolvedValue(expectedUser);

      const result = await controller.getMe(req);

      expect(mockAuthService.getMe).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedUser);
    });
  });
});
