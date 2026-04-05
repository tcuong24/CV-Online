/*
  Warnings:

  - You are about to drop the `template_styles` table. Data will be migrated to templates.defaultTheme first.

*/

-- First, add the new columns to templates table
ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "colorSchemes" JSONB,
ADD COLUMN IF NOT EXISTS "defaultTheme" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "downloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate data from template_styles to templates.defaultTheme
UPDATE "templates"
SET "defaultTheme" = jsonb_build_object(
  'defaultColor', ts."default_color",
  'defaultFont', ts."default_font",
  'layout', ts."layout_json"::jsonb
)
FROM "template_styles" ts
WHERE "templates"."id" = ts."template_id";

-- DropForeignKey
ALTER TABLE "template_styles" DROP CONSTRAINT IF EXISTS "template_styles_template_id_fkey";

-- DropTable
DROP TABLE IF EXISTS "template_styles";
