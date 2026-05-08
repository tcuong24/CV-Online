'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  Users, Shield, BarChart3, RefreshCw, LayoutDashboard, Settings, History
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Guard: only admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth?type=login');
      return;
    }
    if ((session.user as any)?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex text-[#1e3a3a] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10 px-2">

            <span className="font-headline text-2xl font-black tracking-tighter text-foreground">CVision</span>
          </div>

          <nav className="space-y-1">
            <NavItem
              href="/admin"
              icon={<Users size={18} />}
              label="Người dùng"
              active={pathname === '/admin'}
            />
            <NavItem
              href="/admin/templates"
              icon={<LayoutDashboard size={18} />}
              label="Mẫu CV"
              active={pathname === '/admin/templates'}
            />
            <NavItem
              href="/admin/stats"
              icon={<BarChart3 size={18} />}
              label="Thống kê"
              active={pathname === '/admin/stats'}
            />
            <NavItem
              href="/admin/settings"
              icon={<Settings size={18} />}
              label="Cài đặt"
              active={pathname === '/admin/settings'}
            />
            <NavItem
              href="/admin/logs"
              icon={<History size={18} />}
              label="Nhật ký"
              active={pathname === '/admin/logs'}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-sm bg-[#1e3a3a]/10 flex items-center justify-center text-[#1e3a3a] font-bold text-sm">
              {session?.user?.name?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-[#1e3a3a]">{session?.user?.name}</p>
              <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Quản trị viên</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link href="/admin" className={`${pathname === '/admin' ? 'text-[#1e3a3a] border-b-2 border-[#1e3a3a] h-16 flex items-center' : 'hover:text-[#1e3a3a] transition-colors cursor-pointer h-16 flex items-center'}`}>Tổng quan</Link>
            <Link href="/admin/templates" className={`${pathname.startsWith('/admin/templates') ? 'text-[#1e3a3a] border-b-2 border-[#1e3a3a] h-16 flex items-center' : 'hover:text-[#1e3a3a] transition-colors cursor-pointer h-16 flex items-center'}`}>Mẫu CV</Link>
            <Link href="/admin/logs" className="hover:text-[#1e3a3a] transition-colors cursor-pointer h-16 flex items-center">Nhật ký</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-[#1e3a3a] font-semibold transition-colors">Quay lại Dashboard</Link>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, href, active = false }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center gap-3 px-4 py-2.5 rounded-sm cursor-pointer transition-all
        ${active ? 'bg-[#1e3a3a] text-white font-semibold' : 'text-gray-500 hover:text-[#1e3a3a] hover:bg-gray-100'}
      `}>
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
