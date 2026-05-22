"use client"

import { useState, useEffect } from "react"
import { getAllMedia, deleteMedia, uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
import { Loader2, Copy, Trash2, Check } from "lucide-react"

interface MediaAsset {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  createdAt: string
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const res = await getAllMedia()
    if (res.success) setAssets((res.data as MediaAsset[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (base64: string) => {
    if (!base64) return
    setUploading(true)
    const res = await uploadMedia(base64, `upload-${Date.now()}`)
    setUploading(false)
    if (res.success) load()
  }

  const handleDelete = async (asset: MediaAsset) => {
    await deleteMedia(asset.id)
    load()
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
      setTimeout(() => setCopied(null), 2000)
    } catch {}
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Media Library</h1>

      <div className="mb-8 max-w-md">
        <ImageUploader label="Upload New Image" onUpload={handleUpload} />
        {uploading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-[#c9a35c]">
            <Loader2 className="animate-spin" size={14} />
            Uploading...
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#c9a35c]" size={28} />
        </div>
      ) : assets.length === 0 ? (
        <p className="text-sm text-[#e8e2d6]/50">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b]"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-[#e8e2d6]/70">{asset.filename}</p>
                <p className="text-xs text-[#e8e2d6]/40">{formatSize(asset.size)}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(asset.url)}
                  className="rounded bg-black/60 p-1.5 text-white hover:bg-black/80"
                  title="Copy URL"
                >
                  {copied === asset.url ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(asset)}
                  className="rounded bg-red-500/60 p-1.5 text-white hover:bg-red-500/80"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
