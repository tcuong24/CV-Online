import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class CvSectionsService {
  constructor(private prisma: PrismaService) {}

  // =============================================================================
  // EXPERIENCES
  // =============================================================================

  async createExperience(cvId: string, data: CreateExperienceDto) {
    return this.prisma.cVExperience.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateExperience(id: string, data: UpdateExperienceDto) {
    return this.prisma.cVExperience.update({
      where: { id },
      data,
    });
  }

  async deleteExperience(id: string) {
    return this.prisma.cVExperience.delete({
      where: { id },
    });
  }

  // =============================================================================
  // EDUCATION
  // =============================================================================

  async createEducation(cvId: string, data: CreateEducationDto) {
    return this.prisma.cVEducation.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateEducation(id: string, data: UpdateEducationDto) {
    return this.prisma.cVEducation.update({
      where: { id },
      data,
    });
  }

  async deleteEducation(id: string) {
    return this.prisma.cVEducation.delete({
      where: { id },
    });
  }

  // =============================================================================
  // SKILLS
  // =============================================================================

  async createSkill(cvId: string, data: CreateSkillDto) {
    return this.prisma.cVSkill.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateSkill(id: string, data: UpdateSkillDto) {
    return this.prisma.cVSkill.update({
      where: { id },
      data,
    });
  }

  async deleteSkill(id: string) {
    return this.prisma.cVSkill.delete({
      where: { id },
    });
  }

  // =============================================================================
  // PROJECTS
  // =============================================================================

  async createProject(cvId: string, data: CreateProjectDto) {
    return this.prisma.cVProject.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateProject(id: string, data: UpdateProjectDto) {
    return this.prisma.cVProject.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: string) {
    return this.prisma.cVProject.delete({
      where: { id },
    });
  }

  // =============================================================================
  // CERTIFICATIONS
  // =============================================================================

  async createCertification(cvId: string, data: CreateCertificationDto) {
    return this.prisma.cVCertification.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateCertification(id: string, data: UpdateCertificationDto) {
    return this.prisma.cVCertification.update({
      where: { id },
      data,
    });
  }

  async deleteCertification(id: string) {
    return this.prisma.cVCertification.delete({
      where: { id },
    });
  }

  // =============================================================================
  // LANGUAGES
  // =============================================================================

  async createLanguage(cvId: string, data: CreateLanguageDto) {
    return this.prisma.cVLanguage.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateLanguage(id: string, data: UpdateLanguageDto) {
    return this.prisma.cVLanguage.update({
      where: { id },
      data,
    });
  }

  async deleteLanguage(id: string) {
    return this.prisma.cVLanguage.delete({
      where: { id },
    });
  }

  // =============================================================================
  // AWARDS
  // =============================================================================

  async createAward(cvId: string, data: CreateAwardDto) {
    return this.prisma.cVAward.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateAward(id: string, data: UpdateAwardDto) {
    return this.prisma.cVAward.update({
      where: { id },
      data,
    });
  }

  async deleteAward(id: string) {
    return this.prisma.cVAward.delete({
      where: { id },
    });
  }

  // =============================================================================
  // REFERENCES
  // =============================================================================

  async createReference(cvId: string, data: CreateReferenceDto) {
    return this.prisma.cVReference.create({
      data: {
        cvId,
        ...data,
      },
    });
  }

  async updateReference(id: string, data: UpdateReferenceDto) {
    return this.prisma.cVReference.update({
      where: { id },
      data,
    });
  }

  async deleteReference(id: string) {
    return this.prisma.cVReference.delete({
      where: { id },
    });
  }
}
