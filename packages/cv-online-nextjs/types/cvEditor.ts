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
  avatarUrl?: string | null;
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
  _dbId?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  from: string;
  to: string;
  desc: string;
  open: boolean;
  _dbId?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  tech: string;
  link: string;
  desc: string;
  open: boolean;
  _dbId?: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  org: string;
  year: string;
  open: boolean;
  _dbId?: string;
}

export interface LanguageEntry {
  id: string;
  lang: string;
  level: number;
  _dbId?: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  proficiencyLevel: string;
  proficiencyPercentage: number;
  category: string;
  _dbId?: string;
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
  _dbId?: string;
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
  _dbId?: string;
}

export interface InterestEntry {
  id: string;
  name: string;
  _dbId?: string;
}

export interface ActivityEntry {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  open: boolean;
  _dbId?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description: string;
  open: boolean;
  _dbId?: string;
}

export interface CustomSectionEntry {
  id: string;
  _dbId?: string;
  sectionTitle: string;
  sectionType?: 'list' | 'timeline' | 'tags' | 'text' | 'grid';
  items: CustomSectionItem[];
  fieldConfig?: {
    showSubtitle: boolean;
    showDateRange: boolean;
    showDescription: boolean;
  };
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
  customSections: CustomSectionEntry[];
}

export interface StyleColors {
  text: { body: string; muted: string; heading: string };
  accent: string;
  gradient?:string;
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
  title?: {
    border?: 'bottom' | 'none' | 'left' | 'top';
    borderSize?: string;
  };
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
  backgroundImage?: string; // URL ảnh nền
  backgroundOptions?: {
    opacity?: number;
    size?: 'cover' | 'contain' | 'auto';
    position?: string;
  };
}

export interface SectionLayoutConfig {
  [key: string]: {
    title?: string;
    icon?: string;
    style?: string;
    [key: string]: any;
  } | undefined;
  experiences?: { title?: string; icon?: string; style: 'timeline' | 'simple' | 'cards' | 'bullets' | 'compact' | 'minimal-lines' | 'detailed'; showDates: boolean; dateFormat?: string; };
  education?: { title?: string; icon?: string; style: 'timeline' | 'simple' | 'cards' | 'bullets' | 'compact' | 'minimal-lines' | 'detailed'; showGPA: boolean };
  skills?: { title?: string; icon?: string; style: 'grid' | 'list' | 'comma-separated'; columns?: number; showProficiency: boolean; proficiencyStyle: 'bars' | 'dots' | 'tags' | 'none' | 'grouped'; };
  awards?: { title?: string; icon?: string; style: 'compact' | 'detailed' };
  personal?: { title?: string; icon?: string; style: 'default' | 'centered' };
  global?: { headerAlign?: 'left' | 'center' | 'right'; headerBorder?: 'bottom' | 'none' | 'left'; headerStyle?: 'default' | 'centered' | 'floating' | 'modern'; };
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

export interface RenderCtx {
  style: StyleConfig;
  fs: number;
  lh: number;
  accentColor: string;
  textColor?: { body: string; muted: string; heading: string };
  sectionLayout: SectionLayoutConfig;
  updatePersonalInfo: (patch: Partial<CvData['personal']>) => void;
  updateEntry: (key: string, id: string, patch: Record<string, unknown>) => void;
  addEntry: (key: string, item: Record<string, unknown>) => void;
  removeEntry: (key: string, id: string) => void;
  addSkill: (item: SkillEntry) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, patch: Partial<SkillEntry>) => void;
  reorderEntry: (key: string, fromIndex: number, toIndex: number) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;
  reorderSection: (fromKey: string, toKey: string) => void;
  reorderSideKey: (fromKey: string, toKey: string) => void;
  moveSectionToZone: (key: string, toSidebar: boolean, targetIndex?: number) => void;
  patchSectionLayout: (key: string, patch: Record<string, unknown>) => void;
  addCustomSection: (title: string, config?: CvData['customSections'][0]['fieldConfig']) => void;
  removeCustomSection: (id: string) => void;
  updateCustomSection: (id: string, patch: Partial<CvData['customSections'][0]>) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, patch: Record<string, unknown>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  updateSectionLabel: (key: string, label: string) => void;
  scale: number;
}