import { Bell, BookText } from "lucide-react";
import React from "react";

export function PreviewHeader() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-10 py-3 bg-card sticky top-0 z-50 h-16">
      <div className="flex items-center gap-4">
        <BookText />
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          CV Builder
        </h2>
      </div>

      <div className="flex flex-1 justify-end gap-3 md:gap-4 items-center">
        <a
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          href="#"
        >
          Trở lại Chỉnh sửa
        </a>

        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <Bell />
        </button>

        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User avatar image"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvg4ziG01-drmr9J_xRjXLiw7-A5IsgcKQ2-mvfcF432uE3Neklq7HppWMzxNGuOi4kCjAt3S9z9SgzAlSUyIJgMPTDSEdihCHZv7jn2hXCHMbjpmy8lrK1thfnVOZJ9QfY5vAKdkMYORIy_UlnapwDr-dMkinD1oBrXRrXIsDfZ5s7ZiVVHeold4RvyoQ9vie0mSsgLl32wM124ARI7fpNJR2BQmf0Bb2CMA0M6aq3kG5FeAk5SgiFlpMo4-S-Bp13XMMwOFh3IY")',
          }}
        />
      </div>
    </header>
  );
}
