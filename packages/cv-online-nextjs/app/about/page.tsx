import Header from "@/components/layout/header";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-32 pb-12">
        <section className="mb-16" data-purpose="hero-section">
          <p className="text-lg font-normal mb-1">Về chúng tôi</p>
          <h1 className="text-6xl font-headline italic mb-8 text-foreground">Nền tảng tạo CV đột phá với công nghệ AI.</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            CVision là công cụ giúp bạn xây dựng hồ sơ năng lực chuyên nghiệp một cách nhanh chóng và tối ưu nhất. Với sự kết hợp của trí tuệ nhân tạo, chúng tôi không chỉ giúp bạn có một thiết kế đẹp mắt mà còn đảm bảo nội dung của bạn đáp ứng tiêu chuẩn khắt khe của các hệ thống tuyển dụng hiện đại (ATS).
          </p>
          <Link href="/templates">
            <button className="flex items-center space-x-2 border border-[#1e3a3a] text-[#1e3a3a] px-5 py-2.5 rounded-sm hover:bg-gray-200 transition-colors text-sm font-medium">
              <span>Khám phá kho mẫu CV</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" data-purpose="features-grid">
          <div className="border border-gray-200 bg-white p-8 rounded-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-[#1e3a3a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.433 4.433 0 0 0 2.708-2.455c.129-.347.24-.705.334-1.072M7.224 8.36a4.49 4.49 0 0 0-4.306 1.757 4.433 4.433 0 0 0 2.455-2.708c.347-.129.705-.24 1.072-.334" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Phân tích CV cũ bằng AI</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Tiết kiệm thời gian bằng cách tải lên CV PDF cũ của bạn. Trợ lý AI sẽ tự động đọc, trích xuất và điền thông tin vào mẫu mới ngay lập tức.</p>
          </div>

          <div className="border border-gray-200 bg-white p-8 rounded-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-[#1e3a3a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Cải thiện văn phong</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Không biết viết sao cho hay? AI của CVision sẽ giúp bạn viết lại các kinh nghiệm làm việc theo ngôn ngữ chuyên nghiệp và thu hút nhà tuyển dụng hơn.</p>
          </div>

          <div className="border border-gray-200 bg-white p-8 rounded-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-[#1e3a3a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Chuẩn ATS & PDF nét cao</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Mọi mẫu CV đều được thiết kế thân thiện với hệ thống quét hồ sơ (ATS). File PDF tải về đảm bảo độ phân giải cao và có thể đọc được văn bản.</p>
          </div>
        </section>

        <section className="bg-gray-50 p-12 rounded-sm border border-gray-200">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium mb-4 text-foreground">Sứ mệnh của chúng tôi</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chúng tôi tin rằng mọi người đều xứng đáng có một cơ hội công bằng để thể hiện giá trị của bản thân. Việc thiết kế CV không nên là một trở ngại cản bước sự nghiệp của bạn.
              Mục tiêu của CVision là thu hẹp khoảng cách giữa ứng viên và nhà tuyển dụng bằng cách cung cấp những công cụ hỗ trợ tự động hóa thông minh nhất.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold">
                TVC
              </div>
              <div>
                <p className="font-semibold text-gray-900">Trần Văn Cường</p>
                <p className="text-sm text-gray-500">Phát triển dự án CVision</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
