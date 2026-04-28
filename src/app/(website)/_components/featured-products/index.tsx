"use client";
import { useRef } from "react";
import {
  GoldDivider,
  SectionLabel,
  SectionTitle,
} from "../helper";
import { GOLD, LATO, ORANGE } from "@/lib/helper";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUserProducts } from "@/actions/product";
import { GetUserProductsResponse } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/global/global-product-card";
import { useRouter } from "next/navigation";
import { categoryFilterSlugType } from "@/app/catalog/_components/category-panel";

const FeaturedProducts = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isPending } = useQueryData(
    ["homepage-products", "all-products"],
    () => GetUserProducts({ filter: "all-products" as categoryFilterSlugType, limit: 8 }),
  );

  const { data: productsData } = data as GetUserProductsResponse;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "right" ? 320 : -320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 md:py-20 px-5 lg:px-8" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 md:mb-12">
          <div>
            <SectionLabel>Our Products</SectionLabel>
            <SectionTitle>
              Featured <em>Picks</em>
            </SectionTitle>
            <GoldDivider className="max-w-xs mt-4" />
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: `${GOLD}50`,
                color: GOLD,
                background: "#fff",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: `${GOLD}50`,
                color: GOLD,
                background: "#fff",
              }}
            >
              <ChevronRight size={18} />
            </button>
            <Button
              onClick={() => router.push('/catalog/all-products')}
              variant="outline"
              className="ml-2 h-10 text-xs uppercase tracking-wider rounded-sm font-semibold"
              style={{
                borderColor: `${ORANGE}`,
                color: ORANGE,
                fontFamily: LATO,
              }}
            >
              View All
            </Button>
          </div>
        </div>

        {/* Scrollable product row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isPending
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-80 bg-neutral-200" />
              ))
            : productsData?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
