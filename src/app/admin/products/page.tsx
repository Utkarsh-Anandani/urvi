"use client";
import { useState } from "react";
import {
  ActionMenu,
  GOLD,
  GoldDivider,
  GREEN,
  GREEN_LIGHT,
  PageHeader,
  PRODUCTS,
} from "../page";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductStatus = "Active" | "Out of Stock" | "Low Stock";

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const map = {
    Active: { bg: "#dcfce7", color: "#166534" },
    "Out of Stock": { bg: "#fee2e2", color: "#991b1b" },
    "Low Stock": { bg: "#fef9c3", color: "#854d0e" },
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
      {status}
    </span>
  );
};

const Products = () => {
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Products"
        subtitle={`${PRODUCTS.length} products in your catalogue`}
        action={
          <Button
            className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
              border: "none",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <Plus size={14} /> Add Product
          </Button>
        }
      />
      <Card
        className="border-0 shadow-sm"
        style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
      >
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="h-9 pl-9 text-sm rounded-sm border-gray-200 bg-gray-50 focus-visible:ring-green-700/20 focus-visible:border-green-700"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
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
                  "Category",
                  "Price",
                  "Stock",
                  "Rating",
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
              {filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-gray-50 hover:bg-green-50/30 transition-colors"
                >
                  <TableCell
                    className="text-xs text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.id}
                  </TableCell>
                  <TableCell
                    className="font-semibold text-sm text-gray-800 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.name}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.category}
                  </TableCell>
                  <TableCell
                    className="text-sm font-bold py-3"
                    style={{ color: GREEN, fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.price}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-600 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {p.stock}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill={GOLD} color={GOLD} />
                      <span
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        {p.rating}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <ProductStatusBadge status={p.status} />
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

export default Products;
