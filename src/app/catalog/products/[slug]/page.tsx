import { Star } from "lucide-react";
import { LIGHT_ORANGE, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetUserProductDetails } from "@/actions/product";
import ProductClient from "../../_components/product-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={
            i <= Math.floor(rating)
              ? ORANGE
              : i - 0.5 <= rating
                ? LIGHT_ORANGE
                : "none"
          }
          stroke={i <= rating ? ORANGE : LIGHTER_ORANGE}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const client = new QueryClient();

  await client.prefetchQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => GetUserProductDetails(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <ProductClient slug={slug} />
    </HydrationBoundary>
  );
};

export default ProductPage;
