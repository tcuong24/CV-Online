'use client';

import React, { useState } from 'react';
import { useCvEditorContext } from '@/components/editor/provider/CvEditorProvider';
import { useCvEditor } from '@/store';
import { TemplateLoader } from './TemplateLoader';
import { CvLayout } from './CvLayout';
import { InlineToolbar } from '@/components/editor/InlineToolbar';

export const CvPreview: React.FC = () => {
  const { currentCV } = useCvEditorContext();
  const { updatePersonalInfo, updateSectionItem } = useCvEditor();
  
  // Inline toolbar state
  const [toolbarState, setToolbarState] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    activeElement: HTMLElement | null;
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    activeElement: null,
  });

  if (!currentCV) return null;
  
  const designConfig = currentCV.template?.designConfig || currentCV.customStyles || {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: {
        heading: '#1e293b',
        body: '#334155',
        muted: '#64748b',
      },
      background: {
        page: '#ffffff',
        sidebar: '#f8fafc',
        section: '#ffffff',
      },
      border: '#e2e8f0',
    },
    typography: {
      fonts: {
        heading: { family: 'Inter', weights: [700] },
        body: { family: 'Inter', weights: [400, 500] },
      },
      sizes: {
        name: '2.25rem',
        section_title: '1.25rem',
        subsection: '1rem',
        body: '0.875rem',
        small: '0.75rem',
      },
      lineHeights: {
        heading: 1.2,
        body: 1.5,
      }
    },
    spacing: {
      page: { margin: '2rem' },
      section: { marginBottom: '1.5rem' },
      element: { gap: '0.5rem' },
      sidebar: { padding: '2rem' },
      main: { padding: '2rem' },
    },
    layout: {
      columnRatio: '35% 65%',
    }
  };

  const layoutType = currentCV.template?.layoutType || 'sidebar-left';

  // Handle text selection for inline toolbar
  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarState({
        isVisible: true,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top,
        },
        activeElement: e.target as HTMLElement,
      });
    }
  };

  // Handle format actions from toolbar
  const handleFormat = (format: string, value?: string) => {
    document.execCommand(format, false, value);
    // TODO: Save changes to store
  };

  // Handle toolbar close
  const hideToolbar = () => {
    setToolbarState((prev) => ({ ...prev, isVisible: false }));
  };

  // Handle drop from modules panel
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const moduleId = e.dataTransfer.getData('moduleId');
    if (moduleId) {
      console.log('Dropped module:', moduleId);
      // TODO: Add section to CV
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <TemplateLoader designConfig={designConfig}>
      <div 
        className="cv-preview-container shadow-2xl mx-auto print:shadow-none print:m-0 relative"
        onMouseUp={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CvLayout 
          layoutType={layoutType} 
          columnRatio={designConfig.layout?.columnRatio} 
        />
        
        {/* Inline Toolbar */}
        {toolbarState.isVisible && (
          <InlineToolbar
            position={toolbarState.position}
            onFormat={handleFormat}
            onClose={hideToolbar}
          />
        )}
      </div>
    </TemplateLoader>
  );
};
