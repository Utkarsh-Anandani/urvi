"use client";
import {
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BROWN, LATO, LIGHT_ORANGE, LIGHTER_BROWN, ORANGE } from "@/lib/helper";
import { Avatar } from "@/components/ui/avatar";
import SearchBar from "@/components/global/global-searchbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { categoryFilters } from "@/app/catalog/_components/category-panel";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

const userOptions = [
  {
    name: "My Profile",
    href: "/profile",
    icon: <User size={20} />,
  },
  {
    name: "My Orders",
    href: "/orders",
    icon: <Package size={20} />,
  },
  {
    name: "Logout",
    href: "/signin",
    icon: <LogOut size={20} />,
  },
];

const CategoryOptionsModal = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            style={{ color: "#fff", fontFamily: LATO }}
            className="bg-transparent! hover:bg-transparent! focus:bg-transparent! focus-visible:ring-0! focus-visible:outline-0! text-base font-normal transition-colors duration-200 hover:opacity-70 no-underline text-center"
          >
            Shop By Category
          </NavigationMenuTrigger>

          <NavigationMenuContent className="flex flex-col gap-3 p-4">
            <h1 style={{ color: ORANGE }} className="text-lg font-semibold">
              All Categories
            </h1>
            <div className="grid grid-cols-2 w-112.5 gap-3">
              {categoryFilters.map((cat, i) => (
                <NavigationMenuLink
                  key={i}
                  className="flex flex-row items-center gap-3 whitespace-nowrap"
                  href={`/catalog/${cat.slug}`}
                >
                  <img className="h-10 w-10" src={cat.inactive_src} alt="cat" />
                  {cat.page_header}
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const UserOptionsModal = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            style={{ color: "#fff", fontFamily: LATO }}
            className="bg-transparent! hover:bg-transparent! focus:bg-transparent! focus-visible:ring-0! focus-visible:outline-0! text-base font-normal transition-colors duration-200 hover:opacity-70 no-underline text-center!"
          >
            For Users
          </NavigationMenuTrigger>

          <NavigationMenuContent className="flex flex-col gap-3 p-4">
            <h1 style={{ color: ORANGE }} className="text-lg font-semibold">
              Profile Options
            </h1>
            <div className="grid grid-cols-1 w-40 gap-3">
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
  );
};

const ConcernOptionsModal = () => {
  return <div></div>;
};

const NAV_LINKS = [
  {
    name: "Shop by Category",
    modal: <CategoryOptionsModal />,
    href: null,
    type: "nested_link",
  },
  {
    name: "Catalog",
    modal: null,
    href: "/catalog/all-products",
    type: "link",
  },
  {
    name: "Join The Tribe",
    modal: null,
    href: "/join-tribe",
    type: "link",
  },
  {
    name: "For Users",
    modal: <UserOptionsModal key={1} />,
    href: null,
    type: "nested_link",
  },
  {
    name: "Shop by concern",
    modal: <ConcernOptionsModal key={2} />,
    href: null,
    type: "link",
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
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <header style={{ boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none" }} className="w-full flex flex-col sticky top-0 z-50">
      <div
        className="w-full transition-all duration-300"
        style={{
          backgroundImage: `url('/nav-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          borderTop: scrolled ? `4px solid ${BROWN}` : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 grid grid-cols-3 justify-center">
          {/* SearchBar */}
          <div className="flex items-center justify-start">
            <SearchBar />
          </div>
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <img className="w-auto h-16" src="/logo_main.png" alt="logo" />
            </Link>
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
            <Button
              style={{ backgroundColor: BROWN }}
              className="w-10.5 h-10.5 rounded-full text-white relative"
              onClick={() => router.push("/my-cart")}
            >
              {data?.data?.cartItems && data.data.cartItems.length > 0 && (
                <div
                  style={{ backgroundColor: ORANGE, color: BROWN }}
                  className="absolute -top-1 -right-1 text-white w-4.5 h-4.5 rounded-full text-xs font-semibold flex items-center justify-center"
                >
                  {data ? data.data.cartItems.length : ""}
                </div>
              )}
              <ShoppingCart size={20} />
            </Button>
            <button
              className="md:hidden p-2 rounded-sm text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: LIGHTER_BROWN,
        }}
        className={`w-full grid grid-cols-[repeat(auto-fit,minmax(0px,150px))] items-center justify-center gap-x-5 py-3`}
      >
        {NAV_LINKS.map((link) => {
          if (link.type === "link") {
            return (
              <Link
                key={link.name}
                href={link?.href || "#"}
                className="text-base transition-colors duration-200 hover:opacity-70 no-underline relative group text-center"
                style={{ color: "#fff", fontFamily: LATO }}
              >
                {link.name}
              </Link>
            );
          } else {
            return <div className="flex items-center justify-center" key={link.name}>{link.modal}</div>;
          }
        })}
      </div>
    </header>
  );
};

export default Navbar;
