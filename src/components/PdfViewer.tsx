"use client"

import { useState } from "react"
import { X, Download, ZoomIn, ZoomOut, Maximize } from "lucide-react"

interface PdfViewerProps {
  url: string
  title: string
  onClose: () => void
}

export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  const [zoom, setZoom] = useState(100)

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/95"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex items-center justify-between border-b border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-3">
        <div className="flex items-center gap-3">
          <h3 className="truncate text-sm font-semibold text-[#e8e2d6] max-w-[300px]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="rounded p-1.5 text-[#e8e2d6]/50 hover:text-[#c9a35c] disabled:opacity-30"
            title="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="min-w-[48px] text-center text-xs font-medium text-[#e8e2d6]/60">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="rounded p-1.5 text-[#e8e2d6]/50 hover:text-[#c9a35c] disabled:opacity-30"
            title="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="rounded p-1.5 text-[#e8e2d6]/50 hover:text-[#c9a35c]"
            title="Reset zoom"
          >
            <Maximize size={18} />
          </button>
          <div className="mx-2 h-5 w-px bg-[#e8e2d6]/10" />
          <a
            href={url}
            download
            className="rounded p-1.5 text-[#e8e2d6]/50 hover:text-[#c9a35c]"
            title="Download PDF"
          >
            <Download size={18} />
          </a>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-[#e8e2d6]/50 hover:text-red-400"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-auto p-4">
        <div
          className="origin-top"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            width: zoom > 100 ? `${zoom}%` : "100%",
            maxWidth: zoom > 100 ? `${100 * (100 / zoom)}%` : "100%",
          }}
        >
          <iframe
            src={url}
            className="h-[85vh] w-full rounded-lg border border-[#e8e2d6]/10 bg-white"
            title={title}
          />
        </div>
      </div>
    </div>
  )
}
