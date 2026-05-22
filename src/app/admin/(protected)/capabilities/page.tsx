"use client"

import { useState, useEffect } from "react"
import {
  getAllCapabilities,
  createCapability,
  updateCapability,
  deleteCapability,
  getAllSectors,
  createSector,
  updateSector,
  deleteSector,
} from "@/actions"
import AdminTable from "@/components/AdminTable"
import { Loader2, X } from "lucide-react"

interface Capability {
  id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  icon: string
  sortOrder: number
}

interface Sector {
  id: string
  nameEn: string
  nameAr: string
  sortOrder: number
}

export default function AdminCapabilitiesPage() {
  const [caps, setCaps] = useState<Capability[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [capModal, setCapModal] = useState<{
    item?: Capability; titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string; icon: string; sortOrder: number
  } | null>(null)
  const [sectorModal, setSectorModal] = useState<{
    item?: Sector; nameEn: string; nameAr: string; sortOrder: number
  } | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [cRes, sRes] = await Promise.all([getAllCapabilities(), getAllSectors()])
    if (cRes.success) setCaps((cRes.data as Capability[]) ?? [])
    if (sRes.success) setSectors((sRes.data as Sector[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (fn: (id: string) => Promise<any>, id: string) => {
    await fn(id)
    load()
  }

  const saveCapability = async () => {
    if (!capModal) return
    setSaving(true)
    if (capModal.item) {
      await updateCapability(capModal.item.id, {
        titleEn: capModal.titleEn, titleAr: capModal.titleAr,
        descriptionEn: capModal.descriptionEn, descriptionAr: capModal.descriptionAr,
        icon: capModal.icon, sortOrder: capModal.sortOrder,
      })
    } else {
      await createCapability({
        titleEn: capModal.titleEn, titleAr: capModal.titleAr,
        descriptionEn: capModal.descriptionEn, descriptionAr: capModal.descriptionAr,
        icon: capModal.icon, sortOrder: capModal.sortOrder,
      })
    }
    setSaving(false)
    setCapModal(null)
    load()
  }

  const saveSector = async () => {
    if (!sectorModal) return
    setSaving(true)
    if (sectorModal.item) {
      await updateSector(sectorModal.item.id, { nameEn: sectorModal.nameEn, nameAr: sectorModal.nameAr, sortOrder: sectorModal.sortOrder })
    } else {
      await createSector({ nameEn: sectorModal.nameEn, nameAr: sectorModal.nameAr, sortOrder: sectorModal.sortOrder })
    }
    setSaving(false)
    setSectorModal(null)
    load()
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Capabilities & Sectors</h1>

      <SectionCard title="Capabilities">
        <AdminTable
          columns={[
            { key: "titleEn", label: "Title (EN)" },
            { key: "titleAr", label: "Title (AR)" },
            { key: "icon", label: "Icon" },
            { key: "sortOrder", label: "Order" },
          ]}
          data={caps}
          loading={loading}
          onEdit={(item) => {
            const c = item as Capability
            setCapModal({ item: c, titleEn: c.titleEn, titleAr: c.titleAr, descriptionEn: c.descriptionEn, descriptionAr: c.descriptionAr, icon: c.icon || "", sortOrder: c.sortOrder })
          }}
          onDelete={(item) => handleDelete(deleteCapability, (item as Capability).id)}
          onCreate={() => setCapModal({ titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", icon: "", sortOrder: caps.length })}
        />
      </SectionCard>

      <div className="mb-8" />

      <SectionCard title="Sectors">
        <AdminTable
          columns={[
            { key: "nameEn", label: "Name (EN)" },
            { key: "nameAr", label: "Name (AR)" },
            { key: "sortOrder", label: "Order" },
          ]}
          data={sectors}
          loading={loading}
          onEdit={(item) => {
            const s = item as Sector
            setSectorModal({ item: s, nameEn: s.nameEn, nameAr: s.nameAr, sortOrder: s.sortOrder })
          }}
          onDelete={(item) => handleDelete(deleteSector, (item as Sector).id)}
          onCreate={() => setSectorModal({ nameEn: "", nameAr: "", sortOrder: sectors.length })}
        />
      </SectionCard>

      {capModal && (
        <Modal title={capModal.item ? "Edit Capability" : "New Capability"} onClose={() => setCapModal(null)}>
          <div className="space-y-4">
            <InputField label="Title (EN)" value={capModal.titleEn} onChange={(v) => setCapModal({ ...capModal, titleEn: v })} />
            <InputField label="Title (AR)" value={capModal.titleAr} onChange={(v) => setCapModal({ ...capModal, titleAr: v })} />
            <InputField label="Description (EN)" value={capModal.descriptionEn} onChange={(v) => setCapModal({ ...capModal, descriptionEn: v })} />
            <InputField label="Description (AR)" value={capModal.descriptionAr} onChange={(v) => setCapModal({ ...capModal, descriptionAr: v })} />
            <InputField label="Icon" value={capModal.icon} onChange={(v) => setCapModal({ ...capModal, icon: v })} />
            <InputField label="Sort Order" type="number" value={String(capModal.sortOrder)} onChange={(v) => setCapModal({ ...capModal, sortOrder: parseInt(v) || 0 })} />
            <button onClick={saveCapability} disabled={saving} className="rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {sectorModal && (
        <Modal title={sectorModal.item ? "Edit Sector" : "New Sector"} onClose={() => setSectorModal(null)}>
          <div className="space-y-4">
            <InputField label="Name (EN)" value={sectorModal.nameEn} onChange={(v) => setSectorModal({ ...sectorModal, nameEn: v })} />
            <InputField label="Name (AR)" value={sectorModal.nameAr} onChange={(v) => setSectorModal({ ...sectorModal, nameAr: v })} />
            <InputField label="Sort Order" type="number" value={String(sectorModal.sortOrder)} onChange={(v) => setSectorModal({ ...sectorModal, sortOrder: parseInt(v) || 0 })} />
            <button onClick={saveSector} disabled={saving} className="rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#c9a35c]">{title}</h2>
      {children}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#e8e2d6]">{title}</h3>
          <button onClick={onClose} className="text-[#e8e2d6]/40 hover:text-[#e8e2d6]">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
