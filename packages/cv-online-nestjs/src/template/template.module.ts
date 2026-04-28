import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminTemplateController } from './admin-template.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TemplateController, AdminTemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
