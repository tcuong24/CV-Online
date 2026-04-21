// ─── Core Data Types ───
export type LayoutType = 'single-column' | 'sidebar-left' | 'sidebar-right' | 'executive-centered' | 'tech-timeline' | 'asymmetric' | 'two-column' | 'black-white';

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
  experiences: ExperienceEntry[];
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

export interface StyleColors {
  text: { body: string; muted: string; heading: string };
  accent: string;
  primary: string;
  secondary: string;
  divider: string;
  background: { page: string; section: string; sidebar: string };
}

export interface StyleTypography {
  fonts: {
    body: { family: string; weights?: number[]; googleFont?: boolean };
    heading: { family: string; weights?: number[]; googleFont?: boolean };
  };
  sizes: {
    body: string;
    name: string;
    small: string;
    subsection: string;
    section_title: string;
  };
  lineHeights: { body: number; heading: number };
  letterSpacing?: { name?: string; section_title?: string; subsection?: string };
  textTransform?: { name?: string; section_title?: string; subsection?: string };
}

export interface StyleSpacing {
  page: { margin: string; sidebarPadding: string; mainPadding: string };
  element: { gap: string };
  section: { marginBottom: string; marginTop: string };
}

export interface StyleBorders {
  sectionDivider: { width: string; style: string; color: string; spacing: string };
}

export interface StyleConfig {
  /** Unified nested style configurations */
  colors?: StyleColors;
  typography?: StyleTypography;
  spacing?: StyleSpacing;
  borders?: StyleBorders;
  layout?: {
    maxWidth: string;
    columnRatio: string;
  };

  // Legacy & Compatibility fields
  themeId: string;
  fontId: string;
  customColor?: {
    primary: string;
    dark: string;
    light: string;
    sidebar?: string;
  };
  customFontFamily?: string;
  nameAlign: string;
  fontSize: number;
  lineHeight: string;
  sectionTitleAlign?: 'left' | 'center' | 'right';
  sectionTitleBorder?: 'bottom' | 'none' | 'left' | 'top';
  headerStyle?: 'default' | 'centered' | 'floating';
  headerBgColor?: string;
  borderStyle?: 'minimal' | 'bold' | 'none';
  contentAlignment?: 'left' | 'justified';
  columnRatio?: string;
  textColor?: {
    body: string;
    muted: string;
    heading: string;
  };
}

export interface SectionLayoutConfig {
  experiences?: { style: 'timeline' | 'simple' | 'cards' | 'bullets' | 'compact' | 'minimal-lines' | 'detailed'; showDates: boolean; dateFormat?: string; };
  education?: { style: 'timeline' | 'simple' | 'cards' | 'bullets' | 'compact' | 'minimal-lines' | 'detailed'; showGPA: boolean };
  skills?: { style: 'grid' | 'list' | 'comma-separated'; columns?: number; showProficiency: boolean; proficiencyStyle: 'bars' | 'dots' | 'tags' | 'none'; };
  awards?: { style: 'compact' | 'detailed' };
  personal?: { style: 'default' | 'centered' };
  global?: { headerAlign?: 'left' | 'center' | 'right'; headerBorder?: 'bottom' | 'none' | 'left'; };
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