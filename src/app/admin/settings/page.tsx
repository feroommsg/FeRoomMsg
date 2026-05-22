"use client"

import { useState, useEffect, FormEvent } from "react"
import { getSiteSettings, updateSiteSettings } from "@/actions"
import ImageUploader from "@/components/ImageUploader"
import { uploadMedia } from "@/actions/media"
import { Save, Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    brandNameEn: "",
    brandNameAr: "",
    brandSmallEn: "",
    brandSmallAr: "",
    logoUrl: "",
    primaryColor: "#c9a35c",
    bgColor: "#0d0d0b",
    sectionBgColor: "#11110f",
    textColor: "#e8e2d6",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const res = await getSiteSettings()
      if (res.success && res.data) {
        const data = res.data as Record<string, string>
        setForm({
          brandNameEn: data.brandNameEn ?? "",
          brandNameAr: data.brandNameAr ?? "",
          brandSmallEn: data.brandSmallEn ?? "",
          brandSmallAr: data.brandSmallAr ?? "",
          logoUrl: data.logoUrl ?? "",
          primaryColor: data.primaryColor ?? "#c9a35c",
          bgColor: data.bgColor ?? "#0d0d0b",
          sectionBgColor: data.sectionBgColor ?? "#11110f",
          textColor: data.textColor ?? "#e8e2d6",
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
    const res = await updateSiteSettings(form)
    setSaving(false)
    if (res.success) {
      setMessage({ type: "success", text: "Settings saved successfully!" })
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save settings" })
    }
  }

  const handleLogoUpload = async (base64: string) => {
    if (!base64) {
      setForm((f) => ({ ...f, logoUrl: "" }))
      return
    }
    const res = await uploadMedia(base64, "logo")
    if (res.success) {
      const asset = res.data as { url: string }
      setForm((f) => ({ ...f, logoUrl: asset.url }))
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
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InputField label="Brand Name (EN)" value={form.brandNameEn} onChange={(v) => setForm((f) => ({ ...f, brandNameEn: v }))} />
          <InputField label="Brand Name (AR)" value={form.brandNameAr} onChange={(v) => setForm((f) => ({ ...f, brandNameAr: v }))} />
          <InputField label="Brand Small (EN)" value={form.brandSmallEn} onChange={(v) => setForm((f) => ({ ...f, brandSmallEn: v }))} />
          <InputField label="Brand Small (AR)" value={form.brandSmallAr} onChange={(v) => setForm((f) => ({ ...f, brandSmallAr: v }))} />
        </div>

        <ImageUploader label="Logo" currentImage={form.logoUrl} onUpload={handleLogoUpload} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                className="h-10 w-16 cursor-pointer rounded border border-[#e8e2d6]/10 bg-transparent"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                className="flex-1 rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
              />
            </div>
          </div>
          <InputField label="Background Color" value={form.bgColor} onChange={(v) => setForm((f) => ({ ...f, bgColor: v }))} />
          <InputField label="Section Background Color" value={form.sectionBgColor} onChange={(v) => setForm((f) => ({ ...f, sectionBgColor: v }))} />
          <InputField label="Text Color" value={form.textColor} onChange={(v) => setForm((f) => ({ ...f, textColor: v }))} />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-6 py-2.5 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f] disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Settings"}
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

function InputField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] placeholder-[#e8e2d6]/30 outline-none transition-colors focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
      />
    </div>
  )
}
