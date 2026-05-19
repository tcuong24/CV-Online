import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { CvParserService } from './cv-parser.service';
import {
  CreateCVDto,
  UpdateCVDto,
  UpdateCustomStylesDto,
  ReorderSectionsDto,
  CreatePersonalInfoDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cvs')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly cvParserService: CvParserService,
  ) { }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB limit
          new FileTypeValidator({ fileType: /(pdf|docx|msword|image\/.*)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cvParserService.parseFile(file);
  }

  @Post()
  async create(@Request() req, @Body() createCVDto: CreateCVDto) {
    const userId = req.user?.id || 'user-001';
    console.log('>>> POST /cvs — userId:', userId, '| req.user:', req.user);
    return this.cvService.create(userId, createCVDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id || 'user-001';
    return this.cvService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('default')          // ← static, phải trước :id
  async findDefault(@Request() req: { user: { id: string } }) {
    const cv = await this.cvService.findDefaultByUserId(req.user.id);
    return cv ?? {
      user: null,
      personalInfo: null,
      experiences: [],
      skills: [],
      languages: [],
      education: [],
    };
  }

  // ── Prefix routes trước :id ────────────────────────────────
  @Get('public/:token')    // ← phải trước :id
  async findByPublicToken(@Param('token') token: string) {
    return this.cvService.findByPublicToken(token);
  }

  @Get(':id')              // ← sau tất cả static routes
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 'user-001';
    const userRole = req.user?.role;
    return this.cvService.findOne(id, userId, userRole);
  }


  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCVDto: UpdateCVDto,
  ) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.update(id, userId, updateCVDto);
  }

  @Put(':id/custom-styles')
  async updateCustomStyles(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCustomStylesDto: UpdateCustomStylesDto,
  ) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.updateCustomStyles(id, userId, updateCustomStylesDto);
  }

  @Put(':id/reorder-sections')
  async reorderSections(
    @Param('id') id: string,
    @Request() req,
    @Body() reorderSectionsDto: ReorderSectionsDto,
  ) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.reorderSections(id, userId, reorderSectionsDto);
  }

  @Put(':id/sections-visibility')
  async updateSectionsVisibility(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { sectionsVisibility: Record<string, boolean> },
  ) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.updateSectionsVisibility(
      id,
      userId,
      body.sectionsVisibility,
    );
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string, @Request() req) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.publish(id, userId);
  }

  @Post(':id/unpublish')
  async unpublish(@Param('id') id: string, @Request() req) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.unpublish(id, userId);
  }

  @Patch(':id/set-default')
  async setDefault(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.cvService.setDefault(id, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.remove(id, userId);
  }

  // Personal Info
  @Put(':id/personal-info')
  async updatePersonalInfo(
    @Param('id') id: string,
    @Request() req,
    @Body() createPersonalInfoDto: CreatePersonalInfoDto,
  ) {
    // TODO: Get userId from auth guard
    const userId = req.user?.id || 'user-001'; // Temporary hardcode
    return this.cvService.createOrUpdatePersonalInfo(
      id,
      userId,
      createPersonalInfoDto,
    );
  }
}