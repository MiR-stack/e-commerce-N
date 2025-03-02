/*
  Warnings:

  - You are about to drop the column `isBlocked` on the `Customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Customer_isBlocked_idx";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "isBlocked",
ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Customer_is_blocked_idx" ON "Customer"("is_blocked");
