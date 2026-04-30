import { BROWN, LATO, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import { Check, ChevronRight, Lock } from "lucide-react";
import { CheckoutStep } from "../checkout-client";

const Navbar = ({step}: {step: CheckoutStep}) => {
  const steps = ["Address", "Payment", "Review"];
  const currStep = step.charAt(0).toUpperCase() + step.slice(1);
  const index = steps.findIndex((s) => s === currStep) === -1 ? 0 : steps.findIndex((s) => s === currStep);
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-3 md:px-8 h-12 md:h-16"
      style={{ background: BROWN, boxShadow: `0 2px 16px rgba(85,19,5,0.35)` }}
    >
      <a
        href="#"
      >
        <img className="w-auto h-8 md:h-10" src="/logo_main.png" alt="logo" />
      </a>

      {/* Checkout Steps Progress */}
      <div className="hidden md:flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i <= index ? ORANGE : "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontFamily: LATO,
                }}
              >
                {i < index ? <Check size={11} /> : i + 1}
              </div>
              <span
                className="text-xs font-semibold"
                style={{
                  color: i <= index ? "#fff" : "rgba(255,255,255,0.45)",
                  fontFamily: LATO,
                }}
              >
                {s}
              </span>
            </div>
            {(i < steps.length - 1) && (
              <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.25)" }} />
            )}
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2 text-xs md:text-sm font-semibold"
        style={{ color: "rgba(255,255,255,0.7)", fontFamily: LATO }}
      >
        <Lock size={14} style={{ color: LIGHT_ORANGE }} />
        Secure Checkout
      </div>
    </nav>
  );
}

export default Navbar;