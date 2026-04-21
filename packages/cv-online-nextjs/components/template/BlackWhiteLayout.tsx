import React, { useLayoutEffect, useRef, useState } from 'react';
import { MdEmail, MdLink, MdLocationOn, MdPhone } from 'react-icons/md';
import { CvData } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { EditableText } from '../shared/EditableText';
import {
  RenderCtx,
  SectionShell,
  StylePicker,
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  paginateUnits,
  RenderUnit,
  getScaledDragStyle,
  PAGE_HEIGHT_PX,
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
  const borderStyle = globalStyle?.sectionTitleBorder || ctx.sectionLayout.global?.headerBorder || 'top';

  return (
    <div className="cv-paper" style={{ fontFamily, fontSize: fs, lineHeight: lh, width: 794 }}>
      {/* Header — only on first page */}
      {isFirst && (
        <div
          style={{
            padding: '36px 44px 28px',
            color: '#000',
            textAlign: (align || 'center') as React.CSSProperties['textAlign'],
          }}
        >
          <div style={{ fontFamily, fontSize: fs * 2.2, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, lineHeight: 1.2 }}>
            <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên của bạn" />
          </div>
          <div style={{ fontSize: fs, color: '#2e2c2c', marginBottom: 14 }}>
            <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', justifyContent: justifyContact }}>
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdEmail size={11} /><EditableText value={data.personal.email || ''} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
            </span>
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdPhone size={11} /><EditableText value={data.personal.phone || ''} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
            </span>
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdLocationOn size={11} /><EditableText value={data.personal.location || ''} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
            </span>
            <span style={{ fontSize: fs, color: '#666464', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdLink size={11} /><EditableText value={data.personal.website || ''} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: isFirst ? '0px 44px 44px' : '44px 44px 44px' }}>
        {isFirst && (
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: fs * 0.84, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: accentColor,
                textAlign: titleAlign === 'center' ? 'center' : 'left',
                borderTop: borderStyle === 'top' ? `1px solid ${accentColor}` : 'none',
                paddingTop: borderStyle !== 'none' ? 15 : 0,
                marginBottom: borderStyle !== 'none' ? 12 : 6,
                borderLeft: borderStyle === 'left' ? `4px solid ${accentColor}` : 'none',
                paddingLeft: borderStyle === 'left' ? 8 : 0,
              }}
            >Giới thiệu</div>
            <div style={{ color: '#44403c', lineHeight: lh }}>
              <EditableText value={data.personal.summary || ''} onChange={(v) => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." multiline />
            </div>
          </div>
        )}
        {/* Group units by section for DnD */}
        {(() => {
          const ADD_DEFAULTS: Record<string, () => void> = {
            experiences: () => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' }),
            education: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }),
            projects: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }),
            awards: () => ctx.addEntry('awards', { title: '', year: '', org: '' }),
            languages: () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }),
          };
          const ADD_LABELS: Record<string, string> = {
            experiences: '+ Kinh nghiệm',
            education: '+ Học vấn',
            projects: '+ Dự án',
            awards: '+ Giải thưởng',
            languages: '+ Ngôn ngữ',
            skills: '+ Kỹ năng',
          };
          const HAS_DATA: Record<string, boolean> = {
            experiences: !!data.experiences?.length,
            education: !!data.education?.length,
            projects: !!data.projects?.length,
            awards: !!data.awards?.length,
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
                  ]}
                  onChange={(v) => ctx.patchSectionLayout('skills', { proficiencyStyle: v })}
                />
              );
            }
            return undefined;
          };

          const groups: { sectionKey: string; title: string; items: React.ReactNode[] }[] = [];
          sections.forEach(u => {
            if (u.kind === 'section-header') {
              groups.push({ sectionKey: u.sectionKey, title: u.title, items: [] });
            } else if (groups.length > 0) {
              groups[groups.length - 1].items.push(u.node);
            }
          });
          return groups.map(({ sectionKey, title, items }, localIdx) => (
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
      experiences: 'Kinh nghiệm làm việc',
      education: 'Học vấn',
      skills: 'Kỹ năng',
      projects: 'Dự án',
      awards: 'Chứng chỉ & Giải thưởng',
      languages: 'Ngoại ngữ',
    };
    const title = sectionTitles[key];
    if (!title) return;
    // One unit per section — the section component handles item-level DnD internally
    units.push({ kind: 'section-header', sectionKey: key, title });
    if (key === 'experiences') {
      units.push({ kind: 'item', sectionKey: key, node: <ExperienceSection data={data} ctx={ctx} variant="main" /> });
    } else if (key === 'skills') {
      units.push({ kind: 'item', sectionKey: key, node: <SkillsBlock data={data} ctx={ctx} dark={false} /> });
    } else {
      units.push({ kind: 'item', sectionKey: key, node: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} /> });
    }
  });

  // sectionKeys for DnD reorder — unique sections only
  const sectionKeys = [...new Set(units.filter(u => u.kind === 'item').map(u => u.sectionKey))];

  // ── Measurement refs ─────────────────────────────────────────────────
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pages, setPages] = useState<RenderUnit[][]>([[...units]]);
  const HEADER_H = 220;
  const BODY_PAD = 72;
  const FIRST_AVAIL = PAGE_HEIGHT_PX - HEADER_H - BODY_PAD;
  const REST_AVAIL = PAGE_HEIGHT_PX - BODY_PAD;
  useLayoutEffect(() => {
    const heights = measureRefs.current.map(el => el?.getBoundingClientRect().height ?? 0);
    if (heights.every(h => h === 0)) return;
    setPages(paginateUnits(units, heights, FIRST_AVAIL, REST_AVAIL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.join(','), data, JSON.stringify(ctx.sectionLayout)]);

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
      <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: 706, fontFamily, fontSize: fs, lineHeight: lh }}>
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
