"use client"

import { useState, useEffect, useRef } from "react"
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
  imageUrl: string | null
  isFeatured: boolean
  sortOrder: number
}

const emptyForm = {
  titleEn: "", titleAr: "", categoryEn: "", categoryAr: "",
  locationEn: "", locationAr: "", year: "", size: "",
  summaryEn: "", summaryAr: "", imageUrl: "",
  isFeatured: false, sortOrder: 0,
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ item?: Project } & typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const imageRef = useRef<string>("")

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
    setSaveError(null)

    let imageUrl = imageRef.current
    if (imageUrl && imageUrl.startsWith("data:")) {
      const res = await uploadMedia(imageUrl, "project")
      if (res.success) {
        imageUrl = (res.data as { url: string }).url
      }
    }

    const data = {
      titleEn: modal.titleEn, titleAr: modal.titleAr,
      categoryEn: modal.categoryEn, categoryAr: modal.categoryAr,
      locationEn: modal.locationEn, locationAr: modal.locationAr,
      year: modal.year, size: modal.size,
      summaryEn: modal.summaryEn, summaryAr: modal.summaryAr,
      imageUrl: imageUrl || modal.imageUrl || undefined,
      isFeatured: modal.isFeatured, sortOrder: modal.sortOrder,
    }

    let res
    if (modal.item) {
      res = await updateProject(modal.item.id, data as any)
    } else {
      res = await createProject(data as any)
    }

    if (!res.success) {
      setSaveError(res.error || "Save failed")
      setSaving(false)
      return
    }

    imageRef.current = ""
    setSaving(false)
    setModal(null)
    load()
  }

  const handleImageUpload = async (base64: string) => {
    setUploadError(null)
    if (!base64) {
      imageRef.current = ""
      setModal((m) => m ? { ...m, imageUrl: "" } : null)
      return
    }
    imageRef.current = base64
    setModal((m) => m ? { ...m, imageUrl: base64 } : null)
    const res = await uploadMedia(base64, "project")
    if (res.success) {
      const url = (res.data as { url: string }).url
      imageRef.current = url
      setModal((m) => m ? { ...m, imageUrl: url } : null)
    } else {
      setUploadError(res.error || "Upload failed")
    }
  }

  const openCreate = () => {
    imageRef.current = ""
    setModal({ ...emptyForm, sortOrder: projects.length })
  }

  const openEdit = (item: Project) => {
    imageRef.current = item.imageUrl || ""
    setModal({
      item,
      titleEn: item.titleEn, titleAr: item.titleAr,
      categoryEn: item.categoryEn, categoryAr: item.categoryAr,
      locationEn: item.locationEn, locationAr: item.locationAr,
      year: item.year, size: item.size,
      summaryEn: item.summaryEn, summaryAr: item.summaryAr,
      imageUrl: item.imageUrl || "",
      isFeatured: item.isFeatured, sortOrder: item.sortOrder,
    })
  }

  const closeModal = () => {
    imageRef.current = ""
    setModal(null)
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Projects</h1>

      <AdminTable
        columns={[
          {
            key: "imageUrl",
            label: "Image",
            render: (item) => {
              const p = item as Project
              return p.imageUrl ? (
                <div className="h-10 w-10 overflow-hidden rounded">
                  <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <span className="text-xs text-[#e8e2d6]/30">—</span>
              )
            },
          },
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
              <button onClick={closeModal} className="text-[#e8e2d6]/40 hover:text-[#e8e2d6]">
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

              {uploadError && (
                <p className="text-xs text-red-400">{uploadError}</p>
              )}
              <ImageUploader label="Project Image" currentImage={modal.imageUrl} onUpload={handleImageUpload} />

              {saveError && (
                <p className="text-sm text-red-400">{saveError}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={closeModal} className="rounded-md border border-[#e8e2d6]/10 px-4 py-2 text-sm text-[#e8e2d6]/60 hover:text-[#e8e2d6]">
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
