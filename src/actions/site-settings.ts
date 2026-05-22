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

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findFirst()
    return success(settings)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch settings")
  }
}

export async function updateSiteSettings(data: {
  brandNameEn?: string
  brandNameAr?: string
  brandSmallEn?: string
  brandSmallAr?: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  bgColor?: string
  sectionBgColor?: string
  textColor?: string
}) {
  try {
    await requireAuth()
    const settings = await prisma.siteSetting.findFirst()
    if (!settings) return error("Settings not found")
    const updated = await prisma.siteSetting.update({
      where: { id: settings.id },
      data,
    })
    return success(updated)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update settings")
  }
}
