import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('cv/:id/pdf')
  async exportPDF(
    @Param('id') id: string,
    @Body()
    options: {
      pageSize?: 'A4' | 'Letter';
      includePhoto?: boolean;
      colorMode?: 'color' | 'grayscale';
    },
    @Res() res: Response,
  ) {
    const pdf = await this.exportService.exportToPDF(id, options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cv-${id}.pdf"`);
    res.send(pdf);
  }

  @Post('cv/:id/html')
  async exportHTML(@Param('id') id: string, @Res() res: Response) {
    const html = await this.exportService.exportToHTML(id);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="cv-${id}.html"`);
    res.send(html);
  }

  @Get('cv/:id/history')
  async getExportHistory(@Param('id') id: string) {
    return this.exportService.getExportHistory(id);
  }
}
