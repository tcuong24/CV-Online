"use client";

import React, { useState } from "react";
import { CVSkill } from "../../types";

interface SkillsProps {
  skills: CVSkill[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (skills: CVSkill[]) => void;
}

export function Skills({ skills, isEditing = false, onEdit, onSave, onUpdate }: SkillsProps) {
  const [editSkills, setEditSkills] = useState<CVSkill[]>(skills);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editSkills);
    }
    if (onSave) {
      onSave();
    }
  };

  const addSkill = () => {
    const newSkill: CVSkill = {
      id: Date.now(),
      cv_id: 0,
      skill_name: '',
      level: 'intermediate',
      position: editSkills.length + 1
    };
    setEditSkills([...editSkills, newSkill]);
  };

  const updateSkill = (index: number, field: keyof CVSkill, value: any) => {
    const updated = [...editSkills];
    updated[index] = { ...updated[index], [field]: value };
    setEditSkills(updated);
  };

  const removeSkill = (index: number) => {
    setEditSkills(editSkills.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Skills</h3>
          <div>
            <button onClick={addSkill} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Add Skill</button>
            <button onClick={handleSave} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Save</button>
            <button onClick={onSave} style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {editSkills.map((skill, index) => (
            <div key={skill.id || index} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <input
                type="text"
                placeholder="Skill name"
                value={skill.skill_name}
                onChange={(e) => updateSkill(index, 'skill_name', e.target.value)}
                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }}
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <button onClick={() => removeSkill(index)} style={{ width: '100%', padding: '4px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!skills || skills.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px', position: 'relative' }}>
      {onEdit && <button onClick={onEdit} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: 0.8 }}>Edit</button>}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>Skills</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        {skills.map((skill) => (
          <div key={skill.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{skill.skill_name}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>{skill.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

