import { CORMORANT, GOLD, GOLD_LIGHT, GREEN, GREEN_LIGHT, LATO } from "@/lib/helper";
import { Facebook, Instagram, Leaf, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { GoldDivider } from "../../page";

const Footer = () => (
  <footer className="max-w-screen overflow-hidden" style={{ background: "#0d1f0f" }}>
    {/* Top footer */}
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})` }}
          >
            <Leaf size={17} color={GOLD} strokeWidth={2} />
          </div>
          <p className="text-base font-bold uppercase tracking-[0.14em]" style={{ color: "#fff", fontFamily: CORMORANT }}>
            Urvi <span style={{ color: GOLD }}>Tribe</span>
          </p>
        </div>
        <p className="text-sm leading-relaxed mb-5 opacity-60" style={{ color: "#fff", fontFamily: LATO }}>
          Premium organic wellness for the mindful lifestyle. Nature's best, crafted with purpose.
        </p>
        {/* Social */}
        <div className="flex gap-3">
          {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(255,255,255,0.08)", color: GOLD_LIGHT }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold mb-5" style={{ color: GOLD, fontFamily: LATO }}>Shop</p>
        <ul className="space-y-2.5">
          {["All Products", "Skincare", "Beverages", "Supplements", "Aromatherapy", "Gift Sets"].map((l) => (
            <li key={l}>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity no-underline" style={{ color: "#fff", fontFamily: LATO }}>
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold mb-5" style={{ color: GOLD, fontFamily: LATO }}>Company</p>
        <ul className="space-y-2.5">
          {["About Us", "Sustainability", "Blog", "Careers", "Press", "Affiliates"].map((l) => (
            <li key={l}>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity no-underline" style={{ color: "#fff", fontFamily: LATO }}>
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold mb-5" style={{ color: GOLD, fontFamily: LATO }}>Contact</p>
        <ul className="space-y-4">
          {[
            { Icon: Phone,   text: "+91 98765 43210" },
            { Icon: Mail,    text: "hello@urvitribe.com" },
            { Icon: MapPin,  text: "12 Nature Lane, Pune, Maharashtra 411001" },
          ].map(({ Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon size={14} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
              <span className="text-sm opacity-60 leading-snug" style={{ color: "#fff", fontFamily: LATO }}>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <GoldDivider className="max-w-7xl mx-auto px-5 lg:px-8" />

    {/* Bottom bar */}
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs opacity-40 text-center sm:text-left" style={{ color: "#fff", fontFamily: LATO }}>
        © 2026 UrviTribe. All rights reserved.
      </p>
      <div className="flex flex-wrap gap-5 justify-center">
        {["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"].map((l) => (
          <a key={l} href="#" className="text-xs opacity-40 hover:opacity-70 transition-opacity no-underline" style={{ color: "#fff", fontFamily: LATO }}>
            {l}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;