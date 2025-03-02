-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "admin_id" TEXT;

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "admin_id" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "admin_id" TEXT;

-- AlterTable
ALTER TABLE "Sizes" ADD COLUMN     "admin_id" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sizes" ADD CONSTRAINT "Sizes_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
