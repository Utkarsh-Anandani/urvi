"use client";
import { fmt } from "@/app/(user)/my-cart/_components/cart-page-client";
import { ImagePlaceholder } from "@/app/(website)/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddToCart } from "@/hooks/useCart";
import { LocalCartItem } from "@/lib/cart";
import { BROWN, LATO, LIGHT_BROWN, ORANGE } from "@/lib/helper";
import { Product } from "@/types/product.types";
import { Check, Heart, Loader, ShoppingBag, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ProductCard = ({ product, isLoggedIn }: { product: Product, isLoggedIn: boolean }) => {
  const [wished, setWished] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { mutate: AddToCart, isPending: isAddToCartPending } = useAddToCart(isLoggedIn);

  const handleAddToCart = (variantId: string) => {
    const cartItem: LocalCartItem = {
      productId: product.id,
      variantId,
      quantity: 1
    };

    AddToCart(cartItem);
  }

  const discountPercentage =
    Math.round(
      (1 -
        (product?.discountPrice ? product?.discountPrice : product.price) /
          product.price) *
        100,
    ) || 0;
  const router = useRouter();

  return (
    <Card
      className="border-0 p-0 group hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{
        outline: "1px solid #f0f0f0",
        borderRadius: "4px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div
          onClick={() => router.push(`/catalog/products/${product.slug}`)}
          className="relative overflow-hidden cursor-pointer"
        >
          <ImagePlaceholder
            src={product?.images ? product.images[0].url : undefined}
            height="220px"
            label={product.name}
            rounded="4px 4px 0 0"
            className="group-hover:scale-105 transition-transform duration-500"
          />
          {discountPercentage > 25 && (
            <Badge
              className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm"
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                fontFamily: LATO,
              }}
            >
              Flat {discountPercentage}% off
            </Badge>
          )}
          {product.stock <= 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm"
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontFamily: LATO,
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
          <button
            onClick={() => setWished((w) => !w)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            style={{
              background: wished ? "#ffe4e6" : "#fff",
              color: wished ? "#e11d48" : "#d1d5db",
            }}
          >
            <Heart size={14} fill={wished ? "#e11d48" : "none"} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p
            className="text-[10px] uppercase tracking-wider mb-1"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            {product?.category?.name || ""}
          </p>
          <h3
            onClick={() => router.push(`/catalog/products/${product.slug}`)}
            className="font-semibold text-sm leading-snug mb-2 truncate cursor-pointer"
            style={{ color: "#111827", fontFamily: LATO }}
          >
            {product.name}
          </h3>
          <div className="flex flex-row items-center justify-start gap-2 pb-2">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: `${ORANGE}12`,
                  color: ORANGE,
                  fontFamily: LATO,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < Math.floor(product.avgRating) ? ORANGE : "none"}
                color={ORANGE}
              />
            ))}
            <span
              className="text-[10px] text-gray-400 ml-0.5"
              style={{ fontFamily: LATO }}
            >
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-base font-bold"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  ₹{(product?.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span
                    className="text-xs line-through text-gray-400"
                    style={{ fontFamily: LATO }}
                  >
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {product.discountPrice && (
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: ORANGE, fontFamily: LATO }}
                >
                  Save{" "}
                  {Math.round(
                    (1 - product.discountPrice / product.price) * 100,
                  )}
                  %
                </span>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  disabled={product.stock <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-40"
                  style={{ background: `${BROWN}15`, color: BROWN }}
                >
                  <ShoppingBag size={14} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Product Variants</DialogTitle>
                  <DialogDescription>
                    Select a variant to continue
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col gap-2 p-1">
                  {product.variants.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full p-2 rounded-sm border ${selectedVariant.id === v.id ? "border-orange-400 bg-orange-50" : "border-neutral-400 bg-neutral-50"} flex flex-col gap-1 cursor-pointer`}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-3">
                          <ImagePlaceholder
                            width="60px"
                            height="60px"
                            src={
                              product.images && product.images.length > 0
                                ? product?.images[0]?.url
                                : undefined
                            }
                          />
                          <div className="flex flex-col gap-0">
                            <h3
                              className={`text-base font-semibold ${selectedVariant.id === v.id ? "text-orange-400" : "text-neutral-400"}`}
                            >
                              {product.name} &bull; {v.name}
                            </h3>
                            <p
                              className={`text-sm font-medium ${selectedVariant.id === v.id ? "text-amber-600" : "text-neutral-300"}`}
                            >
                              {fmt(v?.discountPrice || v.price)}
                            </p>
                          </div>
                        </div>
                        {/* {v.discountPrice && <div
                          className={`flex items-center justify-center ${selectedVariant.id === v.id ? "text-white" : "text-neutral-300"}`}
                        >
                          Save{" "}
                          {Math.round((1 - v.discountPrice / v.price) * 100)}%
                        </div>} */}
                        {selectedVariant.id === v.id && (
                          <div
                            style={{ borderColor: BROWN }}
                            className="border-3 w-8 h-8 rounded-full bg-transparent flex items-center justify-center"
                          >
                            <Check size={18} style={{ color: BROWN }} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    disabled={isAddToCartPending}
                    onClick={() => handleAddToCart(selectedVariant.id)}
                    style={{ backgroundColor: LIGHT_BROWN }}
                    className="py-5! mt-2 font-semibold"
                  >
                    {isAddToCartPending ? <Loader size={16} className="animate-spin" /> : "Add to Cart"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
