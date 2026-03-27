/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `ProductImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productVariantId_fkey";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "productVariantId";

-- CreateTable
CREATE TABLE "ProductVariantImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "ProductVariantImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductVariantImage" ADD CONSTRAINT "ProductVariantImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
