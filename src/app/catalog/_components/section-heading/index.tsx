import { BROWN, CORMORANT } from "@/lib/helper";

const SectionHeading = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={`text-center mb-2 lg:mb-6 ${className}`}
      style={{
        fontFamily: CORMORANT,
        fontSize: "clamp(28px, 4vw, 42px)",
        fontWeight: 600,
        color: BROWN,
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

export default SectionHeading;