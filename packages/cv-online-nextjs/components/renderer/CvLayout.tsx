'use client';

import React from 'react';
import { useCvEditorContext } from '@/components/editor/provider/CvEditorProvider';
import { SectionRenderer } from './SectionRenderer';

interface CvLayoutProps {
    layoutType: 'sidebar-left' | 'sidebar-right' | 'single-column' | 'two-column';
    columnRatio?: string; // e.g. "35% 65%"
}

export const CvLayout: React.FC<CvLayoutProps> = ({ layoutType, columnRatio = "35% 65%" }) => {
    const { currentCV } = useCvEditorContext();
    const sectionsOrder = currentCV?.sectionsOrder || [];

    // Helper to get ordered sections for a specific region
    const getSectionsForRegion = (regionFilter: (id: string) => boolean) => {
        return sectionsOrder
            .filter(regionFilter)
            .map(sectionId => (
                <SectionRenderer key={sectionId} sectionId={sectionId} />
            ));
    };

    // Sidebar Left Layout
    if (layoutType === 'sidebar-left') {
        const sidebarIds = ['personalInfo', 'skills', 'languages', 'contact', 'references'];
        
        return (
            <div 
                className="grid h-full min-h-[297mm]" 
                style={{ gridTemplateColumns: columnRatio }}
            >
                <aside 
                    className="border-r"
                    style={{
                        backgroundColor: 'var(--cv-bg-sidebar)',
                        padding: 'var(--cv-spacing-sidebar-p)',
                        borderColor: 'var(--cv-border-color)'
                    }}
                >
                     {getSectionsForRegion(id => sidebarIds.includes(id))}
                </aside>
                <main 
                    style={{
                        backgroundColor: 'var(--cv-bg-page)',
                        padding: 'var(--cv-spacing-main-p)'
                    }}
                >
                     {getSectionsForRegion(id => !sidebarIds.includes(id))}
                </main>
            </div>
        );
    }

    // Single Column Layout (Default)
    return (
        <div className="bg-[var(--cv-bg-page)] p-[var(--cv-spacing-page-margin)] h-full min-h-[297mm]">
            {getSectionsForRegion(() => true)}
        </div>
    );
};
