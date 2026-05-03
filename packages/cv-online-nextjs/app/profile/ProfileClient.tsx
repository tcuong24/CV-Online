'use client';

import Link from 'next/link';
import {
  MapPin,
  Globe,
  Mail,
  BadgeCheck,
  MoreHorizontal,
  MessageCircle,
  Briefcase,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  Languages,
  Phone,
  Camera,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
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
}

interface CVData {
  id: string;
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
function CoverPhoto() {
  return (
    <div className="h-40 md:h-52 w-full relative overflow-hidden bg-[#e5e7eb]">
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(45deg, #d1d5db 0px, #d1d5db 1px, transparent 1px, transparent 12px)' }} />
    </div>
  );
}

function ExperienceCard({ exp }: { exp: CVExperience }) {
  return (
    <div className="border border-gray-200 bg-white p-5 rounded-sm flex flex-col gap-3 hover:border-gray-400 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600">
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
    <div className="border border-gray-200 bg-white p-5 rounded-sm flex flex-col gap-3 hover:border-gray-400 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600">
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

function LoadingSkeleton() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#faf9f6] animate-pulse">
      <div className="h-40 md:h-52 bg-gray-200" />
      <div className="max-w-5xl mx-auto px-6 -mt-14">
        <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gray-200 border-4 border-white" />
        <div className="mt-4 space-y-3">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-10">
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
      <Link href="/cv/edit" className="text-[#1e3a3a] hover:underline font-medium not-italic">
        Cập nhật CV
      </Link>
    </p>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfileClient() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!isUploading) fileInputRef.current?.click();
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
  }, [session, status, router]);

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

  return (
    <main className="flex-grow w-full">
      {/* Cover */}
      <CoverPhoto />

      <div className="max-w-5xl mx-auto px-6">
        {/* Avatar row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 pb-6">

          {/* Avatar */}
          <div className="relative flex-shrink-0 group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar className={cn("h-28 w-28 sm:h-32 sm:w-32 border-4 border-white shadow-sm rounded-full", isUploading && "opacity-70")}>
              <AvatarImage src={userAvatar} alt={displayName} />
              <AvatarFallback className="text-2xl font-bold bg-[#1e3a3a] text-white">
                {displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

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

            <div className="absolute bottom-1 right-1 bg-[#1e3a3a] rounded-full p-1 border-2 border-white pointer-events-none">
              <BadgeCheck size={14} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:pb-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-sm h-9 w-9 border-gray-200">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sao chép link</DropdownMenuItem>
                <DropdownMenuItem>Báo cáo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="flex items-center space-x-2 border border-[#1e3a3a] text-[#1e3a3a] px-5 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm font-medium">
              <MessageCircle size={15} />
              <span>Nhắn tin</span>
            </button>
          </div>
        </div>

        {/* Name + headline */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-gray-900 tracking-tight">
            {displayName}
          </h1>
          {headline && <p className="text-gray-500 mt-1 text-sm">{headline}</p>}
        </div>

        <Separator className="my-6" />

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16">

          {/* Left col */}
          <div className="md:col-span-2 space-y-12">

            {/* About */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Giới thiệu</h2>
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
              <h2 className="text-base font-semibold text-gray-900 mb-4">Kinh nghiệm</h2>
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
              <h2 className="text-base font-semibold text-gray-900 mb-4">Học vấn</h2>
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
            {/* Contact info */}
            <div className="bg-white border border-gray-200 p-5 rounded-sm space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Thông tin</h2>
              <div className="space-y-3">
                {pi?.location && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{pi.location}</span>
                  </div>
                )}

                {pi?.website && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Globe size={15} className="text-gray-400 flex-shrink-0" />
                    <a
                      href={pi.website.startsWith('http') ? pi.website : `https://${pi.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1e3a3a] hover:underline flex items-center gap-1"
                    >
                      {pi.website.replace(/^https?:\/\//, '')}
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                {pi?.linkedinUrl && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Globe size={15} className="text-gray-400 flex-shrink-0" />
                    <a
                      href={pi.linkedinUrl.startsWith('http') ? pi.linkedinUrl : `https://${pi.linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1e3a3a] hover:underline flex items-center gap-1"
                    >
                      LinkedIn
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                {pi?.githubUrl && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Globe size={15} className="text-gray-400 flex-shrink-0" />
                    <a
                      href={pi.githubUrl.startsWith('http') ? pi.githubUrl : `https://${pi.githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1e3a3a] hover:underline flex items-center gap-1"
                    >
                      GitHub
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                {userEmail && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${userEmail}`} className="text-[#1e3a3a] hover:underline">
                      {userEmail}
                    </a>
                  </div>
                )}

                {userPhone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${userPhone}`} className="text-[#1e3a3a] hover:underline">
                      {userPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-gray-200 p-5 rounded-sm space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">Kỹ năng</h2>
              {cv?.skills && cv.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map(skill => (
                    <span
                      key={skill.id}
                      className="border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-sm hover:border-gray-400 transition-colors bg-white"
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
            <div className="bg-white border border-gray-200 p-5 rounded-sm space-y-3">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
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
