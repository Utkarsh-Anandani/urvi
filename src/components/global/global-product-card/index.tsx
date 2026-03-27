"use client";
import { ImagePlaceholder } from "@/app/(website)/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BROWN,
  LATO,
  LIGHT_ORANGE,
  ORANGE,
} from "@/lib/helper";
import { Product } from "@/types/product.types";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AlignmentTypes = "list" | "grid";

export const ProductCard = ({
  product,
  view,
}: {
  product: Product;
  view: AlignmentTypes;
}) => {
  const [wished, setWished] = useState(false);
  const discountPercentage =
    Math.round(
      (1 -
        (product?.discountPrice ? product?.discountPrice : product.price) /
          product.price) *
        100,
    ) || 0;
  const router = useRouter();

  if (view === "list") {
    return (
      <Card
        onClick={() => router.push(`/catalog/products/${product.slug}`)}
        className="border-0 p-0 group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
        style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
      >
        <CardContent className="p-0 flex flex-row">
          {/* Image */}
          <div className="relative shrink-0 w-40 sm:w-52">
            <ImagePlaceholder
              src={product?.images ? product.images[0].url : undefined}
              height="160px"
              label={product.name}
              rounded="4px 0 0 4px"
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
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between flex-1 p-5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: BROWN, fontFamily: LATO }}
                  >
                    {product.category?.name}
                  </p>
                  <h3
                    className="font-semibold text-base leading-tight"
                    style={{ color: "#111827", fontFamily: LATO }}
                  >
                    {product.name}
                  </h3>
                </div>
                <button
                  onClick={() => setWished((w) => !w)}
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110"
                  style={{
                    background: wished ? "#ffe4e6" : "#f9fafb",
                    color: wished ? "#e11d48" : "#d1d5db",
                  }}
                >
                  <Heart size={14} fill={wished ? "#e11d48" : "none"} />
                </button>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill={i < Math.floor(4.7) ? ORANGE : "none"}
                      color={ORANGE}
                    />
                  ))}
                </div>
                <span
                  className="text-xs text-gray-400"
                  style={{ fontFamily: LATO }}
                >
                  {4.7} ({"1.5k"})
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${ORANGE}12`, color: ORANGE, fontFamily: LATO }}>
                    {tag}
                  </span>
                ))}
                {product.stock <= 0 && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontFamily: LATO,
                    }}
                  >
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-xl font-bold"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  ₹{(product?.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span
                    className="text-sm line-through text-gray-400"
                    style={{ fontFamily: LATO }}
                  >
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
                {product.discountPrice && (
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                    style={{
                      background: "#dcfce7",
                      color: ORANGE,
                      fontFamily: LATO,
                    }}
                  >
                    {Math.round(
                      (1 - product.discountPrice / product.price) * 100,
                    )}
                    % off
                  </span>
                )}
              </div>
              <Button
                disabled={product.stock <= 0}
                className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                style={{
                  background:
                    product.stock > 0
                      ? `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`
                      : "#e5e7eb",
                  border: "none",
                  fontFamily: LATO,
                  color: product.stock > 0 ? "#fff" : "#9ca3af",
                }}
              >
                <ShoppingBag size={13} />
                {product.stock > 0 ? "Add to Cart" : "Sold Out"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      onClick={() => router.push(`/catalog/products/${product.slug}`)}
      className="border-0 p-0 group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{
        outline: "1px solid #f0f0f0",
        borderRadius: "4px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative overflow-hidden">
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
            className="font-semibold text-sm leading-snug mb-2 truncate"
            style={{ color: "#111827", fontFamily: LATO }}
          >
            {product.name}
          </h3>
          <div className="flex flex-row items-center justify-start gap-2 pb-2">
            {product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${ORANGE}12`, color: ORANGE, fontFamily: LATO }}>
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
                fill={i < Math.floor(4.7) ? ORANGE : "none"}
                color={ORANGE}
              />
            ))}
            <span
              className="text-[10px] text-gray-400 ml-0.5"
              style={{ fontFamily: LATO }}
            >
              ({"1.5k"})
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
            <button
              disabled={product.stock <= 0}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-40"
              style={{ background: `${BROWN}15`, color: BROWN }}
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
