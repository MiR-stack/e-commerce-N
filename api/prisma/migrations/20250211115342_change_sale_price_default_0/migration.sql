/*
  Warnings:

  - Made the column `sale_price` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "sale_price" SET NOT NULL,
ALTER COLUMN "sale_price" SET DEFAULT 0;
