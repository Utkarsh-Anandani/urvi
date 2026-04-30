import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OrderConfirmed = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-[calc(100vh-64px)] flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Animated check */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{
          background: `radial-gradient(circle, ${LIGHTER_ORANGE} 0%, #fff5eb 100%)`,
          border: `3px solid ${ORANGE}`,
          boxShadow: `0 0 0 8px #fff5eb`,
          animation: "pop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <CheckCircle2 size={44} style={{ color: ORANGE }} />
      </div>

      <h1
        className="text-3xl md:text-5xl"
        style={{
          fontFamily: CORMORANT,
          fontWeight: 700,
          color: BROWN,
          lineHeight: 1.1,
        }}
      >
        Order <em style={{ color: ORANGE }}>Confirmed!</em>
      </h1>
      <p
        className="mt-3 text-xs md:text-sm leading-6"
        style={{ color: "#9a7a6e", fontFamily: LATO }}
      >
        Thank you for choosing PuraFarm. Your order has been placed successfully
        and is being prepared with care.
      </p>

      {/* Order details card */}
      {/* <div
        className="mt-8 rounded-2xl p-6 text-left"
        style={{ background: "#fff", border: "1px solid #f0e6dc", boxShadow: `0 8px 32px rgba(85,19,5,0.08)` }}
      >
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#9a7a6e", fontFamily: LATO }}>Order ID</p>
            <p className="font-black text-base" style={{ color: BROWN, fontFamily: LATO }}>{orderId}</p>
          </div>
          {paymentId && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#9a7a6e", fontFamily: LATO }}>Payment ID</p>
              <p className="font-bold text-sm truncate" style={{ color: BROWN, fontFamily: LATO }}>{paymentId}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#9a7a6e", fontFamily: LATO }}>Amount Paid</p>
            <p style={{ fontFamily: CORMORANT, fontSize: 24, fontWeight: 700, color: BROWN }}>{fmt(total)}</p>
          </div>
        </div>

        <Separator style={{ background: "#f0e6dc", margin: "20px 0" }} />

        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9a7a6e", fontFamily: LATO }}>Delivering to</p>
          <p className="font-bold text-sm" style={{ color: BROWN, fontFamily: LATO }}>{address.name}</p>
          <p className="text-sm leading-6" style={{ color: "#6b5a52", fontFamily: LATO }}>
            {address.line1}{address.line2 && `, ${address.line2}`},<br />
            {address.city}, {address.state} – {address.postalCode}
          </p>
        </div>
      </div> */}

      {/* CTAs */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <Button
          onClick={() => router.push("/my-profile")}
          className="flex-1 py-5 px-5 w-full font-bold text-sm uppercase tracking-wide"
          style={{
            background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
            color: "#fff",
            fontFamily: LATO,
            border: "none",
            boxShadow: `0 8px 24px rgba(85,19,5,0.25)`,
          }}
        >
          <Package size={15} className="mr-2" />
          Track My Order
        </Button>
        <Button
          onClick={() => router.push("/catalog/all-products")}
          variant="outline"
          className="flex-1 py-5 px-5 w-full font-bold text-sm uppercase tracking-wide"
          style={{
            borderColor: "#f0e6dc",
            color: "#9a7a6e",
            fontFamily: LATO,
            borderWidth: 1.5,
          }}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmed;
