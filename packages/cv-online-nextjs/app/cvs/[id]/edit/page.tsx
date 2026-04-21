'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { CvEditorWorkspace } from '@/components/editor/CvEditorWorkspace';
import axiosInstance from '@/lib/axios';

export default function EditCVPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;
  const { status } = useSession();

  const [loading, setLoading] = useState(true);
  const setCV = useCvEditorStore((s) => s.setCV);

  // Load CV Data khi mount hoặc khi ID thay đổi
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    if (!cvId) return;

    setLoading(true);
    axiosInstance.get(`/cvs/${cvId}`)
      .then(res => {
        setCV(res.data);
      })
      .catch(err => {
        console.error('Failed to load CV:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cvId, status, router, setCV]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải cấu trúc CV...</p>
        </div>
      </div>
    );
  }

  return <CvEditorWorkspace />;
}
