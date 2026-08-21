import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    passwordHash: string;
    fullName?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        subscriptionType: true,
        createdAt: true,
      },
    });
  }

  async updateAvatarUrl(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    });
  }

  async updateProfileVisibility(userId: string, profileIsPublic: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { profileIsPublic },
      select: {
        id: true,
        profileIsPublic: true,
        profileViewCount: true,
      },
    });
  }

  async findPublicProfile(userId: string, viewerUserId?: string) {
    const profileOwner = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        profileIsPublic: true,
        profileViewCount: true,
      },
    });

    if (!profileOwner?.profileIsPublic) {
      throw new NotFoundException('Public profile not found');
    }

    const cv = await this.prisma.cV.findFirst({
      where: { userId, isDefault: true },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            profileIsPublic: true,
            profileViewCount: true,
          },
        },
        personalInfo: true,
        experiences: { orderBy: { displayOrder: 'asc' } },
        education: { orderBy: { displayOrder: 'asc' } },
        skills: { orderBy: { displayOrder: 'asc' } },
        languages: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!cv) {
      throw new NotFoundException('Public profile not found');
    }

    if (!viewerUserId || viewerUserId !== userId) {
      const updatedOwner = await this.prisma.user.update({
        where: { id: userId },
        data: { profileViewCount: { increment: 1 } },
        select: { profileViewCount: true },
      });

      return {
        ...cv,
        user: {
          ...cv.user,
          profileViewCount: updatedOwner.profileViewCount,
        },
      };
    }

    return cv;
  }
}

