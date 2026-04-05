'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdEmail, MdLink, MdLocationOn, MdPhone } from 'react-icons/md';
import { CvData } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { EditableText } from '../shared/EditableText';
import {
  RenderCtx,
  SectionShell,
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  paginateSections,
  getScaledDragStyle,
  PAGE_HEIGHT_PX,
} from './CVTemplate';

// ─── Layout: single-column ────────────────────────────────────────────────────

export interface SingleColSection {
  key: string;
  title: string;
  content: React.ReactNode;
}

export function SingleColumnPage({
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
  sections: SingleColSection[];
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

  return (
    <div className="cv-paper" style={{ fontFamily, fontSize: fs, lineHeight: lh, width: 794 }}>
      {/* Header — only on first page */}
      {isFirst && (
        <div
          style={{
            padding: '36px 44px 28px',
            background: theme.dark,
            color: '#fff',
            textAlign: align as React.CSSProperties['textAlign'],
          }}
        >
          <div style={{ fontFamily, fontSize: fs * 2.2, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, lineHeight: 1.2 }}>
            <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên của bạn" />
          </div>
          <div style={{ fontSize: fs, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
            <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', justifyContent: justifyContact }}>
            <span style={{ fontSize: fs * 0.88, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdEmail size={11} /><EditableText value={data.personal.email || ''} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
            </span>
            <span style={{ fontSize: fs * 0.88, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdPhone size={11} /><EditableText value={data.personal.phone || ''} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
            </span>
            <span style={{ fontSize: fs * 0.88, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdLocationOn size={11} /><EditableText value={data.personal.location || ''} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
            </span>
            <span style={{ fontSize: fs * 0.88, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdLink size={11} /><EditableText value={data.personal.website || ''} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: isFirst ? '28px 44px 44px' : '44px 44px 44px' }}>
        {isFirst && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: fs * 0.84, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: accentColor,
                borderBottom: `2px solid ${accentColor}`, paddingBottom: 5, marginBottom: 12,
              }}
            >Giới thiệu</div>
            <div style={{ color: '#44403c', lineHeight: lh }}>
              <EditableText value={data.personal.summary || ''} onChange={(v) => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." multiline />
            </div>
          </div>
        )}
        {sections.map(({ key, title, content }, localIdx) => (
          <Draggable key={key} draggableId={`section-${key}`} index={startIndex + localIdx}>
            {(dp, snap) => (
              <div
                ref={dp.innerRef}
                {...dp.draggableProps}
                style={getScaledDragStyle(
                  { ...dp.draggableProps.style, marginBottom: 24 },
                  snap.isDragging,
                  scale,
                  706, // 794 - 44*2 padding
                )}
              >
                <SectionShell
                  dragHandleProps={dp.dragHandleProps}
                  isDragging={snap.isDragging}
                  accentColor={accentColor}
                  title={title}
                  fs={fs}
                >
                  {content}
                </SectionShell>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export function SingleColumnLayout({
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

  // Build flat list of all sections to render
  const allSections: SingleColSection[] = [];
  order.filter((k) => k !== 'personal').forEach((key) => {
    if (key === 'experiences') {
      allSections.push({ key, title: 'Kinh nghiệm làm việc', content: <ExperienceSection data={data} ctx={ctx} /> });
      return;
    }
    if (key === 'skills') {
      allSections.push({ key, title: 'Kỹ năng', content: <SkillsBlock data={data} ctx={ctx} dark={false} /> });
      return;
    }
    const sectionTitles: Record<string, string> = {
      education: 'Học vấn',
      projects: 'Dự án',
      awards: 'Chứng chỉ & Giải thưởng',
      languages: 'Ngoại ngữ',
    };
    const title = sectionTitles[key];
    if (!title) return;
    allSections.push({ key, title, content: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} /> });
  });

  const sectionKeys = allSections.map((s) => s.key);

  return (
    <>
      {/* Actual pageless output wrapped in section-level DnD */}
      <DragDropContext
        onDragEnd={(result: DropResult) => {
          if (!result.destination) return;
          if (result.destination.index === result.source.index) return;
          const fromKey = sectionKeys[result.source.index];
          const toKey = sectionKeys[result.destination.index];
          if (fromKey && toKey) ctx.reorderSection(fromKey, toKey);
        }}
      >
        <Droppable droppableId="sections-main">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="cv-pages-wrapper">
              <SingleColumnPage
                key="pageless"
                isFirst={true}
                startIndex={0}
                sections={allSections}
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
