-- CreateTable
CREATE TABLE "ProductPageSection" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "type" "MediaType" NOT NULL,
    "mediaURL" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductPageSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPageSection" ADD CONSTRAINT "ProductPageSection_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
