"use client";

import React, { useState } from "react";
import { CVProject } from "../../types";

interface ProjectsProps {
  projects: CVProject[];
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onUpdate?: (projects: CVProject[]) => void;
}

export function Projects({ projects, isEditing = false, onEdit, onSave, onUpdate }: ProjectsProps) {
  const [editProjects, setEditProjects] = useState<CVProject[]>(projects);

  const handleSave = () => {
    if (onUpdate) onUpdate(editProjects);
    if (onSave) onSave();
  };

  const addProject = () => {
    const newProject: CVProject = {
      id: Date.now(),
      cv_id: 0,
      project_name: '',
      role: '',
      technologies: '',
      description: '',
      link: '',
      position: editProjects.length + 1
    };
    setEditProjects([...editProjects, newProject]);
  };

  const updateProject = (index: number, field: keyof CVProject, value: any) => {
    const updated = [...editProjects];
    updated[index] = { ...updated[index], [field]: value };
    setEditProjects(updated);
  };

  const removeProject = (index: number) => {
    setEditProjects(editProjects.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Projects</h3>
          <div>
            <button onClick={addProject} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Add Project</button>
            <button onClick={handleSave} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Save</button>
            <button onClick={onSave} style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>

        {editProjects.map((project, index) => (
          <div key={project.id || index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input placeholder="Project Name" value={project.project_name} onChange={(e) => updateProject(index, 'project_name', e.target.value)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <input placeholder="Your Role" value={project.role} onChange={(e) => updateProject(index, 'role', e.target.value)} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
            <input placeholder="Technologies" value={project.technologies} onChange={(e) => updateProject(index, 'technologies', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }} />
            <textarea placeholder="Description" value={project.description} onChange={(e) => updateProject(index, 'description', e.target.value)} style={{ width: '100%', minHeight: '60px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px', resize: 'vertical' }} />
            <input placeholder="Project Link (optional)" value={project.link || ''} onChange={(e) => updateProject(index, 'link', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }} />
            <button onClick={() => removeProject(index)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px', position: 'relative' }}>
      {onEdit && <button onClick={onEdit} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: 0.8 }}>Edit</button>}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>Projects</h2>
      {projects.map((project) => (
        <div key={project.id} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{project.project_name}</h3>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--cv-color, #2563eb)', margin: '0 0 4px 0' }}>{project.role}</p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Tech: {project.technologies}</p>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '8px' }}>{project.description}</p>
          {project.link && <a href={project.link} target="_blank" style={{ color: 'var(--cv-color, #2563eb)', textDecoration: 'none' }}>🔗 {project.link}</a>}
        </div>
      ))}
    </div>
  );
}

