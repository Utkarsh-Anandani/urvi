"use server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetUserProductDetails } from "@/actions/product";
import ProductClient from "../../_components/product-client";
import { getSession } from "@/lib/auth";

type Props = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const client = new QueryClient();
  const session = await getSession();

  await client.prefetchQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => GetUserProductDetails(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <ProductClient slug={slug} isLoggedIn={session.loggedIn} />
    </HydrationBoundary>
  );
};

export default ProductPage;
