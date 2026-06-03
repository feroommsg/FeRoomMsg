"use client"

import { useRef, useState } from "react"
import { FileText, X, Loader2, Download } from "lucide-react"

interface PdfUploaderProps {
  onUpload: (base64: string) => void | Promise<void>
  currentPdf?: string
  label?: string
}

export default function PdfUploader({ onUpload, currentPdf, label }: PdfUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File exceeds 20MB limit.")
      return
    }
    setLoading(true)
    setPdfName(file.name)
    try {
      const base64 = await fileToBase64(file)
      await onUpload(base64)
    } catch {
      setError("Failed to read file.")
    } finally {
      setLoading(false)
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
  }

  const clearPdf = () => {
    setPdfName(null)
    onUpload("")
  }

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">{label}</label>}

      {currentPdf || pdfName ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a35c]/10">
            <FileText className="h-5 w-5 text-[#c9a35c]" />
          </div>
          <div className="flex-1 truncate text-sm text-[#e8e2d6]/80">
            {pdfName || "PDF file attached"}
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
      ) : null}

      {!currentPdf && !pdfName && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e8e2d6]/20 bg-[#11110f] p-6 transition-colors hover:border-[#c9a35c]/50"
        >
          {loading ? (
            <Loader2 className="animate-spin text-[#c9a35c]" size={28} />
          ) : (
            <>
              <FileText className="mb-2 text-[#e8e2d6]/30" size={24} />
              <p className="text-sm text-[#e8e2d6]/50">Click or drop a PDF file (max 20MB)</p>
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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}
