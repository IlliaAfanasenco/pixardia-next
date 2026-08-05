-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('WEBSITE', 'WEB_APP', 'MOBILE_APP', 'UI_UX_DESIGN', 'TELEGRAM_MINI_APP', 'AI_AUTOMATION', 'SEO', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_PROCESS', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "serviceType" "ServiceType",
    "serviceSlug" TEXT,
    "page" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
