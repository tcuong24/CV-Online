'use client';

import Link from 'next/link';
import {
  Globe,
  BadgeCheck,
  MoreHorizontal,
  Briefcase,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  Languages,
  Camera,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────
interface CVPersonalInfo {
  fullName: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  photoUrl?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary?: string;
}

interface CVExperience {
  id: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

interface CVEducation {
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
}

interface CVSkill {
  id: string;
  skillName: string;
  proficiencyLevel?: string;
}

interface CVLanguage {
  id: string;
  languageName: string;
  proficiencyLevel?: string;
}

interface CVUser {
  fullName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  profileIsPublic: boolean;
  profileViewCount: number;
}

interface CVData {
  id: string;
  userId: string;
  isPublic: boolean;
  user: CVUser;
  personalInfo?: CVPersonalInfo;
  experiences: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  languages: CVLanguage[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
}

function formatPeriod(startDate?: string, endDate?: string, isCurrent?: boolean) {
  const start = formatDate(startDate);
  const end = isCurrent ? 'Hiện tại' : formatDate(endDate);
  if (!start && !end) return '';
  return `${start} – ${end}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ExperienceCard({ exp }: { exp: CVExperience }) {
  return (
    <div className="flex flex-col gap-4 border border-[#d9d8d2] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#1e3a3a] hover:shadow-[0_12px_30px_rgba(30,58,58,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-[#edf2ee] text-[#1e3a3a]">
          <Briefcase size={16} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{exp.position}</p>
          <p className="text-gray-500 text-sm">{exp.companyName}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 font-medium mt-auto">
        {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
      </p>
    </div>
  );
}

function EducationCard({ edu }: { edu: CVEducation }) {
  return (
    <div className="flex flex-col gap-4 border border-[#d9d8d2] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#1e3a3a] hover:shadow-[0_12px_30px_rgba(30,58,58,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-[#edf2ee] text-[#1e3a3a]">
          <GraduationCap size={16} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{edu.degree}</p>
          <p className="text-gray-500 text-sm">{edu.institutionName}</p>
          {edu.fieldOfStudy && <p className="text-gray-400 text-xs">{edu.fieldOfStudy}</p>}
        </div>
      </div>
      <p className="text-xs text-gray-400 font-medium mt-auto">
        {formatPeriod(edu.startDate, edu.endDate, edu.isCurrent)}
      </p>
    </div>
  );
}

function ProfileLink({ href, label, external = false }: { href: string; label: string; external?: boolean }) {
  const normalizedHref = external && !href.startsWith('http') ? `https://${href}` : href;
  return (
    <a
      href={normalizedHref}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-1.5 text-[#1e3a3a] underline-offset-4 hover:underline"
    >
      {label}
      {external && <ExternalLink size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
    </a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-[calc(100vh-56px)] animate-pulse bg-[#f6f4ee]">
      <div className="border-b border-[#d9d8d2] bg-[#edf2ee]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center gap-8">
          <div className="h-28 w-28 rounded-full bg-gray-200" />
          <div className="space-y-3"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-4 w-64 bg-gray-200 rounded" /></div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="h-32 bg-gray-200 rounded-sm" />
            <div className="h-24 bg-gray-200 rounded-sm" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-sm" />
            <div className="h-32 bg-gray-200 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySection({ label }: { label: string }) {
  return (
    <p className="text-sm text-gray-400 italic">
      Chưa có {label}.{' '}
      <Link href="/templates" className="text-[#1e3a3a] hover:underline font-medium not-italic">
        Tạo CV
      </Link>
    </p>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfileClient({ publicUserId }: { publicUserId?: string }) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const isPublicView = Boolean(publicUserId);

  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [visibilityUpdating, setVisibilityUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!isPublicView && !isUploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const accessToken = session?.user?.accessToken;
    if (!accessToken) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axiosInstance.post('upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { url } = uploadRes.data;

      const updateRes = await axiosInstance.patch('/users/me/avatar', { avatarUrl: url });

      if (updateRes.status !== 200) throw new Error('Update user failed');
      await update({
        ...session,
        user: {
          ...session?.user,
          image: url,
          avatarUrl: url,
        },
      });
      toast.success('Cập nhật ảnh đại diện thành công');
      setCv(prev => prev ? { ...prev, user: { ...prev.user, avatarUrl: url } } : prev);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi cập nhật ảnh đại diện');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (isPublicView && publicUserId) {
      if (status === 'loading') return;

      const fetchPublicProfile = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999/api'}/users/public-profile/${encodeURIComponent(publicUserId)}`,
            {
              headers: session?.user?.accessToken
                ? { Authorization: `Bearer ${session.user.accessToken}` }
                : {},
            },
          );

          if (!res.ok) {
            setError('Hồ sơ này không tồn tại hoặc chưa được chia sẻ công khai');
            return;
          }

          setCv(await res.json());
        } catch {
          setError('Lỗi kết nối server');
        } finally {
          setLoading(false);
        }
      };

      fetchPublicProfile();
      return;
    }

    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    const accessToken = session?.user?.accessToken;
    if (!accessToken) return;

    const fetchDefaultCV = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999/api'}/cvs/default`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (res.status === 401) { router.push('/auth'); return; }
        if (!res.ok) { setError('Không thể tải dữ liệu hồ sơ'); return; }

        const data = await res.json();
        setCv(data);
      } catch {
        setError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultCV();
  }, [isPublicView, publicUserId, session, status, router]);

  if (status === 'loading' || loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-sm">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const userName = cv?.user?.fullName || session?.user?.name || 'Người dùng';
  const userEmail = cv?.user?.email || session?.user?.email || '';
  const userPhone = cv?.user?.phone;
  const userAvatar = cv?.user?.avatarUrl || session?.user?.image || '';

  const pi = cv?.personalInfo;
  const displayName = pi?.fullName || userName;
  const headline = pi?.jobTitle ? `${pi.jobTitle}${pi.location ? ` · ${pi.location}` : ''}` : '';

  const handleCopyProfileLink = async () => {
    if (!cv?.user?.profileIsPublic) {
      toast.error('Hãy bật công khai hồ sơ trước khi chia sẻ');
      return;
    }

    const profileUrl = `${window.location.origin}/profile/${cv.userId}`;
    await navigator.clipboard.writeText(profileUrl);
    toast.success('Đã sao chép link hồ sơ');
  };

  const handleToggleProfileVisibility = async () => {
    if (!cv?.user || visibilityUpdating) return;

    const nextIsPublic = !cv.user.profileIsPublic;

    try {
      setVisibilityUpdating(true);
      await axiosInstance.patch('/users/me/profile-visibility', {
        isPublic: nextIsPublic,
      });
      setCv((current) => current ? {
        ...current,
        user: { ...current.user, profileIsPublic: nextIsPublic },
      } : current);
      toast.success(nextIsPublic ? 'Hồ sơ đã được công khai' : 'Hồ sơ đã được ẩn');
    } catch {
      toast.error('Không thể cập nhật trạng thái hồ sơ');
    } finally {
      setVisibilityUpdating(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex-grow bg-[#f6f4ee] text-[#171b1a]">
      <header className="relative overflow-hidden border-b border-[#d9d8d2] bg-[#edf2ee]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#1e3a3a]/10" />
        <div className="pointer-events-none absolute -right-6 -top-8 h-52 w-52 rounded-full border border-[#1e3a3a]/10" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-7 px-6 py-12 sm:flex-row sm:items-center sm:gap-9 md:mt-12 md:py-16">
          <div
            className={cn('relative flex-shrink-0 group', !isPublicView && 'cursor-pointer')}
            onClick={handleAvatarClick}
          >
            <Avatar className={cn("h-28 w-28 rounded-full border-4 border-white shadow-[0_16px_36px_rgba(30,58,58,0.16)]", isUploading && "opacity-70")}>
              <AvatarImage src={userAvatar} alt={displayName} />
              <AvatarFallback className="text-2xl font-bold bg-[#1e3a3a] text-white">
                {displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {!isPublicView && (
              <>
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-6 w-6 text-white mb-1" />
                      <span className="text-white text-xs font-medium">Thay đổi ảnh</span>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}

            <div className="absolute bottom-1 right-1 bg-[#1e3a3a] rounded-full p-1 border-2 border-white pointer-events-none">
              <BadgeCheck size={14} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-2 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1e3a3a]/55">Hồ sơ nghề nghiệp</p>
            <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-[#171b1a] md:text-5xl">
              {displayName}
            </h1>
            {headline && <p className="mt-1.5 text-sm text-gray-500 sm:text-base">{headline}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {pi?.linkedinUrl && <ProfileLink href={pi.linkedinUrl} label="LinkedIn" external />}
              {pi?.githubUrl && <ProfileLink href={pi.githubUrl} label="GitHub" external />}
              {pi?.website && <ProfileLink href={pi.website} label="Portfolio" external />}
              {userEmail && <ProfileLink href={`mailto:${userEmail}`} label={userEmail} />}
              {userPhone && <ProfileLink href={`tel:${userPhone}`} label={userPhone} />}
            </div>
          </div>

          {!isPublicView && (
            <div className="self-start sm:ml-auto flex flex-wrap items-center justify-end gap-2">
              <span className="mr-1 text-xs text-gray-500">
                {cv?.user?.profileViewCount || 0} lượt xem
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={visibilityUpdating}
                onClick={handleToggleProfileVisibility}
                className={cn(
                  'gap-2 rounded-none border-[#c9cbc5] bg-white/60',
                  cv?.user?.profileIsPublic && 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                )}
              >
                {visibilityUpdating
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Globe size={14} />}
                {cv?.user?.profileIsPublic ? 'Công khai' : 'Đang ẩn'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-[#c9cbc5] bg-white/60">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={handleCopyProfileLink}>
                    Sao chép link hồ sơ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 pb-20 md:grid-cols-[minmax(0,1fr)_320px]">

          {/* Left col */}
          <div className="space-y-14">

            {/* About */}
            <section>
              <p className="mb-2 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e3a3a]/55">01 · Câu chuyện</p>
              <h2 className="mb-4 font-headline text-2xl font-semibold text-gray-900">Giới thiệu</h2>
              {pi?.summary ? (
                <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  <p>{expanded ? pi.summary : pi.summary.slice(0, 300)}</p>
                  {pi.summary.length > 300 && (
                    <button
                      onClick={() => setExpanded(v => !v)}
                      className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#1e3a3a] hover:underline"
                    >
                      {expanded ? 'Thu gọn' : 'Xem thêm'}
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform duration-200', expanded && 'rotate-180')}
                      />
                    </button>
                  )}
                </div>
              ) : (
                <EmptySection label="giới thiệu" />
              )}
            </section>

            {/* Experience */}
            <section>
              <p className="mb-2 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e3a3a]/55">02 · Hành trình</p>
              <h2 className="mb-5 font-headline text-2xl font-semibold text-gray-900">Kinh nghiệm</h2>
              {cv?.experiences && cv.experiences.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cv.experiences.map(exp => <ExperienceCard key={exp.id} exp={exp} />)}
                </div>
              ) : (
                <EmptySection label="kinh nghiệm" />
              )}
            </section>

            {/* Education */}
            <section>
              <p className="mb-2 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e3a3a]/55">03 · Nền tảng</p>
              <h2 className="mb-5 font-headline text-2xl font-semibold text-gray-900">Học vấn</h2>
              {cv?.education && cv.education.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cv.education.map(edu => <EducationCard key={edu.id} edu={edu} />)}
                </div>
              ) : (
                <EmptySection label="học vấn" />
              )}
            </section>
          </div>

          {/* Right col (sidebar) */}
          <aside className="space-y-6">
            {/* Skills */}
            <div className="space-y-4 border border-[#d9d8d2] bg-white p-6 shadow-[0_12px_30px_rgba(30,58,58,0.04)]">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e3a3a]/55">Chuyên môn</p>
              <h2 className="font-headline text-xl font-semibold text-gray-900">Kỹ năng</h2>
              {cv?.skills && cv.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map(skill => (
                    <span
                      key={skill.id}
                      className="border border-[#d9d8d2] bg-[#f8f7f2] px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-[#1e3a3a]"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptySection label="kỹ năng" />
              )}
            </div>

            {/* Languages */}
            <div className="space-y-4 border border-[#d9d8d2] bg-white p-6 shadow-[0_12px_30px_rgba(30,58,58,0.04)]">
              <h2 className="flex items-center gap-2 font-headline text-xl font-semibold text-gray-900">
                <Languages size={15} />
                Ngôn ngữ
              </h2>
              {cv?.languages && cv.languages.length > 0 ? (
                <div className="space-y-2">
                  {cv.languages.map(lang => (
                    <div key={lang.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{lang.languageName}</span>
                      {lang.proficiencyLevel && (
                        <span className="border border-gray-200 text-gray-500 text-xs font-normal px-2 py-0.5 rounded-sm">
                          {lang.proficiencyLevel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySection label="ngôn ngữ" />
              )}
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
