import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    
    // Tự động bật SSL nếu là Cloud DB hoặc môi trường production
    const needsSSL = 
      connectionString?.includes('supabase.com') || 
      connectionString?.includes('render.com') ||
      nodeEnv === 'production';

    const pool = new Pool({
      connectionString,
      ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.logger.log(`Prisma connected to: ${connectionString?.split('@')[1]?.split('/')[0]}`);
    this.logger.log(`SSL Mode: ${needsSSL ? 'Enabled (rejectUnauthorized: false)' : 'Disabled'}`);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma + PostgreSQL connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
