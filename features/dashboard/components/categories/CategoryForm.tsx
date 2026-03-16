"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImageUploadZone } from "../products/ImageUploadZone"
import { GalleryUploadZone } from "../products/GalleryUploadZone"
import { createCategorySchema, type CreateCategoryFormValues } from "../../types"
import { useCreateCategory, useUpdateCategory } from "@/features/dashboard/hooks/useCategories"
import { uploadCategoryImage } from "@/features/dashboard/api/storage"
import type { Category } from "../../types"

const MAX_GALLERY = 5

type GalleryItem = { url: string; file?: File }

type Props = {
  defaultValues?: Category
  mode: "create" | "edit"
}

export function CategoryForm({ defaultValues, mode }: Props) {
  const t = useTranslations("dashboard.categories")
  const tc = useTranslations("dashboard.common")
  const router = useRouter()

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImage, setMainImage] = useState<string | null>(defaultValues?.image_url ?? null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    (defaultValues?.gallery_urls ?? []).map((url) => ({ url }))
  )
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? [])

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      is_active: defaultValues ? defaultValues.status === "active" : true,
    },
  })

  const watchedName = form.watch("name")
  const watchedIsActive = form.watch("is_active")

  function addTag() {
    const tag = tagInput.trim()
    if (!tag || tags.includes(tag)) return
    setTags([...tags, tag])
    setTagInput("")
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  async function onSubmit(values: CreateCategoryFormValues) {
    setIsSubmitting(true)
    try {
      const basePayload = {
        name: values.name,
        description: values.description ?? null,
        status: (values.is_active ? "active" : "inactive") as "active" | "inactive",
        tags,
      }

      if (mode === "create") {
        const created = await createCategory.mutateAsync({
          ...basePayload,
          image_url: null,
          gallery_urls: [],
        })

        let image_url: string | null = null
        if (mainImageFile) {
          image_url = await uploadCategoryImage(mainImageFile, created.id, "main")
        }

        const newFiles = galleryItems.filter((i) => i.file).map((i) => i.file!)
        const gallery_urls = await Promise.all(
          newFiles.map((f) => uploadCategoryImage(f, created.id, "gallery"))
        )

        if (image_url !== null || gallery_urls.length > 0) {
          await updateCategory.mutateAsync({ id: created.id, payload: { image_url, gallery_urls } })
        }
      } else {
        const id = defaultValues!.id
        const image_url = mainImageFile
          ? await uploadCategoryImage(mainImageFile, id, "main")
          : mainImage

        const existingUrls = galleryItems.filter((i) => !i.file).map((i) => i.url)
        const newFiles = galleryItems.filter((i) => i.file).map((i) => i.file!)
        const newUrls = await Promise.all(
          newFiles.map((f) => uploadCategoryImage(f, id, "gallery"))
        )
        const gallery_urls = [...existingUrls, ...newUrls]

        await updateCategory.mutateAsync({ id, payload: { ...basePayload, image_url, gallery_urls } })
      }

      toast.success(mode === "create" ? t("createCategory") : t("updateCategory"))
      router.push("/dashboard/categories")
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
            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("categoryInfo")}</CardTitle>
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

                {/* Tags */}
                <div className="space-y-2">
                  <FormLabel>{t("tags")}</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("tagsPlaceholder")}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addTag}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
                    setMainImage(file ? URL.createObjectURL(file) : null)
                  }}
                />
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="pt-6">
                <GalleryUploadZone
                  label={t("galleryImages")}
                  description={t("galleryImagesDesc")}
                  previews={galleryPreviews}
                  badge={`${galleryItems.length}/${MAX_GALLERY}`}
                  onAdd={(files) => {
                    const newItems = files.map((f) => ({ url: URL.createObjectURL(f), file: f }))
                    setGalleryItems((prev) => [...prev, ...newItems].slice(0, MAX_GALLERY))
                  }}
                  onRemove={(index) => {
                    setGalleryItems((prev) => prev.filter((_, i) => i !== index))
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("status")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">{tc("active")}</FormLabel>
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground">
                  {watchedIsActive ? tc("active") : tc("inactive")}
                </p>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/dashboard/categories")}
          >
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {mode === "create" ? t("createCategory") : t("updateCategory")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
