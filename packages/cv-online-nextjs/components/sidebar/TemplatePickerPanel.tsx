import axiosInstance from '@/lib/axios';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { TemplateInfo } from '@/types/cv';
import { useState, useEffect } from 'react';

export function TemplatePickerPanel() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const switchTemplate = useCvEditorStore(s => s.switchTemplate);
    const GetTemplate = async ()=>{
        const response = await axiosInstance.get('/templates');
        setTemplates(response.data);
    }
  useEffect(() => { GetTemplate(); }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 12 }}>
      {templates.map(t => (
        <div key={t.id} onClick={() => switchTemplate(t)} style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', border: '2px solid #e2e8f0' }}>
          <img src={t.thumbnailUrl} style={{ width: '100%' }} />
          <div style={{ padding: '6px 8px', fontSize: 11, fontWeight: 600 }}>{t.name}</div>
        </div>
      ))}
    </div>
  );
}
