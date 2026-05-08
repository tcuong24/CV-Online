import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

import DropdownUser from "../user/DropdownUser";
import { Menu } from "lucide-react";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const btnEditorial =
    "border border-foreground px-8 py-3 font-label uppercase tracking-widest text-[0.75rem] transition-colors duration-100 hover:bg-foreground hover:text-background";
  return (
    <header className="flex items-center justify-between whitespace-nowrap ">
      <nav className="fixed top-0 w-full border-b border-foreground/20 bg-background z-50">
        <div className="flex justify-between items-center px-6 md:px-12 py-3 w-full container ">
          <Link href={session?.user ? "/dashboard" : "/"} className="font-headline text-2xl font-black tracking-tighter text-foreground">
            CVision
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12 tracking-tight text-base">
            <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/templates">
              Mẫu CV
            </Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/dashboard">
              Quản lý CV
            </Link>
            {/* <Link className="text-muted-foreground hover:text-foreground transition-colors" href="#">
              Giá
            </Link> */}
            <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/about">
              Giới thiệu
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="md:hidden">
              <Menu size={24} />
            </button>
            {session?.user ? <DropdownUser /> : <div className="flex items-center gap-2">
              <Button variant="secondary" size="default">
                <Link href="/auth">Đăng nhập</Link>
              </Button>
              <Button size="default">
                <Link href="/auth">Đăng ký</Link>
              </Button>
            </div>}
          </div>
        </div>
      </nav>
      

    </header>
  );
}
