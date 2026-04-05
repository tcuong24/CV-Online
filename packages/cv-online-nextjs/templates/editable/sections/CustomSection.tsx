"use client";

import React, { useState } from "react";
import { CVCustomSection } from "../../types";

interface CustomSectionProps {
  section: CVCustomSection;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (section: CVCustomSection) => void;
}

export function CustomSection({ section, isEditing = false, onEdit, onSave, onUpdate }: CustomSectionProps) {
  const [editData, setEditData] = useState({
    section_title: section.section_title,
    content: section.content
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...section,
        ...editData
      });
    }
    if (onSave) {
      onSave();
    }
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Custom Section</h3>
          <div>
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Section Title</label>
          <input
            type="text"
            value={editData.section_title}
            onChange={(e) => setEditData({ ...editData, section_title: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Content</label>
          <textarea
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>
      </div>
    );
  }

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
        {section.section_title}
      </h2>
      <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
        {section.content.split('\n').map((paragraph, index) => (
          <p key={index} style={{ margin: '0 0 12px 0' }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

