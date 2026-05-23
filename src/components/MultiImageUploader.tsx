"use client"

import { useRef, useState } from "react"
import { Upload, X, Star, Loader2 } from "lucide-react"
import { validateImageType, validateImageSize } from "@/lib/utils"

export interface ImageEntry {
  id?: string
  imageUrl: string
  isCover: boolean
  sortOrder: number
  isNew?: boolean
}

interface MultiImageUploaderProps {
  images: ImageEntry[]
  onChange: (images: ImageEntry[]) => void
  label?: string
}

export default function MultiImageUploader({ images, onChange, label }: MultiImageUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    setError(null)
    const newEntries: ImageEntry[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!validateImageType(file.type)) {
        setError(`Invalid type: ${file.name}. Use JPEG, PNG, WebP, or AVIF.`)
        continue
      }
      if (!validateImageSize(file.size, 5)) {
        setError(`File too large: ${file.name}. Max 5MB.`)
        continue
      }
      try {
        const base64 = await imageFileToDataUrl(file)
        newEntries.push({
          imageUrl: base64,
          isCover: images.length === 0 && i === 0,
          sortOrder: images.length + i,
          isNew: true,
        })
      } catch {
        setError(`Failed to process: ${file.name}`)
      }
    }
    if (newEntries.length > 0) {
      onChange([...images, ...newEntries])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFiles(files)
    if (inputRef.current) inputRef.current.value = ""
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    if (images[index].isCover && updated.length > 0) {
      updated[0].isCover = true
    }
    onChange(updated)
  }

  const setCover = (index: number) => {
    onChange(
      images.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    )
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...images]
    const temp = { ...updated[index - 1] }
    const tempSort = temp.sortOrder
    updated[index - 1] = { ...updated[index], sortOrder: tempSort }
    updated[index] = { ...temp, sortOrder: updated[index].sortOrder }
    onChange(updated)
  }

  const moveDown = (index: number) => {
    if (index >= images.length - 1) return
    const updated = [...images]
    const temp = { ...updated[index + 1] }
    const tempSort = temp.sortOrder
    updated[index + 1] = { ...updated[index], sortOrder: tempSort }
    updated[index] = { ...temp, sortOrder: updated[index].sortOrder }
    onChange(updated)
  }

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>}

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b]"
            >
              <div className="aspect-square">
                <img
                  src={img.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              {img.isCover && (
                <span className="absolute left-1 top-1 rounded bg-[#c9a35c] px-1.5 py-0.5 text-[10px] font-bold text-[#0d0d0b]">
                  Cover
                </span>
              )}

              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 transition-colors group-hover:bg-black/50">
                <button
                  type="button"
                  onClick={() => setCover(i)}
                  title="Set as cover"
                  className={`rounded p-1 text-white transition-colors hover:bg-white/20 ${img.isCover ? "text-[#c9a35c]" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <Star size={14} fill={img.isCover ? "#c9a35c" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  title="Remove"
                  className="rounded p-1 text-white opacity-0 transition-colors hover:bg-red-500/60 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    className="rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
                    title="Move left"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    className="rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
                    title="Move right"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e8e2d6]/20 bg-[#11110f] p-6 transition-colors hover:border-[#c9a35c]/50"
      >
        {loading ? (
          <Loader2 className="animate-spin text-[#c9a35c]" size={28} />
        ) : (
          <>
            <Upload className="mb-2 text-[#e8e2d6]/30" size={24} />
            <p className="text-sm text-[#e8e2d6]/50">
              {images.length > 0 ? "Add more images" : "Click or drop images (max 5MB each)"}
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

async function imageFileToDataUrl(file: File) {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("This image could not be opened. Try a JPG, PNG, or WebP file."))
      img.src = objectUrl
    })
    const maxWidth = 1800
    const scale = Math.min(1, maxWidth / image.naturalWidth)
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Image processing is not supported in this browser.")
    ctx.drawImage(image, 0, 0, width, height)
    return canvas.toDataURL("image/jpeg", 0.86)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
