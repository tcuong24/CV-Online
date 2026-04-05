import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

import DropdownUser from "../user/DropdownUser";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex py-2 items-center justify-between whitespace-nowrap px-4 md:px-6">
      <div className="flex items-center gap-3 text-primary">
        <div className="size-6 text-foreground">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold">CVBuilder</h2>
      </div>

      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="/templates"
        >
          Mẫu CV
        </Link>
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="/editor"
        >
          Chỉnh sửa CV
        </Link>
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="/preview"
        >
          Xem trước
        </Link>
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="/cv-management"
        >
          Quản lý CV
        </Link>
      </nav>
      {session?.user ? <DropdownUser /> : <div className="flex items-center gap-2">
        <Button variant="secondary" size="default">
          <Link href="/auth">Đăng nhập</Link>
        </Button>
        <Button size="default">
          <Link href="/auth">Đăng ký</Link>
        </Button>
      </div>}

    </header>
  );
}
