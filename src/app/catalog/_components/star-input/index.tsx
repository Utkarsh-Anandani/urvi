"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
  disabled?: boolean;
  className?: string;
};

export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = 24,
  disabled = false,
  className,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Star Rating"
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            role="radio"
            aria-checked={value === starValue}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            className="focus:outline-none"
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                displayValue >= starValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}