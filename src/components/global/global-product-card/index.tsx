"use client";
import { fmt } from "@/lib/helper";
import { ImagePlaceholder } from "@/app/(website)/_components/helper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddToCart } from "@/hooks/useCart";
import { LocalCartItem } from "@/lib/cart";
import { BROWN, LATO, LIGHT_BROWN, ORANGE } from "@/lib/helper";
import { Product } from "@/types/product.types";
import { Check, Heart, Loader, ShoppingBag, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Old Product Card
// export const ProductCard = ({ product, isLoggedIn }: { product: Product, isLoggedIn: boolean }) => {
//   const [wished, setWished] = useState(false);
//   const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
//   const { mutate: AddToCart, isPending: isAddToCartPending } = useAddToCart(isLoggedIn);

//   const handleAddToCart = (variantId: string) => {
//     const cartItem: LocalCartItem = {
//       productId: product.id,
//       variantId,
//       quantity: 1
//     };

//     AddToCart(cartItem);
//   }

//   const discountPercentage =
//     Math.round(
//       (1 -
//         (product?.discountPrice ? product?.discountPrice : product.price) /
//           product.price) *
//         100,
//     ) || 0;
//   const router = useRouter();

//   return (
//     <Card
//       className="min-w-75 border-0 p-0 group hover:shadow-xl transition-all duration-300 overflow-hidden"
//       style={{
//         outline: "1px solid #f0f0f0",
//         borderRadius: "4px",
//         boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//       }}
//     >
//       <CardContent className="p-0">
//         {/* Image */}
//         <div
//           onClick={() => router.push(`/catalog/products/${product.slug}`)}
//           className="relative overflow-hidden cursor-pointer"
//         >
//           <ImagePlaceholder
//             src={product?.images ? product.images[0].url : undefined}
//             height="220px"
//             label={product.name}
//             rounded="4px 4px 0 0"
//             className="group-hover:scale-105 transition-transform duration-500"
//           />
//           {discountPercentage > 25 && (
//             <Badge
//               className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm"
//               style={{
//                 background: "#dc2626",
//                 color: "#fff",
//                 border: "none",
//                 fontFamily: LATO,
//               }}
//             >
//               Flat {discountPercentage}% off
//             </Badge>
//           )}
//           {product.stock <= 0 && (
//             <div
//               className="absolute inset-0 flex items-center justify-center"
//               style={{
//                 background: "rgba(255,255,255,0.7)",
//                 borderRadius: "4px 4px 0 0",
//               }}
//             >
//               <span
//                 className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm"
//                 style={{
//                   background: "#fee2e2",
//                   color: "#dc2626",
//                   fontFamily: LATO,
//                 }}
//               >
//                 Out of Stock
//               </span>
//             </div>
//           )}
//           <button
//             onClick={() => setWished((w) => !w)}
//             className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
//             style={{
//               background: wished ? "#ffe4e6" : "#fff",
//               color: wished ? "#e11d48" : "#d1d5db",
//             }}
//           >
//             <Heart size={14} fill={wished ? "#e11d48" : "none"} />
//           </button>
//         </div>

//         {/* Info */}
//         <div className="p-4">
//           <p
//             className="text-[10px] uppercase tracking-wider mb-1"
//             style={{ color: BROWN, fontFamily: LATO }}
//           >
//             {product?.category?.name || ""}
//           </p>
//           <h3
//             onClick={() => router.push(`/catalog/products/${product.slug}`)}
//             className="font-semibold text-sm leading-snug mb-2 truncate cursor-pointer"
//             style={{ color: "#111827", fontFamily: LATO }}
//           >
//             {product.name}
//           </h3>
//           <div className="flex flex-row items-center justify-start gap-2 pb-2">
//             {product.tags.slice(0, 3).map((tag) => (
//               <span
//                 key={tag}
//                 className="text-[10px] px-2 py-0.5 rounded-full font-medium"
//                 style={{
//                   background: `${ORANGE}12`,
//                   color: ORANGE,
//                   fontFamily: LATO,
//                 }}
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Stars */}
//           <div className="flex items-center gap-1 mb-3">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={10}
//                 fill={i < Math.floor(product.avgRating) ? ORANGE : "none"}
//                 color={ORANGE}
//               />
//             ))}
//             <span
//               className="text-[10px] text-gray-400 ml-0.5"
//               style={{ fontFamily: LATO }}
//             >
//               ({product.reviewCount})
//             </span>
//           </div>

//           {/* Price */}
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="flex items-baseline gap-1.5">
//                 <span
//                   className="text-base font-bold"
//                   style={{ color: BROWN, fontFamily: LATO }}
//                 >
//                   ₹{(product?.discountPrice || product.price).toLocaleString()}
//                 </span>
//                 {product.discountPrice && (
//                   <span
//                     className="text-xs line-through text-gray-400"
//                     style={{ fontFamily: LATO }}
//                   >
//                     ₹{product.price.toLocaleString()}
//                   </span>
//                 )}
//               </div>
//               {product.discountPrice && (
//                 <span
//                   className="text-[10px] font-semibold"
//                   style={{ color: ORANGE, fontFamily: LATO }}
//                 >
//                   Save{" "}
//                   {Math.round(
//                     (1 - product.discountPrice / product.price) * 100,
//                   )}
//                   %
//                 </span>
//               )}
//             </div>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <button
//                   disabled={product.stock <= 0}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                   }}
//                   className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-40"
//                   style={{ background: `${BROWN}15`, color: BROWN }}
//                 >
//                   <ShoppingBag size={14} />
//                 </button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Product Variants</DialogTitle>
//                   <DialogDescription>
//                     Select a variant to continue
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="w-full flex flex-col gap-2 p-1">
//                   {product.variants.map((v) => (
//                     <div
//                       key={v.id}
//                       onClick={() => setSelectedVariant(v)}
//                       className={`w-full p-2 rounded-sm border ${selectedVariant.id === v.id ? "border-orange-400 bg-orange-50" : "border-neutral-400 bg-neutral-50"} flex flex-col gap-1 cursor-pointer`}
//                     >
//                       <div className="flex flex-row items-center justify-between">
//                         <div className="flex flex-row items-center gap-3">
//                           <ImagePlaceholder
//                             width="60px"
//                             height="60px"
//                             src={
//                               product.images && product.images.length > 0
//                                 ? product?.images[0]?.url
//                                 : undefined
//                             }
//                           />
//                           <div className="flex flex-col gap-0">
//                             <h3
//                               className={`text-base font-semibold ${selectedVariant.id === v.id ? "text-orange-400" : "text-neutral-400"}`}
//                             >
//                               {product.name} &bull; {v.name}
//                             </h3>
//                             <p
//                               className={`text-sm font-medium ${selectedVariant.id === v.id ? "text-amber-600" : "text-neutral-300"}`}
//                             >
//                               {fmt(v?.discountPrice || v.price)}
//                             </p>
//                           </div>
//                         </div>
//                         {/* {v.discountPrice && <div
//                           className={`flex items-center justify-center ${selectedVariant.id === v.id ? "text-white" : "text-neutral-300"}`}
//                         >
//                           Save{" "}
//                           {Math.round((1 - v.discountPrice / v.price) * 100)}%
//                         </div>} */}
//                         {selectedVariant.id === v.id && (
//                           <div
//                             style={{ borderColor: BROWN }}
//                             className="border-3 w-8 h-8 rounded-full bg-transparent flex items-center justify-center"
//                           >
//                             <Check size={18} style={{ color: BROWN }} strokeWidth={4} />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   <Button
//                     disabled={isAddToCartPending}
//                     //@ts-expect-error
//                     onClick={() => handleAddToCart(selectedVariant.id)}
//                     style={{ backgroundColor: LIGHT_BROWN }}
//                     className="py-5! mt-2 font-semibold"
//                   >
//                     {isAddToCartPending ? <Loader size={16} className="animate-spin" /> : "Add to Cart"}
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


// New Product Card
export const ProductCard = ({
  product,
  isLoggedIn,
}: {
  product: Product;
  isLoggedIn: boolean;
}) => {
  const [wished, setWished] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { mutate: AddToCart, isPending: isAddToCartPending } =
    useAddToCart(isLoggedIn);
  const router = useRouter();

  const handleAddToCart = (variantId: string) => {
    const cartItem: LocalCartItem = {
      productId: product.id,
      variantId,
      quantity: 1,
    };
    AddToCart(cartItem);
  };

  const currentPrice = product?.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;
  const goToProduct = () => {
    if (isOutOfStock) return;
    router.push(`/catalog/products/${product.slug}`);
  };

  return (
    <Card
      className="min-w-65 md:min-w-75 group relative h-full w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ fontFamily: LATO }}
    >
      <CardContent className="flex h-full flex-col p-0">
        {/* ---------- Image ---------- */}
        <div
          onClick={goToProduct}
          className={`relative w-full overflow-hidden bg-neutral-100 aspect-square sm:aspect-4/5 ${
            isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {product?.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* gradient veil for legibility of badges/buttons */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* top-left badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product?.category?.name && (
              <Badge
                className="rounded-full border-0 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm"
                style={{ background: "#fff", color: BROWN }}
              >
                {product.category.name}
              </Badge>
            )}
            {discountPercentage > 10 && (
              <Badge
                className="rounded-full border-0 px-2.5 py-1 text-[10px] font-bold shadow-sm"
                style={{ background: ORANGE, color: "#fff" }}
              >
                Flat {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* wishlist */}
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.stopPropagation();
              setWished((w) => !w);
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition-all duration-200 hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
            style={{
              background: wished ? "#ffe4e6" : "rgba(255,255,255,0.95)",
              color: wished ? "#e11d48" : "#9ca3af",
            }}
          >
            <Heart size={16} fill={wished ? "#e11d48" : "none"} />
          </button>

          {/* out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800 shadow">
                Out of Stock
              </span>
            </div>
          )}

          {/* desktop quick add (floats on hover) */}
          {/* {!isOutOfStock && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Quick add to cart"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 right-3 hidden h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 sm:flex sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                  style={{ background: BROWN, color: "#fff" }}
                >
                  <ShoppingBag size={16} />
                </button>
              </DialogTrigger>
              <VariantDialogContent
                product={product}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                onAdd={() => handleAddToCart(selectedVariant.id!)}
                isPending={isAddToCartPending}
              />
            </Dialog>
          )} */}
        </div>

        {/* ---------- Info ---------- */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* name */}
          <h3
            onClick={goToProduct}
            className="mb-1.5 line-clamp-2 cursor-pointer text-sm font-semibold leading-snug text-neutral-900 transition-colors hover:text-neutral-700 sm:text-base"
            style={{ fontFamily: LATO }}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* tags */}
          {product.tags?.length > 0 && (
            <div className="mb-2 hidden flex-wrap gap-1.5 sm:flex">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* rating */}
          <div className="mb-3 flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(product.avgRating ?? 0)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-200 text-neutral-200"
                  }
                />
              ))}
            </div>
            <span className="text-[11px] text-neutral-500">
              ({product.reviewCount ?? 0})
            </span>
          </div>

          {/* price + CTA */}
          <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-neutral-900 sm:text-xl">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-neutral-400 line-through sm:text-sm">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span
                  className="mt-0.5 text-[11px] font-semibold"
                  style={{ color: ORANGE }}
                >
                  Save{" "}
                  {Math.round((1 - product.discountPrice! / product.price) * 100)}
                  %
                </span>
              )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-wide shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  style={{ background: BROWN, color: "#fff" }}
                >
                  <ShoppingBag size={14} />
                  Add
                </button>
              </DialogTrigger>
              <VariantDialogContent
                product={product}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                onAdd={() => handleAddToCart(selectedVariant.id!)}
                isPending={isAddToCartPending}
              />
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------- Variant picker dialog (shared by both triggers) ---------- */
function VariantDialogContent({
  product,
  selectedVariant,
  setSelectedVariant,
  onAdd,
  isPending,
}: {
  product: Product;
  selectedVariant: Product["variants"][number];
  setSelectedVariant: (v: Product["variants"][number]) => void;
  onAdd: () => void;
  isPending: boolean;
}) {
  return (
    <DialogContent className="max-w-md" style={{ fontFamily: LATO }}>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold" style={{ color: BROWN }}>
          Choose a variant
        </DialogTitle>
        <DialogDescription className="text-sm text-neutral-500">
          Pick the option you'd like to add to your cart.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-2 flex max-h-[55vh] flex-col gap-2 overflow-y-auto pr-1">
        {product.variants.map((v) => {
          const selected = selectedVariant.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariant(v)}
              className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                selected
                  ? "border-orange-400 bg-orange-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {product?.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={v.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-neutral-900">
                  {product.name}
                </div>
                <div className="truncate text-xs text-neutral-500">{v.name}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-neutral-900">
                  {fmt(v?.discountPrice || v.price)}
                </span>
                {selected && (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: ORANGE, color: "#fff" }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={onAdd}
        disabled={isPending}
        style={{ backgroundColor: LIGHT_BROWN, color: "#fff" }}
        className="mt-3 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wide shadow-sm transition-all hover:shadow-md disabled:opacity-60"
      >
        {isPending ? (
          <Loader size={16} className="animate-spin" />
        ) : (
          <span className="inline-flex items-center gap-2">
            <ShoppingBag size={15} />
            Add to Cart
          </span>
        )}
      </Button>
    </DialogContent>
  );
}