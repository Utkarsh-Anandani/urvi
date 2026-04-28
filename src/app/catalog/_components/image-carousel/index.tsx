"use client";
import { Badge } from "@/components/ui/badge";
import { BROWN, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Image = {
  url: string,
  position: number
}

type Props = {
  images: Image[]
  category: string | null
}

const ImageCarousel = ({ images, category }: Props) => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((idx + images.length) % images.length);
      setFading(false);
    }, 180);
  };

  return (
    <div className="relative lg:sticky lg:top-20 flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border"
        style={{
          aspectRatio: "1",
          background: LIGHTER_ORANGE,
          borderColor: "#e8d8c8",
          boxShadow: `0 20px 60px -12px rgba(85,19,5,0.18)`,
        }}
      >
        <div
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 0.18s ease",
          }}
          className="w-full h-full"
        >
          <Image
            src={images[current].url}
            alt="prod-image"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgba(85,19,5,0.15) 0%, transparent 40%)`,
          }}
        />

        {/* Badge */}
        {category && <div className="absolute top-4 left-4">
          <Badge
            style={{
              background: BROWN,
              color: "#fff",
              fontFamily: LATO,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              padding: "5px 12px",
              borderRadius: "20px",
            }}
          >
            {category?.toUpperCase()}
          </Badge>
        </div>}

        {/* Slide counter */}
        <div
          className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: "rgba(255,255,255,0.85)",
            color: BROWN,
            fontFamily: LATO,
            backdropFilter: "blur(6px)",
          }}
        >
          {current + 1} / {images.length}
        </div>

        {/* Arrows */}
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e8d8c8",
            color: BROWN,
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e8d8c8",
            color: BROWN,
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative rounded-xl overflow-hidden transition-all hover:scale-105"
            style={{
              width: 62,
              height: 62,
              border: `2.5px solid ${i === current ? ORANGE : "#e8d8c8"}`,
              flexShrink: 0,
            }}
          >
            <Image src={img.url} alt={`prod-img-${current}`} fill className="object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;