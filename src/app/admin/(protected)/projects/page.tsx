"use client"

import { useState, useEffect } from "react"
import { getAllProjects, createProject, updateProject, deleteProject, toggleFeatured } from "@/actions"
import MultiImageUploader, { type ImageEntry } from "@/components/MultiImageUploader"
import AdminTable from "@/components/AdminTable"
import { Loader2, X, Star } from "lucide-react"

interface Project {
  id: string
  titleEn: string
  titleAr: string
  categoryEn: string
  categoryAr: string
  locationEn: string
  locationAr: string
  year: string
  size: string
  summaryEn: string
  summaryAr: string
  images: ImageEntry[]
  isFeatured: boolean
  sortOrder: number
}

const emptyForm = {
  titleEn: "", titleAr: "", categoryEn: "", categoryAr: "",
  locationEn: "", locationAr: "", year: "", size: "",
  summaryEn: "", summaryAr: "", images: [] as ImageEntry[],
  isFeatured: false, sortOrder: 0,
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: Project } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

  const load = async () => {
    const res = await getAllProjects()
    if (res.success) setProjects((res.data as Project[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (item: Project) => {
    await deleteProject(item.id)
    load()
  }

  const handleToggle = async (item: Project) => {
    await toggleFeatured(item.id)
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
      titleEn: modal.titleEn, titleAr: modal.titleAr,
      categoryEn: modal.categoryEn, categoryAr: modal.categoryAr,
      locationEn: modal.locationEn, locationAr: modal.locationAr,
      year: modal.year, size: modal.size,
      summaryEn: modal.summaryEn, summaryAr: modal.summaryAr,
      images: imagesPayload,
      deletedImageIds,
      isFeatured: modal.isFeatured, sortOrder: modal.sortOrder,
    }

    if (modal.item) {
      await updateProject(modal.item.id, data as any)
    } else {
      await createProject(data as any)
    }

    setSaving(false)
    setDeletedImageIds([])
    setModal(null)
    load()
  }

  const openCreate = () => {
    setDeletedImageIds([])
    setModal({ ...emptyForm, sortOrder: projects.length })
  }

  const openEdit = (item: Project) => {
    setDeletedImageIds([])
    const p = item as Project
    setModal({
      item: p,
      titleEn: p.titleEn, titleAr: p.titleAr,
      categoryEn: p.categoryEn, categoryAr: p.categoryAr,
      locationEn: p.locationEn, locationAr: p.locationAr,
      year: p.year, size: p.size,
      summaryEn: p.summaryEn, summaryAr: p.summaryAr,
      images: (p.images || []).map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        altText: img.altText,
        sortOrder: img.sortOrder,
        isCover: img.isCover,
      })),
      isFeatured: p.isFeatured, sortOrder: p.sortOrder,
    })
  }

  const handleImagesChange = (images: ImageEntry[]) => {
    setModal((prev) => {
      if (!prev) return null
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
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Projects</h1>

      <AdminTable
        columns={[
          {
            key: "cover",
            label: "Cover",
            render: (item) => {
              const p = item as Project
              const cover = p.images?.find((img) => img.isCover) || p.images?.[0]
              return cover ? (
                <div className="h-10 w-10 overflow-hidden rounded">
                  <img src={cover.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <span className="text-xs text-[#e8e2d6]/30">—</span>
              )
            },
          },
          { key: "titleEn", label: "Title (EN)" },
          { key: "categoryEn", label: "Category" },
          { key: "year", label: "Year" },
          {
            key: "imagesCount",
            label: "Images",
            render: (item) => {
              const count = (item as Project).images?.length || 0
              return <span className="text-[#e8e2d6]/60">{count}</span>
            },
          },
          { key: "sortOrder", label: "Order" },
          {
            key: "isFeatured",
            label: "Featured",
            render: (item) => {
              const p = item as Project
              return (
                <button
                  onClick={() => handleToggle(p)}
                  className={`rounded p-1 transition-colors ${p.isFeatured ? "text-[#c9a35c]" : "text-[#e8e2d6]/20 hover:text-[#c9a35c]/50"}`}
                >
                  <Star size={16} fill={p.isFeatured ? "#c9a35c" : "none"} />
                </button>
              )
            },
          },
        ]}
        data={projects}
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
                {modal.item ? "Edit Project" : "New Project"}
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
                <InputField label="Location (EN)" value={modal.locationEn} onChange={(v) => setModal({ ...modal, locationEn: v })} />
                <InputField label="Location (AR)" value={modal.locationAr} onChange={(v) => setModal({ ...modal, locationAr: v })} />
                <InputField label="Year" value={modal.year} onChange={(v) => setModal({ ...modal, year: v })} />
                <InputField label="Size" value={modal.size} onChange={(v) => setModal({ ...modal, size: v })} />
                <InputField label="Sort Order" type="number" value={String(modal.sortOrder)} onChange={(v) => setModal({ ...modal, sortOrder: parseInt(v) || 0 })} />
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={modal.isFeatured}
                    onChange={(e) => setModal({ ...modal, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded border-[#e8e2d6]/10 bg-[#0d0d0b] text-[#c9a35c] focus:ring-[#c9a35c]"
                  />
                  <label htmlFor="isFeatured" className="text-sm text-[#e8e2d6]/80">Featured</label>
                </div>
              </div>
              <InputField label="Summary (EN)" value={modal.summaryEn} onChange={(v) => setModal({ ...modal, summaryEn: v })} />
              <InputField label="Summary (AR)" value={modal.summaryAr} onChange={(v) => setModal({ ...modal, summaryAr: v })} />
              <MultiImageUploader
                label="Project Images"
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