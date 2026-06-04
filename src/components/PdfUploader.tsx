"use client"

import { useRef, useState } from "react"
import { FileText, X, Loader2, Download } from "lucide-react"

export interface PdfFileInfo {
  base64: string
  name: string
  size: number
}

interface PdfUploaderProps {
  onUpload: (info: PdfFileInfo) => void | Promise<void>
  onRemove?: () => void
  currentPdf?: string
  currentPdfName?: string
  currentPdfSize?: number
  label?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PdfUploader({ onUpload, onRemove, currentPdf, currentPdfName, currentPdfSize, label }: PdfUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [pdfSize, setPdfSize] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit.")
      return
    }
    setLoading(true)
    setProgress(0)
    setPdfName(file.name)
    setPdfSize(file.size)
    try {
      const base64 = await fileToBase64(file, (p) => setProgress(p))
      await onUpload({ base64, name: file.name, size: file.size })
    } catch {
      setError("Failed to read file.")
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  const clearPdf = () => {
    setPdfName(null)
    setPdfSize(0)
    onRemove?.()
  }

  const displayName = pdfName || currentPdfName
  const displaySize = pdfSize || currentPdfSize || 0

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>}

      {(currentPdf || pdfName) ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a35c]/10">
            <FileText className="h-5 w-5 text-[#c9a35c]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm text-[#e8e2d6]/80">{displayName || "PDF file"}</p>
            {displaySize > 0 && (
              <p className="text-xs text-[#e8e2d6]/40">{formatSize(displaySize)}</p>
            )}
          </div>
          {currentPdf && (
            <a
              href={currentPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-1.5 text-[#e8e2d6]/40 hover:text-[#c9a35c]"
              title="View PDF"
            >
              <Download size={16} />
            </a>
          )}
          <button
            type="button"
            onClick={clearPdf}
            className="rounded p-1.5 text-[#e8e2d6]/40 hover:text-red-400"
            title="Remove PDF"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e8e2d6]/20 bg-[#11110f] p-6 transition-colors hover:border-[#c9a35c]/50"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-[#c9a35c]" size={28} />
              {progress > 0 && (
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#e8e2d6]/10">
                  <div className="h-full rounded-full bg-[#c9a35c] transition-all" style={{ width: `${progress}%` }} />
                </div>
              )}
              <p className="text-xs text-[#e8e2d6]/40">Reading file...</p>
            </div>
          ) : (
            <>
              <FileText className="mb-2 text-[#e8e2d6]/30" size={24} />
              <p className="text-sm text-[#e8e2d6]/50">Click or drop a PDF file (max 50MB)</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

async function fileToBase64(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    if (onProgress) {
      reader.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    reader.readAsDataURL(file)
  })
}
