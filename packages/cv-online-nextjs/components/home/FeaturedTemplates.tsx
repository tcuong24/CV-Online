"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

interface FeaturedTemplate {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  category: string;
  layoutType: string;
}

export function FeaturedTemplates() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [templates, setTemplates] = useState<FeaturedTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<FeaturedTemplate[] | { items: FeaturedTemplate[] }>("/templates")
      .then(({ data }) => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : data.items;
        setTemplates(items.slice(0, 3));
      })
      .catch((error) => {
        console.error("Không thể tải các mẫu CV nổi bật:", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`featured-showcase mx-auto max-w-[1440px] px-6 py-24 md:px-12 ${visible ? "is-visible" : ""}`}>
      <div className="featured-showcase__heading mb-16">
        <span className="featured-showcase__rule mb-4 block h-px w-12 bg-foreground" />
        <h2 className="font-headline text-3xl font-black italic tracking-tight md:text-5xl">Mẫu CV nổi bật</h2>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Đang tải mẫu CV...</div>
      ) : templates.length ? (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {templates.map((template, index) => (
            <article key={template.id} className="featured-card group" style={{ "--card-index": index } as React.CSSProperties}>
              <Link href="/templates" className="block">
                <div className="featured-card__reveal">
                  <div className="featured-card__image relative aspect-[3/4] overflow-hidden border border-border bg-card p-1">
                    <Image
                      alt={`Mẫu CV ${template.name}`}
                      className="object-cover grayscale transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.025] group-hover:grayscale-0"
                      src={template.thumbnailUrl || "/templates/minimal-bw-thumb.png"}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                </div>
                <div className="featured-card__caption pt-6">
                  <h3 className="featured-card__title mb-2 w-fit font-headline text-xl">{template.name}</h3>
                  <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{template.category} • {template.layoutType}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : <div className="py-12 text-center text-muted-foreground">Chưa có mẫu CV nào được công bố.</div>}
    </section>
  );
}
