"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CORMORANT, GOLD, GOLD_LIGHT, GREEN, GREEN_LIGHT, LATO } from "@/lib/helper";
import { Leaf, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = ["Shop", "Collections", "About", "Sustainability", "Blog"];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div
        className="w-full py-2 text-center text-xs uppercase tracking-[0.2em]"
        style={{ background: GREEN, color: "#fff", fontFamily: LATO }}
      >
        🌿 Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code{" "}
        <span style={{ color: GOLD_LIGHT, fontWeight: 700 }}>WELCOME20</span> for 20% off
      </div>

      {/* Main nav */}
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
          borderBottom: `1px solid ${scrolled ? "#e5e7eb" : "#f5f5f5"}`,
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                boxShadow: `0 3px 12px ${GREEN}35`,
              }}
            >
              <Leaf size={17} color={GOLD} strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-bold uppercase tracking-[0.14em] leading-none" style={{ color: "#111", fontFamily: CORMORANT }}>
                Urvi <span style={{ color: GOLD }}>Tribe</span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.22em] leading-none mt-0.5" style={{ color: "#9ca3af", fontFamily: LATO }}>
                Pure Wellness
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium transition-colors duration-200 hover:opacity-70 no-underline relative group"
                style={{ color: "#374151", fontFamily: LATO }}
              >
                {link}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: GOLD }}
                />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              className="hidden md:flex gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                border: "none",
                fontFamily: LATO,
                boxShadow: `0 2px 12px ${GREEN}30`,
              }}
            >
              <ShoppingBag size={14} /> Shop Now
            </Button>
            <button
              className="md:hidden p-2 rounded-sm text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-5 py-4 space-y-3"
            style={{ borderColor: "#f0f0f0", background: "#fff" }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="block text-sm font-medium py-1.5 no-underline hover:opacity-60 transition-opacity"
                style={{ color: "#374151", fontFamily: LATO }}
              >
                {link}
              </a>
            ))}
            <Separator className="bg-gray-100" />
            <Button
              className="w-full gap-2 h-10 text-xs uppercase tracking-wider rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                border: "none",
                fontFamily: LATO,
              }}
            >
              <ShoppingBag size={14} /> Shop Now
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;