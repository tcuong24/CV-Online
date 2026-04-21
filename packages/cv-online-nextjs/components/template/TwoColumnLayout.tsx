'use client';

import React from 'react';
import { CvData } from '@/types/cvEditor';
import { Droppable, Draggable, DragDropContext, type DropResult } from '@hello-pangea/dnd';
import {
  RenderCtx,
  SectionShell,
  ExperienceSection,
  SkillsBlock,
  MainSectionBlocks,
  getScaledDragStyle,
  StylePicker,
} from './CVTemplate';
import { DefaultHeader, CenteredHeader, FloatingHeader } from './parts/Headers';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { EditableText } from '../shared/EditableText';

export function TwoColumnPage({
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '30px 44px' }}>
        {/* Left Column */}
        <div style={{ minHeight: '800px' }}>
          <Droppable droppableId="sections-left">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {leftSections.map(({ key, title, content, addButton, styleControls }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div ref={dp.innerRef} {...dp.draggableProps} style={getScaledDragStyle(dp.draggableProps.style, snap.isDragging, scale, 330)}>
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

        {/* Right Column */}
        <div>
          <Droppable droppableId="sections-main">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {rightSections.map(({ key, title, content, addButton, styleControls }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div ref={dp.innerRef} {...dp.draggableProps} style={getScaledDragStyle(dp.draggableProps.style, snap.isDragging, scale, 330)}>
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
    </div>
  );
}

export function TwoColumnLayout({
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
  const headerStyle = useCvEditorStore.getState().style.headerStyle || 'default';

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
      const addConf: Record<string, any> = {
        education: { label: '+', action: () => ctx.addEntry('education', { degree: '', school: '', from: '', to: '', desc: '' }), has: !!data.education?.length },
        projects: { label: '+', action: () => ctx.addEntry('projects', { name: '', link: '', tech: '', desc: '' }), has: !!data.projects?.length },
        certifications: { label: '+', action: () => ctx.addEntry('certifications', { name: '', issuingOrganization: '', issueDate: '', description: '' }), has: !!data.certifications?.length },
      };
      if (addConf[key]) addButton = makeAddBtn(key, addConf[key].label, addConf[key].action, addConf[key].has);
    }

    return { key, title, content, addButton, styleControls };
  };

  const leftSections = leftKeys.map(makeSection);
  const rightSections = rightKeys.map(makeSection).filter(s => s.key !== 'personal');

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
        <TwoColumnPage
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
