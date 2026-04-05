import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RenderingModule } from '../rendering/rendering.module';

@Module({
  imports: [PrismaModule, RenderingModule],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
