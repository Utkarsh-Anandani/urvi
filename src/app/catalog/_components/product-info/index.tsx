"use client";
import { Badge } from "@/components/ui/badge";
import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader, ShoppingCart, Zap } from "lucide-react";
import { Product, Variant } from "@/types/product.types";
import { useAddToCart } from "@/hooks/useCart";
import { StarRating } from "../star-rating";
import { setBuyNowItem } from "@/lib/buy-now";
import { useRouter } from "next/navigation";
import { LocalCartItem } from "@/lib/cart";

type Props = {
  product: Product;
  selectedVariant: Variant;
  setSelectedVariant: (v: Variant) => void;
  isLoggedIn: boolean;
  slug: string;
};

const ProductInfo = ({
  product,
  selectedVariant,
  setSelectedVariant,
  isLoggedIn,
  slug,
}: Props) => {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const { mutate: addToCart, isPending: isAddToCartPending } =
    useAddToCart(isLoggedIn);

  const handleAddToCart = () => {
    const cartItem: LocalCartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: qty,
    };

    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    const cartItem: LocalCartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: qty,
    };

    setBuyNowItem(cartItem);
    const params = new URLSearchParams({
      source: `/catalog/products/${slug}`,
    });

    router.push(`/checkout/buy-now?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        {product?.tags.length > 0 && (
          <Badge
            variant="outline"
            className="mb-3 text-xs font-bold tracking-widest uppercase"
            style={{
              borderColor: LIGHTER_ORANGE,
              background: LIGHTER_ORANGE,
              color: BROWN,
              fontFamily: LATO,
            }}
          >
            {product.tags.map((t, i) => (
              <div className="">
                {t} {i !== product.tags.length - 1 ? <>&bull;</> : <></>}
              </div>
            ))}
          </Badge>
        )}

        <h1
          style={{
            fontFamily: CORMORANT,
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 600,
            color: BROWN,
            lineHeight: 1.15,
          }}
        >
          Urvi's
          <br />
          <em style={{ color: ORANGE, fontStyle: "italic" }}>{product.name}</em>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <StarRating rating={product.avgRating} size={18} />
        <span
          className="font-bold text-sm"
          style={{ color: BROWN, fontFamily: LATO }}
        >
          {product.avgRating.toPrecision(2)}
        </span>
        <span
          className="text-sm underline cursor-pointer"
          style={{ color: "#9a7a6e", fontFamily: LATO }}
        >
          {product.reviewCount} reviews
        </span>
        {/* <Badge
          variant="secondary"
          className="text-xs"
          style={{
            background: "#e8f5e9",
            color: "#2d6a4f",
            fontFamily: LATO,
            fontWeight: 700,
          }}
        >
          ✔ 888 happy customers
        </Badge> */}
      </div>

      <Separator style={{ background: "#f0e6dc" }} />

      {/* Price */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span
            style={{
              fontFamily: CORMORANT,
              fontSize: 44,
              fontWeight: 700,
              color: BROWN,
              lineHeight: 1,
            }}
          >
            ₹{selectedVariant?.discountPrice || selectedVariant.price}
          </span>
          {product.discountPrice && (
            <span
              className="text-lg line-through"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              ₹{selectedVariant.price}
            </span>
          )}
        </div>

        {/* Coupon */}
        {/* <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 w-fit"
          style={{
            background: "#fff8f2",
            border: `1.5px dashed ${ORANGE}`,
          }}
        >
          <span className="text-sm" style={{ color: LIGHT_BROWN, fontFamily: LATO }}>
            Best price{" "}
            <strong style={{ color: BROWN }}>
              ₹{Math.round(variant.price * 0.7).toLocaleString("en-IN")}
            </strong>{" "}
            with coupon
          </span>
          <Badge
            style={{
              background: ORANGE,
              color: "#fff",
              fontFamily: LATO,
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.5px",
              padding: "3px 10px",
            }}
          >
            PURE30
          </Badge>
        </div> */}
        <span
          className="text-sm"
          style={{ color: "#9a7a6e", fontFamily: LATO }}
        >
          MRP (incl. taxes)
        </span>
      </div>

      <Separator style={{ background: "#f0e6dc" }} />

      {/* Variants */}
      {product.variants.length && (
        <div>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#9a7a6e", fontFamily: LATO }}
          >
            Select Variant
          </p>
          <div className="grid grid-cols-3 gap-2">
            {product.variants.map((v, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSelectedVariant(v)}
                      className="relative rounded-xl p-3 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        border: `2px solid ${v.id === selectedVariant.id ? ORANGE : "#e8d8c8"}`,
                        background:
                          v.id === selectedVariant.id ? "#fff5eb" : "#fdfaf7",
                        boxShadow:
                          v.id === selectedVariant.id
                            ? `0 4px 12px rgba(247,132,31,0.15)`
                            : "none",
                      }}
                    >
                      {v.id === selectedVariant.id && (
                        <span
                          className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: ORANGE,
                            color: "#fff",
                            fontFamily: LATO,
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Selected
                        </span>
                      )}
                      {/* {i !== selectedVariant && (
                      <span
                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: BROWN,
                          color: "#fff",
                          fontFamily: LATO,
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Best Value
                      </span>
                    )} */}
                      <div
                        className="font-bold text-sm"
                        style={{ color: BROWN, fontFamily: LATO }}
                      >
                        {v.name}
                      </div>
                      <div
                        className="text-sm font-bold mt-0.5"
                        style={{
                          color:
                            v.id === selectedVariant.id ? ORANGE : "#3d2014",
                        }}
                      >
                        ₹{(v?.discountPrice || v.price).toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs" style={{ color: "#9a7a6e" }}>
                        only {v.stock} units left
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {v.name} - ₹
                      {(v?.discountPrice || v.price).toLocaleString("en-IN")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {/* Qty + Buttons */}
      <div className="flex items-center gap-3">
        {/* Qty */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ border: `2px solid #e8d8c8` }}
        >
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-12 flex items-center justify-center transition-colors text-xl font-bold hover:bg-orange-50"
            style={{ color: BROWN }}
          >
            −
          </button>
          <span
            className="w-10 text-center font-bold text-base"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-12 flex items-center justify-center transition-colors text-xl font-bold hover:bg-orange-50"
            style={{ color: BROWN }}
          >
            +
          </button>
        </div>

        <Button
          disabled={isAddToCartPending}
          onClick={handleAddToCart}
          variant="outline"
          className="flex-1 h-12 font-bold text-sm tracking-wide uppercase transition-all hover:scale-[1.01]"
          style={{
            borderColor: BROWN,
            color: BROWN,
            fontFamily: LATO,
            borderWidth: 2,
          }}
        >
          {isAddToCartPending ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <>
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        <Button
          onClick={handleBuyNow}
          className="flex-1 h-12 font-bold text-sm tracking-wide uppercase transition-all hover:scale-[1.01]"
          style={{
            background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
            color: "#fff",
            fontFamily: LATO,
            boxShadow: `0 8px 24px rgba(85,19,5,0.3)`,
            border: "none",
          }}
        >
          <Zap size={16} className="mr-2" />
          Buy Now
        </Button>
      </div>

      {/* Trust Pills */}
      {/* <div className="flex flex-wrap gap-2">
        {[
          { icon: <Truck size={13} />, label: "Free Delivery ₹599+" },
          { icon: <FlaskConical size={13} />, label: "Lab Tested" },
          { icon: <Shield size={13} />, label: "FSSAI Certified" },
          { icon: <RotateCcw size={13} />, label: "Easy Returns" },
        ].map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: LIGHTER_ORANGE,
              color: LIGHT_BROWN,
              fontFamily: LATO,
            }}
          >
            {t.icon}
            {t.label}
          </div>
        ))}
      </div> */}

      <Separator style={{ background: "#f0e6dc" }} />

      {/* Description */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#fdfaf7",
          border: `1px solid #f0e6dc`,
        }}
      >
        <p
          className="text-sm leading-7"
          style={{ color: "#4a2a18", fontFamily: LATO }}
        >
          {product.description}
        </p>
      </div>

      {/* Highlight Cards */}
      {/* <div className="grid grid-cols-2 gap-3">
        {HIGHLIGHTS.map((h, i) => (
          <Card
            key={i}
            className="border transition-all hover:shadow-md"
            style={{ borderColor: "#f0e6dc", background: "#fdfaf7" }}
          >
            <CardContent className="p-4 flex gap-3">
              <div
                className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: LIGHTER_ORANGE, color: BROWN }}
              >
                {h.icon}
              </div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  {h.title}
                </p>
                <p
                  className="text-xs mt-1 leading-5"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  {h.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
};

export default ProductInfo;
