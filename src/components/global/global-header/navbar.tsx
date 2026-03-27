"use client";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BROWN, LATO, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import { Avatar } from "@/components/ui/avatar";
import SearchBar from "@/components/global/global-searchbar";

const NAV_LINKS = ["Shop by Category", "Join Urvi", "Shop by concern", "About", "Catalog"];

type Props = {
  isLoggedIn: boolean;
  name: string | null;
};

const Navbar = ({ isLoggedIn, name }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <header className="w-full flex flex-col">
      <div
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          backgroundImage: `url('/nav-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          borderTop: scrolled ? `4px solid ${BROWN}` : "none",
          borderBottom: `1px solid ${scrolled ? "#e5e7eb" : "#f5f5f5"}`,
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 grid grid-cols-3 justify-center">
          {/* SearchBar */}
          <div className="flex items-center justify-start">
            <SearchBar />
          </div>
          {/* Logo */}
          <div className="flex items-center justify-center">
            <a href="/" className="flex items-center gap-2.5 no-underline">
              <img className="w-auto h-16" src="/logo_main.png" alt="logo" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={() => router.push("/products")}
              className="hidden md:flex gap-2 h-9 text-xs font-bold uppercase tracking-wider rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                border: "none",
                fontFamily: LATO,
                boxShadow: `0 2px 12px ${ORANGE}30`,
                color: `${BROWN}`,
              }}
            >
              <ShoppingBag
                strokeWidth={2.5}
                className={`text-${BROWN}`}
                size={14}
              />{" "}
              Shop Now
            </Button>
            {!isLoggedIn ? (
              <Button
                onClick={() => router.push("/signin")}
                className="hidden md:flex gap-2 h-9 text-xs font-bold uppercase tracking-wider rounded-sm"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                  border: "none",
                  fontFamily: LATO,
                  boxShadow: `0 2px 12px ${ORANGE}30`,
                  color: `${BROWN}`,
                }}
              >
                LogIn
              </Button>
            ) : (
              <Avatar
                style={{
                  backgroundColor: BROWN,
                  color: "#fff",
                }}
                className="flex items-center justify-center"
                size="lg"
              >
                {name ? name.charAt(0).toUpperCase() : <User size={18} />}
              </Avatar>
            )}
            <button
              className="md:hidden p-2 rounded-sm text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-5 py-3 border border-b-amber-900">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium transition-colors duration-200 hover:opacity-70 no-underline relative group"
              style={{ color: "#374151", fontFamily: LATO }}
            >
              <em>{link.toUpperCase()}</em>
            </a>
          ))}
      </div>
    </header>
  );
};

export default Navbar;
