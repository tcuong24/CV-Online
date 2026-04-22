'use client';

import React, { useRef, useState } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { Palette } from 'lucide-react';
import { LH_MAP } from '@/constants/cvEditor';
import { CvData, SectionLayoutConfig, SkillEntry, StyleConfig, ExperienceEntry, EducationEntry, ProjectEntry, AwardEntry, LanguageEntry, LayoutType } from '@/types/cvEditor';
import { resolveFontFamily, resolveTheme } from '@/lib/mappers/templateMapper';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { EditableText } from '../shared/EditableText';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { SingleColumnLayout } from './SingleColumnLayout';
import { SidebarLeftLayout } from './SidebarLeftLayout';
import { SidebarRightLayout } from './SidebarRightLayout';
import { ExecutiveCenteredLayout } from './ExecutiveCentered';
import { TechTimelineLayout } from './TechTimeline';
import { AsymmetricLayout } from './AsymmetricLayout';
import { TwoColumnLayout } from './TwoColumnLayout';
import { BlackWhiteLayout } from './BlackWhiteLayout';

export const PAGE_HEIGHT_PX = 1123; // full A4 height at 96dpi

// ─── Scale compensation for DnD ghost under CSS transform:scale() ─────────────
/**
 * @hello-pangea/dnd measures coordinates BEFORE CSS transform is applied.
 * When the container has transform:scale(s), the ghost element is mispositioned.
 * Fix: divide translate values by scale, override width to natural (pre-scale) value.
 */
export function getScaledDragStyle(
  style: React.CSSProperties | undefined,
  isDragging: boolean,
  scale: number,
  naturalWidth: number,
): React.CSSProperties {
  if (!isDragging || !style) return style ?? {};
  const transform = (style.transform as string) ?? '';
  const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
  const correctedTransform = match
    ? `translate(${parseFloat(match[1]) / scale}px, ${parseFloat(match[2]) / scale}px)`
    : transform;
  return {
    ...style,
    transform: correctedTransform,
    width: naturalWidth,
    height: 'auto',
    boxSizing: 'border-box' as const,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CVTemplateProps {
  data: CvData;
  order: string[];
  style: StyleConfig;
  layoutType?: LayoutType;
  sideKeys?: string[];
  sectionLayout?: SectionLayoutConfig;
  zoom?: number; // percentage, default 100
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
  moveSectionToZone: (key: string, toSidebar: boolean) => void;
  patchSectionLayout: (key: string, patch: Record<string, unknown>) => void;
}

// ─── StylePicker — Palette icon + hover dropdown to switch section display style ──

export function StylePicker<T extends string>({
  options,
  value,
  onChange,
  fs,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  fs: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        title="Đổi kiểu hiển thị"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3px',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          cursor: 'pointer',
          background: open ? '#eff6ff' : 'transparent',
          color: open ? '#3b82f6' : '#9ca3af',
          transition: 'background 0.12s, color 0.12s',
          lineHeight: 0,
        }}
      >
        <Palette size={Math.round(fs * 0.9)} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            padding: '4px',
            zIndex: 50,
            minWidth: 100,
          }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: '100%',
                padding: '5px 10px',
                fontSize: fs * 0.8,
                fontWeight: value === opt.value ? 700 : 400,
                background: value === opt.value ? '#eff6ff' : 'transparent',
                color: value === opt.value ? '#3b82f6' : '#374151',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left' as const,
                fontFamily: 'inherit',
                transition: 'background 0.1s',
              }}
            >
              {value === opt.value && <span style={{ fontSize: fs * 0.75 }}>✓</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** @deprecated use StylePicker */
export function StyleSwitcher<T extends string>(props: Parameters<typeof StylePicker<T>>[0]) {
  return <StylePicker {...props} />;
}

// ─── SectionShell — hover outline + drag handle for section-level DnD ────────

export function SectionShell({
  children,
  dragHandleProps = null,
  isDragging = false,
  accentColor,
  title,
  fs,
  dark = false,
  addButton,
  styleControls,
}: {
  children: React.ReactNode;
  dragHandleProps?: React.HTMLAttributes<HTMLElement> | null;
  isDragging?: boolean;
  accentColor: string;
  title: string;
  fs: number;
  dark?: boolean;
  addButton?: React.ReactNode;
  styleControls?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const titleColor = dark ? 'rgba(255,255,255,0.9)' : accentColor;
  const borderColor = dark ? 'rgba(255,255,255,0.3)' : accentColor;
  const globalStyle = useCvEditorStore(s => s.style);
  
  const align = globalStyle?.sectionTitleAlign || 'left';
  const borderStyle = globalStyle?.sectionTitleBorder || 'bottom';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 4,
        outline: (hovered || isDragging)
          ? `1.5px dashed ${accentColor}66`
          : '1.5px dashed transparent',
        transition: 'outline-color 0.12s',
        padding: '0 2px',
        opacity: isDragging ? 0.85 : 1,
      }}
    >
      {/* Section title row: [drag][title] ←→ [style picker][+ add] */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: align === 'center' ? 'center' : 'space-between',
          borderTop: borderStyle === 'top' ? `1px solid ${borderColor}` : 'none',
          paddingTop: borderStyle === 'top' ? 15 : 0,
          borderBottom: borderStyle === 'bottom' ? `1px solid ${borderColor}` : 'none',
          paddingBottom: borderStyle !== 'none' ? 2 : 0,
          marginBottom: borderStyle !== 'none' ? 2 : 6,
          borderLeft: borderStyle === 'left' ? `4px solid ${borderColor}` : 'none',
          paddingLeft: borderStyle === 'left' ? 8 : 0,
        }}
      >
        {/* Left: drag handle + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            {...(dragHandleProps ?? {})}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'grab',
              color: titleColor,
              opacity: hovered ? 0.55 : 0,
              transition: 'opacity 0.12s',
              flexShrink: 0,
              marginLeft: -20,
              userSelect: 'none',
            }}
            title="Kéo để sắp xếp section"
          >
            <MdDragIndicator size={14} />
          </span>
          <span
            style={{
              fontSize: fs * 1.2,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: titleColor,
            }}
          >
            {title}
          </span>
        </div>
        {/* Right: style picker + add button — visible only on hover */}
        {(styleControls || addButton) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.15s',
              pointerEvents: hovered ? 'auto' : 'none',
            }}
          >
            {styleControls}
            {addButton}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Shared section renderers ──────────────────────────────────────────────────

/** Renders a single timeline entry. */
export function TimelineEntry({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: RenderCtx;
}) {
  return (
    <div
      style={{
        paddingLeft: 12,
        borderLeft: `2px solid ${ctx.accentColor}30`,
        marginBottom: 13,
      }}
    >
      {children}
    </div>
  );
}

/** Experience section — shared between layouts. */
export function ExperienceSection({
  data,
  ctx,
  variant = 'main',
}: {
  data: CvData;
  ctx: RenderCtx;
  variant?: 'main' | 'sidebar';
}) {
  const expStyle = ctx.sectionLayout.experiences?.style ?? 'timeline';
  const { fs, lh, accentColor } = ctx;

  if (!data.experiences?.length) {
    return (
      <div className="flex flex-col relative h-6 group pb-6 cursor-pointer" onClick={() => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' })}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm kinh nghiệm</button>
        </div>
      </div>
    );
  }
  
  return (
    <DragDropContext onDragEnd={(result: DropResult) => {
      if (!result.destination || result.destination.index === result.source.index) return;
      ctx.reorderEntry('experiences', result.source.index, result.destination.index);
    }}>
      <Droppable droppableId="experiences">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col relative group pb-6">
            {data.experiences.map((e, index) => (
              <Draggable key={e.id} draggableId={e.id} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    style={{ ...dragProvided.draggableProps.style, opacity: snapshot.isDragging ? 0.7 : 1 }}
                  >
                    {expStyle === 'timeline' ? (
                      <div className="group/item relative flex">
                        <span {...dragProvided.dragHandleProps} className="shrink-0 mt-1 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <TimelineEntry ctx={ctx}>
                            {(e.from || e.to) && (
                              <div style={{ fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", display: 'flex', gap: 4 }}>
                                <EditableText value={e.from} onChange={(v) => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Bắt đầu" />
                                <span>–</span>
                                <EditableText value={e.to} onChange={(v) => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Kết thúc" />
                              </div>
                            )}
                            <div style={{ fontWeight: 700, color: '#1c1917' }}>
                              <EditableText value={e.title} onChange={(v) => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Chức danh" />
                            </div>
                            {(e.company || e.location) && (
                              <div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3, display: 'flex', gap: 4 }}>
                                <EditableText value={e.company} onChange={(v) => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" />
                                {e.company && e.location && <span>·</span>}
                                <EditableText value={e.location} onChange={(v) => ctx.updateEntry('experiences', e.id, { location: v })} placeholder="Địa điểm" />
                              </div>
                            )}
                            <div style={{ fontSize: fs * 0.88, color: '#57534e', lineHeight: lh }}>
                              <EditableText value={e.desc} onChange={(v) => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc" multiline />
                            </div>
                          </TimelineEntry>
                        </div>
                        <button
                          onClick={() => ctx.removeEntry('experiences', e.id)}
                          className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Xóa kinh nghiệm này"
                        >✕</button>
                      </div>
                    ) : expStyle === 'cards' ? (
                      <div style={{ marginBottom: 13, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} className="group/item relative flex">
                        <span {...dragProvided.dragHandleProps} className="shrink-0 mr-2 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, color: '#111827', fontSize: fs * 1.05 }}>
                              <EditableText value={e.title} onChange={(v) => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Chức danh" />
                            </span>
                            <span style={{ fontSize: fs * 0.82, color: '#6b7280', display: 'flex', gap: 4, alignItems: 'center', background: '#f3f4f6', padding: '2px 8px', borderRadius: '12px' }}>
                              <EditableText value={e.from} onChange={(v) => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Bắt đầu" />
                              <span>–</span>
                              <EditableText value={e.to} onChange={(v) => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Kết thúc" />
                            </span>
                          </div>
                          <div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 600, marginBottom: 8, display: 'flex', gap: 4 }}>
                            <EditableText value={e.company} onChange={(v) => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" />
                            <span>·</span>
                            <EditableText value={e.location} onChange={(v) => ctx.updateEntry('experiences', e.id, { location: v })} placeholder="Địa điểm" />
                          </div>
                          <div style={{ fontSize: fs * 0.9, color: '#4b5563', lineHeight: lh }}>
                            <EditableText value={e.desc} onChange={(v) => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc" multiline />
                          </div>
                        </div>
                        <button onClick={() => ctx.removeEntry('experiences', e.id)} className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    ) : expStyle === 'bullets' ? (
                      <div style={{ marginBottom: 12, paddingLeft: 16, position: 'relative' }} className="group/item flex">
                        <div style={{ position: 'absolute', left: 4, top: 8, width: 4, height: 4, borderRadius: '50%', background: accentColor }} />
                        <span {...dragProvided.dragHandleProps} className="shrink-0 -ml-5 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ fontWeight: 600, color: '#1c1917', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <EditableText value={e.title} onChange={(v) => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Chức danh" />
                            <span style={{ fontWeight: 400, color: '#78716c' }}>tại</span>
                            <span style={{ color: accentColor }}><EditableText value={e.company} onChange={(v) => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" /></span>
                            <span style={{ fontSize: fs * 0.85, color: '#9ca3af', fontWeight: 400, display: 'flex', gap: 4, marginLeft: 'auto' }}>
                              (<EditableText value={e.from} onChange={(v) => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Từ" />
                              <span>-</span>
                              <EditableText value={e.to} onChange={(v) => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Đến" />)
                            </span>
                          </div>
                          <div style={{ fontSize: fs * 0.9, color: '#57534e', lineHeight: lh, marginTop: 2 }}>
                            <EditableText value={e.desc} onChange={(v) => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc" multiline />
                          </div>
                        </div>
                        <button onClick={() => ctx.removeEntry('experiences', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 13 }} className="group/item relative flex">
                        <span {...dragProvided.dragHandleProps} className="shrink-0 mt-1 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 2, marginTop: 6 }}>
                            <span style={{ fontWeight: 700, color: '#1c1917', fontSize: fs * 1.1 }}>
                              <EditableText value={e.title} onChange={(v) => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Chức danh" />
                            </span>
                            <span style={{ fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', display: 'flex', gap: 4 }}>
                              <EditableText value={e.from} onChange={(v) => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Bắt đầu" />
                              <span>–</span>
                              <EditableText value={e.to} onChange={(v) => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Kết thúc" />
                            </span>
                          </div>
                          <div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3, display: 'flex', gap: 4 }}>
                            <EditableText value={e.company} onChange={(v) => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" />
                            <span>·</span>
                            <EditableText value={e.location} onChange={(v) => ctx.updateEntry('experiences', e.id, { location: v })} placeholder="Địa điểm" />
                          </div>
                          <div style={{ fontSize: fs * 0.9, color: '#57534e', lineHeight: lh }}>
                            <EditableText value={e.desc} onChange={(v) => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc" multiline />
                          </div>
                        </div>
                        <button onClick={() => ctx.removeEntry('experiences', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

/** Skills renderer — handles bars / dots / tags styles. */
export function SkillsBlock({
  data,
  ctx,
  dark = false,
}: {
  data: CvData;
  ctx: RenderCtx;
  dark?: boolean;
}) {
  const skillStyle = ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags';
  const { fs, accentColor, textColor: dbText } = ctx;
  const textColor = dark ? 'rgba(255,255,255,0.85)' : (dbText?.body || '#44403c');
  const { fs, accentColor, textColor: dbText } = ctx;
  const textColor = dark ? 'rgba(255,255,255,0.85)' : (dbText?.body || '#44403c');
  const trackBg = dark ? 'rgba(255,255,255,0.2)' : `${accentColor}20`;
  const fillBg = dark ? 'rgba(255,255,255,0.8)' : accentColor;
  const newSkill = () => ({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' });
  if (skillStyle === 'none') {
    return (
      <div style={{  gap: 8 }} className="relative group pb-6">
        {data.skills.map((s) => (
          <span key={s.id} style={{display:'block',  gap: 5, fontSize: fs * 0.88, color: textColor }} className="group/item relative pr-5">
            <span style={{ width: dark ? 5 : 6, height: dark ? 5 : 6, borderRadius: '50%', background: fillBg, flexShrink: 0 }} />
            <EditableText value={s.name} onChange={(v) => ctx.updateSkill(s.id, { name: v })} placeholder="Kỹ năng" />
            <button onClick={() => ctx.removeSkill(s.id)} className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
          </span>
        ))}
        
      </div>
    );
  }
  if (skillStyle === 'bars') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="relative group pb-4">
        {data.skills.map((s) => (
          <div key={s.id} className="group/item relative pr-6">
            <div style={{ fontSize: fs * 0.9, color: textColor, marginBottom: 3 }}>
              <EditableText value={s.name} onChange={(v) => ctx.updateSkill(s.id, { name: v })} placeholder="Kỹ năng" />
            </div>
            <div 
              style={{ height: dark ? 3 : 4, background: trackBg, borderRadius: 2, cursor: 'pointer', position: 'relative' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newPerc = Math.min(100, Math.max(0, Math.round((x / rect.width) * 100)));
                ctx.updateSkill(s.id, { proficiencyPercentage: newPerc });
              }}
            >
              <div style={{ width: `${s.proficiencyPercentage || 70}%`, height: '100%', background: fillBg, borderRadius: 2 }} />
            </div>
            <button onClick={() => ctx.removeSkill(s.id)} className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
          </div>
        ))}
        
      </div>
    );
  }

  if (skillStyle === 'dots') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} className="relative group pb-6">
        {data.skills.map((s) => (
          <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: fs * 0.88, color: textColor }} className="group/item relative pr-5">
            <span style={{ width: dark ? 5 : 6, height: dark ? 5 : 6, borderRadius: '50%', background: fillBg, flexShrink: 0 }} />
            <EditableText value={s.name} onChange={(v) => ctx.updateSkill(s.id, { name: v })} placeholder="Kỹ năng" />
            <button onClick={() => ctx.removeSkill(s.id)} className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
          </span>
        ))}
        
      </div>
    );
  }
  if (skillStyle === 'none') {
    return (
      <div style={{ gap: 8 }} className="relative group pb-6">
        {data.skills.map((s) => (
          <span key={s.id} style={{  gap: 5, fontSize: fs * 0.88, color: textColor }} className="group/item relative pr-5">
            <span style={{ width: dark ? 5 : 6, height: dark ? 5 : 6, borderRadius: '50%', background: fillBg, flexShrink: 0 }} />
            <EditableText value={s.name} onChange={(v) => ctx.updateSkill(s.id, { name: v })} placeholder="Kỹ năng" />
            <button onClick={() => ctx.removeSkill(s.id)} className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
          </span>
        ))}
        
      </div>
    );
  }

  // tags / chips (default)
  if (dark) {
    return (
      <div className="relative group pb-4">
        {data.skills.map((s) => (
          <div key={s.id} style={{ fontSize: fs * 0.84, color: textColor, marginBottom: 5 }} className="group/item relative pr-6">
            <EditableText value={s.name} onChange={(v) => ctx.updateSkill(s.id, { name: v })} placeholder="Kỹ năng" />
            <button onClick={() => ctx.removeSkill(s.id)} className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} className="relative group pb-6">
      {data.skills.map((s) => (
        <span
          key={s.id}
          style={{
            padding: '3px 10px',
            border: `1px solid ${accentColor}40`,
            borderRadius: 99,
            fontSize: fs * 0.88,
            color: accentColor,
          }}
          className="group/item relative pr-8 inline-flex items-center"
        >
          <EditableText value={s.name} onChange={(v) => ctx.updateSkill(s.id, { name: v })} placeholder="Kỹ năng" />
          <button onClick={() => ctx.removeSkill(s.id)} className="absolute right-1 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
        </span>
      ))}
    
    </div>
  );
}

export function MainSectionBlocks({
  sectionKey,
  data,
  ctx,
}: {
  sectionKey: string;
  data: CvData;
  ctx: RenderCtx;
}) {
  const { fs, lh, accentColor } = ctx;
  const entryStyle = { marginBottom: 14 };
  const titleStyle = { fontSize: fs * 1.05, fontWeight: 700, color: '#1c1917' };
  const subStyle = { fontSize: fs * 0.9, color: '#57534e', fontStyle: 'italic' as const, marginBottom: 3 };
  const descStyle = { fontSize: fs * 0.9, color: '#57534e', lineHeight: lh };
  const dateStyle = { fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' as const };

  if (sectionKey === 'education') {
    if (!data.education?.length) {
      return (
        <div className="flex h-6 flex-col relative group pb-4 cursor-pointer" onClick={() => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' })}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm học vấn</button>
          </div>
        </div>
      );
    }
    return (
      <DragDropContext onDragEnd={(result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) return;
        ctx.reorderEntry('education', result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="education">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 relative group pb-4">
              {data.education.map((e, index) => (
                <Draggable key={e.id} draggableId={e.id} index={index}>
                  {(dp, snap) => (
                    <div ref={dp.innerRef} {...dp.draggableProps} style={{ ...dp.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}>
                      <div style={entryStyle} className="group/item relative flex">
                        <span {...dp.dragHandleProps} className="shrink-0 mt-1 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
                            <span style={titleStyle}><EditableText value={e.degree} onChange={(v) => ctx.updateEntry('education', e.id, { degree: v })} placeholder="Chuyên ngành" /></span>
                            {(e.from || e.to) && (
                              <span style={dateStyle} className="flex gap-1">
                                <EditableText value={e.from} onChange={(v) => ctx.updateEntry('education', e.id, { from: v })} placeholder="Bắt đầu" />
                                <span>–</span>
                                <EditableText value={e.to} onChange={(v) => ctx.updateEntry('education', e.id, { to: v })} placeholder="Kết thúc" />
                              </span>
                            )}
                          </div>
                          <div style={subStyle}><EditableText value={e.school} onChange={(v) => ctx.updateEntry('education', e.id, { school: v })} placeholder="Trường" /></div>
                          {e.desc && <div style={descStyle}><EditableText value={e.desc} onChange={(v) => ctx.updateEntry('education', e.id, { desc: v })} placeholder="Mô tả" multiline /></div>}
                        </div>
                        <button onClick={() => ctx.removeEntry('education', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  if (sectionKey === 'projects') {
    if (!data.projects?.length) {
      return (
        <div className="flex h-6 flex-col relative group pb-4 cursor-pointer" onClick={() => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' })}>         
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm dự án</button>
          </div>
        </div>
      );
    }
    return (
      <DragDropContext onDragEnd={(result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) return;
        ctx.reorderEntry('projects', result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 relative group pb-4">
              {data.projects.map((e, index) => (
                <Draggable key={e.id} draggableId={e.id} index={index}>
                  {(dp, snap) => (
                    <div ref={dp.innerRef} {...dp.draggableProps} style={{ ...dp.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}>
                      <div style={entryStyle} className="group/item relative flex">
                        <span {...dp.dragHandleProps} className="shrink-0 mt-1 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                            <span style={titleStyle}><EditableText value={e.name} onChange={(v) => ctx.updateEntry('projects', e.id, { name: v })} placeholder="Tên dự án" /></span>
                            {e.link && <span style={dateStyle}><EditableText value={e.link} onChange={(v) => ctx.updateEntry('projects', e.id, { link: v })} placeholder="Link dự án" /></span>}
                          </div>
                          {e.tech && <div style={{ ...subStyle, fontStyle: 'normal' }}><EditableText value={e.tech} onChange={(v) => ctx.updateEntry('projects', e.id, { tech: v })} placeholder="Công nghệ sử dụng" multiline /></div>}
                          {e.desc && <div style={descStyle}><EditableText value={e.desc} onChange={(v) => ctx.updateEntry('projects', e.id, { desc: v })} placeholder="Mô tả dự án" multiline /></div>}
                        </div>
                        <button onClick={() => ctx.removeEntry('projects', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  if (sectionKey === 'awards') {
    if (!data.awards?.length) {
      return (
        <div className="flex h-6 flex-col relative group pb-4 cursor-pointer" onClick={() => ctx.addEntry('awards', { title: '', year: '', org: '' })}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm giải thưởng</button>
          </div>
        </div>
      );
    }
    return (
      <DragDropContext onDragEnd={(result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) return;
        ctx.reorderEntry('awards', result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="awards">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 relative group pb-4">
              {data.awards.map((e, index) => (
                <Draggable key={e.id} draggableId={e.id} index={index}>
                  {(dp, snap) => (
                    <div ref={dp.innerRef} {...dp.draggableProps} style={{ ...dp.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}>
                      <div style={entryStyle} className="group/item relative flex">
                        <span {...dp.dragHandleProps} className="shrink-0 mt-1 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <span style={titleStyle}><EditableText value={e.title} onChange={(v) => ctx.updateEntry('awards', e.id, { title: v })} placeholder="Tên giải thưởng" /></span>
                            <span style={dateStyle}><EditableText value={e.year} onChange={(v) => ctx.updateEntry('awards', e.id, { year: v })} placeholder="Năm" /></span>
                          </div>
                          <div style={subStyle}><EditableText value={e.org} onChange={(v) => ctx.updateEntry('awards', e.id, { org: v })} placeholder="Tổ chức cấp" /></div>
                        </div>
                        <button onClick={() => ctx.removeEntry('awards', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  if (sectionKey === 'languages') {
    if (!data.languages?.length) {
      return (
        <div className="flex h-6 flex-col relative group pb-4 cursor-pointer" onClick={() => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 })}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm ngôn ngữ</button>
          </div>
        </div>
      );
    }
    return (
      <DragDropContext onDragEnd={(result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) return;
        ctx.reorderEntry('languages', result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="languages">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col relative group pb-4">
              {data.languages.map((l, index) => (
                <Draggable key={l.id} draggableId={l.id} index={index}>
                  {(dp, snap) => (
                    <div ref={dp.innerRef} {...dp.draggableProps} style={{ ...dp.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}>
                      <div className="group/item relative flex items-center" style={{ marginBottom: 7 }}>
                        <span {...dp.dragHandleProps} className="shrink-0 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none text-xs" title="Kéo thả">⠿</span>
                        <span style={{ fontSize: fs * 0.95, fontWeight: 500, flex: 1 }}><EditableText value={l.lang} onChange={(v) => ctx.updateEntry('languages', l.id, { lang: v })} placeholder="Ngoại ngữ" /></span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              onClick={() => ctx.updateEntry('languages', l.id, { level: i })}
                              style={{
                                width: 18,
                                height: 4,
                                borderRadius: 2,
                                background: l.level >= i ? accentColor : '#e7e5e4',
                                cursor: 'pointer',
                              }}
                              title={`Level ${i}`}
                            />
                          ))}
                        </div>
                        <button onClick={() => ctx.removeEntry('languages', l.id)} className="ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  if (sectionKey === 'certifications') {
    if (!data.certifications?.length) {
      return (
        <div className="flex h-6 flex-col relative group pb-4 cursor-pointer" onClick={() => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', description: '' })}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm chứng chỉ</button>
          </div>
        </div>
      );
    }
    return (
      <DragDropContext onDragEnd={(result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) return;
        ctx.reorderEntry('certifications', result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="certifications">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 relative group pb-4">
              {data.certifications.map((e, index) => (
                <Draggable key={e.id} draggableId={e.id} index={index}>
                  {(dp, snap) => (
                    <div ref={dp.innerRef} {...dp.draggableProps} style={{ ...dp.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}>
                      <div style={entryStyle} className="group/item relative flex">
                        <span {...dp.dragHandleProps} className="shrink-0 mt-1 mr-1 cursor-grab opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-opacity text-gray-400 select-none" title="Kéo thả">⠿</span>
                        <div className="flex-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
                            <span style={titleStyle}><EditableText value={e.name} onChange={(v) => ctx.updateEntry('certifications', e.id, { name: v })} placeholder="Tên chứng chỉ" /></span>
                            <span style={dateStyle}><EditableText value={e.issueDate} onChange={(v) => ctx.updateEntry('certifications', e.id, { issueDate: v })} placeholder="Ngày cấp" /></span>
                          </div>
                          <div style={subStyle}><EditableText value={e.issuingOrganization} onChange={(v) => ctx.updateEntry('certifications', e.id, { issuingOrganization: v })} placeholder="Tổ chức cấp" /></div>
                          <div style={descStyle}><EditableText value={e.description} onChange={(v) => ctx.updateEntry('certifications', e.id, { description: v })} placeholder="Mô tả" multiline /></div>
                        </div>
                        <button onClick={() => ctx.removeEntry('certifications', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return null;
}
// ─── Per-item components (dùng cho item-level pagination) ─────────────────────



export function ExperienceItem({ entry: e, ctx }: { entry: ExperienceEntry; ctx: RenderCtx }) {
  const { fs, lh, accentColor } = ctx;
  const expStyle = ctx.sectionLayout.experiences?.style ?? 'timeline';
  const monoStyle = { fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace" };
  const descStyle = { fontSize: fs * 0.88, color: '#57534e', lineHeight: lh };
  if (expStyle === 'timeline') {
    return (
      <div className="group/item relative flex" style={{ marginBottom: 13 }}>
        <div style={{ paddingLeft: 12, borderLeft: `2px solid ${accentColor}30`, flex: 1 }}>
          <div style={{ ...monoStyle, display: 'flex', gap: 4, marginBottom: 2 }}>
            <EditableText value={e.from} onChange={v => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Bắt đầu" />–
            <EditableText value={e.to} onChange={v => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Kết thúc" />
          </div>
          <div style={{ fontWeight: 700, color: '#1c1917' }}><EditableText value={e.title} onChange={v => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Chức danh" /></div>
          <div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3, display: 'flex', gap: 4 }}>
            <EditableText value={e.company} onChange={v => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" />·
            <EditableText value={e.location} onChange={v => ctx.updateEntry('experiences', e.id, { location: v })} placeholder="Địa điểm" />
          </div>
          <div style={descStyle}><EditableText value={e.desc} onChange={v => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc" multiline /></div>
        </div>
        <button onClick={() => ctx.removeEntry('experiences', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 13 }} className="group/item relative flex">
      <div className="flex-1">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, color: '#1c1917' }}><EditableText value={e.title} onChange={v => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Chức danh" /></span>
          <span style={{ ...monoStyle, display: 'flex', gap: 4 }}>
            <EditableText value={e.from} onChange={v => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Bắt đầu" />–
            <EditableText value={e.to} onChange={v => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Kết thúc" />
          </span>
        </div>
        <div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3, display: 'flex', gap: 4 }}>
          <EditableText value={e.company} onChange={v => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" />·
          <EditableText value={e.location} onChange={v => ctx.updateEntry('experiences', e.id, { location: v })} placeholder="Địa điểm" />
        </div>
        <div style={descStyle}><EditableText value={e.desc} onChange={v => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc" multiline /></div>
      </div>
      <button onClick={() => ctx.removeEntry('experiences', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
    </div>
  );
}

export function EducationItem({ entry: e, ctx }: { entry: EducationEntry; ctx: RenderCtx }) {
  const { fs, lh } = ctx;
  const titleStyle = { fontSize: fs * 1.05, fontWeight: 700, color: '#1c1917' };
  const subStyle = { fontSize: fs * 0.9, color: '#57534e', fontStyle: 'italic' as const, marginBottom: 3 };
  const descStyle = { fontSize: fs * 0.9, color: '#57534e', lineHeight: lh };
  const dateStyle = { fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' as const };
  return (
    <div style={{ marginBottom: 14 }} className="group/item relative flex">
      <div className="flex-1">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
          <span style={titleStyle}><EditableText value={e.degree} onChange={v => ctx.updateEntry('education', e.id, { degree: v })} placeholder="Chuyên ngành" /></span>
          <span style={dateStyle} className="flex gap-1">
            <EditableText value={e.from} onChange={v => ctx.updateEntry('education', e.id, { from: v })} placeholder="Bắt đầu" />–
            <EditableText value={e.to} onChange={v => ctx.updateEntry('education', e.id, { to: v })} placeholder="Kết thúc" />
          </span>
        </div>
        <div style={subStyle}><EditableText value={e.school} onChange={v => ctx.updateEntry('education', e.id, { school: v })} placeholder="Trường" /></div>
        <div style={descStyle}><EditableText value={e.desc} onChange={v => ctx.updateEntry('education', e.id, { desc: v })} placeholder="Mô tả" multiline /></div>
      </div>
      <button onClick={() => ctx.removeEntry('education', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
    </div>
  );
}

export function ProjectItem({ entry: e, ctx }: { entry: ProjectEntry; ctx: RenderCtx }) {
  const { fs, lh, accentColor } = ctx;
  const titleStyle = { fontSize: fs * 1.05, fontWeight: 700, color: '#1c1917' };
  const subStyle = { fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3 };
  const descStyle = { fontSize: fs * 0.9, color: '#57534e', lineHeight: lh };
  const dateStyle = { fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' as const };
  return (
    <div style={{ marginBottom: 14 }} className="group/item relative flex">
      <div className="flex-1">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 2 }}>
          <span style={titleStyle}><EditableText value={e.name} onChange={v => ctx.updateEntry('projects', e.id, { name: v })} placeholder="Tên dự án" /></span>
          <span style={dateStyle}><EditableText value={e.link} onChange={v => ctx.updateEntry('projects', e.id, { link: v })} placeholder="Link dự án" /></span>
        </div>
        <div style={subStyle}><EditableText value={e.tech} onChange={v => ctx.updateEntry('projects', e.id, { tech: v })} placeholder="Công nghệ sử dụng" /></div>
        <div style={descStyle}><EditableText value={e.desc} onChange={v => ctx.updateEntry('projects', e.id, { desc: v })} placeholder="Mô tả dự án" multiline /></div>
      </div>
      <button onClick={() => ctx.removeEntry('projects', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
    </div>
  );
}

export function AwardItem({ entry: e, ctx }: { entry: AwardEntry; ctx: RenderCtx }) {
  const { fs } = ctx;
  const titleStyle = { fontSize: fs * 1.05, fontWeight: 700, color: '#1c1917' };
  const subStyle = { fontSize: fs * 0.9, color: '#57534e', fontStyle: 'italic' as const };
  const dateStyle = { fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' as const };
  return (
    <div style={{ marginBottom: 14 }} className="group/item relative flex">
      <div className="flex-1">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span style={titleStyle}><EditableText value={e.title} onChange={v => ctx.updateEntry('awards', e.id, { title: v })} placeholder="Tên giải thưởng" /></span>
          <span style={dateStyle}><EditableText value={e.year} onChange={v => ctx.updateEntry('awards', e.id, { year: v })} placeholder="Năm" /></span>
        </div>
        <div style={subStyle}><EditableText value={e.org} onChange={v => ctx.updateEntry('awards', e.id, { org: v })} placeholder="Tổ chức cấp" /></div>
      </div>
      <button onClick={() => ctx.removeEntry('awards', e.id)} className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
    </div>
  );
}

export function LanguageItem({ entry: l, ctx }: { entry: LanguageEntry; ctx: RenderCtx }) {
  const { fs, accentColor } = ctx;
  return (
    <div className="group/item relative flex items-center" style={{ marginBottom: 7 }}>
      <span style={{ fontSize: fs * 0.95, fontWeight: 500, flex: 1 }}>
        <EditableText value={l.lang} onChange={v => ctx.updateEntry('languages', l.id, { lang: v })} placeholder="Ngoại ngữ" />
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} onClick={() => ctx.updateEntry('languages', l.id, { level: i })}
            style={{ width: 18, height: 4, borderRadius: 2, background: l.level >= i ? accentColor : '#e7e5e4', cursor: 'pointer' }}
          />
        ))}
      </div>
      <button onClick={() => ctx.removeEntry('languages', l.id)} className="ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa">✕</button>
    </div>
  );
}

// ─── Pagination helper ────────────────────────────────────────────────────────

/**
 * Given an array of measured section heights, distribute them into pages.
 * Returns an array of arrays of section indices, one array per page.
 *
 * @param heights      - height (px) of each section
 * @param firstAvail   - available content height on the FIRST page (header takes some space)
 * @param restAvail    - available content height on subsequent pages
 */
export function paginateSections(
  heights: number[],
  firstAvail: number,
  restAvail: number,
): number[][] {
  const pages: number[][] = [];
  let currentPage: number[] = [];
  let remaining = firstAvail;

  heights.forEach((h, i) => {
    // If section doesn't fit on the current page AND the page is non-empty, start a new page
    if (h > remaining && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      remaining = restAvail;
    }
    currentPage.push(i);
    remaining -= h;
  });

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}
// ─── Item-level pagination types & engine ─────────────────────────────────────

export type RenderUnit =
  | { kind: 'section-header'; sectionKey: string; title: string }
  | { kind: 'item'; sectionKey: string; node: React.ReactNode };

/**
 * Item-level paginator — cho phép split section theo từng item.
 *
 * Rules:
 *  - section-header không đứng một mình ở cuối trang (orphan header)
 *  - khi item bị đẩy sang trang mới → lặp lại header của section đó
 *  - nếu 1 item cao hơn cả trang → vẫn đặt vào (không thể split nhỏ hơn)
 *
 * @param units      - danh sách flat render units (header + items xen kẽ)
 * @param heights    - chiều cao đo được của từng unit (index tương ứng)
 * @param firstAvail - available height trang đầu (trừ CV header)
 * @param restAvail  - available height các trang sau
 */
export function paginateUnits(
  units: RenderUnit[],
  heights: number[],
  firstAvail: number,
  restAvail: number,
): RenderUnit[][] {
  const pages: RenderUnit[][] = [[]];
  let remaining = firstAvail;

  // track header hiện tại và height của nó để lặp lại khi cần
  let currentHeaderUnit: Extract<RenderUnit, { kind: 'section-header' }> | null = null;
  let currentHeaderH = 0;

  const pushNewPage = () => {
    pages.push([]);
    remaining = restAvail;
  };

  units.forEach((unit, i) => {
    const h = heights[i] ?? 0;

    if (unit.kind === 'section-header') {
      // Nhớ header hiện tại để lặp lại nếu cần
      currentHeaderUnit = unit;
      currentHeaderH = h;

      // Orphan guard: header + ít nhất 1 item tiếp theo phải cùng trang
      const nextH = heights[i + 1] ?? 0;
      if (h + nextH > remaining && pages[pages.length - 1].length > 0) {
        pushNewPage();
      }

      pages[pages.length - 1].push(unit);
      remaining -= h;
      return;
    }

    // kind === 'item'
    if (h > remaining && pages[pages.length - 1].length > 0) {
      pushNewPage();

      // Lặp lại header của section trên trang mới
      if (currentHeaderUnit) {
        pages[pages.length - 1].push(currentHeaderUnit);
        remaining -= currentHeaderH;
      }
    }

    pages[pages.length - 1].push(unit);
    remaining -= h;
  });

  return pages;
}

// ─── Layouts: see SingleColumnLayout.tsx and SidebarLeftLayout.tsx ────────────

// ─── Main exported component ──────────────────────────────────────────────────

const DEFAULT_SIDE_KEYS = ['skills', 'languages', 'awards'];

export function CVTemplate({
  data,
  order,
  style,
  layoutType = 'single-column',
  sideKeys = DEFAULT_SIDE_KEYS,
  sectionLayout: sectionLayoutProp = {},
  zoom = 100,
}: CVTemplateProps) {
  const theme = resolveTheme(style);
  const fontFamily = resolveFontFamily(style);
  const lh = LH_MAP[style.lineHeight] || 1.65;
  const fs = style.fontSize || 13;

  // Read sectionLayout from store so patchSectionLayout updates are reactive.
  // Fall back to the prop (e.g. read-only preview) when no store value exists.
  const sectionLayoutStore = useCvEditorStore(s => s.sectionLayout);
  const sectionLayout = Object.keys(sectionLayoutStore).length > 0 ? sectionLayoutStore : sectionLayoutProp;

  const personalStyle = sectionLayout.personal?.style ?? 'default';
  const align = style.nameAlign || 'left';
  const accentColor = theme.primary;

  const updatePersonalInfo = useCvEditorStore(s => s.updatePersonalInfo);
  const updateEntry = useCvEditorStore(s => s.updateEntry);
  const addEntry = useCvEditorStore(s => s.addEntry);
  const removeEntry = useCvEditorStore(s => s.removeEntry);
  const addSkill = useCvEditorStore(s => s.addSkill);
  const removeSkill = useCvEditorStore(s => s.removeSkill);
  const updateSkill = useCvEditorStore(s => s.updateSkill);
  const reorderEntry = useCvEditorStore(s => s.reorderEntry);
  const reorderSkills = useCvEditorStore(s => s.reorderSkills);
  const reorderSection = useCvEditorStore(s => s.reorderSection);
  const reorderSideKey = useCvEditorStore(s => s.reorderSideKey);
  const moveSectionToZone = useCvEditorStore(s => s.moveSectionToZone);
  const patchSectionLayout = useCvEditorStore(s => s.patchSectionLayout);

  const ctx: RenderCtx = {
    style, fs, lh, accentColor, textColor: style.textColor, sectionLayout,
    updatePersonalInfo, updateEntry, addEntry, removeEntry,
    addSkill, removeSkill, updateSkill, reorderEntry, reorderSkills,
    reorderSection, reorderSideKey, moveSectionToZone, patchSectionLayout,
  };

  const layoutProps = {
    data, order, ctx, theme, style, fontFamily, align, fs, lh, zoom, textColor: style.textColor,
  };

  switch (layoutType) {
    case 'sidebar-left':
      return <SidebarLeftLayout {...layoutProps} sideKeys={sideKeys} />;
    case 'sidebar-right':
      return <SidebarRightLayout {...layoutProps} sideKeys={sideKeys} />;
    case 'executive-centered':
      return <ExecutiveCenteredLayout {...layoutProps} />;
    case 'tech-timeline':
      return <TechTimelineLayout {...layoutProps} />;
    case 'asymmetric':
      return <AsymmetricLayout {...layoutProps} sideKeys={sideKeys} />;
    case 'two-column':
      return <TwoColumnLayout {...layoutProps} sideKeys={sideKeys} />;
    case 'black-white':
      return <BlackWhiteLayout {...layoutProps} />;
    case 'single-column':
    default:
      return <SingleColumnLayout {...layoutProps} />;
  }
}