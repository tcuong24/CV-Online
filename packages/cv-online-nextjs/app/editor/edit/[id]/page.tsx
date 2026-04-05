'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CvEditorProvider } from '@/components/editor/provider/CvEditorProvider';
import { EditorSidebar } from '@/components/editor/sidebar/EditorSidebar';
import { CvPreview } from '@/components/renderer/CvPreview';

export default function EditorPage() {
  const params = useParams();
  const cvId = params.id as string;

  return (
    <CvEditorProvider cvId={cvId}>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <EditorSidebar />
        <div className="flex-1 overflow-auto p-8 flex justify-center">
            <CvPreview />
        </div>
      </div>
    </CvEditorProvider>
  );
}
