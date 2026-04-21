import React, { useState } from 'react';

// ─── SideSection (for Modern template sidebar) ───
interface SideSectionProps {
  title: string;
  children: React.ReactNode;
  addButton?: React.ReactNode;
  dragHandleProps?: any;
  titleColor?: string;
  borderColor?: string;
  styleControls?: React.ReactNode;
}

export function SideSection({ title, children, addButton, dragHandleProps, titleColor, borderColor, styleControls }: SideSectionProps) {
  const [hovered, setHovered] = useState(false);
  const finalTitleColor = titleColor || 'rgba(255,255,255,0.5)';
  const finalBorderColor = borderColor || 'rgba(255,255,255,0.15)';

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
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: finalTitleColor,
          marginBottom: 8,
          paddingBottom: 5,
          borderBottom: `1px solid ${finalBorderColor}`,
          cursor: dragHandleProps ? 'grab' : 'default',
        }}
      >
        <span>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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