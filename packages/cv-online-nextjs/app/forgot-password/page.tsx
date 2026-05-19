'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, Send, ShieldCheck, X, Eye, EyeOff, Save, Check } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // Tiến trình: 1 = Nhập Email, 2 = Nhập OTP (Hiển thị Modal), 3 = Đặt mật khẩu mới
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Dữ liệu Form
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Ẩn/Hiện mật khẩu
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Bộ đếm ngược OTP (ví dụ 60 giây)
  const [countdown, setCountdown] = useState(0);

  // Refs cho 6 ô nhập OTP
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Đếm ngược thời gian gửi lại OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Tự động nhảy tiêu điểm khi gõ OTP
  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, ''); // Chỉ cho phép nhập số
    if (!cleanValue) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = cleanValue.substring(cleanValue.length - 1); // Chỉ lấy ký tự cuối
    setOtpValues(newOtpValues);

    // Di chuyển tiêu điểm sang ô tiếp theo
    if (index < 5 && cleanValue) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newOtpValues = [...otpValues];
      if (otpValues[index]) {
        // Nếu ô hiện tại có chữ, xóa chữ
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
      } else if (index > 0) {
        // Nếu ô hiện tại rỗng, xóa chữ ô trước đó và nhảy về
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
        otpRefs[index - 1].current?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (pastedData.length === 6) {
      const chars = pastedData.split('');
      setOtpValues(chars);
      otpRefs[5].current?.focus();
    }
  };

  // Tự động nhảy focus vào ô OTP đầu tiên khi mở modal
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }
  }, [step]);

  // Format email để hiển thị dạng ex***@gmail.com
  const formatMaskedEmail = (rawEmail: string) => {
    if (!rawEmail) return '';
    const parts = rawEmail.split('@');
    if (parts.length !== 2) return rawEmail;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  // Gửi OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return toast.error('Vui lòng nhập địa chỉ email!');

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      toast.success('Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn!');
      setStep(2); // Mở Modal OTP
      setCountdown(60); // 60 giây gửi lại
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Xác nhận OTP ở giao diện Modal
  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otpValues.join('');
    if (finalOtp.length !== 6) {
      return toast.error('Vui lòng nhập đủ 6 ký tự số OTP!');
    }
    // Chuyển sang Bước 3 (Đặt mật khẩu mới) và đóng modal
    toast.success('Xác nhận OTP thành công!');
    setStep(3);
  };

  // Đo độ mạnh mật khẩu (Strength Meter)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, text: 'Yếu', color: 'bg-red-500' };
      case 2:
        return { score: 2, text: 'Trung bình', color: 'bg-amber-500' };
      case 3:
        return { score: 3, text: 'Tốt', color: 'bg-emerald-500' };
      case 4:
      default:
        return { score: 4, text: 'Rất tốt', color: 'bg-emerald-600' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  // Đổi mật khẩu
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otpValues.join('');
    
    if (newPassword.length < 8) {
      return toast.error('Mật khẩu mới phải từ 8 ký tự trở lên!');
    }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return toast.error('Mật khẩu phải bao gồm cả chữ hoa và số!');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Mật khẩu xác nhận không trùng khớp!');
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', {
        email,
        otp: finalOtp,
        newPassword,
      });
      toast.success('Cập nhật mật khẩu thành công!');
      setTimeout(() => {
        router.push('/auth');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP hết hạn hoặc mật khẩu không hợp lệ!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
      {/* Thêm style cục bộ cho hiệu ứng Modal FadeIn cực mượt */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in > div {
          animation: fadeIn 0.18s ease-out forwards;
        }
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 p-8 shadow-sm relative">
        {/* Stepper Progress bar tích hợp trong Card */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                n <= step ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {step !== 3 ? (
          /* STEP 1: NHẬP EMAIL */
          <div>
            {/* Step label tích hợp visual trong Card */}
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">
              Bước 1 / 3
            </p>

            {/* Top Icon */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Mail size={22} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quên mật khẩu?</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Nhập email đăng ký tài khoản. Chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-900 text-sm placeholder:text-slate-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <Send size={16} />
                )}
                {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-slate-500 text-sm">Nhớ mật khẩu rồi? </span>
              <Link href="/auth" className="text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors">
                Đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          /* STEP 3: ĐẶT MẬT KHẨU MỚI */
          <div>
            {/* Step label tích hợp visual trong Card */}
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">
              Bước 3 / 3
            </p>

            {/* Top Icon */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Lock size={22} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Đặt mật khẩu mới</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và số.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              {/* Mật khẩu mới */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-900 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Thanh đo độ mạnh */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs text-slate-500">Độ mạnh:</span>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{strength.text}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1">
                      {[1, 2, 3, 4].map((barIndex) => (
                        <div
                          key={barIndex}
                          className={`h-full rounded-full transition-all duration-300 ${
                            barIndex <= strength.score ? strength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-900 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Huy hiệu Mật khẩu khớp */}
                {confirmPassword && newPassword === confirmPassword && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold border border-emerald-100">
                    <Check size={14} className="stroke-[3]" />
                    Mật khẩu khớp
                  </div>
                )}
              </div>

              {/* Nút cập nhật mật khẩu */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <Save size={16} />
                )}
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* STEP 2: MODAL XÁC NHẬN OTP (BACKDROP OVERLAY) */}
      {step === 2 && (
        <div className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center px-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 shadow-xl relative overflow-hidden">
            {/* Nút Close modal */}
            <button
              onClick={() => setStep(1)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Nhập mã OTP</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Mã 6 chữ số đã gửi tới <span className="font-semibold text-slate-800">{formatMaskedEmail(email)}</span>
            </p>

            <form onSubmit={handleConfirmOtp} className="space-y-6">
              {/* 6 Ô NHẬP OTP (Highlight ô đã điền cực chuẩn) */}
              <div className="flex justify-between items-center gap-2">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className={`w-12 h-14 border rounded-lg text-center font-bold text-xl transition-all outline-none text-slate-900
                      ${val ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200'}
                      focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                    required
                  />
                ))}
              </div>

              {/* Nút Xác nhận vững chãi Solid */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShieldCheck size={18} />
                Xác nhận
              </button>
            </form>

            {/* Gửi lại OTP */}
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">Không nhận được mã? </span>
              {countdown > 0 ? (
                <span className="text-slate-400 font-medium">Gửi lại ({countdown}s)</span>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Gửi lại
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
