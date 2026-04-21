"use client";
import { BROWN, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import {
  ClipboardList,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  ShoppingBag,
  Tag,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type SidebarContentProps = {
  onNav?: () => void;
};

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
};

const NAV = [
  { key: "", label: "Dashboard", icon: LayoutDashboard },
  { key: "/products", label: "Products", icon: ShoppingBag },
  { key: "/categories", label: "Categories", icon: Menu },
  { key: "/orders", label: "Orders", icon: ClipboardList },
  { key: "/coupons", label: "Coupons", icon: Tag },
  { key: "/customers", label: "Customers", icon: Users },
];

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {
  const pathname = usePathname();
  const active = pathname.split('/admin')[1];

  const router = useRouter();

  const SidebarContent = ({ onNav }: SidebarContentProps) => {
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                boxShadow: `0 3px 12px ${ORANGE}40`,
              }}
            >
              <Leaf size={16} color={"#fff"} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-sm font-bold tracking-wider uppercase"
                style={{
                  color: "#111",
                  fontFamily: "'Lato', sans-serif",
                  letterSpacing: "0.14em",
                }}
              >
                Urvi
              </p>
              <p
                className="text-xs tracking-widest uppercase"
                style={{
                  color: BROWN,
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                }}
              >
                Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${ORANGE}50)`,
              }}
            />
            <svg width="8" height="8" viewBox="0 0 16 16" fill={ORANGE}>
              <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
            </svg>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to left, transparent, ${ORANGE}50)`,
              }}
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => {
                  router.push(`/admin${key}`)
                  onNav?.();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold transition-all duration-200 group"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  background: isActive
                    ? `linear-gradient(135deg, ${ORANGE}18, ${LIGHT_ORANGE}10)`
                    : "transparent",
                  color: isActive ? BROWN : "#6b7280",
                  borderLeft: isActive
                    ? `3px solid ${ORANGE}`
                    : "3px solid transparent",
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color: isActive ? BROWN : "#9ca3af",
                    flexShrink: 0,
                  }}
                />
                {label}
                {/* {key === "orders" && (
                    <span
                      className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: `${GOLD}20`,
                        color: GOLD,
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      {ORDERS.filter((o) => o.status === "Processing").length}
                    </span>
                  )} */}
              </button>
            );
          })}
        </nav>

        {/* Bottom profile */}
        <div className="px-4 py-5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
              }}
            >
              A
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold text-gray-700 truncate"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Admin User
              </p>
              <p
                className="text-xs text-gray-400 truncate"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                admin@urvi.life
              </p>
            </div>
            <button className="text-gray-300 hover:text-red-400 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-100 shrink-0"
        style={{ boxShadow: "2px 0 20px rgba(0,0,0,0.04)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen ? (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-white h-full flex flex-col shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
            <SidebarContent onNav={() => setSidebarOpen(false)} />
          </aside>
        </div>
      ) : (<></>)}
    </>
  );
};

export default AdminSidebar;
