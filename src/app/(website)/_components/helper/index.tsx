import { BROWN, CORMORANT, GREEN, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { Leaf } from "lucide-react";

export const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div
      className="h-px flex-1"
      style={{
        background: `linear-gradient(to right, transparent, ${BROWN})`,
      }}
    />
    <svg width="12" height="12" viewBox="0 0 16 16" fill={BROWN}>
      <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
    </svg>
    <div
      className="h-px flex-1"
      style={{ background: `linear-gradient(to left, transparent, ${BROWN})` }}
    />
  </div>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="h-px w-10" style={{ background: ORANGE }} />
    <span
      className="text-xs uppercase tracking-[0.25em] font-semibold"
      style={{ color: ORANGE, fontFamily: LATO }}
    >
      {children}
    </span>
    <div className="h-px w-10" style={{ background: ORANGE }} />
  </div>
);

export const SectionTitle = ({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) => (
  <h2
    className="text-4xl md:text-5xl font-light text-center"
    style={{
      fontFamily: CORMORANT,
      color: light ? "#fff" : BROWN,
      letterSpacing: "0.04em",
      lineHeight: 1.15,
    }}
  >
    {children}
  </h2>
);
interface ImagePlaceholderProps {
  width?: string;
  height?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  rounded?: string;
  src?: string;
}

export const ImagePlaceholder = ({
  width = "100%",
  height = "100%",
  label = "Image",
  className = "",
  style = {},
  rounded = "4px",
  src = undefined,
}: ImagePlaceholderProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 ${className}`}
    style={{
      width,
      height,
      background: "#fff",
      border: `1.5px dashed ${BROWN}60`,
      borderRadius: rounded,
      ...style,
    }}
  >
    {src ? (
      <img
        src={src}
        alt={label}
        className="w-full h-full object-contain"
        style={{ borderRadius: rounded }}
      />
    ) : (
      <>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `${ORANGE}10`, border: `1px solid ${ORANGE}20` }}
        >
          <Leaf size={18} style={{ color: GREEN, opacity: 0.5 }} />
        </div>
        <span
          className="text-xs font-medium"
          style={{ color: BROWN, fontFamily: LATO }}
        >
          {label}
        </span>
      </>
    )}
  </div>
);