import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly brevo: BrevoClient;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY || '',
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<any> {
    try {
      const result = await this.brevo.transactionalEmails.sendTransacEmail({
        sender: { name: 'CVision Support', email: 'cuong13112004@gmail.com' },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      });
      this.logger.log(`📧 Email sent successfully to ${to}`);
      return result;
    } catch (err: any) {
      this.logger.error(`❌ Send Email failed: ${err.message}`);
      throw new InternalServerErrorException('Không thể gửi email xác thực.');
    }
  }
}
