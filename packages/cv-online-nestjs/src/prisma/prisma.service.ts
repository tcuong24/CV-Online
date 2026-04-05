import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.logger.log(`Prisma adapter initialized with PostgreSQL`);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma + PostgreSQL connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
