"use client";
import { BROWN, CORMORANT } from "@/lib/helper";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUserProducts } from "@/actions/product";
import { GetUserProductsResponse } from "@/types/product.types";
import { ProductCard } from "@/components/global/global-product-card";

const SuggestedProducts = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { data } = useQueryData(["homepage-products", "all-products"], () => GetUserProducts({
    filter: "all-products",
    limit: 2
  }));

  const { data: suggestedProducts } = data as GetUserProductsResponse;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-5">
        <span
          style={{
            fontFamily: CORMORANT,
            fontSize: 26,
            fontWeight: 600,
            color: BROWN,
          }}
        >
          You Might Also Love
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, #f0e6dc, transparent)" }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {suggestedProducts.slice(0, 2).map((p) => (
          <ProductCard key={p.id} product={p} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </section>
  );
}

export default SuggestedProducts;