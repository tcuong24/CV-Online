'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  Users, Shield, BarChart3, RefreshCw, LayoutDashboard, Settings
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
    <div className="min-h-screen bg-[#f8faff] flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 h-screen sticky top-0 shrink-0">
        <div className="flex items-center gap-2 mb-12 px-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <Shield size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-violet-900">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem
            href="/admin"
            icon={<Users size={20} />}
            label="Người dùng"
            active={pathname === '/admin'}
          />
          <NavItem
            href="/admin/templates"
            icon={<LayoutDashboard size={20} />}
            label="Mẫu CV"
            active={pathname === '/admin/templates'}
          />
          <NavItem
            href="/admin/stats"
            icon={<BarChart3 size={20} />}
            label="Thống kê"
            active={pathname === '/admin/stats'}
          />
        </nav>

        <div className="pt-6 border-t border-slate-50 space-y-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
              {session?.user?.name?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{session?.user?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-50">
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="/admin" className={`${pathname === '/admin' ? 'text-violet-600 border-b-2 border-violet-600 pb-7 pt-7' : 'hover:text-violet-600 transition-colors cursor-pointer'}`}>Overview</Link>
            <Link href="/admin/logs" className="hover:text-violet-600 transition-colors cursor-pointer">Logs</Link>
            <Link href="/admin/settings" className="hover:text-violet-600 transition-colors cursor-pointer">Settings</Link>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
                {session?.user?.name?.[0].toUpperCase()}
             </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto w-full">
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
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
        ${active ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
      `}>
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
