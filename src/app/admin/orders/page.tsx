"use client";
import { useState } from "react";
import { ActionMenu, PageHeader } from "../page";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, Clock, Truck, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BROWN, fmt, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import { OrderStatus, PaymentStatus } from "@/generated/enums";
import { useQueryData } from "@/hooks/useQueryData";
import { GetAdminOrders, UpdateOrderStatus } from "@/actions/admin";
import { AdminOrder, GetAdminOrdersReturnType } from "@/types/admin.types";
import { useMutationData } from "@/hooks/useMutationData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const map = {
    CONFIRMED: { bg: "#dcfce7", color: "#166534", icon: CircleCheck },
    SHIPPED: { bg: "#dbeafe", color: "#1d4ed8", icon: Truck },
    PENDING: { bg: "#fef9c3", color: "#854d0e", icon: Clock },
    CANCELLED: { bg: "#fee2e2", color: "#991b1b", icon: XCircle },
  };
  //@ts-expect-error
  const cfg = map[status] || {
    bg: "#dcfce7",
    color: "#166534",
    icon: CircleCheck,
  };
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>(undefined);
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const statuses = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];

  const { data } = useQueryData(["admin-orders", filter], () =>
    GetAdminOrders(filter),
  );
  console.log(data)
  const { data: ordersData } = data as GetAdminOrdersReturnType;

  const { mutate, isPending } = useMutationData(["update-admin-order"], UpdateOrderStatus, ["admin-orders"], () => setDialogOpen(false));

  const handleSubmit = () => {
    if(!selectedOrderId || (!orderStatus && !paymentStatus)) {
      toast("Select an option to update");
      return;
    } 
    mutate({
      orderId: selectedOrderId,
      status: orderStatus,
      paymentStatus: paymentStatus
    });
  }

  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Orders"
        subtitle={`${ordersData.length} total orders`}
        action={<></>}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            //@ts-expect-error
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              fontFamily: "'Lato', sans-serif",
              background:
                filter === s
                  ? `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`
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
              {ordersData.map((o) => (
                <TableRow
                  key={o.id}
                  className="border-gray-50 hover:bg-green-50/30 transition-colors"
                >
                  <TableCell
                    className="font-semibold text-sm py-3"
                    style={{ color: BROWN, fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.id.slice(0, 4).toUpperCase()}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-700 font-semibold py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.customerName}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-400 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500 py-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {o.itemsCount} item{o.itemsCount > 1 ? "s" : ""}
                  </TableCell>
                  <TableCell
                    className="text-sm font-bold py-3"
                    style={{ color: "#111", fontFamily: "'Lato', sans-serif" }}
                  >
                    {fmt(o.finalAmount)}
                  </TableCell>
                  <TableCell className="py-3">
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    <ActionMenu onEdit={() => {
                      setOrderStatus(o.status);
                      setPaymentStatus(o.paymentStatus);
                      setSelectedOrderId(o.id);
                      setDialogOpen(true);
                    }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Order Status */}
          <div>
            <p className="text-sm mb-1">Order Status</p>
            <Select value={orderStatus} onValueChange={(v) => setOrderStatus(v as OrderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrderStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div>
            <p className="text-sm mb-1">Payment Status</p>
            <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </main>
  );
};

export default Orders;
