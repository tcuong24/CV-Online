import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  /** GET /admin/stats — tổng quan hệ thống */
  @Get('stats')
  async getStats() {
    const [totalUsers, totalCvs, adminCount, freeUsers, proUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.cV.count(),
      this.prisma.user.count({ where: { role: 'admin' } }),
      this.prisma.user.count({ where: { subscriptionType: 'free' } }),
      this.prisma.user.count({ where: { subscriptionType: { not: 'free' } } }),
    ]);
    return { totalUsers, totalCvs, adminCount, freeUsers, proUsers };
  }

  /** GET /admin/users — danh sách tất cả user */
  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        subscriptionType: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { cvs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** PATCH /admin/users/:id — cập nhật role hoặc subscription */
  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { role?: 'user' | 'admin'; subscriptionType?: string },
  ) {
    return this.prisma.user.update({
      where: { id },
      data: body,
      select: { id: true, email: true, role: true, subscriptionType: true },
    });
  }

  /** DELETE /admin/users/:id — xóa user */
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    if (req.user.sub === id) {
      return { error: 'Không thể xóa chính mình.' };
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
