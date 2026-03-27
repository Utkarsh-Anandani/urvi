import { BROWN, CORMORANT, ORANGE } from "@/lib/helper";
import { categoryFilters } from "../category-panel";

const PageHeader = ({ slug }: { slug: string }) => {
  const activeCategory = categoryFilters.find(c => c.slug === slug);
  return (
    <div className="max-w-7xl w-full mx-auto">
    <h1
      style={{
        fontFamily: CORMORANT,
        fontSize: "clamp(32px, 4vw, 48px)",
        fontWeight: 600,
        color: BROWN,
        lineHeight: 1.15,
      }}
    >
      {activeCategory?.page_header.split(' ')[0]}{" "}
      <em style={{ color: ORANGE, fontStyle: "italic" }}>
        {activeCategory?.page_header.split(' ')[1]}
      </em>
    </h1>
    </div>
  );
};

export default PageHeader;