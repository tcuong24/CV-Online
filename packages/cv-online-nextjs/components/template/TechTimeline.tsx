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
import { DefaultHeader, FloatingHeader, CenteredHeader } from './parts/Headers';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { EditableText } from '../shared/EditableText';

export function TechTimelinePage({
  sections,
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
  sections: any[];
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
      {isFirst && (
        <>
          {headerStyle === 'floating' && <FloatingHeader {...headerProps} />}
          {headerStyle === 'centered' && <CenteredHeader {...headerProps} />}
          {headerStyle === 'default' && <DefaultHeader {...headerProps} />}
        </>
      )}

      <div style={{ padding: '30px 44px', position: 'relative' }}>
        {/* The Timeline Ribbon */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '52px', 
            top: '40px', 
            bottom: '40px', 
            width: '2px', 
            background: `linear-gradient(to bottom, ${accentColor} 0%, ${accentColor}20 100%)`,
            zIndex: 0 
          }} 
        />

        <Droppable droppableId="sections-main">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map(({ key, title, content, addButton, styleControls, onTitleChange }, idx) => (
                <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                  {(dp, snap) => (
                    <div
                      ref={dp.innerRef}
                      {...dp.draggableProps}
                      style={getScaledDragStyle(
                        { ...dp.draggableProps.style, marginBottom: 35, position: 'relative', zIndex: 1 },
                        snap.isDragging,
                        scale,
                        706,
                      )}
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
                      >
                        <div style={{ paddingLeft: '28px' }}>
                          {content}
                        </div>
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

export function TechTimelineLayout({
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
  theme: any;
  fontFamily: string;
  align: string;
  fs: number;
  lh: number;
  zoom?: number;
}) {
  const accentColor = theme.primary;
  const scale = zoom / 100;
  const headerStyle = useCvEditorStore.getState().style.headerStyle || 'default';
  const mainKeyList = order;

  const titles: Record<string, string> = {
    personal: 'Giới thiệu',
    experiences: 'Kinh nghiệm',
    education: 'Học vấn',
    skills: 'Kỹ năng',
    projects: 'Dự án',
    awards: 'Giải thưởng',
    certifications: 'Chứng chỉ',
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

    const isPersonal = (k: string) => k === 'personal' || k === 'personalInfo';
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
        certifications: { action: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', description: '' }), has: !!data.certifications?.length },
      };
      if (addConf[key]) addButton = makeAddBtn(key, '+', addConf[key].action, addConf[key].has);
    }

    return { key, title: displayTitle, content, addButton, styleControls, onTitleChange };
  };

  const sections = mainKeyList.map(makeSection);

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        if (!result.destination) return;
        ctx.reorderSection(mainKeyList[result.source.index], mainKeyList[result.destination.index]);
      }}
    >
      <div className="cv-pages-wrapper">
        <TechTimelinePage
          isFirst={true}
          sections={sections}
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
