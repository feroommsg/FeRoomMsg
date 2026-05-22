"use client"

import { useState, useEffect } from "react"
import { getAllCatalogItems, createCatalogItem, updateCatalogItem, deleteCatalogItem } from "@/actions"
import { uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
import AdminTable from "@/components/AdminTable"
import { Loader2, X } from "lucide-react"

interface CatalogItem {
  id: string
  titleEn: string | null
  titleAr: string | null
  categoryEn: string | null
  categoryAr: string | null
  imageUrl: string
  showOverlay: boolean
  sortOrder: number
}

const emptyForm = {
  titleEn: "", titleAr: "", categoryEn: "", categoryAr: "",
  imageUrl: "", showOverlay: true, sortOrder: 0,
}

export default function AdminCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: CatalogItem } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await getAllCatalogItems()
    if (res.success) setItems((res.data as CatalogItem[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (item: CatalogItem) => {
    await deleteCatalogItem(item.id)
    load()
  }

  const handleSave = async () => {
    if (!modal) return
    setSaving(true)
    const data = {
      titleEn: modal.titleEn || undefined,
      titleAr: modal.titleAr || undefined,
      categoryEn: modal.categoryEn || undefined,
      categoryAr: modal.categoryAr || undefined,
      imageUrl: modal.imageUrl,
      showOverlay: modal.showOverlay,
      sortOrder: modal.sortOrder,
    }
    if (modal.item) {
      await updateCatalogItem(modal.item.id, data)
    } else {
      await createCatalogItem(data as any)
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
    const res = await uploadMedia(base64, "catalog")
    if (res.success) {
      const asset = res.data as { url: string }
      setModal((m) => m ? { ...m, imageUrl: asset.url } : null)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Catalog</h1>

      <AdminTable
        columns={[
          { key: "titleEn", label: "Title (EN)", render: (item) => (item as CatalogItem).titleEn || "-" },
          { key: "categoryEn", label: "Category (EN)", render: (item) => (item as CatalogItem).categoryEn || "-" },
          { key: "sortOrder", label: "Order" },
          {
            key: "showOverlay", label: "Overlay",
            render: (item) => (item as CatalogItem).showOverlay ? "Yes" : "No",
          },
        ]}
        data={items}
        loading={loading}
        onEdit={(item) => {
          const c = item as CatalogItem
          setModal({
            item: c,
            titleEn: c.titleEn || "", titleAr: c.titleAr || "",
            categoryEn: c.categoryEn || "", categoryAr: c.categoryAr || "",
            imageUrl: c.imageUrl, showOverlay: c.showOverlay, sortOrder: c.sortOrder,
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
                {modal.item ? "Edit Catalog Item" : "New Catalog Item"}
              </h3>
              <button onClick={() => setModal(null)} className="text-[#e8e2d6]/40 hover:text-[#e8e2d6]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InputField label="Title (EN)" value={modal.titleEn} onChange={(v) => setModal({ ...modal, titleEn: v })} />
                <InputField label="Title (AR)" value={modal.titleAr} onChange={(v) => setModal({ ...modal, titleAr: v })} />
                <InputField label="Category (EN)" value={modal.categoryEn} onChange={(v) => setModal({ ...modal, categoryEn: v })} />
                <InputField label="Category (AR)" value={modal.categoryAr} onChange={(v) => setModal({ ...modal, categoryAr: v })} />
                <InputField label="Sort Order" type="number" value={String(modal.sortOrder)} onChange={(v) => setModal({ ...modal, sortOrder: parseInt(v) || 0 })} />
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="showOverlay"
                    checked={modal.showOverlay}
                    onChange={(e) => setModal({ ...modal, showOverlay: e.target.checked })}
                    className="h-4 w-4 rounded border-[#e8e2d6]/10 bg-[#0d0d0b] text-[#c9a35c] focus:ring-[#c9a35c]"
                  />
                  <label htmlFor="showOverlay" className="text-sm text-[#e8e2d6]/80">Show Overlay</label>
                </div>
              </div>
              <ImageUploader label="Catalog Image" currentImage={modal.imageUrl} onUpload={handleImageUpload} />

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
