import { Module } from '@nestjs/common';
import { RenderingService } from './rendering.service';
import { RenderingController } from './rendering.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RenderingController],
  providers: [RenderingService],
  exports: [RenderingService],
})
export class RenderingModule {}
