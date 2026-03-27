"use client";
import { LATO } from "@/lib/helper";
import { useRouter } from "next/navigation";

export type categoryFilterNameType = "All" | "New" | "Ghee" | "Oils" | "Deals" | "Combos" | "Superfoods" | "₹499" | "₹999";
export type categoryFilterSlugType = "all-products" | "newly-launched" | "ghee" | "oils" | "best-deals" | "value-combos" | "superfoods" | "under-499" | "under-999";

type categoryFilterType = {
    name: categoryFilterNameType;
    page_header: string;
    active_src: string;
    inactive_src: string;
    slug: string
}

export const categoryFilters: categoryFilterType[] = [
    {
        name: "All",
        page_header: "All Products",
        active_src: "/categories-filters/all_active.svg",
        inactive_src: "/categories-filters/all.svg",
        slug: "all-products"
    },
    {
        name: "New",
        page_header: "Newly Launched",
        active_src: "/categories-filters/newly_active.svg",
        inactive_src: "/categories-filters/newly.svg",
        slug: "newly-launched"
    },
    {
        name: "Ghee",
        page_header: "Desi Ghee",
        active_src: "/categories-filters/ghee_active.svg",
        inactive_src: "/categories-filters/ghee.svg",
        slug: "ghee"
    },
    {
        name: "Oils",
        page_header: "Cooking Oil",
        active_src: "/categories-filters/oils_active.svg",
        inactive_src: "/categories-filters/oils.svg",
        slug: "oils"
    },
    {
        name: "Deals",
        page_header: "Best Deals",
        active_src: "/categories-filters/deals_active.svg",
        inactive_src: "/categories-filters/deals.svg",
        slug: "best-deals"
    },
    {
        name: "Combos",
        page_header: "Value Combos",
        active_src: "/categories-filters/combo_active.svg",
        inactive_src: "/categories-filters/combo.svg",
        slug: "value-combos"
    },
    {
        name: "Superfoods",
        page_header: "Powerful Superfoods",
        active_src: "/categories-filters/superfood_active.svg",
        inactive_src: "/categories-filters/superfood.svg",
        slug: "superfoods"
    },
    {
        name: "₹499",
        page_header: "Under ₹499",
        active_src: "/categories-filters/under-499_active.svg",
        inactive_src: "/categories-filters/under-499.svg",
        slug: "under-499"
    },
    {
        name: "₹999",
        page_header: "Under ₹999",
        active_src: "/categories-filters/under-999_active.svg",
        inactive_src: "/categories-filters/under-999.svg",
        slug: "under-999"
    },
]

const CategoryPanel = ({ activePath }: { activePath: string }) => {
    const router = useRouter();
    const activeCategoryName = categoryFilters.find((f) => {
        return f.slug === activePath
    })?.name || categoryFilters[0].name;
  return (
    <div className="w-full flex items-center justify-center gap-10 bg-neutral-100 py-3 cursor-pointer">
        {categoryFilters.map((f) => (
            <div
              onClick={() => router.push(`/catalog/${f.slug}`)}
              key={f.name}
              style={{
                fontFamily: LATO,
              }}
             className="flex flex-col items-center justify-center text-xs gap-1">
                <img className="w-16 h-16 hover:scale-105 transition-transform ease-in-out duration-100" src={activeCategoryName === f.name ? f.active_src : f.inactive_src} alt="cat" />
                {f.name}
            </div>
        ))}
    </div>
  )
}

export default CategoryPanel