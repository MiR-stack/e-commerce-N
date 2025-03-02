/*
  Warnings:

  - Added the required column `delivery_area_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `Order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizes_id` to the `Order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "delivery_area_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order_item" ADD COLUMN     "color_id" TEXT NOT NULL,
ADD COLUMN     "sizes_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_delivery_area_id_fkey" FOREIGN KEY ("delivery_area_id") REFERENCES "Delevery_area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_sizes_id_fkey" FOREIGN KEY ("sizes_id") REFERENCES "Sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
