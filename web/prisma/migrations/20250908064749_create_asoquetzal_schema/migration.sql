-- CreateEnum
CREATE TYPE "asoquetzal"."TimeEntryKind" AS ENUM ('CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END', 'NOTE');

-- CreateEnum
CREATE TYPE "asoquetzal"."AbsenceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "asoquetzal"."ReportType" AS ENUM ('ATTENDANCE', 'ABSENCE', 'SCHEDULE', 'PERFORMANCE');

-- CreateTable
CREATE TABLE "asoquetzal"."locations" (
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
CREATE TABLE "asoquetzal"."roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."disabilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp_token" TEXT,
    "photo_url" TEXT,
    "phone_number" TEXT,
    "emergency_number" TEXT,
    "disability_id" TEXT,
    "has_safeguard" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "role_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."users_assistants" (
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
CREATE TABLE "asoquetzal"."users_assistants_rule" (
    "id" TEXT NOT NULL,
    "users_assistant_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_assistants_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."schedules" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "user_assistant_id" TEXT NOT NULL,
    "applies_role" TEXT,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."schedule_user_assistant" (
    "id" TEXT NOT NULL,
    "user_assistant_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_user_assistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."schedules_rules" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "required_role" TEXT,
    "max_hours" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."schedules_exceptions" (
    "id" TEXT NOT NULL,
    "schedule_user_assis_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time_overrides" JSONB,
    "is_cancellation" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."attendance_sessions" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "scheduled_rule_id" TEXT NOT NULL,
    "clock_in_at" TIMESTAMP(3) NOT NULL,
    "clock_out_at" TIMESTAMP(3),
    "total_hours" DOUBLE PRECISION,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."time_entries" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "kind" "asoquetzal"."TimeEntryKind" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."absence_forms" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "requested_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "status" "asoquetzal"."AbsenceStatus" NOT NULL DEFAULT 'PENDING',
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "supporting_uri" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absence_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."attendance_forms" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "filled_by" TEXT NOT NULL,
    "filled_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asoquetzal"."generated_reports" (
    "id" TEXT NOT NULL,
    "report_type" "asoquetzal"."ReportType" NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "filters" JSONB,
    "file_uri" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_user_id_key" ON "asoquetzal"."locations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "asoquetzal"."roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "disabilities_name_key" ON "asoquetzal"."disabilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "asoquetzal"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "asoquetzal"."users"("email");

-- AddForeignKey
ALTER TABLE "asoquetzal"."locations" ADD CONSTRAINT "locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "asoquetzal"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."users" ADD CONSTRAINT "users_disability_id_fkey" FOREIGN KEY ("disability_id") REFERENCES "asoquetzal"."disabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."users_assistants" ADD CONSTRAINT "users_assistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."users_assistants" ADD CONSTRAINT "users_assistants_assistant_id_fkey" FOREIGN KEY ("assistant_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."users_assistants_rule" ADD CONSTRAINT "users_assistants_rule_users_assistant_id_fkey" FOREIGN KEY ("users_assistant_id") REFERENCES "asoquetzal"."users_assistants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedules" ADD CONSTRAINT "schedules_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedules" ADD CONSTRAINT "schedules_user_assistant_id_fkey" FOREIGN KEY ("user_assistant_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedules" ADD CONSTRAINT "schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "asoquetzal"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedule_user_assistant" ADD CONSTRAINT "schedule_user_assistant_user_assistant_id_fkey" FOREIGN KEY ("user_assistant_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedule_user_assistant" ADD CONSTRAINT "schedule_user_assistant_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "asoquetzal"."schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedules_rules" ADD CONSTRAINT "schedules_rules_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "asoquetzal"."schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."schedules_exceptions" ADD CONSTRAINT "schedules_exceptions_schedule_user_assis_id_fkey" FOREIGN KEY ("schedule_user_assis_id") REFERENCES "asoquetzal"."schedule_user_assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."attendance_sessions" ADD CONSTRAINT "attendance_sessions_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "asoquetzal"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."attendance_sessions" ADD CONSTRAINT "attendance_sessions_scheduled_rule_id_fkey" FOREIGN KEY ("scheduled_rule_id") REFERENCES "asoquetzal"."schedules_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."time_entries" ADD CONSTRAINT "time_entries_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "asoquetzal"."attendance_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."absence_forms" ADD CONSTRAINT "absence_forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "asoquetzal"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."absence_forms" ADD CONSTRAINT "absence_forms_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "asoquetzal"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."absence_forms" ADD CONSTRAINT "absence_forms_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "asoquetzal"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."attendance_forms" ADD CONSTRAINT "attendance_forms_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "asoquetzal"."attendance_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."attendance_forms" ADD CONSTRAINT "attendance_forms_filled_by_fkey" FOREIGN KEY ("filled_by") REFERENCES "asoquetzal"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."generated_reports" ADD CONSTRAINT "generated_reports_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "asoquetzal"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asoquetzal"."generated_reports" ADD CONSTRAINT "generated_reports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "asoquetzal"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
