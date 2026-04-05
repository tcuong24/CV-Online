import React from "react";
import { CvManagementHeader } from "@/components/cv-management/CvManagementHeader";
import { CvSearchBar } from "@/components/cv-management/CvSearchBar";
import { CvSortDropdown } from "@/components/cv-management/CvSortDropdown";
import { CvGrid } from "@/components/cv-management/CvGrid";

export default function CvManagementPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <CvManagementHeader />

      <main className="flex w-full flex-1 flex-col items-center px-4 py-8 sm:px-6 md:px-8">
        <div className="w-full max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Quản lý CV
              </h1>
              <p className="text-muted-foreground">
                Xem, chỉnh sửa và quản lý tất cả các CV đã tạo của bạn.
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <CvSearchBar />
            <CvSortDropdown />
          </div>

          <CvGrid />
        </div>
      </main>
    </div>
  );
}
