import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TemplateModule } from './template/template.module';
import { CvModule } from './cv/cv.module';
import { RenderingModule } from './rendering/rendering.module';
import { ExportModule } from './export/export.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, UserModule, TemplateModule, CvModule, RenderingModule, ExportModule, AuthModule, CloudinaryModule],
})
export class AppModule {}
