import { requireRole } from "@/lib/auth";
import React from "react";
import AdminDashboardLayout from "../../components/admin/admin-layout";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await requireRole('ADMIN');
  return (
    <AdminDashboardLayout>
      {children}
    </AdminDashboardLayout>
  );
}
