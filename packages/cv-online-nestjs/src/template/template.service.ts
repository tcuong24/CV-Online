import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all templates with optional filtering
   */
  async findAll(filters?: {
    category?: string;
    isPremium?: boolean;
    isPublished?: boolean;
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.isPremium !== undefined) {
      where.isPremium = filters.isPremium;
    }
    if (filters?.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    } else {
      // By default, only show published templates
      where.isPublished = true;
    }

    return this.prisma.template.findMany({
      where,
      orderBy: [
        { popularityScore: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
      id: true,
      name: true,
      description: true,
      thumbnailUrl: true,
      previewPdfUrl: true,
      category: true,
      isPremium: true,
      isPublished: true,
      layoutType: true,
      popularityScore: true,
      usageCount: true,
      version: true,
      sectionsConfig: true,
      designConfig: true,
      tags: true,
    },
    });
  }

  /**
   * Get template by ID with full details
   */
  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        sampleData: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  /**
   * Get template preview (with sample data rendered)
   */
  async getPreview(id: string) {
    const template = await this.findOne(id);

    return {
      template: {
        id: template.id,
        name: template.name,
        designConfig: template.designConfig,
        sectionsConfig: template.sectionsConfig,
        layoutType: template.layoutType,
      },
      sampleData: template.sampleData?.sampleData || null,
    };
  }

  /**
   * Create new template
   */
  async create(createTemplateDto: CreateTemplateDto) {
    return this.prisma.template.create({
      data: {
        name: createTemplateDto.name,
        description: createTemplateDto.description,
        thumbnailUrl: createTemplateDto.thumbnailUrl,
        previewPdfUrl: createTemplateDto.previewPdfUrl,
        category: createTemplateDto.category,
        isPremium: createTemplateDto.isPremium,
        layoutType: createTemplateDto.layoutType,
        designConfig: createTemplateDto.designConfig,
        sectionsConfig: createTemplateDto.sectionsConfig,
        tags: createTemplateDto.tags || [],
      },
    });
  }

  /**
   * Update template
   */
  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    // Check if template exists
    await this.findOne(id);

    // Destructure only scalar fields accepted by the Template model.
    // DO NOT pass the raw DTO directly — extra fields (sampleData, id,
    // createdAt, updatedAt, etc.) will cause PrismaClientValidationError.
    const {
      name,
      description,
      thumbnailUrl,
      previewPdfUrl,
      category,
      isPremium,
      isPublished,
      layoutType,
      designConfig,
      sectionsConfig,
      tags,
    } = updateTemplateDto;

    return this.prisma.template.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(previewPdfUrl !== undefined && { previewPdfUrl }),
        ...(category !== undefined && { category }),
        ...(isPremium !== undefined && { isPremium }),
        ...(isPublished !== undefined && { isPublished }),
        ...(layoutType !== undefined && { layoutType }),
        ...(designConfig !== undefined && { designConfig }),
        ...(sectionsConfig !== undefined && { sectionsConfig }),
        ...(tags !== undefined && { tags }),
      },
    });
  }

  /**
   * Delete template
   */
  async remove(id: string) {
    // Check if template exists
    await this.findOne(id);

    return this.prisma.template.delete({
      where: { id },
    });
  }

  /**
   * Increment usage count when template is used
   */
  async incrementUsage(id: string) {
    return this.prisma.template.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
        popularityScore: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get template categories
   */
  async getCategories() {
    const templates = await this.prisma.template.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    });

    return templates.map((t) => t.category);
  }
}
