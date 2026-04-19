"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageCarousel from "../../_components/image-carousel";
import ProductInfo from "../../_components/product-info";
import ReviewsSection from "../../_components/reviews-section";
import FaqSection from "../../_components/faq-section";
import { LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import ComparisonSection from "../../_components/comparison-section";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUserProductDetails } from "@/actions/product";
import { GetUserProductDetailsResponse, Variant } from "@/types/product.types";
import { useState } from "react";

type Props = {
  slug: string;
  isLoggedIn: boolean;
};

const ProductClient = ({ slug, isLoggedIn }: Props) => {
  const { data, isFetched, isFetching } = useQueryData(
    ["product-detail", slug],
    () => GetUserProductDetails(slug),
  );

  const { data: productDetail } = data as GetUserProductDetailsResponse;
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    productDetail.variants[0],
  );

  return (
    <div
      style={{ fontFamily: LATO, background: "#fff", color: "#2a1a10" }}
      className="min-h-screen"
    >
      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 gap-12 items-start">
        <ImageCarousel
          category={productDetail.category?.name || null}
          images={productDetail?.images || []}
        />
        <ProductInfo
          product={productDetail}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          isLoggedIn={isLoggedIn}
          slug={slug}
        />
      </main>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <Tabs defaultValue="comparison">
          <TabsList
            className="mb-10 mx-auto flex w-fit rounded-full p-1"
            style={{ background: LIGHTER_ORANGE }}
          >
            {["comparison", "faq"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full px-7 py-2 text-sm font-bold capitalize data-[state=active]:shadow-sm"
                style={
                  {
                    fontFamily: LATO,
                    "--tw-ring-color": ORANGE,
                  } as React.CSSProperties
                }
              >
                {tab === "comparison" ? "Oil Comparison" : "FAQs"}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="comparison">
            <ComparisonSection />
          </TabsContent>
          <TabsContent value="faq">
            <FaqSection />
          </TabsContent>
        </Tabs>
      </section>

      <ReviewsSection
        reviews={productDetail?.reviews ? productDetail.reviews : []}
        productId={productDetail.id}
        variantId={selectedVariant.id}
        avgRating={productDetail.avgRating}
        reviewCount={productDetail.reviewCount}
        slug={slug}
      />
    </div>
  );
};

export default ProductClient;
