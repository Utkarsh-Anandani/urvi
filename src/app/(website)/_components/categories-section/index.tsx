"use client";
import { GetUserProducts } from "@/actions/product";
import { GoldDivider, SectionLabel, SectionTitle } from "../helper";
import { categoryFilters, categoryFilterSlugType } from "@/app/catalog/_components/category-panel";
import { useQueryData } from "@/hooks/useQueryData";
import { LATO } from "@/lib/helper";
import { useState } from "react";
import { ProductCard } from "@/components/global/global-product-card";
import { GetUserProductsResponse } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";

const ShopByCategory = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [activeCategory, setActiveCategory] = useState("all-products");
  const activeCategoryName =
    categoryFilters.find((f) => {
      return f.slug === activeCategory;
    })?.name || categoryFilters[0].name;

  const { data, isPending } = useQueryData(
    ["homepage-products", activeCategory],
    () => GetUserProducts({ filter: activeCategory as categoryFilterSlugType, limit: 8 }),
  );

  const { data: productsData } = data as GetUserProductsResponse;

  return (
    <section className="py-20 px-5 lg:px-8" style={{ background: "#fafaf8" }}>
      <div className="max-w-7xl mx-auto">
        <SectionLabel>Shop by Category</SectionLabel>
        <SectionTitle>
          Find Your <em>Wellness</em>
        </SectionTitle>
        <GoldDivider className="max-w-xs mx-auto mt-4 mb-12" />

        <div className="w-full max-w-screen h-full flex flex-col gap-5">
          <div className="w-full flex items-center justify-center gap-10 py-3 cursor-pointer">
            {categoryFilters.map((f) => (
              <div
                onClick={() => setActiveCategory(f.slug)}
                key={f.name}
                style={{
                  fontFamily: LATO,
                }}
                className="flex flex-col items-center justify-center text-xs gap-1"
              >
                <img
                  className="w-18 h-18 hover:scale-105 transition-transform ease-in-out duration-100"
                  src={
                    activeCategoryName === f.name
                      ? f.active_src
                      : f.inactive_src
                  }
                  alt="cat"
                />
                {f.name}
              </div>
            ))}
          </div>
          <div className="max-w-screen!">
            {/* 🔹 Products Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-3">
              {isPending ? [1,2,3,4,5,6,7,8].map((i) => <Skeleton key={i} className="h-80 bg-neutral-200" />) : productsData?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
