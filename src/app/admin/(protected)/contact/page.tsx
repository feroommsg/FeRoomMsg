"use client"

import { useState, useEffect, FormEvent } from "react"
import { getContactInfo, updateContactInfo } from "@/actions"
import { Save, Loader2 } from "lucide-react"

export default function AdminContactPage() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    locationEn: "",
    locationAr: "",
    addressEn: "",
    addressAr: "",
    mapEmbed: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const res = await getContactInfo()
      if (res.success && res.data) {
        const d = res.data as Record<string, string>
        setForm({
          phone: d.phone ?? "",
          email: d.email ?? "",
          locationEn: d.locationEn ?? "",
          locationAr: d.locationAr ?? "",
          addressEn: d.addressEn ?? "",
          addressAr: d.addressAr ?? "",
          mapEmbed: d.mapEmbed ?? "",
          facebook: d.facebook ?? "",
          instagram: d.instagram ?? "",
          linkedin: d.linkedin ?? "",
          twitter: d.twitter ?? "",
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
    const res = await updateContactInfo(form)
    setSaving(false)
    if (res.success) {
      setMessage({ type: "success", text: "Contact info saved!" })
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save" })
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
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Contact Information</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InputField label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
          <InputField label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <InputField label="Location (EN)" value={form.locationEn} onChange={(v) => setForm((f) => ({ ...f, locationEn: v }))} />
          <InputField label="Location (AR)" value={form.locationAr} onChange={(v) => setForm((f) => ({ ...f, locationAr: v }))} />
          <InputField label="Address (EN)" value={form.addressEn} onChange={(v) => setForm((f) => ({ ...f, addressEn: v }))} />
          <InputField label="Address (AR)" value={form.addressAr} onChange={(v) => setForm((f) => ({ ...f, addressAr: v }))} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">Map Embed Code</label>
          <textarea
            rows={3}
            value={form.mapEmbed}
            onChange={(e) => setForm((f) => ({ ...f, mapEmbed: e.target.value }))}
            className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] font-mono outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InputField label="Facebook URL" value={form.facebook} onChange={(v) => setForm((f) => ({ ...f, facebook: v }))} />
          <InputField label="Instagram URL" value={form.instagram} onChange={(v) => setForm((f) => ({ ...f, instagram: v }))} />
          <InputField label="LinkedIn URL" value={form.linkedin} onChange={(v) => setForm((f) => ({ ...f, linkedin: v }))} />
          <InputField label="Twitter URL" value={form.twitter} onChange={(v) => setForm((f) => ({ ...f, twitter: v }))} />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-6 py-2.5 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f] disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Contact Info"}
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
