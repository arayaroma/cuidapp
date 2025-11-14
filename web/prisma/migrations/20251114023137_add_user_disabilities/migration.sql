-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cuidapp";

-- CreateEnum
CREATE TYPE "cuidapp"."ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "cuidapp"."locations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "label" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "district" TEXT,
    "canton" TEXT,
    "province" TEXT,
    "country" TEXT,
    "postal_code" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."disabilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo_url" TEXT,
    "phone_number" TEXT,
    "emergency_number" TEXT,
    "disability_id" TEXT,
    "has_safeguard" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "rating" DOUBLE PRECISION,
    "rating_count" INTEGER DEFAULT 0,
    "role_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."assistants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "years_experience" INTEGER NOT NULL DEFAULT 0,
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability_schedule" TEXT,
    "available_weekdays" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hourly_rate" DOUBLE PRECISION,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "background_check" BOOLEAN NOT NULL DEFAULT false,
    "preferred_age_groups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "max_distance_km" INTEGER,
    "has_vehicle" BOOLEAN NOT NULL DEFAULT false,
    "has_first_aid" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."users_assistants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assistant_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."users_assistants_rule" (
    "id" TEXT NOT NULL,
    "users_assistant_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_assistants_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."user_assistant_applications" (
    "id" TEXT NOT NULL,
    "user_assistant_id" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_assistant_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."application_requests" (
    "id" TEXT NOT NULL,
    "user_assistant_application_id" TEXT NOT NULL,
    "user_request_id" TEXT NOT NULL,
    "status" "cuidapp"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."user_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Solicitud de cuidado',
    "description" TEXT NOT NULL,
    "care_type" TEXT NOT NULL DEFAULT 'companion',
    "person_age" INTEGER NOT NULL DEFAULT 0,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "urgency" TEXT NOT NULL DEFAULT 'medium',
    "hourly_rate" DOUBLE PRECISION,
    "total_hours" INTEGER,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "weekdays" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "request_date" TIMESTAMP(3) NOT NULL,
    "request_time" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidapp"."user_disabilities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "disability_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_disabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_user_id_key" ON "cuidapp"."locations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "cuidapp"."roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "disabilities_name_key" ON "cuidapp"."disabilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "cuidapp"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "cuidapp"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_user_id_key" ON "cuidapp"."assistants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_requests_user_assistant_application_id_user_req_key" ON "cuidapp"."application_requests"("user_assistant_application_id", "user_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_disabilities_user_id_disability_id_key" ON "cuidapp"."user_disabilities"("user_id", "disability_id");

-- AddForeignKey
ALTER TABLE "cuidapp"."locations" ADD CONSTRAINT "locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cuidapp"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."users" ADD CONSTRAINT "users_disability_id_fkey" FOREIGN KEY ("disability_id") REFERENCES "cuidapp"."disabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "cuidapp"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."assistants" ADD CONSTRAINT "assistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cuidapp"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."users_assistants" ADD CONSTRAINT "users_assistants_assistant_id_fkey" FOREIGN KEY ("assistant_id") REFERENCES "cuidapp"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."users_assistants" ADD CONSTRAINT "users_assistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cuidapp"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."users_assistants_rule" ADD CONSTRAINT "users_assistants_rule_users_assistant_id_fkey" FOREIGN KEY ("users_assistant_id") REFERENCES "cuidapp"."users_assistants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."user_assistant_applications" ADD CONSTRAINT "user_assistant_applications_user_assistant_id_fkey" FOREIGN KEY ("user_assistant_id") REFERENCES "cuidapp"."users_assistants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."application_requests" ADD CONSTRAINT "application_requests_user_assistant_application_id_fkey" FOREIGN KEY ("user_assistant_application_id") REFERENCES "cuidapp"."user_assistant_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."application_requests" ADD CONSTRAINT "application_requests_user_request_id_fkey" FOREIGN KEY ("user_request_id") REFERENCES "cuidapp"."user_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."user_requests" ADD CONSTRAINT "user_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cuidapp"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."user_disabilities" ADD CONSTRAINT "user_disabilities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cuidapp"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidapp"."user_disabilities" ADD CONSTRAINT "user_disabilities_disability_id_fkey" FOREIGN KEY ("disability_id") REFERENCES "cuidapp"."disabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
