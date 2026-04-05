"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sortOptions = ["Ngày tạo mới nhất", "Ngày chỉnh sửa cuối", "Tên A-Z"];

export function CvSortDropdown() {
  const [selectedSort, setSelectedSort] = useState("Ngày tạo mới nhất");

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Sắp xếp theo
          <ChevronDown className="ml-2 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => setSelectedSort(option)}
              className="cursor-pointer"
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
