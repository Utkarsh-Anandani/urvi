import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE } from "@/lib/helper";
import Image from "next/image";
import {
  ProductsData
} from "@/app/(user)/my-cart/_components/cart-page-client";
import { fmt } from "@/lib/helper";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { useBuyNow } from "@/hooks/useBuyNow";

const OrderReview = ({
  deliveryPrice,
  couponDiscount,
  paymentMethod,
  paymentId,
  slug,
}: {
  deliveryPrice: number;
  couponDiscount: number;
  paymentMethod: string;
  paymentId?: string;
  slug: "cart" | "buy-now";
}) => {

  const { data, isFetching } = useBuyNow(slug);
  const { data: productsData } = data as ProductsData;

  if (!productsData) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Items */}
      {productsData.cartItems.map((item) => (
        <div key={item.product.id} className="flex gap-3">
          <div
            className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
            style={{ background: LIGHTER_ORANGE }}
          >
            <Image
              src={item.product.images[0].url}
              alt={item.product.name}
              fill
              className="object-cover"
            />
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: BROWN, color: "#fff", fontFamily: LATO }}
            >
              {item.quantity}
            </div>
          </div>
          <div className="flex-1">
            <p
              className="font-bold text-sm"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              {item.product.name}
            </p>
            <p
              className="text-xs"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              {
                item?.variant?.name
              }
            </p>
          </div>
          <p
            className="font-bold text-sm shrink-0"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            {
              fmt(//@ts-expect-error
                (item.variant?.discountPrice || item.variant?.price) * item.qty,
              )
            }
          </p>
        </div>
      ))}

      <Separator style={{ background: "#f0e6dc" }} />

      {/* Summary rows */}
      {[
        { label: "Subtotal", val: fmt(productsData.netDiscountPriceTotal) },
        {
          label: "Delivery",
          val: deliveryPrice === 0 ? "FREE" : fmt(deliveryPrice),
          green: deliveryPrice === 0,
        },
        couponDiscount > 0 && {
          label: "Coupon Discount",
          val: `− ${fmt(couponDiscount)}`,
          green: true,
        },
        paymentMethod === "cod" && { label: "COD Handling Fee", val: "₹49" },
      ]
        .filter(Boolean)
        .map((row, i) => (
          <div
            key={i}
            className="flex justify-between text-sm"
            style={{ fontFamily: LATO }}
          >
            <span style={{ color: "#6b5a52" }}>{
              //@ts-expect-error
            row.label
            }</span>
            <span
              className="font-bold"
              style={{ 
                //@ts-expect-error
                color: row.green ? "#2d6a4f" : BROWN 
              }}
            >
              {
                //@ts-expect-error
              row.val
              }
            </span>
          </div>
        ))}

      <Separator style={{ background: "#f0e6dc" }} />

      <div className="flex justify-between items-center">
        <span
          className="font-bold text-sm"
          style={{ color: BROWN, fontFamily: LATO }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: CORMORANT,
            fontSize: 28,
            fontWeight: 700,
            color: BROWN,
          }}
        >
          {fmt(productsData.netDiscountPriceTotal)}
        </span>
      </div>

      {paymentId && (
        <div
          className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: "#f0faf4", border: "1px solid #a8d5b5" }}
        >
          <CheckCircle2 size={15} style={{ color: "#2d6a4f", flexShrink: 0 }} />
          <div>
            <p
              className="text-xs font-bold"
              style={{ color: "#2d6a4f", fontFamily: LATO }}
            >
              Payment Successful
            </p>
            <p
              className="text-xs"
              style={{ color: "#6b8f71", fontFamily: LATO }}
            >
              ID: {paymentId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderReview;
