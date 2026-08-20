import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";

interface Template {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  category: string;
  layoutType: string;
}

const features = [
  ["Tạo CV trực quan", "Chỉnh sửa nội dung và theo dõi ngay kết quả trên mẫu CV bạn đã chọn.", "/templates/modern-blue.png"],
  ["Mẫu CV chuyên nghiệp", "Lựa chọn bố cục phù hợp với ngành nghề, kinh nghiệm và phong cách của bạn.", "/templates/creative-pro.png"],
  ["Sẵn sàng xuất bản", "Hoàn thiện hồ sơ với bố cục rõ ràng và tải xuống để gửi đến nhà tuyển dụng.", "/templates/ats-optimized.png"],
] as const;

async function getFeaturedTemplates(): Promise<Template[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9999/api";
  try {
    const response = await fetch(
      `${apiUrl}/templates?page=1&limit=3&sortBy=popularityScore&sortOrder=desc`,
      { next: { revalidate: 60 } },
    );
    if (!response.ok) throw new Error(`Templates API returned ${response.status}`);
    const data = (await response.json()) as { items: Template[] } | Template[];
    return Array.isArray(data) ? data.slice(0, 3) : data.items;
  } catch (error) {
    console.error("Không thể tải các mẫu CV nổi bật:", error);
    return [];
  }
}

export default async function Home() {
  const templates = await getFeaturedTemplates();
  const buttonClass = "border border-foreground px-8 py-3 font-label uppercase tracking-widest text-[0.75rem] transition-colors hover:bg-foreground hover:text-background";

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <Header />
      <main className="pt-32">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center md:px-12 md:py-48">
          <h1 className="mb-8 font-headline text-5xl font-black leading-tight tracking-tighter md:text-8xl">
            Sự nghiệp của bạn,<br />được viết bằng sự tinh tế.
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Tạo một bản CV chuyên nghiệp, rõ ràng và phản ánh đúng năng lực của bạn. Bắt đầu nhanh chóng với những mẫu được thiết kế chỉn chu.
          </p>
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            <Link href="/templates" className={`w-full px-12 text-center md:w-auto ${buttonClass}`}>Tạo CV của bạn</Link>
            <Link href="/templates" className="border-b border-foreground pb-1 font-label text-[0.75rem] uppercase tracking-widest hover:border-transparent">Xem các mẫu CV</Link>
          </div>
          <hr className="mt-24 border-foreground/10" />
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12">
          <div className="mb-16">
            <span className="mb-4 block h-px w-12 bg-foreground" />
            <h2 className="font-headline text-3xl font-black italic tracking-tight md:text-5xl">Mẫu CV nổi bật</h2>
          </div>
          {templates.length ? (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {templates.map((template) => (
                <article key={template.id} className="group">
                  <Link href="/templates">
                    <div className="relative mb-6 aspect-[3/4] overflow-hidden border border-border bg-card p-1">
                      <Image alt={`Mẫu CV ${template.name}`} className="object-cover grayscale transition-all group-hover:grayscale-0" src={template.thumbnailUrl || "/templates/minimal-bw-thumb.png"} fill sizes="(min-width: 768px) 33vw, 100vw" />
                    </div>
                    <h3 className="mb-2 font-headline text-xl">{template.name}</h3>
                    <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{template.category} • {template.layoutType}</p>
                  </Link>
                </article>
              ))}
            </div>
          ) : <div className="py-12 text-center text-muted-foreground">Chưa có mẫu CV nào được công bố.</div>}
        </section>

        <section className="bg-muted/30 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-[1440px] space-y-32">
            {features.map(([title, description, image], index) => (
              <article key={title} className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
                <div className={`border-l border-foreground pl-8 ${index % 2 ? "md:order-2" : ""}`}>
                  <h3 className="mb-6 font-headline text-3xl">{title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <div className={`relative aspect-video overflow-hidden border border-border bg-card ${index % 2 ? "md:order-1" : ""}`}>
                  <Image src={image} alt={title} className="object-cover object-top grayscale" fill sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] border-b border-foreground/10 px-6 py-32 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              ["01", "Chọn mẫu", "Khám phá thư viện và chọn mẫu phù hợp với mục tiêu nghề nghiệp."],
              ["02", "Nhập nội dung", "Điền thông tin, kinh nghiệm và kỹ năng trong giao diện trực quan."],
              ["03", "Hoàn thiện CV", "Kiểm tra bố cục, hoàn thiện hồ sơ và tải CV của bạn."],
            ].map(([number, title, description], index) => (
              <article key={number} className={`p-12 ${index < 2 ? "border-b border-foreground/20 md:border-b-0 md:border-r" : ""}`}>
                <span className="mb-8 block font-headline text-6xl font-black opacity-20">{number}</span>
                <h3 className="mb-4 font-headline text-2xl">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-foreground px-6 py-32 text-center text-background md:px-12">
          <h2 className="mb-12 font-headline text-4xl font-black tracking-tight md:text-6xl">Sẵn sàng tạo CV của riêng bạn?</h2>
          <Link href="/templates" className="inline-block border border-background px-16 py-4 font-label text-[0.8rem] uppercase tracking-widest hover:bg-background hover:text-foreground">Bắt đầu tạo CV</Link>
        </section>
      </main>

      <footer className="w-full border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-12 px-12 py-12 md:flex-row md:items-center">
          <div className="space-y-4">
            <div className="font-headline text-xl font-black">CV Online</div>
            <p className="max-w-xs text-[0.75rem] text-muted-foreground">Công cụ tạo CV chuyên nghiệp, đơn giản và trực quan.</p>
          </div>
          <nav className="grid grid-cols-2 gap-16" aria-label="Liên kết cuối trang">
            <div className="flex flex-col space-y-2">
              <span className="mb-2 text-[0.75rem] font-bold uppercase">Sản phẩm</span>
              <Link className="text-[0.75rem] text-muted-foreground hover:text-foreground" href="/templates">Mẫu CV</Link>
              <Link className="text-[0.75rem] text-muted-foreground hover:text-foreground" href="/about">Giới thiệu</Link>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="mb-2 text-[0.75rem] font-bold uppercase">Tài khoản</span>
              <Link className="text-[0.75rem] text-muted-foreground hover:text-foreground" href="/auth">Đăng nhập</Link>
              <Link className="text-[0.75rem] text-muted-foreground hover:text-foreground" href="/dashboard">Quản lý CV</Link>
            </div>
          </nav>
        </div>
        <div className="mx-auto w-full max-w-[1440px] px-12 pb-12">
          <p className="text-[0.65rem] uppercase tracking-[0.05em] text-muted-foreground">© {new Date().getFullYear()} CV Online. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
