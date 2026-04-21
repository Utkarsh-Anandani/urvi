"use client";

import { useState } from "react";
import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  ORANGE,
} from "@/lib/helper";
import {
  CartItem
} from "@/app/(user)/my-cart/_components/cart-page-client";
import { fmt } from "@/lib/helper";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const OrderSummarySidebar = ({
  couponDiscount,
  deliveryPrice,
  productsData
}: {
  couponDiscount: number;
  deliveryPrice: number;
  productsData: {
        totalQuantity: number;
        netPriceTotal: number;
        netDiscountPriceTotal: number;
        cartItems: CartItem[];
    }
}) => {
  const [expanded, setExpanded] = useState(true);

  const savings =
      productsData.netPriceTotal - productsData.netDiscountPriceTotal;
    const total =
      productsData.netDiscountPriceTotal - couponDiscount + deliveryPrice;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1px solid #f0e6dc`,
          boxShadow: `0 16px 48px -12px rgba(85,19,5,0.12)`,
        }}
      >
        <div
          className="px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
          }}
        >
          <h2
            style={{
              fontFamily: CORMORANT,
              fontSize: 20,
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
            {productsData.totalQuantity} items · {fmt(total)}
          </p>
        </div>

        <div className="p-5 flex flex-col gap-4" style={{ background: "#fff" }}>
          {/* Items toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between text-sm font-bold w-full"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            <span className="flex items-center gap-2">
              <Package size={14} style={{ color: ORANGE }} />
              {expanded ? "Hide" : "Show"} order items
            </span>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {expanded && (
            <div className="flex flex-col gap-3">
              {productsData.cartItems.map((item) => (
                //@ts-expect-error
                <div key={item.variant.id} className="flex gap-2.5">
                  <div
                    className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
                    style={{ background: "#fff" }}
                  >
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-xs leading-4 truncate"
                      style={{ color: BROWN, fontFamily: LATO }}
                    >
                      {item.product.name} x {item.quantity}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "#9a7a6e", fontFamily: LATO }}
                    >
                      {
                        //@ts-expect-error
                        item.variant.name
                      }
                    </p>
                    <p
                      className="font-bold text-xs mt-0.5"
                      style={{ color: BROWN, fontFamily: LATO }}
                    >
                      {fmt(
                        //@ts-expect-error
                        (item.variant?.discountPrice || item.variant?.price) *
                          item.quantity,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator style={{ background: "#f0e6dc" }} />

          {/* Rows */}
          <div className="flex flex-col gap-2.5">
            <div
              className="flex justify-between text-sm"
              style={{ fontFamily: LATO }}
            >
              <span style={{ color: "#6b5a52" }}>Subtotal (MRP)</span>
              <span style={{ color: "#b0a09a" }} className="line-through">
                {fmt(productsData.netPriceTotal)}
              </span>
            </div>
            <div
              className="flex justify-between text-sm"
              style={{ fontFamily: LATO }}
            >
              <span style={{ color: "#6b5a52" }}>Product Discount</span>
              <span className="font-bold" style={{ color: "#2d6a4f" }}>
                − {fmt(savings)}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div
                className="flex justify-between text-sm"
                style={{ fontFamily: LATO }}
              >
                <span
                  className="flex items-center gap-1"
                  style={{ color: "#6b5a52" }}
                >
                  <Tag size={11} style={{ color: ORANGE }} /> Coupon
                </span>
                <span className="font-bold" style={{ color: "#2d6a4f" }}>
                  − {fmt(couponDiscount)}
                </span>
              </div>
            )}
            <div
              className="flex justify-between text-sm"
              style={{ fontFamily: LATO }}
            >
              <span style={{ color: "#6b5a52" }}>Delivery</span>
              <span
                className="font-bold"
                style={{ color: deliveryPrice === 0 ? "#2d6a4f" : BROWN }}
              >
                {deliveryPrice === 0 ? "FREE" : fmt(deliveryPrice)}
              </span>
            </div>
          </div>

          <Separator style={{ background: "#f0e6dc" }} />

          <div className="flex justify-between items-center">
            <span
              className="font-bold text-sm"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              Total Payable
            </span>
            <span
              style={{
                fontFamily: CORMORANT,
                fontSize: 26,
                fontWeight: 700,
                color: BROWN,
              }}
            >
              {fmt(total)}
            </span>
          </div>

          {savings + couponDiscount > 0 && (
            <div
              className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold"
              style={{
                background: "#e8f5e9",
                color: "#2d6a4f",
                fontFamily: LATO,
              }}
            >
              🎉 You&apos;re saving {fmt(savings + couponDiscount)}!
            </div>
          )}
        </div>
      </div>

      {/* Promise card */}
      {/* <div
        className="rounded-2xl p-4"
        style={{
          background: `linear-gradient(135deg, ${LIGHTER_ORANGE} 0%, #fdfaf7 100%)`,
          border: `1px solid ${LIGHTER_ORANGE}`,
        }}
      >
        <div
          className="flex items-center gap-2 mb-3"
          style={{ fontFamily: CORMORANT, fontSize: 16, fontWeight: 600, color: BROWN }}
        >
          <Leaf size={14} style={{ color: ORANGE }} />
          The PuraFarm Promise
        </div>
        {[
          "Cold-pressed below 45°C",
          "Zero chemicals or additives",
          "FSSAI certified & lab tested",
          "Sustainably sourced",
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <Check size={12} style={{ color: ORANGE, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: LIGHT_BROWN, fontFamily: LATO }}>{p}</span>
          </div>
        ))}
      </div> */}

      {/* Payment methods */}
      {/* <div
        className="rounded-2xl p-4 flex flex-col items-center gap-3"
        style={{ background: "#fff", border: "1px solid #f0e6dc" }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9a7a6e", fontFamily: LATO }}>
          Accepted Payments
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          {["UPI", "Visa", "MC", "RuPay", "NetB", "Wallets", "COD"].map((p) => (
            <div
              key={p}
              className="px-2.5 py-1 rounded-md text-xs font-bold"
              style={{ background: "#fdfaf7", border: "1px solid #f0e6dc", color: "#9a7a6e", fontFamily: LATO }}
            >
              {p}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#9a7a6e", fontFamily: LATO }}>
          <Lock size={12} style={{ color: ORANGE }} />
          256-bit SSL · PCI-DSS Compliant via Razorpay
        </div>
      </div> */}
    </div>
  );
};

export default OrderSummarySidebar;
