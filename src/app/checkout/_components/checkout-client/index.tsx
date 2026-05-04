"use client";

import { useState } from "react";
import {
  MapPin,
  CreditCard,
  ArrowLeft,
  Package,
  TicketPercent,
} from "lucide-react";
import { BROWN, CORMORANT, LATO, LIGHT_BROWN, ORANGE } from "@/lib/helper";
import Navbar from "../navbar";
import OrderConfirmed from "../order-confirmation";
// import StepIndicator from "../step-indicator";
import SectionCard from "../section-card";
import AddressSection from "../address-card";
import PaymentSection from "../payment-section";
import OrderReview from "../order-review";
import OrderSummarySidebar from "../order-summary";
import { useBuyNow } from "@/hooks/useBuyNow";
import { ProductsData } from "@/app/(user)/my-cart/_components/cart-page-client";
import CouponSection from "../coupon-section";

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type CheckoutStep = "address" | "coupon" | "payment" | "review";

export type AppliedCoupon = {
  couponId: string;
  couponCode: string;
  couponDiscount: number;
} | null;

function CheckoutPageClient({ slug }: { slug: "cart" | "buy-now" }) {
  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const { data } = useBuyNow(slug);
  const { data: productsData } = data as ProductsData;

  if (!productsData) return null;

  const handleAddressComplete = (addr: Address) => {
    setAddress(addr);
    setStep("coupon");
  };

  const handlePaymentComplete = (method: string, pid?: string) => {
    setPaymentMethod(method);
    setPaymentId(pid);
    setStep("review");
    // Auto-confirm after brief delay to show review
    setTimeout(() => setConfirmed(true), 800);
  };

  const handleCouponComplete = () => {
    setStep("payment");
  };

  const total = appliedCoupon ? productsData.netDiscountPriceTotal - appliedCoupon.couponDiscount : productsData.netDiscountPriceTotal;

  return (
    <div
      style={{ fontFamily: LATO, background: "#fdfaf7", color: "#2a1a10" }}
      className="min-h-screen"
    >
      <style>{`
        @keyframes pop { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.3s ease both; }
      `}</style>

      <Navbar step={step} />

      {confirmed ? (
        <OrderConfirmed />
      ) : (
        <main className="max-w-6xl mx-auto px-3 md:px-6 py-5 md:py-10">
          {/* Page Title */}
          <div className="mb-4 md:mb-8">
            <h1
              style={{
                fontFamily: CORMORANT,
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 600,
                color: BROWN,
                lineHeight: 1.15,
              }}
            >
              Secure <em style={{ color: ORANGE }}>Checkout</em>
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              Complete your order in a few easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* ── LEFT: STEPS ── */}
            <div className="flex flex-col gap-4 animate-in">
              {/* ADDRESS */}
              <SectionCard
                title="Delivery Address"
                icon={<MapPin size={16} />}
                completed={step !== "address" && !!address}
                summary={
                  address
                    ? `${address.name} · ${address.city}, ${address.postalCode}`
                    : ""
                }
                onEdit={() => setStep("address")}
              >
                <AddressSection onComplete={handleAddressComplete} />
              </SectionCard>

              {/* COUPON */}
              {(step === "coupon" ||
                step === "payment" ||
                step === "review") && (
                <SectionCard
                  title="Coupons"
                  icon={<TicketPercent size={16} />}
                  completed={step === "payment"}
                  summary={
                    appliedCoupon
                      ? `Coupon Applied: ${appliedCoupon.couponCode}`
                      : "No coupon applied"
                  }
                  onEdit={() => setStep("coupon")}
                >
                  <CouponSection
                    applied={appliedCoupon}
                    onApply={setAppliedCoupon}
                    slug={slug}
                    handleSubmit={handleCouponComplete}
                  />
                </SectionCard>
              )}

              {/* PAYMENT */}
              {(step === "payment" || step === "review") && (
                <SectionCard
                  title="Payment"
                  icon={<CreditCard size={16} />}
                  completed={step === "review"}
                  summary={
                    paymentMethod
                      ? `Paid via ${paymentMethod.toUpperCase()}`
                      : ""
                  }
                  onEdit={() => setStep("payment")}
                >
                  <PaymentSection
                    total={total}
                    selectedAddressId={address ? address.id : null}
                    customerName={address?.name || ""}
                    customerPhone={address?.phone || ""}
                    onComplete={handlePaymentComplete}
                    slug={slug}
                    couponCode={appliedCoupon?.couponCode || undefined}
                  />
                </SectionCard>
              )}

              {/* REVIEW */}
              {step === "review" && (
                <SectionCard title="Order Review" icon={<Package size={16} />}>
                  <OrderReview
                    slug={slug}
                    deliveryPrice={0}
                    couponDiscount={0}
                    paymentMethod={paymentMethod}
                    paymentId={paymentId}
                  />
                </SectionCard>
              )}

              {/* Back link */}
              {slug === "cart" && (
                <a
                  href="/my-cart"
                  className="flex items-center gap-2 text-sm font-bold self-start mt-1 transition-colors hover:underline"
                  style={{
                    color: LIGHT_BROWN,
                    fontFamily: LATO,
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeft size={14} />
                  Back to Cart
                </a>
              )}
            </div>

            {/* ── RIGHT: SUMMARY ── */}
            <div className="sticky top-20">
              <OrderSummarySidebar
                productsData={productsData}
                couponDiscount={appliedCoupon?.couponDiscount || 0}
                deliveryPrice={0}
              />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default CheckoutPageClient;
