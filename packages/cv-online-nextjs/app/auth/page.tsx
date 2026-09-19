import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f6f4ee] font-label text-sm text-[#1e3a3a]">Đang tải...</div>}>
      <AuthForm />
    </Suspense>
  );
}
