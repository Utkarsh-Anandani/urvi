import { fmt } from "@/lib/helper";
import { Badge } from "@/components/ui/badge";
import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { ChevronRight, Clock, Package } from "lucide-react";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUsersOrders } from "@/actions/order";
import { GetUsersOrdersReturnType } from "@/types/order.type";
import { OrderStatus } from "@prisma/client";

const STATUS_META: Record<
  OrderStatus,
  { label: string; bg: string; color: string }
> = {
  DELIVERED: { label: "Delivered", bg: "#e8f5e9", color: "#2d6a4f" },
  CONFIRMED: { label: "Confirmed", bg: "#e8f5e9", color: "#2d6a4f" },
  SHIPPED: { label: "Shipped", bg: "#fff3e0", color: "#e65100" },
  RETURNED: { label: "Returned", bg: "#fff3e0", color: "#e65100" },
  PENDING: { label: "Processing", bg: LIGHTER_ORANGE, color: BROWN },
  CANCELLED: { label: "Cancelled", bg: "#ffeaea", color: "#c0392b" },
};

const OrdersTab = () => {
  const { data } = useQueryData(["user-orders"], () => GetUsersOrders());
  const { data: ordersData } = data as GetUsersOrdersReturnType;
  return (
    <div className="flex flex-col gap-3">
      <h1 className="block md:hidden text-lg font-bold">Orders</h1>
      {ordersData.map((order) => {
        const meta = STATUS_META[order.status];
        return (
          <div
            key={order.id}
            className="rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer group"
            style={{ background: "#fff", border: "1px solid #f0e6dc" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className="font-black text-sm"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  {order.id.slice(0,4).toUpperCase()}
                </p>
                <p
                  className="text-xs mt-0.5 flex items-center gap-1"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  <Clock size={11} />
                  {order.createdAt.toDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  style={{
                    background: meta.bg,
                    color: meta.color,
                    fontFamily: LATO,
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                  }}
                >
                  {meta.label}
                </Badge>
                <ChevronRight
                  size={16}
                  style={{ color: "#d0c0b8" }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <p
              className="text-sm"
              style={{ color: "#6b5a52", fontFamily: LATO }}
            >
              {order.items.map((item, i) => (
                <div className="text-sm" style={{ color: "#6b5a52", fontFamily: LATO }} key={i}>{item.product.name} {item?.variant?.name || ""}{ i !== order.items.length - 1 ? " · " : ""}</div>
              ))}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span
                style={{
                  fontFamily: CORMORANT,
                  fontSize: 20,
                  fontWeight: 700,
                  color: BROWN,
                }}
              >
                {fmt(order.finalAmount)}
              </span>
              {/* <button
                className="text-xs font-bold underline"
                style={{ color: ORANGE, fontFamily: LATO }}
              >
                View Details
              </button> */}
            </div>
          </div>
        );
      })}

      {(!ordersData || ordersData.length === 0) && (
        <div className="text-center py-16">
          <Package
            size={40}
            style={{ color: LIGHTER_ORANGE, margin: "0 auto 12px" }}
          />
          <p style={{ fontFamily: CORMORANT, fontSize: 22, color: BROWN }}>
            No orders yet
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "#9a7a6e", fontFamily: LATO }}
          >
            Your order history will appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default OrdersTab;