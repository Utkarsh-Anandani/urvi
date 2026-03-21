import { Button } from "@/components/ui/button";
import { CORMORANT, GOLD, GREEN, GREEN_LIGHT, LATO } from "@/lib/helper";
import { ArrowRight, Check } from "lucide-react";
import { ImagePlaceholder } from "../../page";

const Hero = () => (
  <section
    className="relative overflow-hidden"
    style={{
      background: "radial-gradient(ellipse at 70% 50%, #dcfce7 0%, #ffffff 55%, #fefce8 100%)",
      minHeight: "88vh",
    }}
  >
    {/* Decorative bg circles */}
    <div
      className="absolute top-10 right-10 w-72 h-72 rounded-full pointer-events-none opacity-20"
      style={{ background: `radial-gradient(circle, ${GREEN}30, transparent 70%)` }}
    />
    <div
      className="absolute bottom-10 left-5 w-48 h-48 rounded-full pointer-events-none opacity-15"
      style={{ background: `radial-gradient(circle, ${GOLD}40, transparent 70%)` }}
    />

    {/* Corner ornaments */}
    {["top-8 left-8", "top-8 right-8 rotate-90", "bottom-8 left-8 -rotate-90", "bottom-8 right-8 rotate-180"].map((pos, i) => (
      <svg key={i} width="40" height="40" viewBox="0 0 40 40" fill="none" className={`absolute ${pos} opacity-20`}>
        <path d="M3 3 L3 18 M3 3 L18 3" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="3" cy="3" r="2" fill={GOLD} />
      </svg>
    ))}

    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
      {/* Left — copy */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-px w-10" style={{ background: GOLD }} />
          <span className="text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: GOLD, fontFamily: LATO }}>
            Pure · Natural · Certified
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08]"
          style={{ fontFamily: CORMORANT, color: "#111827" }}
        >
          Nature's Best,{" "}
          <span
            className="italic"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, ${GOLD})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Crafted
          </span>{" "}
          for You
        </h1>

        <p
          className="text-base md:text-lg leading-relaxed max-w-md"
          style={{ color: "#6b7280", fontFamily: LATO, fontWeight: 400 }}
        >
          Premium organic wellness products rooted in ancient traditions and modern science.
          Discover skincare, teas, and supplements that truly nourish.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="gap-2 h-12 px-7 text-sm uppercase tracking-wider rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
              border: "none",
              fontFamily: LATO,
              boxShadow: `0 4px 20px ${GREEN}35`,
              color: "#fff",
            }}
          >
            Shop the Collection <ArrowRight size={15} />
          </Button>
          <Button
            variant="outline"
            className="h-12 px-7 text-sm uppercase tracking-wider rounded-sm"
            style={{
              borderColor: `${GOLD}60`,
              color: GOLD,
              fontFamily: LATO,
              background: "transparent",
            }}
          >
            Our Story
          </Button>
        </div>

        {/* Trust micro-badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {["USDA Organic", "Cruelty Free", "Vegan Friendly"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: GREEN, fontFamily: LATO }}>
              <Check size={13} style={{ color: GREEN }} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right — hero image */}
      <div className="relative flex items-center justify-center">
        {/* Main hero image */}
        <div className="relative w-full max-w-sm mx-auto">
          <ImagePlaceholder
            height="500px"
            label="Hero Product Image"
            rounded="8px"
            style={{ boxShadow: `0 24px 80px ${GREEN}25, 0 8px 32px rgba(0,0,0,0.08)` }}
          />

          {/* Floating badge — top left */}
          <div
            className="absolute -left-6 top-16 px-4 py-3 rounded-sm shadow-lg"
            style={{ background: "#fff", border: `1px solid ${GOLD}30`, boxShadow: `0 8px 32px rgba(0,0,0,0.10)` }}
          >
            <p className="text-xs uppercase tracking-wider font-bold" style={{ color: GOLD, fontFamily: LATO }}>★ Best Seller</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: "#111", fontFamily: LATO }}>Organic Tea</p>
          </div>

          {/* Floating badge — bottom right */}
          <div
            className="absolute -right-6 bottom-16 px-4 py-3 rounded-sm shadow-lg"
            style={{ background: "#fff", border: `1px solid ${GREEN}30`, boxShadow: `0 8px 32px rgba(0,0,0,0.10)` }}
          >
            <p className="text-xs uppercase tracking-wider font-bold" style={{ color: GREEN, fontFamily: LATO }}>🌿 Certified Organic</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: "#111", fontFamily: LATO }}>50K+ Happy Customers</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;