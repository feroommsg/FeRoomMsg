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

export async function getHomeContent() {
  try {
    const content = await prisma.homeContent.findFirst()
    return success(content)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch home content")
  }
}

export async function updateHomeContent(data: {
  heroBgImage?: string
  heroBadgeEn?: string
  heroBadgeAr?: string
  heroTitleEn?: string
  heroTitleAr?: string
  heroTextEn?: string
  heroTextAr?: string
  overviewTitleEn?: string
  overviewTitleAr?: string
  overviewTextEn?: string
  overviewTextAr?: string
  overviewText2En?: string
  overviewText2Ar?: string
}) {
  try {
    await requireAuth()
    const content = await prisma.homeContent.findFirst()
    if (!content) return error("Home content not found")
    const updated = await prisma.homeContent.update({
      where: { id: content.id },
      data,
    })
    return success(updated)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update home content")
  }
}
