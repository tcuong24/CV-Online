import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  private readonly OTP_PREFIX = 'cvision:otp:';
  private readonly ATTEMPTS_PREFIX = 'cvision:otp:attempts:';
  private readonly RATELIMIT_PREFIX = 'cvision:otp:ratelimit:';

  private readonly OTP_EXPIRY = 300; // 5 mins
  private readonly MAX_ATTEMPTS = 3;
  private readonly MAX_REQUESTS = 3;

  constructor(
    private readonly redis: RedisService,
    private readonly emailService: EmailService,
  ) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async checkRateLimit(email: string): Promise<void> {
    const key = this.RATELIMIT_PREFIX + email;
    const count = await this.redis.get(key);

    if (count && parseInt(count, 10) >= this.MAX_REQUESTS) {
      const ttl = await this.redis.ttl(key);
      throw new BadRequestException(
        `Yêu cầu OTP quá nhanh. Vui lòng quay lại sau ${Math.ceil(ttl / 60)} phút!`,
      );
    }
  }

  async incrementRateLimit(email: string): Promise<void> {
    const key = this.RATELIMIT_PREFIX + email;
    const count = await this.redis.get(key);
    if (count) {
      await this.redis.incr(key);
    } else {
      await this.redis.set(key, '1', this.OTP_EXPIRY);
    }
  }

  async sendOtp(email: string): Promise<{ success: boolean; message: string; expiresIn: number }> {
    await this.checkRateLimit(email);

    const otp = this.generateOTP();
    const otpKey = this.OTP_PREFIX + email;
    
    // Save to Redis
    await this.redis.set(otpKey, otp, this.OTP_EXPIRY);
    
    // Increment rate limit count
    await this.incrementRateLimit(email);

    // Send email using Brevo
    const title = '🔐 Khôi Phục Mật Khẩu CVision';
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">${title}</h1>
        </div>
        <div style="background: #ffffff; padding: 40px 30px; text-align: center;">
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">Bạn vừa yêu cầu khôi phục mật khẩu tài khoản CVision. Sử dụng mã OTP dưới đây để tiến hành đặt lại:</p>
          <div style="background: #f8fafc; border: 2px dashed #cbd5e1; padding: 15px 30px; border-radius: 12px; display: inline-block; margin-bottom: 25px;">
            <span style="color: #2563eb; letter-spacing: 8px; font-size: 36px; font-weight: 800; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #ef4444; font-size: 13px; font-weight: 600; margin: 0 0 10px 0;">⏱️ Mã OTP có hiệu lực trong vòng 5 phút</p>
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
        </div>
      </div>
    `;

    await this.emailService.sendEmail(email, title, html);

    return {
      success: true,
      message: 'Mã xác thực OTP khôi phục mật khẩu đã được gửi!',
      expiresIn: this.OTP_EXPIRY,
    };
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const attemptsKey = this.ATTEMPTS_PREFIX + email;
    const attempts = await this.redis.get(attemptsKey);

    if (attempts && parseInt(attempts, 10) >= this.MAX_ATTEMPTS) {
      throw new BadRequestException('Nhập sai OTP quá 3 lần. Vui lòng gửi lại yêu cầu!');
    }

    const otpKey = this.OTP_PREFIX + email;
    const storedOtp = await this.redis.get(otpKey);

    if (!storedOtp) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn!');
    }

    if (storedOtp !== otp) {
      if (attempts) {
        await this.redis.incr(attemptsKey);
      } else {
        await this.redis.set(attemptsKey, '1', this.OTP_EXPIRY);
      }
      const count = await this.redis.get(attemptsKey);
      throw new BadRequestException(`Mã OTP không chính xác (${count}/${this.MAX_ATTEMPTS})`);
    }

    // Success: clean up
    await this.redis.del([otpKey, attemptsKey, this.RATELIMIT_PREFIX + email]);
    return true;
  }
}
