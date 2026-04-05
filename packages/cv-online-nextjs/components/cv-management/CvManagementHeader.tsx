import { Plus, User } from "lucide-react";
import React from "react";

export function CvManagementHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12v-2"></path>
          <path d="M12 7V5"></path>
          <path d="M12 17v-2"></path>
          <path d="m3 10 18-4"></path>
          <path d="m3 18 18-4"></path>
        </svg>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          CV Builder
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <a
          className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:block"
          href="#"
        >
          Tài khoản
        </a>

        <button className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Tạo CV Mới
        </button>

        <div
          className="h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-offset-2 ring-offset-background ring-border"
          data-alt="User avatar"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCV3Tn5amCTJYghg_7Hb9YXrQSQ2M6wU9obNcQSlyeTRYKxA5dzUavcGyNjuxrNs7ZRNeqkHBDt-MNZDWZcqKOERH64ccSNuk-ySonfFsahXaDqYDE8DhkynQaS9V35_0SqVNdNnoOYI7sprES91qooLY_upUXogX_4jeQv6QB9OQADpmeEh9JnChd9BxUZvtkLpJIHcuCQ7pxL49FCn-UpSOUWKUJmrAxFk_u7RqrrUMyEK2Xsh9ikCiVAaFeP4b-vSRc_chv1CX8")',
          }}
        />
      </div>
    </header>
  );
}
