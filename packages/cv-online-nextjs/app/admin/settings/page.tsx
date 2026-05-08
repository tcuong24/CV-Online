'use client';

import { useSession } from 'next-auth/react';
import {
  Settings as SettingsIcon, Save, Globe, ShieldCheck, Mail, Database, Server
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!session || (session.user as any)?.role !== 'admin') {
    return null;
  }

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Đã lưu cấu hình thành công!');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a3a] tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình các tham số hoạt động cốt lõi của nền tảng.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-[#0f766e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-70"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Cấu hình chung */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Globe size={18} className="text-gray-500" />
            <h2 className="text-sm font-bold text-[#1e3a3a]">Cấu hình chung</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#1e3a3a]">Tên ứng dụng</label>
                <input type="text" defaultValue="CVision" className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#1e3a3a]">Ngôn ngữ mặc định</label>
                <select className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#1e3a3a]">Mô tả SEO</label>
              <textarea defaultValue="CVision - Nền tảng tạo CV trực tuyến chuyên nghiệp tích hợp AI." className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 min-h-[80px]" />
            </div>
          </div>
        </div>

        {/* Cấu hình Hệ thống & Email */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Server size={18} className="text-gray-500" />
            <h2 className="text-sm font-bold text-[#1e3a3a]">Hệ thống & Tích hợp</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-[14px] font-bold text-[#1e3a3a]">Chế độ bảo trì</p>
                <p className="text-[12px] text-gray-500 mt-1">Chặn quyền truy cập của người dùng thường trong lúc nâng cấp.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex gap-3">
                <div className="mt-1"><ShieldCheck size={18} className="text-teal-600" /></div>
                <div>
                  <p className="text-[14px] font-bold text-[#1e3a3a]">Xác thực 2 lớp (MFA) cho Admin</p>
                  <p className="text-[12px] text-gray-500 mt-1">Bắt buộc tất cả Admin phải xác minh OTP qua Gmail khi đăng nhập.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="mt-1"><Mail size={18} className="text-teal-600" /></div>
                <div>
                  <p className="text-[14px] font-bold text-[#1e3a3a]">Gửi email thông báo tự động</p>
                  <p className="text-[12px] text-gray-500 mt-1">Gửi thông báo khi người dùng đăng ký mới hoặc nâng cấp Pro.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
