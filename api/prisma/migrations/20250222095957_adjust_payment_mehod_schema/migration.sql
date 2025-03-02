/*
  Warnings:

  - You are about to drop the column `slug` on the `Payment_method` table. All the data in the column will be lost.
  - Added the required column `image_data` to the `Payment_method` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_method_slug_key";

-- AlterTable
ALTER TABLE "Payment_method" DROP COLUMN "slug",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image_data" JSONB NOT NULL;
