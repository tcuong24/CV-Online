import React, { useLayoutEffect, useRef, useState } from 'react';
import { MdEmail, MdLink, MdLocationOn, MdPhone } from 'react-icons/md';
import { User } from 'lucide-react';
import { CvData } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { EditableText } from '../shared/EditableText';
import {
  RenderCtx,
  SectionShell,
  CustomSection,
} from './parts/SharedTemplateComponents';
import {
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  paginateUnits,
  RenderUnit,
  getScaledDragStyle,
  PAGE_HEIGHT_PX,
  StylePicker,
} from './CVTemplate';
import { useCvEditorStore } from '@/stores/useCvEditor';

// ─── Layout: single-column ────────────────────────────────────────────────────

export interface SingleColSection {
  key: string;
  title: string;
  content: React.ReactNode;
}

export function BlackWhitePage({
  sections,
  startIndex,
  isFirst,
  data,
  theme,
  fontFamily,
  align,
  fs,
  lh,
  accentColor,
  ctx,
  scale,
}: {
  sections: RenderUnit[];
  startIndex: number;
  isFirst: boolean;
  data: CvData;
  theme: { primary: string; dark: string; light: string };
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  accentColor: string;
  ctx: RenderCtx;
  scale: number;
}) {
  const justifyContact = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

  const globalStyle = useCvEditorStore.getState().style;
  const titleAlign = globalStyle?.sectionTitleAlign || ctx.sectionLayout.global?.headerAlign || 'left';
  const borderStyle = globalStyle?.title?.border || ctx.sectionLayout.global?.headerBorder || 'top';
  const borderSize = globalStyle?.title?.borderSize || '1px';

  return (
    <div className="cv-paper" style={{ fontFamily, fontSize: fs, lineHeight: lh, width: 794 }}>
      {/* Header — only on first page */}
      {isFirst && (
        <div
          style={{
            padding: '36px 44px 28px',
            color: '#000',
            textAlign: ('center') as React.CSSProperties['textAlign'],
          }}
        >
          <div style={{ fontFamily, fontSize: fs * 2.2, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, lineHeight: 1.2 }}>
            <EditableText scale={scale} value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên của bạn" />
          </div>
          <div style={{ fontSize: fs, color: '#2e2c2c', marginBottom: 14 }}>
            <EditableText scale={scale} value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', justifyContent: 'center' }}>
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EditableText scale={scale} value={data.personal.email || ''} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
            </span>|
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EditableText scale={scale} value={data.personal.phone || ''} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
            </span>|
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EditableText scale={scale} value={data.personal.location || ''} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
            </span>|
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EditableText scale={scale} value={data.personal.website || ''} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: isFirst ? '0px 44px 44px' : '44px 44px 44px' }}>

        {/* Group units by section for DnD */}
        {(() => {
          const profStyle = ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags';
          const ADD_DEFAULTS: Record<string, () => void> = {
            experiences: () => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' }),
            education: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }),
            projects: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }),
            awards: () => ctx.addEntry('awards', { title: '', year: '', org: '' }),
            certifications: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', description: '' }),
            languages: () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }),
            skills: () => {
              if (profStyle === 'grouped') {
                const existingCats = new Set(data.skills?.map(s => s.category?.trim()).filter(Boolean));
                let newCat = 'Danh mục mới';
                let idx = 1;
                while (existingCats.has(newCat)) newCat = `Danh mục mới ${idx++}`;
                ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: 'intermediate', proficiencyPercentage: 70, category: newCat });
              } else {
                ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 80, category: '' });
              }
            },
          };
          const ADD_LABELS: Record<string, string> = {
            experiences: '+ Kinh nghiệm',
            education: '+ Học vấn',
            projects: '+ Dự án',
            awards: '+ Giải thưởng',
            languages: '+ Ngôn ngữ',
            certifications: '+ Chứng chỉ',
            skills: profStyle === 'grouped' ? '+ Danh mục' : '+ Kỹ năng',
          };
          const HAS_DATA: Record<string, boolean> = {
            experiences: !!data.experiences?.length,
            education: !!data.education?.length,
            projects: !!data.projects?.length,
            awards: !!data.awards?.length,
            certifications: !!data.certifications?.length,
            languages: !!data.languages?.length,
            skills: !!data.skills?.length,
          };

          // Helper: build add button (only when section has data)
          const makeAddBtn = (sectionKey: string) => {
            if (!HAS_DATA[sectionKey] || !ADD_DEFAULTS[sectionKey]) return undefined;
            return (
              <button
                onClick={ADD_DEFAULTS[sectionKey]}
                style={{
                  padding: '3px 10px',
                  fontSize: fs * 0.78,
                  fontWeight: 600,
                  border: '1px solid #bfdbfe',
                  borderRadius: 99,
                  cursor: 'pointer',
                  background: '#eff6ff',
                  color: '#3b82f6',
                  transition: 'background 0.12s',
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                }}
              >
                {ADD_LABELS[sectionKey]}
              </button>
            );
          };
          const makeStyleControls = (sectionKey: string): React.ReactNode => {
            if (sectionKey === 'experiences') {
              const cur = ctx.sectionLayout.experiences?.style ?? 'timeline';
              return (
                <StylePicker
                  fs={fs}
                  value={cur}
                  options={[
                    { value: 'timeline', label: 'Timeline' },
                    { value: 'simple', label: 'Simple' },
                  ]}
                  onChange={(v) => ctx.patchSectionLayout('experiences', { style: v })}
                />
              );
            }
            if (sectionKey === 'skills') {
              const cur = ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags';
              return (
                <StylePicker
                  fs={fs}
                  value={cur}
                  options={[
                    { value: 'tags', label: 'Tags' },
                    { value: 'bars', label: 'Bars' },
                    { value: 'dots', label: 'Dots' },
                    { value: 'grouped', label: 'Grouped' },
                  ]}
                  onChange={(v) => ctx.patchSectionLayout('skills', { proficiencyStyle: v })}
                />
              );
            }
            if (sectionKey === 'languages') {
              const cur = ctx.sectionLayout.languages?.style ?? 'bars';
              return (
                <StylePicker
                  fs={fs}
                  value={cur}
                  options={[
                    { value: 'bars', label: 'Bars' },
                    { value: 'dots', label: 'Dots' },
                    { value: 'stars', label: 'Stars' },
                    { value: 'text', label: 'Text only' },
                  ]}
                  onChange={(v) => ctx.patchSectionLayout('languages', { style: v })}
                />
              );
            }
            return undefined;
          };

          const groups: { sectionKey: string; title: string; onTitleChange?: (v: string) => void; items: React.ReactNode[] }[] = [];
          sections.forEach(u => {
            if (u.kind === 'section-header') {
              groups.push({ sectionKey: u.sectionKey, title: u.title, onTitleChange: (u as any).onTitleChange, items: [] });
            } else if (groups.length > 0) {
              groups[groups.length - 1].items.push(u.node);
            }
          });
          return groups.map(({ sectionKey, title, onTitleChange, items }, localIdx) => (
            <Draggable key={sectionKey} draggableId={`section-${sectionKey}`} index={startIndex + localIdx}>
              {(dp, snap) => (
                <div
                  ref={dp.innerRef}
                  {...dp.draggableProps}
                  style={getScaledDragStyle(
                    { ...dp.draggableProps.style, marginBottom: 24 },
                    snap.isDragging,
                    scale,
                    706,
                  )}
                >
                    <SectionShell
                      dragHandleProps={dp.dragHandleProps}
                      isDragging={snap.isDragging}
                      accentColor={accentColor}
                      title={title}
                      onTitleChange={(v) => ctx.updateSectionLabel(sectionKey, v)}
                      fs={fs}
                    addButton={makeAddBtn(sectionKey)}
                    styleControls={makeStyleControls(sectionKey)}
                  >
                    {items}
                  </SectionShell>
                </div>
              )}
            </Draggable>
          ));
        })()}
      </div>
    </div>
  );
}

export function BlackWhiteLayout({
  data,
  order,
  ctx,
  theme,
  fontFamily,
  align,
  fs,
  lh,
  zoom = 100,
}: {
  data: CvData;
  order: string[];
  ctx: RenderCtx;
  theme: { primary: string; dark: string; light: string };
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  zoom?: number;
}) {
  const accentColor = theme.primary;
  const scale = zoom / 100;
  if (!data?.personal) return null;

  // Build flat list of all sections — use ExperienceSection/MainSectionBlocks
  // so that item-level DragDropContext (already embedded in those components) works,
  // same pattern as SidebarLeftLayout.
  const units: RenderUnit[] = [];
  order.filter(k => k !== 'personal').forEach(key => {
    const sectionTitles: Record<string, string> = {
      summary: 'Giới thiệu',
      experiences: 'Kinh nghiệm làm việc',
      education: 'Học vấn',
      skills: 'Kỹ năng',
      projects: 'Dự án',
      awards: 'Chứng chỉ & Giải thưởng',
      languages: 'Ngoại ngữ',
      certifications: 'Chứng chỉ',
      references: 'Tham chiếu',
      interests: 'Sở thích',
      activities: 'Hoạt động',
    };
    const displayTitle = ctx.sectionLayout[key]?.title || sectionTitles[key] || key;
    let onTitleChange: ((v: string) => void) | undefined = (v) => ctx.patchSectionLayout(key, { title: v });
    
    // One unit per section — the section component handles item-level DnD internally
    units.push({ kind: 'section-header', sectionKey: key, title: displayTitle, onTitleChange } as any);
    
    if (key === 'summary') {
      const header = units[units.length - 1] as any;
      header.title = ctx.sectionLayout.summary?.title || sectionTitles.summary;
      header.onTitleChange = (v: string) => ctx.patchSectionLayout('summary', { title: v });
      units.push({ kind: 'item', sectionKey: key, node: <div style={{ color: '#44403c', lineHeight: lh }}>
        <EditableText scale={scale} value={data.personal.summary || ''} onChange={(v) => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." multiline />
      </div> });
    } else if (key === 'experiences') {
      units.push({ kind: 'item', sectionKey: key, node: <ExperienceSection data={data} ctx={ctx} variant="main" /> });
    } else if (key === 'skills') {
      units.push({ kind: 'item', sectionKey: key, node: <SkillsBlock data={data} ctx={ctx} dark={false} /> });
    } else if (key.startsWith('custom-')) {
      const customSection = data.customSections?.find(cs => cs.id === key);
      if (customSection) {
        units.push({ kind: 'item', sectionKey: key, node: <CustomSection section={customSection} ctx={ctx} /> });
        // Update title and onTitleChange for custom section
        const header = units[units.length - 2] as any;
        if (header) {
          header.title = customSection.sectionTitle || 'Custom Section';
          header.onTitleChange = (v: string) => ctx.updateCustomSection(customSection.id, { sectionTitle: v });
        }
      }
    } else {
      units.push({ kind: 'item', sectionKey: key, node: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} /> });
    }
  });

  // sectionKeys for DnD reorder — unique sections only
  const sectionKeys = [...new Set(units.filter(u => u.kind === 'item').map(u => u.sectionKey))];

  // ── Measurement refs ─────────────────────────────────────────────────
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<RenderUnit[][]>([[...units]]);
  const HEADER_H = 220;
  const BODY_PAD = 72;
  const FIRST_AVAIL = PAGE_HEIGHT_PX - HEADER_H - BODY_PAD;
  const REST_AVAIL = PAGE_HEIGHT_PX - BODY_PAD;
  
  const [recalcNonce, setRecalcNonce] = useState(0);

  // Recalculate whenever size of hidden container changes
  useLayoutEffect(() => {
    if (!containerRef.current || typeof window === 'undefined' || !('ResizeObserver' in window)) return;
    const observer = new window.ResizeObserver(() => {
      setRecalcNonce(n => n + 1);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const heights = measureRefs.current.map(el => el?.getBoundingClientRect().height ?? 0);
    if (heights.every(h => h === 0)) return;
    setPages(paginateUnits(units, heights, FIRST_AVAIL, REST_AVAIL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.join(','), data, JSON.stringify(ctx.sectionLayout), recalcNonce]);

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;
        const fromKey = sectionKeys[result.source.index];
        const toKey = sectionKeys[result.destination.index];
        if (fromKey && toKey) ctx.reorderSection(fromKey, toKey);
      }}
    >
      {/* ── Hidden measurement container ── */}
      <div ref={containerRef} style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: 706, fontFamily, fontSize: fs, lineHeight: lh }}>
        {units.map((u, i) => (
          <div key={i} ref={el => { measureRefs.current[i] = el; }}>
            {u.kind === 'section-header'
              ? <div style={{ fontSize: fs * 0.84, fontWeight: 700, paddingBottom: 5, marginBottom: 12 }}>{u.title}</div>
              : u.node}
          </div>
        ))}
      </div>


      {/* ── Actual paginated output ── */}
      <Droppable droppableId="sections-main">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="cv-pages-wrapper">
            {pages.map((pageUnits, pageIdx) => (
              <BlackWhitePage
                key={pageIdx}
                isFirst={pageIdx === 0}
                startIndex={pages.slice(0, pageIdx).reduce((sum, p) => {
                  // count unique sections per page for DnD index
                  const keys = new Set(p.filter(u => u.kind === 'item').map(u => u.sectionKey));
                  return sum + keys.size;
                }, 0)}
                sections={pageUnits}
                data={data}
                theme={theme}
                fontFamily={fontFamily}
                align={align}
                fs={fs}
                lh={lh}
                accentColor={accentColor}
                ctx={ctx}
                scale={scale}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
