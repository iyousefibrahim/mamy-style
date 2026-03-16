"use client"

import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const MAX_GALLERY = 5

type Props = {
  label: string
  description: string
  previews: string[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  badge?: string
}

export function GalleryUploadZone({ label, description, previews, onAdd, onRemove, badge }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function removeAt(index: number) {
    onRemove(index)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ImagePlus className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm">{label}</span>
        {badge && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={src} className="relative size-20 rounded-lg overflow-hidden border bg-muted">
              <img src={src} alt="" loading="lazy" className="object-cover w-full h-full" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-0.5 end-0.5 size-5 rounded-full"
                onClick={() => removeAt(i)}
              >
                <X className="size-2.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {previews.length < MAX_GALLERY && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded border border-dashed border-muted-foreground/30 px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 transition-colors"
        >
          <ImagePlus className="size-4" />
          Select Files
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          onAdd(files)
          e.target.value = ""
        }}
      />
    </div>
  )
}
