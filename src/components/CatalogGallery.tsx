"use client"

import Link from "next/link"

interface CatalogItem {
  id: string
  titleEn: string
  titleAr: string
  categoryEn: string
  categoryAr: string
  imageUrl: string
  showOverlay?: boolean
  images?: { id: string; imageUrl: string; isCover: boolean; sortOrder: number }[]
}

interface CatalogGalleryProps {
  items: CatalogItem[]
  lang: string
}

export default function CatalogGallery({ items, lang }: CatalogGalleryProps) {
  const isAr = lang === "ar"

  const getCoverUrl = (item: CatalogItem): string => {
    if (item.images && item.images.length > 0) {
      const cover = item.images.find((img) => img.isCover)
      return cover ? cover.imageUrl : item.images[0].imageUrl
    }
    return item.imageUrl
  }

  return (
    <div className={`grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4`} dir={isAr ? "rtl" : "ltr"}>
      {items.map((item, i) => {
        const title = isAr ? item.titleAr : item.titleEn
        const category = isAr ? item.categoryAr : item.categoryEn
        const coverUrl = getCoverUrl(item)

        const spans: string[] = []
        if (i % 5 === 0) spans.push("md:col-span-2 md:row-span-2")
        else if (i % 7 === 0) spans.push("md:col-span-2")
        else if (i % 11 === 0) spans.push("md:row-span-2")

        return (
          <Link
            key={item.id}
            href={`/catalog/${item.id}`}
            className={`group relative overflow-hidden rounded-lg ${spans.join(" ")}`}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#11110f]/50">
                <span className="text-sm text-[#e8e2d6]/30">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {item.showOverlay !== false && (
                <>
                  <span className="inline-block rounded-full bg-[#c9a35c] px-2 py-0.5 text-[10px] font-semibold text-[#0d0d0b]">
                    {category}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">{title}</p>
                </>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
