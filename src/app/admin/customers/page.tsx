"use client";
import { PageHeader } from "../page";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmt, ORANGE } from "@/lib/helper";
import { useQueryData } from "@/hooks/useQueryData";
import { GetAdminCustomers } from "@/actions/admin";
import { GetAdminCustomersReturnType } from "@/types/admin.types";
import { Role } from "@/generated/enums";

const CustomerStatusBadge = ({ role }: { role: Role }) => {
  const map = {
    "USER": { bg: "#fef9c3", color: "#854d0e" },
    "ADMIN": { bg: "#dcfce7", color: "#166534" },
  };
  const cfg = map[role] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {role === "ADMIN" && "★ "}
      {role}
    </span>
  );
};

const Customers = () => {
  const { data } = useQueryData(["admin-customers"], () => GetAdminCustomers());
  const { data: customersData } = data as GetAdminCustomersReturnType;

  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Customers"
        subtitle={`${customersData.length} registered customers`}
        action={<></>}
      />
      <Card
        className="border-0 shadow-sm"
        style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
      >
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
                  "Status"
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
              {customersData.map((c) => (
                <TableRow
                  key={c.id}
                  className="border-gray-50 hover:bg-green-50/30 transition-colors"
                >
                  <TableCell
                    className="text-xs text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.id.slice(0, 4).toUpperCase()}
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
                    {c.totalOrders}
                  </TableCell>
                  <TableCell
                    className="text-sm font-bold py-3"
                    style={{ color: ORANGE, fontFamily: "'Lato', sans-serif" }}
                  >
                    {fmt(c.totalSpendings)}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {c.joinedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3">
                    <CustomerStatusBadge role={c.role} />
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
