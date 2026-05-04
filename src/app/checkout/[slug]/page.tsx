import { requireAuth } from "@/lib/auth";
import CheckoutPageClient from "../_components/checkout-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBuyNowItem } from "@/lib/buy-now";
import { GetCartItems, GetLocalCartItems } from "@/actions/cart";
import { toast } from "sonner";

type Props = {
  params: Promise<{ slug: string }>;
};

async function CheckoutPage({ params }: Props) {
  const session = await requireAuth();
  if(!session || !session.id) toast("Log In to proceed");
  const { slug } = await params;

  const client = new QueryClient();

  await client.prefetchQuery({
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

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <CheckoutPageClient slug={slug === "buy-now" ? "buy-now" : "cart"} />
    </HydrationBoundary>
  );
}

export default CheckoutPage;
