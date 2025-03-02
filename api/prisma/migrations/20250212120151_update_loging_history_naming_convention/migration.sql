/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `Login_history` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Login_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Login_history" DROP COLUMN "ipAddress",
DROP COLUMN "userAgent",
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "user_agent" TEXT;
