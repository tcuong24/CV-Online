"use client";

import React, { useState } from "react";
import { CVExperience } from "../../types";

interface ExperienceProps {
  experiences: CVExperience[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (experiences: CVExperience[]) => void;
}

export function Experience({ experiences, isEditing = false, onEdit, onSave, onUpdate }: ExperienceProps) {
  const [editExperiences, setEditExperiences] = useState<CVExperience[]>(experiences);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editExperiences);
    }
    if (onSave) {
      onSave();
    }
  };

  const addExperience = () => {
    const newExperience: CVExperience = {
      id: Date.now(), // Temporary ID for editing
      cv_id: 0,
      company: '',
      role: '',
      start_date: new Date(),
      end_date: undefined,
      description: '',
      position: editExperiences.length + 1
    };
    setEditExperiences([...editExperiences, newExperience]);
  };

  const updateExperience = (index: number, field: keyof CVExperience, value: any) => {
    const updated = [...editExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setEditExperiences(updated);
  };

  const removeExperience = (index: number) => {
    setEditExperiences(editExperiences.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Experience</h3>
          <div>
            <button
              onClick={addExperience}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              Add Experience
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '6px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        {editExperiences.map((exp, index) => (
          <div key={exp.id || index} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0 }}>Experience {index + 1}</h4>
              <button
                onClick={() => removeExperience(index)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Role</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Start Date</label>
                <input
                  type="date"
                  value={exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateExperience(index, 'start_date', new Date(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>End Date</label>
                <input
                  type="date"
                  value={exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateExperience(index, 'end_date', e.target.value ? new Date(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '6px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!experiences || experiences.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px', position: 'relative' }}>
      {onEdit && (
        <button
          onClick={onEdit}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            opacity: 0.8
          }}
        >
          Edit
        </button>
      )}

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>
        Work Experience
      </h2>

      {experiences.map((exp, index) => (
        <div key={exp.id} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {exp.role}
              </h3>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--cv-color, #2563eb)', margin: '0 0 4px 0' }}>
                {exp.company}
              </p>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
            </p>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
}

