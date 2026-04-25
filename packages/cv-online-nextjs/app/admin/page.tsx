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
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Tổng user', value: stats.totalUsers, icon: Users, color: '#818cf8' },
        { label: 'Tổng CV', value: stats.totalCvs, icon: BarChart3, color: '#34d399' },
        { label: 'Admin', value: stats.adminCount, icon: Shield, color: '#f59e0b' },
        { label: 'Pro users', value: stats.proUsers, icon: Crown, color: '#a78bfa' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#16161d] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Shield size={16} />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-white">Admin Panel</h1>
            <p className="text-[11px] text-slate-500">Quản lý hệ thống CV Online</p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-[12px] text-slate-400 hover:bg-white/10 transition-all"
        >
          <RefreshCw size={13} /> Làm mới
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/5 bg-[#16161d] p-5 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: card.color + '20' }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-[24px] font-bold text-white">{card.value}</p>
                <p className="text-[11px] text-slate-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User table */}
        <div className="rounded-2xl border border-white/5 bg-[#16161d] overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-[14px] font-bold text-white">Danh sách người dùng</h2>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 w-64">
              <Search size={14} className="text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Tìm email, tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[13px] text-white placeholder-slate-600 outline-none w-full"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[11px] uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">Người dùng</th>
                  <th className="text-left px-6 py-3 font-medium">Role</th>
                  <th className="text-left px-6 py-3 font-medium">Gói</th>
                  <th className="text-left px-6 py-3 font-medium">CV</th>
                  <th className="text-left px-6 py-3 font-medium">Ngày tạo</th>
                  <th className="text-left px-6 py-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-[12px] font-bold text-violet-300 shrink-0">
                          {(user.fullName ?? user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.fullName ?? '—'}</p>
                          <p className="text-slate-500 text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={actionLoading === user.id + 'role'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                        className="rounded-lg border px-2 py-1 text-[12px] font-medium bg-transparent cursor-pointer outline-none transition-all"
                        style={
                          user.role === 'admin'
                            ? { borderColor: '#f59e0b55', color: '#f59e0b', background: '#f59e0b10' }
                            : { borderColor: '#ffffff15', color: '#94a3b8', background: 'transparent' }
                        }
                      >
                        <option value="user" className="bg-[#16161d] text-white">user</option>
                        <option value="admin" className="bg-[#16161d] text-white">admin</option>
                      </select>
                    </td>

                    {/* Subscription */}
                    <td className="px-6 py-4">
                      <select
                        value={user.subscriptionType}
                        disabled={actionLoading === user.id + 'sub'}
                        onChange={(e) => handleSubChange(user.id, e.target.value)}
                        className="rounded-lg border px-2 py-1 text-[12px] font-medium bg-transparent cursor-pointer outline-none"
                        style={
                          user.subscriptionType !== 'free'
                            ? { borderColor: '#a78bfa55', color: '#a78bfa', background: '#a78bfa10' }
                            : { borderColor: '#ffffff15', color: '#64748b', background: 'transparent' }
                        }
                      >
                        <option value="free" className="bg-[#16161d] text-white">free</option>
                        <option value="pro" className="bg-[#16161d] text-white">pro</option>
                        <option value="enterprise" className="bg-[#16161d] text-white">enterprise</option>
                      </select>
                    </td>

                    {/* CV count */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
                        {user._count.cvs} CV
                      </span>
                    </td>

                    {/* Created at */}
                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40"
                      >
                        <Trash2 size={11} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-16 text-slate-500">
                <AlertTriangle size={24} className="text-slate-600" />
                <p className="text-sm">Không tìm thấy user nào</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/5 text-[11px] text-slate-600">
            Hiển thị {filtered.length} / {users.length} người dùng
          </div>
        </div>
      </div>
    </div>
  );
}
