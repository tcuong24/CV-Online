"use client";

import React, { useState } from "react";

interface AuthToggleProps {
  onToggle: (mode: "login" | "register") => void;
}

export function AuthToggle({ onToggle }: AuthToggleProps) {
  const [activeMode, setActiveMode] = useState<"login" | "register">("login");

  const handleToggle = (mode: "login" | "register") => {
    setActiveMode(mode);
    onToggle(mode);
  };

  return (
    <div className="flex w-full">
      <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal ${
          activeMode === "login"
            ? "bg-white dark:bg-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#111418] dark:text-white"
            : "text-[#617589] dark:text-gray-400"
        }`}>
          <span className="truncate">Đăng nhập</span>
          <input
            checked={activeMode === "login"}
            className="invisible w-0"
            name="auth-toggle"
            type="radio"
            value="Đăng nhập"
            onChange={() => handleToggle("login")}
          />
        </label>

        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal ${
          activeMode === "register"
            ? "bg-white dark:bg-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#111418] dark:text-white"
            : "text-[#617589] dark:text-gray-400"
        }`}>
          <span className="truncate">Đăng ký</span>
          <input
            checked={activeMode === "register"}
            className="invisible w-0"
            name="auth-toggle"
            type="radio"
            value="Đăng ký"
            onChange={() => handleToggle("register")}
          />
        </label>
      </div>
    </div>
  );
}