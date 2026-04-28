import { GREEN, LATO } from "@/lib/helper";
import { ImagePlaceholder, SectionLabel, SectionTitle } from "../helper";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramFeed = () => {
  return( <section className="py-12 md:py-20 px-5 lg:px-8" style={{ background: "#fafaf8" }}>
    <div className="max-w-7xl mx-auto">
      <SectionLabel>Instagram</SectionLabel>
      <SectionTitle>Follow Our <em>Journey</em></SectionTitle>
      <p className="text-center text-sm mt-2 mb-10" style={{ color: "#9ca3af", fontFamily: LATO }}>
        @urvitribe.life &nbsp;·&nbsp; Tag us to be featured
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden aspect-square cursor-pointer"
            style={{ borderRadius: "2px" }}
          >
            <ImagePlaceholder height="100%" label={`Post ${i + 1}`} rounded="2px" />
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: `${GREEN}bb`, borderRadius: "2px" }}
            >
              <Instagram size={22} style={{ color: "#fff" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          className="gap-2 h-10 text-xs uppercase tracking-wider rounded-sm"
          style={{ borderColor: `${GREEN}40`, color: GREEN, fontFamily: LATO }}
        >
          <Instagram size={14} /> Follow on Instagram
        </Button>
      </div>
    </div>
  </section>);
};

export default InstagramFeed;