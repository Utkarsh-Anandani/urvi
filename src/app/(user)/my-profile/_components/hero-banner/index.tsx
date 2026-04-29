import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHT_ORANGE,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import { Award } from "lucide-react";
import Image from "next/image";

type Props = {
  fullName: string;
  image: string;
  email: string;
  createdAt: string;
  coins: number;
};

const HeroBanner = ({ image, fullName, email, createdAt, coins }: Props) => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 60%, #8b4513 100%)`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-10"
        style={{ background: ORANGE }}
      />
      <div
        className="absolute -bottom-16 right-32 w-40 h-40 rounded-full opacity-8"
        style={{ background: LIGHT_ORANGE }}
      />
      <div
        className="absolute top-4 left-1/3 w-20 h-20 rounded-full opacity-5"
        style={{ background: LIGHTER_ORANGE }}
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8 flex items-center gap-4 lg:gap-8 relative z-10">
        {/* Avatar in banner */}
        <div
          className="w-16 lg:w-28 h-16 lg:h-28 rounded-full overflow-hidden shrink-0"
          style={{
            border: `4px solid rgba(255,255,255,0.9)`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.25)`,
            background: LIGHTER_ORANGE,
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={fullName}
              width={112}
              height={112}
              className="object-cover w-16 lg:w-28 h-16 lg:h-28"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${LIGHTER_ORANGE}, #ffe8d0)`,
              }}
            >
              <span
                style={{
                  fontFamily: CORMORANT,
                  fontSize: 36,
                  fontWeight: 700,
                  color: BROWN,
                }}
              >
                {fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="pb-0 lg:pb-2 flex flex-col justify-center">
          <h1
            className="text-lg md:text-2xl"
            style={{
              fontFamily: CORMORANT,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            {fullName}
          </h1>
          <p
            className="text-xs md:text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: LATO }}
          >
            {email} · Member since {createdAt}
          </p>
        </div>

        <div className="ml-auto pb-2 hidden md:flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Award size={15} style={{ color: LIGHT_ORANGE }} />
            <span
              className="font-bold text-sm"
              style={{ color: "#fff", fontFamily: LATO }}
            >
              {coins} Purity Coins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
