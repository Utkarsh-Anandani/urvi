import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthBackground = ({ children }: Props) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 30% 100%, #dcfce7 0%, #ffffff 50%, #fefce8 100%)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* Gold corner accents */}
      {[
        "top-5 left-5",
        "top-5 right-5 rotate-90",
        "bottom-5 left-5 -rotate-90",
        "bottom-5 right-5 rotate-180",
      ].map((pos, i) => (
        <svg
          key={i}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          className={`fixed ${pos} opacity-25`}
        >
          <path
            d="M2 2 L2 16 M2 2 L16 2"
            stroke="#B8960C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="2" cy="2" r="1.5" fill="#B8960C" />
        </svg>
      ))}
      {children}
    </div>
  );
};

export default AuthBackground;
