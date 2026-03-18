"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

type Props = {
  mainImage: string | null
  gallery: string[]
  productName: string
}

export function ProductImageGallery({ mainImage, gallery, productName }: Props) {
  const allImages = [mainImage, ...gallery].filter(Boolean) as string[]
  const [activeImage, setActiveImage] = useState<string | null>(mainImage)

  const displayImage = activeImage ?? allImages[0] ?? null

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <ShoppingBag className="size-20 text-muted-foreground/20" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                activeImage === img
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
