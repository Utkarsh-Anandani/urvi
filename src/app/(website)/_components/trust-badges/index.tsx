import { GOLD, GOLD_LIGHT, GREEN, GREEN_LIGHT, LATO } from "@/lib/helper";
import { Leaf, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const TRUST_BADGES = [
  { icon: Truck,      label: "Free Shipping", sub: "On orders above ₹999" },
  { icon: RefreshCw,  label: "Easy Returns",  sub: "30-day hassle-free returns" },
  { icon: ShieldCheck,label: "Certified",     sub: "100% organic & certified" },
  { icon: Leaf,       label: "Eco Packaging", sub: "Sustainably packed" },
];

const TrustBadges = () => (
  <section className="py-10 border-y" style={{ background: GREEN, borderColor: `${GREEN_LIGHT}` }}>
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", border: `1px solid ${GOLD}50` }}
            >
              <Icon size={18} style={{ color: GOLD_LIGHT }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#fff", fontFamily: LATO }}>{label}</p>
              <p className="text-xs opacity-70 leading-tight mt-0.5" style={{ color: "#fff", fontFamily: LATO }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBadges;