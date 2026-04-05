-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "preview_url" TEXT;

-- CreateTable
CREATE TABLE "template_styles" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "default_color" TEXT NOT NULL,
    "default_font" TEXT NOT NULL,
    "layout_json" TEXT NOT NULL,

    CONSTRAINT "template_styles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "template_styles" ADD CONSTRAINT "template_styles_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
