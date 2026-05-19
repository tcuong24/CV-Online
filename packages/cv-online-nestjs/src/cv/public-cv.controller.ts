import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CvService } from './cv.service';

@Controller('public-cvs')
export class PublicCvController {
  constructor(private readonly cvService: CvService) {}

  @Get(':id')
  async getPublicCv(@Param('id') id: string) {
    const cv = await this.cvService.findOne(id);
    if (!cv || !cv.isPublic) {
      throw new NotFoundException('CV not found or not public');
    }
    return cv;
  }
}
