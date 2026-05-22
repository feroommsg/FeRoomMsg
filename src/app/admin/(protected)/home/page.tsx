"use client"

import { useState, useEffect, FormEvent } from "react"
import { getHomeContent, updateHomeContent } from "@/actions"
import { uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
import { Save, Loader2 } from "lucide-react"

export default function AdminHomePage() {
  const [form, setForm] = useState({
    heroBgImage: "",
    heroBadgeEn: "",
    heroBadgeAr: "",
    heroTitleEn: "",
    heroTitleAr: "",
    heroTextEn: "",
    heroTextAr: "",
    overviewTitleEn: "",
    overviewTitleAr: "",
    overviewTextEn: "",
    overviewTextAr: "",
  })
  const [tab, setTab] = useState<"hero" | "overview">("hero")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const res = await getHomeContent()
      if (res.success && res.data) {
        const d = res.data as Record<string, string>
        setForm({
          heroBgImage: d.heroBgImage ?? "",
          heroBadgeEn: d.heroBadgeEn ?? "",
          heroBadgeAr: d.heroBadgeAr ?? "",
          heroTitleEn: d.heroTitleEn ?? "",
          heroTitleAr: d.heroTitleAr ?? "",
          heroTextEn: d.heroTextEn ?? "",
          heroTextAr: d.heroTextAr ?? "",
          overviewTitleEn: d.overviewTitleEn ?? "",
          overviewTitleAr: d.overviewTitleAr ?? "",
          overviewTextEn: d.overviewTextEn ?? "",
          overviewTextAr: d.overviewTextAr ?? "",
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
    const res = await updateHomeContent(form)
    setSaving(false)
    if (res.success) {
      setMessage({ type: "success", text: "Home content saved!" })
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save" })
    }
  }

  const handleBgUpload = async (base64: string) => {
    if (!base64) {
      setForm((f) => ({ ...f, heroBgImage: "" }))
      return
    }
    const res = await uploadMedia(base64, "hero-bg")
    if (res.success) {
      const asset = res.data as { url: string }
      setForm((f) => ({ ...f, heroBgImage: asset.url }))
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
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Home Content Editor</h1>

      <div className="mb-6 flex gap-1 rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-1">
        <TabButton active={tab === "hero"} onClick={() => setTab("hero")}>Hero Section</TabButton>
        <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>Overview Section</TabButton>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {tab === "hero" && (
          <div className="space-y-6">
            <ImageUploader label="Hero Background Image" currentImage={form.heroBgImage} onUpload={handleBgUpload} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <InputField label="Badge (EN)" value={form.heroBadgeEn} onChange={(v) => setForm((f) => ({ ...f, heroBadgeEn: v }))} />
              <InputField label="Badge (AR)" value={form.heroBadgeAr} onChange={(v) => setForm((f) => ({ ...f, heroBadgeAr: v }))} />
              <InputField label="Title (EN)" value={form.heroTitleEn} onChange={(v) => setForm((f) => ({ ...f, heroTitleEn: v }))} />
              <InputField label="Title (AR)" value={form.heroTitleAr} onChange={(v) => setForm((f) => ({ ...f, heroTitleAr: v }))} />
              <TextareaField label="Text (EN)" value={form.heroTextEn} onChange={(v) => setForm((f) => ({ ...f, heroTextEn: v }))} />
              <TextareaField label="Text (AR)" value={form.heroTextAr} onChange={(v) => setForm((f) => ({ ...f, heroTextAr: v }))} />
            </div>
          </div>
        )}

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <InputField label="Title (EN)" value={form.overviewTitleEn} onChange={(v) => setForm((f) => ({ ...f, overviewTitleEn: v }))} />
              <InputField label="Title (AR)" value={form.overviewTitleAr} onChange={(v) => setForm((f) => ({ ...f, overviewTitleAr: v }))} />
              <TextareaField label="Text (EN)" value={form.overviewTextEn} onChange={(v) => setForm((f) => ({ ...f, overviewTextEn: v }))} />
              <TextareaField label="Text (AR)" value={form.overviewTextAr} onChange={(v) => setForm((f) => ({ ...f, overviewTextAr: v }))} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-6 py-2.5 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f] disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Content"}
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

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-[#c9a35c]/10 text-[#c9a35c]" : "text-[#e8e2d6]/50 hover:text-[#e8e2d6]"
      }`}
    >
      {children}
    </button>
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
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
      />
    </div>
  )
}
