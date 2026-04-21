import { Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { GoldDivider, SectionLabel, SectionTitle } from "../helper";
import { BROWN, LATO, LIGHT_BROWN, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";

const Benefits = () => {
  const items = [
    { icon: Leaf,       title: "100% Organic",       desc: "Every ingredient is certified organic, sourced directly from trusted farms." },
    { icon: ShieldCheck,title: "Lab Tested",          desc: "All products undergo third-party lab testing for purity and potency." },
    { icon: Sparkles,   title: "Expert Formulated",   desc: "Created by Ayurvedic experts and modern nutritionists working in harmony." },
    { icon: Heart,      title: "Made with Love",      desc: "Small batches crafted with care — quality over quantity, always." },
  ];

  return (
    <section className="py-20 px-5 lg:px-8" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        <SectionLabel>Why Urvi</SectionLabel>
        <SectionTitle>The <em>Difference</em> You&apos;ll Feel</SectionTitle>
        <GoldDivider className="max-w-xs mx-auto mt-4 mb-14" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center group">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${LIGHTER_ORANGE}12, ${LIGHT_BROWN}10)`,
                  border: `1.5px solid ${BROWN}30`,
                }}
              >
                <Icon size={24} style={{ color: BROWN }} />
              </div>
              <h4 className="font-bold text-base mb-2" style={{ color: ORANGE, fontFamily: LATO }}>{title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: BROWN, fontFamily: LATO }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;