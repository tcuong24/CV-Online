'use client';

import React, { useMemo } from 'react';
import { DbDesignConfig } from '@/types/cv';

interface TemplateLoaderProps {
    designConfig: DbDesignConfig;
    children: React.ReactNode;
}

export const TemplateLoader: React.FC<TemplateLoaderProps> = ({ designConfig, children }) => {
    
    // 1. Build CSS Variables from Design Config
    const cssVars = useMemo(() => {
        if (!designConfig) return {};

        const { colors, typography, spacing, borders } = designConfig;

        return {
            // Colors
            '--cv-color-primary': colors.primary,
            '--cv-color-secondary': colors.secondary,
            '--cv-color-accent': colors.accent,
            '--cv-color-text-heading': colors.text.heading,
            '--cv-color-text-body': colors.text.body,
            '--cv-color-text-muted': colors.text.muted,
            '--cv-bg-page': colors.background.page,
            '--cv-bg-section': colors.background.section || 'transparent',
            '--cv-bg-sidebar': colors.background.sidebar || colors.background.page,

            // Typography
            '--cv-font-heading': typography.fonts.heading.family,
            '--cv-font-body': typography.fonts.body.family,
            '--cv-text-size-name': typography.sizes.name,
            '--cv-text-size-section-title': typography.sizes.section_title,
            '--cv-text-size-subsection': typography.sizes.subsection,
            '--cv-text-size-body': typography.sizes.body,
            '--cv-line-height-heading': typography.lineHeights.heading,
            '--cv-line-height-body': typography.lineHeights.body,

            // Spacing
            '--cv-spacing-page-margin': spacing.page.margin,
            '--cv-spacing-section-mb': spacing.section.marginBottom,
            '--cv-spacing-element-gap': spacing.element?.gap || '1rem',
            '--cv-spacing-sidebar-p': spacing.sidebar?.padding || spacing.page.margin,
            '--cv-spacing-main-p': spacing.main?.padding || spacing.page.margin,

            // Borders
            '--cv-border-width': borders?.width || '1px',
            '--cv-border-radius': borders?.radius || '0px',
            '--cv-border-style': borders?.style || 'solid',

        } as React.CSSProperties;
    }, [designConfig]);

    // 2. Load Fonts (Effect)
    React.useEffect(() => {
        if (!designConfig) return;
        
        const { heading, body } = designConfig.typography.fonts;
        
        const loadFont = (fontFamily: string) => {
            if (!fontFamily) return;
            // Simple Google Fonts loader
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            return () => {
                document.head.removeChild(link);
            }
        };

        const cleanupHeading = heading.googleFont ? loadFont(heading.family) : undefined;
        const cleanupBody = body.googleFont ? loadFont(body.family) : undefined;

        return () => {
            if (cleanupHeading) cleanupHeading();
            if (cleanupBody) cleanupBody();
        }
    }, [designConfig]);

    return (
        <div className="cv-template-root h-full w-full" style={cssVars}>
            {children}
            <style jsx global>{`
                .cv-template-root {
                    font-family: var(--cv-font-body);
                    color: var(--cv-color-text-body);
                    background-color: var(--cv-bg-page);
                }
                .cv-template-root h1, 
                .cv-template-root h2, 
                .cv-template-root h3 {
                    font-family: var(--cv-font-heading);
                    color: var(--cv-color-text-heading);
                    line-height: var(--cv-line-height-heading);
                }
                /* Add more global utility classes using vars here */
            `}</style>
        </div>
    );
};
