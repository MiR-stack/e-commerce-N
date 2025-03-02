-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_color_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_size_id_fkey";

-- AlterTable
ALTER TABLE "Order_item" ALTER COLUMN "color_id" DROP NOT NULL,
ALTER COLUMN "size_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
