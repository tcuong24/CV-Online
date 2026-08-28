'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCvEditorStore } from '@/stores/useCvEditor';
import { CvEditorWorkspace } from '@/components/editor/CvEditorWorkspace';

export default function CreateCVPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const resetCV = useCvEditorStore((s) => s.resetCV);
  const syncToDb = useCvEditorStore((s) => s.syncToDb);

  // Dọn dẹp store khi truy cập trang tạo mới để tránh lộ dữ liệu cũ
  // Chỉ reset nếu có cvId (đang ở phiên cũ) hoặc không có templateId (tạo CV trắng)
  useEffect(() => {
    const state = useCvEditorStore.getState();
    if (state.cvId || !state.templateId) {
      resetCV();
    }
  }, [resetCV]);

  const handleSave = async (opts?: { captureThumbnail?: boolean }) => {
    if (status !== 'authenticated' || !session?.user) {
      toast.warning('Bạn cần đăng nhập để lưu CV.', {
        description: 'Nội dung đang chỉnh sửa vẫn được giữ lại trên thiết bị này.',
        action: {
          label: 'Đăng nhập',
          onClick: () =>
            router.push('/auth?type=login&callbackUrl=%2Fcvs%2Fcreate&reason=create-cv'),
        },
      });
      return null;
    }

    const cvId = await syncToDb(opts);
    if (cvId) {
      // Sau khi lưu thành công lần đầu, chuyển hướng sang trang edit với ID mới
      router.push(`/cvs/${cvId}/edit`);
      return cvId;
    }
    return null;
  };

  return (
    <CvEditorWorkspace
      onSave={handleSave}
      requiresLoginToSave={status === 'unauthenticated'}
    />
  );
}
