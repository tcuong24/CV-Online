"use client";
import { Download } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DownloadPanel() {
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  return (
    <div className="flex flex-col gap-6 p-6 bg-card rounded-lg border">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Tải xuống</h2>
        <p className="text-muted-foreground text-sm">
          Chọn định dạng và tùy chọn của bạn.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Định dạng tệp
          </label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                selectedFormat === "pdf"
                  ? "border border-primary text-primary shadow-sm hover:bg-primary/5"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setSelectedFormat("pdf")}
            >
              PDF
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                selectedFormat === "docx"
                  ? "border border-primary text-primary shadow-sm hover:bg-primary/5"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setSelectedFormat("docx")}
            >
              DOCX
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Kích thước trang
          </label>
          <Select defaultValue="a4">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Lề
          </label>
          <Select defaultValue="normal">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Bình thường</SelectItem>
              <SelectItem value="narrow">Hẹp</SelectItem>
              <SelectItem value="wide">Rộng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2 gap-2">
        <Download />
        Tải xuống CV
      </button>
    </div>
  );
}
