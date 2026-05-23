"use client"

import { useState, useEffect } from "react"
import { getAllPartners, createPartner, updatePartner, deletePartner } from "@/actions"
import { uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
import AdminTable from "@/components/AdminTable"
import { Loader2, X } from "lucide-react"

interface Partner {
  id: string
  nameEn: string
  nameAr: string
  logoUrl: string | null
  type: string
  sortOrder: number
}

const emptyForm = {
  nameEn: "", nameAr: "", logoUrl: "", type: "text", sortOrder: 0,
}

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: Partner } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const load = async () => {
    const res = await getAllPartners()
    if (res.success) setItems((res.data as Partner[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (item: Partner) => {
    await deletePartner(item.id)
    load()
  }

  const handleSave = async () => {
    if (!modal) return
    setSaving(true)
    const data = {
      nameEn: modal.nameEn, nameAr: modal.nameAr,
      logoUrl: modal.logoUrl || undefined,
      type: modal.type, sortOrder: modal.sortOrder,
    }
    if (modal.item) {
      await updatePartner(modal.item.id, data)
    } else {
      await createPartner(data as any)
    }
    setSaving(false)
    setModal(null)
    load()
  }

  const handleLogoUpload = async (base64: string) => {
    setUploadError(null)
    if (!base64) {
      setModal((m) => m ? { ...m, logoUrl: "" } : null)
      return
    }
    const res = await uploadMedia(base64, "partner")
    if (res.success) {
      const asset = res.data as { url: string }
      setModal((m) => m ? { ...m, logoUrl: asset.url } : null)
    } else {
      setUploadError(res.error || "Failed to upload logo")
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Partners</h1>

      <AdminTable
        columns={[
          {
            key: "logoUrl",
            label: "Logo",
            render: (item) => {
              const p = item as Partner
              return p.logoUrl ? (
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <img src={p.logoUrl} alt="" className="h-full w-full object-contain" />
                </div>
              ) : (
                <span className="text-xs text-[#e8e2d6]/30">—</span>
              )
            },
          },
          { key: "nameEn", label: "Name (EN)" },
          { key: "nameAr", label: "Name (AR)" },
          { key: "type", label: "Type" },
          { key: "sortOrder", label: "Order" },
        ]}
        data={items}
        loading={loading}
        onEdit={(item) => {
          const p = item as Partner
          setModal({
            item: p,
            nameEn: p.nameEn, nameAr: p.nameAr,
            logoUrl: p.logoUrl || "", type: p.type, sortOrder: p.sortOrder,
          })
        }}
        onDelete={handleDelete}
        onCreate={() => setModal({ ...emptyForm, sortOrder: items.length })}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#e8e2d6]">
                {modal.item ? "Edit Partner" : "New Partner"}
              </h3>
              <button onClick={() => setModal(null)} className="text-[#e8e2d6]/40 hover:text-[#e8e2d6]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InputField label="Name (EN)" value={modal.nameEn} onChange={(v) => setModal({ ...modal, nameEn: v })} />
                <InputField label="Name (AR)" value={modal.nameAr} onChange={(v) => setModal({ ...modal, nameAr: v })} />
                <InputField label="Sort Order" type="number" value={String(modal.sortOrder)} onChange={(v) => setModal({ ...modal, sortOrder: parseInt(v) || 0 })} />
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#e8e2d6]/60">Type</label>
                  <select
                    value={modal.type}
                    onChange={(e) => setModal({ ...modal, type: e.target.value })}
                    className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-3 py-2 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
                  >
                    <option value="text">Text</option>
                    <option value="logo">Logo</option>
                  </select>
                </div>
              </div>
              {uploadError && (
                <p className="text-xs text-red-400">{uploadError}</p>
              )}
              <ImageUploader label="Logo (optional)" currentImage={modal.logoUrl} onUpload={handleLogoUpload} />

              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setModal(null)} className="rounded-md border border-[#e8e2d6]/10 px-4 py-2 text-sm text-[#e8e2d6]/60 hover:text-[#e8e2d6]">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#e8e2d6]/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-3 py-2 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
      />
    </div>
  )
}
