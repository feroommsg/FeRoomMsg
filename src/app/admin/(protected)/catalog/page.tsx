"use client"

import { useState, useEffect } from "react"
import { getAllCatalogItems, createCatalogItem, updateCatalogItem, deleteCatalogItem } from "@/actions"
import MultiImageUploader, { type ImageEntry } from "@/components/MultiImageUploader"
import AdminTable from "@/components/AdminTable"
import { Loader2, X } from "lucide-react"

interface CatalogItem {
  id: string
  titleEn: string | null
  titleAr: string | null
  categoryEn: string | null
  categoryAr: string | null
  images: ImageEntry[]
  showOverlay: boolean
  sortOrder: number
}

const emptyForm = {
  titleEn: "", titleAr: "", categoryEn: "", categoryAr: "",
  images: [] as ImageEntry[], showOverlay: true, sortOrder: 0,
}

export default function AdminCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: CatalogItem } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

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

    const imagesPayload = modal.images.map((img) => ({
      id: img.id,
      base64: img.base64,
      altText: img.altText,
      sortOrder: img.sortOrder,
      isCover: img.isCover,
    }))

    const data = {
      titleEn: modal.titleEn || undefined,
      titleAr: modal.titleAr || undefined,
      categoryEn: modal.categoryEn || undefined,
      categoryAr: modal.categoryAr || undefined,
      images: imagesPayload,
      deletedImageIds,
    }

    if (modal.item) {
      await updateCatalogItem(modal.item.id, data as any)
    } else {
      await createCatalogItem(data as any)
    }

    setSaving(false)
    setDeletedImageIds([])
    setModal(null)
    load()
  }

  const openCreate = () => {
    setDeletedImageIds([])
    setModal({ ...emptyForm, sortOrder: items.length })
  }

  const openEdit = (item: CatalogItem) => {
    setDeletedImageIds([])
    const c = item as CatalogItem
    setModal({
      item: c,
      titleEn: c.titleEn || "",
      titleAr: c.titleAr || "",
      categoryEn: c.categoryEn || "",
      categoryAr: c.categoryAr || "",
      images: (c.images || []).map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        altText: img.altText,
        sortOrder: img.sortOrder,
        isCover: img.isCover,
      })),
      showOverlay: c.showOverlay,
      sortOrder: c.sortOrder,
    })
  }

  const handleImagesChange = (images: ImageEntry[]) => {
    setModal((prev) => {
      if (!prev) return null
      // Detect removed existing images and track their IDs for deletion
      if (prev.images.length > images.length) {
        const removedIds = prev.images
          .filter((old) => old.id && !images.some((img) => img.id === old.id))
          .map((img) => img.id!)
        if (removedIds.length > 0) {
          setDeletedImageIds((prevIds) => [...prevIds, ...removedIds])
        }
      }
      return { ...prev, images }
    })
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Catalog</h1>

      <AdminTable
        columns={[
          {
            key: "cover",
            label: "Cover",
            render: (item) => {
              const c = item as CatalogItem
              const cover = c.images?.find((img) => img.isCover) || c.images?.[0]
              return cover ? (
                <div className="h-10 w-10 overflow-hidden rounded">
                  <img src={cover.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <span className="text-xs text-[#e8e2d6]/30">—</span>
              )
            },
          },
          { key: "titleEn", label: "Title (EN)", render: (item) => (item as CatalogItem).titleEn || "-" },
          { key: "categoryEn", label: "Category (EN)", render: (item) => (item as CatalogItem).categoryEn || "-" },
          {
            key: "imagesCount",
            label: "Images",
            render: (item) => {
              const count = (item as CatalogItem).images?.length || 0
              return <span className="text-[#e8e2d6]/60">{count}</span>
            },
          },
          { key: "sortOrder", label: "Order" },
        ]}
        data={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        onCreate={openCreate}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#e8e2d6]">
                {modal.item ? "Edit Catalog Item" : "New Catalog Item"}
              </h3>
              <button onClick={() => { setModal(null); setDeletedImageIds([]) }} className="text-[#e8e2d6]/40 hover:text-[#e8e2d6]">
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
              </div>
              <MultiImageUploader
                label="Images"
                images={modal.images}
                onChange={handleImagesChange}
              />

              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setModal(null); setDeletedImageIds([]) }} className="rounded-md border border-[#e8e2d6]/10 px-4 py-2 text-sm text-[#e8e2d6]/60 hover:text-[#e8e2d6]">
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