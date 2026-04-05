import { Pagination } from "@/components/templates/Pagination";
import { TemplatesGrid } from "@/components/templates/TemplateGrid";
import { TemplatesHeader } from "@/components/templates/templateHeader";

export default function TemplatesPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <TemplatesHeader />

      <main className="flex-1">
        <div className="container max-w-7xl py-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Khám phá thư viện mẫu CV
                </h1>
                <p className="text-muted-foreground mt-2">
                  Tất cả các mẫu của chúng tôi đều được thiết kế bởi chuyên gia.
                  Hãy chọn một mẫu ưng ý và tạo ấn tượng với nhà tuyển dụng.
                </p>
              </div>

              <TemplatesGrid />
              <Pagination />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
