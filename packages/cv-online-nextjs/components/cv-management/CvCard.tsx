"use client";

import { Download, Edit, Eye, MoreVertical, Trash } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CvCardProps {
  id: string;
  title: string;
  lastEdited: string;
  thumbnailUrl: string;
  onEdit?: (id: string) => void;
  onPreview?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CvCard({
  id,
  title,
  lastEdited,
  thumbnailUrl,
  onEdit,
  onPreview,
  onDownload,
  onDelete,
}: CvCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="aspect-3/4 w-full bg-muted p-2">
        <img
          className="h-full w-full rounded-md object-cover object-top"
          src={thumbnailUrl}
          alt={`CV preview thumbnail for ${title}`}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{lastEdited}</p>
      </div>

      <div className="absolute right-3 top-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-background/50 text-foreground opacity-0 backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEdit?.(id)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPreview?.(id)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem trước
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDownload?.(id)}
              className="cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(id)}
              className="cursor-pointer text-red-500 hover:bg-destructive/10 hover:text-red-500 dark:text-red-400 dark:hover:text-red-400"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
