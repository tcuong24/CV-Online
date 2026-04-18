import { CvData, Entry, FieldDef, PersonalInfo } from '@/types/cvEditor';
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
        skills={data.skills}
        onChange={(v) => onChange({ ...data, skills: v })}
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

  return null;
}