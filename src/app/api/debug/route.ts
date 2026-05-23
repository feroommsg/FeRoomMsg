import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const items = await prisma.catalogItem.findMany({
      include: { images: true },
      orderBy: { sortOrder: "asc" },
    })
    const projects = await prisma.project.findMany({
      include: { images: true },
      orderBy: { sortOrder: "asc" },
    })
    const partners = await prisma.partner.findMany()

    return NextResponse.json({
      catalogCount: items.length,
      catalogItems: items.map((i) => ({
        id: i.id,
        titleEn: i.titleEn,
        imageCount: i.images.length,
        images: i.images.map((img) => ({
          id: img.id,
          imageUrlLength: img.imageUrl?.length || 0,
          imageUrlPrefix: img.imageUrl?.substring(0, 50) || "",
          isCover: img.isCover,
        })),
      })),
      projectCount: projects.length,
      projects: projects.map((p) => ({
        id: p.id,
        titleEn: p.titleEn,
        imageCount: p.images.length,
        images: p.images.map((img) => ({
          id: img.id,
          imageUrlLength: img.imageUrl?.length || 0,
          imageUrlPrefix: img.imageUrl?.substring(0, 50) || "",
          isCover: img.isCover,
        })),
      })),
      partnerCount: partners.length,
      partners: partners.map((p) => ({
        id: p.id,
        nameEn: p.nameEn,
        hasLogoUrl: !!p.logoUrl,
        logoUrlPrefix: p.logoUrl?.substring(0, 50) || "",
      })),
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
