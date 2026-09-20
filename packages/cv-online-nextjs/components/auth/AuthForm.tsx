'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  email:          string;
  password:       string;
  repeatPassword: string;
  fullName:       string;
  acceptTerms:    boolean;
}

interface FormErrors {
  email?:          string;
  password?:       string;
  repeatPassword?: string;
  fullName?:       string;
  acceptTerms?:    string;
  general?:        string; // lỗi từ server hiển thị trên form
}


// ── Icons ─────────────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ── Shared input styles ───────────────────────────────────────────────────────
const inputBase =
  'w-full border border-black/15 bg-[#faf9f6] px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-150 placeholder:text-gray-400 focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] rounded-lg';

const inputError =
  'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]';

// ── Main Component ────────────────────────────────────────────────────────────
export function AuthForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<FormState>({
    email:          '',
    password:       '',
    repeatPassword: '',
    fullName:       '',
    acceptTerms:    false,
  });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const loginReason = searchParams.get('reason');
  const [showLoginRequired, setShowLoginRequired] = useState(
    () => loginReason === 'auth-required' || loginReason === 'create-cv',
  );

  // ── Patch field + clear its error ──────────────────────────────────────────
  const patch = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
    setErrors(er => ({ ...er, [key]: undefined, general: undefined }));
  };

  // ── Switch tab ─────────────────────────────────────────────────────────────
  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setErrors({});
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email không hợp lệ';
    if (form.password.length < 6)
      e.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (mode === 'register') {
      if (!form.fullName.trim())
        e.fullName = 'Vui lòng nhập họ tên';
      if (form.repeatPassword !== form.password)
        e.repeatPassword = 'Mật khẩu không khớp';
      if (!form.acceptTerms)
        e.acceptTerms = 'Vui lòng đồng ý điều khoản';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Login via NextAuth credentials ────────────────────────────────────────
  const handleLogin = async () => {
    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false, 
    });

    if (result?.error) {
      // NextAuth trả về lỗi chung — không tiết lộ email/password sai riêng lẻ
      setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      return;
    }
    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
    router.push(callbackUrl);
    router.refresh(); // cập nhật server components (layout, header...)
  };

  // ── Register → auto login ─────────────────────────────────────────────────
  const handleRegister = async () => {
    // 1. Gọi API tạo tài khoản
    const res = await fetch('/api/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        email:    form.email,
        password: form.password,
        fullName: form.fullName.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrors({ general: data.error ?? 'Đăng ký thất bại, vui lòng thử lại' });
      return;
    }

    // 2. Tự đăng nhập ngay sau khi tạo tài khoản thành công
    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      // Không nên xảy ra — fallback về login tab
      setErrors({ general: 'Tài khoản đã tạo. Vui lòng đăng nhập.' });
      setMode('login');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch {
      setErrors({ general: 'Đã xảy ra lỗi, vui lòng thử lại' });
    } finally {
      setLoading(false); // luôn tắt loading dù thành công hay thất bại
    }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogle = () => {
    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
    signIn('google', { callbackUrl });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <AlertDialog open={showLoginRequired} onOpenChange={setShowLoginRequired}>
        <AlertDialogContent className="max-w-sm rounded-2xl border-black/10">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-black">
              <AlertCircle size={24} />
            </div>
            <AlertDialogTitle className="text-center font-headline text-xl font-bold">
              Bạn cần đăng nhập
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              {loginReason === 'create-cv'
                ? 'Vui lòng đăng nhập trước để tạo và lưu CV của bạn.'
                : 'Vui lòng đăng nhập trước để truy cập trang Dashboard.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              autoFocus
              className="bg-black hover:bg-neutral-800 text-white font-label text-xs uppercase tracking-widest px-8 rounded-lg"
            >
              Đã hiểu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen grid grid-cols-1 bg-[#faf9f6] text-[#171b1a] antialiased lg:grid-cols-2 xl:grid-cols-[1.1fr_1fr] 2xl:grid-cols-[1.15fr_0.85fr]">

      {/* ── Left panel (Đen sang trọng, co giãn theo màn to) ────────────────── */}
      <div className="relative hidden overflow-hidden border-r border-black/10 bg-[#09090b] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between lg:px-16 xl:px-24 2xl:px-32 lg:py-16 2xl:py-24">
        <Link href="/" className="font-headline text-3xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">CVision</Link>
        <div className="relative z-10 max-w-xl xl:max-w-2xl 2xl:max-w-3xl py-12">
          <p className="mb-6 font-label text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">Hồ sơ nghề nghiệp của bạn</p>
          <h1 className="font-headline text-5xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl 2xl:text-7xl">
            Làm CV đẹp, nhanh và rõ ràng.
          </h1>
          <p className="mt-8 max-w-lg xl:max-w-xl text-[15px] xl:text-[17px] leading-relaxed text-white/70">
            Chọn một mẫu phù hợp, bỏ qua các bước căn chỉnh phức tạp, tạo một bản CV nhanh gọn chỉ trong vài phút.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 border-t border-white/15 pt-8 text-xs xl:text-sm text-white/50 font-medium">
          <span>Thiết kế chuyên nghiệp</span><span>Dễ dàng chỉnh sửa</span><span>Tích hợp gợi ý</span>
        </div>
      </div>

      {/* ── Right panel — Card (Trắng tinh tế, cân đối trên màn lớn) ────────── */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full max-w-[460px] lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[560px] border border-black/10 bg-white px-7 py-9 shadow-[0_25px_70px_rgba(0,0,0,0.06)] sm:px-10 sm:py-11 xl:px-12 xl:py-12 rounded-2xl transition-all">
          <Link href="/" className="mb-8 block font-headline text-2xl font-black tracking-tighter lg:hidden">CVision</Link>
          <p className="mb-2 font-label text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Chào mừng đến CVision</p>
          <h2 className="mb-7 font-headline text-3xl xl:text-4xl font-black tracking-tight text-gray-900">
            {mode === 'login' ? 'Tiếp tục hành trình của bạn' : 'Bắt đầu hồ sơ của bạn'}
          </h2>

          {/* Tabs */}
          <div className="mb-7 flex gap-2 border-b border-black/10">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={clsx(
                  'flex-1 border-0 border-b-2 bg-transparent py-3 text-sm font-bold transition-all duration-200 cursor-pointer',
                  mode === m
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-black'
                )}
              >
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>

          {/* General error banner — lỗi từ server */}
          {errors.general && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full name — register only */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5" htmlFor="fullName">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={patch('fullName')}
                  className={clsx(inputBase, errors.fullName && inputError)}
                  autoComplete="name"
                />
                {errors.fullName && <p className="mt-1 text-[11.5px] text-red-500">{errors.fullName}</p>}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5" htmlFor="auth-email">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={patch('email')}
                className={clsx(inputBase, errors.email && inputError)}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-[11.5px] text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5" htmlFor="auth-password">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder=""
                  value={form.password}
                  onChange={patch('password')}
                  className={clsx(inputBase, 'pr-10', errors.password && inputError)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label="Hiện/ẩn mật khẩu"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer bg-transparent border-0 p-0.5 flex items-center"
                >
                  {showPw ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                </button>
              </div>
              {errors.password
                ? <p className="mt-1 text-[11.5px] text-red-500">{errors.password}</p>
                : mode === 'register' && (
                  <p className="mt-1 text-[11.5px] text-gray-400">Dùng 6 ký tự trở lên với chữ, số và ký hiệu.</p>
                )
              }
            </div>

            {/* Forgot password — login only */}
            {mode === 'login' && (
              <div className="flex justify-end -mt-2 mb-4">
                <Link href="/forgot-password" className="text-xs text-black font-semibold hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            {/* Repeat password — register only */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5" htmlFor="repeat-password">
                  Nhập lại mật khẩu
                </label>
                <input
                  id="repeat-password"
                  type="password"
                  placeholder=""
                  value={form.repeatPassword}
                  onChange={patch('repeatPassword')}
                  className={clsx(inputBase, errors.repeatPassword && inputError)}
                  autoComplete="new-password"
                />
                {errors.repeatPassword && (
                  <p className="mt-1 text-[11.5px] text-red-500">{errors.repeatPassword}</p>
                )}
              </div>
            )}

            {/* Terms — register only */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={patch('acceptTerms')}
                    className="h-3.5 w-3.5 flex-shrink-0 cursor-pointer accent-black"
                  />
                  <span className="text-[12.5px] text-gray-500">
                    Tôi đồng ý với{' '}
                    <a href="/terms" className="font-medium text-black hover:underline">
                      Điều khoản sử dụng
                    </a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-[11.5px] text-red-500">{errors.acceptTerms}</p>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-2.5 my-5">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Hoặc tiếp tục với</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Social buttons */}
            <div className="grid gap-2 mb-5">
              <button
                type="button"
                onClick={handleGoogle}
                className="flex items-center justify-center gap-2 border border-black/10 bg-white px-3 py-3 text-[13px] font-semibold text-gray-900 rounded-lg cursor-pointer transition-all duration-150 hover:border-black hover:bg-neutral-50 whitespace-nowrap"
              >
                <GoogleIcon /> Google
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-black bg-black py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] text-white rounded-lg transition-all duration-200 cursor-pointer hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-65 disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="w-4 h-4 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" />
                : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'
              }
            </button>

          </form>

          {/* Switch mode */}
          <p className="text-center mt-4 text-[13px] text-gray-500">
            {mode === 'login' ? (
              <>Chưa có tài khoản?{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-black hover:underline"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <>Đã có tài khoản?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-black hover:underline"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </p>

        </div>
      </div>
      </div>
    </>
  );
}
