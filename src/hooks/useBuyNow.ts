import { GetCartItems, GetLocalCartItems } from "@/actions/cart";
import { getBuyNowItem } from "@/lib/buy-now";
import { useQuery } from "@tanstack/react-query";

export const useBuyNow = (slug: "cart" | "buy-now") => {
  return useQuery({
    queryKey: ["order-items"],
    queryFn: async () => {
      if (slug === "buy-now") {
        const data = getBuyNowItem();
        if (!data) {
          return {
            status: 200,
            data: {
              totalQuantity: 0,
              netPriceTotal: 0,
              netDiscountPriceTotal: 0,
              cartItems: [],
            },
          };
        }

        const res = await GetLocalCartItems([data]);
        if (res) {
          return res;
        }
      }

      const data = await GetCartItems();
      if (data) {
        return data;
      }

      return {
        status: 200,
        data: null,
      };
    },
  });
};