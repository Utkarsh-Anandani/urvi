"use client";
import { BROWN, CORMORANT, LATO, LIGHT_BROWN, ORANGE } from "@/lib/helper";
import { fmt } from "../cart-page-client";
import { ArrowLeft, FlaskConical, RotateCcw, Shield, Tag, Truck, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OrderSummary = ({
  couponCode,
  discountPct,
  originalTotal,
  discountTotal,
  totalItems
}: {
  couponCode: string | null;
  discountPct: number;
  originalTotal: number;
  discountTotal: number;
  totalItems: number;
}) => {
  const productSavings = originalTotal - discountTotal;
  const couponDiscount = couponCode
    ? Math.round((discountTotal * discountPct) / 100)
    : 0;
  const delivery = discountTotal >= 599 ? 0 : 80;
  const total = discountTotal - couponDiscount + delivery;
  const totalSavings = productSavings + couponDiscount;
  const router = useRouter();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid #f0e6dc`,
        boxShadow: `0 16px 48px -12px rgba(85,19,5,0.12)`,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
        }}
      >
        <h2
          style={{
            fontFamily: CORMORANT,
            fontSize: 22,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Order Summary
        </h2>
        <p
          className="text-xs mt-0.5"
          style={{ color: "rgba(255,255,255,0.6)", fontFamily: LATO }}
        >
          {totalItems} items in your cart 
        </p>
      </div>

      <div className="p-5 flex flex-col gap-3" style={{ background: "#fff" }}>
        {/* Line items */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between text-sm" style={{ fontFamily: LATO }}>
            <span style={{ color: "#6b5a52" }}>Subtotal (MRP)</span>
            <span style={{ color: "#b0a09a" }} className="line-through">
              {fmt(originalTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm" style={{ fontFamily: LATO }}>
            <span style={{ color: "#6b5a52" }}>Product Discount</span>
            <span
              className="font-bold"
              style={{ color: "#2d6a4f" }}
            >
              − {fmt(productSavings)}
            </span>
          </div>
          {couponCode && (
            <div className="flex justify-between text-sm" style={{ fontFamily: LATO }}>
              <span
                className="flex items-center gap-1.5"
                style={{ color: "#6b5a52" }}
              >
                <Tag size={12} style={{ color: ORANGE }} />
                Coupon ({couponCode})
              </span>
              <span className="font-bold" style={{ color: "#2d6a4f" }}>
                − {fmt(couponDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm" style={{ fontFamily: LATO }}>
            <span
              className="flex items-center gap-1.5"
              style={{ color: "#6b5a52" }}
            >
              <Truck size={12} style={{ color: delivery === 0 ? "#2d6a4f" : "#9a7a6e" }} />
              Delivery
            </span>
            {delivery === 0 ? (
              <span className="font-bold" style={{ color: "#2d6a4f" }}>
                FREE
              </span>
            ) : (
              <span style={{ color: BROWN }}>{fmt(delivery)}</span>
            )}
          </div>
        </div>

        <Separator style={{ background: "#f0e6dc" }} />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span
            className="font-bold text-base"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            Total Payable
          </span>
          <span
            style={{
              fontFamily: CORMORANT,
              fontSize: 28,
              fontWeight: 700,
              color: BROWN,
            }}
          >
            {fmt(total)}
          </span>
        </div>

        {/* Savings pill */}
        {totalSavings > 0 && (
          <div
            className="flex items-center justify-center gap-2 rounded-xl py-2.5"
            style={{ background: "#e8f5e9" }}
          >
            <span className="text-lg">🎉</span>
            <span
              className="text-sm font-bold"
              style={{ color: "#2d6a4f", fontFamily: LATO }}
            >
              You're saving {fmt(totalSavings)} on this order!
            </span>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={() => router.push(`/checkout/cart`)}
          className="w-full h-13 text-sm font-bold tracking-wide uppercase mt-1 transition-all hover:scale-[1.01] hover:shadow-lg"
          style={{
            height: 52,
            background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
            color: "#fff",
            fontFamily: LATO,
            border: "none",
            boxShadow: `0 8px 24px rgba(85,19,5,0.3)`,
            letterSpacing: "0.8px",
          }}
        >
          <Zap size={15} className="mr-2" />
          Proceed to Checkout
        </Button>

        <Button
          onClick={() => router.push('/catalog/all-products')}
          variant="outline"
          className="w-full h-11 text-sm font-bold tracking-wide"
          style={{
            borderColor: "#f0e6dc",
            color: "#9a7a6e",
            fontFamily: LATO,
            borderWidth: 1.5,
          }}
        >
          <ArrowLeft size={14} className="mr-2" />
          Continue Shopping
        </Button>

        {/* Trust micro-row */}
        <div className="flex justify-center gap-4 mt-1">
          {[
            { icon: <Shield size={13} />, label: "Secure Payment" },
            { icon: <FlaskConical size={13} />, label: "Lab Tested" },
            { icon: <RotateCcw size={13} />, label: "Easy Returns" },
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-1 text-xs"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              {t.icon}
              {t.label}
            </div>
          ))}
        </div>

        {/* Payment icons */}
        <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
          {["UPI", "Visa", "MC", "RuPay", "NetB", "COD"].map((p) => (
            <div
              key={p}
              className="px-2.5 py-1 rounded-md text-xs font-bold"
              style={{
                background: "#fdfaf7",
                border: "1px solid #f0e6dc",
                color: "#9a7a6e",
                fontFamily: LATO,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;