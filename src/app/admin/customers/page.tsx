"use client";
import { useState } from "react";
import { ActionMenu, GoldDivider, GREEN, PageHeader } from "../page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CUSTOMERS = [
  {
    id: "C001",
    name: "Priya Sharma",
    email: "priya@example.com",
    orders: 14,
    spent: "$1,245",
    joined: "Jan 2025",
    status: "VIP",
  },
  {
    id: "C002",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    orders: 6,
    spent: "$420",
    joined: "Mar 2025",
    status: "Active",
  },
  {
    id: "C003",
    name: "Sofia Patel",
    email: "sofia@example.com",
    orders: 22,
    spent: "$2,890",
    joined: "Nov 2024",
    status: "VIP",
  },
  {
    id: "C004",
    name: "Kabir Das",
    email: "kabir@example.com",
    orders: 3,
    spent: "$198",
    joined: "Feb 2026",
    status: "Active",
  },
  {
    id: "C005",
    name: "Ananya Roy",
    email: "ananya@example.com",
    orders: 1,
    spent: "$49",
    joined: "Mar 2026",
    status: "New",
  },
  {
    id: "C006",
    name: "Riya Verma",
    email: "riya@example.com",
    orders: 9,
    spent: "$780",
    joined: "Jun 2025",
    status: "Active",
  },
];

type CustomerStatus = "VIP" | "Active" | "New";

const CustomerStatusBadge = ({ status }: { status: CustomerStatus }) => {
  const map = {
    VIP: { bg: "#fef9c3", color: "#854d0e" },
    Active: { bg: "#dcfce7", color: "#166534" },
    New: { bg: "#dbeafe", color: "#1d4ed8" },
  };
  const cfg = map[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {status === "VIP" && "★ "}
      {status}
    </span>
  );
};

const Customers = () => {
  const [search, setSearch] = useState("");
  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Customers"
        subtitle={`${CUSTOMERS.length} registered customers`}
        action={<></>}
      />
      <Card
        className="border-0 shadow-sm"
        style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
      >
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="relative max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="h-9 pl-9 text-sm rounded-sm border-gray-200 bg-gray-50 focus-visible:ring-green-700/20 focus-visible:border-green-700"
              style={{ fontFamily: "'Lato', sans-serif" }}
            />
          </div>
          <GoldDivider />
        </CardHeader>
        <CardContent className="px-6 pb-5">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                {[
                  "ID",
                  "Name",
                  "Email",
                  "Orders",
                  "Total Spent",
                  "Joined",
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
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="border-gray-50 hover:bg-green-50/30 transition-colors"
                >
                  <TableCell
                    className="text-xs text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.id}
                  </TableCell>
                  <TableCell
                    className="font-semibold text-sm text-gray-800 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.name}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.email}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-600 py-3 text-center"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.orders}
                  </TableCell>
                  <TableCell
                    className="text-sm font-bold py-3"
                    style={{ color: GREEN, fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.spent}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.joined}
                  </TableCell>
                  <TableCell className="py-3">
                    <CustomerStatusBadge status={c.status} />
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

export default Customers;
