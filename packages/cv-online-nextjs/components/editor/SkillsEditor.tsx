import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

interface SkillsEditorProps {
  skills: string[];
  onChange: (v: string[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !skills.includes(v)) {
      onChange([...skills, v]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="skill-input-row">
        <input
          className="field-input"
          placeholder="Thêm kỹ năng..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="skill-add" onClick={add}>
          <MdAdd size={15} />
        </button>
      </div>
      <div className="skills-grid">
        {skills.map((s) => (
          <span key={s} className="skill-chip">
            {s}
            <button onClick={() => onChange(skills.filter((x) => x !== s))}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}