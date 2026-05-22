"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { validateImageType, validateImageSize } from "@/lib/utils"

interface ImageUploaderProps {
  onUpload: (url: string) => void | Promise<void>
  currentImage?: string
  label?: string
}

export default function ImageUploader({ onUpload, currentImage, label }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    if (!validateImageType(file.type)) {
      setError("Invalid file type. Use JPEG, PNG, WebP, or AVIF.")
      return
    }
    if (!validateImageSize(file.size, 5)) {
      setError("File exceeds 5MB limit.")
      return
    }
    setLoading(true)
    try {
      const base64 = await imageFileToDataUrl(file)
      setPreview(base64)
      await onUpload(base64)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.")
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearImage = () => {
    setPreview(null)
    onUpload("")
  }

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e8e2d6]/20 bg-[#11110f] p-8 transition-colors hover:border-[#c9a35c]/50"
      >
        {loading ? (
          <Loader2 className="animate-spin text-[#c9a35c]" size={32} />
        ) : preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-48 rounded object-contain"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearImage() }}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mb-2 text-[#e8e2d6]/30" size={28} />
            <p className="text-sm text-[#e8e2d6]/50">Click or drop an image (max 5MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
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
