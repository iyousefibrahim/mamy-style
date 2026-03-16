import { createClient } from "@/lib/supabase/client"

async function uploadToStorage(
  file: File,
  entityId: string,
  bucket: string,
  slot: "main" | string
): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split(".").pop()
  const path =
    slot === "main"
      ? `${entityId}/main.${ext}`
      : `${entityId}/gallery/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export function uploadProductImage(file: File, productId: string, slot: "main" | string) {
  return uploadToStorage(file, productId, "products", slot)
}

export function uploadCategoryImage(file: File, categoryId: string, slot: "main" | string) {
  return uploadToStorage(file, categoryId, "categories", slot)
}

export async function deleteStorageFile(bucket: string, path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
