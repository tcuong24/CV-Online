import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    const pool = new Pool({
      connectionString,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.logger.log(`Prisma adapter initialized with PostgreSQL from environment`);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma + PostgreSQL connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
