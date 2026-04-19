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
import { DefaultHeader, FloatingHeader, CenteredHeader } from './parts/Headers';

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
              {sections.map(({ key, title, content, addButton }, idx) => (
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
                        fs={fs}
                        addButton={addButton}
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
  const headerStyle = ctx.sectionLayout.global?.headerStyle as any || 'default';
  const mainKeyList = order.filter((k) => k !== 'personal');

  const sections = mainKeyList.map(key => {
    return {
      key,
      title: key === 'experiences' ? 'Kinh nghiệm' : key === 'skills' ? 'Kỹ năng' : key,
      content: key === 'experiences' ? <ExperienceSection data={data} ctx={ctx} variant="main" /> : 
               key === 'skills' ? <SkillsBlock data={data} ctx={ctx} dark={false} /> :
               <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} />,
    };
  });

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
