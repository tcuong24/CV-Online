'use client';

import { useEffect, useRef, useState } from 'react';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { CVTemplate } from '@/components/template/CVTemplate';
import { globalCss } from '@/styles/globalCss';
import { CvData } from '@/types/cvEditor';
import { MdArrowBack, MdDownload } from 'react-icons/md';

// ── CSS: hide all interactive/placeholder elements in preview ──────────────────
const PREVIEW_READONLY_CSS = `
  /* Hide add/delete/drag buttons */
  .preview-readonly button { display: none !important; }
  .preview-readonly [title*="Kéo"] { display: none !important; }

  /* Hide empty-state placeholder sections:
     Empty states always have cursor-pointer at section root */
  .preview-readonly .cursor-pointer { display: none !important; }

  /* Fix: hide EditableText ::before placeholder text (from globals.css) */
  .preview-readonly .editable-text[data-empty="true"]::before {
    display: none !important;
    content: none !important;
  }

  /* EditableText: remove hover underline, disable pointer */
  .preview-readonly [contenteditable] {
    pointer-events: none !important;
    border-bottom: none !important;
    outline: none !important;
    cursor: default !important;
  }

  /* Section shell: no dashed outline on hover */
  .preview-readonly [style*="dashed"] { outline: none !important; }

  /* Layout */
  .preview-page { min-height: 100vh; background: #f0ede8; }

  .preview-bar {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 20px;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #e2ddd8;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }
  .preview-bar-left { display: flex; align-items: center; gap: 10px; }

  .preview-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 12px; border-radius: 8px; border: 1px solid #e2ddd8;
    background: white; cursor: pointer; font-family: inherit;
    font-size: 12.5px; font-weight: 600; color: #44403c;
    transition: background 0.12s, border-color 0.12s; text-decoration: none;
  }
  .preview-back:hover { background: #f5f5f4; border-color: #a8a29e; }

  .preview-title {
    font-size: 13px; font-weight: 700; color: #1c1917;
  }
  .preview-subtitle { font-size: 11px; color: #a8a29e; margin-top: 1px; }

  .preview-pdf-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; background: #0f766e; color: white;
    border: none; border-radius: 8px; cursor: pointer; font-family: inherit;
    font-size: 13px; font-weight: 600;
    transition: background 0.15s, transform 0.1s;
    box-shadow: 0 2px 8px rgba(15,118,110,0.3);
    position: relative;
  }
  .preview-pdf-btn:hover:not(:disabled) { background: #0d9488; transform: translateY(-1px); }
  .preview-pdf-btn:active:not(:disabled) { transform: translateY(0); }
  .preview-pdf-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  .preview-content {
    display: flex; flex-direction: column; align-items: center;
    padding: 32px 20px 60px; gap: 24px;
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: 12,
      background: '#f0ede8', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #e2ddd8',
        borderTop: '3px solid #0f766e', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span style={{ fontSize: 13, color: '#78716c' }}>Đang tải CV…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: 16,
      background: '#f0ede8', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ fontSize: 48 }}>📄</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1c1917' }}>Chưa có dữ liệu CV</div>
      <p style={{ fontSize: 13, color: '#78716c', textAlign: 'center', maxWidth: 320 }}>
        Hãy tạo CV trong editor trước, sau đó quay lại đây để xem & tải PDF.
      </p>
      <a
        href="/cvs/create"
        style={{
          padding: '10px 20px', background: '#0f766e', color: 'white',
          borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}
      >
        Tạo CV ngay →
      </a>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  const data = useCvEditorStore(s => s.data);
  const order = useCvEditorStore(s => s.order);
  const style = useCvEditorStore(s => s.style);
  const layoutType = useCvEditorStore(s => s.layoutType);
  const sideKeys = useCvEditorStore(s => s.sideKeys);
  const visibility = useCvEditorStore(s => s.visibility);

  const [hydrated, setHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHydrated(true); }, []);

  const handleDownload = async () => {
    const pages = document.querySelectorAll<HTMLElement>('.cv-paper');
    if (!pages.length) return;

    setDownloading(true);
    try {
      const [{ toPng }, { default: jsPDF }] = await Promise.all([
        import('html-to-image'),
        import('jspdf'),
      ]);

      await document.fonts.ready;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const A4_W = 210;
      const A4_H = 297;

      for (let i = 0; i < pages.length; i++) {
        const dataUrl = await toPng(pages[i], {
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          skipFonts: false,
          filter: (node) => {
            if (node instanceof HTMLElement) {
              if (node.tagName === 'BUTTON') return false;
              if (node.getAttribute('title')?.includes('Kéo')) return false;
              if (node.classList.contains('cursor-pointer') &&
                node.classList.contains('group')) return false;
            }
            return true;
          },
        });

        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const imgWidth = A4_W;
            const imgHeight = (img.height * A4_W) / img.width;

            let heightLeft = imgHeight;
            let position = 0;

            if (i > 0) pdf.addPage();
            pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= A4_H;

            // Slice the long image into subsequent pages
            while (heightLeft > 0) {
              position -= A4_H;
              pdf.addPage();
              pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= A4_H;
            }
            resolve();
          };
          img.onerror = reject;
          img.src = dataUrl;
        });
      }

      const name = data.personal?.name?.replace(/\s+/g, '_') ?? 'CV';
      pdf.save(`${name}-CV.pdf`);
    } catch (err) {
      console.error('[PreviewPage] Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (!hydrated) return <LoadingSpinner />;
  if (!data.personal?.name) return <EmptyState />;

  return (
    <>
      <style>{globalCss}</style>
      <style>{PREVIEW_READONLY_CSS}</style>

      <div className="preview-page">
        {/* ── Sticky header ── */}
        <div className="preview-bar">
          <div className="preview-bar-left">
            <div>
              <div className="preview-title">{data.personal.name}</div>
              <div className="preview-subtitle">Xem trước CV</div>
            </div>
          </div>

          <button
            className="preview-pdf-btn"
            onClick={handleDownload}
            disabled={downloading}
          >
            <MdDownload size={17} />
            {downloading ? 'Đang tạo PDF…' : 'Tải xuống PDF'}
          </button>
        </div>

        {/* ── CV content — wrapped with readonly class ── */}
        <div className="preview-content preview-readonly" ref={contentRef}>
          <CVTemplate
            data={data as CvData}
            order={order.filter(k => visibility[k] !== false)}
            style={style}
            layoutType={layoutType}
            sideKeys={sideKeys.length > 0 ? sideKeys.filter(k => visibility[k] !== false) : undefined}
            zoom={100}
          />
        </div>
      </div>
    </>
  );
}
