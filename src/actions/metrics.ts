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

export async function getActiveMetrics() {
  try {
    const metrics = await prisma.metric.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })
    return success(metrics)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch metrics")
  }
}

export async function getAllMetrics() {
  try {
    await requireAuth()
    const metrics = await prisma.metric.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return success(metrics)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch metrics")
  }
}

export async function createMetric(data: {
  value: string
  labelEn: string
  labelAr: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const metric = await prisma.metric.create({ data })
    return success(metric)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to create metric")
  }
}

export async function updateMetric(id: string, data: {
  value?: string
  labelEn?: string
  labelAr?: string
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()
    const metric = await prisma.metric.update({ where: { id }, data })
    return success(metric)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update metric")
  }
}

export async function deleteMetric(id: string) {
  try {
    await requireAuth()
    await prisma.metric.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete metric")
  }
}

export async function reorderMetrics(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.metric.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder metrics")
  }
}
