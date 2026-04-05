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
}

export function TemplateCard({
  id,
  image,
  title,
  description,
  alt,
  isEditable = false,
  handleSelectTemplate,
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
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="aspect-3/4 overflow-hidden">
        <img
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          alt={alt}
          src={image}
        />
      </div>

      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
    </div>
  );
}
