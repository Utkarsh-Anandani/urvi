"use client";
import { BROWN, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { Check, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { useState } from "react";

const SectionCard = ({
  title,
  icon,
  children,
  collapsible = false,
  completed = false,
  summary,
  onEdit,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  completed?: boolean;
  summary?: string;
  onEdit?: () => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: `1.5px solid ${completed ? "#a8d5b5" : "#f0e6dc"}`,
        background: "#fff",
        boxShadow: completed ? "none" : `0 4px 16px rgba(85,19,5,0.05)`,
      }}
    >
      <div
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{
          background: completed ? "#f0faf4" : "#fff",
          cursor: collapsible ? "pointer" : "default",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: completed ? "#c8e6c9" : LIGHTER_ORANGE,
              color: completed ? "#2d6a4f" : BROWN,
            }}
          >
            {completed ? <Check size={16} /> : icon}
          </div>
          <div>
            <h3
              className="font-bold text-sm"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              {title}
            </h3>
            {completed && summary && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "#6b8f71", fontFamily: LATO }}
              >
                {summary}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-orange-50"
              style={{ color: ORANGE, fontFamily: LATO }}
            >
              <Edit2 size={12} />
              Edit
            </button>
          )}
          {collapsible && (
            <button
              onClick={() => collapsible && setOpen(!open)}
              className="bg-transparent flex items-center justify-center w-fit h-fit"
            >
              {open ? (
                <ChevronUp size={16} style={{ color: "#9a7a6e" }} />
              ) : (
                <ChevronDown size={16} style={{ color: "#9a7a6e" }} />
              )}
            </button>
          )}
        </div>
      </div>
      {(!collapsible || open) && !completed && (
        <div className="px-6 pb-6">{children}</div>
      )}
    </div>
  );
};

export default SectionCard;
