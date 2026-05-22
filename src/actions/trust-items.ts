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

export async function getActiveTrustItems() {
  try {
    const items = await prisma.trustItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })
    return success(items)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch trust items")
  }
}

export async function getAllTrustItems() {
  try {
    await requireAuth()
    const items = await prisma.trustItem.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return success(items)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch trust items")
  }
}

export async function createTrustItem(data: {
  labelEn: string
  labelAr: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const item = await prisma.trustItem.create({ data })
    return success(item)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to create trust item")
  }
}

export async function updateTrustItem(id: string, data: {
  labelEn?: string
  labelAr?: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const item = await prisma.trustItem.update({ where: { id }, data })
    return success(item)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update trust item")
  }
}

export async function deleteTrustItem(id: string) {
  try {
    await requireAuth()
    await prisma.trustItem.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete trust item")
  }
}

export async function reorderTrustItems(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.trustItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder trust items")
  }
}
