import { FeatureCard } from "./FeatureCard";
import { FileText, Edit, Download } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Mẫu CV chuyên nghiệp",
      description:
        "Chọn từ hàng trăm mẫu thiết kế hiện đại, phù hợp với mọi ngành nghề.",
    },
    {
      icon: <Edit className="h-6 w-6" />,
      title: "Tùy chỉnh dễ dàng",
      description:
        "Thay đổi màu sắc, phông chữ và bố cục chỉ với vài cú nhấp chuột.",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Tải xuống PDF miễn phí",
      description:
        "Lưu và chia sẻ CV của bạn dưới dạng PDF chất lượng cao một cách nhanh chóng.",
    },
  ];

  return (
    <section className="bg-muted/40 py-20 sm:py-32">
      <div className="container mx-auto flex flex-col items-center gap-10 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Những tính năng nổi bật giúp bạn thành công
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Chúng tôi cung cấp mọi công cụ bạn cần để tạo ra một bản CV ấn tượng
            và chuyên nghiệp.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
