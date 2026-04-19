import { IsString, IsOptional, IsBoolean, IsObject, IsArray } from 'class-validator';

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
