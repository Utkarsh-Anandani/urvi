import { requireRole } from "@/lib/auth";
import React from "react";
import AdminDashboardLayout from "../../components/admin/admin-layout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetAdminProducts } from "@/actions/product";
import { GetAdminCategories } from "@/actions/category";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("ADMIN");
  const client = new QueryClient();

  await client.prefetchQuery({
    queryKey: ["admin-products"],
    queryFn: () => GetAdminProducts(),
  });

  await client.prefetchQuery({
    queryKey: ["admin-categories"],
    queryFn: () => GetAdminCategories()
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </HydrationBoundary>
  );
}
