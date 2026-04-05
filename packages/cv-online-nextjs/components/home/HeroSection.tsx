import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Tạo CV chuyên nghiệp, chinh phục nhà tuyển dụng
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Xây dựng CV miễn phí, nhanh chóng và nổi bật để mở ra cơ hội sự nghiệp
          mơ ước của bạn.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold shadow"
          >
            Tạo CV của bạn ngay
          </Button>
        </div>
        <div className="relative mx-auto mt-16 max-w-5xl rounded-xl border bg-card/50 p-2 shadow-2xl shadow-black/10 dark:shadow-white/5">
          <div
            className="aspect-video w-full rounded-lg bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASxUYgfVu7Sbxvc90uYU9D1mCGtw93BptUc7pq3qcYg6TtZPAWbPNsa7f_hJZMKqU89xmbz7ndh_8QhFugxWzT1GTjbEiQ1FfMQzsw0wt7UgKPVqiMhZUxxcAyHdxTjHmcCzz3j8QouGrw3rPzgQAjEzO61vofQ3S_jqUuLpAdFDISRKyMyQmbL-_0SRz0fjMqXRh7JhXRszVClruNUPfzSVnZ4nETMHTQUh399yJkjApmXdvV48-eQq9RQiMNgN7He8edTtX7qbs")',
            }}
          />
        </div>
      </div>
    </section>
  );
}
