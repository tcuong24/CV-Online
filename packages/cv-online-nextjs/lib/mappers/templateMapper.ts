import { COLOR_THEMES, FONT_OPTIONS, LH_MAP } from '@/constants/cvEditor';
import { SectionLayoutConfig, StyleConfig } from '@/types/cvEditor';

// ─── Key normalisation ───────────────────────────────────────────────────────

/** Maps DB sectionsConfig keys → editor CvData keys */
export const DB_KEY_MAP: Record<string, string> = {
  personalInfo:    'personal',
  experiences:     'experiences',
  education:       'education',
  skills:          'skills',
  projects:        'projects',
  awards:          'awards',
  languages:       'languages',
  certifications:  'certifications',
  references:      'references',
  interests:       'interests',
  activities:      'activities',
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
  const cfg = (designConfig ?? {}) as Record<string, unknown>;
  const colors    = (cfg['colors']     ?? {}) as Record<string, unknown>;
  const typo      = (cfg['typography'] ?? {}) as Record<string, unknown>;
  const layout    = (cfg['layout']     ?? {}) as Record<string, unknown>;
  const fonts     = (typo['fonts']       ?? {}) as Record<string, unknown>;
  const sizes     = (typo['sizes']       ?? {}) as Record<string, unknown>;
  const lhMap     = (typo['lineHeights'] ?? {}) as Record<string, unknown>;
  const bodyFont  = (fonts['body'] ?? {}) as Record<string, unknown>;
  const bg        = (colors['background'] ?? {}) as Record<string, unknown>;

  // ── Color ──
  const primaryHex = (colors['primary'] as string | undefined) ?? '';
  const presetTheme = COLOR_THEMES.find((t) => t.primary === primaryHex);

  let themeId: string;
  let customColor: StyleConfig['customColor'];

  if (presetTheme) {
    themeId = presetTheme.id;
  } else {
    themeId = '_custom';
    customColor = {
      primary: primaryHex || '#0f766e',
      dark:    ((colors['secondary'] as string | undefined) ?? primaryHex) || '#0f766e',
      light:   (bg['light'] as string | undefined) ?? (primaryHex ? `${primaryHex}20` : '#f0fdf4'),
    };
  }

  // ── Font ──
  const dbFamily = (bodyFont['family'] as string | undefined) ?? '';
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

  // ── Font size ──
  const rawSize = (sizes['body'] as string | undefined) ?? '13px';
  const fontSize = parseInt(rawSize, 10) || 13;

  // ── Line height ──
  const rawLh = lhMap['body'] as number | string | undefined;
  const lhNum = typeof rawLh === 'string' ? parseFloat(rawLh) : rawLh ?? 1.65;
  // Map number → tight/normal/loose by finding closest LH_MAP value
  const lineHeight = Object.entries(LH_MAP).reduce((best, [key, val]) =>
    Math.abs(val - lhNum) < Math.abs(LH_MAP[best] - lhNum) ? key : best
  , 'normal');

  // ── Alignment ──
  const nameAlign = (layout['nameAlign'] as string | undefined) ?? 'left';
  const sectionTitleAlign = layout['sectionTitleAlign'] as 'left' | 'center' | 'right' | undefined;
  const sectionTitleBorder = layout['sectionTitleBorder'] as 'bottom' | 'none' | 'left' | undefined;

  // ── New Layout Props ──
  const headerStyle = layout['headerStyle'] as 'default' | 'centered' | 'floating' | undefined;
  const headerBgColor = layout['headerBgColor'] as string | undefined;
  const borderStyle = layout['borderStyle'] as 'minimal' | 'bold' | 'none' | undefined;
  const contentAlignment = layout['contentAlignment'] as 'left' | 'justified' | undefined;
  const columnRatio = layout['columnRatio'] as string | undefined;

  return {
    themeId,
    ...(customColor ? { customColor } : {}),
    fontId,
    ...(customFontFamily ? { customFontFamily } : {}),
    nameAlign,
    fontSize,
    lineHeight,
    sectionTitleAlign,
    sectionTitleBorder,
    headerStyle,
    headerBgColor,
    borderStyle,
    contentAlignment,
    columnRatio,
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
  const defaultOrder    = (cfg['default_order']    ?? []) as string[];
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
    const layout    = (secDef['layout'] ?? {}) as Record<string, unknown>;
    const editorKey = DB_KEY_MAP[dbKey] ?? dbKey;

    if (editorKey === 'experiences') {
      result.experiences = {
        style:      (layout['style'] as any) ?? 'timeline',
        showDates:  (layout['showDates'] as boolean | undefined) ?? true,
        dateFormat: (layout['dateFormat'] as string | undefined),
      };
    } else if (editorKey === 'education') {
      result.education = {
        style:   (layout['style'] as any) ?? 'timeline',
        showGPA: (layout['showGPA'] as boolean | undefined) ?? false,
      };
    } else if (editorKey === 'skills') {
      // FIX: tách layout style ('grid'|'list'|'comma-separated') khỏi proficiency style ('bars'|'dots'|'tags')
      result.skills = {
        style:            (layout['style'] as any) ?? 'grid',
        columns:          layout['columns'] as number | undefined,
        showProficiency:  (layout['showProficiency'] as boolean | undefined) ?? false,
        proficiencyStyle: (layout['proficiencyStyle'] as 'bars' | 'dots' | 'tags' | undefined) ?? 'bars',
      };
    } else if (editorKey === 'awards') {
      result.awards = {
        style: (layout['style'] as 'compact' | 'detailed' | undefined) ?? 'compact',
      };
    } else if (editorKey === 'personal') {
      result.personal = {
        style: (layout['style'] as 'default' | 'centered' | undefined) ?? 'default',
      };
    } else if (editorKey === 'global') {
      result.global = {
        headerAlign:  layout['headerAlign'] as any,
        headerBorder: layout['headerBorder'] as any,
      };
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

export function resolveTheme(style: StyleConfig) {
  if (style.themeId === '_custom' && style.customColor) {
    return style.customColor; // { primary, dark, light }
  }
  const preset = COLOR_THEMES.find((t) => t.id === style.themeId);
  return preset ?? COLOR_THEMES[0];
}
