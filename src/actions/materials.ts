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

export async function getActiveMaterials() {
  try {
    const materials = await prisma.material.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })
    return success(materials)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch materials")
  }
}

export async function getAllMaterials() {
  try {
    await requireAuth()
    const materials = await prisma.material.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return success(materials)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch materials")
  }
}

export async function createMaterial(data: {
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  applicationsEn: string
  applicationsAr: string
  imageUrl: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const material = await prisma.material.create({ data })
    return success(material)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to create material")
  }
}

export async function updateMaterial(id: string, data: {
  nameEn?: string
  nameAr?: string
  descriptionEn?: string
  descriptionAr?: string
  applicationsEn?: string
  applicationsAr?: string
  imageUrl?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const material = await prisma.material.update({ where: { id }, data })
    return success(material)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update material")
  }
}

export async function deleteMaterial(id: string) {
  try {
    await requireAuth()
    await prisma.material.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete material")
  }
}

export async function reorderMaterials(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.material.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder materials")
  }
}
