import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OtpService } from './otp.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) { }

  async register(dto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        subscriptionType: true,
        createdAt: true,
      },
    });

    // Tạo JWT token
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: (user as any).role ?? 'user' });

    return { user, access_token: token };
  }

  async login(dto: LoginDto) {
    // Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Cập nhật lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Tạo JWT token
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        subscriptionType: user.subscriptionType,
      },
      access_token: token,
    };
  }
  async loginWithGoogle(idToken: string) {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload();
    if (!payload.email) {
      throw new UnauthorizedException('Không thể xác thực tài khoản Google')
    }
    const user = await this.prisma.user.upsert({
      where: { email: payload.email },
      update: {
        avatarUrl: payload.picture ?? null,
        lastLoginAt: new Date(),
      },
      create: {
        email: payload.email,
        fullName: payload.picture ?? null,
        avatarUrl: payload.picture ?? null,
        passwordHash: "",
      }
    })
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    })
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        subscriptionType: user.subscriptionType,
      },
      access_token: token,
    }
  }
  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        subscriptionType: true,
        subscriptionExpiresAt: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này.');
    }
    return this.otpService.sendOtp(email);
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Verify OTP first
    await this.otpService.verifyOtp(dto.email, dto.otp);

    // Hash the new password and update in DB
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { passwordHash },
    });

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công! Hãy đăng nhập lại bằng mật khẩu mới.',
    };
  }

  async verifyOtpOnly(email: string, otp: string) {
    await this.otpService.checkOtp(email, otp);
    return { success: true, message: 'Mã OTP chính xác!' };
  }
}
