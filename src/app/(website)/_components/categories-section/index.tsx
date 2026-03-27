"use client";
import { CORMORANT, GOLD_LIGHT, GREEN, LATO } from "@/lib/helper";
import {
  GoldDivider,
  ImagePlaceholder,
  SectionLabel,
  SectionTitle,
} from "../../page";
import { useQueryData } from "@/hooks/useQueryData";
import { GetUserCategories } from "@/actions/category";
import { GetCategoriesResponse } from "@/types/category.types";
import { useRouter } from "next/navigation";

const Categories = () => {
  const router = useRouter();

  const { data, isFetched } = useQueryData(
    ["user-categories"],
    () => GetUserCategories(),
  );
  const { data: categories } = data as GetCategoriesResponse;

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  return (
    <section className="py-20 px-5 lg:px-8" style={{ background: "#fafaf8" }}>
      <div className="max-w-7xl mx-auto">
        <SectionLabel>Shop by Category</SectionLabel>
        <SectionTitle>
          Find Your <em>Wellness</em>
        </SectionTitle>
        <GoldDivider className="max-w-xs mx-auto mt-4 mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isFetched && categories.length > 0 ? (
            categories.map((cat) => (
              <div
                onClick={() => handleCategoryClick(cat.slug)}
                key={cat.name}
                className="group relative overflow-hidden cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                {/* Category image */}
                <ImagePlaceholder
                  src={cat?.imageURL || undefined}
                  height="260px"
                  label={`${cat.name} Category`}
                  rounded="4px"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end pb-6 transition-all duration-300"
                  style={{
                    background: `linear-gradient(to top, ${GREEN}cc 0%, transparent 60%)`,
                    borderRadius: "4px",
                  }}
                >
                  <p
                    className="text-white font-bold text-lg tracking-wide"
                    style={{ fontFamily: CORMORANT }}
                  >
                    {cat.name}
                  </p>
                  <p
                    className="text-xs opacity-80 mt-0.5"
                    style={{ color: GOLD_LIGHT, fontFamily: LATO }}
                  >
                    {cat.productCount} Products
                  </p>
                </div>
              </div>
            ))
          ) : isFetched && categories.length === 0 ? (
            <div className="w-full flex items-center justify-center">
              <h2
                className={`text-[${GREEN}] text-xl font-semibold text-[${CORMORANT}]`}
              >
                No categories found
              </h2>
            </div>
          ) : (
            [1, 2, 3, 4].map((c, index) => (
              <div
                key={index}
                className="group relative overflow-hidden cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                {/* Category image */}
                <ImagePlaceholder
                  height="260px"
                  rounded="4px"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end pb-6 transition-all duration-300"
                  style={{
                    background: `linear-gradient(to top, ${GREEN}cc 0%, transparent 60%)`,
                    borderRadius: "4px",
                  }}
                >
                  <p
                    className="text-white font-bold text-lg tracking-wide"
                    style={{ fontFamily: CORMORANT }}
                  ></p>
                  <p
                    className="text-xs opacity-80 mt-0.5"
                    style={{ color: GOLD_LIGHT, fontFamily: LATO }}
                  ></p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
