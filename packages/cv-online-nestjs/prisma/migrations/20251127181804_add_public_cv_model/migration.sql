-- CreateTable
CREATE TABLE "public_cvs" (
    "id" SERIAL NOT NULL,
    "cv_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "last_viewed" TIMESTAMP(3),

    CONSTRAINT "public_cvs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_cvs_cv_id_key" ON "public_cvs"("cv_id");

-- CreateIndex
CREATE UNIQUE INDEX "public_cvs_slug_key" ON "public_cvs"("slug");

-- AddForeignKey
ALTER TABLE "public_cvs" ADD CONSTRAINT "public_cvs_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
