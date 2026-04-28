"use client";

import { BROWN, CORMORANT, GOLD, LATO, LIGHT_ORANGE, LIGHTER_BROWN } from "@/lib/helper";
import { useState } from "react";
import { ImagePlaceholder, SectionLabel, SectionTitle } from "../helper";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

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
      className="py-12 md:py-24 px-5 lg:px-8 relative overflow-hidden bg-orange-50"
      // style={{ background: LIGHTER_ORANGE }}
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
        <SectionTitle>What Our Customers Say</SectionTitle>

        {/* Card */}
        <Card
          className="border-0 relative mt-10"
          style={{
            background: LIGHT_ORANGE,
            backdropFilter: "blur(12px)",
            outline: `1px solid rgba(255,255,255,0.12)`,
            borderRadius: "4px",
          }}
        >
          <CardContent className="p-8 md:p-12">
            {/* Quote icon */}
            <Quote
              size={36}
              style={{ color: "#fff" }}
              className="mb-4 md:mb-6"
            />

            <p
              className="text-lg md:text-2xl font-light leading-relaxed mb-8 italic"
              style={{ color: BROWN, fontFamily: CORMORANT }}
            >
              &quot;{t.text}&quot;
            </p>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Avatar placeholder */}
              <ImagePlaceholder
                src="/story-1.JPG"
                label="Avatar"
                rounded="50%"
                style={{ flexShrink: 0 }}
                className="w-10! md:w-12! h-10! md:h-12!"
              />
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs opacity-60 mt-px md:mt-0.5"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  {t.location}
                </p>
              </div>
              <div className="ml-auto">
                <p
                  className="text-[10px] md:text-xs uppercase tracking-wider opacity-60"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  Purchased:
                </p>
                <p
                  className="text-[10px] md:text-xs font-semibold"
                  style={{ color: BROWN, fontFamily: LATO }}
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
            style={{ borderColor: BROWN, color: BROWN }}
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
                    i === active ? BROWN : LIGHTER_BROWN,
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: BROWN, color: BROWN }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;