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

export async function getContactInfo() {
  try {
    const info = await prisma.contactInfo.findFirst()
    return success(info)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch contact info")
  }
}

export async function updateContactInfo(data: {
  phone?: string
  email?: string
  locationEn?: string
  locationAr?: string
  addressEn?: string
  addressAr?: string
  mapEmbed?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
}) {
  try {
    await requireAuth()
    const info = await prisma.contactInfo.findFirst()
    if (!info) return error("Contact info not found")
    const updated = await prisma.contactInfo.update({
      where: { id: info.id },
      data,
    })
    return success(updated)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to update contact info")
  }
}
