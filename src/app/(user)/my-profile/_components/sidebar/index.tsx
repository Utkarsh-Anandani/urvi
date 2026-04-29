"use client";
import { SignOutAction } from "@/actions/auth";
import { BROWN, CORMORANT, LATO, LIGHT_ORANGE, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { Check, LogOut } from "lucide-react";

type Props = {
    profile: any
};

const Sidebar = ({ profile }: Props) => {
  return (
    <div className="relative md:sticky md:top-35 flex flex-col gap-4">
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
                  {fields.filter((f) => f.done).length}/{fields.length} complete
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
                  <div key={f.label} className="flex items-center gap-2">
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
  );
};

export default Sidebar;
