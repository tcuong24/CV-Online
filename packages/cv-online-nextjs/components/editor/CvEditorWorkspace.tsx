'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { globalCss } from '@/styles/globalCss';
import { SectionOrderPanel } from '@/components/sidebar/SectionOrderPanel';
import { StylePanel } from '@/components/styles/StylePanel';
import { CvData } from '@/types/cvEditor';
import { CVTemplate } from '@/components/template/CVTemplate';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { Slider } from '@/components/ui/slider';
import { TemplatePickerPanel } from '@/components/sidebar/TemplatePickerPanel';
import { CvAiChatbox } from '@/components/editor/CvAiChatbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AI_PANEL_MIN = 260;
const AI_PANEL_MAX = 600;
const AI_PANEL_DEFAULT = 360;

interface CvEditorWorkspaceProps {
  onSave?: (opts?: { captureThumbnail?: boolean }) => Promise<string | null>;
}

export function CvEditorWorkspace({ onSave }: CvEditorWorkspaceProps) {
  // ── Store state ──────────────────────────────────────────────────────────────
  const data = useCvEditorStore((s) => s.data);
  const order = useCvEditorStore((s) => s.order);
  const style = useCvEditorStore((s) => s.style);
  const sideKeys = useCvEditorStore((s) => s.sideKeys);
  const layoutType = useCvEditorStore((s) => s.layoutType);
  const isSaving = useCvEditorStore((s) => s.isSaving);
  const isDirty = useCvEditorStore((s) => s.isDirty);
  const lastSavedAt = useCvEditorStore((s) => s.lastSavedAt);
  const visibility = useCvEditorStore((s) => s.visibility);
  const syncToDb = useCvEditorStore((s) => s.syncToDb);

  const router = useRouter();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Warn user on close/reload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Intercept browser back button / swipe back if dirty
  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      setShowExitConfirm(true);
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDirty]);

  const confirmExit = () => {
    setShowExitConfirm(false);
    // Directly go to dashboard
    router.push('/dashboard');
  };

  // ── Store actions ─────────────────────────────────────────────────────────────
  const patchStyle = useCvEditorStore((s) => s.patchStyle);

  // Zoom + sidebar + AI panel state — local UI only
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'templates'>('sections');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPanelWidth, setAiPanelWidth] = useState(AI_PANEL_DEFAULT);
  const dragging = useRef(false);

  const handleSave = onSave || syncToDb;

  // ── Drag-to-resize ────────────────────────────────────────────────────────────
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      const startX = e.clientX;
      const startWidth = aiPanelWidth;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        // Dragging left → increase width (panel is on the right side)
        const delta = startX - ev.clientX;
        setAiPanelWidth(Math.min(AI_PANEL_MAX, Math.max(AI_PANEL_MIN, startWidth + delta)));
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [aiPanelWidth],
  );

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
            <button
              onClick={() => setActiveTab('sections')}
              style={{
                flex: 1,
                padding: '10px',
                fontWeight: activeTab === 'sections' ? 700 : 400,
                borderBottom: activeTab === 'sections' ? '2px solid #2563eb' : 'none',
                color: activeTab === 'sections' ? '#2563eb' : '#64748b',
              }}
            >
              Bố cục
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              style={{
                flex: 1,
                padding: '10px',
                fontWeight: activeTab === 'templates' ? 700 : 400,
                borderBottom: activeTab === 'templates' ? '2px solid #2563eb' : 'none',
                color: activeTab === 'templates' ? '#2563eb' : '#64748b',
              }}
            >
              Mẫu CV
            </button>
          </div>
          <div className="sidebar-body">
            {activeTab === 'sections' ? <SectionOrderPanel /> : <TemplatePickerPanel />}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StylePanel
            style={style}
            onChange={(s) => patchStyle(s)}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
            aiPanelOpen={aiPanelOpen}
            onToggleAiPanel={() => setAiPanelOpen((o) => !o)}
            onSave={handleSave}
            isSaving={isSaving}
            isDirty={isDirty}
            lastSavedAt={lastSavedAt}
            onBackClick={() => {
              if (isDirty) {
                setShowExitConfirm(true);
              } else {
                router.push('/dashboard');
              }
            }}
          />

          <div className="preview-area" style={{ position: 'relative' }}>
            <div
              className="cv-pages-wrapper"
              style={{ flex: 1, padding: '24px 0', width: '100%', zoom: zoom / 100 }}
            >
              <CVTemplate
                data={data as CvData}
                order={order.filter((k) => visibility[k] !== false)}
                style={style}
                layoutType={layoutType}
                sideKeys={
                  sideKeys.length > 0 ? sideKeys.filter((k) => visibility[k] !== false) : undefined
                }
              />
            </div>

            {/* Zoom slider — fixed bottom right, offset by AI panel width */}
            <div
              style={{
                position: 'fixed',
                bottom: 24,
                right: aiPanelOpen ? aiPanelWidth + 24 : 24,
                transition: 'right 0.25s ease',
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
                title="Thu nhỏ"
              >
                −
              </button>
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
                title="Phóng to"
              >
                +
              </button>
              <span style={{ fontSize: 12, color: '#6b7280', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
              <button
                onClick={() => setZoom(100)}
                title="Đặt lại zoom"
                style={{ fontSize: 11, color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px' }}
              >
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* ────────── AI Panel ────────── */}
        <div
          style={{
            width: aiPanelOpen ? aiPanelWidth : 0,
            minWidth: 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 0.25s ease',
            position: 'relative',
          }}
        >
          {/* Drag handle — sits on the left edge of the panel */}
          {aiPanelOpen && (
            <div
              onMouseDown={onDragStart}
              title="Kéo để thay đổi kích thước"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 6,
                cursor: 'col-resize',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Pill indicator — visible on hover */}
              <div
                className="resize-grip"
                style={{
                  width: 3,
                  height: 40,
                  borderRadius: 99,
                  background: '#94a3b8',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
              />
            </div>
          )}

          <CvAiChatbox onClose={() => setAiPanelOpen(false)} />
        </div>
      </div>

      {/* Hover CSS for drag grip pill */}
      <style>{`
        div:has(> .resize-grip):hover .resize-grip { opacity: 1 !important; }
      `}</style>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn rời đi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tất cả thay đổi chưa lưu trên CV của bạn sẽ bị mất. Hãy chắc chắn rằng bạn đã lưu các chỉnh sửa của mình trước khi thoát.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitConfirm(false)}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700 text-white">Rời khỏi trang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
