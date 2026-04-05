"use client";

import React, { useState } from "react";
import { CVLanguage } from "../../types";

interface LanguagesProps {
  languages: CVLanguage[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (languages: CVLanguage[]) => void;
}

export function Languages({ languages, isEditing = false, onEdit, onSave, onUpdate }: LanguagesProps) {
  const [editLanguages, setEditLanguages] = useState<CVLanguage[]>(languages);

  const handleSave = () => {
    if (onUpdate) onUpdate(editLanguages);
    if (onSave) onSave();
  };

  const addLanguage = () => {
    const newLanguage: CVLanguage = {
      id: Date.now(),
      cv_id: 0,
      language: '',
      level: 'intermediate',
      position: editLanguages.length + 1
    };
    setEditLanguages([...editLanguages, newLanguage]);
  };

  const updateLanguage = (index: number, field: keyof CVLanguage, value: any) => {
    const updated = [...editLanguages];
    updated[index] = { ...updated[index], [field]: value };
    setEditLanguages(updated);
  };

  const removeLanguage = (index: number) => {
    setEditLanguages(editLanguages.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Languages</h3>
          <div>
            <button onClick={addLanguage} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Add Language</button>
            <button onClick={handleSave} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Save</button>
            <button onClick={onSave} style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {editLanguages.map((lang, index) => (
            <div key={lang.id || index} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <input
                type="text"
                placeholder="Language"
                value={lang.language}
                onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }}
              />
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }}
              >
                <option value="basic">Basic</option>
                <option value="conversational">Conversational</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
              <button onClick={() => removeLanguage(index)} style={{ width: '100%', padding: '4px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!languages || languages.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px', position: 'relative' }}>
      {onEdit && <button onClick={onEdit} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: 0.8 }}>Edit</button>}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>Languages</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        {languages.map((lang) => (
          <div key={lang.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{lang.language}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>{lang.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

