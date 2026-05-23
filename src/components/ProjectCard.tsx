"use client"

import Image from "next/image"
import { MapPin, Ruler } from "lucide-react"

interface Project {
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
  images: {
    imageUrl: string
    altText?: string
    sortOrder: number
    isCover: boolean
  }[]
}

interface ProjectCardProps {
  project: Project
  lang: string
  index: number
}

export default function ProjectCard({ project, lang, index }: ProjectCardProps) {
  const isAr = lang === "ar"
  const isReversed = index % 2 !== 0

  const title = isAr ? project.titleAr : project.titleEn
  const category = isAr ? project.categoryAr : project.categoryEn
  const location = isAr ? project.locationAr : project.locationEn
  const summary = isAr ? project.summaryAr : project.summaryEn

  const coverImage = project.images?.find(img => img.isCover) || project.images?.[0]
  const imageUrl = coverImage?.imageUrl || ""

  return (
    <div
      className={`flex flex-col gap-6 md:flex-row ${isReversed ? "md-flex-row-reverse" : ""}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg md:w-1/2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#11110f]/50">
            <span className="text-[#e8e2d6]/50">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute right-4 top-4 rounded-full bg-[#c9a35c] px-3 py-1 text-xs font-semibold text-[#0d0d0b]">
          {category}
        </span>
      </div>

      <div className="flex w-full flex-col justify-center md:w-1/2">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#c9a35c]">
          {project.year}
        </span>
        <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#e8e2d6]/60">{summary}</p>
        <div className={`mt-4 flex gap-4 text-xs text-[#e8e2d6]/40 ${isAr ? "flex-row-reverse" : ""}`}>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={14} />
            {project.size}
          </span>
        </div>
      </div>
    </div>
  )
}