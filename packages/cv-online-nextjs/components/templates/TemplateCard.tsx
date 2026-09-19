"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TemplateCardProps {
  id?: string;
  image: string;
  title: string;
  description: string;
  alt: string;
  isPremium?: boolean;
  accentColor?: string;
  isEditable?: boolean;
  handleSelectTemplate?: () => void;
  animationIndex?: number;
}

export function TemplateCard({
  id,
  image,
  title,
  description,
  alt,
  isEditable = false,
  handleSelectTemplate,
  animationIndex = 0,
}: TemplateCardProps) {
  const router = useRouter();

  const handlePreview = () => {
    if (isEditable) {
      router.push(`/preview?templateId=${id}`);
    } else {
      console.log("Preview chưa được implement cho template này");
    }
  };
  return (
    <article className="template-library-card group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm" style={{ "--template-index": animationIndex, viewTransitionName: `template-${id}` } as React.CSSProperties}>
      <div className="aspect-3/4 overflow-hidden">
        <img
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          alt={alt}
          src={image}
        />
      </div>

      <div className="template-card-overlay absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="template-card-actions pointer-events-none absolute inset-x-0 bottom-24 flex translate-y-2 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <Button variant="secondary" size="default" onClick={handlePreview}>
          Xem trước
        </Button>
        <Button size="default" onClick={handleSelectTemplate}>
          {isEditable ? "Tạo CV" : "Chọn Mẫu"}
        </Button>
      </div>

      <div className="p-4 border-t">
        <h3 className="font-semibold tracking-tight text-base">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </article>
  );
}
