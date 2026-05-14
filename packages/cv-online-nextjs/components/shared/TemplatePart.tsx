import React, { useState } from 'react';
import { EditableText } from './EditableText';

// ─── SideSection (for Modern template sidebar) ───
interface SideSectionProps {
  title: string;
  children: React.ReactNode;
  fontSize: number;
  addButton?: React.ReactNode;
  dragHandleProps?: any;
  titleColor?: string;
  borderColor?: string;
  styleControls?: React.ReactNode;
  sectionTitleBorder?: string;
  sectionTitleBorderSize?: string;
  onTitleChange?: (v: string) => void;
}

export function SideSection({
  title,
  children,
  fontSize,
  addButton,
  dragHandleProps,
  titleColor,
  borderColor,
  styleControls,
  sectionTitleBorder,
  sectionTitleBorderSize,
  onTitleChange,
}: SideSectionProps) {
  const [hovered, setHovered] = useState(false);
  const finalTitleColor = titleColor || 'rgba(255,255,255,0.5)';
  const finalBorderColor = borderColor || 'rgba(255,255,255,0.15)';
  const borderStyle = sectionTitleBorder || 'bottom';
  const borderSize = sectionTitleBorderSize || '1px';
  return (
    <div
      style={{ marginBottom: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        {...dragHandleProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: fontSize,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: finalTitleColor,
          marginBottom: 8,
          borderTop: borderStyle === 'top' ? `${borderSize} solid ${borderColor}` : 'none',
          paddingTop: borderStyle === 'top' ? 15 : 0,
          borderBottom: borderStyle === 'bottom' ? `${borderSize} solid ${borderColor}` : 'none',
          paddingBottom: borderStyle !== 'none' ? 2 : 0,
          borderLeft: borderStyle === 'left' ? `${sectionTitleBorderSize || '4px'} solid ${borderColor}` : 'none',
          paddingLeft: borderStyle === 'left' ? 8 : 0,
          cursor: dragHandleProps ? 'grab' : 'default',
        }}
      >
        <span>
          <EditableText 
            value={title} 
            
            onChange={onTitleChange} 
            placeholder="Tiêu đề" 
            className={`hover:bg-white/10 rounded px-0.5 transition-colors text-${titleColor}`}
          />
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 ,marginRight: 12 }}>
          {styleControls && (
            <div style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
              {styleControls}
            </div>
          )}
          {addButton && (
            <span style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', pointerEvents: hovered ? 'auto' : 'none' }}>
              {addButton}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── MainSection (for Modern template main area) ───
interface MainSectionProps {
  title: string;
  accentColor: string;
  fs: number;
  children: React.ReactNode;
}

export function MainSection({ title, accentColor, fs, children }: MainSectionProps) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontSize: fs * 0.92,
          fontWeight: 700,
          color: accentColor,
          marginBottom: 10,
          paddingBottom: 5,
          borderBottom: `2px solid ${accentColor}28`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}