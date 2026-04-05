"use client";

import React, { useState } from "react";
import { CVEducation } from "../../types";

interface EducationProps {
  educations: CVEducation[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (educations: CVEducation[]) => void;
}

export function Education({ educations, isEditing = false, onEdit, onSave, onUpdate }: EducationProps) {
  const [editEducations, setEditEducations] = useState<CVEducation[]>(educations);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editEducations);
    }
    if (onSave) {
      onSave();
    }
  };

  const addEducation = () => {
    const newEducation: CVEducation = {
      id: Date.now(),
      cv_id: 0,
      school: '',
      major: '',
      start_year: new Date().getFullYear(),
      end_year: undefined,
      description: '',
      position: editEducations.length + 1
    };
    setEditEducations([...editEducations, newEducation]);
  };

  const updateEducation = (index: number, field: keyof CVEducation, value: any) => {
    const updated = [...editEducations];
    updated[index] = { ...updated[index], [field]: value };
    setEditEducations(updated);
  };

  const removeEducation = (index: number) => {
    setEditEducations(editEducations.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Education</h3>
          <div>
            <button onClick={addEducation} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Add Education</button>
            <button onClick={handleSave} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Save</button>
            <button onClick={onSave} style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>

        {editEducations.map((edu, index) => (
          <div key={edu.id || index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input type="text" placeholder="School" value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <input type="text" placeholder="Major" value={edu.major} onChange={(e) => updateEducation(index, 'major', e.target.value)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <input type="number" placeholder="Start Year" value={edu.start_year} onChange={(e) => updateEducation(index, 'start_year', parseInt(e.target.value))} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <input type="number" placeholder="End Year" value={edu.end_year || ''} onChange={(e) => updateEducation(index, 'end_year', e.target.value ? parseInt(e.target.value) : undefined)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
            <textarea placeholder="Description" value={edu.description || ''} onChange={(e) => updateEducation(index, 'description', e.target.value)} style={{ width: '100%', minHeight: '60px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical' }} />
            <button onClick={() => removeEducation(index)} style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
      </div>
    );
  }

  if (!educations || educations.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px', position: 'relative' }}>
      {onEdit && <button onClick={onEdit} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: 0.8 }}>Edit</button>}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>Education</h2>
      {educations.map((edu) => (
        <div key={edu.id} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{edu.major}</h3>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--cv-color, #2563eb)', margin: '0 0 4px 0' }}>{edu.school}</p>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{edu.start_year} - {edu.end_year ?? 'Present'}</p>
          </div>
          {edu.description && <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>{edu.description}</p>}
        </div>
      ))}
    </div>
  );
}

