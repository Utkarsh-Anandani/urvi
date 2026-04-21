import {
  BROWN,
  LATO,
  LIGHT_ORANGE,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { GoldDivider } from "../helper";

const Footer = () => (
  <footer
    className="max-w-screen overflow-hidden"
    style={{ background: `
      radial-gradient(circle at top left, ${LIGHT_ORANGE}30 0%, transparent 80%),
      radial-gradient(circle at top left, ${LIGHT_ORANGE}30 0%, transparent 90%),
      radial-gradient(circle at top left, ${LIGHTER_ORANGE} 0%, transparent 100%)
    `, }}
  >
    {/* Top footer */}
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* Brand */}
      <div>
        <img className="w-30 h-auto mb-4" src="/footer-logo.png" alt="logo" />
        <p
          className="text-sm leading-relaxed mb-5 opacity-60 text-neutral-900 font-semibold"
          style={{ fontFamily: LATO }}
        >
          Premium organic wellness for the mindful lifestyle. Nature&apos;s best,
          crafted with purpose.
        </p>
        {/* Social */}
        <div className="flex gap-3">
          {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: ORANGE, color: "#fff" }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <p
          className="text-sm uppercase tracking-[0.2em] font-bold mb-3"
          style={{ color: ORANGE, fontFamily: LATO }}
        >
          Shop
        </p>
        <ul className="space-y-2.5">
          {[
            { name: "All Products", href: "/catalog/all-products" },
            { name: "Newly Launched", href: "/catalog/newly-launched" },
            { name: "Ghee", href: "/catalog/ghee" },
            { name: "Under 499", href: "/catalog/under-499" },
            { name: "Under 999", href: "/catalog/under-999" },
          ].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm opacity-60 hover:opacity-100 transition-opacity no-underline font-semibold"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <p
          className="text-sm uppercase tracking-[0.2em] font-bold mb-3"
          style={{ color: ORANGE, fontFamily: LATO }}
        >
          Company
        </p>
        <ul className="space-y-2.5">
          {[
            { name: "Home", href: "#home" },
            { name: "About Us", href: "#about" },
            { name: "Catalog", href: "/catalog/all-products" },
            { name: "Newsletter", href: "#newsletter" },
          ].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm opacity-60 hover:opacity-100 transition-opacity no-underline font-semibold"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <p
          className="text-sm uppercase tracking-[0.2em] font-bold mb-3"
          style={{ color: ORANGE, fontFamily: LATO }}
        >
          Contact
        </p>
        <ul className="space-y-4">
          {[
            { Icon: Phone, text: "+91 98765 43210" },
            { Icon: Mail, text: "contact@urvitribe.life" },
            { Icon: MapPin, text: "384, 9th Main Rd, 7th Sector, HSR Layout, Bengaluru, Karnataka 560102" },
          ].map(({ Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon
                size={16}
                strokeWidth={3}
                style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }}
              />
              <span
                className="text-sm opacity-60 leading-snug font-semibold"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <GoldDivider className="max-w-7xl mx-auto px-5 lg:px-8" />

    {/* Bottom bar */}
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p
        className="text-xs opacity-40 text-center sm:text-left"
        style={{ color: BROWN, fontFamily: LATO }}
      >
        © 2026 UrviTribe. All rights reserved.
      </p>
      <div className="flex flex-wrap gap-5 justify-center">
        {[
          "Privacy Policy",
          "Terms of Service",
          "Cookie Policy",
          "Refund Policy",
        ].map((l) => (
          <a
            key={l}
            href="#"
            className="text-xs opacity-70 hover:opacity-90 transition-opacity no-underline"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
