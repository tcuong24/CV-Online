// ─── Core Data Types ───

export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  avatarUrl?: string  | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  from: string;
  to: string;
  desc: string;
  open: boolean;
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  from: string;
  to: string;
  desc: string;
  open: boolean;
}

export interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  tech: string;
  link: string;
  desc: string;
  open: boolean;
}

export interface AwardEntry {
  id: string;
  title: string;
  org: string;
  year: string;
  open: boolean;
}

export interface LanguageEntry {
  id: string;
  lang: string;
  level: number;
}

export interface SkillEntry {
  id: string;
  name: string;
  proficiencyLevel: string;
  proficiencyPercentage: number;
  category: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  open: boolean;
}

export interface ReferenceEntry {
  id: string;
  fullName: string;
  jobTitle: string;
  company: string;
  relationship: string;
  email: string;
  phone: string;
  open: boolean;
}

export interface InterestEntry {
  id: string;
  name: string;
}

export interface ActivityEntry {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  open: boolean;
}

export interface CvData {
  personal: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  awards: AwardEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  references: ReferenceEntry[];
  interests: InterestEntry[];
  activities: ActivityEntry[];
}

export interface StyleConfig {
  /** Preset theme id (e.g. 'teal') OR '_custom' when DB hex has no preset match */
  themeId: string;
  /** Populated only when themeId === '_custom' */
  customColor?: {
    primary: string; // colors.primary hex from DB
    dark: string;    // colors.secondary from DB, or primary as fallback
    light: string;   // colors.background.light from DB, or primary+'20'
  };
  /** Preset font id (e.g. 'jakarta') OR '_custom' when DB font has no preset match */
  fontId: string;
  /** Raw CSS font-family string from DB, used when fontId === '_custom' */
  customFontFamily?: string;
  nameAlign: string;
  fontSize: number;
  lineHeight: string;
}

export interface SectionLayoutConfig {
  experience?: { style: 'timeline' | 'simple'; showDates: boolean; dateFormat?: string; };
  experiences?: { style: 'timeline' | 'simple'; showDates: boolean };
  education?: { style: 'timeline' | 'simple'; showGPA: boolean };
  skills?: { style: 'grid' | 'list'; columns?: number; showProficiency: boolean; proficiencyStyle: 'bars' | 'dots' | 'tags'; };
  awards?: { style: 'compact' | 'detailed' };
  personal?: { style: 'default' | 'centered' };
}

export interface FieldDef {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export interface Entry {
  id: string;
  open: boolean;
  [key: string]: string | boolean;
}

export interface ColorTheme {
  id: string;
  label: string;
  primary: string;
  dark: string;
  light: string;
  text: string;
}

export interface FontOption {
  id: string;
  label: string;
  family: string;
  sample: string;
}