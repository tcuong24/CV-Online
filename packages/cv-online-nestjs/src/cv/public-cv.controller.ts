import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('public-cvs')
export class PublicCvController {
  constructor(private readonly cvService: CvService) {}

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPublicCv(
    @Param('id') id: string,
    @Req() req: { user?: { id?: string } },
  ) {
    return this.cvService.findPublicById(id, req.user?.id);
  }
}
