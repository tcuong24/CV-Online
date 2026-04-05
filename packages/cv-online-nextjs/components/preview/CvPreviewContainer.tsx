import React from "react";
import EditableTemplate from "@/templates/editable";

export function CvPreviewContainer() {
  // Mock CV data if not provided
  const mockCv = cv || {
    title: "Sample CV",
    template_id: 1,
    color: "#2563eb",
    font: "Inter, sans-serif",
    userProfile: {
      full_name: "John Doe",
      avatar: "",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State",
      summary:
        "Experienced software developer with 5+ years of experience in web development and team leadership.",
    },
    sections: [],
    experiences: [
      {
        id: 1,
        cv_id: 1,
        company: "Tech Corp",
        role: "Senior Software Engineer",
        start_date: new Date("2022-01-01"),
        end_date: new Date("2024-01-01"),
        description:
          "Led development of web applications using React and Node.js. Managed a team of 3 developers.",
        position: 1,
      },
    ],
    educations: [
      {
        id: 1,
        cv_id: 1,
        school: "University of Technology",
        major: "Computer Science",
        start_year: 2018,
        end_year: 2022,
        description: "Bachelor's degree with honors",
        position: 1,
      },
    ],
    skills: [
      {
        id: 1,
        cv_id: 1,
        skill_name: "JavaScript",
        level: "expert",
        position: 1,
      },
      {
        id: 2,
        cv_id: 1,
        skill_name: "React",
        level: "advanced",
        position: 2,
      },
    ],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };

  if (cv) {
    return (
      <div className="w-full bg-card p-4 rounded-lg border">
        <EditableTemplate cv={cv} isPreview={true} />
      </div>
    );
  }

  // Fallback preview with background image
  return (
    <div className="w-full bg-card p-4 rounded-lg border">
      <div className="w-full overflow-hidden bg-white aspect-210/297 rounded-md flex">
        <div
          className="w-full bg-center bg-no-repeat bg-cover aspect-auto flex-1 shadow-inner"
          data-alt="A high-fidelity preview of a professional CV document with placeholder text and sections."
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD9m5mme0ZjVv1_ponX9SThg8VUQe5wlJdScKrljlg94vJhoXMa0qDJg0lY8aj-FUWG-2uFZhrTDLk-HD1TTJu5w8oOmFJedPAmn7pQ6GGMyHFcoXzm2Yl0E_xCHoWKygYiyoEpn94ZMEARut8pf_Kz_X4smt2eOCvO4GvtB6bgo7aoee7DyubrcXl3JdIEv9v1QVgVe8zw8WBa80iNl-ddQ3ZoUKFa8NHrA-2OLt56IWos59HcSYnUG5Lt1NGs6JhDBCX0iEH_-Kk")',
          }}
        />
      </div>
    </div>
  );
}
