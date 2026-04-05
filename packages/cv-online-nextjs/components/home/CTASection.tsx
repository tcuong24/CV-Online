import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="rounded-lg bg-secondary p-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground">
            Sẵn sàng để tạo ra một CV ấn tượng?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Bắt đầu sự nghiệp của bạn ngay hôm nay. Tham gia cùng hàng ngàn
            người dùng đã tìm được công việc mơ ước với sự trợ giúp của chúng
            tôi.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold shadow"
            >
              Tạo CV miễn phí
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
