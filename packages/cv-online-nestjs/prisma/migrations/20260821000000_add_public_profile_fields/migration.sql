ALTER TABLE "users"
ADD COLUMN "profile_is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "profile_view_count" INTEGER NOT NULL DEFAULT 0;
