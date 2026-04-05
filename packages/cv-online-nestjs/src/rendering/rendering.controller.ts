import { Controller, Get, Param, Delete } from '@nestjs/common';
import { RenderingService } from './rendering.service';

@Controller('rendering')
export class RenderingController {
  constructor(private readonly renderingService: RenderingService) {}

  @Get('cv/:id')
  async renderCV(@Param('id') id: string) {
    const html = await this.renderingService.renderCV(id);
    return { html };
  }

  @Delete('cache/:cvId')
  async clearCache(@Param('cvId') cvId: string) {
    await this.renderingService.clearCache(cvId);
    return { message: 'Cache cleared' };
  }
}
