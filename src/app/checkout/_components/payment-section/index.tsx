"use client";

import {
  CreatePostpaidOrder,
  CreatePrepaidOrder,
  MarkPaymentFailed,
  VerifyPayment,
} from "@/actions/order";
import { fmt } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "@/hooks/useRazorpay";
import { getBuyNowItem } from "@/lib/buy-now";
import { BROWN, LATO, LIGHT_BROWN, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import {
  Banknote,
  Check,
  CreditCard,
  Info,
  Loader2,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "online" | "cod";

const PaymentSection = ({
  total,
  customerName,
  customerPhone,
  onComplete,
  selectedAddressId,
  slug,
}: {
  total: number;
  customerName: string;
  customerPhone: string;
  onComplete: (method: string, paymentId?: string) => void;
  selectedAddressId: string | null;
  slug: "cart" | "buy-now";
}) => {
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [processing, setProcessing] = useState(false);
  const { loaded, initPayment } = useRazorpay();

  const paymentMethods: {
    id: PaymentMethod;
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      id: "online",
      label: "Pay Online",
      icon: <CreditCard size={18} />,
      desc: "UPI, Card, Net Banking etc.",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: <Banknote size={18} />,
      desc: "Pay when order arrives",
    },
  ];

  const handlePay = async () => {
    if (!selectedAddressId) return;

    setProcessing(true);

    try {
      // 1️⃣ Create Order
      const item = getBuyNowItem();

      if (method === "cod") {
        const res = await CreatePostpaidOrder(
          selectedAddressId,
          slug,
          item ? item : undefined,
        );
        if (res.status !== 201) toast("Error creating COD order");

        setProcessing(false);
        onComplete("cod", res.data?.orderId);
        return;
      }

      const res = await CreatePrepaidOrder(
        selectedAddressId,
        slug,
        item ? item : undefined,
      );
      if (res.status !== 201 || !res.data)
        throw new Error("Order creation failed");

      const { razorpayOrderId, amount, currency, key } = res.data;

      // 3️⃣ Open Razorpay
      initPayment(
        {
          key,
          amount,
          currency,
          order_id: razorpayOrderId,
          name: "Urvi Tribe",
          description: "Order Payment",
          prefill: {
            name: customerName,
            contact: customerPhone,
          },
        },
        async (response) => {
          try {
            // 4️⃣ Verify Payment
            await VerifyPayment({
              razorpay_order_id: response.razorpay_order_id!,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature!,
            });

            onComplete(method, response.razorpay_payment_id);
          } catch (err) {
            console.error("Verification failed", err);
          } finally {
            setProcessing(false);
          }
        },
        async () => {
          // 5️⃣ Handle failure
          await MarkPaymentFailed(razorpayOrderId);
          setProcessing(false);
        },
      );
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Razorpay trust line */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
        style={{
          background: "#f0faf4",
          border: "1px solid #a8d5b5",
          color: "#2d6a4f",
          fontFamily: LATO,
        }}
      >
        <Shield size={13} />
        Powered by Razorpay · 256-bit SSL encrypted · PCI-DSS compliant
      </div>

      {/* Method selector */}
      <div className="flex flex-col gap-2">
        {paymentMethods.map((pm) => (
          <div key={pm.id}>
            <button
              onClick={() => setMethod(pm.id)}
              className="w-full flex items-center gap-3 rounded-xl p-4 text-left transition-all hover:shadow-sm"
              style={{
                border: `2px solid ${method === pm.id ? ORANGE : "#f0e6dc"}`,
                background: method === pm.id ? "#fff9f4" : "#fdfaf7",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: method === pm.id ? LIGHTER_ORANGE : "#f5ede5",
                  color: BROWN,
                }}
              >
                {pm.icon}
              </div>
              <div className="flex-1">
                <p
                  className="font-bold text-sm"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  {pm.label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  {pm.desc}
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: method === pm.id ? ORANGE : "#d0c0b8",
                  background: method === pm.id ? ORANGE : "transparent",
                }}
              >
                {method === pm.id && <Check size={11} color="#fff" />}
              </div>
            </button>

            {/* COD note */}
            {method === "cod" && pm.id === "cod" && (
              <div
                className="mx-1 mt-1 rounded-xl p-3 flex items-start gap-2"
                style={{
                  background: "#fff8f2",
                  border: `1px solid ${LIGHTER_ORANGE}`,
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <Info
                  size={13}
                  style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }}
                />
                <p
                  className="text-xs leading-5"
                  style={{ color: LIGHT_BROWN, fontFamily: LATO }}
                >
                  COD available for orders up to ₹5,000. An additional ₹49
                  handling fee applies. Please keep exact change ready.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pay button */}
      <Button
        onClick={handlePay}
        disabled={processing || (!loaded && method !== "cod")}
        className="w-full h-14 font-bold text-base tracking-wide uppercase mt-1 transition-all hover:scale-[1.01]"
        style={{
          background: processing
            ? `linear-gradient(135deg, #9a7a6e 0%, #6f3023 100%)`
            : `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
          color: "#fff",
          fontFamily: LATO,
          border: "none",
          boxShadow: `0 8px 28px rgba(85,19,5,0.3)`,
          letterSpacing: "1px",
        }}
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {method === "online" ? `Pay ${fmt(total)} Securely` : "Place Order"}
          </span>
        )}
      </Button>

      <p
        className="text-center text-xs"
        style={{ color: "#9a7a6e", fontFamily: LATO }}
      >
        Your payment is secured by{" "}
        <span style={{ color: ORANGE, fontWeight: 700 }}>Razorpay</span>. We
        never store card details.
      </p>
    </div>
  );
};

export default PaymentSection;
