/*
  Warnings:

  - You are about to drop the `DeleveryArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DeleveryArea";

-- CreateTable
CREATE TABLE "Delevery_area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "charge" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delevery_area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delevery_area_name_key" ON "Delevery_area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Delevery_area_slug_key" ON "Delevery_area"("slug");
