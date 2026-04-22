"use client";
import { Button } from "@/components/ui/button";
import {
  ActionMenu,
  GoldDivider,
  PageHeader,
} from "../page";
import { Plus, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BROWN, LIGHT_ORANGE, ORANGE } from "@/lib/helper";

const COUPONS = [
  {
    code: "WELCOME20",
    type: "Percentage",
    value: "20%",
    minOrder: "$50",
    uses: 142,
    limit: 500,
    expiry: "31 Mar 2026",
    status: "Active",
  },
  {
    code: "GOLD50",
    type: "Flat",
    value: "$50",
    minOrder: "$200",
    uses: 38,
    limit: 100,
    expiry: "30 Apr 2026",
    status: "Active",
  },
  {
    code: "SUMMER15",
    type: "Percentage",
    value: "15%",
    minOrder: "$30",
    uses: 500,
    limit: 500,
    expiry: "28 Feb 2026",
    status: "Expired",
  },
  {
    code: "FIRST10",
    type: "Percentage",
    value: "10%",
    minOrder: "$0",
    uses: 89,
    limit: 200,
    expiry: "01 Jun 2026",
    status: "Active",
  },
  {
    code: "FESTIVE30",
    type: "Percentage",
    value: "30%",
    minOrder: "$100",
    uses: 0,
    limit: 300,
    expiry: "25 Dec 2026",
    status: "Scheduled",
  },
];

type CouponStatus = "Active" | "Expired" | "Scheduled";

const CouponStatusBadge = ({ status }: { status: CouponStatus }) => {
  const map = {
    Active: { bg: "#dcfce7", color: "#166534" },
    Expired: { bg: "#fee2e2", color: "#991b1b" },
    Scheduled: { bg: "#ede9fe", color: "#5b21b6" },
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

const Coupons = () => {
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Coupons"
        subtitle="Manage discount codes and promotional offers"
        action={
          <Button
            className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
              border: "none",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <Plus size={14} /> New Coupon
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Active Coupons",
            value: COUPONS.filter((c) => c.status === "Active").length,
            color: BROWN,
          },
          {
            label: "Total Redemptions",
            value: COUPONS.reduce((a, c) => a + c.uses, 0),
            color: ORANGE,
          },
          {
            label: "Expired",
            value: COUPONS.filter((c) => c.status === "Expired").length,
            color: "#dc2626",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-0 shadow-sm"
            style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${s.color}15` }}
              >
                <Tag size={17} style={{ color: s.color }} />
              </div>
              <div>
                <p
                  className="text-2xl font-light"
                  style={{
                    color: "#111",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs uppercase tracking-wider text-gray-400"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {s.label}
                </p>
              </div>
            </CardContent>
          </Card>
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
                  "Code",
                  "Type",
                  "Value",
                  "Min Order",
                  "Usage",
                  "Expiry",
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
              {COUPONS.map((c) => (
                <TableRow
                  key={c.code}
                  className="border-gray-50 hover:bg-green-50/30 transition-colors"
                >
                  <TableCell className="py-3">
                    <span
                      className="font-mono font-bold text-sm px-2 py-1 rounded"
                      style={{
                        background: `${BROWN}15`,
                        color: BROWN,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {c.code}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.type}
                  </TableCell>
                  <TableCell
                    className="text-sm font-bold py-3"
                    style={{ color: BROWN, fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.value}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.minOrder}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 w-16">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (c.uses / c.limit) * 100)}%`,
                            background: `linear-gradient(to right, ${ORANGE}, ${LIGHT_ORANGE})`,
                          }}
                        />
                      </div>
                      <span
                        className="text-xs text-gray-400"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        {c.uses}/{c.limit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.expiry}
                  </TableCell>
                  <TableCell className="py-3">
                    <CouponStatusBadge status={c.status as CouponStatus} />
                  </TableCell>
                  <TableCell className="py-3">
                    <ActionMenu onDelete={() => {}} onEdit={() => {}} />
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

export default Coupons;