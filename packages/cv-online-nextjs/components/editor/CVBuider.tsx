'use client';

import { useState, useRef } from "react";
import {
  MdDragIndicator, MdAdd, MdDelete, MdPerson, MdWork,
  MdSchool, MdStar, MdCode, MdEmojiEvents, MdLanguage,
  MdEmail, MdPhone, MdLocationOn, MdLink, MdPalette, MdTextFields, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdLayers,
} from "react-icons/md";

// ─── Types ───
interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  from: string;
  to: string;
  desc: string;
  open: boolean;
}

interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  from: string;
  to: string;
  desc: string;
  open: boolean;
}

interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  tech: string;
  link: string;
  desc: string;
  open: boolean;
}

interface AwardEntry {
  id: string;
  title: string;
  org: string;
  year: string;
  open: boolean;
}

interface LanguageEntry {
  id: string;
  lang: string;
  level: number;
}

interface CvData {
  personal: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  awards: AwardEntry[];
  languages: LanguageEntry[];
}

interface StyleConfig {
  themeId: string;
  fontId: string;
  nameAlign: string;
  fontSize: number;
  lineHeight: string;
}

interface FieldDef {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
}

type Entry = Record<string, string | boolean>;

// ─── Google Fonts ───
const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;600;700&family=Merriweather:wght@300;400;700&family=Nunito:wght@300;400;600;700&family=Fira+Code:wght@400;500&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const globalCss = `
${GFONTS}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #f0ede8; --surface: #fff; --border: #e2ddd8;
  --ink: #1c1917; --muted: #78716c; --subtle: #a8a29e;
  --accent: #0f766e; --accent2: #0d9488; --accent-bg: #f0fdf4;
  --danger: #dc2626; --radius: 10px;
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
}
body { background: var(--bg); font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink); }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
.app { display: flex; height: 100vh; overflow: hidden; }

/* ── Sidebar ── */
.sidebar { width: 360px; min-width: 300px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.sidebar-header { padding: 16px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.logo { display: flex; align-items: center; gap: 10px; }
.logo-mark { width: 30px; height: 30px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 13px; }
.logo-text { font-size: 14px; font-weight: 700; color: var(--ink); letter-spacing: -0.3px; }
.logo-sub { font-size: 10px; color: var(--subtle); }

/* Tab nav */
.tab-nav { display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.tab-btn { flex: 1; padding: 10px 4px; border: none; background: transparent; font-family: inherit; font-size: 11px; font-weight: 600; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; border-bottom: 2px solid transparent; transition: all 0.15s; }
.tab-btn:hover { color: var(--ink); background: #fafafa; }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); background: #fafffe; }

.sidebar-body { flex: 1; overflow-y: auto; padding: 12px; }

/* Section card */
.section-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 8px; transition: box-shadow 0.15s, border-color 0.15s; }
.section-card.dragging { box-shadow: var(--shadow-lg); border-color: var(--accent); opacity: 0.95; }
.section-card.drag-over { border-color: var(--accent); background: #f0fdf9; }
.section-header { display: flex; align-items: center; gap: 8px; padding: 11px 13px; cursor: pointer; user-select: none; border-radius: var(--radius); }
.section-header:hover { background: #fafaf9; }
.drag-handle { color: var(--subtle); cursor: grab; display: flex; align-items: center; border-radius: 4px; }
.drag-handle:hover { color: var(--accent); }
.section-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px; }
.section-title-wrap { flex: 1; min-width: 0; }
.section-title { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.section-count { font-size: 10.5px; color: var(--subtle); }
.icon-btn { width: 26px; height: 26px; border: none; background: transparent; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--subtle); transition: all 0.12s; }
.icon-btn:hover { background: var(--border); color: var(--ink); }
.icon-btn.danger:hover { background: #fee2e2; color: var(--danger); }

/* Form fields */
.section-body { padding: 0 13px 13px; }
.field-group { margin-bottom: 9px; }
.field-label { font-size: 10.5px; font-weight: 600; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.field-input, .field-textarea, .field-select { width: 100%; padding: 7px 10px; font-size: 12.5px; font-family: inherit; border: 1px solid var(--border); border-radius: 7px; outline: none; background: #fafafa; color: var(--ink); transition: border-color 0.12s, box-shadow 0.12s; }
.field-input:focus, .field-textarea:focus, .field-select:focus { border-color: var(--accent); background: white; box-shadow: 0 0 0 3px rgba(15,118,110,0.08); }
.field-textarea { resize: vertical; min-height: 70px; line-height: 1.5; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.entry-card { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 7px; background: #fafafa; overflow: hidden; }
.entry-header { display: flex; align-items: center; gap: 7px; padding: 9px 11px; cursor: pointer; }
.entry-header:hover { background: #f4f4f3; }
.entry-title { font-size: 12px; font-weight: 500; flex: 1; color: var(--ink); }
.entry-meta { font-size: 10px; color: var(--subtle); }
.entry-body { padding: 0 11px 11px; border-top: 1px solid var(--border); }
.add-btn { width: 100%; padding: 7px; border: 1.5px dashed var(--border); border-radius: 8px; background: transparent; font-size: 11.5px; font-weight: 600; color: var(--subtle); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; font-family: inherit; transition: all 0.12s; margin-top: 7px; }
.add-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.skills-grid { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px; }
.skill-chip { display: flex; align-items: center; gap: 4px; padding: 3px 9px; background: var(--accent-bg); border: 1px solid rgba(15,118,110,0.2); border-radius: 99px; font-size: 11.5px; font-weight: 500; color: var(--accent); }
.skill-chip button { background: none; border: none; cursor: pointer; color: inherit; font-size: 13px; line-height: 1; padding: 0; }
.skill-input-row { display: flex; gap: 6px; }
.skill-input-row .field-input { flex: 1; }
.skill-add { padding: 7px 11px; background: var(--accent); color: white; border: none; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); cursor: pointer; transition: background 0.12s; }
.lang-dot.filled { background: var(--accent); }

/* ── Style Panel ── */
.style-panel { padding: 14px; }
.style-section { margin-bottom: 20px; }
.style-section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--subtle); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }

/* Color palette swatches */
.color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.color-swatch { width: 100%; aspect-ratio: 1; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: transform 0.12s, border-color 0.12s; position: relative; }
.color-swatch:hover { transform: scale(1.1); }
.color-swatch.active { border-color: var(--ink); transform: scale(1.08); }
.color-swatch.active::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4); }

/* Font options */
.font-grid { display: flex; flex-direction: column; gap: 5px; }
.font-option { padding: 8px 10px; border: 1.5px solid var(--border); border-radius: 8px; cursor: pointer; transition: all 0.12s; display: flex; align-items: center; justify-content: space-between; }
.font-option:hover { border-color: var(--accent); background: var(--accent-bg); }
.font-option.active { border-color: var(--accent); background: var(--accent-bg); }
.font-option-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.font-option-sample { font-size: 11px; color: var(--subtle); }

/* Align buttons */
.align-row { display: flex; gap: 6px; }
.align-btn { flex: 1; padding: 8px; border: 1.5px solid var(--border); border-radius: 8px; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 18px; transition: all 0.12s; }
.align-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.align-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

/* Font size slider */
.slider-row { display: flex; align-items: center; gap: 10px; }
.slider { flex: 1; -webkit-appearance: none; height: 4px; border-radius: 2px; background: var(--border); outline: none; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); cursor: pointer; }
.slider-val { font-size: 12px; font-family: 'DM Mono', monospace; color: var(--muted); min-width: 28px; text-align: right; }

/* Line height */
.line-height-opts { display: flex; gap: 6px; }
.lh-btn { flex: 1; padding: 6px 4px; border: 1.5px solid var(--border); border-radius: 7px; background: transparent; cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 600; color: var(--muted); transition: all 0.12s; }
.lh-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.lh-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

/* ── Preview ── */
.preview-area { flex: 1; overflow-y: auto; padding: 20px; background: var(--bg); display: flex; flex-direction: column; align-items: center; }
.preview-toolbar { width: 100%; max-width: 680px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.preview-label { font-size: 10.5px; font-weight: 700; color: var(--subtle); text-transform: uppercase; letter-spacing: 0.08em; }
.template-pills { display: flex; gap: 5px; }
.template-pill { padding: 4px 11px; border-radius: 99px; font-size: 11px; font-weight: 600; border: 1.5px solid var(--border); background: white; cursor: pointer; color: var(--muted); transition: all 0.12s; font-family: inherit; }
.template-pill.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.cv-paper { width: 100%; max-width: 680px; background: white; box-shadow: var(--shadow-lg); border-radius: 3px; min-height: 960px; overflow: hidden; }
`;

// ─── Color themes ───
const COLOR_THEMES = [
  { id: "teal",    label: "Teal",    primary: "#0f766e", dark: "#134e4a", light: "#ccfbf1", text: "#fff" },
  { id: "navy",    label: "Navy",    primary: "#1e3a8a", dark: "#172554", light: "#dbeafe", text: "#fff" },
  { id: "slate",   label: "Slate",   primary: "#1c1917", dark: "#0c0a09", light: "#f5f5f4", text: "#fff" },
  { id: "rose",    label: "Rose",    primary: "#be123c", dark: "#881337", light: "#ffe4e6", text: "#fff" },
  { id: "violet",  label: "Violet",  primary: "#6d28d9", dark: "#4c1d95", light: "#ede9fe", text: "#fff" },
  { id: "amber",   label: "Amber",   primary: "#b45309", dark: "#78350f", light: "#fef3c7", text: "#fff" },
  { id: "emerald", label: "Emerald", primary: "#065f46", dark: "#064e3b", light: "#d1fae5", text: "#fff" },
  { id: "sky",     label: "Sky",     primary: "#0369a1", dark: "#0c4a6e", light: "#e0f2fe", text: "#fff" },
  { id: "pink",    label: "Pink",    primary: "#9d174d", dark: "#831843", light: "#fce7f3", text: "#fff" },
  { id: "gray",    label: "Gray",    primary: "#374151", dark: "#111827", light: "#f3f4f6", text: "#fff" },
];

// ─── Font options ───
const FONT_OPTIONS = [
  { id: "jakarta",    label: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif",   sample: "Modern & Clean" },
  { id: "lora",       label: "Lora",              family: "'Lora', serif",                      sample: "Elegant Serif" },
  { id: "raleway",    label: "Raleway",            family: "'Raleway', sans-serif",              sample: "Geometric Sans" },
  { id: "merriweather", label: "Merriweather",    family: "'Merriweather', serif",              sample: "Traditional" },
  { id: "nunito",     label: "Nunito",             family: "'Nunito', sans-serif",               sample: "Friendly Round" },
  { id: "crimson",    label: "Crimson Pro",        family: "'Crimson Pro', serif",               sample: "Literary Serif" },
  { id: "dm",         label: "DM Sans",            family: "'DM Sans', sans-serif",             sample: "Minimal Sans" },
];

const uid = () => Math.random().toString(36).slice(2, 8);

const SECTION_META = {
  personal:   { label: "Thông tin cá nhân",      icon: <MdPerson />,      color: "#dbeafe", iconColor: "#2563eb" },
  experience: { label: "Kinh nghiệm",             icon: <MdWork />,        color: "#dcfce7", iconColor: "#16a34a" },
  education:  { label: "Học vấn",                 icon: <MdSchool />,      color: "#fef3c7", iconColor: "#d97706" },
  skills:     { label: "Kỹ năng",                 icon: <MdStar />,        color: "#fce7f3", iconColor: "#db2777" },
  projects:   { label: "Dự án / Portfolio",       icon: <MdCode />,        color: "#ede9fe", iconColor: "#7c3aed" },
  awards:     { label: "Chứng chỉ & Giải thưởng", icon: <MdEmojiEvents />, color: "#fff7ed", iconColor: "#ea580c" },
  languages:  { label: "Ngoại ngữ",              icon: <MdLanguage />,    color: "#e0f2fe", iconColor: "#0284c7" },
};

const DEFAULT_DATA = {
  personal: { name: "Nguyễn Văn An", role: "Senior Frontend Developer", email: "nguyenvanan@email.com", phone: "0912 345 678", location: "Hà Nội, Việt Nam", website: "github.com/nguyenvanan", summary: "Frontend developer với 5+ năm kinh nghiệm xây dựng ứng dụng web hiệu suất cao. Đam mê UI/UX, clean code và các công nghệ hiện đại như React, Next.js, TypeScript." },
  experience: [
    { id: uid(), title: "Senior Frontend Developer", company: "FPT Software", location: "Hà Nội", from: "2021", to: "Hiện tại", desc: "Phát triển và tối ưu ứng dụng web với React/Next.js. Cải thiện hiệu suất tải trang lên 40%. Mentor 3 junior developers.", open: false },
    { id: uid(), title: "Frontend Developer", company: "VNG Corporation", location: "TP.HCM", from: "2019", to: "2021", desc: "Xây dựng các tính năng mới cho nền tảng e-commerce với 2M+ người dùng.", open: false },
  ],
  education: [{ id: uid(), degree: "Kỹ sư Công nghệ Thông tin", school: "Đại học Bách Khoa Hà Nội", from: "2015", to: "2019", desc: "GPA: 3.6/4.0 — Tốt nghiệp loại Giỏi", open: false }],
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Git", "Figma"],
  projects: [{ id: uid(), name: "CV Builder Online", role: "Lead Developer", tech: "Next.js, dnd-kit", link: "github.com/project", desc: "Ứng dụng tạo CV online với drag & drop, preview realtime và export PDF.", open: false }],
  awards: [
    { id: uid(), title: "AWS Certified Developer", org: "Amazon Web Services", year: "2023", open: false },
    { id: uid(), title: "Top 3 — Hackathon FPT 2022", org: "FPT Software", year: "2022", open: false },
  ],
  languages: [{ id: uid(), lang: "Tiếng Anh", level: 4 }, { id: uid(), lang: "Tiếng Nhật", level: 2 }],
};

const DEFAULT_ORDER = ["personal","experience","education","skills","projects","awards","languages"];

const DEFAULT_STYLE = {
  themeId: "teal",
  fontId: "jakarta",
  nameAlign: "left",
  fontSize: 13,
  lineHeight: "normal",
};

// ─── Sub-editors ───
function SkillsEditor({ skills, onChange }: { skills: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v && !skills.includes(v)) { onChange([...skills, v]); setInput(""); } };
  return (
    <div>
      <div className="skill-input-row">
        <input className="field-input" placeholder="Thêm kỹ năng..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} />
        <button className="skill-add" onClick={add}><MdAdd size={15} /></button>
      </div>
      <div className="skills-grid">{skills.map(s => (<span key={s} className="skill-chip">{s}<button onClick={() => onChange(skills.filter(x => x !== s))}>×</button></span>))}</div>
    </div>
  );
}

function LangEditor({ languages, onChange }: { languages: LanguageEntry[]; onChange: (v: LanguageEntry[]) => void }) {
  const update = (id: string, f: keyof LanguageEntry, v: string | number) => onChange(languages.map(l => l.id === id ? { ...l, [f]: v } : l));
  const add = () => onChange([...languages, { id: uid(), lang: "", level: 3 }]);
  const remove = (id: string) => onChange(languages.filter(l => l.id !== id));
  return (
    <div>
      {languages.map(l => (
        <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input className="field-input" placeholder="Ngôn ngữ" value={l.lang} onChange={e => update(l.id, "lang", e.target.value)} />
          <div style={{ display: "flex", gap: 4 }}>{[1,2,3,4,5].map(i => <div key={i} className={`lang-dot${l.level >= i ? " filled" : ""}`} onClick={() => update(l.id, "level", i)} />)}</div>
          <button className="icon-btn danger" onClick={() => remove(l.id)}><MdDelete size={14} /></button>
        </div>
      ))}
      <button className="add-btn" onClick={add}><MdAdd size={13} /> Thêm ngôn ngữ</button>
    </div>
  );
}

function EntryEditor({ entries, fields, addLabel, onChange }: { entries: Entry[]; fields: FieldDef[]; addLabel: string; onChange: (v: Entry[]) => void }) {
  const update = (id: string, f: string, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));
  const toggle = (id: string) => onChange(entries.map(e => e.id === id ? { ...e, open: !e.open } : e));
  const remove = (id: string) => onChange(entries.filter(e => e.id !== id));
  const add = () => onChange([...entries, { id: uid(), open: true, ...fields.reduce((a: Record<string, string>, f: FieldDef) => ({ ...a, [f.key]: "" }), {}) }]);
  return (
    <div>
      {entries.map(e => (
        <div key={e.id} className="entry-card">
          <div className="entry-header" onClick={() => toggle(e.id)}>
            <span style={{ fontSize: 14, color: "var(--subtle)", transform: e.open ? "rotate(180deg)" : "", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
            <div style={{ flex: 1 }}>
              <div className="entry-title">{e[fields[0].key] || "Chưa đặt tên"}</div>
              {fields[1] && e[fields[1].key] && <div className="entry-meta">{e[fields[1].key]}</div>}
            </div>
            <button className="icon-btn danger" onClick={ev => { ev.stopPropagation(); remove(e.id); }}><MdDelete size={13} /></button>
          </div>
          {e.open && (
            <div className="entry-body">
              {fields.map(f => (
                <div className="field-group" key={f.key}>
                  <div className="field-label">{f.label}</div>
                  {f.type === "textarea"
                    ? <textarea className="field-textarea" value={e[f.key] || ""} onChange={ev => update(e.id, f.key, ev.target.value)} placeholder={f.placeholder || ""} />
                    : <input className="field-input" value={e[f.key] || ""} onChange={ev => update(e.id, f.key, ev.target.value)} placeholder={f.placeholder || ""} />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button className="add-btn" onClick={add}><MdAdd size={13} /> {addLabel}</button>
    </div>
  );
}

function SectionForm({ sectionKey, data, onChange }: { sectionKey: string; data: CvData; onChange: (v: CvData) => void }) {
  const expFields: FieldDef[] = [
    { key: "title", label: "Chức vụ", placeholder: "Senior Developer" },
    { key: "company", label: "Công ty", placeholder: "FPT Software" },
    { key: "location", label: "Địa điểm", placeholder: "Hà Nội" },
    { key: "from", label: "Từ năm", placeholder: "2021" },
    { key: "to", label: "Đến năm", placeholder: "Hiện tại" },
    { key: "desc", label: "Mô tả", type: "textarea", placeholder: "Mô tả công việc..." },
  ];
  const eduFields: FieldDef[] = [
    { key: "degree", label: "Bằng cấp / Ngành", placeholder: "Kỹ sư CNTT" },
    { key: "school", label: "Trường", placeholder: "Đại học Bách Khoa" },
    { key: "from", label: "Từ năm", placeholder: "2015" },
    { key: "to", label: "Đến năm", placeholder: "2019" },
    { key: "desc", label: "Ghi chú", type: "textarea", placeholder: "GPA, thành tích..." },
  ];
  const projFields: FieldDef[] = [
    { key: "name", label: "Tên dự án", placeholder: "CV Builder" },
    { key: "role", label: "Vai trò", placeholder: "Lead Developer" },
    { key: "tech", label: "Công nghệ", placeholder: "React, Next.js..." },
    { key: "link", label: "Link", placeholder: "github.com/..." },
    { key: "desc", label: "Mô tả", type: "textarea", placeholder: "Mô tả dự án..." },
  ];
  const awardFields: FieldDef[] = [
    { key: "title", label: "Tên chứng chỉ / Giải thưởng", placeholder: "AWS Certified" },
    { key: "org", label: "Tổ chức cấp", placeholder: "Amazon Web Services" },
    { key: "year", label: "Năm", placeholder: "2023" },
  ];

  if (sectionKey === "personal") {
    const p = data.personal;
    const set = (f: keyof PersonalInfo, v: string) => onChange({ ...data, personal: { ...p, [f]: v } });
    return (
      <div>
        <div className="field-group"><div className="field-label">Họ và tên</div><input className="field-input" value={p.name} onChange={e => set("name", e.target.value)} /></div>
        <div className="field-group"><div className="field-label">Chức danh</div><input className="field-input" value={p.role} onChange={e => set("role", e.target.value)} /></div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Email</div><input className="field-input" value={p.email} onChange={e => set("email", e.target.value)} /></div>
          <div className="field-group"><div className="field-label">Điện thoại</div><input className="field-input" value={p.phone} onChange={e => set("phone", e.target.value)} /></div>
        </div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Địa chỉ</div><input className="field-input" value={p.location} onChange={e => set("location", e.target.value)} /></div>
          <div className="field-group"><div className="field-label">Website / GitHub</div><input className="field-input" value={p.website} onChange={e => set("website", e.target.value)} /></div>
        </div>
        <div className="field-group"><div className="field-label">Giới thiệu bản thân</div><textarea className="field-textarea" value={p.summary} onChange={e => set("summary", e.target.value)} style={{ minHeight: 80 }} /></div>
      </div>
    );
  }
  if (sectionKey === "experience") return <EntryEditor entries={data.experience as unknown as Entry[]} fields={expFields} addLabel="Thêm kinh nghiệm" onChange={v => onChange({ ...data, experience: v as unknown as ExperienceEntry[] })} />;
  if (sectionKey === "education") return <EntryEditor entries={data.education as unknown as Entry[]} fields={eduFields} addLabel="Thêm học vấn" onChange={v => onChange({ ...data, education: v as unknown as EducationEntry[] })} />;
  if (sectionKey === "skills") return <SkillsEditor skills={data.skills} onChange={(v: string[]) => onChange({ ...data, skills: v })} />;
  if (sectionKey === "projects") return <EntryEditor entries={data.projects as unknown as Entry[]} fields={projFields} addLabel="Thêm dự án" onChange={v => onChange({ ...data, projects: v as unknown as ProjectEntry[] })} />;
  if (sectionKey === "awards") return <EntryEditor entries={data.awards as unknown as Entry[]} fields={awardFields} addLabel="Thêm chứng chỉ" onChange={v => onChange({ ...data, awards: v as unknown as AwardEntry[] })} />;
  if (sectionKey === "languages") return <LangEditor languages={data.languages} onChange={(v: LanguageEntry[]) => onChange({ ...data, languages: v })} />;
  return null;
}

// ─── Style Panel ───
function StylePanel({ style, onChange }: { style: StyleConfig; onChange: (v: StyleConfig) => void }) {
  const set = (k: keyof StyleConfig, v: string | number) => onChange({ ...style, [k]: v });
  const theme = COLOR_THEMES.find(t => t.id === style.themeId) ?? COLOR_THEMES[0];
  const font = FONT_OPTIONS.find(f => f.id === style.fontId) ?? FONT_OPTIONS[0];

  return (
    <div className="style-panel">
      {/* Color Theme */}
      <div className="style-section">
        <div className="style-section-title"><MdPalette size={13} /> Màu chủ đạo</div>
        <div className="color-grid">
          {COLOR_THEMES.map(t => (
            <div key={t.id} className={`color-swatch${style.themeId === t.id ? " active" : ""}`}
              style={{ background: t.primary }} title={t.label}
              onClick={() => set("themeId", t.id)} />
          ))}
        </div>
        <div style={{ marginTop: 8, padding: "6px 10px", background: theme.primary + "18", borderRadius: 7, fontSize: 11, color: theme.primary, fontWeight: 600 }}>
          Màu đang chọn: {theme.label}
        </div>
      </div>

      {/* Font */}
      <div className="style-section">
        <div className="style-section-title"><MdTextFields size={13} /> Font chữ</div>
        <div className="font-grid">
          {FONT_OPTIONS.map(f => (
            <div key={f.id} className={`font-option${style.fontId === f.id ? " active" : ""}`} onClick={() => set("fontId", f.id)}>
              <div>
                <div className="font-option-name" style={{ fontFamily: f.family }}>{f.label}</div>
                <div className="font-option-sample" style={{ fontFamily: f.family }}>{f.sample}</div>
              </div>
              {style.fontId === f.id && <span style={{ color: "var(--accent)", fontSize: 14 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Name alignment */}
      <div className="style-section">
        <div className="style-section-title"><MdFormatAlignLeft size={13} /> Căn lề tên</div>
        <div className="align-row">
          <button className={`align-btn${style.nameAlign === "left" ? " active" : ""}`} onClick={() => set("nameAlign", "left")} title="Căn trái"><MdFormatAlignLeft size={18} /></button>
          <button className={`align-btn${style.nameAlign === "center" ? " active" : ""}`} onClick={() => set("nameAlign", "center")} title="Căn giữa"><MdFormatAlignCenter size={18} /></button>
          <button className={`align-btn${style.nameAlign === "right" ? " active" : ""}`} onClick={() => set("nameAlign", "right")} title="Căn phải"><MdFormatAlignRight size={18} /></button>
        </div>
      </div>

      {/* Font size */}
      <div className="style-section">
        <div className="style-section-title"><MdTextFields size={13} /> Cỡ chữ body</div>
        <div className="slider-row">
          <span style={{ fontSize: 11, color: "var(--subtle)" }}>Nhỏ</span>
          <input type="range" className="slider" min={11} max={16} value={style.fontSize}
            onChange={e => set("fontSize", Number(e.target.value))} />
          <span style={{ fontSize: 11, color: "var(--subtle)" }}>Lớn</span>
          <span className="slider-val">{style.fontSize}px</span>
        </div>
      </div>

      {/* Line height */}
      <div className="style-section">
        <div className="style-section-title"><MdLayers size={13} /> Giãn dòng</div>
        <div className="line-height-opts">
          {[{ id: "tight", label: "Chặt", val: 1.4 }, { id: "normal", label: "Vừa", val: 1.65 }, { id: "loose", label: "Rộng", val: 1.9 }].map(o => (
            <button key={o.id} className={`lh-btn${style.lineHeight === o.id ? " active" : ""}`} onClick={() => set("lineHeight", o.id)}>{o.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CV Templates ───
const LH_MAP = { tight: 1.4, normal: 1.65, loose: 1.9 };

function CVClassic({ data, order, style }: { data: CvData; order: string[]; style: StyleConfig }) {
  const theme = COLOR_THEMES.find(t => t.id === style.themeId) ?? COLOR_THEMES[0];
  const font = FONT_OPTIONS.find(f => f.id === style.fontId) ?? FONT_OPTIONS[0];
  const lh = LH_MAP[style.lineHeight as keyof typeof LH_MAP] || 1.65;
  const fs = style.fontSize || 13;
  const align = style.nameAlign || "left";

  const cvStyle = { fontFamily: font.family, fontSize: fs, lineHeight: lh };
  const hdrBg = theme.dark;
  const accentColor = theme.primary;

  return (
    <div className="cv-paper" style={cvStyle}>
      {/* Header */}
      <div style={{ padding: "36px 44px 28px", background: hdrBg, color: "#fff", textAlign: align }}>
        <div style={{ fontFamily: font.family, fontSize: fs * 2.2, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4, lineHeight: 1.2 }}>{data.personal.name || "Họ và Tên"}</div>
        <div style={{ fontSize: fs * 1.0, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>{data.personal.role}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}>
          {data.personal.email && <span style={{ fontSize: fs * 0.88, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}><MdEmail size={11} />{data.personal.email}</span>}
          {data.personal.phone && <span style={{ fontSize: fs * 0.88, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}><MdPhone size={11} />{data.personal.phone}</span>}
          {data.personal.location && <span style={{ fontSize: fs * 0.88, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}><MdLocationOn size={11} />{data.personal.location}</span>}
          {data.personal.website && <span style={{ fontSize: fs * 0.88, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}><MdLink size={11} />{data.personal.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 44px 44px" }}>
        {data.personal.summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: fs * 0.84, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 5, marginBottom: 10 }}>Giới thiệu</div>
            <div style={{ color: "#44403c", lineHeight: lh }}>{data.personal.summary}</div>
          </div>
        )}
        {order.filter(k => k !== "personal").map(key => {
          const secTitle = (t) => (
            <div style={{ fontSize: fs * 0.84, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 5, marginBottom: 12 }}>{t}</div>
          );
          const entryStyle = { marginBottom: 14 };
          const titleStyle = { fontSize: fs * 1.05, fontWeight: 700, color: "#1c1917" };
          const subStyle = { fontSize: fs * 0.9, color: "#57534e", fontStyle: "italic", marginBottom: 3 };
          const descStyle = { fontSize: fs * 0.9, color: "#57534e", lineHeight: lh };
          const dateStyle = { fontSize: fs * 0.82, color: "#78716c", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" };

          if (key === "experience" && data.experience?.length) return (
            <div key={key} style={{ marginBottom: 24 }}>
              {secTitle("Kinh nghiệm làm việc")}
              {data.experience.map(e => (
                <div key={e.id} style={entryStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 2 }}>
                    <span style={titleStyle}>{e.title}</span>
                    <span style={dateStyle}>{e.from}{e.to ? ` – ${e.to}` : ""}</span>
                  </div>
                  <div style={subStyle}>{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                  {e.desc && <div style={descStyle}>{e.desc}</div>}
                </div>
              ))}
            </div>
          );
          if (key === "education" && data.education?.length) return (
            <div key={key} style={{ marginBottom: 24 }}>
              {secTitle("Học vấn")}
              {data.education.map(e => (
                <div key={e.id} style={entryStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 2 }}>
                    <span style={titleStyle}>{e.degree}</span>
                    <span style={dateStyle}>{e.from}{e.to ? ` – ${e.to}` : ""}</span>
                  </div>
                  <div style={subStyle}>{e.school}</div>
                  {e.desc && <div style={descStyle}>{e.desc}</div>}
                </div>
              ))}
            </div>
          );
          if (key === "skills" && data.skills?.length) return (
            <div key={key} style={{ marginBottom: 24 }}>
              {secTitle("Kỹ năng")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.skills.map(s => <span key={s} style={{ padding: "3px 10px", border: `1px solid ${accentColor}40`, borderRadius: 99, fontSize: fs * 0.88, color: accentColor, background: theme.light }}>{s}</span>)}
              </div>
            </div>
          );
          if (key === "projects" && data.projects?.length) return (
            <div key={key} style={{ marginBottom: 24 }}>
              {secTitle("Dự án")}
              {data.projects.map(e => (
                <div key={e.id} style={entryStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 2 }}>
                    <span style={titleStyle}>{e.name}</span>
                    {e.link && <span style={dateStyle}>{e.link}</span>}
                  </div>
                  {e.tech && <div style={subStyle}>{e.tech}</div>}
                  {e.desc && <div style={descStyle}>{e.desc}</div>}
                </div>
              ))}
            </div>
          );
          if (key === "awards" && data.awards?.length) return (
            <div key={key} style={{ marginBottom: 24 }}>
              {secTitle("Chứng chỉ & Giải thưởng")}
              {data.awards.map(e => (
                <div key={e.id} style={entryStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={titleStyle}>{e.title}</span>
                    <span style={dateStyle}>{e.year}</span>
                  </div>
                  <div style={subStyle}>{e.org}</div>
                </div>
              ))}
            </div>
          );
          if (key === "languages" && data.languages?.length) return (
            <div key={key} style={{ marginBottom: 24 }}>
              {secTitle("Ngoại ngữ")}
              {data.languages.map(l => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: fs * 0.95, fontWeight: 500 }}>{l.lang}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(i => <div key={i} style={{ width: 18, height: 4, borderRadius: 2, background: l.level >= i ? accentColor : "#e7e5e4" }} />)}
                  </div>
                </div>
              ))}
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
}

function CVModern({ data, order, style }: { data: CvData; order: string[]; style: StyleConfig }) {
  const theme = COLOR_THEMES.find(t => t.id === style.themeId) ?? COLOR_THEMES[0];
  const font = FONT_OPTIONS.find(f => f.id === style.fontId) ?? FONT_OPTIONS[0];
  const lh = LH_MAP[style.lineHeight as keyof typeof LH_MAP] || 1.65;
  const fs = style.fontSize || 13;
  const align = style.nameAlign || "left";
  const accentColor = theme.primary;
  const initials = (data.personal.name || "??").split(" ").slice(-2).map((w: string) => w[0]).join("");

  const sideKeys = ["skills","languages","awards"];
  const mainKeys = order.filter(k => k !== "personal" && !sideKeys.includes(k));

  return (
    <div className="cv-paper" style={{ display: "grid", gridTemplateColumns: "190px 1fr", fontFamily: font.family, fontSize: fs, lineHeight: lh }}>
      {/* Sidebar */}
      <div style={{ background: accentColor, padding: "28px 18px", color: "#fff" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, marginBottom: 14, border: "3px solid rgba(255,255,255,0.3)", textAlign: "center", margin: align === "center" ? "0 auto 14px" : "0 0 14px" }}>{initials}</div>
        <div style={{ fontSize: fs * 1.3, fontWeight: 700, lineHeight: 1.3, marginBottom: 3, textAlign: align }}>{data.personal.name}</div>
        <div style={{ fontSize: fs * 0.85, color: "rgba(255,255,255,0.65)", marginBottom: 18, textAlign: align }}>{data.personal.role}</div>
        <SideSection title="Liên hệ">
          {data.personal.email && <div style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><MdEmail size={10} />{data.personal.email}</div>}
          {data.personal.phone && <div style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><MdPhone size={10} />{data.personal.phone}</div>}
          {data.personal.location && <div style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><MdLocationOn size={10} />{data.personal.location}</div>}
          {data.personal.website && <div style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><MdLink size={10} />{data.personal.website}</div>}
        </SideSection>
        {data.skills?.length > 0 && <SideSection title="Kỹ năng">{data.skills.map((s: string) => <div key={s} style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 5 }}>{s}<div style={{ height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 2 }}><div style={{ width: "70%", height: "100%", background: "rgba(255,255,255,0.8)", borderRadius: 2 }} /></div></div>)}</SideSection>}
        {data.languages?.length > 0 && <SideSection title="Ngoại ngữ">{data.languages.map(l => <div key={l.id} style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{l.lang}<div style={{ display: "flex", gap: 2, marginTop: 2 }}>{[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: 3, background: l.level >= i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)", borderRadius: 1 }} />)}</div></div>)}</SideSection>}
        {data.awards?.length > 0 && <SideSection title="Chứng chỉ">{data.awards.map(e => <div key={e.id} style={{ fontSize: fs * 0.84, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}><div style={{ fontWeight: 600 }}>{e.title}</div><div style={{ opacity: 0.7, fontSize: fs * 0.78 }}>{e.org} · {e.year}</div></div>)}</SideSection>}
      </div>

      {/* Main */}
      <div style={{ padding: "28px 26px" }}>
        {data.personal.summary && (
          <MainSection title="Giới thiệu" accentColor={accentColor} fs={fs}>
            <div style={{ color: "#57534e", lineHeight: lh }}>{data.personal.summary}</div>
          </MainSection>
        )}
        {mainKeys.map((key: string) => {
          const entryL = { paddingLeft: 12, borderLeft: `2px solid #e7e5e4`, marginBottom: 13 };
          if (key === "experience" && data.experience?.length) return (
            <MainSection key={key} title="Kinh nghiệm" accentColor={accentColor} fs={fs}>
              {data.experience.map(e => <div key={e.id} style={entryL}><div style={{ fontSize: fs * 0.82, color: "#a8a29e", fontFamily: "'DM Mono', monospace" }}>{e.from}{e.to ? ` – ${e.to}` : ""}</div><div style={{ fontWeight: 700, color: "#1c1917" }}>{e.title}</div><div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3 }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div>{e.desc && <div style={{ fontSize: fs * 0.88, color: "#57534e", lineHeight: lh }}>{e.desc}</div>}</div>)}
            </MainSection>
          );
          if (key === "education" && data.education?.length) return (
            <MainSection key={key} title="Học vấn" accentColor={accentColor} fs={fs}>
              {data.education.map(e => <div key={e.id} style={entryL}><div style={{ fontSize: fs * 0.82, color: "#a8a29e", fontFamily: "'DM Mono', monospace" }}>{e.from}{e.to ? ` – ${e.to}` : ""}</div><div style={{ fontWeight: 700, color: "#1c1917" }}>{e.degree}</div><div style={{ fontSize: fs * 0.9, color: accentColor, fontWeight: 500, marginBottom: 3 }}>{e.school}</div>{e.desc && <div style={{ fontSize: fs * 0.88, color: "#57534e", lineHeight: lh }}>{e.desc}</div>}</div>)}
            </MainSection>
          );
          if (key === "projects" && data.projects?.length) return (
            <MainSection key={key} title="Dự án" accentColor={accentColor} fs={fs}>
              {data.projects.map(e => <div key={e.id} style={entryL}><div style={{ fontWeight: 700, color: "#1c1917" }}>{e.name}</div><div style={{ fontSize: fs * 0.88, color: accentColor, fontWeight: 500, marginBottom: 3 }}>{e.tech}</div>{e.desc && <div style={{ fontSize: fs * 0.88, color: "#57534e", lineHeight: lh }}>{e.desc}</div>}</div>)}
            </MainSection>
          );
          return null;
        })}
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>{title}</div>
      {children}
    </div>
  );
}

function MainSection({ title, accentColor, fs, children }: { title: string; accentColor: string; fs: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: fs * 0.92, fontWeight: 700, color: accentColor, marginBottom: 10, paddingBottom: 5, borderBottom: `2px solid ${accentColor}28` }}>{title}</div>
      {children}
    </div>
  );
}

// ─── Main App ───
export default function CVBuilder() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [openSections, setOpenSections] = useState({ personal: true });
  const [template, setTemplate] = useState("classic");
  const [activeTab, setActiveTab] = useState("content"); // "content" | "style"
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const dragItem = useRef(null);
  const dragOver = useRef(null);
  const [draggingKey, setDraggingKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);

  const toggleSection = (key: string) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
  const onDragStart = (e: React.DragEvent, key: string) => { dragItem.current = key; setDraggingKey(key); e.dataTransfer.effectAllowed = "move"; };
  const onDragEnter = (e: React.DragEvent, key: string) => { dragOver.current = key; setDragOverKey(key); };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = () => {
    if (!dragItem.current || dragItem.current === dragOver.current) { resetDrag(); return; }
    const o = [...order]; const from = o.indexOf(dragItem.current); const to = o.indexOf(dragOver.current);
    o.splice(from, 1); o.splice(to, 0, dragItem.current!); setOrder(o); resetDrag();
  };
  const resetDrag = () => { dragItem.current = null; dragOver.current = null; setDraggingKey(null); setDragOverKey(null); };
  const getCount = (key: string): string | null => {
    if (key === "personal") return null;
    if (key === "skills") return data.skills.length ? `${data.skills.length} kỹ năng` : null;
    if (key === "languages") return data.languages.length ? `${data.languages.length} ngôn ngữ` : null;
    const section = data[key as keyof CvData];
    return Array.isArray(section) && section.length ? `${section.length} mục` : null;
  };

  return (
    <>
      <style>{globalCss}</style>
      <div className="app">
        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-mark">CV</div>
              <div><div className="logo-text">CV Builder</div><div className="logo-sub">Thiết kế CV chuyên nghiệp</div></div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="tab-nav">
            <button className={`tab-btn${activeTab === "content" ? " active" : ""}`} onClick={() => setActiveTab("content")}>
              <MdLayers size={14} /> Nội dung
            </button>
            <button className={`tab-btn${activeTab === "style" ? " active" : ""}`} onClick={() => setActiveTab("style")}>
              <MdPalette size={14} /> Thiết kế
            </button>
          </div>

          <div className="sidebar-body">
            {activeTab === "content" ? (
              order.map(key => {
                const meta = SECTION_META[key];
                const isOpen = openSections[key];
                const isDragging = draggingKey === key;
                const isDragOver = dragOverKey === key && draggingKey !== key;
                return (
                  <div key={key}
                    className={`section-card${isDragging ? " dragging" : ""}${isDragOver ? " drag-over" : ""}`}
                    draggable onDragStart={e => onDragStart(e, key)} onDragEnter={e => onDragEnter(e, key)} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={resetDrag}
                  >
                    <div className="section-header" onClick={() => toggleSection(key)}>
                      <div className="drag-handle" onClick={e => e.stopPropagation()} title="Kéo để sắp xếp"><MdDragIndicator size={17} /></div>
                      <div className="section-icon" style={{ background: meta.color, color: meta.iconColor }}>{meta.icon}</div>
                      <div className="section-title-wrap">
                        <div className="section-title">{meta.label}</div>
                        {getCount(key) && <div className="section-count">{getCount(key)}</div>}
                      </div>
                      <span style={{ fontSize: 16, color: "var(--subtle)", transform: isOpen ? "rotate(180deg)" : "", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                    </div>
                    {isOpen && <div className="section-body"><SectionForm sectionKey={key} data={data} onChange={setData} /></div>}
                  </div>
                );
              })
            ) : (
              <StylePanel style={style} onChange={setStyle} />
            )}
          </div>
        </div>

        {/* ── Preview ── */}
        <div className="preview-area">
          <div className="preview-toolbar">
            <span className="preview-label">Live Preview</span>
            <div className="template-pills">
              <button className={`template-pill${template === "classic" ? " active" : ""}`} onClick={() => setTemplate("classic")}>Classic</button>
              <button className={`template-pill${template === "modern" ? " active" : ""}`} onClick={() => setTemplate("modern")}>Modern</button>
            </div>
          </div>
          {template === "classic"
            ? <CVClassic data={data} order={order} style={style} />
            : <CVModern data={data} order={order} style={style} />}
        </div>
      </div>
    </>
  );
}