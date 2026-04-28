import { CvData, Entry, FieldDef, PersonalInfo } from '@/types/cvEditor';
import { uid } from '@/constants/cvEditor';
import { EntryEditor } from './EntryEditor';
import { LangEditor } from './LangEditor';
import { SkillsEditor } from './SkillsEditor';

// ─── Field definitions ───
const EXP_FIELDS: FieldDef[] = [
  { key: 'title',    label: 'Chức vụ',    placeholder: 'Senior Developer' },
  { key: 'company',  label: 'Công ty',    placeholder: 'FPT Software' },
  { key: 'location', label: 'Địa điểm',   placeholder: 'Hà Nội' },
  { key: 'from',     label: 'Từ năm',     placeholder: '2021' },
  { key: 'to',       label: 'Đến năm',    placeholder: 'Hiện tại' },
  { key: 'desc',     label: 'Mô tả',      type: 'textarea', placeholder: 'Mô tả công việc...' },
];

const EDU_FIELDS: FieldDef[] = [
  { key: 'degree', label: 'Bằng cấp / Ngành', placeholder: 'Kỹ sư CNTT' },
  { key: 'school', label: 'Trường',            placeholder: 'Đại học Bách Khoa' },
  { key: 'from',   label: 'Từ năm',            placeholder: '2015' },
  { key: 'to',     label: 'Đến năm',           placeholder: '2019' },
  { key: 'desc',   label: 'Ghi chú',           type: 'textarea', placeholder: 'GPA, thành tích...' },
];

const PROJ_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Tên dự án',  placeholder: 'CV Builder' },
  { key: 'role', label: 'Vai trò',    placeholder: 'Lead Developer' },
  { key: 'tech', label: 'Công nghệ',  placeholder: 'React, Next.js...' },
  { key: 'link', label: 'Link',       placeholder: 'github.com/...' },
  { key: 'desc', label: 'Mô tả',      type: 'textarea', placeholder: 'Mô tả dự án...' },
];

const AWARD_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Tên chứng chỉ / Giải thưởng', placeholder: 'AWS Certified' },
  { key: 'org',   label: 'Tổ chức cấp',                  placeholder: 'Amazon Web Services' },
  { key: 'year',  label: 'Năm',                           placeholder: '2023' },
];

// ─── Component ───
interface SectionFormProps {
  sectionKey: string;
  data: CvData;
  onChange: (v: CvData) => void;
}

export function SectionForm({ sectionKey, data, onChange }: SectionFormProps) {
  // ── Personal ──
  if (sectionKey === 'personal') {
    const p = data.personal;
    const set = (f: keyof PersonalInfo, v: string) =>
      onChange({ ...data, personal: { ...p, [f]: v } });

    return (
      <div>
        <div className="field-group">
          <div className="field-label">Họ và tên</div>
          <input className="field-input" value={p.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="field-group">
          <div className="field-label">Chức danh</div>
          <input className="field-input" value={p.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field-group">
            <div className="field-label">Email</div>
            <input className="field-input" value={p.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="field-group">
            <div className="field-label">Điện thoại</div>
            <input className="field-input" value={p.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>
        <div className="field-row">
          <div className="field-group">
            <div className="field-label">Địa chỉ</div>
            <input className="field-input" value={p.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div className="field-group">
            <div className="field-label">Website / GitHub</div>
            <input className="field-input" value={p.website} onChange={(e) => set('website', e.target.value)} />
          </div>
        </div>
        <div className="field-group">
          <div className="field-label">Giới thiệu bản thân</div>
          <textarea
            className="field-textarea"
            value={p.summary}
            onChange={(e) => set('summary', e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>
      </div>
    );
  }

  // ── Experience ──
  if (sectionKey === 'experiences') {
    return (
      <EntryEditor
        entries={data.experiences as unknown as Entry[]}
        fields={EXP_FIELDS}
        addLabel="Thêm kinh nghiệm"
        onChange={(v) => onChange({ ...data, experiences: v as unknown as typeof data.experiences })}
      />
    );
  }

  // ── Education ──
  if (sectionKey === 'education') {
    return (
      <EntryEditor
        entries={data.education as unknown as Entry[]}
        fields={EDU_FIELDS}
        addLabel="Thêm học vấn"
        onChange={(v) => onChange({ ...data, education: v as unknown as typeof data.education })}
      />
    );
  }

  // ── Skills ──
  if (sectionKey === 'skills') {
    return (
      <SkillsEditor
        skills={(data.skills || []).map(s => typeof s === 'string' ? s : s.name)}
        onChange={(v) => {
          const newSkills = v.map(name => {
            const existing = (data.skills || []).find(s => (typeof s === 'string' ? s : s.name) === name);
            return typeof existing === 'object' ? existing : { id: uid(), name, proficiencyLevel: 'intermediate', proficiencyPercentage: 50, category: '' };
          });
          onChange({ ...data, skills: newSkills as any });
        }}
      />
    );
  }

  // ── Projects ──
  if (sectionKey === 'projects') {
    return (
      <EntryEditor
        entries={data.projects as unknown as Entry[]}
        fields={PROJ_FIELDS}
        addLabel="Thêm dự án"
        onChange={(v) => onChange({ ...data, projects: v as unknown as typeof data.projects })}
      />
    );
  }

  // ── Awards ──
  if (sectionKey === 'awards') {
    return (
      <EntryEditor
        entries={data.awards as unknown as Entry[]}
        fields={AWARD_FIELDS}
        addLabel="Thêm chứng chỉ"
        onChange={(v) => onChange({ ...data, awards: v as unknown as typeof data.awards })}
      />
    );
  }

  // ── Languages ──
  if (sectionKey === 'languages') {
    return (
      <LangEditor
        languages={data.languages}
        onChange={(v) => onChange({ ...data, languages: v })}
      />
    );
  }

  // ── Custom Sections ──
  if (sectionKey.startsWith('custom-')) {
    const section = data.customSections?.find(cs => cs.id === sectionKey);
    if (!section) return null;

    const customFields: FieldDef[] = [
      { key: 'title',       label: 'Tiêu đề',    placeholder: 'Tiêu đề mục...' },
      { key: 'subtitle',    label: 'Phụ đề',     placeholder: 'Công ty / Tổ chức...' },
      { key: 'dateRange',   label: 'Thời gian',  placeholder: '2024 - Hiện tại' },
      { key: 'description', label: 'Mô tả',      type: 'textarea', placeholder: 'Mô tả chi tiết...' },
    ];

    return (
      <div className="space-y-6">
        {/* Section Layout / Type Picker */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Kiểu hiển thị (Layout)</div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'list', label: 'D.Sách', icon: '📋' },
              { id: 'timeline', label: 'T.Line', icon: '📅' },
              { id: 'tags', label: 'Tags', icon: '🏷️' },
              { id: 'text', label: 'Văn bản', icon: '📝' },
              { id: 'grid', label: 'Lưới', icon: '🔲' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  const newCustomSections = data.customSections.map(cs => 
                    cs.id === sectionKey ? { ...cs, sectionType: t.id as any } : cs
                  );
                  onChange({ ...data, customSections: newCustomSections });
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                  (section.sectionType || 'list') === t.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-[10px] font-bold whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Field Visibility Settings */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cấu hình chi tiết</div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={section.fieldConfig?.showSubtitle !== false} 
                onChange={(e) => {
                  const newCustomSections = data.customSections.map(cs => 
                    cs.id === sectionKey ? { ...cs, fieldConfig: { ...(cs.fieldConfig || { showSubtitle: true, showDateRange: true, showDescription: true }), showSubtitle: e.target.checked } } : cs
                  );
                  onChange({ ...data, customSections: newCustomSections });
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Phụ đề</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={section.fieldConfig?.showDateRange !== false} 
                onChange={(e) => {
                  const newCustomSections = data.customSections.map(cs => 
                    cs.id === sectionKey ? { ...cs, fieldConfig: { ...(cs.fieldConfig || { showSubtitle: true, showDateRange: true, showDescription: true }), showDateRange: e.target.checked } } : cs
                  );
                  onChange({ ...data, customSections: newCustomSections });
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Thời gian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={section.fieldConfig?.showDescription !== false} 
                onChange={(e) => {
                  const newCustomSections = data.customSections.map(cs => 
                    cs.id === sectionKey ? { ...cs, fieldConfig: { ...(cs.fieldConfig || { showSubtitle: true, showDateRange: true, showDescription: true }), showDescription: e.target.checked } } : cs
                  );
                  onChange({ ...data, customSections: newCustomSections });
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Mô tả</span>
            </label>
          </div>
        </div>

        <EntryEditor
          entries={section.items as unknown as Entry[]}
          fields={customFields.filter(f => {
            if (f.key === 'subtitle') return section.fieldConfig?.showSubtitle !== false;
            if (f.key === 'dateRange') return section.fieldConfig?.showDateRange !== false;
            if (f.key === 'description') return section.fieldConfig?.showDescription !== false;
            return true;
          })}
          addLabel="Thêm mục mới"
          onChange={(v) => {
            const newCustomSections = data.customSections.map(cs => 
              cs.id === sectionKey ? { ...cs, items: v as unknown as typeof section.items } : cs
            );
            onChange({ ...data, customSections: newCustomSections });
          }}
        />
      </div>
    );
  }

  return null;
}