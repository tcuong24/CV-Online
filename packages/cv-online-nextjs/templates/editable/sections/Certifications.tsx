"use client";

import React, { useState } from "react";
import { CVCertification } from "../../types";

interface CertificationsProps {
  certifications: CVCertification[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (certifications: CVCertification[]) => void;
}

export function Certifications({ certifications, isEditing = false, onEdit, onSave, onUpdate }: CertificationsProps) {
  const [editCertifications, setEditCertifications] = useState<CVCertification[]>(certifications);

  const handleSave = () => {
    if (onUpdate) onUpdate(editCertifications);
    if (onSave) onSave();
  };

  const addCertification = () => {
    const newCertification: CVCertification = {
      id: Date.now(),
      cv_id: 0,
      name: '',
      organization: '',
      issue_date: new Date(),
      expire_date: undefined,
      position: editCertifications.length + 1
    };
    setEditCertifications([...editCertifications, newCertification]);
  };

  const updateCertification = (index: number, field: keyof CVCertification, value: any) => {
    const updated = [...editCertifications];
    updated[index] = { ...updated[index], [field]: value };
    setEditCertifications(updated);
  };

  const removeCertification = (index: number) => {
    setEditCertifications(editCertifications.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Certifications</h3>
          <div>
            <button onClick={addCertification} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Add Certification</button>
            <button onClick={handleSave} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Save</button>
            <button onClick={onSave} style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>

        {editCertifications.map((cert, index) => (
          <div key={cert.id || index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input placeholder="Certification Name" value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <input placeholder="Organization" value={cert.organization} onChange={(e) => updateCertification(index, 'organization', e.target.value)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="date" value={cert.issue_date ? new Date(cert.issue_date).toISOString().split('T')[0] : ''} onChange={(e) => updateCertification(index, 'issue_date', new Date(e.target.value))} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <input type="date" value={cert.expire_date ? new Date(cert.expire_date).toISOString().split('T')[0] : ''} onChange={(e) => updateCertification(index, 'expire_date', e.target.value ? new Date(e.target.value) : undefined)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
            <button onClick={() => removeCertification(index)} style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
      </div>
    );
  }

  if (!certifications || certifications.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px', position: 'relative' }}>
      {onEdit && <button onClick={onEdit} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: 0.8 }}>Edit</button>}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>Certifications</h2>
      {certifications.map((cert) => (
        <div key={cert.id} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{cert.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--cv-color, #2563eb)', margin: '0 0 2px 0' }}>{cert.organization}</p>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
              <div>Issued: {formatDate(cert.issue_date)}</div>
              {cert.expire_date && <div>Expires: {formatDate(cert.expire_date)}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

