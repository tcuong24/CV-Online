'use client';

import React, { useState, useCallback } from 'react';
import { useCvEditorContext } from '@/components/editor/provider/CvEditorProvider';
import { useCvEditor } from '@/store';
import { CVWithRelations } from '@/types/cv';
import { GripVertical, Plus, Info } from 'lucide-react';

// ===== PLACEHOLDER DATA =====
const placeholderPersonalInfo = {
  fullName: 'Nguyễn Văn A',
  jobTitle: 'Vị trí ứng tuyển',
  email: 'email@example.com',
  phone: '0901 234 567',
  location: 'TP. Hồ Chí Minh',
  summary: 'Tóm tắt ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp của bạn...',
  website: '',
  linkedinUrl: '',
  githubUrl: '',
  photoUrl: '',
};

const placeholderExperiences = [
  { id: 'ph-exp-1', position: 'Software Engineer', companyName: 'Công ty ABC', startDate: '2022-01-01', endDate: '', isCurrent: true, description: 'Mô tả công việc, trách nhiệm và thành tích đạt được tại đây...' },
  { id: 'ph-exp-2', position: 'Junior Developer', companyName: 'Công ty XYZ', startDate: '2020-06-01', endDate: '2021-12-31', isCurrent: false, description: 'Mô tả kinh nghiệm làm việc trước đó...' },
];

const placeholderEducation = [
  { id: 'ph-edu-1', institutionName: 'Đại học Bách Khoa', degree: 'Cử nhân Công nghệ Thông tin', startDate: '2016-09-01', endDate: '2020-06-01', isCurrent: false, gpa: '3.5/4.0' },
];

const placeholderSkills = [
  { id: 'ph-skill-1', skillName: 'JavaScript' },
  { id: 'ph-skill-2', skillName: 'React' },
  { id: 'ph-skill-3', skillName: 'Node.js' },
  { id: 'ph-skill-4', skillName: 'TypeScript' },
  { id: 'ph-skill-5', skillName: 'CSS' },
];

const placeholderProjects = [
  { id: 'ph-proj-1', projectName: 'Tên dự án', startDate: '2023-01-01', projectUrl: 'https://example.com', description: 'Mô tả ngắn về dự án, công nghệ sử dụng và kết quả đạt được...' },
];

const placeholderLanguages = [
  { id: 'ph-lang-1', languageName: 'Tiếng Việt', proficiencyLevel: 'Bản ngữ' },
  { id: 'ph-lang-2', languageName: 'Tiếng Anh', proficiencyLevel: 'Trung cấp' },
];

const placeholderCertifications = [
  { id: 'ph-cert-1', name: 'Tên chứng chỉ', issuer: 'Tổ chức cấp', date: '2023-06-01' },
];

const placeholderHobbies = [
  { id: 'ph-hobby-1', name: 'Đọc sách' },
  { id: 'ph-hobby-2', name: 'Du lịch' },
  { id: 'ph-hobby-3', name: 'Lập trình' },
];

// Wrapper to distinguish placeholder content
const PlaceholderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative opacity-40 pointer-events-none select-none">
    {children}
  </div>
);

interface SectionRendererProps {
    sectionId: string;
}

// Editable text component for WYSIWYG editing
interface EditableTextProps {
    value: string;
    onChange?: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
    placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
    value, 
    onChange, 
    className = '', 
    style,
    as: Component = 'span',
    placeholder = 'Click to edit...'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        setIsEditing(false);
        if (onChange) {
            onChange(e.currentTarget.innerText);
        }
    };

    return (
        <Component
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            className={`outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-0.5 -mx-0.5 transition-all cursor-text ${className}`}
            style={style}
            data-placeholder={!value ? placeholder : undefined}
        >
            {value || ''}
        </Component>
    );
};

// Renderers for different section types
// Helper for dynamic styles
const useThemeStyles = () => {
    return {
        primaryText: { color: 'var(--cv-color-primary)' },
        primaryBorder: { borderColor: 'var(--cv-color-primary)' },
        mutedText: { color: 'var(--cv-color-text-muted)' },
        bodyText: { color: 'var(--cv-color-text-body)' },
        headingFont: { fontFamily: 'var(--cv-font-heading)' },
        bodyFont: { fontFamily: 'var(--cv-font-body)' },
    };
};

const PersonalInfoRenderer = ({ data, onUpdate }: { data: any; onUpdate?: (field: string, value: any) => void }) => {
    const isPlaceholder = !data;
    const displayData = data || placeholderPersonalInfo;
    console.log("123",data);
    
    const content = (
        <div 
            style={{ marginBottom: 'var(--cv-spacing-section-mb)' }}
            className="group relative hover:bg-blue-50/30 rounded-lg transition-colors -m-2 p-2"
        >
            {/* Edit indicator */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            
            {displayData.photoUrl && (
                <img 
                    src={displayData.photoUrl} 
                    alt={displayData.fullName} 
                    className="w-32 h-32 rounded-full object-cover mb-4 mx-auto cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                />
            )}
            <EditableText
                value={displayData.fullName}
                onChange={(val) => onUpdate?.('fullName', val)}
                as="h1"
                className="font-bold mb-2"
                style={{ fontSize: 'var(--cv-text-size-name)', color: 'var(--cv-color-primary)' }}
                placeholder="Họ và tên"
            />
            <EditableText
                value={displayData.jobTitle || ''}
                onChange={(val) => onUpdate?.('jobTitle', val)}
                as="p"
                style={{ fontSize: 'var(--cv-text-size-subsection)', color: 'var(--cv-color-text-muted)' }}
                className="mb-4"
                placeholder="Vị trí công việc"
            />
            
            <div className="space-y-1" style={{ fontSize: 'var(--cv-text-size-small)', color: 'var(--cv-color-text-muted)' }}>
                {displayData.email && <div>📧 {displayData.email}</div>}
                {displayData.phone && <div>📱 {displayData.phone}</div>}
                {displayData.location && <div>📍 {displayData.location}</div>}
                {displayData.website && <div>🌐 {displayData.website}</div>}
                {displayData.linkedinUrl && <div>💼 LinkedIn</div>}
                {displayData.githubUrl && <div>🐙 GitHub</div>}
            </div>
            
            {(displayData.summary || true) && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--cv-border-color)' }}>
                    <EditableText
                        value={displayData.summary || ''}
                        onChange={(val) => onUpdate?.('summary', val)}
                        as="p"
                        style={{ fontSize: 'var(--cv-text-size-body)' }}
                        className="leading-relaxed"
                        placeholder="Tóm tắt bản thân..."
                    />
                </div>
            )}
        </div>
    );

    return isPlaceholder ? <PlaceholderWrapper>{content}</PlaceholderWrapper> : content;
};

interface ListRendererProps {
    title: string;
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    onAddItem?: () => void;
}

const ListRenderer: React.FC<ListRendererProps> = ({ title, items, renderItem, onAddItem }) => {
    return (
        <div 
            style={{ marginBottom: 'var(--cv-spacing-section-mb)' }}
            className="group/section relative"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold border-b pb-1 uppercase tracking-wide flex-1" 
                    style={{ 
                        fontSize: 'var(--cv-text-size-section-title)', 
                        color: 'var(--cv-color-primary)',
                        borderColor: 'var(--cv-color-primary)',
                        borderBottomWidth: 'var(--cv-border-width)'
                    }}
                >
                    {title}
                </h2>
                {/* Add button */}
                <button 
                    onClick={onAddItem}
                    className="opacity-0 group-hover/section:opacity-100 ml-2 p-1 hover:bg-blue-100 rounded transition-all"
                    title={`Thêm ${title}`}
                >
                    <Plus className="w-4 h-4 text-blue-600" />
                </button>
            </div>
            
            <div className="flex flex-col" style={{ gap: 'var(--cv-spacing-element-gap)' }}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="group/item relative hover:bg-blue-50/30 rounded-lg transition-colors -mx-2 px-2 py-1"
                        >
                            {/* Drag handle */}
                            <div className="absolute -left-4 top-2 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-grab">
                                <GripVertical className="w-3 h-3 text-gray-400" />
                            </div>
                            {renderItem(item, index)}
                        </div>
                    ))
                ) : (
                    <div 
                        onClick={onAddItem}
                        className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                    >
                        <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-sm text-gray-500">Thêm {title.toLowerCase()}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({ sectionId }) => {
    const { currentCV } = useCvEditorContext();
    
    // Check visibility
    if (currentCV?.sectionsVisibility?.[sectionId] === false) {
        return null;
    }

    const cv = currentCV as CVWithRelations; // Type assertion since we know it's loaded

    switch (sectionId) {
        case 'personalInfo':
            return <PersonalInfoRenderer data={cv?.personalInfo} />;
        
        case 'experiences': {
            const expItems = cv?.experiences || [];
            const expIsPlaceholder = expItems.length === 0;
            const expDisplay = expIsPlaceholder ? placeholderExperiences : expItems;
            const expContent = (
                <ListRenderer 
                    title="Kinh nghiệm làm việc" 
                    items={expDisplay}
                    renderItem={(exp) => (
                        <div className="relative pl-4 border-l-2 border-gray-200 ml-1">
                             <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--cv-color-primary)' }}></div>
                            <div className="flex justify-between items-baseline mb-1">
                                <EditableText
                                    value={exp.position}
                                    as="h3"
                                    className="font-bold"
                                    style={{ fontSize: 'var(--cv-text-size-subsection)' }}
                                    placeholder="Vị trí công việc"
                                />
                                <span className="whitespace-nowrap ml-4" style={{ fontSize: 'var(--cv-text-size-small)', color: 'var(--cv-color-text-muted)' }}>
                                    {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Hiện tại' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                                </span>
                            </div>
                            <EditableText
                                value={exp.companyName}
                                as="div"
                                className="font-medium mb-1"
                                style={{ fontSize: 'var(--cv-text-size-body)', color: 'var(--cv-color-primary)' }}
                                placeholder="Tên công ty"
                            />
                            <EditableText
                                value={exp.description || ''}
                                as="p"
                                className="whitespace-pre-wrap"
                                style={{ fontSize: 'var(--cv-text-size-body)', color: 'var(--cv-color-text-body)' }}
                                placeholder="Mô tả công việc..."
                            />
                        </div>
                    )}
                />
            );
            return expIsPlaceholder ? <PlaceholderWrapper>{expContent}</PlaceholderWrapper> : expContent;
        }

        case 'education': {
            const eduItems = cv?.education || [];
            const eduIsPlaceholder = eduItems.length === 0;
            const eduDisplay = eduIsPlaceholder ? placeholderEducation : eduItems;
            const eduContent = (
                <ListRenderer 
                     title="Học vấn" 
                     items={eduDisplay} 
                     renderItem={(edu) => (
                        <div>
                             <div className="flex justify-between items-baseline mb-1">
                                <EditableText
                                    value={edu.institutionName}
                                    as="h3"
                                    className="font-bold"
                                    style={{ fontSize: 'var(--cv-text-size-subsection)' }}
                                    placeholder="Tên trường"
                                />
                                <span className="whitespace-nowrap ml-4" style={{ fontSize: 'var(--cv-text-size-small)', color: 'var(--cv-color-text-muted)' }}>
                                    {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Hiện tại' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')}
                                </span>
                            </div>
                            <EditableText
                                value={edu.degree}
                                as="div"
                                style={{ fontSize: 'var(--cv-text-size-body)' }}
                                placeholder="Bằng cấp / Chuyên ngành"
                            />
                             {edu.gpa && <div className="mt-1" style={{ fontSize: 'var(--cv-text-size-small)', color: 'var(--cv-color-text-muted)' }}>GPA: {edu.gpa}</div>}
                        </div>
                     )}
                />
            );
            return eduIsPlaceholder ? <PlaceholderWrapper>{eduContent}</PlaceholderWrapper> : eduContent;
        }

        case 'skills': {
            const skillItems = cv?.skills || [];
            const skillIsPlaceholder = skillItems.length === 0;
            const skillDisplay = skillIsPlaceholder ? placeholderSkills : skillItems;
            const skillContent = (
                <ListRenderer
                    title="Kỹ năng"
                    items={skillDisplay}
                    renderItem={(skill) => (
                        <span className="inline-block text-white px-2 py-1 rounded mr-2 mb-2" 
                              style={{ backgroundColor: 'var(--cv-color-secondary)', fontSize: 'var(--cv-text-size-small)' }}>
                            <EditableText
                                value={skill.skillName}
                                as="span"
                                className="text-white"
                                placeholder="Kỹ năng"
                            />
                        </span>
                    )}
                />
            );
            return skillIsPlaceholder ? <PlaceholderWrapper>{skillContent}</PlaceholderWrapper> : skillContent;
        }
         
        case 'projects': {
            const projItems = cv?.projects || [];
            const projIsPlaceholder = projItems.length === 0;
            const projDisplay = projIsPlaceholder ? placeholderProjects : projItems;
            const projContent = (
                <ListRenderer
                    title="Dự án"
                    items={projDisplay}
                    renderItem={(proj) => (
                        <div>
                            <div className="flex justify-between items-baseline mb-1">
                                <EditableText
                                    value={proj.projectName}
                                    as="h3"
                                    className="font-bold"
                                    style={{ fontSize: 'var(--cv-text-size-subsection)' }}
                                    placeholder="Tên dự án"
                                />
                                <span className="whitespace-nowrap ml-4" style={{ fontSize: 'var(--cv-text-size-small)', color: 'var(--cv-color-text-muted)' }}>
                                     {proj.startDate && new Date(proj.startDate).getFullYear()}
                                </span>
                            </div>
                            {proj.projectUrl && (
                                <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="hover:underline block mb-1" style={{ color: 'var(--cv-color-accent)', fontSize: 'var(--cv-text-size-small)' }}>
                                    {proj.projectUrl}
                                </a>
                            )}
                            <EditableText
                                value={proj.description || ''}
                                as="p"
                                style={{ fontSize: 'var(--cv-text-size-body)' }}
                                placeholder="Mô tả dự án..."
                            />
                        </div>
                    )}
                />
            );
            return projIsPlaceholder ? <PlaceholderWrapper>{projContent}</PlaceholderWrapper> : projContent;
        }
        
        case 'languages': {
            const langItems = cv?.languages || [];
            const langIsPlaceholder = langItems.length === 0;
            const langDisplay = langIsPlaceholder ? placeholderLanguages : langItems;
            const langContent = (
                <ListRenderer
                    title="Ngôn ngữ"
                    items={langDisplay}
                    renderItem={(lang) => (
                        <div className="flex justify-between" style={{ fontSize: 'var(--cv-text-size-body)' }}>
                            <EditableText
                                value={lang.languageName}
                                as="span"
                                className="font-medium"
                                placeholder="Ngôn ngữ"
                            />
                            <EditableText
                                value={lang.proficiencyLevel || ''}
                                as="span"
                                style={{ color: 'var(--cv-color-text-muted)' }}
                                placeholder="Trình độ"
                            />
                        </div>
                    )}
                />
            );
            return langIsPlaceholder ? <PlaceholderWrapper>{langContent}</PlaceholderWrapper> : langContent;
        }

        case 'certifications': {
            const certItems = cv?.certifications || [];
            const certIsPlaceholder = certItems.length === 0;
            const certDisplay = certIsPlaceholder ? placeholderCertifications : certItems;
            const certContent = (
                <ListRenderer
                    title="Chứng chỉ"
                    items={certDisplay}
                    renderItem={(cert) => (
                        <div>
                            <div className="flex justify-between items-baseline mb-1">
                                <EditableText
                                    value={cert.name}
                                    as="h3"
                                    className="font-bold"
                                    style={{ fontSize: 'var(--cv-text-size-subsection)' }}
                                    placeholder="Tên chứng chỉ"
                                />
                                <span className="whitespace-nowrap ml-4" style={{ fontSize: 'var(--cv-text-size-small)', color: 'var(--cv-color-text-muted)' }}>
                                    {cert.date && new Date(cert.date).getFullYear()}
                                </span>
                            </div>
                            <EditableText
                                value={cert.issuer || ''}
                                as="div"
                                style={{ fontSize: 'var(--cv-text-size-body)', color: 'var(--cv-color-text-muted)' }}
                                placeholder="Tổ chức cấp"
                            />
                        </div>
                    )}
                />
            );
            return certIsPlaceholder ? <PlaceholderWrapper>{certContent}</PlaceholderWrapper> : certContent;
        }

        case 'hobbies': {
            const hobbyItems = (cv as any)?.hobbies || [];
            const hobbyIsPlaceholder = hobbyItems.length === 0;
            const hobbyDisplay = hobbyIsPlaceholder ? placeholderHobbies : hobbyItems;
            const hobbyContent = (
                <ListRenderer
                    title="Sở thích"
                    items={hobbyDisplay}
                    renderItem={(hobby) => (
                        <span className="inline-block px-3 py-1 rounded-full mr-2 mb-2 border" 
                              style={{ fontSize: 'var(--cv-text-size-small)', borderColor: 'var(--cv-color-secondary)', color: 'var(--cv-color-text-body)' }}>
                            <EditableText
                                value={hobby.name}
                                as="span"
                                placeholder="Sở thích"
                            />
                        </span>
                    )}
                />
            );
            return hobbyIsPlaceholder ? <PlaceholderWrapper>{hobbyContent}</PlaceholderWrapper> : hobbyContent;
        }
    }

    return null;
};
