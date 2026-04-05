'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

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

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

// ── Shared input styles ───────────────────────────────────────────────────────
const inputBase =
  'w-full px-3.5 py-2.5 bg-[#f7f8fc] border-[1.5px] border-[#e3e8f0] rounded-[10px] text-sm text-gray-900 outline-none transition-all duration-150 placeholder:text-gray-400 focus:border-[#3b5bdb] focus:bg-white focus:shadow-[0_0_0_3.5px_rgba(59,91,219,0.11)]';

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
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';
    router.push(callbackUrl);
    router.refresh(); // cập nhật server components (layout, header...)
  };

  // ── Register → auto login ─────────────────────────────────────────────────
  const handleRegister = async () => {
    // 1. Gọi API tạo tài khoản
    const res = await fetch('/api/auth/register', {
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

    router.push('/cvs');
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
    const callbackUrl = searchParams.get('callbackUrl') ?? '/cvs';
    signIn('google', { callbackUrl });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-gray-900 antialiased"
      style={{
        backgroundColor: '#e8eef8',
        backgroundImage: `
          radial-gradient(ellipse 65% 75% at 105% 5%, #818cf8 0%, transparent 50%),
          radial-gradient(ellipse 75% 65% at 100% 15%, #a5b4fc 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 0% 100%, #dbeafe 0%, transparent 55%)
        `,
      }}
    >

      {/* ── Left panel ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center px-7 py-12 lg:px-18 lg:py-16">
        <div className="max-w-[420px]">
          <h1 className="text-3xl lg:text-[40px] font-bold leading-tight tracking-tight text-gray-900 mb-4">
            Nhanh chóng, hiệu quả<br className="hidden lg:block" /> và chuyên nghiệp
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Tạo CV ấn tượng trong vài phút với hàng trăm mẫu đẹp.<br className="hidden lg:block" />
            Hàng nghìn chuyên gia đã tin dùng để mở lối thành công.
          </p>
        </div>
      </div>

      {/* ── Right panel — Card ────────────────────────────────────────────── */}
      <div className="flex items-center justify-start px-4 py-10 lg:pr-8">
        <div className="w-full max-w-[500px] bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_24px_64px_rgba(59,91,219,0.10),0_2px_8px_rgba(0,0,0,0.06)] border border-white/70 px-8 py-9">

          {/* Tabs */}
          <div className="flex bg-[#f0f2f8] rounded-[10px] p-1 mb-6 gap-1">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={clsx(
                  'flex-1 py-2 rounded-[7px] text-sm font-semibold transition-all duration-200 cursor-pointer border-0',
                  mode === m
                    ? 'bg-white text-[#3b5bdb] shadow-[0_1px_4px_rgba(0,0,0,0.10)]'
                    : 'bg-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>

          {/* General error banner — lỗi từ server */}
          {errors.general && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-[9px] text-[13px] text-red-600">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-0 p-0.5 flex items-center"
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
                <Link href="/forgot-password" className="text-xs text-[#3b5bdb] font-medium hover:underline">
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
                    className="w-3.5 h-3.5 rounded accent-[#3b5bdb] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-[12.5px] text-gray-500">
                    Tôi đồng ý với{' '}
                    <a href="/terms" className="text-[#3b5bdb] font-medium hover:underline">
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
            <div className="flex items-center gap-2.5 my-4">
              <div className="flex-1 h-px bg-[#e3e8f0]" />
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Hoặc tiếp tục với</span>
              <div className="flex-1 h-px bg-[#e3e8f0]" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={handleGoogle}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border-[1.5px] border-[#e3e8f0] rounded-[9px] text-[13px] font-medium text-gray-900 cursor-pointer transition-all duration-150 hover:border-[#c5cee0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)] whitespace-nowrap"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border-[1.5px] border-[#e3e8f0] rounded-[9px] text-[13px] font-medium text-gray-900 cursor-pointer transition-all duration-150 hover:border-[#c5cee0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)] whitespace-nowrap"
              >
                <AppleIcon /> Apple
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#3b5bdb] text-white text-[15px] font-semibold rounded-[10px] shadow-[0_4px_14px_rgba(59,91,219,0.28)] transition-all duration-200 cursor-pointer hover:bg-[#2f4ac7] hover:shadow-[0_6px_20px_rgba(59,91,219,0.35)] active:scale-[0.985] disabled:opacity-65 disabled:cursor-not-allowed border-0"
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
                  className="text-[#3b5bdb] font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <>Đã có tài khoản?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-[#3b5bdb] font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  );
}