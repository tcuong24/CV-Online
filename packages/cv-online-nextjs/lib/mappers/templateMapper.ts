import { COLOR_THEMES, FONT_OPTIONS, LH_MAP } from '@/constants/cvEditor';
import { SectionLayoutConfig, StyleConfig, StyleColors, StyleTypography, StyleSpacing, StyleBorders, ColorTheme } from '@/types/cvEditor';

// ─── Key normalisation ───────────────────────────────────────────────────────

/** Maps DB sectionsConfig keys → editor CvData keys */
export const DB_KEY_MAP: Record<string, string> = {
  personalInfo: 'personal',
  experience: 'experiences',
  summary: 'summary',
  experiences: 'experiences',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  awards: 'awards',
  languages: 'languages',
  certifications: 'certifications',
  references: 'references',
  interests: 'interests',
  activities: 'activities',
};

// ─── Design config parser ────────────────────────────────────────────────────

/**
 * Converts a raw DB `design_config` JSON blob into the editor's `StyleConfig`.
 *
 * Expected DB shape (all fields optional):
 * {
 *   colors: { primary: '#hex', secondary: '#hex', background: { light: '#hex' } },
 *   typography: {
 *     fonts:       { body: { family: 'Font Name' } },
 *     sizes:       { body: '14px' },
 *     lineHeights: { body: 1.6 },
 *   },
 *   layout: { nameAlign: 'left' | 'center' | 'right' },
 * }
 *
 * NOTE: colors.text.* (heading / body / muted) are intentionally out of scope (P1).
 */
function normalizeAvailableSections(
  raw: unknown
): Record<string, Record<string, unknown>> {
  if (!raw) return {};
  if (Array.isArray(raw)) {
    const result: Record<string, Record<string, unknown>> = {};
    for (const item of raw as Record<string, unknown>[]) {
      const id = item['id'] as string | undefined;
      if (id) result[id] = item;
    }
    return result;
  }
  if (typeof raw === 'object') {
    return raw as Record<string, Record<string, unknown>>;
  }

  return {};
}
export function parseDesignConfig(designConfig: unknown): StyleConfig {
  const cfg = (designConfig ?? {}) as Record<string, any>;

  // --- Unified nested structure extraction ---
  const colorsCfg = cfg['colors'] ?? {};
  const typoCfg = cfg['typography'] ?? {};
  const spacingCfg = cfg['spacing'] ?? {};
  const bordersCfg = cfg['borders'] ?? {};
  const layoutCfg = cfg['layout'] ?? {};

  const backgroundCfg = colorsCfg['background'] ?? {};
  const textColorsCfg = colorsCfg['text'] ?? {};
  const fontsCfg = typoCfg['fonts'] ?? {};
  const sizesCfg = typoCfg['sizes'] ?? {};
  const lhMapCfg = typoCfg['lineHeights'] ?? {};

  // ── Color Processing ──
  const primaryHex = colorsCfg['primary'] || colorsCfg['accent'] || '';
  const presetTheme = COLOR_THEMES.find((t) => t.primary === primaryHex);

  const colors: StyleColors = {
    text: {
      body: textColorsCfg['body'] || '#333333',
      muted: textColorsCfg['muted'] || '#666666',
      heading: textColorsCfg['heading'] || '#000000',
    },
    gradient: colorsCfg['gradient'] || '',
    accent: colorsCfg['accent'] || primaryHex || '#0f766e',
    primary: colorsCfg['primary'] || primaryHex || '#0f766e',
    secondary: colorsCfg['secondary'] || '#0f766e',
    divider: colorsCfg['divider'] || '#e5e7eb',
    background: {
      page: backgroundCfg['page'] || backgroundCfg['light'] || '#ffffff',
      section: backgroundCfg['section'] || 'transparent',
      sidebar: backgroundCfg['sidebar'] || '#f3f4f6',
    },
  };

  let themeId: string;
  let customColor: StyleConfig['customColor'];

  if (presetTheme) {
    themeId = presetTheme.id;
  } else {
    themeId = '_custom';
    customColor = {
      primary: colors.primary,
      dark: colors.secondary,
      light: colors.background.page,
      sidebar: colors.background.sidebar,
    };
  }

  // ── Typography Processing ──
  const fonts = fontsCfg['body'] ?? {};
  const dbFamily = (fonts['family'] as string | undefined) ?? '';
  const presetFont = FONT_OPTIONS.find(
    (f) => f.family.toLowerCase().includes(dbFamily.toLowerCase()) ||
      dbFamily.toLowerCase().includes(f.label.toLowerCase())
  );

  let fontId: string;
  let customFontFamily: string | undefined;

  if (presetFont) {
    fontId = presetFont.id;
  } else {
    fontId = '_custom';
    customFontFamily = dbFamily || undefined;
  }

  const typography: StyleTypography = {
    fonts: {
      body: { 
        family: dbFamily || 'sans-serif', 
        weights: fontsCfg['body']?.weights || [400, 500, 600],
        googleFont: !!fontsCfg['body']?.googleFont
      },
      heading: { 
        family: fontsCfg['heading']?.family || dbFamily || 'sans-serif',
        weights: fontsCfg['heading']?.weights || [600, 700],
        googleFont: !!fontsCfg['heading']?.googleFont
      },
    },
    sizes: {
      body: sizesCfg['body'] || '14px',
      name: sizesCfg['name'] || '32px',
      small: sizesCfg['small'] || '12px',
      subsection: sizesCfg['subsection'] || '16px',
      section_title: sizesCfg['section_title'] || '20px',
    },
    lineHeights: {
      body: typeof lhMapCfg['body'] === 'number' ? lhMapCfg['body'] : 1.6,
      heading: typeof lhMapCfg['heading'] === 'number' ? lhMapCfg['heading'] : 1.2,
    },
    letterSpacing: typoCfg['letterSpacing'],
    textTransform: typoCfg['textTransform'],
  };

  // ── Spacing ──
  const pageSpacing = spacingCfg['page'] ?? {};
  const spacing: StyleSpacing = {
    page: {
      margin: pageSpacing['margin'] || '0',
      sidebarPadding: pageSpacing['sidebarPadding'] || '28px 18px',
      mainPadding: pageSpacing['mainPadding'] || '28px 26px',
    },
    element: {
      gap: spacingCfg['element']?.gap || '12px',
    },
    section: {
      marginBottom: spacingCfg['section']?.marginBottom || '24px',
      marginTop: spacingCfg['section']?.marginTop || '0px',
    },
  };

  // ── Borders ──
  const secDiv = bordersCfg['sectionDivider'] ?? {};
  const borders: StyleBorders = {
    sectionDivider: {
      width: secDiv['width'] || '1px',
      style: secDiv['style'] || 'solid',
      color: secDiv['color'] || colors.divider,
      spacing: secDiv['spacing'] || '12px',
    },
  };

  // ── Final Config ──
  const rawSize = typography.sizes.body;
  const fontSize = parseInt(rawSize, 10) || 14;

  const lhNum = typography.lineHeights.body;
  const lineHeight = Object.entries(LH_MAP).reduce((best, [key, val]) =>
    Math.abs(val - lhNum) < Math.abs(LH_MAP[best] - lhNum) ? key : best
    , 'normal');

  return {
    themeId,
    ...(customColor ? { customColor } : {}),
    fontId,
    ...(customFontFamily ? { customFontFamily } : {}),
    nameAlign: layoutCfg['nameAlign'] || 'left',
    fontSize,
    lineHeight,
    sectionTitleAlign: layoutCfg['sectionTitleAlign'] || cfg['sectionTitleAlign'],
    title: layoutCfg['title'] || cfg['title'] || { border: layoutCfg['sectionTitleBorder'] || cfg['sectionTitleBorder'] || 'bottom', borderSize: '2px' },
    headerStyle: layoutCfg['headerStyle'],
    headerBgColor: layoutCfg['headerBgColor'],
    borderStyle: layoutCfg['borderStyle'],
    contentAlignment: layoutCfg['contentAlignment'],
    columnRatio: layoutCfg['columnRatio'],
    // New nested properties
    colors,
    typography,
    spacing,
    borders,
    layout: {
      maxWidth: layoutCfg['maxWidth'] || '100%',
      columnRatio: layoutCfg['columnRatio'] || '220px 1fr'
    },
    // Compatibility fields
    textColor: colors.text,
    backgroundImage: cfg['backgroundImage'],
    backgroundOptions: cfg['backgroundOptions'],
  };
}

// ─── Sections config parsers ──────────────────────────────────────────────────

/**
 * Expected DB shape:
 * {
 *   default_order:      ['personalInfo', 'experiences', ...],
 *   sidebar_sections?:  ['personalInfo', 'skills'],
 *   main_sections?:     ['experiences', 'education'],
 *   available_sections: {
 *     experiences: { is_visible_by_default: true, layout: { ... } },
 *     ...
 *   }
 * }
 */
export function parseSectionsConfig(
  sectionsConfig: unknown
): { order: string[]; sideKeys: string[] } {
  const cfg = (sectionsConfig ?? {}) as Record<string, unknown>;
  const defaultOrder = (cfg['default_order'] ?? []) as string[];
  const sidebarSections = (cfg['sidebar_sections'] ?? []) as string[];

  // FIX: dùng normalizeAvailableSections thay vì cast thẳng
  const available = normalizeAvailableSections(cfg['available_sections']);

  const order = defaultOrder
    .filter((key) => {
      const sec = available[key] ?? {};
      return sec['is_visible_by_default'] !== false;
    })
    .map((key) => DB_KEY_MAP[key] ?? key)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const sideKeys = sidebarSections
    .map((key) => DB_KEY_MAP[key] ?? key)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  return { order, sideKeys };
}

/**
 * Reads per-section `layout` config from sectionsConfig.available_sections
 * and returns a populated SectionLayoutConfig.
 */
export function parseSectionLayouts(sectionsConfig: unknown): SectionLayoutConfig {
  const cfg = (sectionsConfig ?? {}) as Record<string, unknown>;

  // FIX: dùng normalizeAvailableSections thay vì cast thẳng
  const available = normalizeAvailableSections(cfg['available_sections']);
  const result: SectionLayoutConfig = {};

  for (const [dbKey, secDef] of Object.entries(available)) {
    const layout = (secDef['layout'] ?? {}) as Record<string, any>;
    const editorKey = DB_KEY_MAP[dbKey] ?? dbKey;
    const icon = secDef['icon'] as string | undefined;

    // Default structure for any section
    const baseConfig: any = {
      ...layout,
      icon, // Lưu icon vào đây
      title: secDef['label'] as string,
    };

    if (editorKey === 'experiences') {
      result.experiences = {
        ...baseConfig,
        style: layout['style'] || 'detailed',
        showDates: layout['showDates'] ?? true,
      };
    } else if (editorKey === 'education') {
      result.education = {
        ...baseConfig,
        style: layout['style'] ?? 'timeline',
        showGPA: layout['showGPA'] ?? false,
      };
    } else if (editorKey === 'skills') {
      result.skills = {
        ...baseConfig,
        style: layout['style'] ?? 'grid',
        proficiencyStyle: layout['proficiencyStyle'] || secDef['proficiencyStyle'] || 'bars',
      };
    } else {
      // Catch-all cho các section khác (languages, projects, awards, etc.)
      result[editorKey] = baseConfig;
    }
  }

  return result;
}

// ─── Helper: resolve font-family string from StyleConfig ────────────────────

export function resolveFontFamily(style: StyleConfig): string {
  if (style.fontId === '_custom') return style.customFontFamily ?? 'sans-serif';
  const preset = FONT_OPTIONS.find((f) => f.id === style.fontId);
  return preset?.family ?? "'Plus Jakarta Sans', sans-serif";
}

// ─── Helper: resolve accent color from StyleConfig ───────────────────────────

export function resolveTheme(style: StyleConfig): ColorTheme {
  if (style.themeId === '_custom' && style.customColor) {
    return {
      id: '_custom',
      label: 'Tùy chỉnh',
      text: '#ffffff',
      ...style.customColor,
    };
  }
  const preset = COLOR_THEMES.find((t) => t.id === style.themeId);
  return preset ?? COLOR_THEMES[0];
}
