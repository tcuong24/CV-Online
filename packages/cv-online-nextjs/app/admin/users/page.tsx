'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import {
  Users, Trash2, Search, RefreshCw, Filter, ChevronDown, MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";

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

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filtered, setFiltered] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
      setFiltered(res.data);
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
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;
    setActionLoading(userId + 'del');
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Quản lý người dùng</h2>
          <p className="text-slate-400 text-sm font-medium">Theo dõi và quản lý quyền hạn của tất cả thành viên</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchUsers} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100 bg-white shadow-sm">
                <RefreshCw size={20} className="text-slate-500" />
            </button>
            <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">
                Thêm người dùng
            </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm email, tên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-80 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
                  <Filter size={14} /> Lọc
              </button>
          </div>
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Tổng số: {filtered.length} người dùng
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 font-bold border-b border-slate-50 uppercase text-[11px] tracking-wider">
                <th className="text-left pb-5 pl-2">Người dùng</th>
                <th className="text-left pb-5">Quyền hạn</th>
                <th className="text-left pb-5">Gói dịch vụ</th>
                <th className="text-left pb-5">CV đã tạo</th>
                <th className="text-right pb-5 pr-2">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 pl-2">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-black text-lg">
                        {(user.fullName ?? user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[15px]">{user.fullName ?? '—'}</p>
                        <p className="text-[12px] text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-1 group/select relative">
                        <select
                          value={user.role}
                          disabled={actionLoading === user.id + 'role'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                          className="appearance-none bg-transparent font-bold text-xs uppercase tracking-wider outline-none cursor-pointer text-violet-600 pr-5"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-0 text-violet-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-5">
                     <select
                        value={user.subscriptionType}
                        disabled={actionLoading === user.id + 'sub'}
                        onChange={(e) => handleSubChange(user.id, e.target.value)}
                        className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-violet-100 transition-colors"
                     >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                     </select>
                  </td>
                  <td className="py-5">
                      <span className="font-bold text-slate-700">{user._count.cvs}</span>
                      <span className="text-slate-400 text-xs ml-1 font-medium">CV</span>
                  </td>
                  <td className="py-5 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 text-slate-300 hover:text-slate-600 rounded-xl transition-all">
                            <MoreHorizontal size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={!!actionLoading}
                          className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Không tìm thấy người dùng nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
