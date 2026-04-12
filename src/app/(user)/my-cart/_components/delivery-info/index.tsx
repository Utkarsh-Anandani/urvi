import { BROWN, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { Clock, Info, Package, RotateCcw, Truck } from "lucide-react";

const DeliveryInfo = () => {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#fff", border: `1px solid #f0e6dc` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} style={{ color: ORANGE }} />
        <span
          className="font-bold text-sm"
          style={{ color: BROWN, fontFamily: LATO }}
        >
          Delivery & Dispatch Info
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {[
          {
            icon: <Clock size={14} />,
            title: "Dispatch Time",
            desc: "Orders placed before 2 PM are dispatched the same day.",
          },
          {
            icon: <Truck size={14} />,
            title: "Estimated Delivery",
            desc: "3–5 working days for most pin codes across India.",
          },
          {
            icon: <RotateCcw size={14} />,
            title: "Returns",
            desc: "Hassle-free 7-day returns for damaged or incorrect items.",
          },
          {
            icon: <Info size={14} />,
            title: "Packaging",
            desc: "Eco-friendly, leak-proof packaging to ensure safe transit.",
          },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: LIGHTER_ORANGE, color: BROWN }}
            >
              {item.icon}
            </div>
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {item.title}
              </p>
              <p
                className="text-xs mt-0.5 leading-5"
                style={{ color: "#9a7a6e", fontFamily: LATO }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryInfo;