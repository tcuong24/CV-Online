
export interface CVTemplate {
  id: string;
  title: string;
  templateId: string;
  defaultTheme: CVTemplateTheme;
}

export interface CVTemplateTheme {
  colors: TemplateColors;
  fonts: TemplateFonts;
  layout: TemplateLayout;
  spacing: TemplateSpacing;
  sections: TemplateSection[];
}
export interface TemplateColors {
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  background?: string;
}

export interface TemplateFonts {
  body: string;
  heading: string;
  sizes: {
    body: string;
    heading: string;
    name: string;
  };
}
export interface TemplateLayout {
  columns: number;
  headerAlign: "left" | "center" | "right";
}
export interface TemplateSpacing {
  padding: string;
  sectionGap: string;
}
export interface TemplateSection {
  id: string;
  type:
    | "personal-info"
    | "summary"
    | "experiences"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages";
  label: string;
  order: number;
  enabled: boolean;
}
