import React from 'react';

// ─── SideSection (for Modern template sidebar) ───
interface SideSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SideSection({ title, children }: SideSectionProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 8,
          paddingBottom: 5,
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {title}
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