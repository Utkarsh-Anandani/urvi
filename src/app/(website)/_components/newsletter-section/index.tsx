"use client";

import { CORMORANT, GOLD, GREEN, LATO, LIGHT_BROWN, BROWN } from "@/lib/helper";
import { useState } from "react";
import { GoldDivider, SectionLabel } from "../helper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
    // TODO: wire up email subscription API
  };

  return (
    <section
      id="newsletter"
      className="py-12 md:py-24 px-5 lg:px-8 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, #f2d9c3 0%, #fff 60%, #fefce8 100%)",
      }}
    >
      {/* Decorative corners */}
      {["top-6 left-6", "top-6 right-6 rotate-90", "bottom-6 left-6 -rotate-90", "bottom-6 right-6 rotate-180"].map((pos, i) => (
        <svg key={i} width="36" height="36" viewBox="0 0 36 36" fill="none" className={`absolute ${pos} opacity-25`}>
          <path d="M3 3 L3 16 M3 3 L16 3" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}

      <div className="max-w-2xl mx-auto text-center">
        <SectionLabel>Stay Updated</SectionLabel>
        <h2
          className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: CORMORANT, color: "#111827", letterSpacing: "0.04em" }}
        >
          Join the Urvi{" "}
          <span className="italic" style={{ color: GREEN }}>Circle</span>
        </h2>
        <GoldDivider className="max-w-xs mx-auto my-5" />
        <p className="text-base mb-8 leading-relaxed" style={{ color: "#6b7280", fontFamily: LATO }}>
          Subscribe to receive exclusive offers, wellness tips, new product launches,
          and early access to seasonal collections — straight to your inbox.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12! flex-1 rounded-sm border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-green-700/20 focus-visible:border-green-700 text-sm"
              style={{ fontFamily: LATO }}
            />
            <Button
              type="submit"
              className="h-12 px-7 text-xs uppercase tracking-wider rounded-sm whitespace-nowrap"
              style={{
                background: `linear-gradient(135deg, ${BROWN}, ${LIGHT_BROWN})`,
                border: "none",
                fontFamily: LATO,
                color: "#fff",
                boxShadow: `0 4px 16px ${BROWN}30`,
              }}
            >
              Subscribe
            </Button>
          </form>
        ) : (
          <div
            className="flex items-center justify-center gap-3 py-4 px-6 rounded-sm max-w-md mx-auto"
            style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}30` }}
          >
            <Check size={18} style={{ color: GREEN }} />
            <p className="text-sm font-semibold" style={{ color: GREEN, fontFamily: LATO }}>
              Thank you! You&apos;re now part of the Urvi Circle.
            </p>
          </div>
        )}

        <p className="text-xs mt-4 opacity-60" style={{ color: "#6b7280", fontFamily: LATO }}>
          No spam, ever. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;