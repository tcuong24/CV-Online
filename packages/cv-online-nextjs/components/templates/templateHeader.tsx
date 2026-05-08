"use client"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DropdownUser from "../user/DropdownUser";

export function TemplatesHeader() {
  const { data: session } = useSession();
  const btnEditorial =
    "border border-foreground px-8 py-3 font-label uppercase tracking-widest text-[0.75rem] transition-colors duration-100 hover:bg-foreground hover:text-background";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 w-full items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href={session?.user ? "/dashboard" : "/"}>
            <div className="font-headline text-2xl font-black tracking-tighter text-foreground">
              CVision
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/dashboard"
            >
              Quản lý CV
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/about"
            >
              Thông tin
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">

          {session?.user ? (
            <>
              <DropdownUser />
            </>
          ) : (
            <Button size="default">
              <Link href="/auth">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
