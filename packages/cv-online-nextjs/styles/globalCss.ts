import { GFONTS } from '@/constants/cvEditor';

export const globalCss = `
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
.color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.color-swatch { width: 100%; aspect-ratio: 1; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: transform 0.12s, border-color 0.12s; position: relative; }
.color-swatch:hover { transform: scale(1.1); }
.color-swatch.active { border-color: var(--ink); transform: scale(1.08); }
.color-swatch.active::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4); }
.font-grid { display: flex; flex-direction: column; gap: 5px; }
.font-option { padding: 8px 10px; border: 1.5px solid var(--border); border-radius: 8px; cursor: pointer; transition: all 0.12s; display: flex; align-items: center; justify-content: space-between; }
.font-option:hover { border-color: var(--accent); background: var(--accent-bg); }
.font-option.active { border-color: var(--accent); background: var(--accent-bg); }
.font-option-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.font-option-sample { font-size: 11px; color: var(--subtle); }
.align-row { display: flex; gap: 6px; }
.align-btn { flex: 1; padding: 8px; border: 1.5px solid var(--border); border-radius: 8px; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 18px; transition: all 0.12s; }
.align-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.align-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.slider-row { display: flex; align-items: center; gap: 10px; }
.slider { flex: 1; -webkit-appearance: none; height: 4px; border-radius: 2px; background: var(--border); outline: none; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); cursor: pointer; }
.slider-val { font-size: 12px; font-family: 'DM Mono', monospace; color: var(--muted); min-width: 28px; text-align: right; }
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
/* Each .cv-paper represents one A4 page. overflow:visible is intentional —
   content is distributed by the pagination algorithm, not clipped. */
.cv-paper { width: 100%; max-width: 794px; background: white; box-shadow: var(--shadow-lg); border-radius: 3px; min-height: 1123px; overflow: visible; position: relative; }
/* Wrapper when multiple pages are stacked */
.cv-pages-wrapper { display: flex; flex-direction: column; gap: 24px; align-items: center; width: 100%; padding: 24px 0; }
@media print {
  /* ── Hide all editor UI chrome ── */
  .preview-bar,
  .style-panel-horizontal,
  .sidebar,
  .sc-panel,
  .zoom-controls { display: none !important; }

  /* ── Page & body ── */
  html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
  .preview-page { background: white !important; }
  .preview-content { padding: 0 !important; gap: 0 !important; }

  /* ── cv-paper: remove decorative styles, fix overflow ── */
  .cv-paper {
    box-shadow: none !important;
    border-radius: 0 !important;
    /* Fix #5: overflow:visible prevents content clipping at page edges */
    overflow: visible !important;
    margin: 0 !important;
    page-break-after: always;
    break-after: page;
    min-height: unset;
  }
  .cv-pages-wrapper { gap: 0 !important; }

  /* Fix #6: break-inside — prevent entries being split across pages */
  .entry-card,
  .entry-header,
  [class*="timeline"] { break-inside: avoid; }

  /* ── A4 page size — margin:0 important for Windows Chrome Print to PDF ── */
  @page { size: A4; margin: 0; }
}


/* ── Section Order Panel (2-col grid) ── */
.sc-panel { display: flex; flex-direction: column; gap: 4px; }
.sc-zone-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--subtle); padding: 6px 2px 2px; }
.sc-zone { border: 1.5px dashed transparent; border-radius: 10px; padding: 4px; transition: border-color 0.15s, background 0.15s; }
.sc-zone.zone-active { border-color: var(--accent); background: #f0fdf9; }
.sc-zone-empty { text-align: center; font-size: 11px; color: var(--subtle); padding: 16px; }
.sc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }

/* Card in grid */
.sc-card { display: flex; align-items: center; gap: 6px; padding: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; cursor: grab; user-select: none; transition: box-shadow 0.15s, border-color 0.15s, opacity 0.15s; position: relative; }
.sc-card:hover { border-color: var(--accent2); box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
.sc-card.dragging { opacity: 0.5; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border-color: var(--accent); }
.sc-card.drag-over { border-color: var(--accent); background: #f0fdf9; box-shadow: 0 0 0 2px rgba(13,148,136,0.18); }
.sc-drag { color: var(--subtle); flex-shrink: 0; display: flex; align-items: center; }
.sc-icon { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px; }
.sc-label { flex: 1; font-size: 11px; font-weight: 600; color: var(--ink); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; min-width: 0; }
/* Fix #6: --danger fallback so hover red works even if var is not defined */
.sc-hide { flex-shrink: 0; background: none; border: none; cursor: pointer; color: var(--subtle); display: flex; align-items: center; padding: 2px; border-radius: 4px; opacity: 0; transition: opacity 0.12s, color 0.12s; }
.sc-card:hover .sc-hide { opacity: 1; }
.sc-hide:hover { color: var(--danger, #ef4444); }

/* Drop zone: ẩn mục */
.sc-hidden-zone { margin-top: 10px; border: 1.5px dashed var(--border); border-radius: 10px; padding: 10px 10px 8px; background: rgba(28,25,23,0.03); transition: border-color 0.15s, background 0.15s; min-height: 52px; }
.sc-hidden-zone.active { border-color: var(--accent); background: #f0fdf9; }
.sc-hidden-label { display: block; font-size: 10.5px; color: var(--subtle); text-align: center; margin-bottom: 8px; }
.sc-hidden-chips { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
.sc-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px 3px 7px; border: 1px solid; border-radius: 99px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: opacity 0.12s, transform 0.12s; }
.sc-chip:hover { opacity: 0.75; transform: scale(0.97); }
`;