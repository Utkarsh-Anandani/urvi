"use client";

import { CORMORANT, GOLD, GOLD_LIGHT, GREEN, LATO } from "@/lib/helper";
import { useState } from "react";
import { GoldDivider, ImagePlaceholder, SectionLabel, SectionTitle } from "../../page";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "Urvi has completely transformed my wellness routine. The Green Tea is unlike anything I've tasted — you can tell the quality is exceptional. Will never go back to supermarket brands.",
    product: "Organic Green Tea",
  },
  {
    name: "Arjun Mehta",
    location: "Bangalore, India",
    rating: 5,
    text: "I was skeptical about herbal supplements but the Ashwagandha capsules genuinely reduced my stress levels. The packaging is beautiful and the quality is pharma-grade. Highly recommend.",
    product: "Ashwagandha Capsules",
  },
  {
    name: "Sofia Patel",
    location: "Delhi, India",
    rating: 5,
    text: "The Herbal Face Serum is liquid gold. My skin has never looked this radiant. The fact that it's all-natural makes it even better. I've already gifted three bottles to friends.",
    product: "Herbal Face Serum",
  },
  {
    name: "Kabir Das",
    location: "Chennai, India",
    rating: 5,
    text: "Exceptional quality, fast delivery, and beautifully presented. The Golden Turmeric Blend has become my morning ritual. This brand truly understands what wellness means.",
    product: "Golden Turmeric Blend",
  },
];

const Testimonials = () => {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[active];

  return (
    <section
      className="py-24 px-5 lg:px-8 relative overflow-hidden"
      style={{ background: GREEN }}
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${GOLD} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${GOLD} 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <SectionLabel>Testimonials</SectionLabel>
        <SectionTitle light>What Our Customers Say</SectionTitle>
        <GoldDivider className="max-w-xs mx-auto mt-4 mb-12" />

        {/* Card */}
        <Card
          className="border-0 relative"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            outline: `1px solid rgba(255,255,255,0.12)`,
            borderRadius: "4px",
          }}
        >
          <CardContent className="p-8 md:p-12">
            {/* Quote icon */}
            <Quote
              size={36}
              style={{ color: GOLD, opacity: 0.4 }}
              className="mb-6"
            />

            {/* Stars */}
            <div className="flex items-center gap-1 mb-5">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={16} fill={GOLD_LIGHT} color={GOLD_LIGHT} />
              ))}
            </div>

            <p
              className="text-xl md:text-2xl font-light leading-relaxed mb-8 italic"
              style={{ color: "#fff", fontFamily: CORMORANT }}
            >
              "{t.text}"
            </p>

            <div className="flex items-center gap-4">
              {/* Avatar placeholder */}
              <ImagePlaceholder
                width="48px"
                height="48px"
                label="Avatar"
                rounded="50%"
                style={{ flexShrink: 0 }}
              />
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "#fff", fontFamily: LATO }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs opacity-60 mt-0.5"
                  style={{ color: "#fff", fontFamily: LATO }}
                >
                  {t.location}
                </p>
              </div>
              <div className="ml-auto">
                <p
                  className="text-xs uppercase tracking-wider opacity-60"
                  style={{ color: GOLD_LIGHT, fontFamily: LATO }}
                >
                  Purchased:
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: GOLD_LIGHT, fontFamily: LATO }}
                >
                  {t.product}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "24px" : "8px",
                  height: "8px",
                  background:
                    i === active ? GOLD_LIGHT : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;