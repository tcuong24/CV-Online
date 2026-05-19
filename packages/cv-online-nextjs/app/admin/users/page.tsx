'use client';

import { useEffect, useState, Fragment } from 'react';
import axiosInstance from '@/lib/axios';
import {
  Users, Trash2, Search, RefreshCw, Filter, ChevronDown, MoreHorizontal, ShieldAlert, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

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
  cvs?: Array<{
    id: string;
    title: string;
    thumbnailUrl: string | null;
    updatedAt: string;
  }>;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filtered, setFiltered] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedUserCvs, setExpandedUserCvs] = useState<Record<string, boolean>>({});

  const toggleUserCvs = (userId: string) => {
    setExpandedUserCvs((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // States for Add User Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [newPassword, setNewPassword] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // States for Confirm Delete Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);

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
      toast.success('Cập nhật quyền hạn thành công!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newPassword.trim()) {
      toast.error('Vui lòng điền đầy đủ Email và Mật khẩu!');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await axiosInstance.post('/admin/users', {
        email: newEmail,
        password: newPassword,
        fullName: newFullName,
        role: newRole,
      });
      setUsers((prev) => [res.data, ...prev]);
      toast.success('Thêm người dùng mới thành công!');
      setAddModalOpen(false);
      // Reset form states
      setNewEmail('');
      setNewFullName('');
      setNewRole('user');
      setNewPassword('');
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng!');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const userId = userToDelete.id;
    setActionLoading(userId + 'del');
    setDeleteConfirmOpen(false);
    try {
      const res = await axiosInstance.delete(`/admin/users/${userId}`);
      if (res.data?.error) {
        toast.error(res.data.error);
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success(`Đã xóa thành công người dùng ${userToDelete.fullName || userToDelete.email}`);
      }
    } catch (e: any) {
      toast.error('Có lỗi xảy ra khi xóa người dùng!');
    } finally {
      setActionLoading(null);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-[#1D283D] border-t-transparent rounded-full animate-spin mb-4" />
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
          <Button onClick={() => setAddModalOpen(true)} className="rounded-xl bg-[#1D283D] hover:bg-[#1D283D]/90 font-bold px-5 py-2.5 transition-all">
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
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-80 focus:ring-2 focus:ring-[#1D283D] outline-none transition-all"
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
                <th className="text-left pb-5">CV đã tạo</th>
                <th className="text-right pb-5 pr-2">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <Fragment key={user.id}>
                  <tr className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 pl-2">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-[#1D283D]/10 flex items-center justify-center text-[#1D283D] font-black text-lg">
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
                          className="appearance-none bg-transparent font-bold text-xs uppercase tracking-wider outline-none cursor-pointer text-[#1D283D] pr-5"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-0 text-[#1D283D]/50 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-5">
                      {user._count.cvs > 0 ? (
                        <button
                          onClick={() => toggleUserCvs(user.id)}
                          className="flex items-center gap-1 font-bold text-[#1D283D] hover:text-[#1D283D]/80 transition-colors cursor-pointer group/cv"
                        >
                          <ChevronDown 
                            size={14} 
                            className={`text-[#1D283D]/40 group-hover/cv:text-[#1D283D] transition-transform duration-300 ${
                              expandedUserCvs[user.id] ? 'rotate-180' : ''
                            }`} 
                          />
                          <span>{user._count.cvs}</span>
                          <span className="text-slate-400 text-xs font-medium ml-0.5">CV</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 font-bold text-slate-400 select-none">
                          <span>0</span>
                          <span className="text-xs font-medium ml-0.5">CV</span>
                        </div>
                      )}
                    </td>
                    <td className="py-5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 text-slate-300 hover:text-slate-650 rounded-xl transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setDeleteConfirmOpen(true);
                          }}
                          disabled={!!actionLoading}
                          className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedUserCvs[user.id] && user.cvs && user.cvs.length > 0 && (
                    <tr>
                      <td colSpan={4} className="bg-slate-50/40 px-8 py-5 border-y border-slate-100">
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">
                            Danh sách CV của {user.fullName || user.email} ({user.cvs.length})
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {user.cvs.map((cv) => (
                              <div key={cv.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 hover:border-[#1D283D]/30 hover:shadow-sm transition-all group">
                                <div className="w-10 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                                  {cv.thumbnailUrl ? (
                                    <img src={cv.thumbnailUrl} alt={cv.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="text-slate-350 font-bold text-[9px] uppercase tracking-wider">CV</div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                  <p className="font-bold text-slate-800 text-xs truncate group-hover:text-[#1D283D] transition-colors">{cv.title}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">Cập nhật: {new Date(cv.updatedAt).toLocaleDateString()}</p>
                                </div>
                                <button 
                                  onClick={() => window.open(`/preview/${cv.id}`)}
                                  className="text-xs font-black text-[#1D283D] hover:text-[#1D283D]/85 hover:underline shrink-0 pr-1 cursor-pointer"
                                >
                                  Xem
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
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

      {/* Add User Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="!max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              Thêm người dùng mới
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Tạo tài khoản thành viên mới và thiết lập phân quyền trực tiếp trên hệ thống.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Họ và Tên
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D283D] dark:bg-slate-800 dark:text-white transition-all bg-slate-50 dark:bg-slate-800"
                placeholder="Ví dụ: Trần Văn Cường"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Địa chỉ Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D283D] dark:bg-slate-800 dark:text-white transition-all bg-slate-50 dark:bg-slate-800"
                placeholder="cuongtran@gmail.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D283D] dark:bg-slate-800 dark:text-white transition-all bg-slate-50 dark:bg-slate-800"
                placeholder="Tối thiểu 6 ký tự..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Vai trò phân quyền
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D283D] dark:bg-slate-800 dark:text-white transition-all bg-slate-50 dark:bg-slate-800"
              >
                <option value="user">Người dùng thông thường (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAddModalOpen(false)}
                className="flex-1 py-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold transition-all cursor-pointer bg-white"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={createLoading}
                className="flex-1 py-5 rounded-xl bg-[#1D283D] hover:bg-[#1D283D]/90 text-white font-bold transition-all cursor-pointer shadow-md shadow-[#1D283D]/10"
              >
                {createLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Premium Confirm Delete Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="!max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 text-center">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30">
            <ShieldAlert size={28} />
          </div>
          
          <DialogHeader className="space-y-2 mb-6">
            <DialogTitle className="text-xl font-black text-slate-800 dark:text-white text-center">
              Xác nhận xóa tài khoản?
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-center">
              Bạn có chắc chắn muốn xóa tài khoản <span className="font-extrabold text-slate-800 dark:text-slate-200">{userToDelete?.fullName || userToDelete?.email}</span>? 
              Tất cả các CV và dữ liệu liên quan sẽ bị xóa vĩnh viễn và không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setUserToDelete(null);
              }}
              className="flex-1 py-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold transition-all cursor-pointer bg-white"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-5 rounded-xl bg-red-650 hover:bg-red-750 text-red-500 font-bold transition-all cursor-pointer shadow-md shadow-red-600/10"
            >
              Đồng ý xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
