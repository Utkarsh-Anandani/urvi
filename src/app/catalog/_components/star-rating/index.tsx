import { LIGHT_ORANGE, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={
            i <= Math.floor(rating)
              ? ORANGE
              : i - 0.5 <= rating
                ? LIGHT_ORANGE
                : "none"
          }
          stroke={i <= rating ? ORANGE : LIGHTER_ORANGE}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}