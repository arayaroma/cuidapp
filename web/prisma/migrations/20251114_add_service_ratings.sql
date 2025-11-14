-- DropForeignKey
ALTER TABLE "cuidapp"."user_disabilities" DROP CONSTRAINT "user_disabilities_disability_id_fkey";

-- DropForeignKey
ALTER TABLE "cuidapp"."user_disabilities" DROP CONSTRAINT "user_disabilities_user_id_fkey";

-- DropTable
DROP TABLE "cuidapp"."user_disabilities";

-- CreateTable
CREATE TABLE "cuidapp"."service_ratings" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "rater_id" TEXT NOT NULL,
    "rated_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "would_recommend" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_ratings_pkey" PRIMARY KEY ("id")
);

