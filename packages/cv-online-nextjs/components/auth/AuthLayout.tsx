import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}