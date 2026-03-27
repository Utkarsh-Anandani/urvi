import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import SectionHeading from "../section-heading";
import { StarRating } from "../../products/[slug]/page";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Quote, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REVIEWS = [
  {
    name: "Aravind M.",
    date: "March 2025",
    rating: 5,
    title: "Great product — even better customer service",
    body: "Love the quality of Anveshan products, always did. The oil has a beautifully authentic nutty aroma and taste you simply can't find in refined oil. Customer support was excellent when I had a packaging issue — replaced without any hassle.",
    helpful: 12,
  },
  {
    name: "Madhavan R.",
    date: "February 2025",
    rating: 5,
    title: "Excellent. Ordered again and again.",
    body: "Excellent — that is the reason I have subsequently ordered again. The colour is a beautiful golden amber and the fragrance is exactly what you'd expect from genuine wood-pressed oil. Makes food taste distinctly better.",
    helpful: 8,
  },
  {
    name: "Azad K.",
    date: "January 2025",
    rating: 5,
    title: "Very Good Product Quality!",
    body: "Must try for healthy benefits, good aroma, very light, and good taste too! I switched from supermarket refined oil and honestly notice the difference in both the taste of my food and how light I feel after meals.",
    helpful: 21,
  },
  {
    name: "Sandeep P.",
    date: "December 2024",
    rating: 4,
    title: "Good quality, slightly expensive",
    body: "Quality is genuinely good — you can taste and smell the difference from refined oil. A bit pricier than local stores, but I remind myself I'm paying for real, honest, unadulterated oil and the lab-tested purity gives me confidence.",
    helpful: 5,
  },
];

const ReviewsSection = () => {
  return (
    <section
      className="py-16 px-6"
      style={{
        background: "#fdfaf7",
        borderTop: "1px solid #f0e6dc",
        borderBottom: "1px solid #f0e6dc",
      }}
      id="reviews"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading>
          What Our{" "}
          <em style={{ color: ORANGE, fontStyle: "italic" }}>Customers Say</em>
        </SectionHeading>

        <div className="grid grid-cols-[260px_1fr] gap-10 items-start">
          {/* Summary */}
          <div
            className="sticky top-20 rounded-2xl p-6 text-center"
            style={{ background: "#fff", border: `1px solid #f0e6dc` }}
          >
            <span
              style={{
                fontFamily: CORMORANT,
                fontSize: 72,
                fontWeight: 700,
                color: BROWN,
                lineHeight: 1,
                display: "block",
              }}
            >
              4.3
            </span>
            <div className="flex justify-center my-2">
              <StarRating rating={4.3} size={20} />
            </div>
            <p className="text-xs mb-5" style={{ color: "#9a7a6e", fontFamily: LATO }}>
              Based on 888 reviews
            </p>

            {[
              { label: "5★", pct: 73 },
              { label: "4★", pct: 20 },
              { label: "3★", pct: 2 },
              { label: "2★", pct: 1 },
              { label: "1★", pct: 4 },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs w-7 text-right shrink-0"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  {r.label}
                </span>
                <Progress
                  value={r.pct}
                  className="flex-1 h-2"
                  style={
                    {
                      background: LIGHTER_ORANGE,
                      "--progress-fill": ORANGE,
                    } as React.CSSProperties
                  }
                />
                <span
                  className="text-xs w-7 shrink-0"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  {r.pct}%
                </span>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full mt-4 text-sm font-bold"
              style={{
                borderColor: BROWN,
                color: BROWN,
                fontFamily: LATO,
                borderWidth: 2,
              }}
            >
              ✏️ Write a Review
            </Button>
          </div>

          {/* Review Cards */}
          <div className="flex flex-col gap-4">
            {REVIEWS.map((r, i) => (
              <Card
                key={i}
                className="border"
                style={{ borderColor: "#f0e6dc", background: "#fff" }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: BROWN, fontFamily: LATO }}
                      >
                        {r.name}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#9a7a6e", fontFamily: LATO }}
                      >
                        {r.date}
                      </p>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>

                  <div className="flex gap-2 mb-2">
                    <Quote size={14} style={{ color: LIGHTER_ORANGE, flexShrink: 0, marginTop: 2 }} />
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#2a1a10", fontFamily: LATO }}
                    >
                      {r.title}
                    </p>
                  </div>

                  <p
                    className="text-sm leading-6"
                    style={{ color: "#6b5a52", fontFamily: LATO }}
                  >
                    {r.body}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      variant="secondary"
                      className="text-xs gap-1"
                      style={{
                        background: "#e8f5e9",
                        color: "#2d6a4f",
                        fontFamily: LATO,
                      }}
                    >
                      <Check size={11} />
                      Verified Purchase
                    </Badge>
                    <button
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-orange-500"
                      style={{ color: "#9a7a6e", fontFamily: LATO }}
                    >
                      <ThumbsUp size={13} />
                      Helpful ({r.helpful})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="self-center px-10 mt-2 font-bold text-sm"
              style={{
                borderColor: ORANGE,
                color: ORANGE,
                fontFamily: LATO,
                borderWidth: 2,
              }}
            >
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;