"use client";
import ImageCarousel from "../../_components/image-carousel";
import ProductInfo from "../../_components/product-info";
import ReviewsSection from "../../_components/reviews-section";
import FaqSection from "../../_components/faq-section";
import { LATO, ORANGE } from "@/lib/helper";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUserProductDetails } from "@/actions/product";
import { GetUserProductDetailsResponse, Variant } from "@/types/product.types";
import { useState } from "react";
import SectionHeading from "../section-heading";
import Image from "next/image";

type Props = {
  slug: string;
  isLoggedIn: boolean;
};

const ProductClient = ({ slug, isLoggedIn }: Props) => {
  const { data } = useQueryData(["product-detail", slug], () =>
    GetUserProductDetails(slug),
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
      <main className="max-w-6xl mx-auto px-3 py-3 lg:py-6 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="hidden lg:block">
        <ImageCarousel
          category={productDetail.category?.name || null}
          images={productDetail?.images || []}
        />
        </div>
        <ProductInfo
          product={productDetail}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          isLoggedIn={isLoggedIn}
          slug={slug}
        />
      </main>

      <section className="py-2 lg:py-6 max-w-6xl mx-auto">
        {productDetail.productPageSections?.map((section) => (
          <div key={section.id} className="py-2 lg:py-6 w-full">
            {section?.title && (
              <SectionHeading>
                {section.title.split(" ")[0]}{" "}
                <em style={{ color: ORANGE, fontStyle: "italic" }}>
                  {section.title.split(" ")[1]}
                </em>
              </SectionHeading>
            )}
            {/* {section?.subtitle && (
              <p className="text-center text-gray-500 mt-2">
                {section.subtitle}
              </p>
            )} */}

            <div className="mt-6">
              {section.type === "IMAGE" && (
                <div className="w-screen max-w-6xl mx-auto aspect-video relative">
                  <Image
                    src={section.mediaURL}
                    alt={section.title || "section-image"}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              )}

              {section.type === "VIDEO" && (
                <video
                  src={section.mediaURL}
                  controls
                  className="w-full rounded-md"
                />
              )}
            </div>
          </div>
        ))}

        <FaqSection />
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
