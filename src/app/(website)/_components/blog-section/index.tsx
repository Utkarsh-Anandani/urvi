import { Card, CardContent } from "@/components/ui/card";
import { GoldDivider, ImagePlaceholder, SectionLabel, SectionTitle } from "../helper";
import { Badge } from "@/components/ui/badge";
import { GREEN, LATO } from "@/lib/helper";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ARTICLES = [
  { title: "The Ancient Power of Ashwagandha", category: "Wellness", date: "12 Mar 2026", readTime: "5 min read" },
  { title: "How to Build a Morning Ritual", category: "Lifestyle", date: "08 Mar 2026", readTime: "7 min read" },
  { title: "Matcha vs Green Tea: What's the Difference?", category: "Beverages", date: "01 Mar 2026", readTime: "4 min read" },
];

const Blog = () => (
  <section className="py-12 md:py-20 px-5 lg:px-8" style={{ background: "#fff" }}>
    <div className="max-w-7xl mx-auto">
      <SectionLabel>From the Blog</SectionLabel>
      <SectionTitle>Wellness <em>Wisdom</em></SectionTitle>
      <GoldDivider className="max-w-xs mx-auto mt-4 mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <Card
            key={article.title}
            className="border-0 group cursor-pointer hover:shadow-xl transition-all duration-300"
            style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
          >
            <CardContent className="p-0">
              {/* Article image */}
              <div className="overflow-hidden" style={{ borderRadius: "4px 4px 0 0" }}>
                <ImagePlaceholder
                  height="200px"
                  label={`Article: ${article.title}`}
                  rounded="4px 4px 0 0"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    className="text-xs rounded-sm uppercase tracking-wider px-2 py-0.5"
                    style={{ background: `${GREEN}12`, color: GREEN, border: "none", fontFamily: LATO }}
                  >
                    {article.category}
                  </Badge>
                  <span className="text-xs text-gray-400" style={{ fontFamily: LATO }}>{article.readTime}</span>
                </div>
                <h3
                  className="font-semibold text-base leading-snug mb-3 group-hover:opacity-70 transition-opacity"
                  style={{ color: "#111827", fontFamily: LATO }}
                >
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400" style={{ fontFamily: LATO }}>{article.date}</span>
                  <span
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: GREEN, fontFamily: LATO }}
                  >
                    Read More <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button
          variant="outline"
          className="gap-2 h-10 text-xs uppercase tracking-wider rounded-sm"
          style={{ borderColor: `${GREEN}40`, color: GREEN, fontFamily: LATO }}
        >
          View All Articles <ArrowRight size={13} />
        </Button>
      </div>
    </div>
  </section>
);

export default Blog;