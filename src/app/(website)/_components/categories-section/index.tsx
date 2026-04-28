"use client";
import { GetUserProducts } from "@/actions/product";
import { GoldDivider, SectionLabel, SectionTitle } from "../helper";
import {
  categoryFilters,
  categoryFilterSlugType,
} from "@/app/catalog/_components/category-panel";
import { useQueryData } from "@/hooks/useQueryData";
import { LATO } from "@/lib/helper";
import { useState } from "react";
import { ProductCard } from "@/components/global/global-product-card";
import { GetUserProductsResponse } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";

const ShopByCategory = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [activeCategory, setActiveCategory] = useState("all-products");

  const activeCategoryName =
    categoryFilters.find((f) => f.slug === activeCategory)?.name ||
    categoryFilters[0].name;

  const { data, isPending } = useQueryData(
    ["homepage-products", activeCategory],
    () =>
      GetUserProducts({
        filter: activeCategory as categoryFilterSlugType,
        limit: 8,
      }),
  );

  const { data: productsData } = data as GetUserProductsResponse;

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto">
        <SectionLabel>Shop by Category</SectionLabel>

        <SectionTitle>
          Find Your <em>Wellness</em>
        </SectionTitle>

        <GoldDivider className="max-w-xs mx-auto mt-4 mb-10 md:mb-12" />

        {/* 🔹 Category Scroll */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex gap-6 sm:gap-8 md:gap-10 px-1 min-w-max items-center justify-center">
            {categoryFilters.map((f) => (
              <div
                key={f.name}
                onClick={() => setActiveCategory(f.slug)}
                style={{ fontFamily: LATO }}
                className="flex flex-col items-center justify-center text-xs sm:text-sm gap-1 cursor-pointer shrink-0"
              >
                <img
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 
                  hover:scale-105 transition-transform duration-150"
                  src={
                    activeCategoryName === f.name
                      ? f.active_src
                      : f.inactive_src
                  }
                  alt={f.name}
                />
                <span className="whitespace-nowrap">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 Products Grid */}
        <div className="mt-6 md:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {isPending
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-64 sm:h-72 md:h-80 bg-neutral-200 rounded-md"
                  />
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
      </div>
    </section>
  );
};

export default ShopByCategory;
