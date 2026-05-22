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

export async function getSeoSettings() {
  try {
    const seo = await prisma.seoSettings.findFirst()
    return success(seo)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch SEO settings")
  }
}

export async function updateSeoSettings(data: {
  titleEn?: string
  titleAr?: string
  descriptionEn?: string
  descriptionAr?: string
  ogImageUrl?: string
  keywordsEn?: string
  keywordsAr?: string
}) {
  try {
    await requireAuth()
    const seo = await prisma.seoSettings.findFirst()
    if (!seo) return error("SEO settings not found")
    const updated = await prisma.seoSettings.update({
      where: { id: seo.id },
      data,
    })
    return success(updated)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update SEO settings")
  }
}
