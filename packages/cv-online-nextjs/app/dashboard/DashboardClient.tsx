"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import ConfirmDialog from "@/components/utils/ConfirmDialog";
import { EditableText } from "@/components/utils/EditableText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplatesGrid } from "@/components/templates/TemplateGrid";
import { toast } from "sonner";

export default function DashboardClient() {
  const { data: session } = useSession();
  const [cvs, setCvs] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cvIdToDelete, setCvIdToDelete] = useState<string | null>(null);
  
  const [activeDropdownCvId, setActiveDropdownCvId] = useState<string | null>(null);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedCvForShare, setSelectedCvForShare] = useState<any | null>(null);
  const [updatingShare, setUpdatingShare] = useState(false);

  const handleDeleteCv = async (id: string) => {
    try {
      await axiosInstance.delete(`/cvs/${id}`);
      getCvs();
    } catch (error) {
      console.error(error);
    }
    setOpenDeleteDialog(false);
    setCvIdToDelete(null);
  }
  const handleChangeName = async (id: string, title: string) => {
    try {
      await axiosInstance.put(`/cvs/${id}`, { title });
      getCvs();
    } catch (error) {
      console.error(error);
    }
  }
  const handleSetDefault = async (id: string) => {
    try {
      await axiosInstance.patch(`/cvs/${id}/set-default`);
      getCvs();
    } catch (error) {
      console.error(error);
    }
  }
  const getCvs = async () => {
    try {
      const res = await axiosInstance.get("/cvs");
      setCvs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadPdf = async (id: string, title: string) => {
    try {
      toast.loading("Đang tạo và tải xuống PDF...", { id: `download-${id}` });
      const response = await axiosInstance.post(`/export/cv/${id}/pdf`, {}, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title || 'CV'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải xuống PDF thành công!", { id: `download-${id}` });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải xuống PDF", { id: `download-${id}` });
    }
  };

  const handleTogglePublic = async (cv: any, isPublic: boolean) => {
    setUpdatingShare(true);
    try {
      if (isPublic) {
        const res = await axiosInstance.post(`/cvs/${cv.id}/publish`);
        const updatedCv = res.data;
        setSelectedCvForShare(updatedCv);
        toast.success("Đã bật chế độ chia sẻ công khai!");
      } else {
        const res = await axiosInstance.post(`/cvs/${cv.id}/unpublish`);
        const updatedCv = res.data;
        setSelectedCvForShare(updatedCv);
        toast.success("Đã tắt chế độ chia sẻ công khai!");
      }
      getCvs();
    } catch (error) {
      console.error(error);
      toast.error("Không thể thay đổi trạng thái chia sẻ");
    } finally {
      setUpdatingShare(false);
    }
  };

  useEffect(() => {
    getCvs();
  }, []);
  const getTimeLable = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Chào buổi sáng";
    } else if (hour < 18) {
      return "Chào buổi chiều";
    } else {
      return "Chào buổi tối";
    }
  }
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-32 pb-12">
      {/* Welcome Section */}
      <section className="mb-12" data-purpose="hero-section">
        <p className="text-lg font-normal mb-1">{getTimeLable()}, {session?.user?.name}</p>
        <h1 className="text-6xl font-headline italic mb-8 text-foreground">Những bản CV của bạn trông thật chuyên nghiệp.</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center space-x-2 border border-[#1e3a3a] text-[#1e3a3a] px-5 py-2.5 rounded-sm hover:bg-gray-200 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span>Tạo CV mới</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline mb-4">Chọn mẫu CV để bắt đầu</DialogTitle>
            </DialogHeader>
            <TemplatesGrid />
          </DialogContent>
        </Dialog>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-purpose="statistics-grid">
        {/* Total CVs */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm">
          <p className="text-sm font-medium text-gray-500 mb-2">Tổng số CV</p>
          <p className="text-4xl font-normal text-foreground">{cvs.length}</p>
        </div>
        {/* Downloads */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm">
          <p className="text-sm font-medium text-gray-500 mb-2">Lượt tải</p>
          <p className="text-4xl font-normal text-foreground">142</p>
        </div>
        {/* Top Template */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-gray-500 mb-2">Mẫu phổ biến</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-3xl font-medium text-gray-900">Chuyên nghiệp hiện đại</p>
            <button className="p-1 text-gray-700 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Recent CVs Section */}
      <section data-purpose="recent-cvs-section">
        <h2 className="text-xl font-medium mb-6 text-foreground">CV gần đây</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cvs.length === 0 ? (
            <p className="text-sm text-gray-500">Bạn chưa tạo bản CV nào.</p>
          ) : (
            cvs.map((cv) => (
              <div key={cv.id} className="group" data-purpose="cv-item">
                <Link href={`/cvs/${cv.id}/edit`}>
                  <div className="bg-[#e5e7eb] aspect-[1/1.1] p-0 rounded-sm mb-4 flex items-center justify-center overflow-hidden border border-gray-200 relative hover:border-gray-400 transition-colors cursor-pointer">
                    {cv.thumbnailUrl ? (
                      <img
                        src={cv.thumbnailUrl}
                        alt={cv.title || "CV Thumbnail"}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <svg className="w-3/4 h-auto drop-shadow-md" fill="white" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
                        <rect fill="white" height="297" width="210"></rect>
                        <rect fill="#4b5563" height="297" width="60" x="0" y="0"></rect>
                        <rect fill="#9ca3af" height="30" rx="15" width="30" x="15" y="20"></rect>
                        <rect fill="#d1d5db" height="4" rx="2" width="30" x="15" y="60"></rect>
                        <rect fill="#d1d5db" height="4" rx="2" width="20" x="15" y="70"></rect>
                        <rect fill="#111827" height="8" rx="2" width="80" x="80" y="30"></rect>
                        <rect fill="#9ca3af" height="6" rx="2" width="40" x="80" y="45"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="70"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="80"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="80" x="80" y="90"></rect>
                        <rect fill="#111827" height="6" rx="2" width="50" x="80" y="120"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="140"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="150"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="90" x="80" y="160"></rect>
                      </svg>
                    )}
                  </div>
                  {cv.isDefault && (
                    <div className="absolute top-2 left-2 bg-[#1e3a3a] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                      Hồ sơ chính
                    </div>
                  )}
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                      <EditableText value={cv.title || "CV chưa đặt tên"} onChange={(value) => handleChangeName(cv.id, value)} />
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                      <span>Sửa đổi lúc {new Date(cv.updatedAt || cv.createdAt).toLocaleDateString('vi-VN')}</span>
                      {cv.isPublic && (
                        <span title="Đang chia sẻ công khai" className="text-emerald-600 flex-shrink-0 animate-pulse">
                          <svg className="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-800">
                    <button
                      title={cv.isDefault ? 'Đang là hồ sơ chính' : 'Đặt làm hồ sơ chính'}
                      onClick={() => !cv.isDefault && handleSetDefault(cv.id)}
                      className={cv.isDefault ? 'text-[#1e3a3a] cursor-default' : 'text-gray-300 hover:text-[#1e3a3a] cursor-pointer'}
                    >
                      <svg className="w-4 h-4" fill={cv.isDefault ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    </button>
                    <Link href={`/cvs/${cv.id}/edit`}>
                      <button className="hover:text-black">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </Link>
                    <button className="hover:text-black cursor-pointer" onClick={() => {
                      setCvIdToDelete(cv.id);
                      setOpenDeleteDialog(true);
                    }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                    <div className="relative">
                      <button
                        className="hover:text-black p-1 hover:bg-gray-100 rounded-sm cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownCvId(activeDropdownCvId === cv.id ? null : cv.id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                      
                      {activeDropdownCvId === cv.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdownCvId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20 font-sans text-sm text-left">
                            <button
                              onClick={() => {
                                setActiveDropdownCvId(null);
                                setSelectedCvForShare(cv);
                                setOpenShareModal(true);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 cursor-pointer border-none bg-transparent"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                              </svg>
                              <span>Chia sẻ online</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Share CV Modal */}
      <Dialog open={openShareModal} onOpenChange={setOpenShareModal}>
        <DialogContent className="sm:max-w-md font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Chia sẻ CV online</DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Thiết lập quyền truy cập công khai và lấy liên kết chia sẻ cho CV của bạn.
            </DialogDescription>
          </DialogHeader>
          {selectedCvForShare && (
            <div className="space-y-6 pt-4">
              {/* Toggle Public Option */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Bật chia sẻ công khai</h4>
                  <p className="text-xs text-gray-400 mt-1">Khi bật, bất kỳ ai có link đều có thể xem CV này mà không cần đăng nhập.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCvForShare.isPublic}
                    disabled={updatingShare}
                    onChange={(e) => handleTogglePublic(selectedCvForShare, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1D283D]"></div>
                </label>
              </div>

              {/* Show link if public */}
              {selectedCvForShare.isPublic && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Đường dẫn chia sẻ</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={typeof window !== "undefined" ? `${window.location.origin}/preview/${selectedCvForShare.id}` : ""}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/preview/${selectedCvForShare.id}`;
                        navigator.clipboard.writeText(link);
                        toast.success("Đã sao chép link chia sẻ!");
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#1D283D] hover:bg-[#2c3d5a] rounded-md transition-colors shadow-sm cursor-pointer"
                    >
                      Sao chép
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={() => cvIdToDelete && handleDeleteCv(cvIdToDelete)}
        onCancel={() => { setOpenDeleteDialog(false); setCvIdToDelete(null) }}
        title="Xóa CV?"
        description="Bạn có chắc chắn muốn xóa CV này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="default"
      />
    </main>
  );
}
