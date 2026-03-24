"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NotFoundCard } from "@/components/NotFoundCard"
import { useCart } from "@/hooks/useCart"
import { useFavorites } from "@/hooks/useFavorites"
import { useProduct } from "../hooks/useProduct"
import { ProductImageGallery } from "./ProductImageGallery"
import { ProductInfo } from "./ProductInfo"
import { ProductDetailSkeleton } from "./ProductDetailSkeleton"
import { SimilarProducts } from "./SimilarProducts"

type Props = {
  productId: string
}

export function ProductDetailPage({ productId }: Props) {
  const t = useTranslations("product")
  const tg = useTranslations("common")

  const { data: product, isLoading, isError } = useProduct(productId)
  const { addItem } = useCart()
  const { isFavorited, toggleFavorite } = useFavorites()

  return (
    <div className="wrapper py-8">
      {isLoading ? (
        <ProductDetailSkeleton />
      ) : isError ? (
        <div className="text-center text-destructive py-24">{tg("error")}</div>
      ) : !product ? (
        <NotFoundCard title={t("notFound")} />
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/home" />}>
                  {t("breadcrumbHome")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/products" />}>
                  {t("breadcrumbProducts")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProductImageGallery
              mainImage={product.image_url}
              gallery={product.gallery_urls}
              productName={product.name}
            />
            <ProductInfo
              product={product}
              onAddToCart={(id, color, size, qty) => addItem(id, color, size, qty)}
              onToggleFavorite={toggleFavorite}
              isFavorited={isFavorited(productId)}
            />
          </div>

          <SimilarProducts productId={productId} categoryName={product.category_name} />
        </>
      )}
    </div>
  )
}
