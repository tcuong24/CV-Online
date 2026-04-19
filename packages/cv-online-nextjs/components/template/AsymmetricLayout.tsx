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
} from './CVTemplate';
import { DefaultHeader, CenteredHeader, FloatingHeader } from './parts/Headers';

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

      <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', minHeight: '800px' }}>
        {/* Left Column (Narrower) */}
        <div style={{ padding: '30px 25px', borderRight: '1px solid #eee', background: `${accentColor}05` }}>
          <Droppable droppableId="sections-left">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {leftSections.map(({ key, title, content }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div ref={dp.innerRef} {...dp.draggableProps} style={getScaledDragStyle(dp.draggableProps.style, snap.isDragging, scale, 260)}>
                        <SectionShell dragHandleProps={dp.dragHandleProps} isDragging={snap.isDragging} accentColor={accentColor} title={title} fs={fs}>
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
                {rightSections.map(({ key, title, content }, idx) => (
                  <Draggable key={key} draggableId={`section-${key}`} index={idx}>
                    {(dp, snap) => (
                      <div ref={dp.innerRef} {...dp.draggableProps} style={getScaledDragStyle(dp.draggableProps.style, snap.isDragging, scale, 420)}>
                        <SectionShell dragHandleProps={dp.dragHandleProps} isDragging={snap.isDragging} accentColor={accentColor} title={title} fs={fs}>
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

  const leftKeys = sideKeys;
  const rightKeys = order.filter(k => k !== 'personal' && !leftKeys.includes(k));

  const makeSection = (key: string) => ({
    key,
    title: key === 'experiences' ? 'Experiences' : key === 'skills' ? 'Skills' : key,
    content: key === 'experiences' ? <ExperienceSection data={data} ctx={ctx} variant="main" /> : 
             key === 'skills' ? <SkillsBlock data={data} ctx={ctx} dark={false} /> :
             <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />,
  });

  const leftSections = leftKeys.map(makeSection);
  const rightSections = rightKeys.map(makeSection);

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
