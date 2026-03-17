"use client";
import { useState } from "react";
import {
  ActionMenu,
  GoldDivider,
  GREEN,
  GREEN_LIGHT,
  ORDERS,
  PageHeader,
} from "../page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleCheck, Clock, Truck, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const map = {
    Delivered: { bg: "#dcfce7", color: "#166534", icon: CircleCheck },
    Shipped: { bg: "#dbeafe", color: "#1d4ed8", icon: Truck },
    Processing: { bg: "#fef9c3", color: "#854d0e", icon: Clock },
    Cancelled: { bg: "#fee2e2", color: "#991b1b", icon: XCircle },
  };
  const cfg = map[status] || { bg: "#f3f4f6", color: "#374151", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <Icon size={11} /> {status}
    </span>
  );
};

const Orders = () => {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered =
    filter === "All" ? ORDERS : ORDERS.filter((o) => o.status === filter);
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Orders"
        subtitle={`${ORDERS.length} total orders`}
        action={<></>}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              fontFamily: "'Lato', sans-serif",
              background:
                filter === s
                  ? `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`
                  : "#f9fafb",
              color: filter === s ? "#fff" : "#6b7280",
              border: filter === s ? "none" : "1px solid #e5e7eb",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <Card
        className="border-0 shadow-sm"
        style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
      >
        <CardHeader className="pb-3 pt-5 px-6">
          <GoldDivider />
        </CardHeader>
        <CardContent className="px-6 pb-5">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Items",
                  "Amount",
                  "Status",
                  "",
                ].map((h) => (
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
              {filtered.map((o) => (
                <TableRow
                  key={o.id}
                  className="border-gray-50 hover:bg-green-50/30 transition-colors"
                >
                  <TableCell
                    className="font-semibold text-sm py-3"
                    style={{ color: GREEN, fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.id}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-700 font-semibold py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.customer}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.date}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.items} item{o.items > 1 ? "s" : ""}
                  </TableCell>
                  <TableCell
                    className="text-sm font-bold py-3"
                    style={{ color: "#111", fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.amount}
                  </TableCell>
                  <TableCell className="py-3">
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    <ActionMenu />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default Orders;
