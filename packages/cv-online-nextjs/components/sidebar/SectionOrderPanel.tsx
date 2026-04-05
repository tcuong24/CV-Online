'use client';

import React, { useRef, useState, useEffect } from 'react';
import { MdVisibility } from 'react-icons/md';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { SectionCard, SECTION_META, REQUIRED_SECTIONS } from './SecionCard';

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

  const isSidebarLayout = layoutType === 'sidebar-left' || layoutType === 'sidebar-right';

  // In-flight drag refs
  const dragItem   = useRef<string | null>(null);
  const dragTarget = useRef<string | null>(null);
  // Track which drop zone is currently highlighted
  const [dropZoneActive, setDropZoneActive] = useState<'hidden' | 'side' | 'main' | null>(null);

  // ── Fix #4: reset local state whenever store drag ends ───────────────────────
  useEffect(() => {
    if (!draggingKey) setDropZoneActive(null);
  }, [draggingKey]);

  // ── Derived state ─────────────────────────────────────────────────────────────
  const isVisible = (key: string) => visibility[key] !== false;

  // Fix #2: use ALL_KEYS so sections hidden by default (not in order) also appear
  const hiddenKeys  = ALL_KEYS.filter(k => !isVisible(k));
  const visibleKeys = order.filter(k => isVisible(k));

  // Fix #5: guard sideKeys against stale localStorage values
  const sideVisible = isSidebarLayout && sideKeys.length > 0
    ? sideKeys.filter(k => isVisible(k) && order.includes(k))
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
      {keys.map(key => (
        <SectionCard
          key={key}
          sectionKey={key}
          isDragging={draggingKey === key}
          isDragOver={dragOverKey === key && draggingKey !== key}
          isRequired={REQUIRED_SECTIONS.includes(key)}
          onHide={() => toggleVisibility(key)}
          onDragStart={e => onDragStart(e, key)}
          onDragEnter={e => onDragEnter(e, key)}
          onDragOver={onDragOver}
          onDrop={() => onDropToGrid(zone)}
          onDragEnd={handleReset}
        />
      ))}
    </div>
  );

  return (
    <div className="sc-panel">
      {isSidebarLayout ? (
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
              const meta = SECTION_META[key];
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
    </div>
  );
}
