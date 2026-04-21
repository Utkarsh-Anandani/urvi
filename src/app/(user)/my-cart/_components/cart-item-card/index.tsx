import { BROWN, fmt, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { CartItem } from "../cart-page-client";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CartItemCard = ({
  item,
  onQtyChange,
  onRemove,
  isAdditionPending,
  isRemovalPending,
}: {
  item: CartItem;
  onQtyChange: (
    productId: string,
    variantId: string | undefined,
    type: "inc" | "dec",
  ) => void;
  onRemove: (
    productId: string,
    variantId: string | undefined,
    quantity: number,
  ) => void;
  isAdditionPending: boolean;
  isRemovalPending: boolean;
}) => {
  const originalPrice = item.variant?.price ?? item.product.price;
  const discountPrice =
    item.variant?.discountPrice ?? item.product.discountPrice ?? 0;
  const savings = (originalPrice - discountPrice) * item.quantity;

  if (isAdditionPending || isRemovalPending) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#fff",
          border: `1px solid #f0e6dc`,
        }}
      >
        <div className="flex gap-4">
          {/* Image */}
          <Skeleton className="w-25 h-25 rounded-xl shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Title + remove */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>

              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>

            {/* Price row */}
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>

            {/* Qty + savings */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                <Skeleton className="w-8 h-8 rounded-md" />
                <Skeleton className="w-8 h-5" />
                <Skeleton className="w-8 h-8 rounded-md" />
              </div>

              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group rounded-2xl p-5 transition-all hover:shadow-md"
      style={{
        background: "#fff",
        border: `1px solid #f0e6dc`,
      }}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div
          className="relative shrink-0 rounded-xl overflow-hidden"
          style={{ width: 100, height: 100, background: LIGHTER_ORANGE }}
        >
          <Image
            src={item.product.images[0].url}
            alt={item.product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className="font-bold text-sm leading-5"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {item.product.name}
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: "#9a7a6e", fontFamily: LATO }}
              >
                {item.variant?.name}
              </p>
            </div>
            <button
              onClick={() =>
                onRemove(item.product.id, item.variant?.id, item.quantity)
              }
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50"
              style={{ color: "#c0392b" }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className="font-black text-base"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              {item.variant
                ? fmt(item.variant?.discountPrice ?? item.variant?.price)
                : fmt(item.product?.discountPrice ?? item.product?.price)}
            </span>
            <span className="text-xs line-through" style={{ color: "#b0a09a" }}>
              {item.variant
                ? fmt(item.variant?.price)
                : fmt(item.product.price)}
            </span>
            <Badge
              style={{
                background: "#fff0e6",
                color: ORANGE,
                fontFamily: LATO,
                fontSize: "10px",
                fontWeight: 700,
                padding: "1px 7px",
                border: `1px solid ${LIGHTER_ORANGE}`,
              }}
            >
              {item.variant
                ? Math.round(
                    ((item.variant?.price -
                      (item.variant?.discountPrice ?? 0)) /
                      item.variant.price) *
                      100,
                  )
                : Math.round(
                    ((item.product.price - (item.product.discountPrice ?? 0)) /
                      item.product.price) *
                      100,
                  )}
              % off
            </Badge>
          </div>

          {/* Qty + Savings row */}
          <div className="flex items-center justify-between mt-3">
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ border: `1.5px solid #f0e6dc` }}
            >
              <button
                onClick={() =>
                  onQtyChange(item.product.id, item.variant?.id, "dec")
                }
                className="w-8 h-8 flex items-center justify-center font-bold text-base transition-colors hover:bg-orange-50"
                style={{ color: BROWN }}
              >
                −
              </button>
              <span
                className="w-8 text-center font-bold text-sm"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  onQtyChange(item.product.id, item.variant?.id, "inc")
                }
                className="w-8 h-8 flex items-center justify-center font-bold text-base transition-colors hover:bg-orange-50"
                style={{ color: BROWN }}
              >
                +
              </button>
            </div>

            {savings > 0 && (
              <span
                className="text-xs font-bold"
                style={{ color: "#2d6a4f", fontFamily: LATO }}
              >
                You save {fmt(savings)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
