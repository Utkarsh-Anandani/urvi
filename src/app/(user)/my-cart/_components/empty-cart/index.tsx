import { Button } from "@/components/ui/button";
import { BROWN, CORMORANT, LATO, LIGHT_BROWN, LIGHTER_ORANGE } from "@/lib/helper";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const EmptyCart = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: LIGHTER_ORANGE }}
      >
        <ShoppingCart size={40} style={{ color: BROWN }} />
      </div>
      <h2
        style={{
          fontFamily: CORMORANT,
          fontSize: 36,
          fontWeight: 600,
          color: BROWN,
        }}
      >
        Your cart is empty
      </h2>
      <p
        className="mt-2 text-sm max-w-xs"
        style={{ color: "#9a7a6e", fontFamily: LATO }}
      >
        Looks like you haven&apos;t added anything yet. Explore our pure, natural
        products and fill your cart with goodness.
      </p>
      <Button
        onClick={() => router.push("/catalog/all-products")}
        className="mt-8 px-10 h-12 text-sm font-bold uppercase tracking-wide"
        style={{
          background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
          color: "#fff",
          fontFamily: LATO,
          border: "none",
          boxShadow: `0 8px 24px rgba(85,19,5,0.25)`,
        }}
      >
        Shop Now
      </Button>
    </div>
  );
}

export default EmptyCart;