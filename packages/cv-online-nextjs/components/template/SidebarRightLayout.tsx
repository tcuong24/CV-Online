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

export function SidebarRightPage({
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
                          154,
                        )}
                        className="group/sidesec"
                      >
                        <div style={{ position: 'relative' }}>
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
  const mainKeyList = order.filter((k) => k !== 'personal' && !sideKeys.includes(k));

  const makeAddBtn = (key: string, label: string, action: () => void, hasData: boolean) =>
    hasData ? (
      <button
        onClick={action}
        style={{ padding: '3px 10px', fontSize: fs * 0.78, fontWeight: 600, border: '1px solid #bfdbfe', borderRadius: 99, background: '#eff6ff', color: '#3b82f6' }}
      >{label}</button>
    ) : undefined;

  const allMainSections = mainKeyList.map(key => {
    if (key === 'experiences') {
      return {
        key, title: 'Kinh nghiệm',
        content: <ExperienceSection data={data} ctx={ctx} variant="main" />,
        addButton: makeAddBtn(key, '+ Kinh nghiệm', () => ctx.addEntry('experiences', { title: '', company: '', from: '', to: '', location: '', desc: '' }), !!data.experiences?.length),
        styleControls: <StylePicker fs={fs} value={ctx.sectionLayout.experiences?.style} options={[{ value: 'timeline', label: 'Timeline' }, { value: 'simple', label: 'Simple' }]} onChange={(v) => ctx.patchSectionLayout('experiences', { style: v })} />,
      };
    }
    // ... logic for other sections (omitted for brevity but should be consistent)
    return { key, title: key, content: <MainSectionBlocks sectionKey={key} data={data} ctx={ctx} /> };
  });

  const sideSectionNodes = sideKeys.map(key => ({
    key, content: <SideSection key={key} title={key}><MainSectionBlocks sectionKey={key} data={data} ctx={ctx} /></SideSection>
  }));

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
          headerStyle={headerStyle}
        />
      </div>
    </DragDropContext>
  );
}
