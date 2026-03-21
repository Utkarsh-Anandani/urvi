"use client";
import { Leaf } from "lucide-react";
import { CORMORANT, GOLD, GREEN, LATO } from "@/lib/helper";
import Header from "./_components/header";
import Hero from "./_components/hero-section";
import TrustBadges from "./_components/trust-badges";
import Categories from "./_components/categories-section";
import FeaturedProducts from "./_components/featured-products";
import AboutBanner from "./_components/about-section";
import Benefits from "./_components/benefits-section";
import Testimonials from "./_components/testimonials-section";
import OfferBanner from "./_components/offer-banner";
import InstagramFeed from "./_components/insta-feed-section";
import Blog from "./_components/blog-section";
import Newsletter from "./_components/newsletter-section";
import Footer from "./_components/footer";

export const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div
      className="h-px flex-1"
      style={{
        background: `linear-gradient(to right, transparent, ${GOLD}60)`,
      }}
    />
    <svg width="12" height="12" viewBox="0 0 16 16" fill={GOLD}>
      <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
    </svg>
    <div
      className="h-px flex-1"
      style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }}
    />
  </div>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="h-px w-10" style={{ background: GOLD }} />
    <span
      className="text-xs uppercase tracking-[0.25em] font-semibold"
      style={{ color: GOLD, fontFamily: LATO }}
    >
      {children}
    </span>
    <div className="h-px w-10" style={{ background: GOLD }} />
  </div>
);

export const SectionTitle = ({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) => (
  <h2
    className="text-4xl md:text-5xl font-light text-center"
    style={{
      fontFamily: CORMORANT,
      color: light ? "#fff" : "#111827",
      letterSpacing: "0.04em",
      lineHeight: 1.15,
    }}
  >
    {children}
  </h2>
);
interface ImagePlaceholderProps {
  width?: string;
  height?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  rounded?: string;
  src?: string;
}

export const ImagePlaceholder = ({
  width = "100%",
  height = "100%",
  label = "Image",
  className = "",
  style = {},
  rounded = "4px",
  src = undefined,
}: ImagePlaceholderProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 ${className}`}
    style={{
      width,
      height,
      background:
        "linear-gradient(135deg, #e8f5e9 0%, #f0fdf4 50%, #fefce8 100%)",
      border: `1.5px dashed ${GOLD}60`,
      borderRadius: rounded,
      ...style,
    }}
  >
    {src ? (
      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover"
        style={{ borderRadius: rounded }}
      />
    ) : (
      <>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}20` }}
        >
          <Leaf size={18} style={{ color: GREEN, opacity: 0.5 }} />
        </div>
        <span
          className="text-xs font-medium"
          style={{ color: "#9ca3af", fontFamily: LATO }}
        >
          {label}
        </span>
      </>
    )}
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ fontFamily: LATO }}>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <Categories />
        <FeaturedProducts />
        <AboutBanner />
        <Benefits />
        <Testimonials />
        <OfferBanner />
        <InstagramFeed />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
