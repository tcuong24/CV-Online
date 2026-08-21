import { Controller, Get, Post, Body, Patch, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(
    @Body() body: { email: string; passwordHash: string; fullName?: string },
  ) {
    return this.userService.create(body);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('public-profile/:userId')
  @UseGuards(OptionalJwtAuthGuard)
  findPublicProfile(
    @Param('userId') userId: string,
    @Request() req: { user?: { id?: string } },
  ) {
    return this.userService.findPublicProfile(userId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile-visibility')
  updateProfileVisibility(
    @Request() req: { user: { id: string } },
    @Body('isPublic') isPublic: boolean,
  ) {
    return this.userService.updateProfileVisibility(req.user.id, isPublic);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  updateAvatar(@Request() req, @Body('avatarUrl') avatarUrl: string) {
    return this.userService.updateAvatarUrl(req.user.id, avatarUrl);
  }
}
