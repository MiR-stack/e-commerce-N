/*
  Warnings:

  - You are about to drop the column `payment_methodId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payment_methodId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payment_methodId",
ADD COLUMN     "method" TEXT NOT NULL;
