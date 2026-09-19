import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import * as bcrypt from 'bcrypt';

// 1. Mock thư viện bcrypt ở cấp độ module
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_pw'),
    compare: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock_jwt_token'),
    };

    const mockOtpService = {
        sendOtp: jest.fn(),
        verifyOtp: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: OtpService, useValue: mockOtpService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('service phải được khởi tạo thành công', () => {
        expect(service).toBeDefined();
    });

    describe('register()', () => {
        it('báo lỗi ConflictException nếu email đã tồn tại', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });

            await expect(
                service.register({
                    email: 'exist@example.com',
                    password: 'Password123',
                    fullName: 'Test User',
                }),
            ).rejects.toThrow(ConflictException);
        });

        it('tạo tài khoản thành công, trả về user và access_token', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const createdUser = {
                id: 'user-new',
                email: 'new@example.com',
                fullName: 'Newbie',
            };
            mockPrismaService.user.create.mockResolvedValue(createdUser);

            const result = await service.register({
                email: 'new@example.com',
                password: 'Password123',
                fullName: 'Newbie',
            });

            expect(mockPrismaService.user.create).toHaveBeenCalled();
            expect(result).toEqual({
                user: createdUser,
                access_token: 'mock_jwt_token',
            });
        });
    });

    describe('login()', () => {
        it('báo lỗi UnauthorizedException nếu không tìm thấy email', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(
                service.login({
                    email: 'notfound@example.com',
                    password: 'Password123',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('báo lỗi UnauthorizedException nếu sai mật khẩu', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-1',
                passwordHash: 'hash',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.login({
                    email: 'user@example.com',
                    password: 'wrong_password',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('đăng nhập thành công khi đúng mật khẩu', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'user@example.com',
                fullName: 'User One',
                role: 'user',
                passwordHash: 'hash',
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockPrismaService.user.update.mockResolvedValue(mockUser);

            const result = await service.login({
                email: 'user@example.com',
                password: 'correct_password',
            });

            expect(result.access_token).toBe('mock_jwt_token');
            expect(result.user.email).toBe('user@example.com');
        });
    });
});
