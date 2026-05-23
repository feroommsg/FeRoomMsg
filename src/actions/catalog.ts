"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { success, error } from "@/lib/utils"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) throw new Error("Unauthorized")
  const payload = await verifyToken(token)
  if (!payload) throw new Error("Unauthorized")
  return payload
}

export async function getActiveCatalogItems() {
  try {
    const items = await prisma.catalogItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    return success(items)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch catalog items")
  }
}

export async function getAllCatalogItems() {
  try {
    await requireAuth()
    const items = await prisma.catalogItem.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    return success(items)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch catalog items")
  }
}

export async function createCatalogItem(data: {
  titleEn?: string
  titleAr?: string
  categoryEn?: string
  categoryAr?: string
  images?: { imageUrl: string; isCover?: boolean; sortOrder?: number }[]
}) {
  try {
    await requireAuth()

    let coverUrl: string | undefined
    const imageData = (data.images || []).map((img, i) => {
      if (img.isCover || (!coverUrl && i === 0)) {
        coverUrl = img.imageUrl
      }
      return {
        imageUrl: img.imageUrl,
        isCover: img.isCover ?? (i === 0),
        sortOrder: img.sortOrder ?? i,
      }
    })

    const item = await prisma.catalogItem.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        imageUrl: coverUrl,
        showOverlay: true,
        images: {
          create: imageData,
        },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    })

    return success(item)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    console.error("createCatalogItem error:", err)
    return error(err instanceof Error ? err.message : "Failed to create catalog item")
  }
}

export async function updateCatalogItem(id: string, data: {
  titleEn?: string
  titleAr?: string
  categoryEn?: string
  categoryAr?: string
  images?: { imageUrl: string; isCover?: boolean; sortOrder?: number }[]
  imageIdsToDelete?: string[]
}) {
  try {
    await requireAuth()

    const existing = await prisma.catalogItem.findUnique({
      where: { id },
      include: { images: true },
    })
    if (!existing) return error("Catalog item not found")

    if (data.imageIdsToDelete?.length) {
      await prisma.catalogImage.deleteMany({
        where: { id: { in: data.imageIdsToDelete } },
      })
    }

    let coverUrl: string | undefined
    const imageData = (data.images || []).map((img, i) => ({
      imageUrl: img.imageUrl,
      isCover: img.isCover ?? (i === 0),
      sortOrder: img.sortOrder ?? i,
    }))
    for (const img of imageData) {
      if (img.isCover) coverUrl = img.imageUrl
    }
    if (!coverUrl && imageData.length > 0) coverUrl = imageData[0].imageUrl

    const remainingImages = await prisma.catalogImage.findMany({ where: { catalogItemId: id } })
    if (!coverUrl && remainingImages.length > 0) {
      coverUrl = remainingImages[0].imageUrl
    }

    if (imageData.length > 0) {
      await prisma.catalogImage.createMany({
        data: imageData.map((img) => ({
          catalogItemId: id,
          imageUrl: img.imageUrl,
          isCover: img.isCover,
          sortOrder: img.sortOrder,
        })),
      })
    }

    const allImages = await prisma.catalogImage.findMany({
      where: { catalogItemId: id },
      orderBy: { sortOrder: "asc" },
    })
    if (allImages.length > 0 && !allImages.some((i) => i.isCover)) {
      await prisma.catalogImage.update({
        where: { id: allImages[0].id },
        data: { isCover: true },
      })
    }

    const updatedItem = await prisma.catalogItem.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        imageUrl: coverUrl,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    })

    return success(updatedItem)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    console.error("updateCatalogItem error:", err)
    return error(err instanceof Error ? err.message : "Failed to update catalog item")
  }
}

export async function getCatalogItemById(id: string) {
  try {
    const item = await prisma.catalogItem.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    if (!item) return error("Catalog item not found")
    return success(item)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch catalog item")
  }
}

export async function deleteCatalogItem(id: string) {
  try {
    await requireAuth()
    await prisma.catalogItem.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete catalog item")
  }
}

export async function deleteCatalogImage(id: string) {
  try {
    await requireAuth()
    await prisma.catalogImage.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete catalog image")
  }
}

export async function reorderCatalogItems(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.catalogItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder catalog items")
  }
}
