import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('isPremium', new ParseBoolPipe({ optional: true }))
    isPremium?: boolean,
    @Query('isPublished', new ParseBoolPipe({ optional: true }))
    isPublished?: boolean,
  ) {
    return this.templateService.findAll({
      category,
      isPremium,
      isPublished,
    });
  }

  @Get('categories')
  async getCategories() {
    return this.templateService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Get(':id/preview')
  async getPreview(@Param('id') id: string) {
    return this.templateService.getPreview(id);
  }

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }

  @Post(':id/increment-usage')
  async incrementUsage(@Param('id') id: string) {
    return this.templateService.incrementUsage(id);
  }
}
