"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  MapPin,
  Check,
  ShoppingBag,
  LogOut,
  Shield,
  Package,
  TrendingUp,
  IndianRupee,
  Award,
} from "lucide-react";

import {
  LATO,
  CORMORANT,
  ORANGE,
  LIGHT_ORANGE,
  LIGHTER_ORANGE,
  BROWN,
} from "@/lib/helper";
import HeroBanner from "./_components/hero-banner";
import PersonalInfoTab from "./_components/profile-info";
import AddressesTab from "./_components/addresses-tab";
import OrdersTab from "./_components/orders-tab";
import WishlistTab from "./_components/wishlist-tab";
import SecurityTab from "./_components/security-tab";
import { fmt } from "../my-cart/_components/cart-page-client";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUserProfile } from "@/actions/user";
import { GetUserProfileReturnType } from "@/types/user.types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignOutAction } from "@/actions/auth";

function StatCard({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div
      className="flex flex-col items-center text-center py-5 px-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: "#fff", border: `1px solid #f0e6dc` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: LIGHTER_ORANGE, color: BROWN }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: CORMORANT,
          fontSize: 28,
          fontWeight: 700,
          color: BROWN,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        className="font-bold text-xs uppercase tracking-wider mt-1.5"
        style={{ color: BROWN, fontFamily: LATO }}
      >
        {label}
      </span>
      {sub && (
        <span
          className="text-xs mt-0.5"
          style={{ color: "#9a7a6e", fontFamily: LATO }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileData, isPending: isFetchingProfile } = useQueryData(
    ["user-profile"],
    GetUserProfile,
  );
  const { status, data: profile } = profileData as GetUserProfileReturnType;

  useEffect(() => {
    if (!profile) {
      router.push("/signin");
    }
  }, [profile, router]);
  if (!profile) return null; // Todo: Add skeleton loading

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div
      style={{ fontFamily: LATO, background: "#fdfaf7", color: "#2a1a10" }}
      className="min-h-screen"
    >
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes popIn  { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .tab-fade { animation: fadeUp 0.25s ease both; }
      `}</style>

      {/* Hero Banner */}
      <HeroBanner
        email={profile.email}
        fullName={fullName}
        image={profile?.image || ""}
        coins={1240}
        createdAt={new Date(profile.createdAt).toLocaleString("en-IN", {
          month: "long",
          year: "numeric",
        })}
      />

      <main className="max-w-6xl mx-auto px-8 pt-12 pb-16">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={<ShoppingBag size={18} />}
            value={String(profile.ordersCount)}
            label="Total Orders"
            sub="All time"
          />
          <StatCard
            icon={<IndianRupee size={18} />}
            value={fmt(profile.totalSpendings).replace("₹", "")}
            label="Total Spent"
            sub="₹ all time"
          />
          <StatCard
            icon={<Award size={18} />}
            value="1240"
            label="Purity Coins"
            sub="Redeemable"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            value={`${profile.addressesCount}`}
            label="Saved Addresses"
            sub="Delivery locations"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList
            className="mb-8 flex w-full rounded-2xl p-1.5 h-auto gap-1"
            style={{ background: LIGHTER_ORANGE }}
          >
            {[
              {
                value: "personal",
                label: "Personal Info",
                icon: <User size={14} />,
              },
              {
                value: "addresses",
                label: "Addresses",
                icon: <MapPin size={14} />,
              },
              {
                value: "orders",
                label: "Order History",
                icon: <Package size={14} />,
              },
              //   { value: "wishlist",      label: "Wishlist",         icon: <Heart size={14} /> },
              {
                value: "security",
                label: "Security",
                icon: <Shield size={14} />,
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition-all data-[state=active]:shadow-md"
                style={{ fontFamily: LATO }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
            {/* Main content */}
            <div>
              <TabsContent value="personal" className="tab-fade mt-0">
                <PersonalInfoTab profile={profile} />
              </TabsContent>

              <TabsContent value="addresses" className="tab-fade mt-0">
                <AddressesTab />
              </TabsContent>

              <TabsContent value="orders" className="tab-fade mt-0">
                <OrdersTab />
              </TabsContent>

              {/* <TabsContent value="wishlist" className="tab-fade mt-0">
                <WishlistTab />
              </TabsContent> */}

              <TabsContent value="security" className="tab-fade mt-0">
                <SecurityTab />
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="sticky top-35 flex flex-col gap-4">
              {/* Profile completeness */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#fff",
                  border: "1px solid #f0e6dc",
                  boxShadow: `0 4px 16px rgba(85,19,5,0.06)`,
                }}
              >
                <p
                  className="font-bold text-sm mb-4"
                  style={{ color: BROWN, fontFamily: LATO }}
                >
                  Profile Completeness
                </p>
                {(() => {
                  const fields = [
                    {
                      label: "Name",
                      done: !!profile.firstName && !!profile.lastName,
                    },
                    { label: "Email", done: !!profile.email },
                    { label: "Phone", done: !!profile.phone },
                    { label: "Date of Birth", done: !!profile.dob },
                    { label: "Profile Photo", done: !!profile.image },
                    { label: "Address", done: profile.addressesCount > 0 },
                  ];
                  const pct = Math.round(
                    (fields.filter((f) => f.done).length / fields.length) * 100,
                  );
                  return (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span
                          style={{
                            fontFamily: CORMORANT,
                            fontSize: 28,
                            fontWeight: 700,
                            color: pct === 100 ? "#2d6a4f" : ORANGE,
                          }}
                        >
                          {pct}%
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#9a7a6e", fontFamily: LATO }}
                        >
                          {fields.filter((f) => f.done).length}/{fields.length}{" "}
                          complete
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden mb-4"
                        style={{ background: LIGHTER_ORANGE }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background:
                              pct === 100
                                ? `linear-gradient(90deg,#4caf50,#2d6a4f)`
                                : `linear-gradient(90deg,${ORANGE},${LIGHT_ORANGE})`,
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        {fields.map((f) => (
                          <div
                            key={f.label}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                background: f.done ? "#e8f5e9" : LIGHTER_ORANGE,
                              }}
                            >
                              {f.done ? (
                                <Check size={9} color="#2d6a4f" />
                              ) : (
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: LIGHT_ORANGE }}
                                />
                              )}
                            </div>
                            <span
                              className="text-xs"
                              style={{
                                color: f.done ? "#2d6a4f" : "#9a7a6e",
                                fontFamily: LATO,
                                fontWeight: f.done ? 600 : 400,
                              }}
                            >
                              {f.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Sign out */}
              <button
                onClick={async () => await SignOutAction()}
                className="flex items-center justify-center gap-2 h-11 rounded-2xl font-bold text-sm transition-all hover:shadow-md"
                style={{
                  border: "1.5px solid #f0e6dc",
                  color: "#c0392b",
                  fontFamily: LATO,
                  background: "#fff",
                }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
