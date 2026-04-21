"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MoreVertical,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import { OrderStatusBadge } from "./orders/page";
import React from "react";
import { BROWN, fmt, ORANGE } from "@/lib/helper";
import { useQueryData } from "@/hooks/useQueryData";
import { GetAdminDashboardStats } from "@/actions/admin";
import { GetAdminDashboardStatsReturnType } from "@/types/admin.types";

export const PRODUCTS = [
  {
    id: "P001",
    name: "Organic Green Tea",
    category: "Beverages",
    price: "$24.99",
    stock: 128,
    status: "Active",
    rating: 4.8,
  },
  {
    id: "P002",
    name: "Golden Turmeric Blend",
    category: "Supplements",
    price: "$34.50",
    stock: 56,
    status: "Active",
    rating: 4.6,
  },
  {
    id: "P003",
    name: "Herbal Face Serum",
    category: "Skincare",
    price: "$58.00",
    stock: 0,
    status: "Out of Stock",
    rating: 4.9,
  },
  {
    id: "P004",
    name: "Matcha Powder 100g",
    category: "Beverages",
    price: "$18.00",
    stock: 204,
    status: "Active",
    rating: 4.7,
  },
  {
    id: "P005",
    name: "Rose Hip Oil",
    category: "Skincare",
    price: "$42.00",
    stock: 14,
    status: "Low Stock",
    rating: 4.5,
  },
  {
    id: "P006",
    name: "Ashwagandha Capsules",
    category: "Supplements",
    price: "$29.99",
    stock: 89,
    status: "Active",
    rating: 4.4,
  },
];

export const ORDERS = [
  {
    id: "#ORD-8821",
    customer: "Priya Sharma",
    date: "14 Mar 2026",
    amount: "$134.00",
    items: 3,
    status: "Delivered",
  },
  {
    id: "#ORD-8820",
    customer: "Arjun Mehta",
    date: "14 Mar 2026",
    amount: "$58.00",
    items: 1,
    status: "Shipped",
  },
  {
    id: "#ORD-8819",
    customer: "Sofia Patel",
    date: "13 Mar 2026",
    amount: "$210.50",
    items: 5,
    status: "Processing",
  },
  {
    id: "#ORD-8818",
    customer: "Kabir Das",
    date: "13 Mar 2026",
    amount: "$76.00",
    items: 2,
    status: "Delivered",
  },
  {
    id: "#ORD-8817",
    customer: "Ananya Roy",
    date: "12 Mar 2026",
    amount: "$49.99",
    items: 1,
    status: "Cancelled",
  },
  {
    id: "#ORD-8816",
    customer: "Riya Verma",
    date: "12 Mar 2026",
    amount: "$188.00",
    items: 4,
    status: "Shipped",
  },
  {
    id: "#ORD-8815",
    customer: "Dev Kapoor",
    date: "11 Mar 2026",
    amount: "$34.50",
    items: 1,
    status: "Processing",
  },
];

export const ActionMenu = ({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-50">
        <MoreVertical size={15} className="text-gray-400" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="text-sm">
      {onEdit && (
        <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer">
          <Pencil size={13} /> Edit
        </DropdownMenuItem>
      )}
      {onDelete && (
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 cursor-pointer text-red-500 focus:text-red-500"
        >
          <Trash2 className="text-red-500!" size={13} /> Delete
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export const PageHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2
        className="text-2xl"
        style={{
          color: "#111827",
          fontFamily: "'Lato', sans-serif",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm text-gray-400 mt-0.5"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

export const GoldDivider = () => (
  <div className="flex items-center gap-2 my-1">
    <div
      className="h-px flex-1"
      style={{
        background: `linear-gradient(to right, transparent, ${BROWN}60)`,
      }}
    />
    <svg width="10" height="10" viewBox="0 0 16 16" fill={BROWN}>
      <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
    </svg>
    <div
      className="h-px flex-1"
      style={{
        background: `linear-gradient(to left, transparent, ${BROWN}60)`,
      }}
    />
  </div>
);

const AdminDashboard = () => {
  const { data } = useQueryData(["admin-dashboard-stats"], () =>
    GetAdminDashboardStats(),
  );
  const { data: dashboardStats } =
    data as GetAdminDashboardStatsReturnType;

  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Admin. Here's what's happening today."
        action={<></>}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card
          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-widest text-gray-400 mb-1"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Total Revenue
                </p>
                <p
                  className="text-2xl font-light"
                  style={{
                    color: "#111",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {fmt(dashboardStats.stats.totalEarnings)}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${BROWN}15` }}
              >
                <DollarSign size={18} style={{ color: BROWN }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-widest text-gray-400 mb-1"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Total Orders
                </p>
                <p
                  className="text-2xl font-light"
                  style={{
                    color: "#111",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {dashboardStats.stats.totalOrders}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${BROWN}15` }}
              >
                <ShoppingCart size={18} style={{ color: BROWN }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-widest text-gray-400 mb-1"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Products
                </p>
                <p
                  className="text-2xl font-light"
                  style={{
                    color: "#111",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {dashboardStats.stats.totalProducts}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${BROWN}15` }}
              >
                <Package size={18} style={{ color: BROWN }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-widest text-gray-400 mb-1"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Customers
                </p>
                <p
                  className="text-2xl font-light"
                  style={{
                    color: "#111",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {dashboardStats.stats.totalCustomers}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${BROWN}15` }}
              >
                <Users size={18} style={{ color: BROWN }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <Card
          className="xl:col-span-2 border-0 shadow-sm"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardHeader className="pb-3 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-base font-semibold text-gray-700"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Recent Orders
              </CardTitle>
              <a
                href="/admin/orders"
                className="text-xs cursor-pointer hover:opacity-70"
                style={{
                  color: ORANGE,
                  fontFamily: "'Lato', sans-serif",
                  borderBottom: `1px solid ${ORANGE}50`,
                }}
              >
                View all
              </a>
            </div>
            <GoldDivider />
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  {["Order", "Customer", "Amount", "Status"].map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs uppercase tracking-wider text-gray-400 font-semibold pb-2"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardStats.recentOrders.map((o) => (
                  <TableRow
                    key={o.id}
                    className="border-gray-50 hover:bg-green-50/30 transition-colors"
                  >
                    <TableCell
                      className="font-semibold text-sm py-3"
                      style={{
                        color: ORANGE,
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      {o.id.slice(0, 4).toUpperCase()}
                    </TableCell>
                    <TableCell
                      className="text-sm text-gray-600 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {o.customerName}
                    </TableCell>
                    <TableCell
                      className="text-sm font-semibold text-gray-700 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {fmt(o.finalAmount)}
                    </TableCell>
                    <TableCell className="py-3">
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card
          className="border-0 shadow-sm"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardHeader className="pb-3 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-base font-semibold text-gray-700"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Top Products
              </CardTitle>
              <TrendingUp size={16} style={{ color: ORANGE }} />
            </div>
            <GoldDivider />
          </CardHeader>
          <CardContent className="px-6 pb-5 space-y-4">
            {dashboardStats.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span
                  className="text-xs font-bold w-5 text-center"
                  style={{ color: BROWN, fontFamily: "'Lato', sans-serif" }}
                >
                  {i + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
                  style={{ background: `${ORANGE}10` }}
                >
                  <Package size={14} style={{ color: BROWN }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold text-gray-700 truncate"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="text-xs text-gray-400"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.category}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ color: BROWN, fontFamily: "'Lato', sans-serif" }}
                  >
                    {fmt(p?.discountPrice || p.price)}
                  </p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={10} fill={ORANGE} color={ORANGE} />
                    <span
                      className="text-xs text-gray-400"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminDashboard;
