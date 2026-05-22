"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface AdminTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onCreate?: () => void
  loading?: boolean
}

export default function AdminTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  onCreate,
  loading = false,
}: AdminTableProps<T>) {
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div />
        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f]"
          >
            <Plus size={16} />
            Add New
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#c9a35c]" size={28} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#e8e2d6]/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e8e2d6]/10 bg-[#11110f]">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium text-[#e8e2d6]/60">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-4 py-3 font-medium text-[#e8e2d6]/60">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e2d6]/5">
              {data.map((item, i) => (
                <tr key={i} className="bg-[#0d0d0b] transition-colors hover:bg-[#11110f]">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[#e8e2d6]/80">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="flex gap-2 px-4 py-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="rounded p-1 text-[#e8e2d6]/40 transition-colors hover:text-[#c9a35c]"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setConfirmDelete(item)}
                          className="rounded p-1 text-[#e8e2d6]/40 transition-colors hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg bg-[#11110f] p-6 shadow-xl">
            <p className="text-sm text-[#e8e2d6]/80">Are you sure you want to delete this item?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-md border border-[#e8e2d6]/10 px-4 py-2 text-sm text-[#e8e2d6]/60 transition-colors hover:text-[#e8e2d6]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete?.(confirmDelete)
                  setConfirmDelete(null)
                }}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
