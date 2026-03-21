import { CORMORANT, GOLD, GOLD_LIGHT, GREEN, GREEN_MID, LATO } from "@/lib/helper";
import { ImagePlaceholder } from "../../page";
import { Button } from "@/components/ui/button";

const OfferBanner = () => (
  <section className="py-16 px-5 lg:px-8" style={{ background: "#fffdf5" }}>
    <div className="max-w-7xl mx-auto">
      <div
        className="relative overflow-hidden rounded-sm flex flex-col md:flex-row items-center gap-8 px-8 md:px-14 py-12"
        style={{
          background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_MID} 60%, #14532d 100%)`,
          boxShadow: `0 8px 48px ${GREEN}40`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ background: GOLD }} />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: GOLD }} />

        <div className="flex-1 relative z-10">
          <p className="text-xs uppercase tracking-[0.28em] font-semibold mb-2" style={{ color: GOLD_LIGHT, fontFamily: LATO }}>
            Limited Time Offer
          </p>
          <h3 className="text-3xl md:text-4xl font-light mb-3 text-white" style={{ fontFamily: CORMORANT }}>
            Get <span style={{ color: GOLD_LIGHT }}>20% Off</span> Your First Order
          </h3>
          <p className="text-sm opacity-80 text-white max-w-sm" style={{ fontFamily: LATO }}>
            Use code <strong style={{ color: GOLD_LIGHT }}>WELCOME20</strong> at checkout. Valid for new customers only.
            Minimum order ₹999.
          </p>
        </div>

        {/* Offer image */}
        <div className="relative z-10 shrink-0">
          <ImagePlaceholder
            width="220px"
            height="180px"
            label="Offer Product"
            rounded="4px"
          />
        </div>

        <div className="flex flex-col gap-3 relative z-10 shrink-0">
          <Button
            className="h-12 px-8 text-sm uppercase tracking-wider rounded-sm font-bold"
            style={{
              background: GOLD,
              border: "none",
              color: "#fff",
              fontFamily: LATO,
              boxShadow: `0 4px 16px ${GOLD}50`,
            }}
          >
            Claim Offer
          </Button>
          <p className="text-xs text-center opacity-60 text-white" style={{ fontFamily: LATO }}>
            Expires 31 Mar 2026
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default OfferBanner;