"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { CVWithRelations, DbDesignConfig, DbSectionsConfig, TemplateInCv } from "@/types/cv";

import { Skeleton } from "@/components/ui/skeleton";
import { TemplateCard } from "./TemplateCard";
import { useCvEditorStore } from "@/stores/useCvEditor";
import { parseSectionsConfig, DB_KEY_MAP } from "@/lib/mappers/templateMapper";
import { uid } from "@/constants/cvEditor";

// Template from API (matches backend response)
interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl: string;
  previewPdfUrl?: string;
  category: string;
  isPremium: boolean;
  isPublished: boolean;
  layoutType: string;
  popularityScore: number;
  usageCount: number;
  version: string;
  designConfig: DbDesignConfig;
  sectionsConfig: DbSectionsConfig;
  tags: string[];
}

export function TemplatesGrid() {
  const router = useRouter();
  const { setCV } = useCvEditorStore();
  const { data: session } = useSession();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>("All");

  const allTags = Array.from(
    new Set(
      templates.flatMap((t) => t.tags || [])
    )
  );
  const filteredTemplates =
    activeTag === "All"
      ? templates
      : templates.filter((t) =>
        t.tags?.includes(activeTag)
      );
  const handleSelectTemplate = (template: Template) => {
    const { order, sideKeys: _sideKeys } = parseSectionsConfig(template.sectionsConfig);
    const availableSections = (template.sectionsConfig?.available_sections ?? []) as Array<{
      id: string;
      is_visible_by_default?: boolean;
    }>;
    const sectionsVisibility: Record<string, boolean> = {};
    for (const section of availableSections) {
      if (section.is_visible_by_default === false) {
        const appKey = DB_KEY_MAP[section.id] ?? section.id;
        sectionsVisibility[appKey] = false;
      }
    }

    const localCV: CVWithRelations = {
      // ── Meta ──
      id: `local-${crypto.randomUUID()}`,
      userId: "local-user",
      templateId: template.id,
      title: `CV mới - ${template.name}`,
      isPublic: false,
      status: "DRAFT",
      viewCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),

      // ── Style & layout (Hybrid C) ──
      snapshotDesignConfig: template.designConfig,   // snapshot raw — parser runs in store
      customStyles: undefined,                        // user hasn't customised anything yet
      sectionsOrder: order,                           // normalized app keys
      sectionsVisibility: Object.keys(sectionsVisibility).length > 0
        ? sectionsVisibility
        : undefined,

      // ── Template relation ──
      template: {
        id: template.id,
        name: template.name,
        description: template.description ?? null,
        thumbnailUrl: template.thumbnailUrl,
        previewPdfUrl: template.previewPdfUrl ?? null,
        category: template.category,
        isPremium: template.isPremium,
        isPublished: template.isPublished,
        popularityScore: template.popularityScore,
        usageCount: template.usageCount,
        layoutType: template.layoutType as TemplateInCv["layoutType"],
        designConfig: template.designConfig,
        sectionsConfig: template.sectionsConfig,
        version: template.version,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ── Empty relations (new CV) ──
      personalInfo: {
        name: session?.user?.name ?? '',
        role: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary: '',
        avatarUrl: session?.user?.image ?? null,
      },
      experiences: [{ id: uid(), open: true, title: '', company: '', location: '', from: '', to: '', desc: '' }],
      education: [{ id: uid(), open: true, degree: '', school: '', from: '', to: '', desc: '' }],
      skills: [{ id: uid(), name: '', proficiencyLevel: 'intermediate', proficiencyPercentage: 50, category: '' }],
      projects: [{ id: uid(), open: true, name: '', role: '', tech: '', link: '', desc: '' }],
      certifications: [{ id: uid(), open: true, name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', description: '' }],
      languages: [{ id: uid(), lang: '', level: 3 }],
      awards: [{ id: uid(), open: true, title: '', org: '', year: '' }],
      references: [],
      interests: [],
      activities: [],
    };

    // Hydrate store then navigate to editor
    setCV(localCV);
    router.push(`/cvs/create`);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/templates");
        const data = res.data as Template[];
        setTemplates(data);
      } catch (err) {
        console.error("Lỗi tải template:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-3/4 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag("All")}
          className={`px-4 py-1 rounded-full text-sm border ${activeTag === "All"
            ? "bg-muted"
            : "bg-white"
            }`}
        >
          All
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1 rounded-full text-sm border ${activeTag === tag
              ? "bg-muted"
              : "bg-white"
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {filteredTemplates.map((template) => {
          const primaryColor =
            ((template.designConfig as Record<string, unknown> | undefined)
              ?.['colors'] as Record<string, string> | undefined)?.['primary'] ?? "#3b82f6";

          return (
            <TemplateCard
              key={template.id}
              id={template.id}
              image={template.thumbnailUrl || "/placeholder-cv.jpg"}
              title={template.name}
              description={template.description || ""}
              alt={`${template.name} CV template`}
              isEditable={true}
              isPremium={template.isPremium}
              accentColor={primaryColor}
              handleSelectTemplate={() => handleSelectTemplate(template)}
            />
          );
        })}
      </div>
    </div>
  );
}
