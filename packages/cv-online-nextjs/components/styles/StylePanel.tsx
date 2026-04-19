import { useState, useEffect, useRef } from 'react';
import {
  MdCheck,
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLayers,
  MdOpenInNew,
  MdPalette,
  MdSave,
  MdTextFields,
  MdViewSidebar,
} from 'react-icons/md';
import { COLOR_THEMES, FONT_OPTIONS } from '@/constants/cvEditor';
import { StyleConfig } from '@/types/cvEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import { useStore } from 'zustand';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { ArrowLeft, ArrowRight, Redo, Undo } from 'lucide-react';

const LINE_HEIGHT_OPTIONS = [
  { id: 'tight', label: 'Chặt', val: 1.4 },
  { id: 'normal', label: 'Vừa', val: 1.65 },
  { id: 'loose', label: 'Rộng', val: 1.9 },
];

interface StylePanelProps {
  style: StyleConfig;
  onChange: (v: StyleConfig) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onSave?: (opts?: { captureThumbnail?: boolean }) => Promise<string | null>;
  isSaving?: boolean;
  isDirty?: boolean;
  lastSavedAt?: number | null;
}

export function StylePanel({ style, onChange, sidebarOpen, onToggleSidebar, onSave, isSaving, isDirty, lastSavedAt }: StylePanelProps) {
  const set = (k: keyof StyleConfig, v: string | number) =>
    onChange({ ...style, [k]: v });

  const theme = COLOR_THEMES.find((t) => t.id === style.themeId) ?? COLOR_THEMES[0];
  const font = FONT_OPTIONS.find((f) => f.id === style.fontId) ?? FONT_OPTIONS[0];
  const { undo, redo, pastStates, futureStates } = useStore(useCvEditorStore.temporal, (state) => state);
  const [savedThemeId, setSavedThemeId] = useState(style.themeId);
  const [savedFontId, setSavedFontId] = useState(style.fontId);
  const [isInDescField, setIsInDescField] = useState(false);
  const [activeListType, setActiveListType] = useState<'bullet' | 'numbered' | null>(null);
  const focusedDescElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const getListType = (el: HTMLElement): 'bullet' | 'numbered' | null => {
      try {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        const range = sel.getRangeAt(0);
        const preRange = document.createRange();
        preRange.selectNodeContents(el);
        preRange.setEnd(range.endContainer, range.endOffset);
        const beforeCursor = preRange.toString();
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const currentLine = el.innerText.slice(lineStart).split('\n')[0] ?? '';
        if (currentLine.startsWith('• ')) return 'bullet';
        if (/^\d+\. /.test(currentLine)) return 'numbered';
        return null;
      } catch { return null; }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable && target.style.display === 'block') {
        focusedDescElRef.current = target;
        setIsInDescField(true);
        setActiveListType(getListType(target));
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target === focusedDescElRef.current) {
        setTimeout(() => {
          if (document.activeElement !== focusedDescElRef.current) {
            focusedDescElRef.current = null;
            setIsInDescField(false);
            setActiveListType(null);
          }
        }, 0);
      }
    };

    const handleSelectionChange = () => {
      const el = focusedDescElRef.current;
      if (el) setActiveListType(getListType(el));
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const applyListFormat = (type: 'bullet' | 'numbered') => {
    const el = focusedDescElRef.current;
    if (!el) return;
    el.focus();

    const transformLines = (lines: string[], t: 'bullet' | 'numbered', current: 'bullet' | 'numbered' | null): string[] => {
      const togglingOff = current === t;
      if (t === 'bullet') {
        if (togglingOff) return lines.map(l => l.replace(/^• /, ''));
        return lines.map(l => {
          if (!l.trim()) return l;
          const stripped = l.replace(/^\d+\. /, '');
          return stripped.startsWith('• ') ? stripped : `• ${stripped}`;
        });
      } else {
        if (togglingOff) return lines.map(l => l.replace(/^\d+\. /, ''));
        let counter = 1;
        return lines.map(l => {
          if (!l.trim()) return l;
          const stripped = l.replace(/^• /, '').replace(/^\d+\. /, '');
          return `${counter++}. ${stripped}`;
        });
      }
    };

    const sel = window.getSelection();
    const hasTextSel = sel && !sel.isCollapsed && sel.toString().length > 0;

    // Capture activeListType at time of click via ref to avoid stale closure
    const currentType = activeListType;

    if (hasTextSel) {
      const lines = sel!.toString().split('\n');
      const result = transformLines(lines, type, currentType);
      document.execCommand('insertText', false, result.join('\n'));
    } else {
      // Apply to entire field content
      const lines = el.innerText.split('\n');
      const result = transformLines(lines, type, currentType);
      const range = document.createRange();
      range.selectNodeContents(el);
      sel?.removeAllRanges();
      sel?.addRange(range);
      document.execCommand('insertText', false, result.join('\n'));
    }
  };

  return (
    <div className="style-panel-horizontal" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '12px 16px',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 10,
      width: '100%',
    }}>
      {/* ── Sidebar toggle ── */}
      {onToggleSidebar && (
        <>
          <Button
            onClick={onToggleSidebar}
            title={sidebarOpen ? 'Ẩn bảng mục' : 'Hiện bảng mục'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: sidebarOpen ? '#f0fdf9' : 'transparent',
              color: sidebarOpen ? 'var(--accent, #0f766e)' : '#9ca3af',
              transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
            }}
          >
            <MdViewSidebar size={20} />
          </Button>
          <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
        </>
      )}
      {/* ── Color Theme (1 box) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MdPalette size={16} color="var(--subtle)" />
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) setSavedThemeId(style.themeId);
            else set('themeId', savedThemeId);
          }}
        >
          <DropdownMenuTrigger asChild>
            <div
              style={{
                width: 24, height: 24, borderRadius: '50%', background: theme.primary,
                cursor: 'pointer', border: '2px solid #e5e7eb'
              }}
              title={theme.label}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-0 border shadow-lg rounded-xl" style={{ width: 220, padding: 12 }}>
            <div
              onMouseLeave={() => {
                set('themeId', savedThemeId);
                useCvEditorStore.temporal.getState().resume();
              }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
            >
              {COLOR_THEMES.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onMouseEnter={() => {
                    useCvEditorStore.temporal.getState().pause();
                    set('themeId', t.id);
                  }}
                  onClick={() => {
                    useCvEditorStore.temporal.getState().resume();
                    set('themeId', t.id);
                    setSavedThemeId(t.id);
                  }}
                  className="focus:bg-transparent"
                  style={{
                    padding: 0,
                    margin: 0,
                    width: 36, height: 36, borderRadius: '50%', background: t.primary,
                    cursor: 'pointer', border: style.themeId === t.id ? '3px solid #000' : '2px solid transparent',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flexShrink: 0
                  }}
                  title={t.label}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

      {/* ── Font (1 box) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MdTextFields size={16} color="var(--subtle)" />
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) setSavedFontId(style.fontId);
            else set('fontId', savedFontId);
          }}
        >
          <DropdownMenuTrigger asChild>
            <div
              style={{
                cursor: 'pointer', padding: '4px 12px', border: '1px solid #e5e7eb',
                borderRadius: 6, fontSize: 13, fontFamily: font.family, background: '#f9fafb',
                width: '150px'
              }}
            >
              {font.label}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-0 border shadow-lg rounded-xl" style={{ width: 320, padding: 12, maxHeight: '60vh', overflowY: 'auto' }}>
            <div
              onMouseLeave={() => {
                set('fontId', savedFontId);
                useCvEditorStore.temporal.getState().resume();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {FONT_OPTIONS.map((f) => (
                <DropdownMenuItem
                  key={f.id}
                  onMouseEnter={() => {
                    useCvEditorStore.temporal.getState().pause();
                    set('fontId', f.id);
                  }}
                  onClick={() => {
                    useCvEditorStore.temporal.getState().resume();
                    set('fontId', f.id);
                    setSavedFontId(f.id);
                  }}
                  className="focus:bg-blue-50 focus:text-inherit"
                  style={{
                    padding: '12px', border: style.fontId === f.id ? '1px solid var(--accent)' : '1px solid #e5e7eb',
                    borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', background: style.fontId === f.id ? '#f0f9ff' : '#fff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: f.family, fontSize: 14, fontWeight: 600 }}>{f.label}</div>
                      <div style={{ fontFamily: f.family, fontSize: 12, color: '#6b7280', marginTop: 4 }}>{f.sample}</div>
                    </div>
                    {style.fontId === f.id && <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

      {/* ── Name Alignment ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Button
          className={`align-btn${style.nameAlign === 'left' ? ' active' : ''}`}
          onClick={() => set('nameAlign', 'left')}
          title="Căn trái"
          style={{ padding: '6px', cursor: 'pointer', borderRadius: 6, border: 'none', background: style.nameAlign === 'left' ? '#e0f2fe' : 'transparent', color: style.nameAlign === 'left' ? '#0369a1' : '#6b7280' }}
        >
          <MdFormatAlignLeft size={18} />
        </Button>
        <Button
          className={`align-btn${style.nameAlign === 'center' ? ' active' : ''}`}
          onClick={() => set('nameAlign', 'center')}
          title="Căn giữa"
          style={{ padding: '6px', cursor: 'pointer', borderRadius: 6, border: 'none', background: style.nameAlign === 'center' ? '#e0f2fe' : 'transparent', color: style.nameAlign === 'center' ? '#0369a1' : '#6b7280' }}
        >
          <MdFormatAlignCenter size={18} />
        </Button>
        <Button
          className={`align-btn${style.nameAlign === 'right' ? ' active' : ''}`}
          onClick={() => set('nameAlign', 'right')}
          title="Căn phải"
          style={{ padding: '6px', cursor: 'pointer', borderRadius: 6, border: 'none', background: style.nameAlign === 'right' ? '#e0f2fe' : 'transparent', color: style.nameAlign === 'right' ? '#0369a1' : '#6b7280' }}
        >
          <MdFormatAlignRight size={18} />
        </Button>

        {/* ── List format buttons ── */}
        <div style={{ width: 1, height: 18, background: '#e5e7eb', margin: '0 2px' }} />
        <Button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyListFormat('bullet')}
          disabled={!isInDescField}
          title={isInDescField ? (activeListType === 'bullet' ? 'Bỏ bullet list' : 'Bullet list') : 'Click vào phần mô tả để dùng'}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '4px 6px', borderRadius: 6, border: 'none', gap: 1,
            background: activeListType === 'bullet' ? '#e0f2fe' : 'transparent',
            color: !isInDescField ? '#d1d5db' : activeListType === 'bullet' ? '#0369a1' : '#6b7280',
            cursor: isInDescField ? 'pointer' : 'not-allowed',
            transition: 'color 0.15s, background 0.15s',
          }}
        >
          <MdFormatListBulleted size={18} />
          <span style={{ fontSize: 9, lineHeight: 1, userSelect: 'none' }}></span>
        </Button>
        <Button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyListFormat('numbered')}
          disabled={!isInDescField}
          title={isInDescField ? (activeListType === 'numbered' ? 'Bỏ numbered list' : 'Numbered list') : 'Click vào phần mô tả để dùng'}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '4px 6px', borderRadius: 6, border: 'none', gap: 1,
            background: activeListType === 'numbered' ? '#e0f2fe' : 'transparent',
            color: !isInDescField ? '#d1d5db' : activeListType === 'numbered' ? '#0369a1' : '#6b7280',
            cursor: isInDescField ? 'pointer' : 'not-allowed',
            transition: 'color 0.15s, background 0.15s',
          }}
        >
          <MdFormatListNumbered size={18} />
          <span style={{ fontSize: 9, lineHeight: 1, userSelect: 'none' }}></span>
        </Button>
      </div>

      <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

      {/* ── Font Size ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Cỡ chữ:</span>
        <input
          type="range"
          min={11}
          max={16}
          value={style.fontSize}
          onChange={(e) => set('fontSize', Number(e.target.value))}
          style={{ width: 80, cursor: 'pointer' }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, minWidth: 32 }}>{style.fontSize}px</span>
      </div>

      <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

      {/* ── Line Height ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <MdLayers size={16} color="var(--subtle)" />
        {LINE_HEIGHT_OPTIONS.map((o) => (
          <Button
            key={o.id}
            onClick={() => set('lineHeight', o.id)}
            style={{
              padding: '6px 10px', fontSize: 13, cursor: 'pointer', borderRadius: 6,
              border: 'none',
              background: style.lineHeight === o.id ? '#e0f2fe' : 'transparent',
              color: style.lineHeight === o.id ? '#0369a1' : '#6b7280',
              fontWeight: style.lineHeight === o.id ? 600 : 400,
            }}
          >
            {o.label}
          </Button>
        ))}
      </div>

      <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

      {/* ── Preview button ── */}
      <a
        href="/preview"
        target="_blank"
        rel="noopener noreferrer"
        title="Xem trước & Tải PDF"
        style={{ textDecoration: 'none' }}
      >
        <Button
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 13px', borderRadius: 8,
            border: '1px solid #0f766e', background: '#f0fdf9',
            color: '#0f766e', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12.5, fontWeight: 600,
            transition: 'background 0.15s, transform 0.1s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#ccfbf1')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f0fdf9')}
        >
          <MdOpenInNew size={15} />
          Xem trước
        </Button>
      </a>
      {onSave && (
        <>
          <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
          <Button
            onClick={() => onSave?.({ captureThumbnail: true })}
            disabled={isSaving}
            title={
              isSaving ? 'Đang lưu...'
                : 'Lưu CV & Preview'
            }
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 13px', borderRadius: 8, fontFamily: 'inherit',
              fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
              cursor: isSaving ? 'default' : 'pointer',
              transition: 'background 0.15s, transform 0.1s',
              border: '1px solid #2563eb',
              background: isSaving
                ? '#eff6ff'
                : '#eff6ff',
              color: isSaving
                ? '#93c5fd'
                : '#2563eb',
              opacity: isSaving ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (!isSaving)
                e.currentTarget.style.background = '#dbeafe';
            }}
            onMouseLeave={e => {
              if (!isSaving)
                e.currentTarget.style.background = '#eff6ff';
            }}
          >
            {isSaving ? (
              // Spinner đơn giản không cần thư viện
              <span style={{
                display: 'inline-block', width: 14, height: 14,
                border: '2px solid #93c5fd', borderTopColor: '#2563eb',
                borderRadius: '50%', animation: 'spin 0.7s linear infinite',
              }} />
            ) : (
              <MdSave size={15} />
            )}
            {isSaving ? 'Đang lưu...' : 'Lưu CV'}
          </Button>
          {/* CSS cho spinner */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
      <div className="flex gap-2">
        <Button
          onClick={() => undo()}
          disabled={
            pastStates.length === 0 ||
            !(pastStates[pastStates.length - 1] as any)?.data?.personal
          }
          className="px-3! py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
        >
          <Undo size={16} className='text-black ' />
        </Button>
        <Button
          onClick={() => redo()}
          disabled={futureStates.length === 0}
          className="px-3! py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
        >
          <Redo size={16} className='text-black ' />
        </Button>
      </div>
    </div>
  );
}