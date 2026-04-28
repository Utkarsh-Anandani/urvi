import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHTER_BROWN,
  ORANGE,
} from "@/lib/helper";
import { ImagePlaceholder, SectionLabel } from "../helper";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "200+", label: "Natural Ingredients" },
  { value: "12", label: "Years of Expertise" },
  { value: "98%", label: "Satisfaction Rate" },
];

const AboutBanner = () => (
  <section
    id="about"
    className="py-12 md:py-20 px-5 lg:px-8"
    style={{ background: "#fafaf8" }}
  >
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Image collage */}
      <div className="hidden md:grid grid-cols-2 gap-3">
        <ImagePlaceholder
          src="/story-1.JPG"
          height="230px"
          label="Story Image 1"
          rounded="4px"
        />
        <ImagePlaceholder
          src="/story-2.JPG"
          height="230px"
          label="Story Image 2"
          rounded="4px"
        />
        <ImagePlaceholder
          src="/story-4.JPG"
          height="230px"
          label="Story Image 3"
          rounded="4px"
        />
        <ImagePlaceholder
          src="/story-3.JPG"
          height="230px"
          label="Story Image 4"
          rounded="4px"
        />
      </div>

      {/* Copy */}
      <div>
        <SectionLabel>Our Story</SectionLabel>
        <h2
          className="text-4xl md:text-5xl font-light mb-6"
          style={{
            fontFamily: CORMORANT,
            color: BROWN,
            letterSpacing: "0.03em",
            lineHeight: 1.15,
          }}
        >
          Rooted in Nature,{" "}
          <span className="italic" style={{ color: ORANGE }}>
            Guided by Science
          </span>
        </h2>
        <div className="grid md:hidden grid-cols-2 gap-3 mb-4">
          <img
            src="/story-1.JPG"
            className="rounded-lg"
          />
          <img
            src="/story-2.JPG"
            className="rounded-lg"
          />
          <img
            src="/story-4.JPG"
            className="rounded-lg"
          />
          <img
            src="/story-3.JPG"
            className="rounded-lg"
          />
        </div>
        <p
          className="text-base leading-relaxed mb-4"
          style={{ color: "#6b7280", fontFamily: LATO }}
        >
          Founded in 2012, Urvi was born from a simple belief: that nature
          provides everything we need to thrive. We work directly with certified
          organic farmers across India to source the purest ingredients.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <p
                className="text-3xl font-light"
                style={{ fontFamily: CORMORANT, color: BROWN }}
              >
                {s.value}
              </p>
              <p
                className="text-xs uppercase tracking-wider mt-0.5"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <Button
          className="gap-2 h-11 px-7 text-xs uppercase tracking-wider rounded-sm"
          style={{
            background: `linear-gradient(135deg, ${BROWN}, ${LIGHT_BROWN})`,
            border: "none",
            fontFamily: LATO,
            boxShadow: `0 4px 16px ${LIGHTER_BROWN}30`,
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
