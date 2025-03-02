/*
  Warnings:

  - You are about to drop the column `customer_ip` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customer_ip_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customer_ip";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;
