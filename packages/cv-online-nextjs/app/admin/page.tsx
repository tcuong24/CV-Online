'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import {
  Users, Shield, BarChart3, Trash2, Crown,
  RefreshCw, Search, ChevronDown, AlertTriangle,
} from 'lucide-react';

interface UserRow {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  subscriptionType: string;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { cvs: number };
}

interface Stats {
  totalUsers: number;
  totalCvs: number;
  adminCount: number;
  freeUsers: number;
  proUsers: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filtered, setFiltered] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Guard: only admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/login'); return; }
    if ((session.user as any)?.role !== 'admin') { router.push('/dashboard'); return; }
    fetchAll();
  }, [status, session]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setFiltered(usersRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.fullName ?? '').toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  const handleRoleChange = async (userId: string, role: 'user' | 'admin') => {
    setActionLoading(userId + 'role');
    try {
      await axiosInstance.patch(`/admin/users/${userId}`, { role });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubChange = async (userId: string, subscriptionType: string) => {
    setActionLoading(userId + 'sub');
    try {
      await axiosInstance.patch(`/admin/users/${userId}`, { subscriptionType });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, subscriptionType } : u)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa user này? Tất cả CV của họ sẽ bị mất.')) return;
    setActionLoading(userId + 'del');
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } finally {
      setActionLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-[#1e3a3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Tổng người dùng', value: stats.totalUsers, icon: Users, color: '#1e3a3a' },
        { label: 'Tổng số CV', value: stats.totalCvs, icon: BarChart3, color: '#0d9488' },
        { label: 'Quản trị viên', value: stats.adminCount, icon: Shield, color: '#115e59' },
        { label: 'Người dùng Pro', value: stats.proUsers, icon: Crown, color: '#0f766e' },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
               <div
                className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: card.color + '15' }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <button onClick={fetchAll} className="text-gray-300 hover:text-gray-600 transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a3a]">{card.value.toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-[#1e3a3a]">Danh sách người dùng</h2>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Quản lý và phân quyền thành viên hệ thống</p>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 w-72 focus-within:border-gray-400 transition-all">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm theo email hoặc tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#1e3a3a] placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="text-left px-6 py-4 font-bold">Người dùng</th>
                <th className="text-left px-6 py-4 font-bold">Quyền hạn</th>
                <th className="text-left px-6 py-4 font-bold">Gói dịch vụ</th>
                <th className="text-left px-6 py-4 font-bold text-center">Số CV</th>
                <th className="text-left px-6 py-4 font-bold">Ngày đăng ký</th>
                <th className="text-right px-6 py-4 font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-sm bg-[#1e3a3a]/10 flex items-center justify-center text-[12px] font-bold text-[#1e3a3a] shrink-0 border border-[#1e3a3a]/10">
                        {(user.fullName ?? user.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1e3a3a] truncate">{user.fullName ?? 'Chưa cập nhật'}</p>
                        <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      disabled={actionLoading === user.id + 'role'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      className="rounded-sm border border-gray-200 px-2.5 py-1.5 text-[11px] font-bold bg-white cursor-pointer outline-none hover:border-gray-300 transition-all shadow-sm"
                      style={
                        user.role === 'admin'
                          ? { color: '#b45309', background: '#fef3c7' }
                          : { color: '#1e3a3a' }
                      }
                    >
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>

                  {/* Subscription */}
                  <td className="px-6 py-4">
                    <select
                      value={user.subscriptionType}
                      disabled={actionLoading === user.id + 'sub'}
                      onChange={(e) => handleSubChange(user.id, e.target.value)}
                      className="rounded-sm border border-gray-200 px-2.5 py-1.5 text-[11px] font-bold bg-white cursor-pointer outline-none hover:border-gray-300 transition-all shadow-sm"
                      style={
                        user.subscriptionType !== 'free'
                          ? { color: '#0f766e', background: '#ccfbf1' }
                          : { color: '#64748b' }
                      }
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO</option>
                      <option value="enterprise">ENTERPRISE</option>
                    </select>
                  </td>

                  {/* CV count */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-sm bg-gray-100 text-[11px] font-bold text-gray-500">
                      {user._count.cvs}
                    </span>
                  </td>

                  {/* Created at */}
                  <td className="px-6 py-4 text-gray-400 text-[11px] font-medium">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={!!actionLoading}
                      className="inline-flex items-center gap-1.5 rounded-sm bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100 transition-all disabled:opacity-40 border border-red-100"
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-gray-400 bg-gray-50/30">
              <div className="w-12 h-12 rounded-sm bg-gray-100 flex items-center justify-center text-gray-300">
                 <Users size={24} />
              </div>
              <p className="text-sm font-medium">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <span>Hiển thị {filtered.length} trong tổng số {users.length} người dùng</span>
          <div className="flex gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
             <span>Hệ thống đang hoạt động ổn định</span>
          </div>
        </div>
      </div>
    </div>
  );
}
