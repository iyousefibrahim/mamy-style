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
import type { MockCategory } from "@/lib/mock/categories"

type Props = {
  defaultValues?: Partial<MockCategory>
  mode: "create" | "edit"
}

export function CategoryForm({ defaultValues, mode }: Props) {
  const t = useTranslations("dashboard.categories")
  const tc = useTranslations("dashboard.common")
  const router = useRouter()

  const [mainImage, setMainImage] = useState<string | null>(defaultValues?.image_url ?? null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    defaultValues?.gallery_urls ?? []
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

  function onSubmit(_values: CreateCategoryFormValues) {
    toast.success(mode === "create" ? "Category created!" : "Category updated!")
    router.push("/dashboard/categories")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Category Information</CardTitle>
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
                    if (file) setMainImage(URL.createObjectURL(file))
                    else setMainImage(null)
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
                  badge={`${galleryPreviews.length}/5`}
                  onChange={(files) => setGalleryPreviews(files.map((f) => URL.createObjectURL(f)))}
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
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{watchedName || t("namePlaceholder")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Main Image</p>
                  <p>{mainImage ? "✓" : t("noImageSelected")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gallery Images</p>
                  <p>
                    {galleryPreviews.length > 0
                      ? `✓ ${galleryPreviews.length} files`
                      : t("noImageSelected")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/categories")}>
            {tc("cancel")}
          </Button>
          <Button type="submit">
            {mode === "create" ? t("createCategory") : t("updateCategory")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
