import { Plus } from "lucide-react";
import React from "react";

interface CreateCvCardProps {
  onClick?: () => void;
}

export function CreateCvCard({ onClick }: CreateCvCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex aspect-3/4 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-transparent p-6 text-center transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Plus className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-foreground">Tạo CV mới</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Bắt đầu từ một mẫu có sẵn
      </p>
    </button>
  );
}
