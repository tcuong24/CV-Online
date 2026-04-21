'use client';

import React from 'react';
import { CvData, LayoutType } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import {
  RenderCtx,
  SectionShell,
  StylePicker,
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  getScaledDragStyle,
} from './CVTemplate';
import { DefaultHeader, CenteredHeader, FloatingHeader } from './parts/Headers';
import { SideSection } from '../shared/TemplatePart';
import { EditableText } from '../shared/EditableText';

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
  headerStyle = 'default',
}: {
  mainSections: any[];
  sideSections: any[];
  isFirst: boolean;
  data: CvData;
  theme: any;
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  accentColor: string;
  ctx: RenderCtx;
  scale: number;
  headerStyle?: 'default' | 'centered' | 'floating';
}) {
  const headerProps = { data, ctx, theme, fontFamily, align, fs };

  return (
    <div className="cv-paper" style={{ fontFamily, fontSize: fs, lineHeight: lh }}>
      {/* Header logic */}
      {isFirst && (
        <>
          {headerStyle === 'centered' && <CenteredHeader {...headerProps} />}
          {headerStyle === 'floating' && <FloatingHeader {...headerProps} />}
          {headerStyle === 'default' && <DefaultHeader {...headerProps} />}
        </>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 190px', // Right Sidebar
          minHeight: isFirst ? 'calc(100% - 200px)' : '100%',
        }}
      >
        {/* Main content (Left) */}
        <div style={{ padding: '28px 26px' }}>
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
                          552,
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

        {/* Sidebar (Right) */}
        <div style={{ background: `${accentColor}08`, borderLeft: `1px solid ${accentColor}15`, padding: '28px 18px' }}>
          <Droppable droppableId="sections-sidebar">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {sideSections.map(({ key, title, content, addButton, styleControls }, idx) => (
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
                           addButton={addButton} 
                           styleControls={styleControls}
                           dragHandleProps={dp.dragHandleProps}
                           titleColor={accentColor}
                           borderColor={`${accentColor}30`}
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
  zoom = 100,
}: {
  data: CvData;
  order: string[];
  ctx: RenderCtx;
  theme: any;
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  sideKeys: string[];
  zoom?: number;
}) {
  const accentColor = theme.primary;
  const scale = zoom / 100;
  const headerStyle = ctx.sectionLayout.global?.headerStyle as any || 'default';
  
  // Normalize IDs: use both 'personal' and 'personalInfo' to check for summary section
  const isPersonal = (k: string) => k === 'personal' || k === 'personalInfo';
  const mainKeyList = order.filter((k) => !isPersonal(k) && !sideKeys.includes(k));

  const titles: Record<string, string> = {
    personal: 'Giới thiệu',
    personalInfo: 'Giới thiệu',
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
    const title = titles[key] || key;
    let content: React.ReactNode = null;
    let addButton: React.ReactNode = undefined;
    let styleControls: React.ReactNode = undefined;

    if (isPersonal(key)) {
      content = (
        <div style={{ color: '#57534e', lineHeight: lh }}>
          <EditableText multiline value={data.personal.summary || ''} onChange={v => ctx.updatePersonalInfo({ summary: v })} placeholder="Giới thiệu bản thân..." />
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

    return { key, title, content, addButton, styleControls };
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
          accentColor={accentColor}
          ctx={ctx}
          scale={scale}
          headerStyle={headerStyle}
        />
      </div>
    </DragDropContext>
  );
}
