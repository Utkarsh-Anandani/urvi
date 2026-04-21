"use client";

import { GetUserProducts } from "@/actions/product";
import { ProductCard } from "@/components/global/global-product-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { categoryFilterSlugType } from "../category-panel";

const ProductsSection = ({ activePath, isLoggedIn }: { activePath: string, isLoggedIn: boolean }) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products", activePath],

    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      GetUserProducts({
        filter: activePath as categoryFilterSlugType,
        cursor: pageParam,
        limit: 12,
      }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // 🔥 Infinite Scroll Observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-screen!">
      {/* 🔹 Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-3">
        {data?.pages
          .flatMap((page) => page.data)
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLoggedIn={isLoggedIn}
            />
          ))}
      </div>

      {/* 🔹 Invisible trigger for infinite scroll */}
      <div ref={loadMoreRef} className="h-10" />

      {/* 🔹 Optional fallback button */}
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 border rounded-lg"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;