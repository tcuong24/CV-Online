-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_template_id_fkey";

-- AlterTable
ALTER TABLE "cvs" ALTER COLUMN "template_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
