'use client';

import React from 'react';
import { CvData } from '@/types/cvEditor';
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
import { EditableText } from '../shared/EditableText';

export function AsymmetricPage({
  leftSections,
  rightSections,
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
  leftSections: any[];
  rightSections: any[];
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
  headerStyle?: 'default' | 'centered' | 'floating';
}) {
  const headerProps = { data, ctx, theme, fontFamily, align, fs };

  return (
    <div className="cv-paper" style={{ fontFamily, fontSize: fs, lineHeight: lh }}>
      {isFirst && (
        <>
          {headerStyle === 'floating' && <FloatingHeader {...headerProps} />}
          {headerStyle === 'centered' && <CenteredHeader {...headerProps} />}
          {headerStyle === 'default' && <DefaultHeader {...headerProps} />}
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', minHeight: '800px' }}>
        {/* Left Column (Narrower) */}
        <div style={{ padding: '30px 25px', borderRight: '1px solid #eee', background: `${accentColor}05` }}>
          <Droppable droppableId="sections-left">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {leftSections.map(({ key, title, content, addButton, styleControls, onTitleChange }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div ref={dp.innerRef} {...dp.draggableProps} style={getScaledDragStyle(dp.draggableProps.style, snap.isDragging, scale, 260)}>
                        <SectionShell
                          dragHandleProps={dp.dragHandleProps}
                          isDragging={snap.isDragging}
                          accentColor={accentColor}
                          title={title}
                          onTitleChange={(v) => ctx.updateSectionLabel(key, v)}
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

        {/* Right Column (Wider) */}
        <div style={{ padding: '30px 30px' }}>
          <Droppable droppableId="sections-main">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {rightSections.map(({ key, title, content, onTitleChange }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div ref={dp.innerRef} {...dp.draggableProps} style={getScaledDragStyle(dp.draggableProps.style, snap.isDragging, scale, 420)}>
                        <SectionShell 
                          dragHandleProps={dp.dragHandleProps} 
                          isDragging={snap.isDragging} 
                          accentColor={accentColor} 
                          title={title} 
                          onTitleChange={onTitleChange}
                          fs={fs}
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
    </div>
  );
}

export function AsymmetricLayout({
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
  theme: { primary: string; dark: string; light: string; sidebar?: string };
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  sideKeys: string[];
  zoom?: number;
}) {
  const accentColor = theme.sidebar || theme.primary;
  const scale = zoom / 100;
  const headerStyle = ctx.sectionLayout.global?.headerStyle as any || 'default';

  const isPersonal = (k: string) => k === 'personal' || k === 'personalInfo';
  const leftKeys = sideKeys;
  const rightKeys = order.filter(k => !isPersonal(k) && !leftKeys.includes(k));

  const titles: Record<string, string> = {
    personal: 'Giới thiệu',
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
          <EditableText 
            value={data.personal.summary || ''} 
            onChange={(v) => ctx.updatePersonalInfo({ summary: v })} 
            placeholder="Giới thiệu bản thân..." 
            multiline 
          />
        </div>
      );
      onTitleChange = undefined;
    } else if (key === 'experiences') {
      const expStyle = ctx.sectionLayout.experiences?.style ?? 'timeline';
      content = <ExperienceSection data={data} ctx={ctx} variant="main" />;
      addButton = makeAddBtn(key, '+ Kinh nghiệm', () => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' }), !!data.experiences?.length);
      styleControls = (
        <StylePicker
          fs={fs}
          value={expStyle}
          options={[{ value: 'timeline', label: 'Timeline' }, { value: 'simple', label: 'Simple' }]}
          onChange={(v) => ctx.patchSectionLayout('experiences', { style: v })}
        />
      );
    } else if (key === 'skills') {
      const profStyle = ctx.sectionLayout.skills?.proficiencyStyle ?? 'tags';
      content = <SkillsBlock data={data} ctx={ctx} dark={false} />;
      addButton = makeAddBtn(key, '+ Kỹ năng', () => ctx.addSkill({ id: crypto.randomUUID(), name: 'Kỹ năng mới', proficiencyLevel: '3', proficiencyPercentage: 60, category: '' }), !!data.skills?.length);
      styleControls = (
        <StylePicker
          fs={fs}
          value={profStyle}
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
      const addActions: Record<string, { label: string; action: () => void; hasData: boolean }> = {
        education: { label: '+ Học vấn', action: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }), hasData: !!data.education?.length },
        projects:  { label: '+ Dự án',   action: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }), hasData: !!data.projects?.length },
        awards:    { label: '+ Giải thưởng', action: () => ctx.addEntry('awards', { title: '', year: '', org: '' }), hasData: !!data.awards?.length },
        languages: { label: '+ Ngôn ngữ', action: () => ctx.addEntry('languages', { lang: 'Ngoại ngữ mới', level: 1 }), hasData: !!data.languages?.length },
        certifications: { label: '+ Chứng chỉ', action: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', description: '' }), hasData: !!data.certifications?.length },
      };
      const add = addActions[key];
      if (add) addButton = makeAddBtn(key, add.label, add.action, add.hasData);
    }

    return { key, title: displayTitle, content, addButton, styleControls, onTitleChange };
  };

  const leftSections = leftKeys.map(makeSection);
  const rightSections = rightKeys.map(makeSection).filter(s => s.key !== 'personal'); 

  // Nếu 'personal' (Giới thiệu) nằm đầu tiên trong 'order', ta có thể render nó đặc biệt ở trang 1 
  // Nhưng ở AsymmetricPage ta đã render list rồi.

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;
        const fromKey = draggableId.replace('section-', '');
        if (source.droppableId === destination.droppableId) {
          if (source.droppableId === 'sections-left') ctx.reorderSideKey(fromKey, leftKeys[destination.index]);
          else ctx.reorderSection(fromKey, rightKeys[destination.index]);
        } else {
          ctx.moveSectionToZone(fromKey, destination.droppableId === 'sections-left');
        }
      }}
    >
      <div className="cv-pages-wrapper">
        <AsymmetricPage
          isFirst={true}
          leftSections={leftSections}
          rightSections={rightSections}
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
