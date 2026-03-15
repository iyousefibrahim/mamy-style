"use client"

import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  description: string
  preview: string | null
  onChange: (file: File | null) => void
  badge?: string
}

export function ImageUploadZone({ label, description, preview, onChange, badge }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

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

      {preview ? (
        <div className="relative w-full rounded-lg overflow-hidden border aspect-video bg-muted flex items-center justify-center">
          <img src={preview} alt="Preview" className="object-contain max-h-48" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 end-2 size-6 rounded-full"
            onClick={() => onChange(null)}
          >
            <X className="size-3" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center hover:border-primary/50 transition-colors"
        >
          <ImagePlus className="size-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Drag and drop your image here, or click to select
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          onChange(file ?? null)
        }}
      />
    </div>
  )
}
