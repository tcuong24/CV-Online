'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { CVTemplate } from '@/components/template/CVTemplate';
import { globalCss } from '@/styles/globalCss';
import { CvData, LayoutType, SectionLayoutConfig } from '@/types/cvEditor';
import { MdDownload } from 'react-icons/md';
import axiosInstance from '@/lib/axios';
import { DEFAULT_STYLE, DEFAULT_ORDER } from '@/constants/cvEditor';
import { parseDesignConfig, parseSectionsConfig, parseSectionLayouts } from '@/lib/mappers/templateMapper';
import { mapDbCvToCvData } from '@/lib/mappers/cvDataMapper';

const PREVIEW_READONLY_CSS = `
  .preview-readonly button { display: none !important; }
  .preview-readonly [title*="Kéo"] { display: none !important; }
  .preview-readonly .cursor-pointer { display: none !important; }
  .preview-readonly .avatar-uploader { pointer-events: none !important; }
  .preview-readonly .is-editor-empty::before,
  .preview-readonly .is-editor-empty:before,
  .preview-readonly [data-placeholder]:empty::before,
  .preview-readonly [data-placeholder]:empty:before {
    display: none !important;
    content: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    color: transparent !important;
  }
  .preview-readonly [contenteditable] {
    pointer-events: none !important;
    border-bottom: none !important;
    outline: none !important;
    cursor: default !important;
  }
  .preview-readonly [style*="dashed"] { outline: none !important; }
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
  .preview-title { font-size: 13px; font-weight: 700; color: #1c1917; }
  .preview-subtitle { font-size: 11px; color: #a8a29e; margin-top: 1px; }
  .preview-pdf-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; background: #0f766e; color: white;
    border: none; border-radius: 8px; cursor: pointer; font-family: inherit;
    font-size: 13px; font-weight: 600;
    transition: background 0.15s, transform 0.1s;
    box-shadow: 0 2px 8px rgba(15,118,110,0.3);
  }
  .preview-pdf-btn:hover:not(:disabled) { background: #0d9488; transform: translateY(-1px); }
  .preview-pdf-btn:active:not(:disabled) { transform: translateY(0); }
  .preview-pdf-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
  .preview-content {
    display: flex; flex-direction: column; align-items: center;
    padding: 32px 20px 60px; gap: 24px;
  }
`;

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

function ErrorState({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: 16,
      background: '#f0ede8', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1c1917' }}>Không thể tải CV</div>
      <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', maxWidth: 320 }}>
        {message}
      </p>
    </div>
  );
}

export default function DynamicPreviewPage() {
  const params = useParams();
  const cvId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cvId) return;

    setLoading(true);
    axiosInstance.get(`/cvs/${cvId}`)
      .then(res => {
        const cv = res.data;
        
        // Parse styles
        const baseStyle = cv.snapshotDesignConfig
          ? parseDesignConfig(cv.snapshotDesignConfig)
          : (cv.template?.designConfig
            ? parseDesignConfig(cv.template.designConfig)
            : DEFAULT_STYLE);
        const style = { ...DEFAULT_STYLE, ...baseStyle, ...(cv.customStyles ?? {}) };

        // Parse Layout & Order
        let order = DEFAULT_ORDER;
        let sideKeys: string[] = [];
        let sectionLayout: SectionLayoutConfig = {};
        const layoutType = (cv.template?.layoutType ?? 'classic') as LayoutType;

        const sectionsSource = cv.template?.sectionsConfig;
        if (sectionsSource) {
          const parsed = parseSectionsConfig(sectionsSource);
          order = parsed.order;
          sideKeys = parsed.sideKeys;

          if (cv.sectionsOrder) {
            if (Array.isArray(cv.sectionsOrder)) {
              order = cv.sectionsOrder;
            } else if (typeof cv.sectionsOrder === 'object') {
              order = (cv.sectionsOrder as any).main ?? parsed.order;
              sideKeys = (cv.sectionsOrder as any).side ?? parsed.sideKeys;
            }
          }
          sectionLayout = cv.sectionsLayout || parseSectionLayouts(sectionsSource);
        } else if (cv.sectionsOrder) {
          order = cv.sectionsOrder;
        }

        const visibility = cv.sectionsVisibility ?? {};
        const data = mapDbCvToCvData(cv as unknown as Record<string, unknown>);

        setCvData({
          data,
          order: order.filter(k => visibility[k] !== false),
          style,
          layoutType,
          sideKeys: sideKeys.length > 0 ? sideKeys.filter(k => visibility[k] !== false) : undefined,
        });
      })
      .catch(err => {
        console.error('Failed to fetch CV:', err);
        setError(err.response?.data?.message || 'Không tìm thấy dữ liệu CV hoặc bạn không có quyền xem.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cvId]);

  const handleDownload = async () => {
    if (!cvData) return;
    const pages = document.querySelectorAll<HTMLElement>('.cv-paper');
    if (!pages.length) return;

    setDownloading(true);
    try {
      const [{ toJpeg }, { default: jsPDF }] = await Promise.all([
        import('html-to-image'),
        import('jspdf'),
      ]);

      await document.fonts.ready;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const A4_W = 210;
      const A4_H = 297;

      for (let i = 0; i < pages.length; i++) {
        const dataUrl = await toJpeg(pages[i], {
          quality: 0.92,
          pixelRatio: 2,
          width: 794,
          height: 1123,
          backgroundColor: '#ffffff',
          skipFonts: false,
          filter: (node) => {
            if (node instanceof HTMLElement) {
              if (node.tagName === 'BUTTON') return false;
              if (node.getAttribute('title')?.includes('Kéo')) return false;
            }
            return true;
          },
        });

        const img = new Image();
        img.src = dataUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });

        const imgHeight = (img.naturalHeight * A4_W) / img.naturalWidth;

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', 0, 0, A4_W, Math.min(imgHeight, A4_H));
      }

      const name = cvData.data.personal?.name?.replace(/\s+/g, '_') ?? 'CV';
      pdf.save(`${name}-CV.pdf`);
    } catch (err) {
      console.error('[PreviewPage] Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !cvData) return <ErrorState message={error || 'Đã xảy ra lỗi không xác định'} />;

  return (
    <>
      <style>{globalCss}</style>
      <style>{PREVIEW_READONLY_CSS}</style>

      <div className="preview-page">
        <div className="preview-bar">
          <div className="preview-bar-left">
            <div>
              <div className="preview-title">{cvData.data.personal?.name || 'CV'}</div>
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

        <div className="preview-content preview-readonly" ref={contentRef}>
          <CVTemplate
            data={cvData.data as CvData}
            order={cvData.order}
            style={cvData.style}
            layoutType={cvData.layoutType}
            sideKeys={cvData.sideKeys}
            zoom={100}
          />
        </div>
      </div>
    </>
  );
}
