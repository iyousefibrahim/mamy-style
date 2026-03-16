"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { ImageUploadZone } from "./ImageUploadZone"
import { GalleryUploadZone } from "./GalleryUploadZone"
import { createProductSchema, type CreateProductFormValues } from "../../types"
import { useCategoryOptions } from "@/features/dashboard/hooks/useCategories"
import { useCreateProduct, useUpdateProduct } from "@/features/dashboard/hooks/useProducts"
import { uploadProductImage } from "@/features/dashboard/api/storage"
import type { Product } from "../../types"

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "freeSize"] as const
const MAX_GALLERY = 5

type GalleryItem = { url: string; file?: File }

type Props = {
  defaultValues?: Product
  mode: "create" | "edit"
}

export function ProductForm({ defaultValues, mode }: Props) {
  const t = useTranslations("dashboard.products")
  const tc = useTranslations("dashboard.common")
  const router = useRouter()

  const { data: categories = [] } = useCategoryOptions()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const mainBlobRef = useRef<string | null>(null)
  const galleryBlobsRef = useRef<Set<string>>(new Set())

  // Revoke all blob URLs when the form unmounts
  useEffect(() => {
    const mainBlob = mainBlobRef
    const galleryBlobs = galleryBlobsRef
    return () => {
      if (mainBlob.current) URL.revokeObjectURL(mainBlob.current)
      galleryBlobs.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImage, setMainImage] = useState<string | null>(defaultValues?.image_url ?? null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    (defaultValues?.gallery_urls ?? []).map((url) => ({ url }))
  )
  const [colorHex, setColorHex] = useState("#7c1033")
  const [colorName, setColorName] = useState("")
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    defaultValues?.colors ?? []
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    defaultValues?.sizes ?? []
  )

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as Resolver<CreateProductFormValues>,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      category_id: defaultValues?.category_id ?? "",
      brand: defaultValues?.brand ?? "",
      publish_status: defaultValues?.publish_status ?? "draft",
      is_active: defaultValues ? defaultValues.status === "active" : true,
      is_featured: defaultValues?.is_featured ?? false,
      discount_percentage: defaultValues?.discount_percentage ?? 0,
      discount_valid_until: defaultValues?.discount_valid_until ?? "",
    },
  })

  const watchedName = form.watch("name")
  const watchedDesc = form.watch("description")

  function addColor() {
    if (!colorName.trim()) return
    if (colors.find((c) => c.name === colorName)) return
    setColors([...colors, { name: colorName, hex: colorHex }])
    setColorName("")
  }

  function removeColor(name: string) {
    setColors(colors.filter((c) => c.name !== name))
  }

  function toggleSize(size: string) {
    setSelectedSizes(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    )
  }

  async function onSubmit(values: CreateProductFormValues) {
    setIsSubmitting(true)
    try {
      const basePayload = {
        name: values.name,
        description: values.description ?? null,
        status: (values.is_active ? "active" : "inactive") as "active" | "inactive",
        stock: values.stock,
        price: values.price,
        category_id: values.category_id || null,
        brand: values.brand || null,
        publish_status: values.publish_status,
        discount_percentage: values.discount_percentage,
        discount_valid_until: values.discount_valid_until || null,
        colors,
        sizes: selectedSizes,
        is_featured: values.is_featured,
      }

      if (mode === "create") {
        const created = await createProduct.mutateAsync({
          ...basePayload,
          image_url: null,
          gallery_urls: [],
        })

        let image_url: string | null = null
        if (mainImageFile) {
          image_url = await uploadProductImage(mainImageFile, created.id, "main")
        }

        const newFiles = galleryItems.filter((i) => i.file).map((i) => i.file!)
        const gallery_urls = await Promise.all(
          newFiles.map((f) => uploadProductImage(f, created.id, "gallery"))
        )

        if (image_url !== null || gallery_urls.length > 0) {
          await updateProduct.mutateAsync({ id: created.id, payload: { image_url, gallery_urls } })
        }
      } else {
        const id = defaultValues!.id
        const image_url = mainImageFile
          ? await uploadProductImage(mainImageFile, id, "main")
          : mainImage

        const existingUrls = galleryItems.filter((i) => !i.file).map((i) => i.url)
        const newFiles = galleryItems.filter((i) => i.file).map((i) => i.file!)
        const newUrls = await Promise.all(
          newFiles.map((f) => uploadProductImage(f, id, "gallery"))
        )
        const gallery_urls = [...existingUrls, ...newUrls]

        await updateProduct.mutateAsync({ id, payload: { ...basePayload, image_url, gallery_urls } })
      }

      toast.success(mode === "create" ? t("createProduct") : t("updateProduct"))
      router.push("/dashboard/products")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const galleryPreviews = galleryItems.map((i) => i.url)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("basicInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t("namePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("descriptionPlaceholder")}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("price")} *</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("stock")} *</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("brand")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("brandPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Main Image */}
            <Card>
              <CardContent className="pt-6">
                <ImageUploadZone
                  label={t("mainImage")}
                  description={t("mainImageDesc")}
                  preview={mainImage}
                  badge="1/1"
                  onChange={(file) => {
                    setMainImageFile(file)
                    if (mainBlobRef.current) URL.revokeObjectURL(mainBlobRef.current)
                    if (file) {
                      const url = URL.createObjectURL(file)
                      mainBlobRef.current = url
                      setMainImage(url)
                    } else {
                      mainBlobRef.current = null
                      setMainImage(null)
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Gallery Images */}
            <Card>
              <CardContent className="pt-6">
                <GalleryUploadZone
                  label={t("galleryImages")}
                  description={t("galleryImagesDesc")}
                  previews={galleryPreviews}
                  badge={`${galleryItems.length}/${MAX_GALLERY}`}
                  onAdd={(files) => {
                    const newItems = files.map((f) => {
                      const url = URL.createObjectURL(f)
                      galleryBlobsRef.current.add(url)
                      return { url, file: f }
                    })
                    setGalleryItems((prev) => [...prev, ...newItems].slice(0, MAX_GALLERY))
                  }}
                  onRemove={(index) => {
                    setGalleryItems((prev) => {
                      const item = prev[index]
                      if (item.file) {
                        URL.revokeObjectURL(item.url)
                        galleryBlobsRef.current.delete(item.url)
                      }
                      return prev.filter((_, i) => i !== index)
                    })
                  }}
                />
              </CardContent>
            </Card>

            {/* Discounts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("discounts")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("discountPercentage")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount_valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("discountValidUntil")}</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("colors")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded-md border border-input bg-background p-0.5"
                  />
                  <Input
                    placeholder={t("colorNamePlaceholder")}
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                  />
                  <Button type="button" variant="outline" onClick={addColor}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                {colors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noColors")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <span
                        key={c.name}
                        className="flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs"
                      >
                        <span
                          className="size-3 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                        <button
                          type="button"
                          onClick={() => removeColor(c.name)}
                          className="ms-0.5 opacity-60 hover:opacity-100"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("sizes")}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSizes.length === 0 && (
                  <p className="mb-3 text-sm text-muted-foreground">{t("noSizes")}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                        selectedSizes.includes(size)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-muted"
                      )}
                    >
                      {size === "freeSize" ? t("freeSize") : size}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("visibility")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{tc("active")}</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-normal">{t("featured")}</FormLabel>
                        <p className="text-xs text-muted-foreground">{t("featuredDesc")}</p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("publishStatus")}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="publish_status"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">{tc("draft")}</SelectItem>
                          <SelectItem value="published">{tc("published")}</SelectItem>
                          <SelectItem value="archived">{tc("archived")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">{t("name")}</p>
                  <p className="font-medium">{watchedName || t("namePlaceholder")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("description")}</p>
                  <p>{watchedDesc || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mainImage")}</p>
                  <p>{mainImage ? "✓" : t("noImageSelected")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("galleryImages")}</p>
                  <p>
                    {galleryItems.length > 0
                      ? `✓ ${galleryItems.length} files`
                      : t("noImageSelected")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("colors")}</p>
                  <p>{colors.length > 0 ? colors.map((c) => c.name).join(", ") : t("noColors")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("sizes")}</p>
                  <p>
                    {selectedSizes.length > 0
                      ? selectedSizes.map((s) => (s === "freeSize" ? t("freeSize") : s)).join(", ")
                      : t("noSizes")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/dashboard/products")}
          >
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {mode === "create" ? t("createProduct") : t("updateProduct")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
