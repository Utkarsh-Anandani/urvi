"use client";
import { useRef } from "react";
import { GoldDivider, ImagePlaceholder, SectionLabel, SectionTitle } from "../../page";
import { GOLD, GREEN, LATO } from "@/lib/helper";
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRODUCTS = [
  {
    id: 1,
    name: "Organic Green Tea",
    category: "Beverages",
    price: "₹899",
    originalPrice: "₹1,199",
    rating: 4.8,
    reviews: 342,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Golden Turmeric Blend",
    category: "Supplements",
    price: "₹1,249",
    originalPrice: "",
    rating: 4.6,
    reviews: 189,
    badge: "New",
  },
  {
    id: 3,
    name: "Herbal Face Serum",
    category: "Skincare",
    price: "₹2,099",
    originalPrice: "₹2,499",
    rating: 4.9,
    reviews: 512,
    badge: "Top Rated",
  },
  {
    id: 4,
    name: "Matcha Powder 100g",
    category: "Beverages",
    price: "₹649",
    originalPrice: "",
    rating: 4.7,
    reviews: 274,
    badge: "",
  },
  {
    id: 5,
    name: "Rose Hip Oil 30ml",
    category: "Skincare",
    price: "₹1,549",
    originalPrice: "₹1,899",
    rating: 4.5,
    reviews: 96,
    badge: "Sale",
  },
  {
    id: 6,
    name: "Ashwagandha Caps",
    category: "Supplements",
    price: "₹1,099",
    originalPrice: "",
    rating: 4.4,
    reviews: 208,
    badge: "",
  },
];

const FeaturedProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "right" ? 320 : -320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 px-5 lg:px-8" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <SectionLabel>Our Products</SectionLabel>
            <SectionTitle>
              Featured <em>Picks</em>
            </SectionTitle>
            <GoldDivider className="max-w-xs mt-4" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: `${GOLD}50`,
                color: GOLD,
                background: "#fff",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: `${GOLD}50`,
                color: GOLD,
                background: "#fff",
              }}
            >
              <ChevronRight size={18} />
            </button>
            <Button
              variant="outline"
              className="ml-2 h-10 text-xs uppercase tracking-wider rounded-sm"
              style={{
                borderColor: `${GREEN}50`,
                color: GREEN,
                fontFamily: LATO,
              }}
            >
              View All
            </Button>
          </div>
        </div>

        {/* Scrollable product row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className="shrink-0 w-64 border-0 group cursor-pointer hover:shadow-xl transition-all duration-300"
              style={{
                outline: `1px solid #f0f0f0`,
                borderRadius: "4px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent className="p-0">
                {/* Product image */}
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: "4px 4px 0 0" }}
                >
                  <ImagePlaceholder
                    height="220px"
                    label={product.name}
                    rounded="4px 4px 0 0"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge
                      className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm"
                      style={{
                        background:
                          product.badge === "Sale" ? "#dc2626" : GREEN,
                        color: "#fff",
                        border: "none",
                        fontFamily: LATO,
                      }}
                    >
                      {product.badge}
                    </Badge>
                  )}
                  <button
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    style={{ color: "#e11d48" }}
                  >
                    <Heart size={15} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: GOLD, fontFamily: LATO }}
                  >
                    {product.category}
                  </p>
                  <p
                    className="font-semibold text-sm leading-snug mb-2"
                    style={{ color: "#111827", fontFamily: LATO }}
                  >
                    {product.name}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        fill={i < Math.floor(product.rating) ? GOLD : "none"}
                        color={GOLD}
                      />
                    ))}
                    <span
                      className="text-xs text-gray-400 ml-1"
                      style={{ fontFamily: LATO }}
                    >
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-base font-bold"
                        style={{ color: GREEN, fontFamily: LATO }}
                      >
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span
                          className="text-xs line-through text-gray-400"
                          style={{ fontFamily: LATO }}
                        >
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: `${GREEN}15`, color: GREEN }}
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
