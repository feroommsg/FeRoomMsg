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

export async function getActiveCapabilities() {
  try {
    const capabilities = await prisma.capability.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })
    return success(capabilities)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch capabilities")
  }
}

export async function getAllCapabilities() {
  try {
    await requireAuth()
    const capabilities = await prisma.capability.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return success(capabilities)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch capabilities")
  }
}

export async function createCapability(data: {
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const capability = await prisma.capability.create({ data })
    return success(capability)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to create capability")
  }
}

export async function updateCapability(id: string, data: {
  titleEn?: string
  titleAr?: string
  descriptionEn?: string
  descriptionAr?: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const capability = await prisma.capability.update({ where: { id }, data })
    return success(capability)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update capability")
  }
}

export async function deleteCapability(id: string) {
  try {
    await requireAuth()
    await prisma.capability.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete capability")
  }
}

export async function reorderCapabilities(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.capability.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder capabilities")
  }
}
