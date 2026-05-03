'use client';

import React, { useRef, useState } from 'react';
import { CvData, LayoutType, StyleConfig } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import {
  RenderCtx,
  SectionShell,
  CustomSection,
} from './parts/SharedTemplateComponents';
import {
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  getScaledDragStyle,
  StylePicker,
} from './CVTemplate';
import { DefaultHeader, CenteredHeader, FloatingHeader } from './parts/Headers';
import { SideSection } from '../shared/TemplatePart';
import { EditableText } from '../shared/EditableText';
import Image from 'next/image';
import { MdEmail, MdPhone, MdLocationOn, MdLink } from 'react-icons/md';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

export function SidebarRightPage({
  mainSections,
  sideSections, // Now receiving raw section data objects
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
  style,
  headerStyle = 'default',
}: {
  mainSections: any[];
  sideSections: any[];
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
  headerStyle?: 'default' | 'centered' | 'floating';
}) {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      ctx.updatePersonalInfo({ avatarUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const headerProps = { data, ctx, theme, fontFamily, align, fs };
  const columnRatio = style?.layout?.columnRatio || '220px 1fr';
  // If ratio is '35:65', convert to '35% 65%' for grid
  const gridTemplateColumns = columnRatio.includes(':')
    ? columnRatio.split(':').map((v: string) => `${v}%`).join(' ')
    : columnRatio;

  const sidebarBg = style?.colors?.background.sidebar || theme.sidebar || theme.primary;
  const sidebarPadding = style?.spacing?.page.sidebarPadding || '28px 18px';

  return (
    <div className="cv-paper" style={{
      fontFamily, fontSize: fs, lineHeight: lh,
      position: 'relative',
      backgroundColor: style?.backgroundImage ? 'transparent' : '#ffffff',
      backgroundImage: style?.backgroundImage ? `url(${style?.backgroundImage})` : 'none',
      backgroundSize: style?.backgroundOptions?.size || 'cover',
      backgroundPosition: style?.backgroundOptions?.position || 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: 0,
    }}>
      {/* Background Opacity Overlay */}
      {style?.backgroundImage && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Header logic */}
      {isFirst && (
        <>
          <div
            style={{
              padding: '47px 44px 32px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              marginRight: '14px',
              marginLeft: '61px',
              justifyContent: 'space-between',
            }}
          >
            <div>

              <div style={{ fontFamily, fontSize: fs * 2.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#111', marginBottom: 6 }}>
                <EditableText scale={scale} value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="HỌ VÀ TÊN" />
              </div>
              <div style={{ fontSize: fs * 1.1, color: theme.primary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
                <EditableText scale={scale} value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="VỊ TRÍ ỨNG TUYỂN" />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', justifyContent: 'center', fontSize: fs * 0.9, color: '#666' }}>
                {/* personal phone mail github linkedin linkedinurl website */}

              </div>
            </div>
            <div
              style={{
                cursor: 'pointer',
                position: 'relative',
                width: 173,
                height: 173,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `2px solid ${theme.primary}20`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
              onClick={handleAvatarClick}
              title="Nhấp để tải ảnh lên"
            >
              <Image
                src={data.personal.avatarUrl || "/images/avatar.png"}
                alt="Avatar"
                fill
                sizes="173px"
                style={{
                  objectFit: 'cover',
                  transform: isAvatarHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
                loading='eager'
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: fs * 0.8,
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '12px',
                  opacity: isAvatarHovered ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }}
              >
                Nhấn để thay đổi ảnh
              </div>
              <input
                type="file"
                ref={avatarInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns,
          minHeight: isFirst ? 'calc(100% - 250px)' : '100%',
        }}
      >
        {/* Main content (Left) */}
        <div style={{ padding: '28px 26px' }}>
          <Droppable droppableId="sections-main" >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {mainSections.map(({ key, title, content, addButton, styleControls, onTitleChange }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx} >
                    {(dp, snap) => (
                      <div
                        ref={dp.innerRef}
                        {...dp.draggableProps}
                        style={{
                          ...getScaledDragStyle(
                            dp.draggableProps.style,
                            snap.isDragging,
                            scale,
                            552
                          ),
                          marginBottom: '20px',
                        }}
                      >
                        <SectionShell
                          dragHandleProps={dp.dragHandleProps}
                          isDragging={snap.isDragging}
                          accentColor={accentColor}
                          title={title}
                          onTitleChange={onTitleChange}
                          fs={fs}
                          addButton={addButton}
                          styleControls={styleControls}
                          style={style}
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

        {/* Sidebar (Right) */}
        <div style={{ background: `${style.colors?.background.sidebar}`, borderRadius: 20, padding: '28px 18px', width: '95%' }}>
          <Droppable droppableId="sections-sidebar">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {sideSections.map(({ key, title, content, addButton, styleControls, onTitleChange }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div
                        ref={dp.innerRef}
                        {...dp.draggableProps}
                        style={getScaledDragStyle(
                          { ...dp.draggableProps.style, opacity: snap.isDragging ? 0.8 : 1 },
                          snap.isDragging,
                          scale,
                          154,
                        )}
                        className="group/sidesec"
                      >
                        <SideSection
                          title={title}
                          onTitleChange={onTitleChange}
                          fontSize={fs * 1.2}
                          addButton={addButton}
                          styleControls={styleControls}
                          dragHandleProps={dp.dragHandleProps}
                          titleColor={accentColor}
                          borderColor={`${accentColor}30`}
                          sectionTitleBorder={style?.sectionTitleBorder}
                        >
                          {content}
                        </SideSection>
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
    </div>
  );
}

export function SidebarRightLayout({
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
  const accentColor = theme.sidebar || theme.primary;
  const scale = zoom / 100;
  const headerStyle = style?.headerStyle || 'default';

  // Normalize IDs: use both 'personal' and 'personalInfo' to check for summary section
  const isPersonal = (k: string) => k === 'personal' || k === 'personalInfo';
  const mainKeyList = order.filter((k) => !sideKeys.includes(k));

  const titles: Record<string, string> = {
    personal: 'Giới thiệu',
    personalInfo: 'Giới thiệu',
    contact: 'Liên hệ',
    experiences: 'Kinh nghiệm',
    education: 'Học vấn',
    skills: 'Kỹ năng',
    projects: 'Dự án',
    awards: 'Giải thưởng',
    languages: 'Ngoại ngữ',
    certifications: 'Chứng chỉ',
    references: 'Tham chiếu',
    interests: 'Sở thích',
    activities: 'Hoạt động',
  };

  const makeAddBtn = (key: string, label: string, action: () => void, hasData: boolean) =>
    hasData ? (
      <button
        onClick={action}
        style={{
          padding: '3px 10px', fontSize: fs * 0.78, fontWeight: 600, border: '1px solid #bfdbfe',
          borderRadius: 99, cursor: 'pointer', background: '#eff6ff', color: '#3b82f6',
          transition: 'background 0.12s', whiteSpace: 'nowrap', fontFamily: 'inherit',
        }}
      >{label}</button>
    ) : undefined;

  const makeSection = (key: string) => {
    let displayTitle = ctx.sectionLayout[key]?.title || titles[key] || key;
    let content: React.ReactNode = null;
    let addButton: React.ReactNode = undefined;
    let styleControls: React.ReactNode = undefined;
    let onTitleChange: ((v: string) => void) | undefined = (v) => ctx.patchSectionLayout(key, { title: v });

    if (isPersonal(key)) {
      content = (
        <div style={{ color: '#57534e', lineHeight: lh }}>
          <EditableText scale={scale} multiline value={data.personal.summary || ''} onChange={v => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." />
        </div>
      );
      onTitleChange = undefined;
    } else if (key === 'contact') {
      const p = data.personal;
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: fs * 0.9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MdPhone size={14} style={{ color: style.colors?.text.heading, opacity: 1 }} />
            <EditableText scale={scale} className={`text-[${style.colors?.text.heading}]`}
              value={p.phone || ''} onChange={v => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MdEmail size={14} style={{ color: style.colors?.text.heading, opacity: 1 }} />
            <EditableText scale={scale} value={p.email || ''} onChange={v => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MdLocationOn size={14} style={{ color: style.colors?.text.heading, opacity: 1 }} />
            <EditableText scale={scale} value={p.location || ''} onChange={v => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
          </div>
          {(p.website || p.linkedinUrl || p.githubUrl) && (
            <>
              {p.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FaGlobe size={14} style={{ color: style.colors?.text.heading, opacity: 1 }} />
                  <EditableText scale={scale} value={p.website} onChange={v => ctx.updatePersonalInfo({ website: v })} placeholder="Website" />
                </div>
              )}
              {p.linkedinUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FaLinkedin size={14} style={{ color: style.colors?.text.heading, opacity: 1 }} />
                  <EditableText scale={scale} value={p.linkedinUrl} onChange={v => ctx.updatePersonalInfo({ linkedinUrl: v })} placeholder="LinkedIn" />
                </div>
              )}
              {p.githubUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FaGithub size={14} style={{ color: style.colors?.text.heading, opacity: 1 }} />
                  <EditableText scale={scale} value={p.githubUrl} onChange={v => ctx.updatePersonalInfo({ githubUrl: v })} placeholder="Github" />
                </div>
              )}
            </>
          )}
        </div>
      );
    } else if (key === 'experiences') {
      content = <ExperienceSection data={data} ctx={ctx} variant="main" />;
      addButton = makeAddBtn(key, '+', () => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' }), !!data.experiences?.length);
      styleControls = (
        <StylePicker
          fs={fs}
          value={ctx.sectionLayout.experiences?.style ?? 'timeline'}
          options={[{ value: 'timeline', label: 'Timeline' }, { value: 'simple', label: 'Simple' }]}
          onChange={(v) => ctx.patchSectionLayout('experiences', { style: v })}
        />
      );
    } else if (key === 'skills') {
      content = <SkillsBlock data={data} ctx={ctx} dark={false} />;
      addButton = makeAddBtn(key, '+', () => ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' }), !!data.skills?.length);
      styleControls = (
        <StylePicker
          fs={fs}
          value={ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags'}
          options={[{ value: 'tags', label: 'Tags' }, { value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' }]}
          onChange={(v) => ctx.patchSectionLayout('skills', { proficiencyStyle: v })}
        />
      );
    } else if (key.startsWith('custom-')) {
      const customSection = data.customSections?.find(cs => cs.id === key);
      if (customSection) {
        displayTitle = customSection.sectionTitle || 'Custom Section';
        content = <CustomSection section={customSection} ctx={ctx} />;
        onTitleChange = (v) => ctx.updateCustomSection(customSection.id, { sectionTitle: v });
      }
    } else {
      content = <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />;
      const addConf: any = {
        education: { action: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }), has: !!data.education?.length },
        projects: { action: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }), has: !!data.projects?.length },
        awards: { action: () => ctx.addEntry('awards', { title: '', year: '', org: '' }), has: !!data.awards?.length },
        languages: { action: () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }), has: !!data.languages?.length },
        certifications: { action: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', description: '' }), has: !!data.certifications?.length },
      };
      if (addConf[key]) addButton = makeAddBtn(key, '+', addConf[key].action, addConf[key].has);
    }

    return { key, title: displayTitle, content, addButton, styleControls, onTitleChange };
  };

  const allMainSections = mainKeyList.map(makeSection);
  const sideSections = sideKeys.map(makeSection);

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;
        const fromKey = draggableId.replace('section-', '');
        if (source.droppableId === 'sections-main' && destination.droppableId === 'sections-main') {
          ctx.reorderSection(fromKey, mainKeyList[destination.index]);
        } else if (source.droppableId === 'sections-sidebar' && destination.droppableId === 'sections-sidebar') {
          ctx.reorderSideKey(fromKey, sideKeys[destination.index]);
        } else if (source.droppableId.includes('main') && destination.droppableId.includes('sidebar')) {
          ctx.moveSectionToZone(fromKey, true);
        } else {
          ctx.moveSectionToZone(fromKey, false);
        }
      }}
    >
      <div className="cv-pages-wrapper">
        <SidebarRightPage
          isFirst={true}
          mainSections={allMainSections}
          sideSections={sideSections}
          data={data}
          theme={theme}
          fontFamily={fontFamily}
          align={align}
          fs={fs}
          lh={lh}
          accentColor={style.colors?.text.heading || theme.primary}
          ctx={ctx}
          scale={scale}
          style={style}
          headerStyle={headerStyle}
        />
      </div>
    </DragDropContext>
  );
}
