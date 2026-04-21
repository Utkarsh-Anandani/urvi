import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CategoryPanel, { categoryFilterSlugType } from "../_components/category-panel";
import ProductsSection from "../_components/products-section";
import { GetUserProducts } from "@/actions/product";
// import PageHeader from "../_components/page-header";
import { getSession } from "@/lib/auth";

type Props = {
  params: Promise<{ slug: string }>;
};

const page = async ({ params }: Props) => {
  const { slug = "all-products" } = await params;
  const session = await getSession();
  const client = new QueryClient();

  await client.prefetchInfiniteQuery({
    queryKey: ["products", slug],
    queryFn: async ({ pageParam }) =>
      GetUserProducts({
        filter: slug as categoryFilterSlugType,
        cursor: pageParam,
        limit: 12,
      }),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="w-full max-w-screen h-full flex flex-col gap-5 py-16">
        <CategoryPanel activePath={slug} />
        {/* <PageHeader slug={slug} /> */}
        <ProductsSection isLoggedIn={session.loggedIn} activePath={slug} />
      </div>
    </HydrationBoundary>
  );
};

export default page;
