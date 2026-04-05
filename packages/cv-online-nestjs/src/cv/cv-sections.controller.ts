import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CvSectionsService } from './cv-sections.service';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
  CreateEducationDto,
  UpdateEducationDto,
  CreateSkillDto,
  UpdateSkillDto,
  CreateProjectDto,
  UpdateProjectDto,
  CreateCertificationDto,
  UpdateCertificationDto,
  CreateLanguageDto,
  UpdateLanguageDto,
  CreateAwardDto,
  UpdateAwardDto,
  CreateReferenceDto,
  UpdateReferenceDto,
} from './dto';

@Controller('cvs/:cvId')
export class CvSectionsController {
  constructor(private readonly cvSectionsService: CvSectionsService) {}

  // =============================================================================
  // EXPERIENCES
  // =============================================================================

  @Post('experiences')
  async createExperience(
    @Param('cvId') cvId: string,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return this.cvSectionsService.createExperience(cvId, createExperienceDto);
  }

  @Put('experiences/:id')
  async updateExperience(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.cvSectionsService.updateExperience(id, updateExperienceDto);
  }

  @Delete('experiences/:id')
  async deleteExperience(@Param('id') id: string) {
    return this.cvSectionsService.deleteExperience(id);
  }

  // =============================================================================
  // EDUCATION
  // =============================================================================

  @Post('education')
  async createEducation(
    @Param('cvId') cvId: string,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    return this.cvSectionsService.createEducation(cvId, createEducationDto);
  }

  @Put('education/:id')
  async updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.cvSectionsService.updateEducation(id, updateEducationDto);
  }

  @Delete('education/:id')
  async deleteEducation(@Param('id') id: string) {
    return this.cvSectionsService.deleteEducation(id);
  }

  // =============================================================================
  // SKILLS
  // =============================================================================

  @Post('skills')
  async createSkill(
    @Param('cvId') cvId: string,
    @Body() createSkillDto: CreateSkillDto,
  ) {
    return this.cvSectionsService.createSkill(cvId, createSkillDto);
  }

  @Put('skills/:id')
  async updateSkill(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.cvSectionsService.updateSkill(id, updateSkillDto);
  }

  @Delete('skills/:id')
  async deleteSkill(@Param('id') id: string) {
    return this.cvSectionsService.deleteSkill(id);
  }

  // =============================================================================
  // PROJECTS
  // =============================================================================

  @Post('projects')
  async createProject(
    @Param('cvId') cvId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.cvSectionsService.createProject(cvId, createProjectDto);
  }

  @Put('projects/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.cvSectionsService.updateProject(id, updateProjectDto);
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return this.cvSectionsService.deleteProject(id);
  }

  // =============================================================================
  // CERTIFICATIONS
  // =============================================================================

  @Post('certifications')
  async createCertification(
    @Param('cvId') cvId: string,
    @Body() createCertificationDto: CreateCertificationDto,
  ) {
    return this.cvSectionsService.createCertification(
      cvId,
      createCertificationDto,
    );
  }

  @Put('certifications/:id')
  async updateCertification(
    @Param('id') id: string,
    @Body() updateCertificationDto: UpdateCertificationDto,
  ) {
    return this.cvSectionsService.updateCertification(
      id,
      updateCertificationDto,
    );
  }

  @Delete('certifications/:id')
  async deleteCertification(@Param('id') id: string) {
    return this.cvSectionsService.deleteCertification(id);
  }

  // =============================================================================
  // LANGUAGES
  // =============================================================================

  @Post('languages')
  async createLanguage(
    @Param('cvId') cvId: string,
    @Body() createLanguageDto: CreateLanguageDto,
  ) {
    return this.cvSectionsService.createLanguage(cvId, createLanguageDto);
  }

  @Put('languages/:id')
  async updateLanguage(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.cvSectionsService.updateLanguage(id, updateLanguageDto);
  }

  @Delete('languages/:id')
  async deleteLanguage(@Param('id') id: string) {
    return this.cvSectionsService.deleteLanguage(id);
  }

  // =============================================================================
  // AWARDS
  // =============================================================================

  @Post('awards')
  async createAward(
    @Param('cvId') cvId: string,
    @Body() createAwardDto: CreateAwardDto,
  ) {
    return this.cvSectionsService.createAward(cvId, createAwardDto);
  }

  @Put('awards/:id')
  async updateAward(
    @Param('id') id: string,
    @Body() updateAwardDto: UpdateAwardDto,
  ) {
    return this.cvSectionsService.updateAward(id, updateAwardDto);
  }

  @Delete('awards/:id')
  async deleteAward(@Param('id') id: string) {
    return this.cvSectionsService.deleteAward(id);
  }

  // =============================================================================
  // REFERENCES
  // =============================================================================

  @Post('references')
  async createReference(
    @Param('cvId') cvId: string,
    @Body() createReferenceDto: CreateReferenceDto,
  ) {
    return this.cvSectionsService.createReference(cvId, createReferenceDto);
  }

  @Put('references/:id')
  async updateReference(
    @Param('id') id: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ) {
    return this.cvSectionsService.updateReference(id, updateReferenceDto);
  }

  @Delete('references/:id')
  async deleteReference(@Param('id') id: string) {
    return this.cvSectionsService.deleteReference(id);
  }
}
