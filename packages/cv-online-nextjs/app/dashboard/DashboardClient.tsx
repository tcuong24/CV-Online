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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplatesGrid } from "@/components/templates/TemplateGrid";
export default function DashboardClient() {
  const { data: session } = useSession();
  const [cvs, setCvs] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cvIdToDelete, setCvIdToDelete] = useState<string | null>(null);
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
                    <p className="text-xs text-gray-500 mt-1">
                      Sửa đổi lúc {new Date(cv.updatedAt || cv.createdAt).toLocaleDateString('vi-VN')}
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
                    <button className="hover:text-black">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
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
