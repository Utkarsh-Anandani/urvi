"use client";
import { useState } from "react";
import { ShoppingCart, Trash2, Leaf, Check, ArrowLeft, X } from "lucide-react";
import OrderSummary from "../order-summary";
import SuggestedProducts from "../suggested-products";
import DeliveryInfo from "../delivery-info";
import CartItemCard from "../cart-item-card";
import EmptyCart from "../empty-cart";
import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHT_ORANGE,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import {
  useAddToCart,
  useCart,
  useClearCart,
  useRemoveFromCart,
} from "@/hooks/useCart";
import { LocalCartItem } from "@/lib/cart";
import { useRouter } from "next/navigation";

// ─── TYPES ───────────────────────────────────────────────────────
export type CartItem = {
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    isActive: boolean;
    images: {
      id: string;
      productId: string;
      url: string;
      position: number;
    }[];
  };
  variant: {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    stock: number;
  } | null;
};

// ─── TOAST NOTIFICATION ──────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
      style={{
        background: BROWN,
        color: "#fff",
        fontFamily: LATO,
        fontSize: 13,
        fontWeight: 600,
        minWidth: 260,
        boxShadow: `0 8px 32px rgba(85,19,5,0.35)`,
        animation: "slideUp 0.3s ease",
      }}
    >
      <ShoppingCart size={15} color={LIGHT_ORANGE} />
      {message}
      <button
        onClick={onClose}
        className="ml-auto opacity-70 hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export type ProductsData =
  | {
      status: number;
      data: {
        totalQuantity: number;
        netPriceTotal: number;
        netDiscountPriceTotal: number;
        cartItems: CartItem[];
      };
    }
  | {
      status: number;
      data: null;
    };

const CartPageClient = ({ isloggedIn }: { isloggedIn: boolean }) => {
  // const [couponCode, setCouponCode] = useState<string | null>(null);
  // const [discountPct, setDiscountPct] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const { data } = useCart(isloggedIn);
  const { data: productsData } = data as ProductsData;
  const { mutate: removeFromCart, isPending: isRemovalPending } =
    useRemoveFromCart(isloggedIn);
  const { mutate: addToCart, isPending: isAdditionPending } =
    useAddToCart(isloggedIn);
  const { mutate: clearCart } = useClearCart(isloggedIn);

  const handleQtyChange = (
    productId: string,
    variantId: string | undefined,
    type: "inc" | "dec",
  ) => {
    const cartItem: LocalCartItem = {
      productId,
      variantId,
      quantity: 1,
    };

    if (type === "dec") {
      removeFromCart(cartItem);
    } else {
      addToCart(cartItem);
    }
  };

  const handleRemove = (
    productId: string,
    variantId: string | undefined,
    quantity: number,
  ) => {
    const cartItem: LocalCartItem = {
      productId,
      variantId,
      quantity,
    };

    removeFromCart(cartItem);
  };

  // const handleCoupon = (code: string, pct: number) => {
  //   setCouponCode(code || null);
  //   setDiscountPct(pct);
  // };

  return (
    <>
      {productsData?.cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <main className="max-w-2xl xl:max-w-6xl mx-auto px-3 md:px-6 py-3 md:py-6">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                style={{
                  fontFamily: CORMORANT,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 600,
                  color: BROWN,
                  lineHeight: 1.15,
                }}
              >
                Your Cart
                {productsData?.totalQuantity && (
                  <em style={{ color: ORANGE, fontStyle: "italic" }}>
                    {" "}
                    ({productsData.totalQuantity} items)
                  </em>
                )}
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "#9a7a6e", fontFamily: LATO }}
              >
                Review your items before checkout
              </p>
            </div>
            <button
              onClick={() => router.push("/catalog/all-products")}
              className="hidden md:flex items-center gap-2 text-sm font-bold transition-colors hover:underline"
              style={{ color: LIGHT_BROWN, fontFamily: LATO }}
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-4">
              {/* Cart Items */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: `1px solid #f0e6dc`, background: "#fdfaf7" }}
              >
                {/* Items header */}
                <div
                  className="px-5 py-3.5 flex items-center justify-between"
                  style={{
                    borderBottom: "1px solid #f0e6dc",
                    background: "#fff",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "#9a7a6e", fontFamily: LATO }}
                  >
                    {productsData?.cartItems.length} Products
                  </span>
                  <button
                    onClick={() => clearCart()}
                    className="text-xs font-bold flex items-center gap-1.5 transition-colors hover:text-red-500"
                    style={{ color: "#9a7a6e", fontFamily: LATO }}
                  >
                    <Trash2 size={12} />
                    Clear all
                  </button>
                </div>

                <div className="p-2 md:p-4 flex flex-col gap-3">
                  {productsData?.cartItems.map((item, index) => (
                    <CartItemCard
                      key={index}
                      item={item}
                      onQtyChange={handleQtyChange}
                      onRemove={handleRemove}
                      isAdditionPending={isAdditionPending}
                      isRemovalPending={isRemovalPending}
                    />
                  ))}
                </div>
              </div>

              {/* Coupon */}
              {/* <CouponSection onApply={handleCoupon} applied={couponCode} /> */}

              {/* Order Summary */}
              <div className="block xl:hidden">
                <OrderSummary
                  couponCode={null}
                  discountPct={0}
                  originalTotal={productsData?.netPriceTotal || 0}
                  discountTotal={productsData?.netDiscountPriceTotal || 0}
                  totalItems={productsData?.totalQuantity || 0}
                />
              </div>

              {/* Delivery Info */}
              <DeliveryInfo />

              {/* Suggested */}
              <SuggestedProducts isLoggedIn={isloggedIn} />
            </div>

            {/* ── RIGHT COLUMN: ORDER SUMMARY ── */}
            <div className="sticky top-20 hidden xl:flex flex-col gap-4">
              <OrderSummary
                couponCode={null}
                discountPct={0}
                originalTotal={productsData?.netPriceTotal || 0}
                discountTotal={productsData?.netDiscountPriceTotal || 0}
                totalItems={productsData?.totalQuantity || 0}
              />

              {/* Purity Promise */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: `linear-gradient(135deg, ${LIGHTER_ORANGE} 0%, #fdfaf7 100%)`,
                  border: `1px solid ${LIGHTER_ORANGE}`,
                }}
              >
                <div
                  className="flex items-center gap-2 mb-3"
                  style={{
                    fontFamily: CORMORANT,
                    fontSize: 18,
                    fontWeight: 600,
                    color: BROWN,
                  }}
                >
                  <Leaf size={16} style={{ color: ORANGE }} />
                  The PuraFarm Promise
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    "Cold-pressed below 45°C — nutrients fully preserved",
                    "Zero chemicals, additives, or preservatives",
                    "FSSAI certified & independently lab tested",
                    "Sustainably sourced from Indian farms",
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check
                        size={13}
                        className="shrink-0 mt-0.5"
                        style={{ color: ORANGE }}
                      />
                      <span
                        className="text-xs leading-5"
                        style={{ color: LIGHT_BROWN, fontFamily: LATO }}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
};

export default CartPageClient;
