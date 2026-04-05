-- CreateTable
CREATE TABLE "cv_interests" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_activities" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_interests_cv_id_idx" ON "cv_interests"("cv_id");

-- CreateIndex
CREATE INDEX "cv_interests_cv_id_display_order_idx" ON "cv_interests"("cv_id", "display_order");

-- CreateIndex
CREATE INDEX "cv_activities_cv_id_idx" ON "cv_activities"("cv_id");

-- CreateIndex
CREATE INDEX "cv_activities_cv_id_display_order_idx" ON "cv_activities"("cv_id", "display_order");

-- AddForeignKey
ALTER TABLE "cv_interests" ADD CONSTRAINT "cv_interests_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_activities" ADD CONSTRAINT "cv_activities_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
