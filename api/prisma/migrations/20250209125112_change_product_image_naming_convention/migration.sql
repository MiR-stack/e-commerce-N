/*
  Warnings:

  - You are about to drop the column `altText` on the `productImage` table. All the data in the column will be lost.
  - You are about to drop the column `isMain` on the `productImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "productImage" DROP COLUMN "altText",
DROP COLUMN "isMain",
ADD COLUMN     "alt_text" TEXT,
ADD COLUMN     "is_main" BOOLEAN NOT NULL DEFAULT false;
