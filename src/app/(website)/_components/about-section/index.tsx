import { CORMORANT, GREEN, GREEN_LIGHT, LATO } from "@/lib/helper";
import { ImagePlaceholder, SectionLabel } from "../../page";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "50K+",  label: "Happy Customers" },
  { value: "200+",  label: "Natural Ingredients" },
  { value: "12",    label: "Years of Expertise" },
  { value: "98%",   label: "Satisfaction Rate" },
];

const AboutBanner = () => (
  <section className="py-20 px-5 lg:px-8" style={{ background: "#fafaf8" }}>
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Image collage */}
      <div className="grid grid-cols-2 gap-3">
        <ImagePlaceholder height="280px" label="Story Image 1" rounded="4px" className="col-span-2" />
        <ImagePlaceholder height="160px" label="Story Image 2" rounded="4px" />
        <ImagePlaceholder height="160px" label="Story Image 3" rounded="4px" />
      </div>

      {/* Copy */}
      <div>
        <SectionLabel>Our Story</SectionLabel>
        <h2
          className="text-4xl md:text-5xl font-light mb-6"
          style={{ fontFamily: CORMORANT, color: "#111827", letterSpacing: "0.03em", lineHeight: 1.15 }}
        >
          Rooted in Nature,{" "}
          <span className="italic" style={{ color: GREEN }}>Guided by Science</span>
        </h2>
        <p className="text-base leading-relaxed mb-4" style={{ color: "#6b7280", fontFamily: LATO }}>
          Founded in 2012, Urvi was born from a simple belief: that nature provides everything we need to thrive.
          We work directly with certified organic farmers across India to source the purest ingredients.
        </p>
        <p className="text-base leading-relaxed mb-8" style={{ color: "#6b7280", fontFamily: LATO }}>
          Every product is formulated with intention, tested rigorously, and packaged sustainably — because what touches
          your body and the earth both deserve our deepest care.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-light" style={{ fontFamily: CORMORANT, color: GREEN }}>{s.value}</p>
              <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: "#9ca3af", fontFamily: LATO }}>{s.label}</p>
            </div>
          ))}
        </div>

        <Button
          className="gap-2 h-11 px-7 text-xs uppercase tracking-wider rounded-sm"
          style={{
            background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
            border: "none",
            fontFamily: LATO,
            boxShadow: `0 4px 16px ${GREEN}30`,
            color: "#fff",
          }}
        >
          Read Our Full Story <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  </section>
);

export default AboutBanner;