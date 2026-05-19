'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdEmail, MdLink, MdLocationOn, MdPhone } from 'react-icons/md';
import { MdDragIndicator } from 'react-icons/md';
import { CvData, StyleConfig } from '@/types/cvEditor';
import { FileText, User } from 'lucide-react';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { EditableText } from '../shared/EditableText';
import { SideSection } from '../shared/TemplatePart';
import {
  RenderCtx,
  SectionShell,
  CustomSection,
  getScaledDragStyle,
  PAGE_HEIGHT_PX,
} from './parts/SharedTemplateComponents';
import {
  StylePicker,
  ExperienceSection,
  SkillsBlock,
  LanguagesBlock,
  MainSectionBlocks,
  paginateSections,
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
  style
}: {
  mainSections: ({ key: string; title: string; icon?: string; content: React.ReactNode; addButton?: React.ReactNode; styleControls?: React.ReactNode; onTitleChange?: (v: string) => void })[];
  sideSections: SidebarSection[];
  isFirst: boolean;
  data: CvData;
  theme: { primary: string; dark: string; light: string; sidebar?: string };
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  accentColor: string;
  ctx: RenderCtx;
  scale: number;
  style: StyleConfig;
}) {
  const initials = (data.personal.name || '??')
    .split(' ')
    .slice(-2)
    .map((w: string) => w[0])
    .join('');
  const avatarMargin =  '0 auto 30px' ;
  const titleAlign = ctx.sectionLayout.global?.headerAlign || 'left';
  const borderStyle = ctx.sectionLayout.global?.headerBorder || 'bottom';
  const parts = (style.layout?.columnRatio || '30:70').split(':').map(Number);
  const sidePart = Math.min(parts[0], parts[1]);
  const mainPart = Math.max(parts[0], parts[1]);
  const gridColumns = `${sidePart}% ${mainPart}%`;
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      ctx.updatePersonalInfo({ avatarUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="cv-paper"
      style={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        fontFamily,
        fontSize: fs,
        lineHeight: lh,
      }}
    >
      {/* Sidebar */}
      <div style={{ background: style.colors?.background.sidebar === "gradient" ? style.colors.gradient : style.colors?.background.sidebar, padding: '28px 18px', color: '#fff' }}>
        {isFirst && (
          <>
            <div
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
              onClick={handleAvatarClick}
              className="relative mx-auto avatar-uploader"
              style={{
                width: 150, height: 150, borderRadius: '50%',
                margin: avatarMargin,
                display: 'block',
                cursor: 'pointer',
              }}
            >
              {data.personal.avatarUrl ? (
                <img
                  src={data.personal.avatarUrl}
                  alt={data.personal.name || "Avatar"}
                  style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s',
                    transform: isAvatarHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 700,
                    border: '3px solid rgba(255,255,255,0.3)',
                    transition: 'transform 0.2s',
                    transform: isAvatarHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {initials}
                </div>
              )}

              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity"
                style={{
                  borderRadius: '50%',
                  opacity: isAvatarHovered ? 1 : 0,
                }}
              >
                <span className="text-white text-xs font-semibold">Tải ảnh lên</span>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={avatarInputRef}
              onChange={handleFileChange}
            />
            {/* Contact */}
            <SideSection title={ctx.sectionLayout.personal?.title || "Liên hệ"} titleColor='#fff' fontSize={fs * 1.2} onTitleChange={(v) => ctx.patchSectionLayout('personal', { title: v })}>
              <div style={{ fontSize: fs * 1, color: '#fff', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdEmail size={10} /><EditableText scale={scale} value={data.personal.email || ''} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
              </div>
              <div style={{ fontSize: fs * 1, color: '#fff', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdPhone size={10} /><EditableText scale={scale} value={data.personal.phone || ''} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
              </div>
              <div style={{ fontSize: fs * 1, color: '#fff', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdLocationOn size={10} /><EditableText scale={scale} value={data.personal.location || ''} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
              </div>
              <div style={{ fontSize: fs * 1, color: '#fff', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdLink size={10} /><EditableText scale={scale} value={data.personal.website || ''} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
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
          <>
            <div style={{ textAlign: titleAlign as any, marginBottom: 8 }}>
              <EditableText
                scale={scale}
                value={data.personal.name || ''}
                onChange={(v) => ctx.updatePersonalInfo({ name: v })}
                placeholder="Họ Tên"
                className="font-bold tracking-tight"
                style={{ fontSize: fs * 2.2, color: accentColor }}
              />
            </div>
            <div style={{ fontSize: fs * 0.85, color: accentColor, marginBottom: 18, textAlign: titleAlign as any }}>
              <EditableText scale={scale} value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
            </div>
          </>
        )}

        <Droppable droppableId="sections-main">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {mainSections.map(({ key, title, icon, content, addButton, styleControls, onTitleChange }, idx) => (
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
                        icon={icon}
                        onTitleChange={onTitleChange}
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
  style,
  zoom = 100,
}: {
  data: CvData;
  order: string[];
  ctx: RenderCtx;
  theme: { primary: string; dark: string; light: string; sidebar?: string };
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  sideKeys: string[];
  style: StyleConfig;
  zoom?: number;
}) {
  const accentColor = style.colors?.accent || '#3b82f6';
  const scale = zoom / 100;
  const isPersonal = (k: string) => k === 'personal' || k === 'personalInfo';
  const mainKeyList = order.filter((k) => !isPersonal(k) && !sideKeys.includes(k));
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

  // ── Measurement refs for pagination ──
  const mainMeasureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideMeasureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Build main sections list
  const allMainSections: {
    key: string;
    title: string;
    icon?: string;
    content: React.ReactNode;
    addButton?: React.ReactNode;
    styleControls?: React.ReactNode;
    onTitleChange: (v: string) => void;
  }[] = [];
  mainKeyList.forEach((key) => {
    const titles: Record<string, string> = {
      experiences: 'Kinh nghiệm',
      skills: 'Kỹ năng',
      education: 'Học vấn',
      projects: 'Dự án',
      awards: 'Giải thưởng',
      languages: 'Ngoại ngữ',
      certifications: 'Chứng chỉ',
      references: 'Tham chiếu',
      interests: 'Sở thích',
      activities: 'Hoạt động',
    };

    // Resolve display title: Custom title from DB/Store > Default title
    const displayTitle = ctx.sectionLayout[key]?.title || titles[key] || key;
    const onTitleChange = (v: string) => ctx.patchSectionLayout(key, { title: v });

    if (key === 'experiences') {
      const expStyle = ctx.sectionLayout.experiences?.style ?? 'timeline';
      allMainSections.push({
        key,
        title: displayTitle,
        icon: ctx.sectionLayout[key]?.icon,
        onTitleChange,
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
      const addSkillAction = profStyle === 'grouped'
        ? () => {
          const existingCats = new Set(data.skills?.map(s => s.category?.trim()).filter(Boolean));
          let newCat = 'Danh mục mới';
          let idx = 1;
          while (existingCats.has(newCat)) newCat = `Danh mục mới ${idx++}`;
          ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: 'intermediate', proficiencyPercentage: 70, category: newCat });
        }
        : () => ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' });
      const addLabel = profStyle === 'grouped' ? '+ Danh mục' : '+ Kỹ năng';

      allMainSections.push({
        key,
        title: displayTitle,
        icon: ctx.sectionLayout[key]?.icon,
        onTitleChange,
        content: <SkillsBlock data={data} ctx={ctx} dark={false} />,
        addButton: makeAddBtn(key, addLabel, addSkillAction, !!data.skills?.length),
        styleControls: (
          <StylePicker
            fs={fs}
            value={profStyle}
            options={[{ value: 'tags', label: 'Tags' }, { value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' }, { value: 'grouped', label: 'Grouped' }]}
            onChange={(v) => ctx.patchSectionLayout('skills', { proficiencyStyle: v })}
          />
        ),
      });
      return;
    }

    if (key === 'languages') {
      const langStyle = ctx.sectionLayout.languages?.style ?? 'bars';
      allMainSections.push({
        key,
        title: displayTitle,
        icon: ctx.sectionLayout[key]?.icon,
        onTitleChange,
        content: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />,
        addButton: makeAddBtn(key, '+ Ngôn ngữ', () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }), !!data.languages?.length),
        styleControls: (
          <StylePicker
            fs={fs}
            value={langStyle}
            options={[
              { value: 'bars', label: 'Bars' },
              { value: 'dots', label: 'Dots' },
              { value: 'stars', label: 'Stars' },
              { value: 'text', label: 'Text only' }
            ]}
            onChange={(v) => ctx.patchSectionLayout('languages', { style: v })}
          />
        ),
      });
      return;
    }

    if (key === 'summary') {
      allMainSections.push({
        key,
        title: ctx.sectionLayout.summary?.title || displayTitle || 'Giới thiệu',
        icon: ctx.sectionLayout[key]?.icon,
        onTitleChange: (v) => ctx.patchSectionLayout('summary', { title: v }),
        content: (
          <div style={{ fontSize: fs * 0.92, color: '#44403c', lineHeight: lh }}>
            <EditableText scale={scale} value={data.personal.summary || ''} onChange={(v) => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." multiline />
          </div>
        ),
      });
      return;
    }

    // Handle Built-in Sections
    if (titles[key]) {
      const addActions: Record<string, { label: string; action: () => void; hasData: boolean }> = {
        education: { label: '+ Học vấn', action: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }), hasData: !!data.education?.length },
        projects: { label: '+ Dự án', action: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }), hasData: !!data.projects?.length },
        awards: { label: '+ Giải thưởng', action: () => ctx.addEntry('awards', { title: '', year: '', org: '' }), hasData: !!data.awards?.length },
        languages: { label: '+ Ngôn ngữ', action: () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }), hasData: !!data.languages?.length },
        certifications: { label: '+ Chứng chỉ', action: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', description: '' }), hasData: !!data.certifications?.length },
      };
      const add = addActions[key];
      allMainSections.push({
        key,
        title: displayTitle,
        icon: ctx.sectionLayout[key]?.icon,
        onTitleChange,
        content: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />,
        addButton: add ? makeAddBtn(key, add.label, add.action, add.hasData) : undefined,
      });
    }
    // Handle Custom Sections in Main
    else if (key.startsWith('custom-')) {
      const customSection = data.customSections?.find(cs => cs.id === key);
      if (customSection) {
        allMainSections.push({
          key,
          title: customSection.sectionTitle,
          icon: ctx.sectionLayout[key]?.icon,
          onTitleChange: (v) => ctx.updateCustomSection(customSection.id, { sectionTitle: v }),
          content: <CustomSection section={customSection} ctx={ctx} />,
          addButton: makeAddBtn(key, '+ Thêm', () => ctx.addCustomSectionItem(customSection.id), true),
        });
      }
    }
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
    if (key.startsWith('custom-')) {
      const customSection = data.customSections?.find(cs => cs.id === key);
      if (customSection) {
        const addBtn = (
          <button style={sideBtnStyle} onClick={() => ctx.addCustomSectionItem(customSection.id)}>
            + Thêm
          </button>
        );
        return [{
          key,
          content: (
            <SideSection
              key={key}
              title={customSection.sectionTitle}
              fontSize={fs * 1.2}
              addButton={addBtn}
              onTitleChange={(v) => ctx.updateCustomSection(customSection.id, { sectionTitle: v })}
            >
              <CustomSection section={customSection} ctx={ctx} />
            </SideSection>
          )
        }];
      }
    }

    // Built-in sections in sidebar
    const titles: Record<string, string> = {
      summary: 'Giới thiệu',
      skills: 'Kỹ năng',
      languages: 'Ngoại ngữ',
      awards: 'Chứng chỉ',
      education: 'Học vấn',
      projects: 'Dự án',
      experiences: 'Kinh nghiệm',
    };
    const displayTitle = ctx.sectionLayout[key]?.title || titles[key];

    if (key === 'summary') {
      return [{
        key,
        content: (
          <SideSection
            key={key}
            title={displayTitle}
            fontSize={fs * 1.2}
            titleColor='#fff'
            onTitleChange={(v) => ctx.patchSectionLayout('summary', { title: v })}
          >
            <div style={{ fontSize: fs * 0.88, color: 'rgba(255,255,255,0.85)', lineHeight: lh }}>
              <EditableText scale={scale} value={data.personal.summary || ''} onChange={(v) => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." multiline />
            </div>
          </SideSection>
        )
      }];
    }

    if (key === 'skills') {
      const profStyle = ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags';
      const addSideSkillAction = profStyle === 'grouped'
        ? () => {
          const existingCats = new Set(data.skills?.map(s => s.category?.trim()).filter(Boolean));
          let newCat = 'Danh mục mới';
          let idx = 1;
          while (existingCats.has(newCat)) newCat = `Danh mục mới ${idx++}`;
          ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: 'intermediate', proficiencyPercentage: 70, category: newCat });
        }
        : () => ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' });
      const addBtn = (
        <button style={sideBtnStyle} onClick={addSideSkillAction}>
          + Thêm
        </button>
      );
      return [{
        key,
        content: (
          <SideSection
            key={key}
            title={displayTitle}
            fontSize={fs * 1.2}
            titleColor='#fff'
            addButton={addBtn}
            styleControls={
              <StylePicker
                fs={fs}
                value={profStyle}
                options={[{ value: 'tags', label: 'Tags' }, { value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' }, { value: 'grouped', label: 'Grouped' }, { value: 'none', label: 'None' }]}
                onChange={(v) => ctx.patchSectionLayout('skills', { proficiencyStyle: v })}
              />
            }
            onTitleChange={(v) => ctx.patchSectionLayout(key, { title: v })}
          >
            <SkillsBlock data={data} ctx={ctx} dark={true} narrow={true} />
          </SideSection>
        )
      }];
    }

    if (key === 'languages') {
      const langStyle = ctx.sectionLayout.languages?.style ?? 'bars';
      const addBtn = (
        <button style={sideBtnStyle} onClick={() => ctx.addEntry('languages', { lang: 'Ngôn ngữ mới', level: 1 })}>
          + Thêm
        </button>
      );
      return [{
        key, content: (
          <SideSection
            key={key}
            title={displayTitle}
            fontSize={fs * 1.2}
            titleColor='#fff'
            addButton={addBtn}
            styleControls={
              <StylePicker
                fs={fs}
                value={langStyle}
                options={[
                  { value: 'bars', label: 'Bars' },
                  { value: 'dots', label: 'Dots' },
                  { value: 'stars', label: 'Stars' },
                  { value: 'text', label: 'Text only' }
                ]}
                onChange={(v) => ctx.patchSectionLayout('languages', { style: v })}
              />
            }
            onTitleChange={(v) => ctx.patchSectionLayout(key, { title: v })}
          >
            <LanguagesBlock data={data} ctx={ctx} dark={true} />
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
          <SideSection
            key={key}
            title={displayTitle}
            fontSize={fs * 1.2}
            titleColor='#fff'
            addButton={addBtn}
            onTitleChange={(v) => ctx.patchSectionLayout(key, { title: v })}
          >
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
          <SideSection
            key={key}
            title={displayTitle}
            addButton={addBtn}
            titleColor='#fff'
            fontSize={fs * 1.2}
            onTitleChange={(v) => ctx.patchSectionLayout(key, { title: v })}
          >
            {data.education?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    <EditableText scale={scale} value={e.degree || ''} onChange={(v) => ctx.updateEntry('education', e.id, { degree: v })} placeholder="Chuyên ngành" />
                  </div>
                  <div style={{ fontSize: fs * 0.78, color: 'rgba(255,255,255,0.65)' }}>
                    <EditableText scale={scale} value={e.school || ''} onChange={(v) => ctx.updateEntry('education', e.id, { school: v })} placeholder="Trường" />
                  </div>
                  <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.45)' }}>
                    <EditableText scale={scale} value={e.from || ''} onChange={(v) => ctx.updateEntry('education', e.id, { from: v })} placeholder="Bắt đầu" /> – <EditableText scale={scale} value={e.to || ''} onChange={(v) => ctx.updateEntry('education', e.id, { to: v })} placeholder="Kết thúc" />
                  </div>
                  <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', marginTop: 2 }}>
                    <EditableText scale={scale} value={e.desc || ''} onChange={(v) => ctx.updateEntry('education', e.id, { desc: v })} placeholder="Mô tả..." multiline />
                  </div>
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
          <SideSection
            key={key}
            title={displayTitle}
            addButton={addBtn}
            fontSize={fs * 0.75}
            onTitleChange={(v) => ctx.patchSectionLayout(key, { title: v })}
          >
            {data.projects?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    <EditableText scale={scale} value={e.name || ''} onChange={(v) => ctx.updateEntry('projects', e.id, { name: v })} placeholder="Tên dự án" />
                  </div>
                  <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.55)' }}>
                    <EditableText scale={scale} value={e.tech || ''} onChange={(v) => ctx.updateEntry('projects', e.id, { tech: v })} placeholder="Công nghệ" multiline />
                  </div>
                  <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', marginTop: 2 }}>
                    <EditableText scale={scale} value={e.desc || ''} onChange={(v) => ctx.updateEntry('projects', e.id, { desc: v })} placeholder="Mô tả dự án..." multiline />
                  </div>
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
          <SideSection
            key={key}
            title={displayTitle}
            addButton={addBtn}
            fontSize={fs * 0.75}
            onTitleChange={(v) => ctx.patchSectionLayout(key, { title: v })}
          >
            {data.experiences?.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs * 0.84, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    <EditableText scale={scale} value={e.title || ''} onChange={(v) => ctx.updateEntry('experiences', e.id, { title: v })} placeholder="Vị trí" />
                  </div>
                  <div style={{ fontSize: fs * 0.78, color: 'rgba(255,255,255,0.65)' }}>
                    <EditableText scale={scale} value={e.company || ''} onChange={(v) => ctx.updateEntry('experiences', e.id, { company: v })} placeholder="Công ty" />
                  </div>
                  <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.45)' }}>
                    <EditableText scale={scale} value={e.from || ''} onChange={(v) => ctx.updateEntry('experiences', e.id, { from: v })} placeholder="Bắt đầu" /> – <EditableText scale={scale} value={e.to || ''} onChange={(v) => ctx.updateEntry('experiences', e.id, { to: v })} placeholder="Kết thúc" />
                  </div>
                  <div style={{ fontSize: fs * 0.75, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', marginTop: 2 }}>
                    <EditableText scale={scale} value={e.desc || ''} onChange={(v) => ctx.updateEntry('experiences', e.id, { desc: v })} placeholder="Mô tả công việc..." multiline />
                  </div>
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

  // ── Pagination state ──
  const sidePartParts = (style.layout?.columnRatio || '30:70').split(':').map(Number);
  const sidePart = Math.min(sidePartParts[0], sidePartParts[1]);
  const sidebarW = Math.round(794 * (sidePart / 100));
  const mainW = 794 - sidebarW;

  // Conservative estimates — better to push to page 2 than to overflow
  const SIDE_HEADER_H = 400; // avatar(150) + margins(60) + contact section(~150) + padding(40)
  const MAIN_HEADER_H = 140; // name(~55) + role(~25) + margins(~60)
  const PAD = 56;            // top + bottom padding per page

  const FIRST_SIDE_AVAIL = PAGE_HEIGHT_PX - SIDE_HEADER_H;
  const FIRST_MAIN_AVAIL = PAGE_HEIGHT_PX - MAIN_HEADER_H - PAD;
  const REST_SIDE_AVAIL = PAGE_HEIGHT_PX - PAD;
  const REST_MAIN_AVAIL = PAGE_HEIGHT_PX - PAD;

  type DualPage = {
    mainSections: typeof allMainSections;
    sideSections: typeof sideSectionNodes;
  };
  const [pages, setPages] = useState<DualPage[]>([{
    mainSections: allMainSections,
    sideSections: sideSectionNodes,
  }]);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [recalcNonce, setRecalcNonce] = useState(0);

  // Recalculate whenever size of hidden container changes
  useLayoutEffect(() => {
    if (!mainContainerRef.current || typeof window === 'undefined' || !('ResizeObserver' in window)) return;
    const observer = new window.ResizeObserver(() => {
      setRecalcNonce(n => n + 1);
    });
    observer.observe(mainContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    // SectionShell adds: title row (~30px) + border/padding (~8px) + Draggable marginBottom (24px)
    const SECTION_OVERHEAD = 62;
    const mainHeights = mainMeasureRefs.current.slice(0, allMainSections.length).map(el =>
      (el?.getBoundingClientRect().height ?? 0) + SECTION_OVERHEAD
    );
    const sideHeights = sideMeasureRefs.current.slice(0, sideSectionNodes.length).map(el => el?.getBoundingClientRect().height ?? 0);

    console.log('[SidebarLeft Pagination]', {
      mainHeights,
      sideHeights,
      FIRST_MAIN_AVAIL,
      FIRST_SIDE_AVAIL,
      mainSectionCount: allMainSections.length,
      sideSectionCount: sideSectionNodes.length,
      mainRefCount: mainMeasureRefs.current.length,
      sideRefCount: sideMeasureRefs.current.length,
    });

    if (mainHeights.every(h => h === 0) && sideHeights.every(h => h === 0)) {
      console.log('[SidebarLeft Pagination] All heights are 0, skipping');
      return;
    }

    const mainPages = paginateSections(mainHeights, FIRST_MAIN_AVAIL, REST_MAIN_AVAIL);
    const sidePages = paginateSections(sideHeights, FIRST_SIDE_AVAIL, REST_SIDE_AVAIL);

    console.log('[SidebarLeft Pagination] Result:', {
      mainPages,
      sidePages,
      totalPages: Math.max(mainPages.length, sidePages.length, 1),
    });

    const totalPages = Math.max(mainPages.length, sidePages.length, 1);
    const result: DualPage[] = [];
    for (let p = 0; p < totalPages; p++) {
      result.push({
        mainSections: (mainPages[p] ?? []).map(i => allMainSections[i]),
        sideSections: (sidePages[p] ?? []).map(i => sideSectionNodes[i]),
      });
    }
    setPages(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.join(','), sideKeys.join(','), data, JSON.stringify(ctx.sectionLayout), recalcNonce]);

  return (
    <>
      {/* ── Hidden measurement containers ── */}
      <div ref={mainContainerRef} style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: mainW - 52, fontFamily, fontSize: fs, lineHeight: lh }}>
        {allMainSections.map((s, i) => (
          <div key={s.key} ref={el => { mainMeasureRefs.current[i] = el; }} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: fs * 0.84, fontWeight: 700, paddingBottom: 5, marginBottom: 12 }}>{s.title}</div>
            {s.content}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: sidebarW - 36, fontFamily, fontSize: fs * 0.88, lineHeight: lh }}>
        {sideSectionNodes.map((s, i) => (
          <div key={s.key} ref={el => { sideMeasureRefs.current[i] = el; }}>
            {s.content}
          </div>
        ))}
      </div>

      {/* ── DragDropContext + paginated output ── */}
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
            ctx.moveSectionToZone(fromKey, true, destination.index);
          } else if (source.droppableId === 'sections-sidebar' && destination.droppableId === 'sections-main') {
            ctx.moveSectionToZone(fromKey, false, destination.index);
          }
        }}
      >
        <div className="cv-pages-wrapper">
          {pages.map((page, pageIdx) => (
            <SidebarLeftPage
              key={pageIdx}
              style={style}
              isFirst={pageIdx === 0}
              mainSections={page.mainSections}
              sideSections={page.sideSections}
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
        </div>
      </DragDropContext>
    </>
  );
}

