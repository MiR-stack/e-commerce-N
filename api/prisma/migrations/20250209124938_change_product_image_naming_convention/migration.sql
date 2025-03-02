/*
  Warnings:

  - You are about to drop the column `imageData` on the `productImage` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `productImage` table. All the data in the column will be lost.
  - Added the required column `image_data` to the `productImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `productImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "productImage" DROP CONSTRAINT "productImage_productId_fkey";

-- AlterTable
ALTER TABLE "productImage" DROP COLUMN "imageData",
DROP COLUMN "productId",
ADD COLUMN     "image_data" JSONB NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "productImage" ADD CONSTRAINT "productImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
