import React, { useState } from 'react'; // Refreshed
import { MdDragIndicator } from 'react-icons/md';
import {
  Briefcase,
  GraduationCap,
  Zap,
  Languages,
  Award,
  FileBadge,
  Folder,
  User,
} from 'lucide-react';
export type { RenderCtx } from '@/types/cvEditor';
import { CvData, SectionLayoutConfig, SkillEntry, StyleConfig, ExperienceEntry, EducationEntry, ProjectEntry, AwardEntry, LanguageEntry, RenderCtx } from '@/types/cvEditor';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { EditableText } from '../../shared/EditableText';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

export const PAGE_HEIGHT_PX = 1123;

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

// --- Helper for Lucide Icons ---
const ICON_MAP: Record<string, React.FC<{ size: number; color: string; strokeWidth: number }>> = {
  '💼': Briefcase, 'experience': Briefcase, 'experiences': Briefcase,
  '🎓': GraduationCap, 'education': GraduationCap,
  '⚡': Zap, 'skills': Zap,
  '🌐': Languages, 'languages': Languages,
  '🏆': Award, 'awards': Award,
  '📜': FileBadge, 'certifications': FileBadge,
  '📂': Folder, 'projects': Folder,
  '👤': User, 'personal': User,
};

const getLucideIcon = (iconName: string | undefined, size: number, color: string) => {
  if (!iconName) return null;
  const IconComponent = ICON_MAP[iconName];
  if (IconComponent) {
    return <IconComponent size={size} color={color} strokeWidth={2.5} />;
  }
  // Fallback: emoji hoặc tên không nhận ra
  return <span style={{ fontSize: size }}>{iconName}</span>;
};

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
  style: localStyle,
  onTitleChange,
  icon,
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
  style?: StyleConfig;
  onTitleChange?: (v: string) => void;
  icon?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const titleColor = dark ? 'rgba(255,255,255,0.9)' : accentColor;
  const borderColor = dark ? 'rgba(255,255,255,0.3)' : accentColor;
  const globalStyle = useCvEditorStore(s => s.style);
  const style = localStyle || globalStyle;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 4,
        outline: (hovered || isDragging) ? '1px dashed #3b82f6aa' : 'none',
        outlineOffset: 4,
        transition: 'outline 0.15s ease',
        marginBottom: 12,
        background: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, 
        borderBottom: (style.title?.border !== 'none' && style.title?.border !== 'left' && style.title?.border !== 'top') ? `${style.title?.borderSize || '1px'} solid ${borderColor}` : 'none',
        borderLeft: style.title?.border === 'left' ? `${style.title?.borderSize || '4px'} solid ${borderColor}` : 'none',
        borderTop: style.title?.border === 'top' ? `${style.title?.borderSize || '2px'} solid ${borderColor}` : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          <span
            style={{
              fontSize: fs * 1.1,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: titleColor,
              paddingLeft: style.title?.border === 'left' ? 10 : 0,
              paddingTop: style.title?.border === 'top' ? 8 : 0,
              paddingBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {icon && (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {getLucideIcon(icon, fs * 1.2, titleColor)}
              </span>
            )}
            <EditableText value={title} onChange={onTitleChange} placeholder="Tiêu đề section" />
          </span>
          <span
            {...(dragHandleProps ?? {})}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'grab',
              color: '#d1d5db',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.15s',
            }}
            title="Kéo để sắp xếp mục"
          >
            <MdDragIndicator size={16} />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {styleControls && (
            <div style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
              {styleControls}
            </div>
          )}
          {addButton && (
            <div style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
              {addButton}
            </div>
          )}
        </div>
      </div>
      <div style={{ paddingLeft: 0 }}>{children}</div>
    </div>
  );
}

export function CustomSection({
  section,
  ctx,
}: {
  section: CvData['customSections'][0];
  ctx: RenderCtx;
}) {
  const { fs, lh, accentColor } = ctx;
  const titleStyle = { fontSize: fs * 1.05, fontWeight: 700, color: '#1c1917' };
  const subStyle = { fontSize: fs * 0.9, color: '#57534e', fontStyle: 'italic' as const, marginBottom: 3 };
  const descStyle = { fontSize: fs * 0.9, color: '#57534e', lineHeight: lh };
  const dateStyle = { fontSize: fs * 0.82, color: '#a8a29e', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' as const };

  const config = section.fieldConfig || {
    showSubtitle: true,
    showDateRange: true,
    showDescription: true,
  };

  const type = section.sectionType || 'list';

  if (!section.items?.length) {
    return (
      <div className="flex h-6 flex-col relative group pb-4 cursor-pointer" onClick={() => ctx.addCustomSectionItem(section.id)}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200 pointer-events-none shadow-sm">+ Thêm mục</button>
        </div>
      </div>
    );
  }

  // 1. Tags Layout
  if (type === 'tags') {
    return (
      <div className="flex flex-wrap gap-2 relative group pb-4">
        {section.items.map((item) => (
          <div key={item.id} className="group/item relative flex items-center bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
            <span style={{ fontSize: fs * 0.9, fontWeight: 500, color: '#44403c' }}>
              <EditableText
                value={item.title}
                onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { title: v })}
                placeholder="Skill/Tag"
              />
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); ctx.removeCustomSectionItem(section.id, item.id); }}
              className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100"
            >✕</button>
          </div>
        ))}
        <button onClick={() => ctx.addCustomSectionItem(section.id)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-200 opacity-0 group-hover:opacity-100">+</button>
      </div>
    );
  }

  // 2. Text/Paragraph Layout (Simple list but optimized for description)
  if (type === 'text') {
    return (
      <div className="flex flex-col gap-3 relative group pb-4">
        {section.items.map((item) => (
          <div key={item.id} className="group/item relative">
            <div style={descStyle}>
              <EditableText
                value={item.description}
                onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { description: v })}
                placeholder="Đoạn văn tự do..."
                multiline
              />
            </div>
            <button
              onClick={() => ctx.removeCustomSectionItem(section.id, item.id)}
              className="absolute -top-2 -right-2 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 bg-white shadow-sm rounded-full"
            >✕</button>
          </div>
        ))}
      </div>
    );
  }

  // 3. Grid Layout
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-4 relative group pb-4">
        {section.items.map((item) => (
          <div key={item.id} className="group/item relative border border-gray-100 p-3 rounded-lg bg-white/50">
            <div style={titleStyle} className="mb-1">
              <EditableText
                value={item.title}
                onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { title: v })}
                placeholder="Tiêu đề"
              />
            </div>
            {config.showSubtitle && (
              <div style={subStyle}>
                <EditableText
                  value={item.subtitle}
                  onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { subtitle: v })}
                  placeholder="Phụ đề"
                />
              </div>
            )}
            <button
              onClick={() => ctx.removeCustomSectionItem(section.id, item.id)}
              className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 p-1 text-red-400"
            >✕</button>
          </div>
        ))}
      </div>
    );
  }

  // 4. Default / List / Timeline Layout
  return (
    <div className="flex flex-col gap-2 relative group pb-4">
      {section.items.map((item) => (
        <div key={item.id} className="group/item relative flex">
          <div className="flex-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
              <span style={titleStyle}>
                <EditableText
                  value={item.title}
                  onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { title: v })}
                  placeholder="Tiêu đề mục"
                />
              </span>
              {config.showDateRange && (
                <span style={dateStyle}>
                  <EditableText
                    value={item.dateRange}
                    onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { dateRange: v })}
                    placeholder="Thời gian"
                  />
                </span>
              )}
            </div>
            {config.showSubtitle && (
              <div style={subStyle}>
                <EditableText
                  value={item.subtitle}
                  onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { subtitle: v })}
                  placeholder="Phụ đề (Công ty, địa điểm...)"
                />
              </div>
            )}
            {config.showDescription && (
              <div style={descStyle}>
                <EditableText
                  value={item.description}
                  onChange={(v) => ctx.updateCustomSectionItem(section.id, item.id, { description: v })}
                  placeholder="Mô tả chi tiết"
                  multiline
                />
              </div>
            )}
          </div>
          <button
            onClick={() => ctx.removeCustomSectionItem(section.id, item.id)}
            className="absolute top-0 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 rounded"
            title="Xóa"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
