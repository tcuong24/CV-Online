"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  ["Tạo CV trực quan", "Chỉnh sửa nội dung và theo dõi ngay kết quả trên mẫu CV bạn đã chọn.", "/templates/modern-blue.png"],
  ["Mẫu CV chuyên nghiệp", "Lựa chọn bố cục phù hợp với ngành nghề, kinh nghiệm và phong cách của bạn.", "/templates/creative-pro.png"],
  ["Sẵn sàng xuất bản", "Hoàn thiện hồ sơ với bố cục rõ ràng và tải xuống để gửi đến nhà tuyển dụng.", "/templates/ats-optimized.png"],
] as const;

const steps = [
  ["01", "Chọn mẫu", "Khám phá thư viện và chọn mẫu phù hợp với mục tiêu nghề nghiệp."],
  ["02", "Nhập nội dung", "Điền thông tin, kinh nghiệm và kỹ năng trong giao diện trực quan."],
  ["03", "Hoàn thiện CV", "Kiểm tra bố cục, hoàn thiện hồ sơ và tải CV của bạn."],
] as const;

function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function HomeStorySections() {
  const featuresReveal = useReveal<HTMLDivElement>(0.12);
  const stepsReveal = useReveal<HTMLElement>(0.2);
  const ctaReveal = useReveal<HTMLElement>(0.3);

  return (
    <>
      <section className="home-features bg-muted/30 px-6 py-24 md:px-12">
        <div ref={featuresReveal.ref} className={`mx-auto max-w-[1440px] space-y-32 ${featuresReveal.visible ? "is-visible" : ""}`}>
          {features.map(([title, description, image], index) => (
            <article key={title} className={`home-feature grid grid-cols-1 items-center gap-16 md:grid-cols-2 ${index % 2 ? "home-feature--reverse" : ""}`}>
              <div className={`home-feature__copy relative pl-8 ${index % 2 ? "md:order-2" : ""}`}>
                <span className="home-feature__line" aria-hidden="true" />
                <h3 className="mb-6 font-headline text-3xl">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <div className={`home-feature__visual ${index % 2 ? "md:order-1" : ""}`}>
                <div className="home-feature__mask relative aspect-video overflow-hidden border border-border bg-card">
                  <Image src={image} alt={title} className="home-feature__image object-cover object-top grayscale" fill sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section ref={stepsReveal.ref} className={`home-steps mx-auto max-w-[1440px] border-b border-foreground/10 px-6 py-32 md:px-12 ${stepsReveal.visible ? "is-visible" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map(([number, title, description], index) => (
            <article key={number} className={`home-step group p-12 ${index < 2 ? "border-b border-foreground/20 md:border-b-0 md:border-r" : ""}`} style={{ "--step-index": index } as React.CSSProperties}>
              <span className="home-step__number mb-8 block font-headline text-6xl font-black opacity-20">{number}</span>
              <div className="home-step__body">
                <h3 className="mb-4 font-headline text-2xl transition-transform duration-300 group-hover:translate-x-1">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section ref={ctaReveal.ref} className={`home-cta relative overflow-hidden px-6 py-32 text-center md:px-12 ${ctaReveal.visible ? "is-visible" : ""}`}>
        <span className="home-cta__backdrop" aria-hidden="true" />
        <div className="relative z-10">
          <h2 className="home-cta__title mb-12 font-headline text-4xl font-black tracking-tight text-background md:text-6xl">Sẵn sàng tạo CV của riêng bạn?</h2>
          <Link href="/templates" className="home-cta__button group relative inline-flex items-center gap-4 overflow-hidden border border-background px-12 py-4 font-label text-[0.8rem] uppercase tracking-widest text-background">
            <span className="home-cta__button-fill" aria-hidden="true" />
            <span className="relative z-10">Bắt đầu tạo CV</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
