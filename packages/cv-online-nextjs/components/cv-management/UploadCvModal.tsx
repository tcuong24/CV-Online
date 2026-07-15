"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export function UploadCvModal() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Chỉ hỗ trợ file PDF!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File tải lên không được vượt quá 5MB!");
      return;
    }

    try {
      setIsUploading(true);
      toast.loading("Đang tải file lên...", { id: "upload-cv" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(".pdf", ""));

      await axiosInstance.post("/cvs/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Tải CV lên thành công!", { id: "upload-cv" });
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tải CV lên.", { id: "upload-cv" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
      >
        <Upload className="mr-2 h-4 w-4" />
        Tải CV PDF
      </button>

      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
}
