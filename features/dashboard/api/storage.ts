import { createClient } from "@/lib/supabase/client"

export async function uploadProductImage(
  file: File,
  productId: string,
  slot: "main" | string
): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split(".").pop()
  const path =
    slot === "main"
      ? `${productId}/main.${ext}`
      : `${productId}/gallery/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("products")
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from("products").getPublicUrl(path)
  return data.publicUrl
}

export async function uploadCategoryImage(
  file: File,
  categoryId: string,
  slot: "main" | string
): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split(".").pop()
  const path =
    slot === "main"
      ? `${categoryId}/main.${ext}`
      : `${categoryId}/gallery/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("categories")
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from("categories").getPublicUrl(path)
  return data.publicUrl
}

export async function deleteStorageFile(bucket: string, path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
