"use client";
import { LogOut, Menu, Package, ShoppingCart, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BROWN, LATO, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import { Avatar } from "@/components/ui/avatar";
import SearchBar from "@/components/global/global-searchbar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { NAV_LINKS } from "./navbar";

const userOptions = [
  {
    name: "My Profile",
    href: "/my-profile",
    icon: <User size={20} strokeWidth={3} style={{ color: ORANGE }} />,
  },
  {
    name: "My Orders",
    href: "/orders",
    icon: <Package size={20} strokeWidth={3} style={{ color: ORANGE }} />,
  },
  {
    name: "Logout",
    href: "/signin",
    icon: <LogOut size={20} strokeWidth={3} style={{ color: ORANGE }} />,
  },
];

type Props = {
  isLoggedIn: boolean;
  name: string | null;
};

const Navbar = ({ isLoggedIn, name }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data } = useCart(isLoggedIn);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white"
      style={{
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6 h-16 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-row items-center gap-8">
          {/* 🔹 Logo */}
          <Link href="/" className="shrink-0">
            <img src="/footer-logo.png" className="h-10 w-auto" />
          </Link>

          {/* 🔹 Search */}
          <div className="hidden sm:block flex-1 max-w-xs md:max-w-sm">
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-row items-center gap-20!">
          {/* 🔹 Nav Links (Scrollable) */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex gap-3 items-center">
              {NAV_LINKS.map((link) => {
                if (link.type === "link") {
                  return (
                    <NavigationMenuItem key={link.name}>
                      <Link
                        href={link.href || "#"}
                        className="text-base text-amber-900 hover:bg-amber-900 hover:text-white rounded-full px-3 py-1 font-semibold"
                        style={{ fontFamily: LATO }}
                      >
                        {link.name}
                      </Link>
                    </NavigationMenuItem>
                  );
                } else {
                  return (
                    <NavigationMenuItem key={link.name}>
                      {link.modal}
                    </NavigationMenuItem>
                  );
                }
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* 🔹 Actions */}
          <div className="flex items-center gap-5 md:gap-8 shrink-0">
            {/* Cart */}
            <button
              onClick={() => router.push("/my-cart")}
              className="relative"
            >
              <ShoppingCart size={20} className="text-[#3d2b1f]" />
              {data?.data?.cartItems && data.data.cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white w-4 h-4 flex items-center justify-center rounded-full">
                  {data ? data.data.cartItems.length : ""}
                </span>
              )}
            </button>

            {/* User */}
            {isLoggedIn ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Avatar
                        className="flex items-center justify-center"
                        style={{ backgroundColor: BROWN, color: "#fff" }}
                      >
                        {name ? (
                          name.charAt(0).toUpperCase()
                        ) : (
                          <User size={16} />
                        )}
                      </Avatar>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="flex flex-col">
                      <div className="grid grid-cols-1 w-40">
                        {userOptions.map((opt, i) => (
                          <NavigationMenuLink
                            key={i}
                            className="flex flex-row items-center gap-3 whitespace-nowrap"
                            href={opt.href}
                          >
                            {opt.icon}
                            {opt.name}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
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
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
