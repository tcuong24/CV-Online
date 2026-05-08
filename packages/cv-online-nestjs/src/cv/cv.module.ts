import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvSectionsService } from './cv-sections.service';
import { CvSectionsController } from './cv-sections.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CvParserService } from './cv-parser.service';
import { CvAiService } from './cv-ai.service';
import { CvAiController } from './cv-ai.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [CvController, CvSectionsController, CvAiController],
  providers: [CvService, CvSectionsService, CvParserService, CvAiService],
  exports: [CvService, CvSectionsService, CvParserService, CvAiService],
})
export class CvModule { }
