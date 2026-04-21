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
import { Metadata } from "next";
import {
  GetAdminCustomers,
  GetAdminDashboardStats,
  GetAdminOrders,
} from "@/actions/admin";
import { OrderStatus } from "@/generated/enums";

export const metadata: Metadata = {
  title: "Admin | Urvi",
  description: "Admin panel for Urvi",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("ADMIN");
  const client = new QueryClient();

  const statuses = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];

  await client.prefetchQuery({
    queryKey: ["admin-products"],
    queryFn: () => GetAdminProducts(),
  });

  await client.prefetchQuery({
    queryKey: ["admin-categories"],
    queryFn: () => GetAdminCategories(),
  });

  await client.prefetchQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => GetAdminDashboardStats(),
  });

  await Promise.all(
    statuses.map((s) =>
      client.prefetchQuery({
        queryKey: ["admin-orders", s],
        queryFn: () => GetAdminOrders(s as OrderStatus),
      }),
    ),
  );

  await client.prefetchQuery({
    queryKey: ["admin-customers"],
    queryFn: () => GetAdminCustomers(),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </HydrationBoundary>
  );
}
