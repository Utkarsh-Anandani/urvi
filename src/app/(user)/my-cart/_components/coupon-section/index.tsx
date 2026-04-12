"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BROWN, LATO, LIGHT_BROWN, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { BadgePercent, Check, Tag } from "lucide-react";
import { useState } from "react";
import { fmt } from "../cart-page-client";

const COUPONS = [
  { code: "PURE30", desc: "Flat 30% off sitewide", minOrder: 599 },
  { code: "PURE15", desc: "Flat 15% off (non-combo)", minOrder: 599 },
  { code: "FIRST10", desc: "10% off on first order", minOrder: 0 },
];

const CouponSection = ({
  onApply,
  applied,
}: {
  onApply: (code: string, discount: number) => void;
  applied: string | null;
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showList, setShowList] = useState(false);

  const handleApply = (code: string) => {
    const found = COUPONS.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );
    if (found) {
      onApply(found.code, found.code === "PURE30" ? 30 : found.code === "PURE15" ? 15 : 10);
      setError("");
      setShowList(false);
    } else {
      setError("Invalid coupon code. Try PURE30.");
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#fff",
        border: `1px solid #f0e6dc`,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Tag size={16} style={{ color: ORANGE }} />
        <span
          className="font-bold text-sm"
          style={{ color: BROWN, fontFamily: LATO }}
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
              className="font-bold text-sm"
              style={{ color: "#2d6a4f", fontFamily: LATO }}
            >
              {applied} applied!
            </span>
          </div>
          <button
            onClick={() => onApply("", 0)}
            className="text-xs font-bold underline"
            style={{ color: "#c0392b", fontFamily: LATO }}
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
              onClick={() => handleApply(input)}
              className="font-bold text-sm px-5 shrink-0"
              style={{
                background: BROWN,
                color: "#fff",
                fontFamily: LATO,
                border: "none",
              }}
            >
              Apply
            </Button>
          </div>
          {error && (
            <p
              className="text-xs mt-1.5"
              style={{ color: "#c0392b", fontFamily: LATO }}
            >
              {error}
            </p>
          )}
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-1.5 mt-3 text-xs font-bold underline"
            style={{ color: LIGHT_BROWN, fontFamily: LATO }}
          >
            <BadgePercent size={13} />
            {showList ? "Hide" : "View"} available offers
          </button>

          {showList && (
            <div className="mt-3 flex flex-col gap-2">
              {COUPONS.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all hover:shadow-sm"
                  style={{
                    background: "#fdfaf7",
                    border: `1.5px dashed ${LIGHTER_ORANGE}`,
                  }}
                  onClick={() => {
                    setInput(c.code);
                    handleApply(c.code);
                  }}
                >
                  <div>
                    <span
                      className="font-black text-sm"
                      style={{ color: BROWN, fontFamily: LATO }}
                    >
                      {c.code}
                    </span>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "#9a7a6e", fontFamily: LATO }}
                    >
                      {c.desc}
                      {c.minOrder > 0 && ` · Min order ${fmt(c.minOrder)}`}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold underline"
                    style={{ color: ORANGE, fontFamily: LATO }}
                  >
                    Apply
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CouponSection;