/*
  Warnings:

  - Changed the type of `imageData` on the `productImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "productImage" DROP COLUMN "imageData",
ADD COLUMN     "imageData" JSONB NOT NULL;
