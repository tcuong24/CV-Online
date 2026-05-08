import { IsString, IsOptional, IsBoolean, IsObject, IsArray, IsEnum, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

// =============================================================================
// TEMPLATE DTOs
// =============================================================================

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  thumbnailUrl: string;

  @IsOptional()
  @IsString()
  previewPdfUrl?: string;

  @IsString()
  category: string;

  @IsBoolean()
  isPremium: boolean;

  @IsString()
  layoutType: string;

  @IsObject()
  designConfig: any;

  @IsObject()
  sectionsConfig: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  previewPdfUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  layoutType?: string;

  @IsOptional()
  @IsObject()
  designConfig?: any;

  @IsOptional()
  @IsObject()
  sectionsConfig?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// =============================================================================
// CV DTOs
// =============================================================================

export class CreateCVDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}

export class UpdateCVDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsObject()
  customStyles?: any;

  @IsOptional()
  @IsObject()
  sectionsVisibility?: Record<string, boolean>;

  @IsOptional()
  sectionsOrder?: any;

  @IsOptional()
  @IsObject()
  sectionsLayout?: any;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';
}

export class UpdateCustomStylesDto {
  @IsObject()
  customStyles: any;
}

export class ReorderSectionsDto {
  @IsOptional()
  sectionsOrder?: any;
}

// =============================================================================
// CV SECTION DTOs
// =============================================================================

export class CreatePersonalInfoDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  summary?: string;
}

export class UpdatePersonalInfoDto extends CreatePersonalInfoDto {}

export class CreateExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsBoolean()
  isCurrent: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateExperienceDto extends CreateExperienceDto {}

export class CreateEducationDto {
  @IsString()
  institutionName: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsBoolean()
  isCurrent: boolean;

  @IsOptional()
  @IsString()
  gpa?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateEducationDto extends CreateEducationDto {}

export class CreateSkillDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  skillName: string;

  @IsOptional()
  @IsString()
  proficiencyLevel?: string;

  @IsOptional()
  @IsNumber()
  proficiencyPercentage?: number;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateSkillDto extends CreateSkillDto {}

export class CreateProjectDto {
  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsBoolean()
  isOngoing: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsString()
  projectUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateProjectDto extends CreateProjectDto {}

export class CreateCertificationDto {
  @IsString()
  name: string;

  @IsString()
  issuingOrganization: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issueDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  credentialId?: string;

  @IsOptional()
  @IsString()
  credentialUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateCertificationDto extends CreateCertificationDto {}

export class CreateLanguageDto {
  @IsString()
  languageName: string;

  @IsOptional()
  @IsString()
  proficiencyLevel?: string;

  @IsBoolean()
  canRead: boolean;

  @IsBoolean()
  canWrite: boolean;

  @IsBoolean()
  canSpeak: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateLanguageDto extends CreateLanguageDto {}

export class CreateAwardDto {
  @IsString()
  title: string;

  @IsString()
  issuer: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateReceived?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateAwardDto extends CreateAwardDto {}

export class CreateReferenceDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateReferenceDto extends CreateReferenceDto {}

export class CreateCustomSectionDto {
  @IsString()
  sectionTitle: string;

  @IsOptional()
  @IsString()
  sectionType?: string;

  @IsObject()
  content: any;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateCustomSectionDto extends CreateCustomSectionDto {}

// =============================================================================
// EXPORT DTOs
// =============================================================================

export class ExportCVDto {
  @IsEnum(['pdf', 'docx', 'html'])
  format: 'pdf' | 'docx' | 'html';

  @IsOptional()
  @IsObject()
  options?: {
    pageSize?: 'A4' | 'Letter';
    includePhoto?: boolean;
    colorMode?: 'color' | 'grayscale';
  };
}
