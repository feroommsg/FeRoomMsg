"use client"

import { useState, useEffect } from "react"
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } from "@/actions"
import { uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
import AdminTable from "@/components/AdminTable"
import { Loader2, X } from "lucide-react"

interface Material {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  applicationsEn: string
  applicationsAr: string
  imageUrl: string
  sortOrder: number
}

const emptyForm = {
  nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "",
  applicationsEn: "", applicationsAr: "", imageUrl: "", sortOrder: 0,
}

export default function AdminMaterialsPage() {
  const [items, setItems] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: Material } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await getAllMaterials()
    if (res.success) setItems((res.data as Material[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (item: Material) => {
    await deleteMaterial(item.id)
    load()
  }

  const handleSave = async () => {
    if (!modal) return
    setSaving(true)
    const data = {
      nameEn: modal.nameEn, nameAr: modal.nameAr,
      descriptionEn: modal.descriptionEn, descriptionAr: modal.descriptionAr,
      applicationsEn: modal.applicationsEn, applicationsAr: modal.applicationsAr,
      imageUrl: modal.imageUrl, sortOrder: modal.sortOrder,
    }
    if (modal.item) {
      await updateMaterial(modal.item.id, data)
    } else {
      await createMaterial(data as any)
    }
    setSaving(false)
    setModal(null)
    load()
  }

  const handleImageUpload = async (base64: string) => {
    if (!base64) {
      setModal((m) => m ? { ...m, imageUrl: "" } : null)
      return
    }
    const res = await uploadMedia(base64, "material")
    if (res.success) {
      const asset = res.data as { url: string }
      setModal((m) => m ? { ...m, imageUrl: asset.url } : null)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Materials</h1>

      <AdminTable
        columns={[
          { key: "nameEn", label: "Name (EN)" },
          { key: "nameAr", label: "Name (AR)" },
          { key: "sortOrder", label: "Order" },
        ]}
        data={items}
        loading={loading}
        onEdit={(item) => {
          const m = item as Material
          setModal({ item: m, ...m })
        }}
        onDelete={handleDelete}
        onCreate={() => setModal({ ...emptyForm, sortOrder: items.length })}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#e8e2d6]">
                {modal.item ? "Edit Material" : "New Material"}
              </h3>
              <button onClick={() => setModal(null)} className="text-[#e8e2d6]/40 hover:text-[#e8e2d6]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InputField label="Name (EN)" value={modal.nameEn} onChange={(v) => setModal({ ...modal, nameEn: v })} />
                <InputField label="Name (AR)" value={modal.nameAr} onChange={(v) => setModal({ ...modal, nameAr: v })} />
                <TextareaField label="Description (EN)" value={modal.descriptionEn} onChange={(v) => setModal({ ...modal, descriptionEn: v })} />
                <TextareaField label="Description (AR)" value={modal.descriptionAr} onChange={(v) => setModal({ ...modal, descriptionAr: v })} />
                <TextareaField label="Applications (EN)" value={modal.applicationsEn} onChange={(v) => setModal({ ...modal, applicationsEn: v })} />
                <TextareaField label="Applications (AR)" value={modal.applicationsAr} onChange={(v) => setModal({ ...modal, applicationsAr: v })} />
              </div>
              <InputField label="Sort Order" type="number" value={String(modal.sortOrder)} onChange={(v) => setModal({ ...modal, sortOrder: parseInt(v) || 0 })} />
              <ImageUploader label="Material Image" currentImage={modal.imageUrl} onUpload={handleImageUpload} />

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

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#e8e2d6]/60">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-3 py-2 text-sm text-[#e8e2d6] outline-none focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
      />
    </div>
  )
}
