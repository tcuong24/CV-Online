'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { globalCss } from '@/styles/globalCss';
import { SectionOrderPanel } from '@/components/sidebar/SectionOrderPanel';
import { StylePanel } from '@/components/styles/StylePanel';
import { CvData } from '@/types/cvEditor';
import { CVTemplate } from '@/components/template/CVTemplate';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { Slider } from '@/components/ui/slider';
import { TemplatePickerPanel } from '@/components/sidebar/TemplatePickerPanel';
import axiosInstance from '@/lib/axios';

export default function EditCVPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);

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
  const setCV = useCvEditorStore((s) => s.setCV);
  
  // ── Store actions ─────────────────────────────────────────────────────────────
  const patchStyle = useCvEditorStore((s) => s.patchStyle);

  // Zoom + sidebar state — local UI only
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'templates'>('sections');

  // Load CV Data
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    if (!cvId) return;

    axiosInstance.get(`/cvs/${cvId}`)
      .then(res => {
        setCV(res.data);
      })
      .catch(err => {
        console.error('Failed to load CV:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cvId, status, router, setCV]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải cấu trúc CV...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{globalCss}</style>
      <div className="app bg-[#f0f2f5] h-screen overflow-hidden flex">
        {/* ────────── Sidebar ────────── */}
        <div
          className="sidebar flex-shrink-0 bg-white shadow-md z-10"
          style={{
            width: sidebarOpen ? 360 : 0,
            overflow: 'hidden',
            transition: 'width 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <button onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'sections' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Bố cục
            </button>
            <button onClick={() => setActiveTab('templates')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'templates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Template
            </button>
          </div>
          <div className="sidebar-body overflow-y-auto flex-1 p-4 bg-white">
            {activeTab === 'sections'
              ? <SectionOrderPanel />
              : <TemplatePickerPanel />}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
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

          <div className="preview-area flex-1 overflow-y-auto relative" style={{ paddingBottom: '100px' }}>
            <div
              className="cv-pages-wrapper mx-auto flex flex-col items-center justify-start min-h-full"
              style={{
                padding: '40px 0',
                zoom: zoom / 100,
                transformOrigin: 'top center'
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
          </div>

          {/* Zoom slider — fixed bottom right */}
          <div
            className="absolute bottom-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur shadow-lg border border-gray-200 rounded-full px-4 py-2"
          >
            <button
              onClick={() => setZoom((z) => Math.max(40, z - 10))}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors text-lg"
            >−</button>
            <Slider
              min={40}
              max={150}
              step={5}
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              className="w-24"
            />
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors text-lg"
            >+</button>
            <span className="text-xs font-medium text-gray-400 min-w-[36px] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(100)}
              title="Reset"
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >↺</button>
          </div>
        </div>
      </div>
    </>
  );
}
