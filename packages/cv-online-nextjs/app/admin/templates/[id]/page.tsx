'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, Type, Palette, Layout, List, 
  Database, Settings, Save, Eye, RotateCcw
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { CVTemplate } from '@/components/template/CVTemplate';
import { DEFAULT_DATA, DEFAULT_ORDER, DEFAULT_STYLE } from '@/constants/cvEditor';
import { LayoutType } from '@/types/cvEditor';
import { parseDesignConfig, parseSectionsConfig, parseSectionLayouts } from '@/lib/mappers/templateMapper';

export default function TemplateEditor() {
  const params = useParams();
  const router = useRouter();
  const isCreate = params.id === 'create';
  
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: 'Professional',
    thumbnailUrl: '',
    isPremium: false,
    layoutType: 'SidebarRight',
    designConfig: {
      colors: { primary: '#2563eb', text: '#111111', background: '#ffffff' },
      typography: { fontFamily: 'Inter', headingSize: 24, bodySize: 14 }
    },
    sectionsConfig: {
      order: ['personal', 'experience', 'education', 'skills'],
      sidebar_sections: ['personal', 'skills'],
      hidden: [] as string[]
    }
  });

  useEffect(() => {
    if (!isCreate) {
      axiosInstance.get(`/admin/templates/${params.id}`)
        .then(res => {
          setTemplate(res.data);
          setLoading(false);
        })
        .catch(err => {
          toast.error('Lỗi khi tải template');
          setLoading(false);
        });
    }
  }, [isCreate, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreate) {
        await axiosInstance.post('/admin/templates', template);
        toast.success('Tạo template thành công');
        router.push('/admin/templates');
      } else {
        await axiosInstance.put(`/admin/templates/${params.id}`, template);
        toast.success('Lưu thành công');
      }
    } catch (err) {
      toast.error('Lỗi khi lưu template');
    } finally {
      setSaving(false);
    }
  };

  const updateDesignConfig = (path: string, value: any) => {
    const keys = path.split('.');
    setTemplate(prev => {
      const next = { ...prev };
      let current: any = next.designConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateSectionsConfig = (path: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      sectionsConfig: {
        ...prev.sectionsConfig,
        [path]: value
      }
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: <Settings size={16} /> },
    { id: 'typography', label: 'Kiểu chữ', icon: <Type size={16} /> },
    { id: 'colors', label: 'Màu sắc', icon: <Palette size={16} /> },
    { id: 'layout', label: 'Cấu hình Layout', icon: <Layout size={16} /> },
    { id: 'sections', label: 'Cấu trúc Mục', icon: <List size={16} /> },
    { id: 'sample', label: 'Dữ liệu mẫu', icon: <Database size={16} /> },
  ];

  const parsedStyle = parseDesignConfig(template.designConfig);
  const { order, sideKeys } = parseSectionsConfig(template.sectionsConfig);
  const parsedSectionLayout = parseSectionLayouts(template.sectionsConfig);

  if (loading) return <div className="p-10 text-center text-slate-500">Đang tải cấu hình mẫu CV...</div>;

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-[#FAFAFA] font-sans -mx-4 -mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Topbar */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/templates')} className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="font-serif text-lg font-medium text-slate-800">
            {isCreate ? 'Tạo mẫu CV mới' : `Đang sửa: ${template.name}`}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <Eye size={16} /> Xem trước
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Navigation */}
        <div className="w-56 bg-[#FDFCF6] border-r border-slate-200 flex flex-col py-4 shrink-0 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thiết lập mẫu</div>
          <div className="flex flex-col px-2 gap-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white font-medium shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Middle Area - Editor Form */}
        <div className="flex-1 bg-white border-r border-slate-200 overflow-y-auto flex flex-col relative shadow-[inset_-10px_0_20px_-20px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto w-full px-8 py-10">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-8 pb-4 border-b border-slate-100">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Tên mẫu CV</label>
                  <input 
                    value={template.name}
                    onChange={e => setTemplate({...template, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                    placeholder="VD: Kế toán Minimalist"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Mô tả ngắn</label>
                  <textarea 
                    value={template.description}
                    onChange={e => setTemplate({...template, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all resize-none"
                    placeholder="Mô tả phong cách và đối tượng của mẫu CV..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Danh mục</label>
                    <select 
                      value={template.category}
                      onChange={e => setTemplate({...template, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm cursor-pointer"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Modern">Modern</option>
                      <option value="Creative">Creative</option>
                      <option value="Minimalist">Minimalist</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Layout Engine</label>
                    <select 
                      value={template.layoutType}
                      onChange={e => setTemplate({...template, layoutType: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm cursor-pointer"
                    >
                      <option value="SidebarRight">SidebarRight</option>
                      <option value="TwoColumn">TwoColumn</option>
                      <option value="SingleColumn">SingleColumn</option>
                      <option value="TechTimeline">TechTimeline</option>
                      <option value="ExecutiveCentered">ExecutiveCentered</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Thumbnail URL</label>
                  <input 
                    value={template.thumbnailUrl}
                    onChange={e => setTemplate({...template, thumbnailUrl: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Phông chữ</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500">Phông chữ chính (Font Family)</label>
                      <select 
                        value={(template.designConfig as any)?.typography?.fontFamily || 'Inter'}
                        onChange={e => updateDesignConfig('typography.fontFamily', e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm cursor-pointer"
                      >
                        <option value="Inter">Inter (Sans Serif)</option>
                        <option value="Lora">Lora (Serif)</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Merriweather">Merriweather</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">Cỡ chữ (px)</label>
                        <input 
                          type="number"
                          value={(template.designConfig as any)?.typography?.bodySize || 14}
                          onChange={e => updateDesignConfig('typography.bodySize', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">Tiêu đề (px)</label>
                        <input 
                          type="number"
                          value={(template.designConfig as any)?.typography?.headingSize || 24}
                          onChange={e => updateDesignConfig('typography.headingSize', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-md border border-amber-200 flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <p>Các cài đặt này sẽ được áp dụng cho toàn bộ nội dung của mẫu CV.</p>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Màu chủ đạo (Primary)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color"
                        value={(template.designConfig as any)?.colors?.primary || '#2563eb'}
                        onChange={e => updateDesignConfig('colors.primary', e.target.value)}
                        className="w-12 h-12 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-sm"
                      />
                      <input 
                        type="text"
                        value={(template.designConfig as any)?.colors?.primary || '#2563eb'}
                        onChange={e => updateDesignConfig('colors.primary', e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#FAFAFA] border border-slate-200 rounded-md text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Màu nền (Background)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color"
                        value={(template.designConfig as any)?.colors?.background || '#ffffff'}
                        onChange={e => updateDesignConfig('colors.background', e.target.value)}
                        className="w-12 h-12 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-sm"
                      />
                      <input 
                        type="text"
                        value={(template.designConfig as any)?.colors?.background || '#ffffff'}
                        onChange={e => updateDesignConfig('colors.background', e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#FAFAFA] border border-slate-200 rounded-md text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Quản lý các mục</label>
                  <div className="space-y-2">
                    {template.sectionsConfig?.order?.map((section: string, index: number) => {
                      const isSidebar = template.sectionsConfig?.sidebar_sections?.includes(section);
                      return (
                        <div 
                          key={section}
                          className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-slate-200 rounded-xl group hover:border-slate-400 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1">
                               <button 
                                 onClick={() => {
                                   const newOrder = [...template.sectionsConfig.order];
                                   if (index > 0) {
                                     [newOrder[index], newOrder[index-1]] = [newOrder[index-1], newOrder[index]];
                                     updateSectionsConfig('order', newOrder);
                                   }
                                 }}
                                 className="text-[10px] text-slate-400 hover:text-slate-900"
                               >▲</button>
                               <button 
                                 onClick={() => {
                                   const newOrder = [...template.sectionsConfig.order];
                                   if (index < newOrder.length - 1) {
                                     [newOrder[index], newOrder[index+1]] = [newOrder[index+1], newOrder[index]];
                                     updateSectionsConfig('order', newOrder);
                                   }
                                 }}
                                 className="text-[10px] text-slate-400 hover:text-slate-900"
                               >▼</button>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 capitalize">{section}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-tight">Thứ tự: {index + 1}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => {
                                let newSidebar = [...(template.sectionsConfig.sidebar_sections || [])];
                                if (isSidebar) {
                                  newSidebar = newSidebar.filter(s => s !== section);
                                } else {
                                  newSidebar.push(section);
                                }
                                updateSectionsConfig('sidebar_sections', newSidebar);
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                                isSidebar 
                                  ? 'bg-slate-900 text-white border-slate-900' 
                                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {isSidebar ? 'SIDEBAR' : 'MAIN CONTENT'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Sample Data Tab */}
            {activeTab === 'sample' && (
              <div className="space-y-6 flex flex-col h-[600px]">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Dữ liệu mẫu hiển thị (JSON)</label>
                  <span className="text-[10px] text-slate-400 italic">Dữ liệu này dùng để render bản xem trước bên phải</span>
                </div>
                <textarea 
                  className="w-full flex-1 bg-slate-900 text-emerald-400 p-5 font-mono text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none shadow-inner"
                  defaultValue={JSON.stringify(DEFAULT_DATA, null, 2)}
                  readOnly
                />
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Lưu ý:</strong> Hiện tại trình biên tập đang sử dụng bộ dữ liệu chuẩn hệ thống. Bạn có thể ghi đè bộ dữ liệu này cho từng template trong phiên bản tiếp theo.
                  </p>
                </div>
              </div>
            )}

            {/* Layout Tab - Advanced */}
            {activeTab === 'layout' && (
              <div className="space-y-4 flex flex-col h-[500px]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Cấu hình nâng cao Layout</span>
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
                    <RotateCcw size={12} /> Format JSON
                  </button>
                </div>
                <textarea 
                  className="w-full flex-1 bg-slate-900 text-emerald-400 p-5 font-mono text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none shadow-inner"
                  defaultValue={JSON.stringify(template.designConfig, null, 2)}
                  onChange={e => {
                     // Note: Handle JSON string parsing robustly later
                  }}
                />
              </div>
            )}
            
          </div>
        </div>

        {/* Right Area - Live Preview Mock */}
        <div className="w-[450px] bg-[#EBECEE] flex flex-col shrink-0">
          <div className="h-10 border-b border-slate-300 bg-[#F5F5F5] flex items-center px-4 justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trình giả lập CV (Live)</span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-[#EBECEE]">
            {/* Wrapper div matches the scaled size (794px * 0.48 = 381px, 1123px * 0.48 = 539px) */}
            <div style={{ width: '381px', height: '539px' }} className="mt-4">
              <div className="w-[794px] min-h-[1123px] bg-white shadow-xl origin-top-left rounded-sm overflow-hidden" style={{ transform: 'scale(0.48)' }}>
                 {/* Real CV Preview */}
                 <div className="pointer-events-none select-none">
                    <CVTemplate 
                      data={DEFAULT_DATA as any}
                      order={order.length ? order : DEFAULT_ORDER}
                      style={parsedStyle}
                      layoutType={template.layoutType as LayoutType}
                      sideKeys={sideKeys.length ? sideKeys : ['personal', 'skills']}
                      sectionLayout={parsedSectionLayout}
                      zoom={100}
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
