import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCVDto,
  UpdateCVDto,
  UpdateCustomStylesDto,
  ReorderSectionsDto,
  CreatePersonalInfoDto,
  UpdatePersonalInfoDto,
} from './dto';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new CV
   */
  async create(userId: string, createCVDto: CreateCVDto) {
    const cv = await this.prisma.cV.create({
      data: {
        userId,
        title: createCVDto.title,
        templateId: createCVDto.templateId,
        status: 'draft',
      },
      include: {
        template: true,
      },
    });

    // Increment template usage if template is selected
    if (createCVDto.templateId) {
      await this.prisma.template.update({
        where: { id: createCVDto.templateId },
        data: {
          usageCount: { increment: 1 },
          popularityScore: { increment: 1 },
        },
      });
    }

    return cv;
  }

  /**
   * Get all CVs for a user
   */
  async findAllByUser(userId: string) {
    return this.prisma.cV.findMany({
      where: { userId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            thumbnailUrl: true,
            category: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get the default (most recently updated) CV for a user with all sections
   */
  async findDefaultByUserId(userId: string) {
    return this.prisma.cV.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        personalInfo: true,
        experiences: { orderBy: { displayOrder: 'asc' } },
        skills: { orderBy: { displayOrder: 'asc' } },
        languages: { orderBy: { displayOrder: 'asc' } },
        education: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  /**
   * Get CV by ID with all relations
   */
  async findOne(id: string, userId?: string) {
    const cv = await this.prisma.cV.findUnique({
      where: { id },
      include: {
        template: true,
        personalInfo: true,
        experiences: {
          orderBy: { displayOrder: 'asc' },
        },
        education: {
          orderBy: { displayOrder: 'asc' },
        },
        skills: {
          orderBy: { displayOrder: 'asc' },
        },
        projects: {
          orderBy: { displayOrder: 'asc' },
        },
        certifications: {
          orderBy: { displayOrder: 'asc' },
        },
        languages: {
          orderBy: { displayOrder: 'asc' },
        },
        awards: {
          orderBy: { displayOrder: 'asc' },
        },
        references: {
          orderBy: { displayOrder: 'asc' },
        },
        customSections: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    // Check ownership if userId is provided
    if (userId && cv.userId !== userId && !cv.isPublic) {
      throw new ForbiddenException('You do not have access to this CV');
    }

    return cv;
  }

  /**
   * Get CV by public URL token
   */
  async findByPublicToken(token: string) {
    const cv = await this.prisma.cV.findUnique({
      where: { publicUrlToken: token },
      include: {
        template: true,
        personalInfo: true,
        experiences: {
          orderBy: { displayOrder: 'asc' },
        },
        education: {
          orderBy: { displayOrder: 'asc' },
        },
        skills: {
          orderBy: { displayOrder: 'asc' },
        },
        projects: {
          orderBy: { displayOrder: 'asc' },
        },
        certifications: {
          orderBy: { displayOrder: 'asc' },
        },
        languages: {
          orderBy: { displayOrder: 'asc' },
        },
        awards: {
          orderBy: { displayOrder: 'asc' },
        },
        references: {
          orderBy: { displayOrder: 'asc' },
        },
        customSections: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!cv || !cv.isPublic) {
      throw new NotFoundException('CV not found or not public');
    }

    // Increment view count
    await this.prisma.cV.update({
      where: { id: cv.id },
      data: { viewCount: { increment: 1 } },
    });

    return cv;
  }

  /**
   * Update CV basic info
   */
  async update(id: string, userId: string, updateCVDto: UpdateCVDto) {
    // Check ownership
    const cv = await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: updateCVDto,
    });
  }

  /**
   * Update custom styles
   */
  async updateCustomStyles(
    id: string,
    userId: string,
    updateCustomStylesDto: UpdateCustomStylesDto,
  ) {
    // Check ownership
    await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: {
        customStyles: updateCustomStylesDto.customStyles,
      },
    });
  }

  /**
   * Reorder sections
   */
  async reorderSections(
    id: string,
    userId: string,
    reorderSectionsDto: ReorderSectionsDto,
  ) {
    // Check ownership
    await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: {
        sectionsOrder: reorderSectionsDto.sectionsOrder,
      },
    });
  }

  /**
   * Update sections visibility
   */
  async updateSectionsVisibility(
    id: string,
    userId: string,
    sectionsVisibility: Record<string, boolean>,
  ) {
    // Check ownership
    await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: {
        sectionsVisibility,
      },
    });
  }

  /**
   * Delete CV
   */
  async remove(id: string, userId: string) {
    // Check ownership
    await this.findOne(id, userId);

    return this.prisma.cV.delete({
      where: { id },
    });
  }
  async publish(id: string, userId: string) {
  await this.findOne(id, userId);

  const cv = await this.prisma.cV.findUniqueOrThrow({
    where: { id },
  });

  const publicUrlToken =
    cv.publicUrlToken ?? this.generatePublicToken();

  return this.prisma.cV.update({
    where: { id },
    data: {
      isPublic: true,
      status: 'published',
      publishedAt: new Date(),
      publicUrlToken,
    },
  });
}

  /**
   * Unpublish CV
   */
  async unpublish(id: string, userId: string) {
    // Check ownership
    await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: {
        isPublic: false,
        status: 'draft',
      },
    });
  }

  // =============================================================================
  // PERSONAL INFO METHODS
  // =============================================================================

  async createOrUpdatePersonalInfo(
    cvId: string,
    userId: string,
    data: CreatePersonalInfoDto | UpdatePersonalInfoDto,
  ) {
    // Check ownership
    await this.findOne(cvId, userId);

    // Check if personal info already exists
    const existing = await this.prisma.cVPersonalInfo.findUnique({
      where: { cvId },
    });

    if (existing) {
      return this.prisma.cVPersonalInfo.update({
        where: { cvId },
        data,
      });
    } else {
      return this.prisma.cVPersonalInfo.create({
        data: {
          cvId,
          ...data,
        },
      });
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private generatePublicToken(): string {
    return `pub-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
