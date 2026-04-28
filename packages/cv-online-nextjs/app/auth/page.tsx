import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#e8eef8]">Đang tải...</div>}>
      <AuthForm />
    </Suspense>
  );
}
