'use client';

import { useState } from 'react';
import { globalCss } from '@/styles/globalCss';
import { SectionOrderPanel } from '@/components/sidebar/SectionOrderPanel';
import { StylePanel } from '@/components/styles/StylePanel';
import { CvData } from '@/types/cvEditor';
import { CVTemplate } from '@/components/template/CVTemplate';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { Slider } from '@/components/ui/slider';
import { TemplatePickerPanel } from '@/components/sidebar/TemplatePickerPanel';

export default function CVBuilder() {
  // ── Store state ──────────────────────────────────────────────────────────────
  const data = useCvEditorStore((s) => s.data);
  const order = useCvEditorStore((s) => s.order);
  const style = useCvEditorStore((s) => s.style);
  const sideKeys = useCvEditorStore((s) => s.sideKeys);
  const layoutType = useCvEditorStore((s) => s.layoutType);
  const syncToDb = useCvEditorStore((s) => s.syncToDb);
  const isSaving = useCvEditorStore((s) => s.isSaving);
  const isDirty = useCvEditorStore((s) => s.isDirty);
  const lastSavedAt = useCvEditorStore((s) => s.lastSavedAt);
  const visibility = useCvEditorStore((s) => s.visibility);
  // ── Store actions ─────────────────────────────────────────────────────────────
  const patchStyle = useCvEditorStore((s) => s.patchStyle);

  // Zoom + sidebar state — local UI only
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'templates'>('sections');
  return (
    <>
      <style>{globalCss}</style>
      <div className="app">
        {/* ────────── Sidebar ────────── */}
        <div
          className="sidebar"
          style={{
            width: sidebarOpen ? 360 : 0,
            minWidth: 0,
            overflow: 'hidden',
            transition: 'width 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
            <button onClick={() => setActiveTab('sections')}
              style={{ flex: 1, padding: '10px', fontWeight: activeTab === 'sections' ? 700 : 400 }}>
              Bố cục
            </button>
            <button onClick={() => setActiveTab('templates')}
              style={{ flex: 1, padding: '10px', fontWeight: activeTab === 'templates' ? 700 : 400 }}>
              Template
            </button>
          </div>
          <div className="sidebar-body">
            {activeTab === 'sections'
              ? <SectionOrderPanel />
              : <TemplatePickerPanel />}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StylePanel
            style={style}
            onChange={(s) => patchStyle(s)}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(o => !o)}
            onSave={syncToDb}
            isSaving={isSaving}
            isDirty={isDirty}
            lastSavedAt={lastSavedAt}
          />

          <div className="preview-area" style={{ position: 'relative' }}>
            <div
              className="cv-pages-wrapper"
              style={{
                flex: 1,
                padding: '24px 0',
                width: '100%',
                zoom: zoom / 100,
              }}
            >
              <CVTemplate
                data={data as CvData}
                order={order.filter(k => visibility[k] !== false)}
                style={style}
                layoutType={layoutType}
                sideKeys={sideKeys.length > 0 ? sideKeys.filter(k => visibility[k] !== false) : undefined}
              />
            </div>

            {/* Zoom slider — fixed bottom right */}
            <div
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #e5e7eb',
                borderRadius: 999,
                padding: '8px 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              }}
            >
              <button
                onClick={() => setZoom((z) => Math.max(40, z - 10))}
                style={{ fontSize: 16, lineHeight: 1, color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px' }}
              >−</button>
              <Slider
                min={40}
                max={150}
                step={5}
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                className="w-[100px]"
              />
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                style={{ fontSize: 16, lineHeight: 1, color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px' }}
              >+</button>
              <span style={{ fontSize: 12, color: '#6b7280', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
              <button
                onClick={() => setZoom(100)}
                title="Reset"
                style={{ fontSize: 11, color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px' }}
              >↺</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}