import { MdAdd, MdDelete, MdDragIndicator } from 'react-icons/md';
import { Entry, FieldDef } from '@/types/cvEditor';
import { uid } from '@/constants/cvEditor';
import { useRef } from 'react';

interface EntryEditorProps {
  entries: Entry[];
  fields: FieldDef[];
  addLabel: string;
  onChange: (v: Entry[]) => void;
}

export function EntryEditor({ entries, fields, addLabel, onChange }: EntryEditorProps) {
  const dragIndex = useRef<number | null>(null);

  const update = (id: string, field: string, value: string) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const toggle = (id: string) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, open: !e.open } : e)));

  const remove = (id: string) =>
    onChange(entries.filter((e) => e.id !== id));

  const add = () =>
    onChange([
      ...entries,
      {
        id: uid(),
        open: true,
        ...fields.reduce((acc: Record<string, string>, f: FieldDef) => ({ ...acc, [f.key]: '' }), {}),
      },
    ]);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...entries];
    const [dragged] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, dragged);
    dragIndex.current = index;
    onChange(next);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
  };

  return (
    <div>
      {entries.map((e, index) => (
        <div
          key={e.id}
          className="entry-card"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(ev) => handleDragOver(ev, index)}
          onDragEnd={handleDragEnd}
        >
          {/* Entry header */}
          <div className="entry-header" onClick={() => toggle(e.id)}>
            <span
              style={{ cursor: 'grab', color: 'var(--subtle)', display: 'flex', alignItems: 'center' }}
              onClick={(ev) => ev.stopPropagation()}
            >
              <MdDragIndicator size={16} />
            </span>
            <span
              style={{
                fontSize: 14,
                color: 'var(--subtle)',
                transform: e.open ? 'rotate(180deg)' : '',
                transition: 'transform 0.2s',
                display: 'inline-block',
              }}
            >
              ▾
            </span>
            <div style={{ flex: 1 }}>
              <div className="entry-title">
                {(e[fields[0].key] as string) || 'Chưa đặt tên'}
              </div>
              {fields[1] && e[fields[1].key] && (
                <div className="entry-meta">{e[fields[1].key] as string}</div>
              )}
            </div>
            <button
              className="icon-btn danger"
              onClick={(ev) => {
                ev.stopPropagation();
                remove(e.id);
              }}
            >
              <MdDelete size={13} />
            </button>
          </div>

          {/* Entry body */}
          {e.open && (
            <div className="entry-body">
              {fields.map((f) => (
                <div className="field-group" key={f.key}>
                  <div className="field-label">{f.label}</div>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="field-textarea"
                      value={(e[f.key] as string) || ''}
                      onChange={(ev) => update(e.id, f.key, ev.target.value)}
                      placeholder={f.placeholder || ''}
                    />
                  ) : (
                    <input
                      className="field-input"
                      value={(e[f.key] as string) || ''}
                      onChange={(ev) => update(e.id, f.key, ev.target.value)}
                      placeholder={f.placeholder || ''}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button className="add-btn" onClick={add}>
        <MdAdd size={13} /> {addLabel}
      </button>
    </div>
  );
}