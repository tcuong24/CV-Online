import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * ConfirmDialog - Component dialog xác nhận có thể tái sử dụng
 * 
 * @param {boolean} open - Trạng thái mở/đóng của dialog
 * @param {function} onOpenChange - Callback khi trạng thái thay đổi
 * @param {function} onConfirm - Callback khi người dùng xác nhận
 * @param {function} onCancel - Callback khi người dùng hủy (optional)
 * @param {string} title - Tiêu đề của dialog
 * @param {string} description - Mô tả chi tiết
 * @param {string} confirmText - Text cho nút xác nhận (default: "Xác nhận")
 * @param {string} cancelText - Text cho nút hủy (default: "Hủy")
 * @param {string} variant - Loại dialog: 'default' | 'destructive' | 'warning' (default: 'default')
 */
type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
}
export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Bạn có chắc chắn không?",
  description = "Hành động này không thể hoàn tác.",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  // Xác định style dựa trên variant
  const getConfirmButtonClass = () => {
    const base = 'rounded-sm px-5 py-2.5 text-sm font-medium transition-colors border-none';
    switch (variant) {
      case 'destructive':
        return `${base} bg-red-600 hover:bg-red-700 text-white shadow-sm`;
      case 'warning':
        return `${base} bg-amber-600 hover:bg-amber-700 text-white shadow-sm`;
      default:
        return `${base} bg-[#1e3a3a] hover:bg-[#2c5252] text-white shadow-sm`;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-sm border-gray-200 shadow-xl bg-white p-8">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-3xl font-headline  font-bold text-[#111827]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-[15px] leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 gap-3 sm:gap-3">
          <AlertDialogCancel 
            onClick={handleCancel}
            className="mt-0 rounded-sm border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={getConfirmButtonClass()}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}