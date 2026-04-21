import { fmt } from "@/lib/helper";
import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE } from "@/lib/helper";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const WISHLIST = [
  {
    id: 1,
    name: "Wood-Pressed Sesame Oil",
    variant: "1L Bottle",
    price: 620,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&q=80",
  },
  {
    id: 2,
    name: "A2 Ghee",
    variant: "1kg Jar",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  },
  {
    id: 3,
    name: "Khapli Wheat Atta",
    variant: "2kg Pack",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=200&q=80",
  },
];

const WishlistTab = () => {
  const [items, setItems] = useState(WISHLIST);

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group rounded-2xl overflow-hidden transition-all hover:shadow-md"
          style={{ border: "1px solid #f0e6dc", background: "#fff" }}
        >
          <div
            className="relative w-full"
            style={{ aspectRatio: "1", background: LIGHTER_ORANGE }}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={() => setItems(items.filter((i) => i.id !== item.id))}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.9)", color: "#c0392b" }}
            >
              <Trash2 size={13} />
            </button>
          </div>
          <div className="p-3">
            <p
              className="font-bold text-xs leading-4"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              {item.name}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              {item.variant}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span
                style={{
                  fontFamily: CORMORANT,
                  fontSize: 18,
                  fontWeight: 700,
                  color: BROWN,
                }}
              >
                {fmt(item.price)}
              </span>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:shadow-sm"
                style={{
                  background: LIGHTER_ORANGE,
                  color: BROWN,
                  fontFamily: LATO,
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="col-span-2 text-center py-16">
          <Heart
            size={40}
            style={{ color: LIGHTER_ORANGE, margin: "0 auto 12px" }}
          />
          <p style={{ fontFamily: CORMORANT, fontSize: 22, color: BROWN }}>
            Wishlist is empty
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "#9a7a6e", fontFamily: LATO }}
          >
            Save items you love here
          </p>
        </div>
      )}
    </div>
  );
}

export default WishlistTab;