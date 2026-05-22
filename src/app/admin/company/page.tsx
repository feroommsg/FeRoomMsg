"use client"

import { useState, useEffect } from "react"
import {
  getAllTrustItems,
  createTrustItem,
  updateTrustItem,
  deleteTrustItem,
  getAllMetrics,
  createMetric,
  updateMetric,
  deleteMetric,
} from "@/actions"
import AdminTable from "@/components/AdminTable"
import { Save, Loader2, X } from "lucide-react"

interface TrustItem {
  id: string
  labelEn: string
  labelAr: string
  sortOrder: number
}

interface Metric {
  id: string
  value: string
  labelEn: string
  labelAr: string
  sortOrder: number
}

export default function AdminCompanyPage() {
  const [trustItems, setTrustItems] = useState<TrustItem[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [trustModal, setTrustModal] = useState<{ item?: TrustItem; labelEn: string; labelAr: string; sortOrder: number } | null>(null)
  const [metricModal, setMetricModal] = useState<{ item?: Metric; value: string; labelEn: string; labelAr: string; sortOrder: number } | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [tRes, mRes] = await Promise.all([getAllTrustItems(), getAllMetrics()])
    if (tRes.success) setTrustItems((tRes.data as TrustItem[]) ?? [])
    if (mRes.success) setMetrics((mRes.data as Metric[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDeleteTrust = async (item: TrustItem) => {
    await deleteTrustItem(item.id)
    load()
  }

  const handleDeleteMetric = async (item: Metric) => {
    await deleteMetric(item.id)
    load()
  }

  const handleSaveTrust = async () => {
    if (!trustModal) return
    setSaving(true)
    if (trustModal.item) {
      await updateTrustItem(trustModal.item.id, {
        labelEn: trustModal.labelEn,
        labelAr: trustModal.labelAr,
        sortOrder: trustModal.sortOrder,
      })
    } else {
      await createTrustItem({
        labelEn: trustModal.labelEn,
        labelAr: trustModal.labelAr,
        sortOrder: trustModal.sortOrder,
      })
    }
    setSaving(false)
    setTrustModal(null)
    load()
  }

  const handleSaveMetric = async () => {
    if (!metricModal) return
    setSaving(true)
    if (metricModal.item) {
      await updateMetric(metricModal.item.id, {
        value: metricModal.value,
        labelEn: metricModal.labelEn,
        labelAr: metricModal.labelAr,
        sortOrder: metricModal.sortOrder,
      })
    } else {
      await createMetric({
        value: metricModal.value,
        labelEn: metricModal.labelEn,
        labelAr: metricModal.labelAr,
        sortOrder: metricModal.sortOrder,
      })
    }
    setSaving(false)
    setMetricModal(null)
    load()
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#e8e2d6]">Company</h1>

      <SectionCard title="Trust Items">
        <AdminTable
          columns={[
            { key: "labelEn", label: "Label (EN)" },
            { key: "labelAr", label: "Label (AR)" },
            { key: "sortOrder", label: "Order" },
          ]}
          data={trustItems}
          loading={loading}
          onEdit={(item) => setTrustModal({ item: item as TrustItem, labelEn: (item as TrustItem).labelEn, labelAr: (item as TrustItem).labelAr, sortOrder: (item as TrustItem).sortOrder })}
          onDelete={handleDeleteTrust}
          onCreate={() => setTrustModal({ labelEn: "", labelAr: "", sortOrder: trustItems.length })}
        />
      </SectionCard>

      <div className="mb-8" />

      <SectionCard title="Metrics">
        <AdminTable
          columns={[
            { key: "value", label: "Value" },
            { key: "labelEn", label: "Label (EN)" },
            { key: "labelAr", label: "Label (AR)" },
            { key: "sortOrder", label: "Order" },
          ]}
          data={metrics}
          loading={loading}
          onEdit={(item) => setMetricModal({ item: item as Metric, value: (item as Metric).value, labelEn: (item as Metric).labelEn, labelAr: (item as Metric).labelAr, sortOrder: (item as Metric).sortOrder })}
          onDelete={handleDeleteMetric}
          onCreate={() => setMetricModal({ value: "", labelEn: "", labelAr: "", sortOrder: metrics.length })}
        />
      </SectionCard>

      {trustModal && (
        <Modal title={trustModal.item ? "Edit Trust Item" : "New Trust Item"} onClose={() => setTrustModal(null)}>
          <div className="space-y-4">
            <InputField label="Label (EN)" value={trustModal.labelEn} onChange={(v) => setTrustModal({ ...trustModal, labelEn: v })} />
            <InputField label="Label (AR)" value={trustModal.labelAr} onChange={(v) => setTrustModal({ ...trustModal, labelAr: v })} />
            <InputField label="Sort Order" type="number" value={String(trustModal.sortOrder)} onChange={(v) => setTrustModal({ ...trustModal, sortOrder: parseInt(v) || 0 })} />
            <button onClick={handleSaveTrust} disabled={saving} className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
              {saving && <Loader2 className="animate-spin" size={14} />}
              Save
            </button>
          </div>
        </Modal>
      )}

      {metricModal && (
        <Modal title={metricModal.item ? "Edit Metric" : "New Metric"} onClose={() => setMetricModal(null)}>
          <div className="space-y-4">
            <InputField label="Value" value={metricModal.value} onChange={(v) => setMetricModal({ ...metricModal, value: v })} />
            <InputField label="Label (EN)" value={metricModal.labelEn} onChange={(v) => setMetricModal({ ...metricModal, labelEn: v })} />
            <InputField label="Label (AR)" value={metricModal.labelAr} onChange={(v) => setMetricModal({ ...metricModal, labelAr: v })} />
            <InputField label="Sort Order" type="number" value={String(metricModal.sortOrder)} onChange={(v) => setMetricModal({ ...metricModal, sortOrder: parseInt(v) || 0 })} />
            <button onClick={handleSaveMetric} disabled={saving} className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] hover:bg-[#b8922f] disabled:opacity-60">
              {saving && <Loader2 className="animate-spin" size={14} />}
              Save
            </button>
          </div>
        </Modal>
      )}
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
