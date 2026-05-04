/**
 * useCvEditorStore — Single source of truth for the CV editor.
 *
 * Pattern: Zustand + immer (for nested updates) + persist (localStorage fallback).
 *
 * State is split into 3 logical groups:
 *   1. CV content  — data, order, sectionLayout, sideKeys, template style
 *   2. Template meta — layoutType, templateId
 *   3. Editor UI   — activeTab, openSections, drag state
 *
 * Sync strategy (Hướng 2):
 *   - On load: GET /templates/:id → applyTemplate(), GET /cvs/:id → setCV()
 *   - On edit: any mutation sets isDirty = true
 *   - Auto-save: debounced 800ms in the editor component → syncToDb()
 *   - On success: isDirty = false
 *
 * Schema rules (Hybrid C):
 *   - snapshotDesignConfig = raw template.designConfig saved at template-pick time
 *   - customStyles = user-only delta (Partial<StyleConfig>)
 *   - style (runtime) = parseDesignConfig(snapshot) merged with customStyles
 *   - sectionsVisibility only stores { key: false } — true is implicit default
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import {
  CvData,
  PersonalInfo,
  SectionLayoutConfig,
  SkillEntry,
  StyleConfig,
  LayoutType,
} from '@/types/cvEditor';
import type { CVWithRelations, TemplateInfo } from '@/types/cv';
import { DEFAULT_DATA, DEFAULT_ORDER, DEFAULT_STYLE, uid } from '@/constants/cvEditor';
import {
  parseDesignConfig,
  parseSectionsConfig,
  parseSectionLayouts,
} from '@/lib/mappers/templateMapper';
import { mapDbCvToCvData } from '@/lib/mappers/cvDataMapper';
import axiosInstance from '@/lib/axios';
import { temporal } from 'zundo';

interface CvEditorState {
  // ── CV Content ──────────────────────────────────────────────────────────────
  data: Partial<CvData>;
  order: string[];
  style: StyleConfig;
  sectionLayout: SectionLayoutConfig;

  /**
   * For CVModern (sidebar-left / sidebar-right): keys that go into the sidebar.
   * Derived from template.sectionsConfig.sidebar_sections at load time.
   */
  sideKeys: string[];

  /**
   * Section visibility — mirroring CVWithRelations.sectionsVisibility.
   * Only false entries are stored; true is the implicit default.
   * Read: isVisible = visibility[key] !== false
   */
  visibility: Record<string, boolean>;

  // ── Template Meta ────────────────────────────────────────────────────────────
  layoutType: LayoutType;
  templateId: string | null;

  // ── Sync State ───────────────────────────────────────────────────────────────
  /**
   * The DB id of the CV currently being edited.
   * null → local/unsaved CV (e.g. just picked a template).
   */
  cvId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;

  // ── Editor UI (NOT persisted via partialize) ─────────────────────────────────
  activeTab: 'content' | 'style';
  openSections: Record<string, boolean>;
  draggingKey: string | null;
  dragOverKey: string | null;

  // ── Actions: Template ────────────────────────────────────────────────────────
  /**
   * Call after GET /templates/:id — applies design config + sections config.
   * Uses the proper parsers from templateMapper so behaviour is consistent
   * with what setCV does.
   */
  applyTemplate: (tpl: Record<string, unknown>) => void;
  switchTemplate: (template: TemplateInfo) => void;
  /**
   * Hydrate the store from a full CVWithRelations object (from DB or local).
   * - style = parseDesignConfig(snapshotDesignConfig) merged with customStyles
   * - data  = mapDbCvToCvData(cv)
   * - order, sectionLayout, sideKeys = parseSectionsConfig / parseSectionLayouts
   */
  setCV: (cv: CVWithRelations) => void;

  // ── Actions: CV Content ──────────────────────────────────────────────────────
  setData: (data: Partial<CvData>) => void;
  setOrder: (order: string[]) => void;
  setStyle: (style: StyleConfig) => void;
  patchStyle: (partial: Partial<StyleConfig>) => void;

  /** Update a single field in personalInfo */
  updatePersonalInfo: (patch: Partial<CvData['personal']>) => void;

  /** Update a section's items array entirely */
  setSection: <K extends keyof Omit<CvData, 'personal'>>(
    key: K,
    items: CvData[K]
  ) => void;

  /** Add a new entry to a list section */
  addEntry: (key: string, item: Record<string, unknown>) => void;

  /** Update a single entry by id in a list section */
  updateEntry: (key: string, id: string, patch: Record<string, unknown>) => void;

  /** Remove an entry by id from a list section */
  removeEntry: (key: string, id: string) => void;

  /** Add a skill entry */
  addSkill: (item: SkillEntry) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, patch: Partial<SkillEntry>) => void;

  /** Reorder an entry within a list section */
  reorderEntry: (key: string, fromIndex: number, toIndex: number) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;

  /** Patch display config for a single section (merge, not replace) */
  patchSectionLayout: (key: string, patch: Record<string, unknown>) => void;

  /** Toggle section visibility (true → false, false → true) */
  toggleVisibility: (key: string) => void;
  
  /** Custom Sections Actions */
  addCustomSection: (title: string, config?: CvData['customSections'][0]['fieldConfig'], sectionType?: CvData['customSections'][0]['sectionType']) => void;
  removeCustomSection: (id: string) => void;
  updateCustomSection: (id: string, patch: Partial<CvData['customSections'][0]>) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, patch: Record<string, unknown>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;

  // ── Actions: Sync ────────────────────────────────────────────────────────────
  /**
   * Persist current state to the backend.
   * - POST  /cvs          when cvId is null  → sets cvId from response
   * - PATCH /cvs/:cvId    when cvId is set
   * Returns the cvId on success, null on failure.
   */
  syncToDb: (opts?: { captureThumbnail?: boolean }) => Promise<string | null>;
  markClean: () => void;

  // ── Actions: Editor UI ───────────────────────────────────────────────────────
  setActiveTab: (tab: 'content' | 'style') => void;
  toggleSection: (key: string) => void;
  setLayoutType: (layout: LayoutType) => void;
  setDragging: (key: string | null) => void;
  setDragOver: (key: string | null) => void;
  reorderSection: (fromKey: string, toKey: string) => void;
  reorderSideKey: (fromKey: string, toKey: string) => void;
  moveSectionToZone: (key: string, toSidebar: boolean) => void;
  resetDrag: () => void;
  resetCV: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCvEditorStore = create<CvEditorState>()(
  temporal(
    persist(
      (set, get) => ({
        // ── Initial state ────────────────────────────────────────────────────────
        data: {
          customSections: [],
        },
        order: DEFAULT_ORDER,
        style: DEFAULT_STYLE,
        sectionLayout: {},
        sideKeys: [],
        visibility: {},

        layoutType: 'single-column',
        templateId: null,
        cvId: null,

        isDirty: false,
        isSaving: false,
        lastSavedAt: null,

        // UI state (excluded from partialize)
        activeTab: 'content',
        openSections: { personal: true },
        draggingKey: null,
        dragOverKey: null,

        // ── Template ─────────────────────────────────────────────────────────────
        applyTemplate: (tpl) => {
          set(
            produce((s: CvEditorState) => {
              if (tpl['id']) s.templateId = tpl['id'] as string;
              if (tpl['layoutType']) s.layoutType = tpl['layoutType'] as LayoutType;

              // Parse design config with the proper parser
              if (tpl['designConfig']) {
                s.style = {
                  ...DEFAULT_STYLE,
                  ...parseDesignConfig(tpl['designConfig']),
                };
              }

              // Parse sections config with the proper parsers
              if (tpl['sectionsConfig']) {
                const { order, sideKeys } = parseSectionsConfig(tpl['sectionsConfig']);
                s.order = order;
                s.sideKeys = sideKeys;
                const layouts = parseSectionLayouts(tpl['sectionsConfig']);
                s.sectionLayout = layouts;

                // Sync nameAlign if section says centered or layout is black-white
                const isCenteredLayout = tpl['layoutType'] === 'black-white' || tpl['layoutType'] === 'executive-centered';
                if ((layouts.personal?.style === 'centered' || isCenteredLayout) && (!tpl['designConfig'] || !(tpl['designConfig'] as any).layout?.nameAlign)) {
                  s.style.nameAlign = 'center';
                }
              }

              // Template application is NOT a dirty change — it's config, not user data
              s.isDirty = false;
            })
          );
          // Ngắt lịch hẹn để clear history vì đây là set config mới
          setTimeout(() => useCvEditorStore.temporal.getState().clear(), 0);
        },
        switchTemplate: (template: TemplateInfo) => {
          const { order, sideKeys } = parseSectionsConfig(template.sectionsConfig);
          const layouts = parseSectionLayouts(template.sectionsConfig);
          const style = parseDesignConfig(template.designConfig);
          
          // Sync nameAlign if section says centered or layout is black-white
          const isCenteredLayout = template.layoutType === 'black-white' || template.layoutType === 'executive-centered';
          if ((layouts.personal?.style === 'centered' || isCenteredLayout) && !(template.designConfig as any)?.layout?.nameAlign) {
            style.nameAlign = 'center';
          }

          set(state => ({
            ...state,
            layoutType: template.layoutType,
            order,
            sideKeys,
            style,
            sectionLayout: layouts,
            isDirty: true,
          }));
        },

        setCV: (cv) => {
          set(
            produce((s: CvEditorState) => {
              s.cvId = cv.id.startsWith('local-') ? null : cv.id;
              s.templateId = cv.templateId ?? null;

              // ── Style: snapshotDesignConfig + customStyles delta ──
              // Parse snapshot first (gives us a full StyleConfig baseline)
              const baseStyle = cv.snapshotDesignConfig
                ? parseDesignConfig(cv.snapshotDesignConfig)
                : (cv.template?.designConfig
                  ? parseDesignConfig(cv.template.designConfig)
                  : DEFAULT_STYLE);

              // Merge user-only delta on top
              s.style = { ...DEFAULT_STYLE, ...baseStyle, ...(cv.customStyles ?? {}) };

              // ── Layout type ──
              if (cv.template?.layoutType) {
                s.layoutType = cv.template.layoutType as LayoutType;
              }

              // ── Sections order & layout (from template or cv.sectionsOrder) ──
              const sectionsSource = cv.template?.sectionsConfig;
              if (sectionsSource) {
                const { order: tplOrder, sideKeys } = parseSectionsConfig(sectionsSource);
                // cv.sectionsOrder overrides template order if present (user reordered)
                s.order = cv.sectionsOrder ?? tplOrder;
                s.sideKeys = sideKeys;
                
                // Prioritize CV-specific layouts from DB, fallback to template
                s.sectionLayout = (cv.sectionsLayout as SectionLayoutConfig) || parseSectionLayouts(sectionsSource);
              } else if (cv.sectionsOrder) {
                s.order = cv.sectionsOrder;
              }

              // ── Visibility: only false entries are stored ──
              s.visibility = cv.sectionsVisibility ?? {};

              // ── Seed CvData from DB relations using the shared mapper ──
              // mapDbCvToCvData expects a plain Record<string, unknown>
              s.data = mapDbCvToCvData(cv as unknown as Record<string, unknown>);

              // setCV is not a dirty user edit — data came from server
              s.isDirty = false;
            })
          );
          // Ngắt lịch hẹn xoá state history để không Undo về CV cũ
          setTimeout(() => useCvEditorStore.temporal.getState().clear(), 0);
        },

        // ── CV Content ───────────────────────────────────────────────────────────
        setData: (data) => {
          const sanitize = (val: any): any => {
            if (!val || typeof val !== 'object') return val;

            // Fix pluralization from AI (educations -> education)
            if (val.educations && !val.education) {
              val.education = val.educations;
              delete val.educations;
            }

            // Map links array to specific fields if present in personal
            if (val.personal?.links && Array.isArray(val.personal.links)) {
              val.personal.links.forEach((link: string) => {
                const lower = link.toLowerCase();
                if (lower.includes('linkedin.com')) val.personal.linkedinUrl = link;
                else if (lower.includes('github.com')) val.personal.githubUrl = link;
                else if (lower.includes('facebook.com')) val.personal.facebookUrl = link;
                else if (lower.includes('twitter.com') || lower.includes('x.com')) val.personal.twitterUrl = link;
                else if (!val.personal.website) val.personal.website = link;
              });
              delete val.personal.links;
            }

            // Ensure all array items have unique IDs and basic structure
            Object.keys(val).forEach((key) => {
              if (Array.isArray(val[key])) {
                val[key] = val[key].map((item: any) => {
                  if (typeof item === 'string' && key === 'skills') {
                    // Convert string skill to object skill
                    return {
                      id: uid(),
                      name: item,
                      proficiencyLevel: 'intermediate',
                      proficiencyPercentage: 70,
                      category: '',
                    };
                  }
                  if (typeof item === 'object' && item !== null) {
                    return {
                      id: uid(),
                      open: false,
                      ...item,
                    };
                  }
                  return item;
                });
              }
            });

            return val;
          };

          set({ data: sanitize(data), isDirty: true });
        },

        setOrder: (order) => set({ order, isDirty: true }),

        setStyle: (style) => set({ style, isDirty: true }),

        patchStyle: (partial) =>
          set(
            produce((s: CvEditorState) => {
              Object.assign(s.style, partial);
              s.isDirty = true;
            })
          ),

        updatePersonalInfo: (patch) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.personal) s.data.personal = {} as PersonalInfo;
              Object.assign(s.data.personal, patch);
              s.isDirty = true;
            })
          ),

        setSection: (key, items) =>
          set(
            produce((s: CvEditorState) => {
              (s.data as unknown as Record<string, unknown>)[key as string] = items;
              s.isDirty = true;
            })
          ),

        addEntry: (key: string, item: Record<string, unknown>) =>
          set(
            produce((s: CvEditorState) => {
              const section = (s.data as unknown as Record<string, unknown>)[key];
              if (!Array.isArray(section)) return;
              section.push({ id: crypto.randomUUID(), open: false, ...item });
              s.isDirty = true;
            })
          ),

        updateEntry: (key, id, patch) =>
          set(
            produce((s: CvEditorState) => {
              const section = (s.data as unknown as Record<string, unknown>)[key];
              if (!Array.isArray(section)) return;
              const entry = section.find((e: Record<string, unknown>) => e['id'] === id);
              if (entry) Object.assign(entry, patch);
              s.isDirty = true;
            })
          ),

        removeEntry: (key, id) =>
          set(
            produce((s: CvEditorState) => {
              const data = s.data as unknown as Record<string, unknown>;
              const section = data[key];
              if (!Array.isArray(section)) return;
              data[key] = section.filter((e: Record<string, unknown>) => e['id'] !== id);
              s.isDirty = true;
            })
          ),

        addSkill: (item) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.skills) s.data.skills = [];
              s.data.skills.push(item);
              s.isDirty = true;
            })
          ),

        removeSkill: (id) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.skills) return;
              s.data.skills = s.data.skills.filter((sk) => sk.id !== id);
              s.isDirty = true;
            })
          ),

        updateSkill: (id, patch) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.skills) return;
              const entry = s.data.skills.find((sk) => sk.id === id);
              if (entry) Object.assign(entry, patch);
              s.isDirty = true;
            })
          ),

        reorderEntry: (key, fromIndex, toIndex) =>
          set(
            produce((s: CvEditorState) => {
              const section = (s.data as unknown as Record<string, unknown>)[key];
              if (!Array.isArray(section)) return;
              const [moved] = section.splice(fromIndex, 1);
              section.splice(toIndex, 0, moved);
              s.isDirty = true;
            })
          ),

        reorderSkills: (fromIndex, toIndex) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.skills) return;
              const [moved] = s.data.skills.splice(fromIndex, 1);
              s.data.skills.splice(toIndex, 0, moved);
              s.isDirty = true;
            })
          ),

        patchSectionLayout: (key, patch) =>
          set(
            produce((s: CvEditorState) => {
              s.sectionLayout[key as keyof typeof s.sectionLayout] = {
                ...s.sectionLayout[key as keyof typeof s.sectionLayout],
                ...patch,
              } as never;
              s.isDirty = true;
            })
          ),

        toggleVisibility: (key) =>
          set(
            produce((s: CvEditorState) => {
              // isVisible = visibility[key] !== false
              const isCurrentlyVisible = s.visibility[key] !== false;
              if (isCurrentlyVisible) {
                s.visibility[key] = false;  // hide: store explicit false
              } else {
                delete s.visibility[key];   // show: remove → implicit true
                // Fix: Ensure the section is actually in the order array when unhidden
                if (!s.order.includes(key) && !s.sideKeys.includes(key)) {
                  s.order.push(key);
                }
              }
              s.isDirty = true;
            })
          ),

        addCustomSection: (title, config, sectionType) =>
          set(
            produce((s: CvEditorState) => {
              const id = `custom-${crypto.randomUUID()}`;
              if (!s.data.customSections) s.data.customSections = [];
              s.data.customSections.push({
                id,
                sectionTitle: title,
                sectionType: sectionType || 'list',
                items: [],
                fieldConfig: config || {
                  showSubtitle: true,
                  showDateRange: true,
                  showDescription: true,
                },
              });
              s.order.push(id);
              s.isDirty = true;
            })
          ),

        removeCustomSection: (id) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.customSections) return;
              s.data.customSections = s.data.customSections.filter((cs) => cs.id !== id);
              s.order = s.order.filter((o) => o !== id);
              s.isDirty = true;
            })
          ),

        updateCustomSection: (id, patch) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.customSections) return;
              const section = s.data.customSections.find((cs) => cs.id === id);
              if (section) Object.assign(section, patch);
              s.isDirty = true;
            })
          ),

        addCustomSectionItem: (sectionId) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.customSections) return;
              const section = s.data.customSections.find((cs) => cs.id === sectionId);
              if (section) {
                section.items.push({
                  id: crypto.randomUUID(),
                  title: 'Tiêu đề mới',
                  subtitle: 'Tổ chức/Công ty',
                  dateRange: '2024 - Hiện tại',
                  description: 'Mô tả chi tiết nội dung...',
                  open: true,
                });
                s.isDirty = true;
              }
            })
          ),

        updateCustomSectionItem: (sectionId, itemId, patch) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.customSections) return;
              const section = s.data.customSections.find((cs) => cs.id === sectionId);
              if (section) {
                const item = section.items.find((i) => i.id === itemId);
                if (item) Object.assign(item, patch);
                s.isDirty = true;
              }
            })
          ),

        removeCustomSectionItem: (sectionId, itemId) =>
          set(
            produce((s: CvEditorState) => {
              if (!s.data.customSections) return;
              const section = s.data.customSections.find((cs) => cs.id === sectionId);
              if (section) {
                section.items = section.items.filter((i) => i.id !== itemId);
                s.isDirty = true;
              }
            })
          ),

        // ── Sync ─────────────────────────────────────────────────────────────────
        syncToDb: async (opts) => {
          const s = get();
          if (!s.isDirty && !opts?.captureThumbnail) return s.cvId;

          set({ isSaving: true });
          try {
            let cvId = s.cvId;
            let uploadedUrl: string | undefined = undefined;

            // Thumbnail Capture Logic
            if (opts?.captureThumbnail) {
              const firstPage = document.querySelector('.cv-paper') as HTMLElement;
              if (firstPage) {
                try {
                  const { toJpeg } = await import('html-to-image');
                  const base64Image = await toJpeg(firstPage, { quality: 0.6 });
                  const fetchRes = await fetch(base64Image);
                  const blob = await fetchRes.blob();
                  const formData = new FormData();
                  formData.append('file', blob, 'thumbnail.jpg');
                  const uploadRes = await axiosInstance.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  uploadedUrl = uploadRes.data.url;
                } catch (e) {
                  console.error('Error uploading thumbnail to Cloudinary:', e);
                }
              }
            }

            // ── 1. Tạo hoặc update CV record ─────────────────────────────────────
            if (!cvId) {
              // CV chưa có trên DB → POST /cvs
              const res = await axiosInstance.post('/cvs', {
                templateId: s.templateId,
                title: s.data.personal?.name
                  ? `CV của ${s.data.personal.name}`
                  : 'CV mới',
                customStyles: s.style,
                sectionsOrder: s.order,
                sectionsLayout: s.sectionLayout,
                sectionsVisibility: s.visibility,
                ...(uploadedUrl ? { thumbnailUrl: uploadedUrl } : {})
              });
              cvId = res.data.id as string;
              set({ cvId });
            } else {
              // CV đã có → PUT /cvs/:id
              await axiosInstance.put(`/cvs/${cvId}`, {
                customStyles: s.style,
                sectionsOrder: s.order,
                sectionsLayout: s.sectionLayout,
                sectionsVisibility: s.visibility,
                ...(uploadedUrl ? { thumbnailUrl: uploadedUrl } : {})
              });
            }

            // ── 2. Personal info (upsert — backend tự xử lý PUT /cvs/:id/personal-info) ──
            if (s.data.personal) {
              const p = s.data.personal;
              const personalPayload = {
                fullName: p.name || "",
                jobTitle: p.role,
                email: p.email,
                phone: p.phone,
                location: p.location,
                website: p.website,
                summary: p.summary,
                photoUrl: p.avatarUrl,
                linkedinUrl: p.linkedinUrl,
                githubUrl: p.githubUrl,
                portfolioUrl: p.portfolioUrl,
                nationality: p.nationality,
                // dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined, // Bật nếu backend cần
              };
              await axiosInstance.put(`/cvs/${cvId}/personal-info`, personalPayload);
            }

            // ── 3. Sections — chạy song song ──────────────────────────────────────
            const sectionCalls: Promise<unknown>[] = [];

            const sections = [
              { key: 'experiences', path: 'experiences' },
              { key: 'education', path: 'education' },
              { key: 'skills', path: 'skills' },
              { key: 'projects', path: 'projects' },
              { key: 'certifications', path: 'certifications' },
              { key: 'languages', path: 'languages' },
              { key: 'awards', path: 'awards' },
              { key: 'references', path: 'references' },
            ] as const;

            for (const { key, path } of sections) {
              const items = (s.data as Record<string, unknown>)[key];
              if (!Array.isArray(items)) continue;

              items.forEach((item: Record<string, unknown>, index: number) => {
                let mappedPayload: Record<string, unknown> = {};

                // Map properties back to standard DB DTOs
                if (path === 'experiences') {
                  mappedPayload = {
                    position: item.title,
                    companyName: item.company || '', // Prevent empty if required
                    location: item.location,
                    startDate: item.from ? new Date(item.from.toString()) : new Date(), // requires valid date
                    endDate: item.to && item.to !== 'Hiện tại' ? new Date(item.to.toString()) : undefined,
                    isCurrent: item.to === 'Hiện tại',
                    description: item.desc
                  };
                } else if (path === 'education') {
                  mappedPayload = {
                    degree: item.degree,
                    institutionName: item.school || '', // Prevent empty if required
                    startDate: item.from ? new Date(item.from.toString()) : new Date(),
                    endDate: item.to && item.to !== 'Hiện tại' ? new Date(item.to.toString()) : undefined,
                    isCurrent: item.to === 'Hiện tại',
                    description: item.desc
                  };
                } else if (path === 'skills') {
                  mappedPayload = {
                    skillName: item.name,
                    proficiencyLevel: item.proficiencyLevel,
                    proficiencyPercentage: item.proficiencyPercentage,
                    category: item.category
                  };
                } else if (path === 'projects') {
                  mappedPayload = {
                    projectName: item.name,
                    role: item.role,
                    projectUrl: item.link,
                    description: item.desc,
                    technologies: item.tech ? (item.tech as string).split(',').map(t => t.trim()) : [],
                    isOngoing: false,
                    startDate: new Date(), // DTO requirement fallback
                  };
                } else if (path === 'awards') {
                  mappedPayload = {
                    title: item.title,
                    issuer: item.org || 'Unknown',
                  };
                } else if (path === 'certifications') {
                  mappedPayload = {
                    name: item.name,
                    issuingOrganization: item.issuingOrganization || item.org || 'Unknown',
                    credentialId: item.credentialId,
                    credentialUrl: item.credentialUrl,
                    description: item.description,
                  };
                } else if (path === 'languages') {
                  mappedPayload = {
                    languageName: item.lang || item.name,
                    proficiencyLevel: item.level ? item.level.toString() : '3',
                    canRead: true, canWrite: true, canSpeak: true
                  };
                } else if (path === 'references') {
                  mappedPayload = {
                    fullName: item.fullName || item.name,
                    jobTitle: item.jobTitle || item.role,
                    company: item.company,
                    relationship: item.relationship,
                    email: item.email,
                    phone: item.phone,
                  };
                }

                const payload = { ...mappedPayload, displayOrder: index };

                if (item['_dbId']) {
                  // Entry đã có trên DB (id thật được lưu vào _dbId sau lần POST đầu)
                  sectionCalls.push(
                    axiosInstance.put(`/cvs/${cvId}/${path}/${item['_dbId']}`, payload)
                  );
                } else {
                  // Entry mới — POST rồi lưu _dbId vào store
                  sectionCalls.push(
                    axiosInstance.post(`/cvs/${cvId}/${path}`, payload).then((res) => {
                      // Ghi _dbId vào entry trong store để lần sau dùng PUT
                      const dbId = res.data?.id as string | undefined;
                      if (dbId) {
                        set(produce((draft: CvEditorState) => {
                          const section = (draft.data as Record<string, unknown>)[key];
                          if (!Array.isArray(section)) return;
                          const entry = section.find(
                            (e: Record<string, unknown>) => e['id'] === item['id']
                          );
                          if (entry) entry['_dbId'] = dbId;
                        }));
                      }
                    })
                  );
                }
              });
            }

            // ── 4. Custom Sections ────────────────────────────────────────────────
            const customSections = s.data.customSections;
            if (Array.isArray(customSections)) {
              customSections.forEach((section, index) => {
                const payload = {
                  sectionTitle: section.sectionTitle,
                  sectionType: section.sectionType,
                  content: { 
                    items: section.items,
                    fieldConfig: section.fieldConfig 
                  }, // Stores the items and config in Json
                  displayOrder: index,
                };

                if (section['_dbId']) {
                  sectionCalls.push(
                    axiosInstance.put(`/cvs/${cvId}/custom-sections/${section['_dbId']}`, payload)
                  );
                } else {
                  sectionCalls.push(
                    axiosInstance.post(`/cvs/${cvId}/custom-sections`, payload).then((res) => {
                      const dbId = res.data?.id as string | undefined;
                      if (dbId) {
                        set(produce((draft: CvEditorState) => {
                          const cs = draft.data.customSections?.find(c => c.id === section.id);
                          if (cs) cs['_dbId'] = dbId;
                        }));
                      }
                    })
                  );
                }
              });
            }

            await Promise.all(sectionCalls);

            set({ isDirty: false, isSaving: false, lastSavedAt: Date.now() });
            return cvId;
          } catch (err) {
            console.error('[syncToDb] failed', err);
            set({ isSaving: false });
            return null;
          }
        },

        markClean: () => set({ isDirty: false }),

        // ── Editor UI ────────────────────────────────────────────────────────────
        setActiveTab: (tab) => set({ activeTab: tab }),

        toggleSection: (key) =>
          set(
            produce((s: CvEditorState) => {
              s.openSections[key] = !s.openSections[key];
            })
          ),

        setLayoutType: (layout) =>
          set(
            produce((s: CvEditorState) => {
              s.layoutType = layout;
              // Sync nameAlign if layout is centered by design
              if (layout === 'black-white' || layout === 'executive-centered') {
                s.style.nameAlign = 'center';
              }
            })
          ),

        setDragging: (key) => set({ draggingKey: key }),

        setDragOver: (key) => set({ dragOverKey: key }),

        reorderSection: (fromKey, toKey) =>
          set(
            produce((s: CvEditorState) => {
              const from = s.order.indexOf(fromKey);
              const to = s.order.indexOf(toKey);
              if (from === -1 || to === -1 || from === to) return;
              s.order.splice(from, 1);
              s.order.splice(to, 0, fromKey);
              s.isDirty = true;
            })
          ),

        reorderSideKey: (fromKey, toKey) =>
          set(
            produce((s: CvEditorState) => {
              const from = s.sideKeys.indexOf(fromKey);
              const to = s.sideKeys.indexOf(toKey);
              if (from === -1 || to === -1 || from === to) return;
              const [moved] = s.sideKeys.splice(from, 1);
              s.sideKeys.splice(to, 0, moved);
              // local UI only — không đánh dấu isDirty
            })
          ),

        moveSectionToZone: (key, toSidebar) =>
          set(
            produce((s: CvEditorState) => {
              if (toSidebar && !s.sideKeys.includes(key)) {
                s.sideKeys.push(key);
              } else if (!toSidebar) {
                s.sideKeys = s.sideKeys.filter((k) => k !== key);
              }
              // local UI only — không đánh dấu isDirty
            })
          ),

        resetCV: () => {
          set({
            data: DEFAULT_DATA,
            order: DEFAULT_ORDER,
            style: DEFAULT_STYLE,
            sectionLayout: {},
            sideKeys: [],
            visibility: {},
            layoutType: 'single-column',
            templateId: null,
            cvId: null,
            isDirty: false,
            isSaving: false,
            lastSavedAt: null,
            activeTab: 'content',
            openSections: { personal: true },
            draggingKey: null,
            dragOverKey: null,
          });
          // Clear history
          setTimeout(() => useCvEditorStore.temporal.getState().clear(), 0);
        },

        resetDrag: () => set({ draggingKey: null, dragOverKey: null }),
      }),
      {
        name: 'cv-editor-state',         // localStorage key
        storage: createJSONStorage(() => localStorage),
        /**
         * Only persist actual CV content + config.
         * Excluded (ephemeral):
         *   - currentCV (heavy, reconstructable from setCV)
         *   - activeTab, openSections (UI only)
         *   - draggingKey, dragOverKey (transient drag state)
         */
        partialize: (s) => ({
          data: s.data,
          order: s.order,
          style: s.style,
          sectionLayout: s.sectionLayout,
          sideKeys: s.sideKeys,
          visibility: s.visibility,
          layoutType: s.layoutType,
          templateId: s.templateId,
          cvId: s.cvId,
          lastSavedAt: s.lastSavedAt,
        }),
      }
    )
  )
);
