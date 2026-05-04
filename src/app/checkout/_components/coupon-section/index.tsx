"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BROWN,
  fmt,
  LATO,
  LIGHT_BROWN,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import { BadgePercent, Check, ChevronRight, Loader2, Tag } from "lucide-react";
import { ApplyCoupon, GetAvailableCoupons } from "@/actions/coupon";
import { getLocalCart } from "@/lib/cart";
import { AppliedCoupon } from "../checkout-client";
import { getBuyNowItem } from "@/lib/buy-now";

type Coupon = {
  id: string;
  code: string;
  valid: boolean;
  reason?: string;
  discount: number;
};

const CouponSection = ({
  slug = "cart",
  applied,
  onApply,
  handleSubmit,
}: {
  slug?: "cart" | "buy-now";
  applied: AppliedCoupon;
  onApply: (coupon: AppliedCoupon | null) => void;
  handleSubmit: () => void;
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showList, setShowList] = useState(false);
  const [loadingCoupons, startLoadingCoupons] = useTransition();
  const [applyingCoupon, startApplyingCoupon] = useTransition();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const item = getBuyNowItem();

  useEffect(() => {
    startLoadingCoupons(async () => {
      try {
        const res = await GetAvailableCoupons({
          slug,
          item: item ? item : undefined,
        });

        setCoupons(res);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const handleApply = (coupon: Coupon) => {
    setError("");

    startApplyingCoupon(async () => {
      try {
        const res = await ApplyCoupon({
          couponCode: coupon.code,
          slug,
          item: item ? item : undefined,
        });

        if (!res.success) {
          throw new Error("Failed to apply coupon");
        }

        onApply({
          couponCode: coupon.code,
          couponDiscount: coupon.discount,
          couponId: coupon.id,
        });
        setInput(res.coupon.code);
        setShowList(false);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error ? error.message : "Failed to apply coupon",
        );
      }
    });
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#fff",
        border: `1px solid #f0e6dc`,
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Tag size={16} style={{ color: ORANGE }} />

        <span
          className="text-sm font-bold"
          style={{
            color: BROWN,
            fontFamily: LATO,
          }}
        >
          Apply Coupon
        </span>
      </div>

      {applied ? (
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            background: "#e8f5e9",
            border: `1.5px solid #a8d5b5`,
          }}
        >
          <div className="flex items-center gap-2">
            <Check size={16} color="#2d6a4f" />

            <span
              className="text-sm font-bold"
              style={{
                color: "#2d6a4f",
                fontFamily: LATO,
              }}
            >
              {applied.couponCode} applied!
            </span>
          </div>

          <button
            onClick={() => onApply(null)}
            className="text-xs font-bold underline"
            style={{
              color: "#c0392b",
              fontFamily: LATO,
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={input}
              onChange={(e) => {
                setInput(e.target.value.toUpperCase());
                setError("");
              }}
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                borderColor: error ? "#e74c3c" : "#f0e6dc",

                fontFamily: LATO,

                color: BROWN,

                background: "#fdfaf7",
              }}
            />

            <Button
              disabled={!input.trim() || applyingCoupon}
              onClick={() => handleApply(coupons[0])}
              className="shrink-0 px-5 text-sm font-bold"
              style={{
                background: BROWN,
                color: "#fff",
                fontFamily: LATO,
                border: "none",
              }}
            >
              {applyingCoupon ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>

          {error && (
            <p
              className="mt-1.5 text-xs"
              style={{
                color: "#c0392b",
                fontFamily: LATO,
              }}
            >
              {error}
            </p>
          )}

          <button
            onClick={() => setShowList(!showList)}
            className="mt-3 flex items-center gap-1.5 text-xs font-bold underline"
            style={{
              color: LIGHT_BROWN,
              fontFamily: LATO,
            }}
          >
            <BadgePercent size={13} />
            {showList ? "Hide" : "View"} available offers
          </button>

          {showList && (
            <div className="mt-3 flex flex-col gap-2">
              {loadingCoupons ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2
                    size={18}
                    className="animate-spin"
                    style={{ color: ORANGE }}
                  />
                </div>
              ) : coupons.length === 0 ? (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "#fdfaf7",
                    color: LIGHT_BROWN,
                    fontFamily: LATO,
                  }}
                >
                  No coupons available
                </div>
              ) : (
                coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between rounded-xl px-4 py-3 transition-all"
                    style={{
                      background: coupon.valid ? "#fdfaf7" : "#faf7f5",

                      border: `1.5px dashed ${
                        coupon.valid ? LIGHTER_ORANGE : "#e0d6d0"
                      }`,

                      opacity: coupon.valid ? 1 : 0.7,
                    }}
                  >
                    <div>
                      <span
                        className="text-sm font-black"
                        style={{
                          color: BROWN,
                          fontFamily: LATO,
                        }}
                      >
                        {coupon.code}
                      </span>

                      <p
                        className="mt-0.5 text-xs"
                        style={{
                          color: coupon.valid ? "#9a7a6e" : "#b0897b",

                          fontFamily: LATO,
                        }}
                      >
                        {coupon.valid
                          ? `Save ${fmt(coupon.discount)}`
                          : coupon.reason}
                      </p>
                    </div>

                    {coupon.valid ? (
                      <button
                        disabled={applyingCoupon}
                        onClick={() => handleApply(coupon)}
                        className="text-xs font-bold underline"
                        style={{
                          color: ORANGE,
                          fontFamily: LATO,
                        }}
                      >
                        Apply
                      </button>
                    ) : (
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: "#b0897b",
                          fontFamily: LATO,
                        }}
                      >
                        Unavailable
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
      <Button
        onClick={handleSubmit}
        className="w-full h-12 font-bold text-sm tracking-wide uppercase mt-4"
        style={{
          background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
          color: "#fff",
          fontFamily: LATO,
          border: "none",
          boxShadow: `0 8px 24px rgba(85,19,5,0.25)`,
          cursor: "pointer",
        }}
      >
        Continue to Payment
        <ChevronRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default CouponSection;
