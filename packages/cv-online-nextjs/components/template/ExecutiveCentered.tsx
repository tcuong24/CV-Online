'use client';

import React from 'react';
import { CvData } from '@/types/cvEditor';
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
import { CenteredHeader, FloatingHeader, DefaultHeader } from './parts/Headers';

export function ExecutiveCenteredPage({
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
  headerStyle = 'centered',
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
  const headerProps = { data, ctx, theme, fontFamily, align: 'center', fs };

  return (
    <div className="cv-paper" style={{ fontFamily, fontSize: fs, lineHeight: lh }}>
      {isFirst && (
        <>
          {headerStyle === 'centered' && <CenteredHeader {...headerProps} />}
          {headerStyle === 'floating' && <FloatingHeader {...headerProps} />}
          {headerStyle === 'default' && <DefaultHeader {...headerProps} />}
        </>
      )}

      <div style={{ padding: '40px 60px', maxWidth: '800px', margin: '0 auto' }}>
        {isFirst && data.personal.summary && (
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: fs * 0.9, color: '#666', fontStyle: 'italic', lineHeight: 1.8 }}>
              {data.personal.summary}
            </div>
          </div>
        )}

        <Droppable droppableId="sections-main">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map(({ key, title, content, addButton, styleControls }, idx) => (
                <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                  {(dp, snap) => (
                    <div
                      ref={dp.innerRef}
                      {...dp.draggableProps}
                      style={getScaledDragStyle(
                        { ...dp.draggableProps.style, marginBottom: 32 },
                        snap.isDragging,
                        scale,
                        674, // 794 - 60*2 padding
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

export function ExecutiveCenteredLayout({
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
  const headerStyle = ctx.sectionLayout.global?.headerStyle as any || 'centered';
  const mainKeyList = order.filter((k) => k !== 'personal');

  const makeAddBtn = (key: string, label: string, action: () => void, hasData: boolean) =>
    hasData ? (
      <button
        onClick={action}
        style={{ padding: '2px 8px', fontSize: fs * 0.75, border: '1px solid #ddd', borderRadius: 4, background: '#fff' }}
      >{label}</button>
    ) : undefined;

  const sections = mainKeyList.map(key => {
    const titles: any = { experiences: 'Kinh nghiệm', education: 'Học vấn', skills: 'Kỹ năng chuyên môn' };
    return {
      key,
      title: titles[key] || key,
      content: key === 'experiences' ? <ExperienceSection data={data} ctx={ctx} variant="main" /> : 
               key === 'skills' ? <SkillsBlock data={data} ctx={ctx} dark={false} /> :
               <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />,
      addButton: makeAddBtn(key, '+', () => {}, true),
    };
  });

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        if (!result.destination) return;
        const fromKey = sections[result.source.index].key;
        const toKey = sections[result.destination.index].key;
        ctx.reorderSection(fromKey, toKey);
      }}
    >
      <div className="cv-pages-wrapper">
        <ExecutiveCenteredPage
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
