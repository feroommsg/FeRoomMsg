"use client"

import { useState, useEffect, FormEvent } from "react"
import { getSeoSettings, updateSeoSettings } from "@/actions"
import { uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
import { Save, Loader2 } from "lucide-react"

export default function AdminSeoPage() {
  const [form, setForm] = useState({
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    ogImageUrl: "",
    keywordsEn: "",
    keywordsAr: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const res = await getSeoSettings()
      if (res.success && res.data) {
        const d = res.data as Record<string, string>
        setForm({
          titleEn: d.titleEn ?? "",
          titleAr: d.titleAr ?? "",
          descriptionEn: d.descriptionEn ?? "",
          descriptionAr: d.descriptionAr ?? "",
          ogImageUrl: d.ogImageUrl ?? "",
          keywordsEn: d.keywordsEn ?? "",
          keywordsAr: d.keywordsAr ?? "",
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const res = await updateSeoSettings(form)
    setSaving(false)
    if (res.success) {
      setMessage({ type: "success", text: "SEO settings saved!" })
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save" })
    }
  }

  const handleOgUpload = async (base64: string) => {
    if (!base64) {
      setForm((f) => ({ ...f, ogImageUrl: "" }))
      return
    }
    const res = await uploadMedia(base64, "og-image")
    if (res.success) {
      const asset = res.data as { url: string }
      setForm((f) => ({ ...f, ogImageUrl: asset.url }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-[#c9a35c]" size={28} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">SEO Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InputField label="Meta Title (EN)" value={form.titleEn} onChange={(v) => setForm((f) => ({ ...f, titleEn: v }))} />
          <InputField label="Meta Title (AR)" value={form.titleAr} onChange={(v) => setForm((f) => ({ ...f, titleAr: v }))} />
          <TextareaField label="Meta Description (EN)" value={form.descriptionEn} onChange={(v) => setForm((f) => ({ ...f, descriptionEn: v }))} />
          <TextareaField label="Meta Description (AR)" value={form.descriptionAr} onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))} />
          <InputField label="Keywords (EN)" value={form.keywordsEn} onChange={(v) => setForm((f) => ({ ...f, keywordsEn: v }))} />
          <InputField label="Keywords (AR)" value={form.keywordsAr} onChange={(v) => setForm((f) => ({ ...f, keywordsAr: v }))} />
        </div>

        <ImageUploader label="OG Image (Open Graph)" currentImage={form.ogImageUrl} onUpload={handleOgUpload} />

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-6 py-2.5 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f] disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save SEO Settings"}
          </button>
          {message && (
            <span className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {message.text}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
      />
    </div>
  )
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
      />
    </div>
  )
}
