-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;
