import { MdAdd, MdDelete } from 'react-icons/md';
import { LanguageEntry } from '@/types/cvEditor';
import { uid } from '@/constants/cvEditor';

interface LangEditorProps {
  languages: LanguageEntry[];
  onChange: (v: LanguageEntry[]) => void;
}

export function LangEditor({ languages, onChange }: LangEditorProps) {
  const update = (id: string, field: keyof LanguageEntry, value: string | number) =>
    onChange(languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const add = () =>
    onChange([...languages, { id: uid(), lang: '', level: 3 }]);

  const remove = (id: string) =>
    onChange(languages.filter((l) => l.id !== id));

  return (
    <div>
      {languages.map((l) => (
        <div
          key={l.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: 8,
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <input
            className="field-input"
            placeholder="Ngôn ngữ"
            value={l.lang}
            onChange={(e) => update(l.id, 'lang', e.target.value)}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`lang-dot${l.level >= i ? ' filled' : ''}`}
                onClick={() => update(l.id, 'level', i)}
              />
            ))}
          </div>
          <button className="icon-btn danger" onClick={() => remove(l.id)}>
            <MdDelete size={14} />
          </button>
        </div>
      ))}
      <button className="add-btn" onClick={add}>
        <MdAdd size={13} /> Thêm ngôn ngữ
      </button>
    </div>
  );
}