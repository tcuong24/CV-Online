import { Controller, Get, Post, Body, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  updateAvatar(@Request() req, @Body('avatarUrl') avatarUrl: string) {
    return this.userService.updateAvatarUrl(req.user.id, avatarUrl);
  }
}
