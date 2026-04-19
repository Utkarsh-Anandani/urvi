import { fmt } from "@/app/(user)/my-cart/_components/cart-page-client";
import { Badge } from "@/components/ui/badge";
import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { ChevronRight, Clock, Package } from "lucide-react";

export interface OrderHistory {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: "delivered" | "shipped" | "processing" | "cancelled";
}

const STATUS_META: Record<
  OrderHistory["status"],
  { label: string; bg: string; color: string }
> = {
  delivered: { label: "Delivered", bg: "#e8f5e9", color: "#2d6a4f" },
  shipped: { label: "Shipped", bg: "#fff3e0", color: "#e65100" },
  processing: { label: "Processing", bg: LIGHTER_ORANGE, color: BROWN },
  cancelled: { label: "Cancelled", bg: "#ffeaea", color: "#c0392b" },
};

const ORDER_HISTORY: OrderHistory[] = [
  {
    id: "PF87654321",
    date: "12 Apr 2026",
    items: ["Groundnut Oil 2L", "A2 Ghee 500ml"],
    total: 2549,
    status: "delivered",
  },
  {
    id: "PF76543210",
    date: "28 Mar 2026",
    items: ["Coconut Oil 1L", "Mustard Oil 1L"],
    total: 930,
    status: "delivered",
  },
  {
    id: "PF65432109",
    date: "10 Mar 2026",
    items: ["Groundnut Oil 5L"],
    total: 2000,
    status: "delivered",
  },
  {
    id: "PF54321098",
    date: "20 Feb 2026",
    items: ["Sesame Oil 500ml", "Khapli Atta 1kg"],
    total: 670,
    status: "delivered",
  },
];

const OrdersTab = () => {
  return (
    <div className="flex flex-col gap-3">
      {ORDER_HISTORY.map((order) => {
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
                  {order.id}
                </p>
                <p
                  className="text-xs mt-0.5 flex items-center gap-1"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  <Clock size={11} />
                  {order.date}
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
              {order.items.join(" · ")}
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
                {fmt(order.total)}
              </span>
              <button
                className="text-xs font-bold underline"
                style={{ color: ORANGE, fontFamily: LATO }}
              >
                View Details
              </button>
            </div>
          </div>
        );
      })}

      {ORDER_HISTORY.length === 0 && (
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