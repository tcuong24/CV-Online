import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RenderingService } from '../rendering/rendering.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private renderingService: RenderingService,
  ) {}

  /**
   * Export CV to PDF
   */
  async exportToPDF(
    cvId: string,
    options?: {
      pageSize?: 'A4' | 'Letter';
      includePhoto?: boolean;
      colorMode?: 'color' | 'grayscale';
    },
  ): Promise<Buffer> {
    // Get CV owner
    const cv = await this.prisma.cV.findUnique({
      where: { id: cvId },
      select: { userId: true },
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    // Get rendered HTML
    const html = await this.renderingService.renderCV(cvId);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Apply grayscale if needed
      if (options?.colorMode === 'grayscale') {
        await page.emulateMediaFeatures([
          { name: 'prefers-color-scheme', value: 'light' },
        ]);
        await page.addStyleTag({
          content: `
            * {
              -webkit-filter: grayscale(100%);
              filter: grayscale(100%);
            }
          `,
        });
      }

      // Generate PDF
      const pdf = await page.pdf({
        format: options?.pageSize || 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      });

      // Track export
      await this.prisma.cVExport.create({
        data: {
          cvId,
          userId: cv.userId,
          exportType: 'pdf',
          exportOptions: options || {},
          status: 'completed',
          completedAt: new Date(),
        },
      });

      // Increment download count
      await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  /**
   * Export CV to HTML (downloadable)
   */
  async exportToHTML(cvId: string): Promise<string> {
    // Get CV owner
    const cv = await this.prisma.cV.findUnique({
      where: { id: cvId },
      select: { userId: true },
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    const html = await this.renderingService.renderCV(cvId);

    // Track export
    await this.prisma.cVExport.create({
      data: {
        cvId,
        userId: cv.userId,
        exportType: 'html',
        exportOptions: {},
        status: 'completed',
        completedAt: new Date(),
      },
    });

    return html;
  }

  /**
   * Get export history for a CV
   */
  async getExportHistory(cvId: string) {
    return this.prisma.cVExport.findMany({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
