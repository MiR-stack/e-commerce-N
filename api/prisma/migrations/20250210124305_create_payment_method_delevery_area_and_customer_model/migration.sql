-- CreateTable
CREATE TABLE "Payment_method" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeleveryArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "charge" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeleveryArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_method_name_key" ON "Payment_method"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_method_slug_key" ON "Payment_method"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DeleveryArea_name_key" ON "DeleveryArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DeleveryArea_slug_key" ON "DeleveryArea"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_ip_key" ON "Customer"("ip");

-- CreateIndex
CREATE INDEX "Customer_ip_idx" ON "Customer"("ip");

-- CreateIndex
CREATE INDEX "Customer_isBlocked_idx" ON "Customer"("isBlocked");
