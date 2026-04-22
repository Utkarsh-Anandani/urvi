import { GetUsersOrders } from "@/actions/order";
import { requireAuth } from "@/lib/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  const client = new QueryClient();

  await client.prefetchQuery({
    queryKey: ["user-orders"],
    queryFn: () => GetUsersOrders(),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
  );
}
