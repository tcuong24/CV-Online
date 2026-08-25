import Link from "next/link";
import Header from "@/components/layout/header";
import { EditorDemo } from "@/components/home/EditorDemo";
import { FeaturedTemplates } from "@/components/home/FeaturedTemplates";
import { HomeStorySections } from "@/components/home/HomeStorySections";

interface Template {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  category: string;
  layoutType: string;
}

async function getFeaturedTemplates(): Promise<Template[]> {
  const apiUrl =
    process.env.NEST_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:9999/api";
  try {
    const response = await fetch(
      `${apiUrl}/templates?page=1&limit=3&sortBy=popularityScore&sortOrder=desc`,
      { next: { revalidate: 60 } },
    );
    if (!response.ok)
      throw new Error(`Templates API returned ${response.status}`);
    const data = (await response.json()) as { items: Template[] } | Template[];
    return Array.isArray(data) ? data.slice(0, 3) : data.items;
  } catch (error) {
    console.error("Không thể tải các mẫu CV nổi bật:", error);
    return [];
  }
}

export default async function Home() {
  const templates = await getFeaturedTemplates();
  const buttonClass =
    "border border-foreground px-8 py-3 font-label uppercase tracking-widest text-[0.75rem] transition-colors hover:bg-foreground hover:text-background";

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <Header />
      <main className="pt-32">
        <section className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 pb-20 md:px-12 md:pb-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="text-center lg:text-left">
            <p className="mb-6 font-label text-[0.65rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              CV chuyên nghiệp, theo cách của bạn
            </p>
            <h1 className="mb-8 font-headline text-5xl font-black leading-[1.05] tracking-tighter md:text-7xl">
              Sự nghiệp của bạn,
              <br />
              được viết bằng sự tinh tế.
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:max-w-xl">
              Tạo một bản CV chuyên nghiệp, rõ ràng và phản ánh đúng năng lực
              của bạn. Chỉnh sửa trực quan, sắp xếp linh hoạt và thấy kết quả
              ngay tức thì.
            </p>
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/templates"
                className={`w-full px-12 text-center md:w-auto ${buttonClass}`}
              >
                Tạo CV của bạn
              </Link>
              <Link
                href="/templates"
                className="border-b border-foreground pb-1 font-label text-[0.75rem] uppercase tracking-widest hover:border-transparent"
              >
                Xem các mẫu CV
              </Link>
            </div>
          </div>
          <EditorDemo />
        </section>

        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <hr className="border-foreground/10" />
        </div>

        <FeaturedTemplates templates={templates} />

        <HomeStorySections />
      </main>

      <footer className="w-full border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-12 px-12 py-12 md:flex-row md:items-center">
          <div className="space-y-4">
            <div className="font-headline text-xl font-black">CV Online</div>
            <p className="max-w-xs text-[0.75rem] text-muted-foreground">
              Công cụ tạo CV chuyên nghiệp, đơn giản và trực quan.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-16"
            aria-label="Liên kết cuối trang"
          >
            <div className="flex flex-col space-y-2">
              <span className="mb-2 text-[0.75rem] font-bold uppercase">
                Sản phẩm
              </span>
              <Link
                className="text-[0.75rem] text-muted-foreground hover:text-foreground"
                href="/templates"
              >
                Mẫu CV
              </Link>
              <Link
                className="text-[0.75rem] text-muted-foreground hover:text-foreground"
                href="/about"
              >
                Giới thiệu
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="mb-2 text-[0.75rem] font-bold uppercase">
                Tài khoản
              </span>
              <Link
                className="text-[0.75rem] text-muted-foreground hover:text-foreground"
                href="/auth"
              >
                Đăng nhập
              </Link>
              <Link
                className="text-[0.75rem] text-muted-foreground hover:text-foreground"
                href="/dashboard"
              >
                Quản lý CV
              </Link>
            </div>
          </nav>
        </div>
        <div className="mx-auto w-full max-w-[1440px] px-12 pb-12">
          <p className="text-[0.65rem] uppercase tracking-[0.05em] text-muted-foreground">
            © {new Date().getFullYear()} CV Online. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
