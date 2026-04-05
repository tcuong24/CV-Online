import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvSectionsService } from './cv-sections.service';
import { CvSectionsController } from './cv-sections.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CvController, CvSectionsController],
  providers: [CvService, CvSectionsService],
  exports: [CvService, CvSectionsService],
})
export class CvModule {}
