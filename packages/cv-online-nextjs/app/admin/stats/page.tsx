'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import {
  Users, Crown, TrendingUp, Activity, FileText, LayoutDashboard, Shield
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCvs: number;
  adminCount: number;
  freeUsers: number;
  proUsers: number;
}

export default function AdminStatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth?type=login'); return; }
    if ((session.user as any)?.role !== 'admin') { router.push('/dashboard'); return; }
    fetchStats();
  }, [status, session]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-[#1e3a3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a3a] tracking-tight">Thống kê hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan về tình hình hoạt động của ứng dụng CVision.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng người dùng" value={stats.totalUsers} icon={Users} color="#1e3a3a" />
        <StatCard title="Tổng số CV" value={stats.totalCvs} icon={FileText} color="#0d9488" />
        {/* <StatCard title="Người dùng Pro" value={stats.proUsers} icon={Crown} color="#b45309" /> */}
        <StatCard title="Tỷ lệ chuyển đổi" value={stats.totalUsers > 0 ? ((stats.proUsers / stats.totalUsers) * 100).toFixed(1) + '%' : '0%'} icon={TrendingUp} color="#115e59" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phân bổ người dùng */}
        {/* <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1e3a3a]">Phân bổ gói dịch vụ</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Activity size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="space-y-4">
            <ProgressBar label="Gói Miễn phí (Free)" value={stats.freeUsers} total={stats.totalUsers} color="#64748b" />
            <ProgressBar label="Gói Cao cấp (Pro)" value={stats.proUsers} total={stats.totalUsers} color="#0d9488" />
            <ProgressBar label="Quản trị viên (Admin)" value={stats.adminCount} total={stats.totalUsers} color="#b45309" />
          </div>
        </div> */}

        {/* Mức độ sử dụng */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1e3a3a]">Mức độ sử dụng nền tảng</h3>
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-teal-600" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <FileText size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1e3a3a]">Trung bình CV / User</p>
                  <p className="text-xs text-gray-500">Số lượng CV trung bình mỗi người dùng tạo</p>
                </div>
              </div>
              <p className="text-lg font-bold text-[#1e3a3a]">
                {stats.totalUsers > 0 ? (stats.totalCvs / stats.totalUsers).toFixed(1) : 0}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Shield size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1e3a3a]">Quản trị viên</p>
                  <p className="text-xs text-gray-500">Số lượng tài khoản có quyền quản trị</p>
                </div>
              </div>
              <p className="text-lg font-bold text-[#1e3a3a]">{stats.adminCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: { title: string, value: number | string, icon: any, color: string, trend?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm relative overflow-hidden group hover:border-gray-200 transition-colors">
      <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + '15', color: color }}
        >
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-[#1e3a3a] tracking-tight">{value.toLocaleString()}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
        {trend && (
          <p className="text-xs font-semibold text-teal-600 mt-3 inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded-md">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="font-bold" style={{ color }}>{value} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
