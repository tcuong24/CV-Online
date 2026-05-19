"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Type,
  Palette,
  Layout,
  List,
  Database,
  Settings,
  Save,
  Eye,
  RotateCcw,
  Phone,
  User,
  UserCheck,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit,
  Award,
  Globe,
  Heart,
  Star,
  Check,
  Plus,
  Trash2,
  Settings2,
  HelpCircle,
  Calendar,
  Grid2X2,
  Newspaper,
  ScrollText,
  Tag,
  EyeOff,
  Shield,
  GripVertical,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { CVTemplate } from "@/components/template/CVTemplate";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  DEFAULT_DATA,
  DEFAULT_ORDER,
  DEFAULT_STYLE,
} from "@/constants/cvEditor";
import { mapDbCvToCvData } from "@/lib/mappers/cvDataMapper";
import { LayoutType } from "@/types/cvEditor";
import {
  parseDesignConfig,
  parseSectionsConfig,
  parseSectionLayouts,
} from "@/lib/mappers/templateMapper";

export default function TemplateEditor() {
  const params = useParams();
  const router = useRouter();
  const isCreate = params.id === "create";

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const secConfig = (template.sectionsConfig || {}) as any;
    const availableSecs = secConfig.available_sections || [];
    const draggedId = result.draggableId;

    if (destination.droppableId === "sections-hidden") {
      const targetSec = availableSecs.find((s: any) => s.id === draggedId);
      if (targetSec?.is_required) {
        toast.error("Không thể ẩn mục bắt buộc!");
        return;
      }
    }

    setTemplate((prev) => {
      const next = { ...prev };
      if (!next.sectionsConfig) next.sectionsConfig = {} as any;
      const config = next.sectionsConfig as any;
      if (!config.available_sections) config.available_sections = [];

      let sidebar = [...(config.sidebar_sections || [])];
      let main = [...(config.main_sections || [])];
      const available = config.available_sections;

      // Extract required sections and their original indices
      const sidebarRequiredWithIndices = sidebar
        .map((id, index) => ({ id, index }))
        .filter(item => {
          const s = available.find((sec: any) => sec.id === item.id);
          return s?.is_required;
        });

      const mainRequiredWithIndices = main
        .map((id, index) => ({ id, index }))
        .filter(item => {
          const s = available.find((sec: any) => sec.id === item.id);
          return s?.is_required;
        });

      // Filter to visible/draggable lists for sidebar and main
      let sidebarVisible = sidebar.filter(id => {
        const s = available.find((sec: any) => sec.id === id);
        return s && s.is_visible_by_default !== false && !s.is_required;
      });
      let mainVisible = main.filter(id => {
        const s = available.find((sec: any) => sec.id === id);
        return s && s.is_visible_by_default !== false && !s.is_required;
      });

      const hidden = available.filter((s: any) => {
        if (s.is_required) return false;
        const inSidebar = sidebarVisible.includes(s.id) || sidebarRequiredWithIndices.some(item => item.id === s.id);
        const inMain = mainVisible.includes(s.id) || mainRequiredWithIndices.some(item => item.id === s.id);
        return s.is_visible_by_default === false || (!inSidebar && !inMain);
      }).map((s: any) => s.id);

      // Remove from source list
      if (source.droppableId === "sections-sidebar") {
        sidebarVisible.splice(source.index, 1);
      } else if (source.droppableId === "sections-main") {
        mainVisible.splice(source.index, 1);
      } else if (source.droppableId === "sections-hidden") {
        hidden.splice(source.index, 1);
      }

      // Add to destination list
      if (destination.droppableId === "sections-sidebar") {
        sidebarVisible.splice(destination.index, 0, draggedId);
      } else if (destination.droppableId === "sections-main") {
        mainVisible.splice(destination.index, 0, draggedId);
      }

      // Reconstruct final lists by putting required items back in their original index positions
      let finalSidebar = Array.from(new Set([...sidebarVisible]));
      sidebarRequiredWithIndices.forEach(item => {
        finalSidebar.splice(item.index, 0, item.id);
      });
      finalSidebar = Array.from(new Set(finalSidebar));

      let finalMain = Array.from(new Set([...mainVisible]));
      mainRequiredWithIndices.forEach(item => {
        finalMain.splice(item.index, 0, item.id);
      });
      finalMain = Array.from(new Set(finalMain));

      // Update lists in config
      config.sidebar_sections = finalSidebar;
      config.main_sections = finalMain;

      // Update visible status
      config.available_sections = available.map((s: any) => {
        if (s.id === draggedId) {
          if (destination.droppableId === "sections-hidden") {
            return { ...s, is_visible_by_default: false };
          } else {
            return { ...s, is_visible_by_default: true };
          }
        }
        return s;
      });

      // Synchronize default_order
      const activeSidebar = config.sidebar_sections || [];
      const activeMain = config.main_sections || [];
      const combinedActive = [...activeSidebar, ...activeMain];
      const others = available
        .filter((s: any) => s.is_visible_by_default !== false && !combinedActive.includes(s.id))
        .map((s: any) => s.id);
      const newOrder = [...combinedActive, ...others];

      if (config.hasOwnProperty("default_order") || config.default_order) {
        config.default_order = newOrder;
      } else {
        config.order = newOrder;
      }

      return next;
    });

    toast.success("Đã cập nhật cấu trúc mục!");
  };

  const [template, setTemplate] = useState({
    name: "",
    description: "",
    category: "Professional",
    thumbnailUrl: "",
    isPremium: false,
    layoutType: "sidebar-right",
    designConfig: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#60a5fa",
        text: { heading: "#1f2937", body: "#4b5563", muted: "#6b7280" },
        background: { page: "#ffffff", sidebar: "#f3f4f6" },
      },
      typography: {
        fonts: {
          heading: { family: "Inter", weights: [600, 700], googleFont: true },
          body: { family: "Inter", weights: [400, 500], googleFont: true },
        },
        sizes: {
          name: "32px",
          section_title: "18px",
          subsection: "14px",
          body: "11px",
          small: "10px",
        },
        lineHeights: { heading: 1.2, body: 1.6 },
      },
      spacing: {
        page: { margin: "15mm" },
        section: { marginBottom: "25px" },
      },
      layout: { columnRatio: "30:70", maxWidth: "210mm" },
    },
    sectionsConfig: {
      available_sections: [
        {
          id: "personalInfo",
          type: "personalInfo",
          label: "Thông tin cá nhân",
          is_required: true,
          is_visible_by_default: true,
          layout: { style: "compact" },
        },
        {
          id: "contact",
          type: "contact",
          label: "Thông tin liên hệ",
          is_required: false,
          is_visible_by_default: true,
          layout: { style: "default" },
        },
        {
          id: "summary",
          type: "summary",
          label: "Giới thiệu bản thân",
          is_required: false,
          is_visible_by_default: true,
          layout: { style: "default" },
        },
        {
          id: "experiences",
          type: "experiences",
          label: "Kinh nghiệm làm việc",
          is_required: false,
          is_visible_by_default: true,
          layout: { style: "detailed", showDates: true },
        },
        {
          id: "education",
          type: "education",
          label: "Học vấn",
          is_required: false,
          is_visible_by_default: true,
          layout: { style: "simple" },
        },
        {
          id: "skills",
          type: "skills",
          label: "Kỹ năng",
          is_required: false,
          is_visible_by_default: true,
          layout: { style: "list" },
        },
      ],
      default_order: ["personalInfo", "contact", "summary", "experiences", "education", "skills"],
      sidebar_sections: ["personalInfo", "contact", "skills"],
      main_sections: ["summary", "experiences", "education"],
    },
  });

  useEffect(() => {
    if (!isCreate) {
      axiosInstance
        .get(`/admin/templates/${params.id}`)
        .then((res) => {
          const data = res.data;
          if (data?.sectionsConfig) {
            const config = data.sectionsConfig as any;
            if (config.sidebar_sections) {
              config.sidebar_sections = Array.from(new Set(config.sidebar_sections));
            }
            if (config.main_sections) {
              config.main_sections = Array.from(new Set(config.main_sections));
            }
          }
          setTemplate(data);
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Lỗi khi tải template");
          setLoading(false);
        });
    }
  }, [isCreate, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let uploadedUrl = template.thumbnailUrl;
      const firstPage = document.querySelector(".cv-paper") as HTMLElement;
      if (firstPage) {
        try {
          const { toJpeg } = await import("html-to-image");
          const base64Image = await toJpeg(firstPage, {
            quality: 0.8,
            backgroundColor: "#ffffff",
          });
          const fetchRes = await fetch(base64Image);
          const blob = await fetchRes.blob();
          const formData = new FormData();
          formData.append("file", blob, "thumbnail.jpg");
          
          toast.loading("Đang chụp ảnh mẫu và tải lên...", { id: "screenshot-upload" });
          const uploadRes = await axiosInstance.post("/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          
          if (uploadRes.data?.url) {
            uploadedUrl = uploadRes.data.url;
            toast.success("Tải ảnh mẫu lên thành công!", { id: "screenshot-upload" });
          } else {
            toast.dismiss("screenshot-upload");
          }
        } catch (e) {
          console.error("Error capturing/uploading CV screenshot:", e);
          toast.error("Lỗi khi tự động chụp ảnh mẫu, đang lưu không kèm ảnh mới...", { duration: 3000 });
        }
      }

      const updatedTemplate = { ...template, thumbnailUrl: uploadedUrl };

      if (isCreate) {
        await axiosInstance.post("/admin/templates", updatedTemplate);
        toast.success("Tạo template thành công");
        router.push("/admin/templates");
      } else {
        await axiosInstance.put(`/admin/templates/${params.id}`, updatedTemplate);
        toast.success("Lưu thành công");
        setTemplate(updatedTemplate);
      }
    } catch (err) {
      toast.error("Lỗi khi lưu template");
    } finally {
      setSaving(false);
    }
  };

  const updateDesignConfig = (path: string, value: any) => {
    const keys = path.split(".");
    setTemplate((prev) => {
      const next = { ...prev };
      let current: any = next.designConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== "object") {
          current[key] = {};
        }
        current[key] = { ...current[key] };
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateSectionsConfig = (path: string, value: any) => {
    setTemplate((prev) => ({
      ...prev,
      sectionsConfig: {
        ...prev.sectionsConfig,
        [path]: value,
      },
    }));
  };

  // States for adding section modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"standard" | "custom">("standard");
  const [customTitle, setCustomTitle] = useState("");
  const [customStyle, setCustomStyle] = useState("timeline");
  const [customRequired, setCustomRequired] = useState(false);
  const [customVisible, setCustomVisible] = useState(true);

  // Helper function to render a beautiful section icon based on key
  const renderSectionIcon = (key: string) => {
    const metaMap: Record<
      string,
      { icon: React.ReactNode; color: string; iconColor: string }
    > = {
      personal: {
        icon: <User size={16} />,
        color: "#eff6ff",
        iconColor: "#2563eb",
      },
      personalInfo: {
        icon: <User size={16} />,
        color: "#eff6ff",
        iconColor: "#2563eb",
      },
      summary: {
        icon: <UserCheck size={16} />,
        color: "#f0fdf4",
        iconColor: "#16a34a",
      },
      experience: {
        icon: <Briefcase size={16} />,
        color: "#fff7ed",
        iconColor: "#ea580c",
      },
      experiences: {
        icon: <Briefcase size={16} />,
        color: "#fff7ed",
        iconColor: "#ea580c",
      },
      education: {
        icon: <GraduationCap size={16} />,
        color: "#faf5ff",
        iconColor: "#9333ea",
      },
      skills: {
        icon: <Code size={16} />,
        color: "#f0fdfa",
        iconColor: "#0d9488",
      },
      projects: {
        icon: <FolderGit size={16} />,
        color: "#fdf2f8",
        iconColor: "#db2777",
      },
      certifications: {
        icon: <Award size={16} />,
        color: "#fef2f2",
        iconColor: "#dc2626",
      },
      languages: {
        icon: <Globe size={16} />,
        color: "#f0f9ff",
        iconColor: "#0284c7",
      },
      interests: {
        icon: <Heart size={16} />,
        color: "#fff1f2",
        iconColor: "#e11d48",
      },
      contact: {
        icon: <Phone size={16} />,
        color: "#eff6ff",
        iconColor: "#2563eb",
      },
    };

    const meta = key.startsWith("custom-")
      ? { icon: <Star size={16} />, color: "#fff1f2", iconColor: "#e11d48" }
      : metaMap[key] || {
          icon: <Star size={16} />,
          color: "#f8fafc",
          iconColor: "#64748b",
        };

    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: meta.color, color: meta.iconColor }}
      >
        {meta.icon}
      </div>
    );
  };

  // Helper to add a new section to available_sections, default_order and column layout lists
  const addSectionToTemplate = (
    id: string,
    type: string,
    label: string,
    style: string,
    isRequired: boolean = false,
    isVisible: boolean = true,
  ) => {
    setTemplate((prev) => {
      const next = { ...prev };
      if (!next.sectionsConfig) next.sectionsConfig = {} as any;
      const secConfig = next.sectionsConfig as any;
      if (!secConfig.available_sections) secConfig.available_sections = [];

      if (secConfig.available_sections.some((s: any) => s.id === id)) {
        return prev;
      }

      secConfig.available_sections = [
        ...secConfig.available_sections,
        {
          id,
          type,
          label,
          is_required: isRequired,
          is_visible_by_default: isVisible,
          layout: { style },
        },
      ];

      const currentOrder = secConfig.default_order || secConfig.order || [];
      if (!currentOrder.includes(id)) {
        const newOrder = [...currentOrder, id];
        if (
          secConfig.hasOwnProperty("default_order") ||
          secConfig.default_order
        ) {
          secConfig.default_order = newOrder;
        } else {
          secConfig.order = newOrder;
        }
      }

      const hasSidebar = [
        "sidebar-left",
        "sidebar-right",
        "two-column",
      ].includes(next.layoutType || "");
      if (hasSidebar) {
        if (!secConfig.main_sections) secConfig.main_sections = [];
        if (!secConfig.main_sections.includes(id)) {
          secConfig.main_sections = [...secConfig.main_sections, id];
        }
      } else {
        if (!secConfig.main_sections) secConfig.main_sections = [];
        if (!secConfig.main_sections.includes(id)) {
          secConfig.main_sections = [...secConfig.main_sections, id];
        }
      }

      return next;
    });
    toast.success(`Đã thêm mục "${label}" vào mẫu thiết kế!`);
  };

  // Helper to delete/remove a section
  const deleteSectionFromTemplate = (id: string) => {
    if (id === "personal" || id === "personalInfo") {
      toast.error("Không thể xóa mục Thông tin cá nhân bắt buộc!");
      return;
    }

    setTemplate((prev) => {
      const next = { ...prev };
      if (!next.sectionsConfig) return prev;
      const secConfig = next.sectionsConfig as any;

      if (secConfig.available_sections) {
        secConfig.available_sections = secConfig.available_sections.filter(
          (s: any) => s.id !== id,
        );
      }

      if (secConfig.default_order) {
        secConfig.default_order = secConfig.default_order.filter(
          (o: string) => o !== id,
        );
      }
      if (secConfig.order) {
        secConfig.order = secConfig.order.filter((o: string) => o !== id);
      }

      if (secConfig.sidebar_sections) {
        secConfig.sidebar_sections = secConfig.sidebar_sections.filter(
          (s: string) => s !== id,
        );
      }
      if (secConfig.main_sections) {
        secConfig.main_sections = secConfig.main_sections.filter(
          (s: string) => s !== id,
        );
      }

      return next;
    });
  };

  const toggleSectionField = (
    id: string,
    field: "is_required" | "is_visible_by_default",
  ) => {
    setTemplate((prev) => {
      const next = { ...prev };
      if (!next.sectionsConfig?.available_sections) return prev;
      const secConfig = next.sectionsConfig as any;
      secConfig.available_sections = secConfig.available_sections.map(
        (s: any) => {
          if (s.id === id) {
            return { ...s, [field]: !s[field] };
          }
          return s;
        },
      );
      return next;
    });
    toast.success("Đã cập nhật cấu hình mục!");
  };

  const tabs = [
    { id: "basic", label: "Thông tin cơ bản", icon: <Settings size={16} /> },
    { id: "typography", label: "Kiểu chữ", icon: <Type size={16} /> },
    { id: "colors", label: "Màu sắc", icon: <Palette size={16} /> },
    { id: "layout", label: "Cấu hình Layout", icon: <Layout size={16} /> },
    { id: "sections", label: "Cấu trúc Mục", icon: <List size={16} /> },
    { id: "sample", label: "Dữ liệu mẫu", icon: <Database size={16} /> },
  ];

  const parsedStyle = parseDesignConfig(template.designConfig);
  const { order, sideKeys } = parseSectionsConfig(template.sectionsConfig);
  const parsedSectionLayout = parseSectionLayouts(template.sectionsConfig);
  const hasSidebar =
    template.layoutType?.startsWith("sidebar-") ||
    template.layoutType === "two-column";

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Đang tải cấu hình mẫu CV...
      </div>
    );

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-[#FAFAFA] font-sans -mx-4 -mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Topbar */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/templates")}
            className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="font-sans text-lg font-semibold text-slate-800">
            {isCreate ? "Tạo mẫu CV mới" : `Đang sửa: ${template.name}`}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <Eye size={16} /> Xem trước
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save size={16} /> {saving ? "Đang lưu..." : "Lưu lại"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-56 bg-[#FDFCF6] border-r border-slate-200 flex flex-col py-4 shrink-0 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Thiết lập mẫu
          </div>
          <div className="flex flex-col px-2 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white font-medium shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Middle Area - Editor Form */}
        <div className="flex-1 bg-white border-r border-slate-200 overflow-y-auto flex flex-col relative shadow-[inset_-10px_0_20px_-20px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto w-full px-8 py-10">
            <h2 className="text-xl font-sans font-semibold text-slate-900 mb-8 pb-4 border-b border-slate-100">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Tên mẫu CV
                  </label>
                  <input
                    value={template.name}
                    onChange={(e) =>
                      setTemplate({ ...template, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                    placeholder="VD: Kế toán Minimalist"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Mô tả ngắn
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) =>
                      setTemplate({ ...template, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all resize-none"
                    placeholder="Mô tả phong cách và đối tượng của mẫu CV..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Danh mục
                    </label>
                    <select
                      value={template.category}
                      onChange={(e) =>
                        setTemplate({ ...template, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm cursor-pointer"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Modern">Modern</option>
                      <option value="Creative">Creative</option>
                      <option value="Minimalist">Minimalist</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Layout Engine
                    </label>
                    <select
                      value={template.layoutType}
                      onChange={(e) => {
                        const newLayout = e.target.value;
                        const layoutHasSidebar =
                          newLayout.startsWith("sidebar-") ||
                          newLayout === "two-column";
                        const newSidebar = layoutHasSidebar
                          ? ["personalInfo", "skills"]
                          : [];
                        const newMain = layoutHasSidebar
                          ? ["experiences", "education"]
                          : [
                              "personalInfo",
                              "experiences",
                              "education",
                              "skills",
                            ];

                        setTemplate((prev) => ({
                          ...prev,
                          layoutType: newLayout,
                          sectionsConfig: {
                            ...prev.sectionsConfig,
                            sidebar_sections: newSidebar,
                            main_sections: newMain,
                          },
                        }));
                      }}
                      className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm cursor-pointer"
                    >
                      <option value="sidebar-right">Sidebar Right</option>
                      <option value="sidebar-left">Sidebar Left</option>
                      <option value="two-column">Two Column</option>
                      <option value="single-column">Single Column</option>
                      <option value="black-white">Black & White</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === "typography" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Phông chữ
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500">
                        Phông chữ chính (Font Family)
                      </label>
                      <select
                        value={
                          (template.designConfig as any)?.typography?.fonts
                            ?.body?.family ||
                          (template.designConfig as any)?.typography
                            ?.fontFamily ||
                          "Inter"
                        }
                        onChange={(e) => {
                          const family = e.target.value;
                          setTemplate((prev) => {
                            const next = { ...prev };
                            const design = next.designConfig as any;
                            if (!design.typography) design.typography = {};
                            const typo = design.typography;
                            if (!typo.fonts) typo.fonts = {};
                            if (!typo.fonts.body) typo.fonts.body = {};
                            if (!typo.fonts.heading) typo.fonts.heading = {};

                            typo.fontFamily = family; // compatibility
                            typo.fonts.body.family = family;
                            typo.fonts.heading.family = family;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm cursor-pointer"
                      >
                        <option value="Inter">Inter (Sans Serif)</option>
                        <option value="Lora">Lora (Serif)</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Merriweather">Merriweather</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">
                          Cỡ chữ (px)
                        </label>
                        <input
                          type="number"
                          value={
                            (template.designConfig as any)?.typography?.sizes
                              ?.body
                              ? parseInt(
                                  (template.designConfig as any)?.typography
                                    ?.sizes?.body,
                                )
                              : (template.designConfig as any)?.typography
                                  ?.bodySize || 14
                          }
                          onChange={(e) => {
                            const sizeVal = parseInt(e.target.value) || 14;
                            setTemplate((prev) => {
                              const next = { ...prev };
                              const design = next.designConfig as any;
                              if (!design.typography) design.typography = {};
                              const typo = design.typography;
                              if (!typo.sizes) typo.sizes = {};

                              typo.bodySize = sizeVal; // compatibility
                              typo.sizes.body = `${sizeVal}px`;
                              return next;
                            });
                          }}
                          className="w-full px-4 py-2 bg-[#FAFAFA] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-md border border-amber-200 flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <p>
                    Các cài đặt này sẽ được áp dụng cho toàn bộ nội dung của mẫu
                    CV.
                  </p>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === "colors" && (
              <div className="space-y-4">
                {/* Màu chủ đạo */}
                <div className="flex items-center justify-between p-5 bg-[#FAFAFA] border border-slate-100 rounded-xl group hover:border-slate-200 transition-all shadow-sm">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Màu chủ đạo (Primary Color)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Dùng làm màu nhấn cho các tiêu đề chính, icon và đường kẻ
                      nổi bật.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={
                        (template.designConfig as any)?.colors?.primary ||
                        "#2563eb"
                      }
                      onChange={(e) =>
                        updateDesignConfig("colors.primary", e.target.value)
                      }
                      className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-md shrink-0 transition-transform active:scale-95"
                    />
                    <input
                      type="text"
                      value={
                        (template.designConfig as any)?.colors?.primary ||
                        "#2563eb"
                      }
                      onChange={(e) =>
                        updateDesignConfig("colors.primary", e.target.value)
                      }
                      className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono uppercase text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Màu nền trang */}
                <div className="flex items-center justify-between p-5 bg-[#FAFAFA] border border-slate-100 rounded-xl group hover:border-slate-200 transition-all shadow-sm">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Màu nền trang (Page Background)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Màu nền cho toàn bộ trang giấy của CV (mặc định là màu
                      trắng).
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={
                        (template.designConfig as any)?.colors?.background
                          ?.page ||
                        (typeof (template.designConfig as any)?.colors
                          ?.background === "string"
                          ? (template.designConfig as any)?.colors?.background
                          : "#ffffff")
                      }
                      onChange={(e) =>
                        updateDesignConfig(
                          "colors.background.page",
                          e.target.value,
                        )
                      }
                      className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-md shrink-0 transition-transform active:scale-95"
                    />
                    <input
                      type="text"
                      value={
                        (template.designConfig as any)?.colors?.background
                          ?.page ||
                        (typeof (template.designConfig as any)?.colors
                          ?.background === "string"
                          ? (template.designConfig as any)?.colors?.background
                          : "#ffffff")
                      }
                      onChange={(e) =>
                        updateDesignConfig(
                          "colors.background.page",
                          e.target.value,
                        )
                      }
                      className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono uppercase text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Màu nền Sidebar */}
                {hasSidebar && (
                  <div className="flex items-center justify-between p-5 bg-[#FAFAFA] border border-slate-100 rounded-xl group hover:border-slate-200 transition-all shadow-sm">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        Màu nền Sidebar (Sidebar Background)
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Màu nền riêng cho cột Sidebar bên trái/phải của CV.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <input
                        type="color"
                        value={
                          (template.designConfig as any)?.colors?.background
                            ?.sidebar || "#f3f4f6"
                        }
                        onChange={(e) =>
                          updateDesignConfig(
                            "colors.background.sidebar",
                            e.target.value,
                          )
                        }
                        className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-md shrink-0 transition-transform active:scale-95"
                      />
                      <input
                        type="text"
                        value={
                          (template.designConfig as any)?.colors?.background
                            ?.sidebar || "#f3f4f6"
                        }
                        onChange={(e) =>
                          updateDesignConfig(
                            "colors.background.sidebar",
                            e.target.value,
                          )
                        }
                        className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono uppercase text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sections Tab */}
            {activeTab === "sections" && mounted && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Cấu trúc các mục hiển thị
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sắp xếp thứ tự bằng cách kéo thả, cài đặt ẩn/hiện hoặc chuyển vùng hiển thị của các mục.
                    </p>
                  </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  {(() => {
                    const secConfig = (template.sectionsConfig || {}) as any;
                    const availableSecs = secConfig.available_sections || [];

                    const sidebarList = Array.from(new Set((secConfig.sidebar_sections || []).filter((id: string) => {
                      const s = availableSecs.find((sec: any) => sec.id === id);
                      return s ? s.is_visible_by_default !== false && !s.is_required : false;
                    }))) as string[];

                    const mainList = Array.from(new Set((secConfig.main_sections || []).filter((id: string) => {
                      const s = availableSecs.find((sec: any) => sec.id === id);
                      return s ? s.is_visible_by_default !== false && !s.is_required : false;
                    }))) as string[];

                    const hiddenList = Array.from(new Set(availableSecs.filter((sec: any) => {
                      if (sec.is_required) return false;
                      return sec.is_visible_by_default === false || (!sidebarList.includes(sec.id) && !mainList.includes(sec.id));
                    }).map((sec: any) => sec.id))) as string[];

                    const sidebarZone = hasSidebar && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          {template.layoutType === "sidebar-right" ? "Cột phải (Sidebar CV)" : "Cột trái (Sidebar CV)"}
                        </label>
                        <Droppable droppableId="sections-sidebar" direction="vertical">
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`space-y-3 p-4 rounded-2xl border min-h-[120px] transition-all duration-200 ${
                                snapshot.isDraggingOver
                                  ? "bg-slate-50/80 border-slate-300 border-dashed"
                                  : "bg-slate-50/30 border-slate-100"
                              }`}
                            >
                              {sidebarList.map((sectionId: string, index: number) => {
                                const secInfo = availableSecs.find((s: any) => s.id === sectionId) || {
                                  id: sectionId,
                                  label: sectionId,
                                };
                                return (
                                  <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-350 transition-all select-none ${
                                          snapshot.isDragging ? "shadow-lg scale-105 z-50 ring-2 ring-slate-400 ring-offset-2" : ""
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <div {...provided.dragHandleProps} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing shrink-0">
                                            <GripVertical size={14} className="stroke-[2.5]" />
                                          </div>
                                          <div className="shrink-0">{renderSectionIcon(sectionId)}</div>
                                          <span className="text-sm font-bold text-slate-800 capitalize truncate flex-1 min-w-0 max-w-[240px]">
                                            {secInfo.label}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0 ml-4">
                                          {sectionId !== "personalInfo" && (
                                            <button
                                              type="button"
                                              onClick={() => deleteSectionFromTemplate(sectionId)}
                                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );

                    const mainZone = (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          {template.layoutType === "sidebar-right" ? "Cột trái (Main CV)" : (hasSidebar ? "Cột phải (Main CV)" : "Cột chính (Main CV)")}
                        </label>
                        <Droppable droppableId="sections-main" direction="vertical">
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`space-y-3 p-4 rounded-2xl border min-h-[120px] transition-all duration-200 ${
                                snapshot.isDraggingOver
                                  ? "bg-slate-50/80 border-slate-300 border-dashed"
                                  : "bg-slate-50/30 border-slate-100"
                              }`}
                            >
                              {mainList.map((sectionId: string, index: number) => {
                                const secInfo = availableSecs.find((s: any) => s.id === sectionId) || {
                                  id: sectionId,
                                  label: sectionId,
                                };
                                return (
                                  <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-350 transition-all select-none ${
                                          snapshot.isDragging ? "shadow-lg scale-105 z-50 ring-2 ring-slate-400 ring-offset-2" : ""
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <div {...provided.dragHandleProps} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing shrink-0">
                                            <GripVertical size={14} className="stroke-[2.5]" />
                                          </div>
                                          <div className="shrink-0">{renderSectionIcon(sectionId)}</div>
                                          <span className="text-sm font-bold text-slate-800 capitalize truncate flex-1 min-w-0 max-w-[240px]">
                                            {secInfo.label}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0 ml-4">
                                          {sectionId !== "personalInfo" && (
                                            <button
                                              type="button"
                                              onClick={() => deleteSectionFromTemplate(sectionId)}
                                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );

                    return (
                      <div className="space-y-6">
                        <div className="space-y-6">
                          {template.layoutType === "sidebar-right" ? (
                            <>
                              {mainZone}
                              {sidebarZone}
                            </>
                          ) : (
                            <>
                              {sidebarZone}
                              {mainZone}
                            </>
                          )}
                        </div>

                        {/* Hidden/Disabled Sections Dropzone */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                            Mục ẩn / Không sử dụng
                          </label>
                          <Droppable droppableId="sections-hidden" direction="horizontal">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-200 flex flex-wrap gap-3 items-center justify-center min-h-[90px] ${
                                  snapshot.isDraggingOver
                                    ? "border-slate-400 bg-slate-50/80"
                                    : "border-slate-200 bg-slate-50/10"
                                }`}
                              >
                                {hiddenList.length === 0 && !snapshot.isDraggingOver ? (
                                  <span className="text-slate-400 text-sm font-medium select-none flex items-center gap-1.5">
                                    ↓ Kéo thả vào đây để ẩn mục
                                  </span>
                                ) : (
                                  hiddenList.map((sectionId: string, index: number) => {
                                    const secInfo = availableSecs.find((s: any) => s.id === sectionId) || {
                                      id: sectionId,
                                      label: sectionId,
                                    };
                                    return (
                                      <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all select-none ${
                                              snapshot.isDragging ? "shadow-lg scale-105 z-50 ring-2 ring-slate-400 ring-offset-2" : ""
                                            }`}
                                          >
                                            <GripVertical size={13} className="text-slate-400 shrink-0" />
                                            {renderSectionIcon(sectionId)}
                                            <span className="text-xs font-bold text-slate-700 capitalize truncate max-w-[100px]">
                                              {secInfo.label}
                                            </span>
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>

                        {/* Add Section Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setModalOpen(true);
                              setModalTab("standard");
                            }}
                            className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 hover:bg-slate-50 text-sm font-semibold py-3 px-6 rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                          >
                            <Plus size={16} className="stroke-[2.5]" />
                            Thêm mục mới
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </DragDropContext>
              </div>
            )}

            {/* Sample Data Tab */}
            {activeTab === "sample" && (
              <div className="space-y-6 flex flex-col h-[600px]">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Dữ liệu mẫu hiển thị (JSON)
                  </label>
                  <span className="text-[10px] text-slate-400 italic">
                    Dữ liệu này dùng để render bản xem trước bên phải
                  </span>
                </div>
                <textarea
                  className="w-full flex-1 bg-slate-900 text-emerald-400 p-5 font-mono text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none shadow-inner"
                  defaultValue={JSON.stringify(DEFAULT_DATA, null, 2)}
                  readOnly
                />
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Lưu ý:</strong> Hiện tại trình biên tập đang sử dụng
                    bộ dữ liệu chuẩn hệ thống. Bạn có thể ghi đè bộ dữ liệu này
                    cho từng template trong phiên bản tiếp theo.
                  </p>
                </div>
              </div>
            )}

            {/* Layout Tab - Advanced */}
            {activeTab === "layout" && (
              <div className="space-y-4 flex flex-col h-[500px]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Cấu hình nâng cao Layout
                  </span>
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
                    <RotateCcw size={12} /> Format JSON
                  </button>
                </div>
                <textarea
                  className="w-full flex-1 bg-slate-900 text-emerald-400 p-5 font-mono text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none shadow-inner"
                  defaultValue={JSON.stringify(template.designConfig, null, 2)}
                  onChange={(e) => {
                    // Note: Handle JSON string parsing robustly later
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Live Preview Mock */}
        <div className="w-[450px] bg-[#EBECEE] flex flex-col shrink-0">
          <div className="h-10 border-b border-slate-300 bg-[#F5F5F5] flex items-center px-4 justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Trình giả lập CV (Live)
            </span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-[#EBECEE]">
            {/* Wrapper div dynamically shrink-wraps the zoomed preview */}
            <div className="w-[381px] mt-4 shrink-0 shadow-xl rounded-sm overflow-hidden bg-white">
              <div
                style={{ zoom: 0.48, width: "794px" }}
                className="[&_.cv-paper]:!min-h-0 [&_.cv-paper]:!shadow-none [&_.cv-paper]:pb-12"
              >
                {/* Real CV Preview */}
                <div className="pointer-events-none select-none">
                  <CVTemplate
                    data={mapDbCvToCvData(DEFAULT_DATA as any)}
                    order={order.length ? order : DEFAULT_ORDER}
                    style={parsedStyle}
                    layoutType={template.layoutType as LayoutType}
                    sideKeys={
                      sideKeys.length ? sideKeys : ["personal", "skills"]
                    }
                    sectionLayout={parsedSectionLayout}
                    zoom={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Add Section Modal (CSS-based glassmorphism animated react-modal) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div
            className={`bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[85vh] ${
              modalTab === "custom"
                ? "max-w-4xl w-[900px]"
                : "max-w-2xl w-[600px]"
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  Thêm mục nội dung mới vào mẫu CV
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Kích hoạt các mục tiêu chuẩn hoặc tạo mục tùy chỉnh mới với
                  kiểu hiển thị mong muốn.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl p-1 leading-none rounded hover:bg-slate-100 transition-all shrink-0 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Tab Selector */}
            <div className="px-6 pt-4 bg-white">
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    modalTab === "standard"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  onClick={() => setModalTab("standard")}
                >
                  Mục có sẵn trong dự án
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    modalTab === "custom"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  onClick={() => setModalTab("custom")}
                >
                  Tạo mục tùy chỉnh
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {modalTab === "standard" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(() => {
                    const secConfig = (template.sectionsConfig || {}) as any;
                    const orderList =
                      secConfig.default_order || secConfig.order || [];

                    const standardSectionsList = [
                      {
                        id: "summary",
                        type: "summary",
                        label: "Giới thiệu bản thân",
                        style: "default",
                      },
                      {
                        id: "contact",
                        type: "contact",
                        label: "Thông tin liên hệ",
                        style: "default",
                      },
                      {
                        id: "experience",
                        type: "experience",
                        label: "Kinh nghiệm làm việc",
                        style: "timeline",
                      },
                      {
                        id: "experiences",
                        type: "experiences",
                        label: "Kinh nghiệm làm việc (Ex)",
                        style: "detailed",
                      },
                      {
                        id: "education",
                        type: "education",
                        label: "Học vấn & Bằng cấp",
                        style: "timeline",
                      },
                      {
                        id: "skills",
                        type: "skills",
                        label: "Kỹ năng chuyên môn",
                        style: "tags",
                      },
                      {
                        id: "projects",
                        type: "projects",
                        label: "Dự án thực tế",
                        style: "timeline",
                      },
                      {
                        id: "certifications",
                        type: "certifications",
                        label: "Chứng chỉ",
                        style: "list",
                      },
                      {
                        id: "languages",
                        type: "languages",
                        label: "Ngoại ngữ",
                        style: "list",
                      },
                      {
                        id: "interests",
                        type: "interests",
                        label: "Sở thích",
                        style: "tags",
                      },
                    ];

                    return standardSectionsList.map((item) => {
                      const isAdded = orderList.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col items-center text-center transition-all hover:border-slate-300 relative shadow-sm"
                        >
                          {renderSectionIcon(item.id)}

                          <div className="font-bold text-slate-800 text-xs mt-3">
                            {item.label}
                          </div>

                          <div className="mt-auto pt-4 w-full">
                            {isAdded ? (
                              <span className="w-full flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1.5 rounded-lg border border-emerald-150">
                                <Check size={10} className="stroke-[3]" />
                                Đang kích hoạt
                              </span>
                            ) : (
                              <button
                                className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition-all cursor-pointer border-none shadow-sm"
                                onClick={() => {
                                  addSectionToTemplate(
                                    item.id,
                                    item.type,
                                    item.label,
                                    item.style,
                                    false,
                                    true,
                                  );
                                }}
                              >
                                + Kích hoạt
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="flex gap-6 items-start">
                  {/* Form Column */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Tên mục tùy chỉnh{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                        placeholder="Ví dụ: Hoạt động ngoại khóa, Kỹ năng mềm..."
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                      />
                    </div>

                    {/* Display style selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Kiểu hiển thị (Style Layout)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            id: "timeline",
                            label: "Timeline",
                            icon: <Calendar size={14} />,
                            color:
                              "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50",
                          },
                          {
                            id: "list",
                            label: "Danh sách",
                            icon: <ScrollText size={14} />,
                            color:
                              "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50",
                          },
                          {
                            id: "tags",
                            label: "Thẻ / Tags",
                            icon: <Tag size={14} />,
                            color:
                              "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50",
                          },
                          {
                            id: "text",
                            label: "Văn bản",
                            icon: <Newspaper size={14} />,
                            color:
                              "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50",
                          },
                          {
                            id: "grid",
                            label: "Lưới / Grid",
                            icon: <Grid2X2 size={14} />,
                            color:
                              "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50",
                          },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer bg-white ${
                              customStyle === item.id
                                ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-sm"
                                : "border-slate-200 hover:border-slate-350"
                            }`}
                            onClick={() => setCustomStyle(item.id)}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 shadow-sm ${item.color}`}
                            >
                              {item.icon}
                            </div>
                            <div className="font-bold text-slate-800 text-[10px]">
                              {item.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Required / Visible Switch */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={customRequired}
                          onChange={(e) => setCustomRequired(e.target.checked)}
                          className="rounded text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
                        />
                        <span>Bắt buộc phải nhập</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={customVisible}
                          onChange={(e) => setCustomVisible(e.target.checked)}
                          className="rounded text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
                        />
                        <span>Hiện sẵn theo mặc định</span>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer mt-4"
                      onClick={() => {
                        if (!customTitle.trim()) {
                          toast.error("Vui lòng nhập tên mục tùy chỉnh!");
                          return;
                        }
                        const customId = `custom-${Date.now()}`;
                        addSectionToTemplate(
                          customId,
                          "custom",
                          customTitle,
                          customStyle,
                          customRequired,
                          customVisible,
                        );
                        setCustomTitle("");
                        setModalOpen(false);
                      }}
                    >
                      Tạo mục tùy chỉnh
                    </button>
                  </div>

                  {/* Preview Column */}
                  <div className="w-[280px] shrink-0 border border-slate-200 rounded-xl bg-slate-50 p-4 flex flex-col h-[340px] shadow-inner">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Minh họa giao diện</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-extrabold text-[8px]">
                        Live Preview
                      </span>
                    </div>

                    {/* Fake Sheet */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm overflow-hidden flex flex-col">
                      <div className="text-[11px] font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase tracking-wide flex items-center gap-1 border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-slate-900 inline-block shrink-0"></span>
                        <span>{customTitle.trim() || "Tên mục tùy chỉnh"}</span>
                      </div>

                      <div className="flex-1 text-[9px] text-slate-500 leading-relaxed overflow-hidden">
                        {customStyle === "timeline" && (
                          <div className="space-y-3 relative pl-3.5 border-l-2 border-slate-100 ml-1">
                            {[1, 2].map((idx) => (
                              <div key={idx} className="relative">
                                <div className="absolute -left-[18.5px] top-1 w-2 h-2 rounded-full bg-slate-200 border border-white"></div>
                                <div className="font-extrabold text-slate-700 text-[9.5px]">
                                  Nội dung tiêu đề chính
                                </div>
                                <div className="text-slate-400 mt-0.5">
                                  Mô tả tóm tắt nội dung trục thời gian...
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {customStyle === "list" && (
                          <div className="space-y-2">
                            {[1, 2].map((idx) => (
                              <div key={idx} className="flex gap-1.5">
                                <span className="text-slate-400 font-bold shrink-0">
                                  •
                                </span>
                                <div className="flex-1">
                                  <div className="font-extrabold text-slate-700">
                                    Dòng nội dung thứ {idx}
                                  </div>
                                  <div className="text-slate-400 mt-0.5">
                                    Chi tiết mô tả bổ sung cho dòng...
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {customStyle === "tags" && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {[
                              "Từ khóa 1",
                              "Từ khóa 2",
                              "Từ khóa 3",
                              "Từ khóa 4",
                            ].map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[8px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {customStyle === "text" && (
                          <div className="space-y-1.5 pt-1 text-slate-400 text-justify leading-relaxed">
                            Vùng nhập văn bản tự do, cho phép soạn thảo nhiều
                            đoạn văn bản liên tiếp mô tả các thông tin đặc
                            thù...
                          </div>
                        )}

                        {customStyle === "grid" && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {[1, 2, 3, 4].map((idx) => (
                              <div
                                key={idx}
                                className="p-1.5 rounded border border-slate-100 bg-slate-50 flex flex-col gap-0.5"
                              >
                                <div className="font-extrabold text-slate-700 text-[8.5px]">
                                  Hộp số {idx}
                                </div>
                                <div className="text-slate-450 leading-normal text-[8px]">
                                  Nội dung ô...
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1.5 mt-auto flex items-center justify-between text-[7px] text-slate-350">
                        <span>CV Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
