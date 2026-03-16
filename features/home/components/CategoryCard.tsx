"use client"

import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { ShoppingBag } from "lucide-react"
import type { Category } from "../types"

type Props = {
  category: Category
}

export function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative block rounded-3xl overflow-hidden border border-border/50 bg-background shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    >
      <div className="relative h-56 bg-muted">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <ShoppingBag className="size-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 inset-s-0 p-6">
        <span className="font-bold text-white text-xl drop-shadow-lg">
          {category.name}
        </span>
        <div className="h-1 w-8 bg-white/80 rounded-full mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100" />
      </div>
    </Link>
  )
}
