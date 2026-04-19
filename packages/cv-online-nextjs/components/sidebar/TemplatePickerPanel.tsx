import axiosInstance from '@/lib/axios';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { TemplateInfo } from '@/types/cv';
import { useState, useEffect } from 'react';

export function TemplatePickerPanel() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const switchTemplate = useCvEditorStore(s => s.switchTemplate);

  const GetTemplate = async () => {
    try {
      const response = await axiosInstance.get('/templates');
      setTemplates(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { 
    GetTemplate(); 
  }, []);

  // Trích xuất tất cả các tag từ danh sách template có sẵn
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags || [])));

  // Lọc template theo tag được chọn
  const filteredTemplates = selectedTag 
    ? templates.filter(t => t.tags?.includes(selectedTag))
    : templates;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Tags Filter - Thanh trượt ngang */}
      {allTags.length > 0 && (
        <div 
          className="w-full overflow-x-auto border-b border-gray-100 bg-white"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
          <div className="flex gap-2 p-3 w-max">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shadow-sm ${
                selectedTag === null
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shadow-sm capitalize ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách Template */}
      <div className="grid grid-cols-2 gap-3 p-3 overflow-y-auto pb-8">
        {filteredTemplates.map(t => (
          <div 
            key={t.id} 
            onClick={() => switchTemplate(t)} 
            className="group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col bg-white"
          >
            {/* Ảnh minh hoạ */}
            <div className="relative aspect-[1/1.4] w-full overflow-hidden bg-gray-100">
              <img 
                src={t.thumbnailUrl} 
                alt={t.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
              />
              
              {/* Tags nổi trên ảnh */}
              {t.tags && t.tags.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-col gap-1 pr-2">
                  {t.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-medium rounded backdrop-blur-md shadow-sm capitalize w-max max-w-[90px] truncate">
                        {tag}
                     </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tên mẫu CV */}
            <div className="p-2 text-[11px] font-semibold text-gray-800 border-t border-gray-100 truncate text-center">
              {t.name}
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-2 text-center py-10 text-xs text-gray-500">
            Không tìm thấy mẫu CV nào.
          </div>
        )}
      </div>
    </div>
  );
}
