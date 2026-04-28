import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin/templates')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminTemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isPremium', new ParseBoolPipe({ optional: true })) isPremium?: boolean,
    @Query('isPublished', new ParseBoolPipe({ optional: true })) isPublished?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.templateService.findAll({
      page,
      limit,
      search,
      category,
      isPremium,
      isPublished,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.templateService.update(id, dto);
  }

  @Patch(':id/status')
  async toggleStatus(
    @Param('id') id: string,
    @Body('isPublished', ParseBoolPipe) isPublished: boolean,
  ) {
    return this.templateService.update(id, { isPublished });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
