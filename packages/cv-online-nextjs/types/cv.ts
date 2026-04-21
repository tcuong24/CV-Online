/**
 * types/cv.ts
 *
 * Types phản ánh đúng schema Prisma sau khi áp dụng Hướng C:
 *   - Bỏ references[] và customSections[] khỏi CVWithRelations
 *   - Gộp vào supplementary Json field
 *   - Thêm snapshotDesignConfig tách biệt với customStyles
 */

import type {
  PersonalInfo,
  StyleConfig,
  LayoutType,
} from './cvEditor';

// ─── DB raw JSON types (opaque — parsed at runtime by templateMapper) ──────────

/**
 * Raw `design_config` JSON blob stored in the DB Template record.
 * Shape is validated/parsed by `parseDesignConfig()` in templateMapper.ts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbDesignConfig = Record<string, any>;

/**
 * Raw `sections_config` JSON blob stored in the DB Template record.
 * Shape is validated/parsed by `parseSectionsConfig()` and `parseSectionLayouts()`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbSectionsConfig = Record<string, any>;

// ─── Supplementary (thay thế cv_references + cv_custom_sections) ──────────────

export interface CvReference {
  id: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  relationship?: string;
  email?: string;
  phone?: string;
  displayOrder: number;
}
export interface TemplateInfo {
  id: string;
  name: string;
  description?: string | null;
  thumbnailUrl: string;
  layoutType: LayoutType;
  designConfig: DbDesignConfig;
  sectionsConfig: DbSectionsConfig;
  isPremium?: boolean;
  tags?: string[];
}
export interface CvCustomSection {
  id: string;
  sectionTitle: string;
  sectionType?: string;
  content: unknown;
  displayOrder: number;
}

export interface CvSupplementary {
  references?: CvReference[];
  customSections?: CvCustomSection[];
}

// ─── Section models (map 1-1 với các bảng cv_* còn giữ lại) ──────────────────

// CvPersonalInfo removed — use PersonalInfo from cvEditor.ts

export interface CvExperience {
  id: string;
  cvId: string;
  companyName: string;
  position: string;
  location?: string | null;
  companyWebsite?: string | null;
  startDate?: Date | null;   // nullable — fix #3 từ schema review
  endDate?: Date | null;
  isCurrent: boolean;
  description?: string | null;
  achievements: string[];
  technologies: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvEducation {
  id: string;
  cvId: string;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string | null;
  location?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isCurrent: boolean;
  gpa?: string | null;
  description?: string | null;
  achievements: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvSkill {
  id: string;
  cvId: string;
  category?: string | null;
  skillName: string;
  proficiencyLevel?: string | null;
  proficiencyPercentage?: number | null;
  yearsOfExperience?: number | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvProject {
  id: string;
  cvId: string;
  projectName: string;
  role?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isOngoing: boolean;
  description?: string | null;
  achievements: string[];
  technologies: string[];
  projectUrl?: string | null;
  githubUrl?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvCertification {
  id: string;
  cvId: string;
  name: string;
  issuingOrganization: string;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvLanguage {
  id: string;
  cvId: string;
  languageName: string;
  proficiencyLevel?: string | null;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvAward {
  id: string;
  cvId: string;
  title: string;
  issuer: string;
  dateReceived?: Date | null;
  description?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvInterest {
  id: string;
  cvId: string;
  name: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvActivity {
  id: string;
  cvId: string;
  name: string;
  role?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  description?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Template (subset cần thiết trong editor) ─────────────────────────────────

export interface TemplateInCv {
  id: string;
  name: string;
  description?: string | null;
  thumbnailUrl: string;
  previewPdfUrl?: string | null;
  category: string;
  isPremium: boolean;
  isPublished: boolean;
  popularityScore: number;
  usageCount: number;
  layoutType: LayoutType;
  designConfig: DbDesignConfig;
  sectionsConfig: DbSectionsConfig;
  version: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── CV chính ─────────────────────────────────────────────────────────────────

export type CvStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface CVWithRelations {
  // ── Meta ──────────────────────────────────────────────────────────────────
  id: string;
  userId: string;
  templateId?: string | null;
  title: string;
  slug?: string | null;
  isPublic: boolean;
  publicUrlToken?: string | null;
  status: CvStatus;
  viewCount: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  thumbnailUrl?: string | null;

  // ── Style & layout ────────────────────────────────────────────────────────
  /**
   * Snapshot toàn bộ template.designConfig tại thời điểm user chọn template.
   * Không thay đổi khi admin sửa template sau này.
   * Khi user đổi template → overwrite field này.
   */
  snapshotDesignConfig?: DbDesignConfig | null;

  /**
   * Chỉ lưu delta những gì user tự chỉnh (themeId, fontSize, nameAlign...).
   * Merge rule khi render: parse(snapshotDesignConfig) + customStyles
   * Shape: Partial<StyleConfig>
   */
  customStyles?: Partial<StyleConfig> | null;

  /**
   * Thứ tự section do user kéo thả.
   * App keys đã normalize: ["personal", "experience", "education", ...]
   */
  sectionsOrder?: string[] | null;

  /**
   * Chỉ lưu section bị ẩn.
   * Đọc: isVisible = sectionsVisibility?.[key] !== false
   * Shape: { "awards": false, "languages": false }
   */
  sectionsVisibility?: Record<string, boolean> | null;

  /**
   * Hướng C — references + customSections gộp vào đây.
   * Không cần bảng riêng vì không có use case query/filter độc lập.
   */
  supplementary?: CvSupplementary | null;

  // ── Relations ─────────────────────────────────────────────────────────────
  template?: TemplateInCv | null;
  personalInfo?: PersonalInfo | null;
  experiences: CvExperience[];
  education: CvEducation[];
  skills: CvSkill[];
  projects: CvProject[];
  certifications: CvCertification[];
  languages: CvLanguage[];
  awards: CvAward[];
  references: CvReference[];
  interests: CvInterest[];
  activities: CvActivity[];
}