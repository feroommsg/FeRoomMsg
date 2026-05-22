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

export async function getActivePartners() {
  try {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })
    return success(partners)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch partners")
  }
}

export async function getAllPartners() {
  try {
    await requireAuth()
    const partners = await prisma.partner.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return success(partners)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch partners")
  }
}

export async function createPartner(data: {
  nameEn: string
  nameAr: string
  logoUrl?: string
  type?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const partner = await prisma.partner.create({ data })
    return success(partner)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to create partner")
  }
}

export async function updatePartner(id: string, data: {
  nameEn?: string
  nameAr?: string
  logoUrl?: string
  type?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const partner = await prisma.partner.update({ where: { id }, data })
    return success(partner)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update partner")
  }
}

export async function deletePartner(id: string) {
  try {
    await requireAuth()
    await prisma.partner.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete partner")
  }
}

export async function reorderPartners(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.partner.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder partners")
  }
}
