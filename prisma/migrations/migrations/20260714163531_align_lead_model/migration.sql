/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `page` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `privacyAcceptedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceCode` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Made the column `serviceSlug` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ServiceCode" AS ENUM ('BUSINESS_WEBSITE', 'LANDING_PAGE', 'WEB_APPLICATION', 'ECOMMERCE', 'WEBSITE_REDESIGN', 'UI_UX_DESIGN', 'AI_AUTOMATION', 'MAINTENANCE_SUPPORT');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "ipAddress",
DROP COLUMN "page",
DROP COLUMN "serviceId",
DROP COLUMN "serviceType",
DROP COLUMN "userAgent",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "serviceCode" "ServiceCode" NOT NULL,
ADD COLUMN     "sourcePage" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "serviceSlug" SET NOT NULL;

-- DropEnum
DROP TYPE "ServiceType";

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_serviceCode_idx" ON "Lead"("serviceCode");
