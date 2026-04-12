"use client";
import { Card, CardContent } from "@/components/ui/card";
import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { Check, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { fmt } from "../cart-page-client";

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.floor(rating) ? ORANGE : "none"}
          stroke={i <= Math.ceil(rating) ? ORANGE : LIGHTER_ORANGE}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

const SUGGESTED = [
  {
    id: 4,
    name: "Wood-Pressed Mustard Oil",
    variant: "1L Bottle",
    price: 380,
    originalPrice: 450,
    rating: 4.5,
    reviews: 612,
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=80",
    tag: "Popular",
  },
  {
    id: 5,
    name: "Black Sesame Oil",
    variant: "500ml Bottle",
    price: 460,
    originalPrice: 520,
    rating: 4.4,
    reviews: 233,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    tag: "Immunity",
  },
  {
    id: 6,
    name: "Khapli Wheat Atta",
    variant: "1kg Pack",
    price: 210,
    originalPrice: 260,
    rating: 4.6,
    reviews: 441,
    image:
      "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&q=80",
    tag: "New",
  },
];

const SuggestedProducts = ({
  onAdd,
}: {
  onAdd: (id: number, name: string) => void;
}) => {
  const [added, setAdded] = useState<number[]>([]);

  const handleAdd = (id: number, name: string) => {
    setAdded((prev) => [...prev, id]);
    onAdd(id, name);
    setTimeout(() => setAdded((prev) => prev.filter((x) => x !== id)), 2000);
  };

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-5">
        <span
          style={{
            fontFamily: CORMORANT,
            fontSize: 26,
            fontWeight: 600,
            color: BROWN,
          }}
        >
          You Might Also Love
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, #f0e6dc, transparent)" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {SUGGESTED.map((p) => (
          <Card
            key={p.id}
            className="border overflow-hidden group transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ borderColor: "#f0e6dc", background: "#fff" }}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: "1", background: LIGHTER_ORANGE }}
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {p.tag && (
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: BROWN,
                    color: "#fff",
                    fontFamily: LATO,
                    fontSize: 9,
                    letterSpacing: "0.5px",
                  }}
                >
                  {p.tag.toUpperCase()}
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <p
                className="font-bold text-xs leading-4"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {p.name}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "#9a7a6e", fontFamily: LATO }}
              >
                {p.variant}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <StarRating rating={p.rating} size={11} />
                <span
                  className="text-xs"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  ({p.reviews})
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span
                    className="font-black text-sm"
                    style={{ color: BROWN, fontFamily: LATO }}
                  >
                    {fmt(p.price)}
                  </span>
                  <span
                    className="text-xs line-through ml-1"
                    style={{ color: "#b0a09a" }}
                  >
                    {fmt(p.originalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => handleAdd(p.id, p.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: added.includes(p.id) ? "#e8f5e9" : LIGHTER_ORANGE,
                    color: added.includes(p.id) ? "#2d6a4f" : BROWN,
                    border: `1.5px solid ${added.includes(p.id) ? "#a8d5b5" : "#e8d8c8"}`,
                  }}
                >
                  {added.includes(p.id) ? (
                    <Check size={14} />
                  ) : (
                    <ShoppingCart size={14} />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default SuggestedProducts;