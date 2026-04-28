import { ColorTheme, CvData, FontOption, StyleConfig } from '@/types/cvEditor';

// ─── Helpers ───
export const uid = () => Math.random().toString(36).slice(2, 8);

// ─── Google Fonts ───
export const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;600;700&family=Merriweather:wght@300;400;700&family=Nunito:wght@300;400;600;700&family=Fira+Code:wght@400;500&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.cdnfonts.com/css/garet');`

// ─── Color Themes ───
export const COLOR_THEMES: ColorTheme[] = [
  { id: 'teal', label: 'Teal', primary: '#0f766e', dark: '#134e4a', light: '#ccfbf1', text: '#fff' },
  { id: 'navy', label: 'Navy', primary: '#1e3a8a', dark: '#172554', light: '#dbeafe', text: '#fff' },
  { id: 'slate', label: 'Slate', primary: '#1c1917', dark: '#0c0a09', light: '#f5f5f4', text: '#fff' },
  { id: 'rose', label: 'Rose', primary: '#be123c', dark: '#881337', light: '#ffe4e6', text: '#fff' },
  { id: 'violet', label: 'Violet', primary: '#6d28d9', dark: '#4c1d95', light: '#ede9fe', text: '#fff' },
  { id: 'amber', label: 'Amber', primary: '#b45309', dark: '#78350f', light: '#fef3c7', text: '#fff' },
  { id: 'emerald', label: 'Emerald', primary: '#065f46', dark: '#064e3b', light: '#d1fae5', text: '#fff' },
  { id: 'sky', label: 'Sky', primary: '#0369a1', dark: '#0c4a6e', light: '#e0f2fe', text: '#fff' },
  { id: 'pink', label: 'Pink', primary: '#9d174d', dark: '#831843', light: '#fce7f3', text: '#fff' },
  { id: 'gray', label: 'Gray', primary: '#374151', dark: '#111827', light: '#f3f4f6', text: '#fff' },
];

// ─── Font Options ───
export const FONT_OPTIONS: FontOption[] = [
  // ── Sans-serif (clean, modern) ──────────────────────────────────────────────
  { id: 'inter', label: 'Inter', family: "'Inter', sans-serif", sample: 'Phổ biến nhất — rõ ràng' },
  { id: 'jakarta', label: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", sample: 'Hiện đại & tinh tế' },
  { id: 'opensans', label: 'Open Sans', family: "'Open Sans', sans-serif", sample: 'Cân bằng & dễ đọc' },
  { id: 'roboto', label: 'Roboto', family: "'Roboto', sans-serif", sample: 'Google style — trung tính' },
  { id: 'montserrat', label: 'Montserrat', family: "'Montserrat', sans-serif", sample: 'Hình học — ấn tượng' },
  { id: 'dm', label: 'DM Sans', family: "'DM Sans', sans-serif", sample: 'Tối giản & sắc nét' },
  { id: 'raleway', label: 'Raleway', family: "'Raleway', sans-serif", sample: 'Nhẹ nhàng & sang trọng' },
  { id: 'nunito', label: 'Nunito', family: "'Nunito', sans-serif", sample: 'Bo tròn — thân thiện' },
  { id: 'josefin', label: 'Josefin Sans', family: "'Josefin Sans', sans-serif", sample: 'Mảnh mai & cá tính' },
  { id: 'garet', label: 'Garet', family: "'Garet', sans-serif", sample: 'Geometric (Không hỗ trợ tiếng Việt)' },
  { id: 'jost', label: 'Jost', family: "'Jost', sans-serif", sample: 'Geometric — Thay thế Garet (Hỗ trợ tiếng Việt)' },
  { id: 'arial', label: 'Arial', family: "Arial, Helvetica, sans-serif", sample: 'Quen thuộc — chuẩn văn phòng' },

  // ── Serif (classic, academic, legal) ────────────────────────────────────────
  { id: 'lora', label: 'Lora', family: "'Lora', serif", sample: 'Cổ điển & văn chương' },
  { id: 'sourceserif', label: 'Source Serif 4', family: "'Source Serif 4', serif", sample: 'Học thuật — dễ đọc' },
  { id: 'merriweather', label: 'Merriweather', family: "'Merriweather', serif", sample: 'Trang trọng & truyền thống' },
  { id: 'garamond', label: 'EB Garamond', family: "'EB Garamond', serif", sample: 'Cổ điển Châu Âu' },
  { id: 'baskerville', label: 'Libre Baskerville', family: "'Libre Baskerville', serif", sample: 'Học viện & pháp lý' },
  { id: 'ptserif', label: 'PT Serif', family: "'PT Serif', serif", sample: 'Cân đối — đa dụng' },
  { id: 'crimson', label: 'Crimson Pro', family: "'Crimson Pro', serif", sample: 'Thanh lịch & mảnh' },
  { id: 'cormorant', label: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", sample: 'Cao cấp & tinh tế' },
  { id: 'playfair', label: 'Playfair Display', family: "'Playfair Display', serif", sample: 'Tiêu đề sang trọng' },
  { id: 'timesnewroman', label: 'Times New Roman', family: "'Times New Roman', Times, serif", sample: 'Chuẩn văn phòng truyền thống' },
];


// ─── Line Height Map ───
export const LH_MAP: Record<string, number> = { tight: 1.4, normal: 1.65, loose: 1.9 };

// ─── Section Meta (icons imported in component using this) ───
export const SECTION_META_CONFIG = {
  personal: { label: 'Thông tin cá nhân', colorBg: '#dbeafe', iconColor: '#2563eb' },
  experiences: { label: 'Kinh nghiệm', colorBg: '#dcfce7', iconColor: '#16a34a' },
  education: { label: 'Học vấn', colorBg: '#fef3c7', iconColor: '#d97706' },
  skills: { label: 'Kỹ năng', colorBg: '#fce7f3', iconColor: '#db2777' },
  projects: { label: 'Dự án', colorBg: '#ede9fe', iconColor: '#7c3aed' },
  awards: { label: 'Giải thưởng', colorBg: '#fff7ed', iconColor: '#ea580c' },
  certifications: { label: 'Chứng chỉ', colorBg: '#ecfdf5', iconColor: '#059669' },
  languages: { label: 'Ngoại ngữ', colorBg: '#e0f2fe', iconColor: '#0284c7' },
  references: { label: 'Người tham chiếu', colorBg: '#f0fdf4', iconColor: '#15803d' },
  interests: { label: 'Điều quan tâm', colorBg: '#fdf4ff', iconColor: '#a21caf' },
  activities: { label: 'Hoạt động', colorBg: '#fff1f2', iconColor: '#be123c' },
};

// ─── Default Data ───
export const DEFAULT_DATA: CvData = {
  personal: {
    name: 'Trần Văn A',
    role: 'Senior Frontend Developer',
    email: 'cuongtv@email.com',
    phone: '0912 345 678',
    location: 'Hà Nội, Việt Nam',
    website: 'github.com/cuongtv',
    summary: 'Frontend developer với 5+ năm kinh nghiệm xây dựng ứng dụng web hiệu suất cao. Đam mê UI/UX, clean code và các công nghệ hiện đại như React, Next.js, TypeScript.',
  },
  experiences: [
    { id: uid(), title: 'Senior Frontend Developer', company: 'FPT Software', location: 'Hà Nội', from: '2021', to: 'Hiện tại', desc: 'Phát triển và tối ưu ứng dụng web với React/Next.js. Cải thiện hiệu suất tải trang lên 40%. Mentor 3 junior developers.', open: false },
    { id: uid(), title: 'Frontend Developer', company: 'VNG Corporation', location: 'TP.HCM', from: '2019', to: '2021', desc: 'Xây dựng các tính năng mới cho nền tảng e-commerce với 2M+ người dùng.', open: false },
  ],
  education: [
    { id: uid(), degree: 'Kỹ sư Công nghệ Thông tin', school: 'Đại học Bách Khoa Hà Nội', from: '2015', to: '2019', desc: 'GPA: 3.6/4.0 — Tốt nghiệp loại Giỏi', open: false },
  ],
  skills: [
    { id: uid(), name: 'React', proficiencyLevel: 'advanced', proficiencyPercentage: 90, category: 'Frontend' },
    { id: uid(), name: 'Next.js', proficiencyLevel: 'advanced', proficiencyPercentage: 85, category: 'Frontend' },
    { id: uid(), name: 'TypeScript', proficiencyLevel: 'advanced', proficiencyPercentage: 88, category: 'Language' },
    { id: uid(), name: 'Tailwind CSS', proficiencyLevel: 'intermediate', proficiencyPercentage: 75, category: 'Frontend' },
    { id: uid(), name: 'Node.js', proficiencyLevel: 'intermediate', proficiencyPercentage: 70, category: 'Backend' },
    { id: uid(), name: 'Git', proficiencyLevel: 'advanced', proficiencyPercentage: 85, category: 'Tool' },
    { id: uid(), name: 'Figma', proficiencyLevel: 'intermediate', proficiencyPercentage: 65, category: 'Design' },
  ],
  projects: [
    { id: uid(), name: 'CV Builder Online', role: 'Lead Developer', tech: 'Next.js, dnd-kit', link: 'github.com/project', desc: 'Ứng dụng tạo CV online với drag & drop, preview realtime và export PDF.', open: false },
  ],
  awards: [
    { id: uid(), title: 'Top 3 — Hackathon FPT 2022', org: 'FPT Software', year: '2022', open: false },
  ],
  certifications: [
    { id: uid(), name: 'AWS Certified Developer', issuingOrganization: 'Amazon Web Services', issueDate: '2023', expiryDate: '', credentialId: '', credentialUrl: '', description: '', open: false },
  ],
  languages: [
    { id: uid(), lang: 'Tiếng Anh', level: 4 },
    { id: uid(), lang: 'Tiếng Nhật', level: 2 },
  ],
  references: [],
  interests: [],
  activities: [],
  customSections: [],
};

export const DEFAULT_ORDER = ['personal', 'experiences', 'education', 'skills', 'projects', 'awards', 'certifications', 'languages', 'references', 'interests', 'activities'];

/** Maps DB Template.layoutType → editor template key */
export const LAYOUT_MAP: Record<string, 'classic' | 'modern'> = {
  'single-column': 'classic',
  'sidebar-left': 'modern',
};


export const DEFAULT_STYLE: StyleConfig = {
  themeId: 'teal',
  fontId: 'jakarta',
  nameAlign: 'left',
  fontSize: 13,
  lineHeight: 'normal',
};