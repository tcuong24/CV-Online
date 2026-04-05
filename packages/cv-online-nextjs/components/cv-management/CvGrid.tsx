"use client";
import { CvCard } from "./CvCard";
import { CreateCvCard } from "./CreateCvCard";

// Mock data for CVs
const mockCvs = [
  {
    id: "1",
    title: "CV Lập trình viên Senior",
    lastEdited: "Chỉnh sửa: 2 ngày trước",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxlqUl9y2AibQF01MtgQjnSgGo1XcAGhT0Yt8XE0pvvZYDcQAz6lvNVrJ4La1jklP1T-GdXIclWIi7o_HtwIDdx0j7CQy6BGDdAf60D0U0LzfK5tAhJXODRSM7pwwIDT5PhnDQsQxIM-fGJWb9dj5sHNfDEugZrHytWG6kvSUELftWQWT4PvAm-RmhIvvJCTNVGI9UCJjKqvFM4b2YLrluKVxRY6xsRV0WJQZD6Gk9rWcO2QpG2zX9Jlp9Z_hIbNeIeZoarWiMIQ",
  },
  {
    id: "2",
    title: "CV Marketing Manager",
    lastEdited: "Chỉnh sửa: 1 tuần trước",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1uNEwHjDnq5487E_TNRo_XU1E69PnduPVusC98EThiZPWK55nh8QCsiljgPsFB0j8EJq2-H91f1QdsK3vsY9G3dN9uvhneRjaGcMRBDbqonZi3-as0mapMdg8aBw6fhB8FwC12mc6zUQnKb-IeN3DEUm3fy0MAE0mlJMdUlC6BmRwOom5zpm2PxcJqn11UFClfQsxtmSjVJwg91lNTSTSZQvioMGASGW5R5ztrBrtVokwBUyEK1ryC4_JoGeQA-x-Yt-bBdPdFm8",
  },
  {
    id: "3",
    title: "CV Thiết kế Đồ họa",
    lastEdited: "Chỉnh sửa: 1 tháng trước",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVYlpPHK1gQ5IIBRfDDD2SRXjfIKsKiVMYrYjrjiIVjSOu554ZI93yceWxl5NPM4_FBWdg0a9MLfgBeg9hPh1HnjqXnRjt8gfNqZ4j_xLSWMixKe-PW8m8L2UHoIlGImShOFDi9f9bU_PsskTp67hsTNcumgkbQEE2V_XRC72g9h1pt87IUHPbKUA2-5bLtUEeJk3FYS3UFiHUW_NI9GuBX5nwI8W2VPbp4_1J2sqHRTAu5HnnRW3Zc8guB1N0Zqp3_5HquWT85R0",
  },
];

export function CvGrid() {
  const handleEdit = (id: string) => {
    console.log("Edit CV:", id);
  };

  const handlePreview = (id: string) => {
    console.log("Preview CV:", id);
  };

  const handleDownload = (id: string) => {
    console.log("Download CV:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete CV:", id);
  };

  const handleCreateNew = () => {
    console.log("Create new CV");
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockCvs.map((cv) => (
        <CvCard
          key={cv.id}
          id={cv.id}
          title={cv.title}
          lastEdited={cv.lastEdited}
          thumbnailUrl={cv.thumbnailUrl}
          onEdit={handleEdit}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      ))}
      <CreateCvCard onClick={handleCreateNew} />
    </div>
  );
}
