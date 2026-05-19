'use client';

import React, { useRef, useState, useEffect } from 'react';
import { MdStar, MdVisibility } from 'react-icons/md';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { SectionCard, SECTION_META, REQUIRED_SECTIONS } from './SecionCard';
import { Calendar, Grid2X2, Newspaper, Plus, ScrollText, Tag, Check, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// All known section keys across all templates
const ALL_KEYS = Object.keys(SECTION_META);

export function SectionOrderPanel() {
  const order            = useCvEditorStore(s => s.order);
  const sideKeys         = useCvEditorStore(s => s.sideKeys);
  const visibility       = useCvEditorStore(s => s.visibility);
  const layoutType       = useCvEditorStore(s => s.layoutType);
  const draggingKey      = useCvEditorStore(s => s.draggingKey);
  const dragOverKey      = useCvEditorStore(s => s.dragOverKey);
  const toggleVisibility   = useCvEditorStore(s => s.toggleVisibility);
  const reorderSection     = useCvEditorStore(s => s.reorderSection);
  const reorderSideKey     = useCvEditorStore(s => s.reorderSideKey);
  const moveSectionToZone  = useCvEditorStore(s => s.moveSectionToZone);
  const setDragging      = useCvEditorStore(s => s.setDragging);
  const setDragOver      = useCvEditorStore(s => s.setDragOver);
  const resetDrag        = useCvEditorStore(s => s.resetDrag);
  const data             = useCvEditorStore(s => s.data);
  const sectionLayout    = useCvEditorStore(s => s.sectionLayout);
  const addCustomSection = useCvEditorStore(s => s.addCustomSection);
  const removeCustomSection = useCvEditorStore(s => s.removeCustomSection);

  const isSidebarLayout = layoutType === 'sidebar-left' || layoutType === 'sidebar-right' || layoutType === 'two-column';
  console.log("abc",isSidebarLayout);
  
  // In-flight drag refs
  const dragItem   = useRef<string | null>(null);
  const dragTarget = useRef<string | null>(null);
  // Track which drop zone is currently highlighted
  const [dropZoneActive, setDropZoneActive] = useState<'hidden' | 'side' | 'main' | null>(null);

  // States for the new modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'standard' | 'custom'>('standard');
  const [customTitle, setCustomTitle] = useState('');
  const [customStyle, setCustomStyle] = useState<'timeline' | 'list' | 'tags' | 'text' | 'grid'>('timeline');
  const [customConfig, setCustomConfig] = useState({
    showSubtitle: true,
    showDateRange: true,
    showDescription: true,
  });

  // Automatically update field configs when changing custom style
  useEffect(() => {
    if (customStyle === 'timeline') {
      setCustomConfig({ showSubtitle: true, showDateRange: true, showDescription: true });
    } else if (customStyle === 'list' || customStyle === 'grid') {
      setCustomConfig({ showSubtitle: true, showDateRange: false, showDescription: true });
    } else if (customStyle === 'tags') {
      setCustomConfig({ showSubtitle: false, showDateRange: false, showDescription: false });
    } else if (customStyle === 'text') {
      setCustomConfig({ showSubtitle: false, showDateRange: false, showDescription: true });
    }
  }, [customStyle]);

  // ── Fix #4: reset local state whenever store drag ends ───────────────────────
  useEffect(() => {
    if (!draggingKey) setDropZoneActive(null);
  }, [draggingKey]);

  // Derived state
  const isVisible = (key: string) => visibility[key] !== false;

  const customKeys = (data.customSections || []).map(cs => cs.id);
  const allCurrentKeys = [...new Set([...ALL_KEYS, ...order, ...customKeys])];

  const hiddenKeys  = allCurrentKeys.filter(k => !isVisible(k) && (ALL_KEYS.includes(k) || customKeys.includes(k)));
  const visibleKeys = order.filter(k => isVisible(k));

  // Fix #5: guard sideKeys against stale localStorage values
  const sideVisible = isSidebarLayout && sideKeys.length > 0
    ? sideKeys.filter(k => isVisible(k))
    : [];
  const mainVisible = isSidebarLayout
    ? visibleKeys.filter(k => !sideKeys.includes(k))
    : visibleKeys;

  // ── Drag handlers ─────────────────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, key: string) => {
    dragItem.current   = key;
    dragTarget.current = null;
    setDragging(key);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnter = (_e: React.DragEvent, key: string) => {
    dragTarget.current = key;
    setDragOver(key);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleReset = () => {
    dragItem.current   = null;
    dragTarget.current = null;
    setDropZoneActive(null);
    resetDrag();
  };

  // ── Fix #3 + Fix #1: unified drop handler for grid zones ─────────────────────
  // Handles drops FROM: visible cards (reorder), side cards (cross-zone), hidden chips (show)
  const onDropToGrid = (zone: 'main' | 'side') => {
    const from = dragItem.current;
    const to   = dragTarget.current;

    if (!from) { handleReset(); return; }

    const fromIsHidden  = !isVisible(from);
    const fromInSide    = sideKeys.includes(from);
    const fromInMain    = !fromInSide && isVisible(from);

    // ── Dragging a hidden chip back into the grid → show it ──────────────────
    if (fromIsHidden) {
      toggleVisibility(from);
      handleReset();
      return;
    }

    if (zone === 'main') {
      // Fix #1: moveSectionToZone FIRST so from is in order before reorderSection
      if (fromInSide) {
        moveSectionToZone(from, false);
      }
      if (to && to !== from) {
        reorderSection(from, to);
      }
    } else {
      // zone === 'side'
      if (fromInMain) {
        moveSectionToZone(from, true);
      }
      if (to && to !== from && sideKeys.includes(to)) {
        reorderSideKey(from, to);
      }
    }

    handleReset();
  };

  // Drop into hidden zone → hide the dragged card
  const onDropHiddenZone = () => {
    const from = dragItem.current;
    // Fix #7: do not hide required sections
    if (from && isVisible(from) && !REQUIRED_SECTIONS.includes(from)) {
      toggleVisibility(from);
    }
    handleReset();
  };

  // ── Render helpers ────────────────────────────────────────────────────────────
  const renderGrid = (keys: string[], zone: 'main' | 'side') => (
    <div
      className="sc-grid"
      // Fix #3: grid container itself can receive drops from hidden chips
      onDragOver={e => { e.preventDefault(); setDropZoneActive(zone); }}
      onDrop={() => onDropToGrid(zone)}
    >
      {keys.map(key => {
        const customSec = data.customSections?.find(cs => cs.id === key);
        return (
          <SectionCard
            key={key}
            sectionKey={key}
            isDragging={draggingKey === key}
            isDragOver={dragOverKey === key && draggingKey !== key}
            isRequired={REQUIRED_SECTIONS.includes(key)}
            customTitle={customSec?.sectionTitle}
            onHide={() => toggleVisibility(key)}
            onDelete={() => removeCustomSection(key)}
            onDragStart={e => onDragStart(e, key)}
            onDragEnter={e => onDragEnter(e, key)}
            onDragOver={onDragOver}
            onDrop={() => onDropToGrid(zone)}
            onDragEnd={handleReset}
          />
        );
      })}
    </div>
  );

  return (
    <div className="sc-panel flex flex-col h-full">
      {isSidebarLayout ? (
        <>
          {layoutType === 'sidebar-right' ? (
            <>
              {/* ── Main zone ── */}
              <div className="sc-zone-label">Cột trái (main CV)</div>
              <div
                className={`sc-zone${dropZoneActive === 'main' ? ' zone-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDropZoneActive('main'); }}
                onDragLeave={() => setDropZoneActive(null)}
                onDrop={() => onDropToGrid('main')}
              >
                {renderGrid(mainVisible, 'main')}
              </div>

              {/* ── Sidebar zone ── */}
              <div className="sc-zone-label" style={{ marginTop: 12 }}>Cột phải (sidebar CV)</div>
              <div
                className={`sc-zone${dropZoneActive === 'side' ? ' zone-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDropZoneActive('side'); }}
                onDragLeave={() => setDropZoneActive(null)}
                onDrop={() => onDropToGrid('side')}
              >
                {sideVisible.length > 0
                  ? renderGrid(sideVisible, 'side')
                  : (
                    <div className="sc-zone-empty">Kéo mục vào đây</div>
                  )
                }
              </div>
            </>
          ) : (
            <>
              {/* ── Sidebar zone ── */}
              <div className="sc-zone-label">Cột trái (sidebar CV)</div>
              <div
                className={`sc-zone${dropZoneActive === 'side' ? ' zone-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDropZoneActive('side'); }}
                onDragLeave={() => setDropZoneActive(null)}
                onDrop={() => onDropToGrid('side')}
              >
                {sideVisible.length > 0
                  ? renderGrid(sideVisible, 'side')
                  : (
                    <div className="sc-zone-empty">Kéo mục vào đây</div>
                  )
                }
              </div>

              {/* ── Main zone ── */}
              <div className="sc-zone-label" style={{ marginTop: 12 }}>Cột phải (main CV)</div>
              <div
                className={`sc-zone${dropZoneActive === 'main' ? ' zone-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDropZoneActive('main'); }}
                onDragLeave={() => setDropZoneActive(null)}
                onDrop={() => onDropToGrid('main')}
              >
                {renderGrid(mainVisible, 'main')}
              </div>
            </>
          )}
        </>
      ) : (
        /* ── Single column: one flat grid ── */
        <div
          className={`sc-zone${dropZoneActive === 'main' ? ' zone-active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDropZoneActive('main'); }}
          onDragLeave={() => setDropZoneActive(null)}
          onDrop={() => onDropToGrid('main')}
        >
          {renderGrid(mainVisible, 'main')}
        </div>
      )}

      {/* ── Drop zone: hide section ── */}
      <div
        className={`sc-hidden-zone${dropZoneActive === 'hidden' ? ' active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDropZoneActive('hidden'); }}
        onDragLeave={() => setDropZoneActive(null)}
        onDrop={onDropHiddenZone}
      >
        <span className="sc-hidden-label">↓ Kéo thả vào đây để ẩn mục</span>
        {hiddenKeys.length > 0 && (
          <div className="sc-hidden-chips">
            {hiddenKeys.map(key => {
              const customSec = data.customSections?.find(cs => cs.id === key);
              const meta = key.startsWith('custom-')
                ? { label: customSec?.sectionTitle || 'Mục tùy chỉnh', icon: <MdStar />, color: '#fff1f2', iconColor: '#e11d48' }
                : SECTION_META[key];
                
              if (!meta) return null;
              return (
                <button
                  key={key}
                  className="sc-chip"
                  title="Kéo lên hoặc click để hiện lại"
                  draggable
                  onDragStart={e => onDragStart(e, key)}
                  onDragEnd={handleReset}
                  // Fix #3: clicking chip also shows it
                  onClick={() => toggleVisibility(key)}
                  style={{
                    color: meta.iconColor,
                    borderColor: `${meta.iconColor}55`,
                    background: meta.color,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{meta.icon}</span>
                  {meta.label}
                  <MdVisibility size={12} style={{ opacity: 0.7 }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Add Section Button */}
      <div className="mt-6 px-1">
        <Button
          onClick={() => {
            setModalOpen(true);
            setModalTab('standard');
          }}
          className="w-full py-6 border border-[#1e3a3a] !bg-white flex items-center justify-center gap-2 rounded-xl  text-[#1e3a3a] font-semibold hover:bg-[#1e3a3a] transition-all duration-200 cursor-pointer"
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span>Thêm mục mới</span>
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-0 max-h-[85vh] flex flex-col transition-all duration-300 ${
          modalTab === 'custom' ? '!max-w-5xl w-[1000px]' : '!max-w-2xl w-[672px]'
        }`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Thêm mục nội dung mới vào CV
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Kích hoạt các mục tiêu chuẩn hoặc tạo mục tùy chỉnh với cấu hình hiển thị mong muốn.
              </DialogDescription>
            </DialogHeader>

            {/* Custom Tab Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 mt-4">
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  modalTab === 'standard'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
                onClick={() => setModalTab('standard')}
              >
                Mục có sẵn trong dự án
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  modalTab === 'custom'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
                onClick={() => setModalTab('custom')}
              >
                Tạo mục tùy chỉnh
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {modalTab === 'standard' ? (
              <div className="grid grid-cols-3 gap-4 pr-1">
                {Object.keys(SECTION_META)
                  .filter((key) => key !== 'personal')
                  .map((key) => {
                    const meta = SECTION_META[key];
                    const isCurrentlyVisible = (order.includes(key) || sideKeys.includes(key)) && visibility[key] !== false;
                    
                    // Count actual items from API data
                    let dataCount = 0;
                    if (key === 'summary') {
                      dataCount = data.personal?.summary ? 1 : 0;
                    } else if (Array.isArray(data[key as keyof typeof data])) {
                      dataCount = (data[key as keyof typeof data] as any[]).length;
                    }

                    return (
                      <div
                        key={key}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-200 relative group shadow-xs"
                      >
                        {/* Beautiful Square Centered Icon Container */}
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg mb-3 shadow-xs font-semibold"
                          style={{ backgroundColor: meta.color, color: meta.iconColor }}
                        >
                          {meta.icon}
                        </div>
                        
                        <div className="font-bold text-slate-800 dark:text-white text-sm">
                          {meta.label}
                        </div>
                        
                        {/* Data status from API */}
                        {dataCount > 0 ? (
                          <div className="text-[10px] text-emerald-600 font-bold dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full mt-2 border border-emerald-100 dark:border-emerald-950">
                            Có {dataCount} {key === 'summary' ? 'đoạn' : key === 'skills' || key === 'interests' ? 'thẻ' : 'mục'} dữ liệu
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-full">
                            Chưa có dữ liệu
                          </div>
                        )}

                        <div className="mt-auto pt-4 w-full">
                          {isCurrentlyVisible ? (
                            <span className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400 py-2 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
                              <Check size={12} className="stroke-[3]" />
                              Đang hiển thị
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/40 text-[11px] font-bold transition-all cursor-pointer border-none shadow-xs"
                              onClick={() => {
                                toggleVisibility(key);
                                toast.success(`Đã kích hoạt mục "${meta.label}" trên CV!`);
                              }}
                            >
                              + Hiển thị
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex gap-8 items-start">
                {/* Form Column */}
                <div className="flex-1 space-y-5 py-1 pr-1">
                  {/* Custom Section Title Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Tên mục tùy chỉnh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white transition-all shadow-xs"
                      placeholder="Ví dụ: Hoạt động ngoại khóa, Chứng chỉ tin học..."
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                    />
                  </div>

                  {/* Custom Style Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Kiểu hiển thị (Style Layout)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'timeline', label: 'Timeline', desc: 'Trục thời gian', icon: <Calendar />, color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50' },
                        { id: 'list', label: 'Danh sách', desc: 'Các mục nối tiếp', icon: <ScrollText />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50' },
                        { id: 'tags', label: 'Thẻ / Tags', desc: 'Kiểu bong bóng', icon: <Tag />, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50' },
                        { id: 'text', label: 'Văn bản', desc: 'Đoạn văn tự do', icon: <Newspaper />, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50' },
                        { id: 'grid', label: 'Lưới / Grid', desc: 'Lưới chia cột', icon: <Grid2X2 />, color: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer bg-white dark:bg-slate-800 ${
                            customStyle === item.id
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-600/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                          onClick={() => setCustomStyle(item.id as any)}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg mb-3 shadow-xs ${item.color}`}>
                            {item.icon}
                          </div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {item.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conditional Field Options Config */}
                  <div className="space-y-3.5 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Cấu hình tùy chọn hiển thị
                    </label>
                    
                    {customStyle === 'timeline' && (
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Checkbox
                            checked={customConfig.showSubtitle}
                            onChange={(e) => setCustomConfig({ ...customConfig, showSubtitle: e.target.checked })}
                          />
                          <span>Hiển thị tiêu đề phụ (Ví dụ: Tên công ty / Trường học / Tổ chức)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Checkbox
                            checked={customConfig.showDateRange}
                            onChange={(e) => setCustomConfig({ ...customConfig, showDateRange: e.target.checked })}
                          />
                          <span>Hiển thị khoảng thời gian (Ví dụ: 2020 - 2024)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Checkbox
                            checked={customConfig.showDescription}
                            onChange={(e) => setCustomConfig({ ...customConfig, showDescription: e.target.checked })}
                          />
                          <span>Hiển thị mô tả chi tiết nội dung</span>
                        </label>
                      </div>
                    )}

                    {(customStyle === 'list' || customStyle === 'grid') && (
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Checkbox
                            checked={customConfig.showSubtitle}
                            onChange={(e) => setCustomConfig({ ...customConfig, showSubtitle: e.target.checked })}
                          />
                          <span>Hiển thị tiêu đề phụ (Ví dụ: Tên nhóm, vai trò hoặc phân cấp phụ)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Checkbox
                            checked={customConfig.showDescription}
                            onChange={(e) => setCustomConfig({ ...customConfig, showDescription: e.target.checked })}
                          />
                          <span>Hiển thị mô tả chi tiết nội dung</span>
                        </label>
                      </div>
                    )}

                    {customStyle === 'tags' && (
                      <div className="flex items-start gap-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3.5 rounded-lg border border-amber-100/50 dark:border-amber-900/30">
                        <HelpCircle size={16} className="mt-0.5 shrink-0" />
                        <span>
                          <strong>Kiểu thẻ (Tags):</strong> Layout này chỉ hiển thị danh mục các thẻ (tags) từ khóa nhỏ gọn (như kỹ năng, sở thích), các tùy chọn tiêu đề phụ, khoảng thời gian và mô tả chi tiết sẽ được tự động ẩn đi để giao diện trực quan và tinh tế.
                        </span>
                      </div>
                    )}

                    {customStyle === 'text' && (
                      <div className="flex items-start gap-3 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 p-3.5 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                        <HelpCircle size={16} className="mt-0.5 shrink-0" />
                        <span>
                          <strong>Kiểu văn bản (Text):</strong> Thích hợp cho các phần như châm ngôn sống, cam kết nghề nghiệp hoặc thư ngỏ. Chỉ hiển thị vùng soạn thảo văn bản tự do lớn duy nhất, bỏ qua các cấu hình phân cấp phụ.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Button */}
                  <Button
                    type="button"
                    className="w-full py-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all cursor-pointer mt-4"
                    onClick={() => {
                      if (!customTitle.trim()) {
                        toast.error('Vui lòng nhập tên mục tùy chỉnh!');
                        return;
                      }
                      addCustomSection(customTitle, customConfig, customStyle);
                      toast.success(`Đã tạo thành công mục tùy chỉnh "${customTitle}"!`);
                      setCustomTitle('');
                      setModalOpen(false);
                    }}
                  >
                    Tạo mục tùy chỉnh
                  </Button>
                </div>

                {/* Live Preview Column */}
                <div className="w-[340px] shrink-0 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-5 flex flex-col h-[520px] shadow-inner sticky top-0">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Xem trước giao diện</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-450 font-extrabold text-[9px] uppercase tracking-normal">Live Preview</span>
                  </div>
                  
                  {/* Paper simulation */}
                  <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl p-5 shadow-xs overflow-hidden flex flex-col">
                    {/* Fake Header */}
                    <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200 border-b pb-2 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-slate-100 dark:border-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                      <span>{customTitle.trim() || 'Tên mục tùy chỉnh'}</span>
                    </div>

                    {/* Fake Body based on customStyle */}
                    <div className="flex-1 overflow-hidden text-[10px] text-slate-550 dark:text-slate-400 leading-relaxed">
                      {customStyle === 'timeline' && (
                        <div className="space-y-4 relative pl-3.5 border-l-2 border-slate-100 dark:border-slate-900 ml-1.5">
                          {[1, 2].map((idx) => (
                            <div key={idx} className="relative group/preview-item">
                              {/* Dot */}
                              <div className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950 group-hover/preview-item:bg-indigo-600 transition-colors"></div>
                              
                              <div className="font-extrabold text-slate-700 dark:text-slate-300 text-[10.5px]">
                                {idx === 1 ? 'Chuyên viên phát triển Java' : 'Lập trình viên Web'}
                              </div>

                              {customConfig.showSubtitle && (
                                <div className="text-[9.5px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                                  {idx === 1 ? 'Công ty Công nghệ ABC' : 'Freelance Project'}
                                </div>
                              )}

                              {customConfig.showDateRange && (
                                <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                                  {idx === 1 ? '2022 - Hiện tại' : '2021 - 2022'}
                                </div>
                              )}

                              {customConfig.showDescription && (
                                <div className="text-slate-400 dark:text-slate-500 mt-1 leading-normal">
                                  {idx === 1 
                                    ? 'Thiết kế, xây dựng và tối ưu các dịch vụ Backend microservices.' 
                                    : 'Xây dựng giao diện Responsive, tích hợp các API dịch vụ bên thứ ba.'}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {customStyle === 'list' && (
                        <div className="space-y-3.5">
                          {[1, 2].map((idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                              <div className="flex-1">
                                <div className="font-extrabold text-slate-700 dark:text-slate-300 text-[10.5px]">
                                  {idx === 1 ? 'Chứng chỉ Ngoại ngữ IELTS 7.5' : 'Chứng chỉ Tin học MOS Excel'}
                                </div>

                                {customConfig.showSubtitle && (
                                  <div className="text-[9.5px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                                    {idx === 1 ? 'IDP Education' : 'Microsoft Office Specialist'}
                                  </div>
                                )}

                                {customConfig.showDescription && (
                                  <div className="text-slate-400 dark:text-slate-500 mt-1 leading-normal">
                                    {idx === 1 
                                      ? 'Đạt điểm thành phần Listening: 8.0, Reading: 8.0.' 
                                      : 'Thành thạo các hàm tính toán nâng cao và công cụ Pivot Table.'}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {customStyle === 'tags' && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['Java Core', 'Spring Boot', 'SQL', 'Git & Github', 'Docker', 'Kubernetes', 'CI/CD'].map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/80 transition-colors hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {customStyle === 'text' && (
                        <div className="space-y-2.5 pt-1">
                          <p className="leading-relaxed text-slate-400 dark:text-slate-500 text-justify">
                            Tôi là một kỹ sư phần mềm giàu nhiệt huyết, luôn khát khao học hỏi công nghệ mới và cống hiến hết mình cho các sản phẩm chuyển đổi số đột phá.
                          </p>
                          <p className="leading-relaxed text-slate-400 dark:text-slate-500 text-justify">
                            Rất mong muốn được đồng hành cùng đội ngũ kỹ thuật năng động để cùng chinh phục những mục tiêu tăng trưởng lớn của dự án.
                          </p>
                        </div>
                      )}

                      {customStyle === 'grid' && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950 flex flex-col gap-1 shadow-2xs">
                              <div className="font-extrabold text-slate-700 dark:text-slate-350 text-[9.5px]">
                                {idx === 1 ? 'UI/UX Design' : idx === 2 ? 'Backend Dev' : idx === 3 ? 'Cloud DevOps' : 'Soft Skills'}
                              </div>

                              {customConfig.showSubtitle && (
                                <div className="text-[8.5px] text-indigo-600 dark:text-indigo-400 font-bold">
                                  {idx === 1 ? 'Figma, Adobe XD' : idx === 2 ? 'NodeJS, NestJS' : idx === 3 ? 'AWS, Docker' : 'Teamwork'}
                                </div>
                              )}

                              {customConfig.showDescription && (
                                <div className="text-[8.5px] text-slate-400 dark:text-slate-500 leading-normal mt-0.5">
                                  {idx === 1 ? 'Thiết kế wireframe' : idx === 2 ? 'Xây dựng RESTful API' : idx === 3 ? 'Tích hợp CI/CD' : 'Giao tiếp tốt'}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Paper Footer Accent */}
                    <div className="border-t border-slate-100 dark:border-slate-900 pt-2.5 mt-auto flex items-center justify-between text-[8px] text-slate-350 dark:text-slate-650">
                      <span>CV Page Preview</span>
                      <span>Page 1 of 1</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

