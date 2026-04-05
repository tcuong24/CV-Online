import { TemplateCard } from "./TemplateCard";

export function TemplatesSection() {
  const templates = [
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDC-vzfieal0paa_4dLDe2jS25Uj7vqBFF_QcTRmnzL5rtdvvKGftKLAjt4RgTQjq6GuOdc077Zk8CysCi7zJhTra9o8m_ulIDx3WrpxpXM0h47LdY_KGhi7q6u3gvNM4CReT3nqigxxap-GVoxZCHsF6NffFXIlH9aGx7wjGoZDOOAKIMIMUmiLJaaHrI-6L6FKsv2lmNIAB8H3KzbyXHcWbl35jzntoD-PLjrs1ThPHWCrkBwo8OyawrB01OZDhmqKrl1v9SbFWI",
      title: "Thiết kế Tối giản",
      description: "Phù hợp cho các vị trí yêu cầu sự rõ ràng.",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC63i1fEPwmmZB7xz19TAyYDAURG7Q0yhpFSvZ6N64VhK54mhftmBhpZicfXAttdD45Ih3aNM7FUVtpVEjgDYq1ZiuWYEXSuCmUHXrHcw4gtiXIBxfJtw2K6dOt1rFDGXTKIvgACl8Lxf9i5AJXOaazBpPYg1RIhEUQyGfNJWvyY1NsB5BYfqMantMEFBoApXPaGdLxXo-Z_TN6Jx6ZkjUu5TAG1OZNpD3QIfrCEVemMR1-BaEFm9qQJrtKUjJlt7RVwLfRssBYlDI",
      title: "Thiết kế Sáng tạo",
      description: "Lý tưởng cho các ngành nghệ thuật và thiết kế.",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9UnctYQVT6VXdcnNZcFczuGM-LKAGomwdV8ewElZK1BZgwyQDfOIEkKxrQnr-vokDJg5MAQi4JkV1i_Vwu3-LfD7sXJtoh4bAYL6eRC746a_pGbeMz552kFRJZKq_zDOvh45YLtGbUtckT5dlsxM9EZl2P3zvuDTn5k20TdXyii8W1UOf29EuzhjfDQn7M8A9qmjFzyfSaBtcf4WGfVG1d6lZxpieEwKu6gB0duFBezp2ytdO8QRJOKpAv0I5kfq_StV6Zn5vaA",
      title: "Thiết kế Chuyên nghiệp",
      description: "Dành cho môi trường công ty và tài chính.",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAzLMN2ynEsqF8l_H8_brbC1I8NyDG3DLL8G-zC0B_KHy-3V837cOOmKpr21QugmDaNw7I36x7N2kaNcbUrKymQug9dMvcizyKn4iP-ALS4R4rEqSODdyfcOVqO3sbJLT0p7sMXE0nz7BbublzuJkRKALE5izF1d5tWkwOCcADrmO9oEY_Nc2aQdWVCDJLPBGDFV1YdlrCF3wbRlr03bzLSX8dwOTc3wRWlLmLUqFfdYhR-iDIsyPhbjTiDlfNaIJgyJoJhuqjBf-o",
      title: "Thiết kế Hiện đại",
      description: "Tạo ấn tượng mạnh mẽ cho các công ty startup.",
    },
  ];

  return (
    <section className="py-20 sm:py-32">
      <h2 className="px-4 pb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Gây ấn tượng với các mẫu CV chuyên nghiệp
      </h2>
      <div className="relative">
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch gap-6 px-4 sm:px-8">
            {templates.map((template, index) => (
              <TemplateCard key={index} {...template} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
