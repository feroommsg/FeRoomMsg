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
  imageUrl?: string
}) {
  try {
    await requireAuth()

    const item = await prisma.catalogItem.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        imageUrl: data.imageUrl,
        showOverlay: true,
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
  imageUrl?: string
}) {
  try {
    await requireAuth()

    const updatedItem = await prisma.catalogItem.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        imageUrl: data.imageUrl,
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
