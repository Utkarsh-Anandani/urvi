import { BROWN, LATO, LIGHT_ORANGE, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { CheckoutStep } from "../../[slug]/page";
import { Check } from "lucide-react";

const StepIndicator = ({ current }: { current: CheckoutStep }) => {
  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "address", label: "Address" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background:
                  i < idx ? ORANGE : i === idx ? BROWN : "#f0e6dc",
                color:
                  i <= idx ? "#fff" : "#9a7a6e",
                fontFamily: LATO,
                border: i === idx ? `3px solid ${ORANGE}` : "none",
                boxShadow: i === idx ? `0 0 0 3px ${LIGHTER_ORANGE}` : "none",
              }}
            >
              {i < idx ? <Check size={13} /> : i + 1}
            </div>
            <span
              className="text-xs mt-1.5 font-bold"
              style={{
                color: i <= idx ? BROWN : "#9a7a6e",
                fontFamily: LATO,
              }}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-0.5 flex-1 mb-4 transition-all"
              style={{
                background: i < idx
                  ? `linear-gradient(90deg, ${ORANGE}, ${LIGHT_ORANGE})`
                  : "#f0e6dc",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default StepIndicator;