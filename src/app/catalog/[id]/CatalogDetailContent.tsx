"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/lang-context"
import PageShell from "@/components/PageShell"

interface CatalogDetailContentProps {
  item: Record<string, any>
}

export default function CatalogDetailContent({ item }: CatalogDetailContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const title = isAr ? item.titleAr : item.titleEn
  const category = isAr ? item.categoryAr : item.categoryEn
  const images = item.images || []

  return (
    <PageShell
      label={category || (isAr ? "الكتالوج" : "Catalog")}
      title={title || ""}
      text=""
      lang={lang}
    >
      <div className="mb-6">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-[#e8e2d6]/50 transition-colors hover:text-[#c9a35c]"
        >
          <ArrowLeft size={16} className={isAr ? "rotate-180" : ""} />
          {isAr ? "العودة إلى الكتالوج" : "Back to Catalog"}
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg bg-[#11110f] py-24">
          <p className="text-[#e8e2d6]/30">{isAr ? "لا توجد صور" : "No images available"}</p>
        </div>
      ) : (
        <div className="grid auto-rows-[250px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img: any, index: number) => (
            <button
              key={img.id || index}
              onClick={() => setLightboxIndex(index)}
              className={`group relative overflow-hidden rounded-lg ${
                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || title || `Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={img.imageUrl?.startsWith("data:")}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
                }}
                className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
                }}
                className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].imageUrl}
              alt={images[lightboxIndex].altText || title || `Image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              priority
              unoptimized={images[lightboxIndex].imageUrl?.startsWith("data:")}
            />
          </div>

          <div className="absolute bottom-6 text-sm text-white/60">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </PageShell>
  )
}