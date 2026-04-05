/*
  Warnings:

  - The primary key for the `cvs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `color` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `font` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `public_slug` on the `cvs` table. All the data in the column will be lost.
  - The primary key for the `templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `colorSchemes` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTheme` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `downloadCount` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `preview_url` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `templates` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `public_cvs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `cvs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_url_token]` on the table `cvs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `design_config` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layout_type` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sections_config` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_url` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_template_id_fkey";

-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public_cvs" DROP CONSTRAINT "public_cvs_cv_id_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_pkey",
DROP COLUMN "color",
DROP COLUMN "content",
DROP COLUMN "font",
DROP COLUMN "public_slug",
ADD COLUMN     "custom_styles" JSONB,
ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "public_url_token" TEXT,
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "sections_order" JSONB,
ADD COLUMN     "sections_visibility" JSONB,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "template_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cvs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cvs_id_seq";

-- AlterTable
ALTER TABLE "templates" DROP CONSTRAINT "templates_pkey",
DROP COLUMN "colorSchemes",
DROP COLUMN "defaultTheme",
DROP COLUMN "downloadCount",
DROP COLUMN "isActive",
DROP COLUMN "isPremium",
DROP COLUMN "preview_url",
DROP COLUMN "tags",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "design_config" JSONB NOT NULL,
ADD COLUMN     "is_premium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "layout_type" TEXT NOT NULL,
ADD COLUMN     "popularity_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preview_pdf_url" TEXT,
ADD COLUMN     "sections_config" JSONB NOT NULL,
ADD COLUMN     "thumbnail_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usage_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0.0',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "templates_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "templates_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "subscription_expires_at" TIMESTAMP(3),
ADD COLUMN     "subscription_type" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- DropTable
DROP TABLE "public_cvs";

-- DropTable
DROP TABLE "user_profiles";

-- CreateTable
CREATE TABLE "template_sample_data" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "sample_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_sample_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_personal_info" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "job_title" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "nationality" TEXT,
    "photo_url" TEXT,
    "website" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "portfolio_url" TEXT,
    "twitter_url" TEXT,
    "facebook_url" TEXT,
    "summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_experiences" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "company_website" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "achievements" TEXT[],
    "technologies" TEXT[],
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_education" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field_of_study" TEXT,
    "location" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "gpa" TEXT,
    "description" TEXT,
    "achievements" TEXT[],
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_skills" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "category" TEXT,
    "skill_name" TEXT NOT NULL,
    "proficiency_level" TEXT,
    "proficiency_percentage" INTEGER,
    "years_of_experience" DECIMAL(3,1),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_projects" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "role" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_ongoing" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "achievements" TEXT[],
    "technologies" TEXT[],
    "project_url" TEXT,
    "github_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_certifications" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuing_organization" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "credential_id" TEXT,
    "credential_url" TEXT,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_languages" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "language_name" TEXT NOT NULL,
    "proficiency_level" TEXT,
    "can_read" BOOLEAN NOT NULL DEFAULT true,
    "can_write" BOOLEAN NOT NULL DEFAULT true,
    "can_speak" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_awards" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "date_received" TIMESTAMP(3),
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_references" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "job_title" TEXT,
    "company" TEXT,
    "relationship" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_custom_sections" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "section_title" TEXT NOT NULL,
    "section_type" TEXT,
    "content" JSONB NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_custom_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_rendered_cache" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "cache_key" TEXT NOT NULL,
    "html_content" TEXT NOT NULL,
    "css_content" TEXT,
    "template_id" TEXT,
    "template_version" TEXT,
    "file_size" INTEGER,
    "render_time_ms" INTEGER,
    "expires_at" TIMESTAMP(3),
    "hit_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_rendered_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_exports" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "export_type" TEXT NOT NULL,
    "file_url" TEXT,
    "file_size" INTEGER,
    "export_options" JSONB,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "cv_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_versions" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "snapshot_data" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_shares" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "share_token" TEXT NOT NULL,
    "share_type" TEXT,
    "recipient_email" TEXT,
    "expires_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "user_id" TEXT,
    "cv_id" TEXT,
    "template_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_sample_data_template_id_key" ON "template_sample_data"("template_id");

-- CreateIndex
CREATE INDEX "template_sample_data_template_id_idx" ON "template_sample_data"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "cv_personal_info_cv_id_key" ON "cv_personal_info"("cv_id");

-- CreateIndex
CREATE INDEX "cv_personal_info_cv_id_idx" ON "cv_personal_info"("cv_id");

-- CreateIndex
CREATE INDEX "cv_experiences_cv_id_idx" ON "cv_experiences"("cv_id");

-- CreateIndex
CREATE INDEX "cv_experiences_cv_id_display_order_idx" ON "cv_experiences"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_education_cv_id_idx" ON "cv_education"("cv_id");

-- CreateIndex
CREATE INDEX "cv_education_cv_id_display_order_idx" ON "cv_education"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_skills_cv_id_idx" ON "cv_skills"("cv_id");

-- CreateIndex
CREATE INDEX "cv_skills_cv_id_category_idx" ON "cv_skills"("cv_id", "category");

-- CreateIndex
CREATE INDEX "cv_skills_cv_id_display_order_idx" ON "cv_skills"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_projects_cv_id_idx" ON "cv_projects"("cv_id");

-- CreateIndex
CREATE INDEX "cv_projects_cv_id_display_order_idx" ON "cv_projects"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_certifications_cv_id_idx" ON "cv_certifications"("cv_id");

-- CreateIndex
CREATE INDEX "cv_certifications_cv_id_display_order_idx" ON "cv_certifications"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_languages_cv_id_idx" ON "cv_languages"("cv_id");

-- CreateIndex
CREATE INDEX "cv_languages_cv_id_display_order_idx" ON "cv_languages"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_awards_cv_id_idx" ON "cv_awards"("cv_id");

-- CreateIndex
CREATE INDEX "cv_awards_cv_id_display_order_idx" ON "cv_awards"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_references_cv_id_idx" ON "cv_references"("cv_id");

-- CreateIndex
CREATE INDEX "cv_references_cv_id_display_order_idx" ON "cv_references"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_custom_sections_cv_id_idx" ON "cv_custom_sections"("cv_id");

-- CreateIndex
CREATE INDEX "cv_custom_sections_cv_id_display_order_idx" ON "cv_custom_sections"("cv_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "cv_rendered_cache_cache_key_key" ON "cv_rendered_cache"("cache_key");

-- CreateIndex
CREATE INDEX "cv_rendered_cache_cv_id_idx" ON "cv_rendered_cache"("cv_id");

-- CreateIndex
CREATE INDEX "cv_rendered_cache_cache_key_idx" ON "cv_rendered_cache"("cache_key");

-- CreateIndex
CREATE INDEX "cv_rendered_cache_expires_at_idx" ON "cv_rendered_cache"("expires_at");

-- CreateIndex
CREATE INDEX "cv_exports_cv_id_idx" ON "cv_exports"("cv_id");

-- CreateIndex
CREATE INDEX "cv_exports_user_id_idx" ON "cv_exports"("user_id");

-- CreateIndex
CREATE INDEX "cv_exports_status_idx" ON "cv_exports"("status");

-- CreateIndex
CREATE INDEX "cv_exports_created_at_idx" ON "cv_exports"("created_at" DESC);

-- CreateIndex
CREATE INDEX "cv_versions_cv_id_version_number_idx" ON "cv_versions"("cv_id", "version_number" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "cv_versions_cv_id_version_number_key" ON "cv_versions"("cv_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "cv_shares_share_token_key" ON "cv_shares"("share_token");

-- CreateIndex
CREATE INDEX "cv_shares_cv_id_idx" ON "cv_shares"("cv_id");

-- CreateIndex
CREATE INDEX "cv_shares_share_token_idx" ON "cv_shares"("share_token");

-- CreateIndex
CREATE INDEX "cv_shares_expires_at_idx" ON "cv_shares"("expires_at");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_idx" ON "analytics_events"("user_id");

-- CreateIndex
CREATE INDEX "analytics_events_cv_id_idx" ON "analytics_events"("cv_id");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "cvs_slug_key" ON "cvs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cvs_public_url_token_key" ON "cvs"("public_url_token");

-- CreateIndex
CREATE INDEX "cvs_user_id_idx" ON "cvs"("user_id");

-- CreateIndex
CREATE INDEX "cvs_template_id_idx" ON "cvs"("template_id");

-- CreateIndex
CREATE INDEX "cvs_slug_idx" ON "cvs"("slug");

-- CreateIndex
CREATE INDEX "cvs_is_public_status_idx" ON "cvs"("is_public", "status");

-- CreateIndex
CREATE INDEX "cvs_public_url_token_idx" ON "cvs"("public_url_token");

-- CreateIndex
CREATE INDEX "templates_category_idx" ON "templates"("category");

-- CreateIndex
CREATE INDEX "templates_is_premium_idx" ON "templates"("is_premium");

-- CreateIndex
CREATE INDEX "templates_is_published_idx" ON "templates"("is_published");

-- CreateIndex
CREATE INDEX "templates_popularity_score_idx" ON "templates"("popularity_score" DESC);

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_subscription_type_subscription_expires_at_idx" ON "users"("subscription_type", "subscription_expires_at");

-- AddForeignKey
ALTER TABLE "template_sample_data" ADD CONSTRAINT "template_sample_data_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_personal_info" ADD CONSTRAINT "cv_personal_info_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_experiences" ADD CONSTRAINT "cv_experiences_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_education" ADD CONSTRAINT "cv_education_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_skills" ADD CONSTRAINT "cv_skills_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_projects" ADD CONSTRAINT "cv_projects_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_certifications" ADD CONSTRAINT "cv_certifications_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_languages" ADD CONSTRAINT "cv_languages_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_awards" ADD CONSTRAINT "cv_awards_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_references" ADD CONSTRAINT "cv_references_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_custom_sections" ADD CONSTRAINT "cv_custom_sections_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_rendered_cache" ADD CONSTRAINT "cv_rendered_cache_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_rendered_cache" ADD CONSTRAINT "cv_rendered_cache_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_exports" ADD CONSTRAINT "cv_exports_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_exports" ADD CONSTRAINT "cv_exports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_versions" ADD CONSTRAINT "cv_versions_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_versions" ADD CONSTRAINT "cv_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_shares" ADD CONSTRAINT "cv_shares_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
