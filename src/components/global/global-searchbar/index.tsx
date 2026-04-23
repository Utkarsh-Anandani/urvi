"use client";

import { useEffect, useState } from "react";
import { BROWN, ORANGE } from "@/lib/helper";
import { SearchProducts } from "@/actions/product";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const words = [
  "A2 cow ghee",
  "organic khapli atta",
  "hard pressed oils",
  "organic spices",
];

const trendingSearches = [
  "A2 Cow Ghee",
  "Cold Pressed Oil",
  "Khapli Atta",
  "Organic Turmeric",
];

const SearchBar = () => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentWord.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);

          if (charIndex === currentWord.length) {
            setIsDeleting(true);
          }
        } else {
          setText(currentWord.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);

          if (charIndex === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await SearchProducts(inputValue);
        if (res.status === 500 || !res.data) {
          toast("Error searching products");
          return;
        }
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  return (
    <div className="relative w-fit search-container">
      {!inputValue && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm">
          <span style={{ color: BROWN }}>Search for </span>
          <span style={{ color: ORANGE }}>{text}</span>
          <span className="animate-pulse">|</span>
        </div>
      )}

      <input
        value={inputValue}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          const nextFocus = e.relatedTarget as HTMLElement;

          if (nextFocus?.closest(".search-container")) return;

          setIsOpen(false);
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        className="px-3 py-1 rounded-md w-64 transition-all focus:w-72 outline-none border shadow-sm"
        style={{
          backgroundColor: "#fff",
          borderColor: BROWN,
          color: BROWN,
        }}
      />

      <svg
        className="size-5 absolute top-1/2 right-2 -translate-y-1/2"
        style={{ color: BROWN }}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {isOpen && (
        <div
          tabIndex={0}
          className="absolute top-full mt-2 w-80 sm:w-160 bg-white border rounded-xl shadow-xl z-50 p-4 search-container"
        >
          <div className="mb-4">
            <h3 className="font-semibold mb-2" style={{ color: BROWN }}>
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => setInputValue(item)}
                  className="px-3 py-1 rounded-full text-xs border flex gap-2 items-center"
                  style={{ borderColor: BROWN, color: BROWN }}
                >
                  <TrendingUp size={12} />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <h3 className="font-semibold mb-2" style={{ color: BROWN }}>
            Products
          </h3>
          {loading || !inputValue.trim() ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {!loading && results.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No products found
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                  {results.map((product) => (
                    <div
                      key={product.slug}
                      onClick={() =>
                        router.push(`/catalog/products/${product.slug}`)
                      }
                      className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain rounded-md"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {product.name}
                        </p>

                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-sm font-semibold">
                            ₹{product.discountPrice || product.price}
                          </span>

                          {product.discountPrice && (
                            <span className="text-xs line-through text-gray-400">
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        {/* Variants */}
                        {product.variants?.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {product.variants
                              .map((v: any) => v.name)
                              .join(", ")}
                          </p>
                        )}

                        {/* Stock */}
                        <p
                          className={`text-xs mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-700"}`}
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
