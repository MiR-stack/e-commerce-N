/*
  Warnings:

  - You are about to drop the column `sizes_id` on the `Order_item` table. All the data in the column will be lost.
  - Added the required column `size_id` to the `Order_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_sizes_id_fkey";

-- AlterTable
ALTER TABLE "Order_item" DROP COLUMN "sizes_id",
ADD COLUMN     "size_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
