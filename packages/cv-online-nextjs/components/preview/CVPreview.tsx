"use client";

import React from "react";
import { EditableCV } from "@/types/cv";
import EditableTemplate from "@/templates/editable";

interface CVPreviewProps {
  cv: EditableCV;
  showControls?: boolean;
}

export function CVPreview({ cv, showControls = false }: CVPreviewProps) {
  return (
    <div className="flex h-full">
      {/* Left Side - CV Information & Controls */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin CV
            </h2>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">📋</span>
                  <span className="text-sm font-medium text-blue-900">
                    Template
                  </span>
                </div>
                <p className="text-xs text-blue-700">Editable Template v1.0</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm font-medium text-green-900">
                    Trạng thái
                  </span>
                </div>
                <p className="text-xs text-green-700">Sẵn sàng để xuất bản</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600">📊</span>
                  <span className="text-sm font-medium text-gray-900">
                    Thống kê
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Tên: {cv.userProfile.full_name}</div>
                  <div>Vị trí: {cv.title}</div>
                  <div>Màu: {cv.color}</div>
                  <div>Font: {cv.font}</div>
                </div>
              </div>
            </div>
          </div>

          {showControls && (
            <div className="border-t pt-4 space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                📄 Xuất PDF
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                🔗 Chia sẻ CV
              </button>
              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                💾 Tải xuống
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium">
                ✏️ Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - CV Preview */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Xem trước CV của bạn
            </h2>
            <p className="text-gray-600 text-sm">
              Đây là cách CV của bạn sẽ hiển thị khi được chia sẻ hoặc tải xuống
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
              <EditableTemplate cv={cv} isPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
