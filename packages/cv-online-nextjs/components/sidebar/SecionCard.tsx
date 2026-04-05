import React from 'react';
import {
  MdCode,
  MdDragIndicator,
  MdEmojiEvents,
  MdLanguage,
  MdPerson,
  MdSchool,
  MdStar,
  MdWork,
  MdVisibilityOff,
  MdVerified,
  MdGroups,
  MdInterests,
  MdVolunteerActivism,
} from 'react-icons/md';

// ─── Section metadata ───
export const SECTION_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; iconColor: string }
> = {
  personal:       { label: 'Thông tin',      icon: <MdPerson />,            color: '#dbeafe', iconColor: '#2563eb' },
  experiences:    { label: 'Kinh nghiệm',    icon: <MdWork />,              color: '#dcfce7', iconColor: '#16a34a' },
  education:      { label: 'Học vấn',        icon: <MdSchool />,            color: '#fef3c7', iconColor: '#d97706' },
  skills:         { label: 'Kỹ năng',        icon: <MdStar />,              color: '#fce7f3', iconColor: '#db2777' },
  projects:       { label: 'Dự án',          icon: <MdCode />,              color: '#ede9fe', iconColor: '#7c3aed' },
  awards:         { label: 'Giải thưởng',    icon: <MdEmojiEvents />,       color: '#fff7ed', iconColor: '#ea580c' },
  certifications: { label: 'Chứng chỉ',      icon: <MdVerified />,          color: '#ecfdf5', iconColor: '#059669' },
  languages:      { label: 'Ngoại ngữ',      icon: <MdLanguage />,          color: '#e0f2fe', iconColor: '#0284c7' },
  references:     { label: 'Tham chiếu',     icon: <MdGroups />,            color: '#f0fdf4', iconColor: '#15803d' },
  interests:      { label: 'Quan tâm',       icon: <MdInterests />,         color: '#fdf4ff', iconColor: '#a21caf' },
  activities:     { label: 'Hoạt động',      icon: <MdVolunteerActivism />, color: '#fff1f2', iconColor: '#be123c' },
};

// ─── Sections that must never be hidden ───
export const REQUIRED_SECTIONS = ['personal'];

interface SectionCardProps {
  sectionKey: string;
  isDragging: boolean;
  isDragOver: boolean;
  /** If true, hide button is not rendered and drag-to-hide is blocked */
  isRequired?: boolean;
  onHide: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver:  (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export function SectionCard({
  sectionKey,
  isDragging,
  isDragOver,
  isRequired = false,
  onHide,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
}: SectionCardProps) {
  const meta = SECTION_META[sectionKey];
  if (!meta) return null;

  return (
    <div
      className={`sc-card${isDragging ? ' dragging' : ''}${isDragOver ? ' drag-over' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="sc-drag" title="Kéo để sắp xếp">
        <MdDragIndicator size={15} />
      </div>
      <div className="sc-icon" style={{ background: meta.color, color: meta.iconColor }}>
        {meta.icon}
      </div>
      <span className="sc-label">{meta.label}</span>
      {/* Fix #7 — hide button not shown for required sections */}
      {!isRequired && (
        <button
          className="sc-hide"
          title="Ẩn mục này"
          onClick={(e) => { e.stopPropagation(); onHide(); }}
        >
          <MdVisibilityOff size={14} />
        </button>
      )}
    </div>
  );
}