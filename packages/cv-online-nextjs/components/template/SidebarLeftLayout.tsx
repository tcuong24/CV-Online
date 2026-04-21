'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdEmail, MdLink, MdLocationOn, MdPhone } from 'react-icons/md';
import { MdDragIndicator } from 'react-icons/md';
import { CvData } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { EditableText } from '../shared/EditableText';
import { SideSection } from '../shared/TemplatePart';
import {
  RenderCtx,
  SectionShell,
  StylePicker,
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  paginateSections,
  getScaledDragStyle,
  PAGE_HEIGHT_PX,
} from './CVTemplate';


// ─── Layout: sidebar-left ─────────────────────────────────────────────────────

export interface SidebarSection {
  key: string;
  content: React.ReactNode;
}

export function SidebarLeftPage({
  mainSections,
  sideSections,
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
  mainSections: ({ key: string; title: string; content: React.ReactNode; addButton?: React.ReactNode; styleControls?: React.ReactNode })[];
  sideSections: SidebarSection[];
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
  const initials = (data.personal.name || '??')
    .split(' ')
    .slice(-2)
    .map((w: string) => w[0])
    .join('');
  const avatarMargin = align === 'center' ? '0 auto 14px' : '0 0 14px';
  const titleAlign = ctx.sectionLayout.global?.headerAlign || 'left';
  const borderStyle = ctx.sectionLayout.global?.headerBorder || 'bottom';
  console.log(data);
  
  return (
    <div
      className="cv-paper"
      style={{
        display: 'grid',
        gridTemplateColumns: '190px 1fr',
        fontFamily,
        fontSize: fs,
        lineHeight: lh,
      }}
    >
      {/* Sidebar */}
      <div style={{ background: accentColor, padding: '28px 18px', color: '#fff' }}>
        {isFirst && (
          <>
            {data.personal.avatarUrl ? (
              <img
                src={data.personal.avatarUrl}
                alt={data.personal.name}
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  objectFit: 'cover',
                  margin: avatarMargin,
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 700,
                  border: '3px solid rgba(255,255,255,0.3)',
                  margin: avatarMargin,
                }}
              >
                {initials}
              </div>
            )}
            
            <div style={{ fontSize: fs * 1.3, fontWeight: 700, lineHeight: 1.3, marginBottom: 3, textAlign: align as React.CSSProperties['textAlign'] }}>
              <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên của bạn" />
            </div>
            <div style={{ fontSize: fs * 0.85, color: 'rgba(255,255,255,0.65)', marginBottom: 18, textAlign: align as React.CSSProperties['textAlign'] }}>
              <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
            </div>

            {/* Contact */}
            <SideSection title="Liên hệ">
              <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdEmail size={10} /><EditableText value={data.personal.email || ''} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
              </div>
              <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdPhone size={10} /><EditableText value={data.personal.phone || ''} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
              </div>
              <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdLocationOn size={10} /><EditableText value={data.personal.location || ''} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
              </div>
              <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdLink size={10} /><EditableText value={data.personal.website || ''} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
              </div>
            </SideSection>
          </>
        )}

        {/* Sidebar sections — draggable */}
        <Droppable droppableId="sections-sidebar">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sideSections.map(({ key, content }, idx) => (
                <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                  {(dp, snap) => (
                    <div
                      ref={dp.innerRef}
                      {...dp.draggableProps}
                      style={getScaledDragStyle(
                        { ...dp.draggableProps.style, opacity: snap.isDragging ? 0.8 : 1 },
                        snap.isDragging,
                        scale,
                        154, // 190 sidebar - 18*2 padding
                      )}
                      className="group/sidesec"
                    >
                      <div style={{ position: 'relative' }}>
                        <span
                          {...(dp.dragHandleProps ?? {})}
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'grab',
                            color: 'rgba(255,255,255,0.6)',
                            zIndex: 1,
                          }}
                          title="Kéo để sắp xếp"
                          className="opacity-0 group-hover/sidesec:opacity-100 transition-opacity"
                        >
                          <MdDragIndicator size={12} />
                        </span>
                        {content}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Main content */}
      <div style={{ padding: '28px 26px' }}>
        {isFirst && (
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                fontSize: fs * 0.84, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: accentColor,
                textAlign: titleAlign === 'center' ? 'center' : 'left',
                borderBottom: borderStyle === 'bottom' ? `2px solid ${accentColor}` : 'none',
                paddingBottom: borderStyle !== 'none' ? 5 : 0, 
                marginBottom: borderStyle !== 'none' ? 12 : 6,
                borderLeft: borderStyle === 'left' ? `4px solid ${accentColor}` : 'none',
                paddingLeft: borderStyle === 'left' ? 8 : 0,
              }}
            >Giới thiệu</div>
            <div style={{ color: '#57534e', lineHeight: lh }}>
              <EditableText value={data.personal.summary || ''} onChange={(v) => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." multiline />
            </div>
          </div>
        )}
        <Droppable droppableId="sections-main">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {mainSections.map(({ key, title, content, addButton, styleControls }, idx) => (
                <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                  {(dp, snap) => (
                    <div
                      ref={dp.innerRef}
                      {...dp.draggableProps}
                      style={getScaledDragStyle(
                        dp.draggableProps.style,
                        snap.isDragging,
                        scale,
                        552, // 794 - 190 sidebar - 26*2 padding
                      )}
                    >
                      <SectionShell
                        dragHandleProps={dp.dragHandleProps}
                        isDragging={snap.isDragging}
                        accentColor={accentColor}
                        title={title}
                        fs={fs}
                        addButton={addButton}
                        styleControls={styleControls}
                      >
                        {content}
                      </SectionShell>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

export function SidebarLeftLayout({
  data,
  order,
  ctx,
  theme,
  fontFamily,
  align,
  fs,
  lh,
  sideKeys,
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
  sideKeys: string[];
  zoom?: number;
}) {
  const accentColor = theme.primary;
  const scale = zoom / 100;
  const isPersonal = (k: string) => k === 'personal' || k === 'personalInfo';
  const mainKeyList = order.filter((k) => !isPersonal(k) && !sideKeys.includes(k));

  // Helpers for add button and style switcher
  const makeAddBtn = (key: string, label: string, action: () => void, hasData: boolean) =>
    hasData ? (
      <button
        onClick={action}
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
          whiteSpace: 'nowrap' as const,
          fontFamily: 'inherit',
        }}
      >{label}</button>
    ) : undefined;

  // Build main sections list
  const allMainSections: { key: string; title: string; content: React.ReactNode; addButton?: React.ReactNode; styleControls?: React.ReactNode }[] = [];
  mainKeyList.forEach((key) => {
    if (key === 'experiences') {
      const expStyle = ctx.sectionLayout.experiences?.style ?? 'timeline';
      allMainSections.push({
        key,
        title: 'Kinh nghiệm',
        content: <ExperienceSection data={data} ctx={ctx} variant="main" />,
        addButton: makeAddBtn(key, '+ Kinh nghiệm', () => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' }), !!data.experiences?.length),
        styleControls: (
          <StylePicker
            fs={fs}
            value={expStyle}
            options={[{ value: 'timeline', label: 'Timeline' }, { value: 'simple', label: 'Simple' }]}
            onChange={(v) => ctx.patchSectionLayout('experiences', { style: v })}
          />
        ),
      });
      return;
    }
    if (key === 'skills') {
      const profStyle = ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags';
      allMainSections.push({
        key,
        title: 'Kỹ năng',
        content: <SkillsBlock data={data} ctx={ctx} dark={true} />,
        addButton: makeAddBtn(key, '+ Kỹ năng', () => ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' }), !!data.skills?.length),
        styleControls: (
          <StylePicker
            fs={fs}
            value={profStyle}
            options={[{ value: 'tags', label: 'Tags' }, { value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' }]}
            onChange={(v) => ctx.patchSectionLayout('skills', { proficiencyStyle: v })}
          />
        ),
      });
      return;
    }
    const titles: Record<string, string> = {
      education: 'Học vấn',
      projects: 'Dự án',
      awards: 'Giải thưởng',
      languages: 'Ngoại ngữ',
      certifications: 'Chứng chỉ',
      references: 'Tham chiếu',
      interests: 'Sở thích',
      activities: 'Hoạt động',
    };
    const addActions: Record<string, { label: string; action: () => void; hasData: boolean }> = {
      education: { label: '+ Học vấn', action: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }), hasData: !!data.education?.length },
      projects:  { label: '+ Dự án',   action: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }), hasData: !!data.projects?.length },
      awards:    { label: '+ Giải thưởng', action: () => ctx.addEntry('awards', { title: '', year: '', org: '' }), hasData: !!data.awards?.length },
      languages: { label: '+ Ngôn ngữ', action: () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }), hasData: !!data.languages?.length },
      certifications: { label: '+ Chứng chỉ', action: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', description: '' }), hasData: !!data.certifications?.length },
    };
    const title = titles[key];
    if (!title) return;
    const add = addActions[key];
    allMainSections.push({
      key,
      title,
      content: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />,
      addButton: add ? makeAddBtn(key, add.label, add.action, add.hasData) : undefined,
    });
  });

  // ── Shared sidebar button style ──────────────────────────────────────────
  const sideBtnStyle: React.CSSProperties = {
    padding: '1px 6px',
    fontSize: 8,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 99,
    cursor: 'pointer',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'inherit',
  };
  const sideDeleteStyle: React.CSSProperties = {
    padding: '0 4px',
    fontSize: 9,
    border: 'none',
    borderRadius: 3,
    cursor: 'pointer',
    background: 'transparent',
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1,
    fontFamily: 'inherit',
  };

  // Build sidebar sections list
  const sideSectionNodes: SidebarSection[] = sideKeys.flatMap((key) => {
    if (key === 'skills') {
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' })}>
          + Thêm
        </button>
      );
      return [{ key, content: <SideSection key={key} title="Kỹ năng" addButton={addBtn}><SkillsBlock data={data} ctx={ctx} dark={true} /></SideSection> }];
    }

    if (key === 'languages') {
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addEntry('languages', { lang: 'Ngôn ngữ mới', level: 1 })}>
          + Thêm
        </button>
      );
      return [{
        key, content: (
          <SideSection key={key} title="Ngoại ngữ" addButton={addBtn}>
            {data.languages?.map((l) => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)' }}>{l.lang || 'Ngôn ngữ'}</div>
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, background: l.level >= i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
                    ))}
                  </div>
                </div>
                <button style={sideDeleteStyle} onClick={() => ctx.removeEntry('languages', l.id)} title="Xóa">✕</button>
              </div>
            ))}
          </SideSection>
        ),
      }];
    }

    if (key === 'awards') {
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addEntry('awards', { title: '', year: '', org: '' })}>
          + Thêm
        </button>
      );
      return [{
        key, content: (
          <SideSection key={key} title="Chứng chỉ" addButton={addBtn}>
            {data.awards?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{e.title || 'Tên chứng chỉ'}</div>
                  <div style={{ opacity: 0.7, fontSize: fs * 0.78, color: 'rgba(255,255,255,0.7)' }}>{e.org || 'Tổ chức'} · {e.year || 'Năm'}</div>
                </div>
                <button style={sideDeleteStyle} onClick={() => ctx.removeEntry('awards', e.id)} title="Xóa">✕</button>
              </div>
            ))}
          </SideSection>
        ),
      }];
    }

    if (key === 'education') {
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' })}>
          + Thêm
        </button>
      );
      return [{
        key, content: (
          <SideSection key={key} title="Học vấn" addButton={addBtn}>
            {data.education?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{e.degree || 'Chuyên ngành'}</div>
                  <div style={{ fontSize: fs * 0.78, color: 'rgba(255,255,255,0.65)' }}>{e.school || 'Trường'}</div>
                  {(e.from || e.to) && <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.45)' }}>{e.from} – {e.to}</div>}
                </div>
                <button style={sideDeleteStyle} onClick={() => ctx.removeEntry('education', e.id)} title="Xóa">✕</button>
              </div>
            ))}
          </SideSection>
        ),
      }];
    }

    if (key === 'projects') {
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' })}>
          + Thêm
        </button>
      );
      return [{
        key, content: (
          <SideSection key={key} title="Dự án" addButton={addBtn}>
            {data.projects?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{e.name || 'Tên dự án'}</div>
                  {e.tech && <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.55)' }}>{e.tech}</div>}
                </div>
                <button style={sideDeleteStyle} onClick={() => ctx.removeEntry('projects', e.id)} title="Xóa">✕</button>
              </div>
            ))}
          </SideSection>
        ),
      }];
    }

    if (key === 'experiences') {
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' })}>
          + Thêm
        </button>
      );
      return [{
        key, content: (
          <SideSection key={key} title="Kinh nghiệm" addButton={addBtn}>
            {data.experiences?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{e.title || 'Vị trí'}</div>
                  <div style={{ fontSize: fs * 0.78, color: 'rgba(255,255,255,0.65)' }}>{e.company || 'Công ty'}</div>
                  {(e.from || e.to) && <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.45)' }}>{e.from} – {e.to}</div>}
                </div>
                <button style={sideDeleteStyle} onClick={() => ctx.removeEntry('experiences', e.id)} title="Xóa">✕</button>
              </div>
            ))}
          </SideSection>
        ),
      }];
    }

    // Generic fallback — section key không được nhận diện
    return [];
  });

  const mainKeys = allMainSections.map((s) => s.key);

  return (
    <>
      {/* DragDropContext bao ngoài — xử lý cả main và sidebar zones */}
      <DragDropContext
        onDragEnd={(result: DropResult) => {
          if (!result.destination) return;
          const { source, destination, draggableId } = result;
          if (source.droppableId === destination.droppableId && source.index === destination.index) return;
          const fromKey = draggableId.replace('section-', '');

          if (source.droppableId === 'sections-main' && destination.droppableId === 'sections-main') {
            const toKey = mainKeys[destination.index];
            if (toKey) ctx.reorderSection(fromKey, toKey);
          } else if (source.droppableId === 'sections-sidebar' && destination.droppableId === 'sections-sidebar') {
            const toKey = sideKeys[destination.index];
            if (toKey) ctx.reorderSideKey(fromKey, toKey);
          } else if (source.droppableId === 'sections-main' && destination.droppableId === 'sections-sidebar') {
            ctx.moveSectionToZone(fromKey, true);
          } else if (source.droppableId === 'sections-sidebar' && destination.droppableId === 'sections-main') {
            ctx.moveSectionToZone(fromKey, false);
          }
        }}
      >
        <div className="cv-pages-wrapper">
          <SidebarLeftPage
            key="pageless"
            isFirst={true}
            mainSections={allMainSections}
            sideSections={sideSectionNodes}
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
        </div>
      </DragDropContext>
    </>
  );
}
