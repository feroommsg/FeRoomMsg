"use client"

import { useState, useEffect } from "react"
import { getAllProjects, createProject, updateProject, deleteProject, toggleFeatured } from "@/actions"
import { uploadMedia } from "@/actions/media"
import ImageUploader from "@/components/ImageUploader"
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
  imageUrl: string
  isFeatured: boolean
  sortOrder: number
}

const emptyForm = {
  titleEn: "", titleAr: "", categoryEn: "", categoryAr: "",
  locationEn: "", locationAr: "", year: "", size: "",
  summaryEn: "", summaryAr: "", imageUrl: "", isFeatured: false, sortOrder: 0,
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: Project } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)

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
    const data = {
      titleEn: modal.titleEn, titleAr: modal.titleAr,
      categoryEn: modal.categoryEn, categoryAr: modal.categoryAr,
      locationEn: modal.locationEn, locationAr: modal.locationAr,
      year: modal.year, size: modal.size,
      summaryEn: modal.summaryEn, summaryAr: modal.summaryAr,
      imageUrl: modal.imageUrl, isFeatured: modal.isFeatured, sortOrder: modal.sortOrder,
    }
    if (modal.item) {
      await updateProject(modal.item.id, data)
    } else {
      await createProject(data as any)
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
    const res = await uploadMedia(base64, "project")
    if (res.success) {
      const asset = res.data as { url: string }
      setModal((m) => m ? { ...m, imageUrl: asset.url } : null)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Projects</h1>

      <AdminTable
        columns={[
          { key: "titleEn", label: "Title (EN)" },
          { key: "categoryEn", label: "Category" },
          { key: "year", label: "Year" },
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
        onEdit={(item) => {
          const p = item as Project
          setModal({ item: p, ...p })
        }}
        onDelete={handleDelete}
        onCreate={() => setModal({ ...emptyForm, sortOrder: projects.length })}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#e8e2d6]">
                {modal.item ? "Edit Project" : "New Project"}
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
              <ImageUploader label="Project Image" currentImage={modal.imageUrl} onUpload={handleImageUpload} />

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
