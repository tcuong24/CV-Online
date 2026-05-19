'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { 
  LayoutDashboard, Search, Plus, MoreVertical, 
  Eye, Edit3, Trash2, CheckCircle2, XCircle,
  RefreshCw, Filter, ChevronLeft, ChevronRight,
  Star, TrendingUp, Zap, Image as ImageIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  isPremium: boolean;
  isPublished: boolean;
  usageCount: number;
  layoutType: string;
  createdAt: string;
  tags: string[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TemplateManagementPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [type, setType] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8',
        sortBy,
        sortOrder,
      });

      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);
      if (status !== 'all') params.append('isPublished', (status === 'active').toString());
      if (type !== 'all') params.append('isPremium', (type === 'premium').toString());

      const res = await axiosInstance.get(`/admin/templates?${params.toString()}`);
      setTemplates(res.data.items);
      setMeta(res.data.meta);
    } catch (error) {
      toast.error('Không thể tải danh sách mẫu CV');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, type, sortBy, sortOrder]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axiosInstance.patch(`/admin/templates/${id}/status`, { isPublished: !currentStatus });
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, isPublished: !currentStatus } : t));
      toast.success('Đã cập nhật trạng thái mẫu CV');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mẫu này?')) return;
    try {
      await axiosInstance.delete(`/admin/templates/${id}`);
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Đã xóa mẫu CV');
    } catch (error) {
      toast.error('Lỗi khi xóa mẫu CV');
    }
  };

  const handleAddTemplate = () => {
    router.push('/admin/templates/create');
  };

  const handleEditTemplate = (id: string) => {
    router.push(`/admin/templates/${id}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Quản lý mẫu CV</h2>
          <p className="text-slate-400 text-sm font-medium">Kho giao diện hệ thống ({meta?.total || 0} mẫu)</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchTemplates} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                <RefreshCw size={20} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button onClick={handleAddTemplate} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex gap-2 h-11 px-6 shadow-md transition-all active:scale-95">
                <Plus size={18} /> Thêm mẫu mới
            </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc mô tả mẫu..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm w-full focus:ring-2 focus:ring-[#1D283D] outline-none transition-all"
                  />
              </div>
              <div className="flex items-center gap-2">
                  <select 
                    value={category} 
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 outline-none cursor-pointer"
                  >
                      <option value="all">Tất cả danh mục</option>
                      <option value="Professional">Professional</option>
                      <option value="Modern">Modern</option>
                      <option value="Creative">Creative</option>
                      <option value="Minimalist">Minimalist</option>
                  </select>
                  <select 
                    value={status} 
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 outline-none cursor-pointer"
                  >
                      <option value="all">Trạng thái</option>
                      <option value="active">Đang bật</option>
                      <option value="inactive">Đang tắt</option>
                  </select>
                  <select 
                    value={type} 
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 outline-none cursor-pointer"
                  >
                      <option value="all">Loại</option>
                      <option value="free">Miễn phí</option>
                      <option value="premium">Premium</option>
                  </select>
              </div>
          </div>
          
          <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Sắp xếp:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none"
              >
                  <option value="createdAt">Ngày tạo</option>
                  <option value="usageCount">Lượt dùng</option>
                  <option value="name">Tên</option>
              </select>
              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400"
              >
                  {sortOrder === 'desc' ? <TrendingUp size={16} /> : <Zap size={16} className="rotate-180" />}
              </button>
          </div>
      </div>

      {/* Grid Templates */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-slate-50" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-[#1D283D]/10 transition-all duration-500 flex flex-col">
               {/* Thumbnail Area */}
               <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                   {template.thumbnailUrl ? (
                       <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                       <div className="flex flex-col items-center gap-2 text-slate-300">
                           <ImageIcon size={48} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
                       </div>
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   {/* Badges */}
                   <div className="absolute top-4 left-4 flex flex-col gap-2">
                       {template.isPremium && (
                           <div className="bg-amber-400 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-amber-200">
                               <Star size={10} fill="currentColor" /> Premium
                           </div>
                       )}
                       {!template.isPublished && (
                           <div className="bg-slate-400 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                               Hidden
                           </div>
                       )}
                   </div>

                   {/* Quick Actions Overlay */}
                   <div className="absolute inset-0 bg-[#1D283D]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                        <button onClick={() => handleEditTemplate(template.id)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all shadow-xl">
                            <Edit3 size={20} />
                        </button>
                        <button onClick={() => handleDelete(template.id)} className="w-12 h-12 bg-white/20 hover:bg-red-500 rounded-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-md">
                            <Trash2 size={20} />
                        </button>
                   </div>
               </div>

               {/* Info Area */}
               <div className="p-8 flex-1 flex flex-col">
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{template.category}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(template.createdAt).toLocaleDateString()}</span>
                   </div>
                   <h3 className="font-bold text-slate-900 text-xl mb-2 line-clamp-1 group-hover:text-slate-700 transition-colors">{template.name}</h3>
                   <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">
                       {template.description || 'Không có mô tả cho mẫu CV này.'}
                   </p>
                   
                   <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                               <TrendingUp size={14} />
                           </div>
                           <div>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lượt dùng</p>
                               <p className="font-bold text-slate-800 text-sm">{template.usageCount.toLocaleString()}</p>
                           </div>
                       </div>
                       
                       <button 
                         onClick={() => handleToggleStatus(template.id, template.isPublished)}
                         className={`group/status flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                           template.isPublished 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                         }`}
                       >
                           {template.isPublished ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                           {template.isPublished ? 'Đang bật' : 'Đang tắt'}
                       </button>
                   </div>
               </div>
            </div>
          ))}

          {/* Add New Card */}
          <div 
            onClick={handleAddTemplate}
            className="bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-slate-400 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer min-h-[450px] group"
          >
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                  <Plus size={32} />
              </div>
              <p className="font-black text-sm uppercase tracking-widest">Thêm mẫu mới</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-black text-slate-600">
                <span>Trang</span>
                <span className="text-[#1D283D]">{page}</span>
                <span className="text-slate-300">/</span>
                <span>{meta.totalPages}</span>
            </div>
            <button 
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      )}

    </div>
  );
}
