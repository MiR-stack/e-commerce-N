/*
  Warnings:

  - You are about to drop the column `is_active` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_is_active_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "is_active",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Delevery_area" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Sizes" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "productImage" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';
