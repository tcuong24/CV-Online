import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createHash } from 'crypto';

@Injectable()
export class RenderingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Render CV to HTML
   */
  async renderCV(cvId: string): Promise<string> {
    // Get CV with all data
    const cv = await this.prisma.cV.findUnique({
      where: { id: cvId },
      include: {
        template: true,
        personalInfo: true,
        experiences: { orderBy: { displayOrder: 'asc' } },
        education: { orderBy: { displayOrder: 'asc' } },
        skills: { orderBy: { displayOrder: 'asc' } },
        projects: { orderBy: { displayOrder: 'asc' } },
        certifications: { orderBy: { displayOrder: 'asc' } },
        languages: { orderBy: { displayOrder: 'asc' } },
        awards: { orderBy: { displayOrder: 'asc' } },
        references: { orderBy: { displayOrder: 'asc' } },
        customSections: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!cv) {
      throw new Error('CV not found');
    }

    // Generate cache key from CV data
    const cacheKey = this.generateCacheKey(cv);

    // Check cache
    const cached = await this.prisma.cVRenderedCache.findUnique({
      where: { cacheKey },
    });

    if (cached) {
      return cached.htmlContent;
    }

    // Generate HTML
    const html = this.generateHTML(cv);

    // Save to cache
    await this.prisma.cVRenderedCache.create({
      data: {
        cvId,
        cacheKey,
        htmlContent: html,
      },
    });

    return html;
  }

  /**
   * Generate cache key from CV data
   */
  private generateCacheKey(cv: any): string {
    const data = JSON.stringify({
      cvId: cv.id,
      templateId: cv.templateId,
      customStyles: cv.customStyles,
      sectionsVisibility: cv.sectionsVisibility,
      sectionsOrder: cv.sectionsOrder,
      personalInfo: cv.personalInfo,
      experiences: cv.experiences,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      languages: cv.languages,
      awards: cv.awards,
      references: cv.references,
      customSections: cv.customSections,
      updatedAt: cv.updatedAt,
    });

    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate HTML from CV data and template
   */
  private generateHTML(cv: any): string {
    const template = cv.template;
    const designConfig = {
      ...template.designConfig,
      ...cv.customStyles,
    };

    // Build HTML
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cv.title}</title>
  ${this.generateStyles(designConfig, template.layoutType)}
</head>
<body>
  <div class="cv-container ${template.layoutType}">
    ${this.generateContent(cv, template, designConfig)}
  </div>
</body>
</html>
    `;

    return html;
  }

  /**
   * Generate CSS styles
   */
  private generateStyles(designConfig: any, layoutType: string): string {
    const colors = designConfig.colors || {};
    const typography = designConfig.typography || {};
    const spacing = designConfig.spacing || {};

    return `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${typography.fonts?.body?.family || 'Arial, sans-serif'};
    font-size: ${typography.sizes?.body || '14px'};
    line-height: ${typography.lineHeights?.body || 1.6};
    color: ${colors.text?.body || '#333'};
    background: ${colors.background?.page || '#fff'};
  }

  .cv-container {
    max-width: ${designConfig.layout?.maxWidth || '210mm'};
    margin: 0 auto;
    padding: ${spacing.page?.padding || '20mm'};
    background: white;
  }

  .cv-container.sidebar-left,
  .cv-container.sidebar-right {
    display: grid;
    grid-template-columns: ${layoutType === 'sidebar-left' ? '35% 65%' : '65% 35%'};
    gap: ${spacing.element?.gap || '20px'};
  }

  .sidebar {
    background: ${colors.background?.sidebar || colors.primary || '#2c3e50'};
    color: ${designConfig.sidebar?.textColor || '#fff'};
    padding: ${spacing.sidebar?.padding || '20px'};
  }

  .main-content {
    padding: ${spacing.main?.padding || '20px'};
  }

  h1 {
    font-family: ${typography.fonts?.heading?.family || 'Arial, sans-serif'};
    font-size: ${typography.sizes?.name || '32px'};
    color: ${colors.text?.heading || colors.primary || '#2c3e50'};
    margin-bottom: 10px;
  }

  h2 {
    font-size: ${typography.sizes?.section_title || '20px'};
    color: ${colors.text?.heading || colors.primary || '#2c3e50'};
    margin-top: 20px;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 2px solid ${colors.primary || '#2c3e50'};
  }

  h3 {
    font-size: ${typography.sizes?.subsection || '16px'};
    color: ${colors.text?.heading || '#333'};
    margin-bottom: 5px;
  }

  .section {
    margin-bottom: ${spacing.section?.marginBottom || '20px'};
  }

  .experience-item,
  .education-item,
  .project-item {
    margin-bottom: 15px;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;
  }

  .date {
    font-size: ${typography.sizes?.small || '12px'};
    color: ${colors.text?.muted || '#666'};
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .skill-item {
    padding: 5px 10px;
    background: ${colors.background?.section || '#f5f5f5'};
    border-radius: 4px;
  }

  ul {
    margin-left: 20px;
    margin-top: 5px;
  }

  li {
    margin-bottom: 3px;
  }

  .contact-info {
    margin-bottom: 15px;
  }

  .contact-item {
    margin-bottom: 5px;
    font-size: ${typography.sizes?.small || '12px'};
  }

  @media print {
    body {
      background: white;
    }
    .cv-container {
      max-width: 100%;
      padding: 0;
    }
  }
</style>
    `;
  }

  /**
   * Generate content HTML
   */
  private generateContent(cv: any, template: any, designConfig: any): string {
    const layoutType = template.layoutType;
    const sectionsConfig = template.sectionsConfig;
    const sectionsOrder = cv.sectionsOrder || sectionsConfig.default_order || [];
    const sectionsVisibility = cv.sectionsVisibility || {};

    if (layoutType === 'sidebar-left' || layoutType === 'sidebar-right') {
      const sidebarSections = sectionsConfig.sidebar_sections || ['personalInfo', 'skills', 'languages'];
      const mainSections = sectionsConfig.main_sections || ['experiences', 'education', 'projects'];

      const sidebarHTML = this.generateSidebarContent(cv, sidebarSections, sectionsVisibility);
      const mainHTML = this.generateMainContent(cv, mainSections, sectionsVisibility);

      if (layoutType === 'sidebar-left') {
        return `
          <div class="sidebar">${sidebarHTML}</div>
          <div class="main-content">${mainHTML}</div>
        `;
      } else {
        return `
          <div class="main-content">${mainHTML}</div>
          <div class="sidebar">${sidebarHTML}</div>
        `;
      }
    } else {
      // Single column layout
      return this.generateSingleColumnContent(cv, sectionsOrder, sectionsVisibility);
    }
  }

  private generateSidebarContent(cv: any, sections: string[], visibility: any): string {
    let html = '';

    // Personal Info Header
    if (cv.personalInfo) {
      const p = cv.personalInfo;
      html += `
        <div class="personal-header">
          ${p.photoUrl ? `<img src="${p.photoUrl}" alt="${p.fullName}" style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 15px;">` : ''}
          <h1>${p.fullName}</h1>
          ${p.jobTitle ? `<p style="font-size: 16px; margin-bottom: 15px;">${p.jobTitle}</p>` : ''}
        </div>
        <div class="contact-info">
          ${p.email ? `<div class="contact-item">📧 ${p.email}</div>` : ''}
          ${p.phone ? `<div class="contact-item">📱 ${p.phone}</div>` : ''}
          ${p.location ? `<div class="contact-item">📍 ${p.location}</div>` : ''}
          ${p.website ? `<div class="contact-item">🌐 ${p.website}</div>` : ''}
          ${p.linkedinUrl ? `<div class="contact-item">💼 LinkedIn</div>` : ''}
          ${p.githubUrl ? `<div class="contact-item">💻 GitHub</div>` : ''}
        </div>
      `;
    }

    // Skills
    if (sections.includes('skills') && visibility.skills !== false && cv.skills?.length > 0) {
      html += `
        <div class="section">
          <h2>Skills</h2>
          <div class="skills-grid">
            ${cv.skills.map((skill: any) => `
              <div class="skill-item">${skill.skillName}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Languages
    if (sections.includes('languages') && visibility.languages !== false && cv.languages?.length > 0) {
      html += `
        <div class="section">
          <h2>Languages</h2>
          ${cv.languages.map((lang: any) => `
            <div style="margin-bottom: 10px;">
              <strong>${lang.languageName}</strong>
              ${lang.proficiencyLevel ? `<span> - ${lang.proficiencyLevel}</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    return html;
  }

  private generateMainContent(cv: any, sections: string[], visibility: any): string {
    let html = '';

    // Summary
    if (cv.personalInfo?.summary) {
      html += `
        <div class="section">
          <h2>Summary</h2>
          <p>${cv.personalInfo.summary}</p>
        </div>
      `;
    }

    // Experiences
    if (sections.includes('experiences') && visibility.experiences !== false && cv.experiences?.length > 0) {
      html += `
        <div class="section">
          <h2>Experience</h2>
          ${cv.experiences.map((exp: any) => `
            <div class="experience-item">
              <div class="item-header">
                <h3>${exp.position} at ${exp.companyName}</h3>
                <span class="date">${this.formatDate(exp.startDate)} - ${exp.isCurrent ? 'Present' : this.formatDate(exp.endDate)}</span>
              </div>
              ${exp.location ? `<p style="color: #666; margin-bottom: 5px;">${exp.location}</p>` : ''}
              ${exp.description ? `<p>${exp.description}</p>` : ''}
              ${exp.achievements?.length > 0 ? `
                <ul>
                  ${exp.achievements.map((a: string) => `<li>${a}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Education
    if (sections.includes('education') && visibility.education !== false && cv.education?.length > 0) {
      html += `
        <div class="section">
          <h2>Education</h2>
          ${cv.education.map((edu: any) => `
            <div class="education-item">
              <div class="item-header">
                <h3>${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                <span class="date">${this.formatDate(edu.startDate)} - ${edu.isCurrent ? 'Present' : this.formatDate(edu.endDate)}</span>
              </div>
              <p>${edu.institutionName}</p>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Projects
    if (sections.includes('projects') && visibility.projects !== false && cv.projects?.length > 0) {
      html += `
        <div class="section">
          <h2>Projects</h2>
          ${cv.projects.map((proj: any) => `
            <div class="project-item">
              <h3>${proj.projectName}</h3>
              ${proj.description ? `<p>${proj.description}</p>` : ''}
              ${proj.technologies?.length > 0 ? `<p><strong>Technologies:</strong> ${proj.technologies.join(', ')}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    return html;
  }

  private generateSingleColumnContent(cv: any, sections: string[], visibility: any): string {
    // Similar to main content but includes all sections
    return this.generateMainContent(cv, sections, visibility);
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /**
   * Clear cache for a CV
   */
  async clearCache(cvId: string): Promise<void> {
    await this.prisma.cVRenderedCache.deleteMany({
      where: { cvId },
    });
  }
}
