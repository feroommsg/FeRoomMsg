"use client"

import { useState, useRef } from "react"
import { Upload, X, Star, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { validateImageType, validateImageSize } from "@/lib/utils"

export interface ImageEntry {
  id?: string
  imageUrl?: string
  base64?: string
  altText?: string
  sortOrder: number
  isCover: boolean
}

interface MultiImageUploaderProps {
  images: ImageEntry[]
  onChange: (images: ImageEntry[]) => void
  label?: string
  maxImages?: number
}

export default function MultiImageUploader({
  images,
  onChange,
  label,
  maxImages = 20,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    setError(null)
    const remaining = maxImages - images.length
    if (files.length > remaining) {
      setError(`You can only add ${remaining} more image(s)`)
      return
    }

    setUploading(true)
    try {
      const newEntries: ImageEntry[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!validateImageType(file.type)) {
          setError(`Invalid file type: ${file.name}. Use JPEG, PNG, WebP, or AVIF.`)
          continue
        }
        if (!validateImageSize(file.size, 5)) {
          setError(`File too large: ${file.name}. Max 5MB.`)
          continue
        }
        const base64 = await imageFileToDataUrl(file)
        newEntries.push({
          base64,
          altText: file.name.replace(/\.[^/.]+$/, ""),
          sortOrder: images.length + newEntries.length,
          isCover: images.length === 0 && newEntries.length === 0,
        })
      }
      onChange([...images, ...newEntries])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process images")
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      sortOrder: i,
      isCover: i === 0 ? true : false,
    }))
    onChange(updated)
  }

  const setCover = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isCover: i === index,
    }))
    onChange(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...images]
    const temp = { ...updated[index], sortOrder: updated[index - 1].sortOrder }
    updated[index] = { ...updated[index - 1], sortOrder: updated[index].sortOrder }
    updated[index - 1] = temp
    onChange(updated.map((img, i) => ({ ...img, sortOrder: i })))
  }

  const moveDown = (index: number) => {
    if (index === images.length - 1) return
    const updated = [...images]
    const temp = { ...updated[index], sortOrder: updated[index + 1].sortOrder }
    updated[index] = { ...updated[index + 1], sortOrder: updated[index].sortOrder }
    updated[index + 1] = temp
    onChange(updated.map((img, i) => ({ ...img, sortOrder: i })))
  }

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>}

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id || `new-${index}`}
              className={`group relative overflow-hidden rounded-lg border ${
                img.isCover ? "border-[#c9a35c]" : "border-[#e8e2d6]/10"
              } bg-[#0d0d0b]`}
            >
              <div className="aspect-square">
                <img
                  src={img.imageUrl || img.base64}
                  alt={img.altText || `Image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/60 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-full bg-red-500/80 p-1.5 text-white hover:bg-red-500"
                  title="Remove"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCover(index)}
                  className={`rounded-full p-1.5 ${
                    img.isCover
                      ? "bg-[#c9a35c] text-[#0d0d0b]"
                      : "bg-white/20 text-white hover:bg-[#c9a35c]/80"
                  }`}
                  title={img.isCover ? "Cover image" : "Set as cover"}
                >
                  <Star size={14} fill={img.isCover ? "#0d0d0b" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/40 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === images.length - 1}
                  className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/40 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              {img.isCover && (
                <div className="absolute left-1 top-1 rounded bg-[#c9a35c] px-1.5 py-0.5 text-[9px] font-bold text-[#0d0d0b]">
                  COVER
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e8e2d6]/20 bg-[#11110f] p-6 transition-colors hover:border-[#c9a35c]/50"
        >
          {uploading ? (
            <Loader2 className="animate-spin text-[#c9a35c]" size={24} />
          ) : (
            <>
              <Upload className="mb-1 text-[#e8e2d6]/30" size={22} />
              <p className="text-xs text-[#e8e2d6]/50">
                Click or drop images (max {maxImages}, 5MB each)
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

async function imageFileToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Cannot read this image. Try JPG, PNG, or WebP."))
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
    if (!ctx) throw new Error("Image processing not supported in this browser.")
    ctx.drawImage(image, 0, 0, width, height)
    return canvas.toDataURL("image/jpeg", 0.86)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}