"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import { success, error, validateImageType, validateImageSize } from "@/lib/utils"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) throw new Error("Unauthorized")
  const payload = await verifyToken(token)
  if (!payload) throw new Error("Unauthorized")
  return payload
}

export async function uploadMedia(base64: string, filename: string) {
  try {
    await requireAuth()

    const matches = base64.match(/^data:(image\/(\w+));base64,(.+)$/)
    if (!matches) return error("Invalid base64 image data")

    const mimeType = matches[1]
    const rawBase64 = matches[3]

    if (!validateImageType(mimeType)) {
      return error("Invalid image type. Allowed: jpeg, png, webp, gif, avif")
    }

    const buffer = Buffer.from(rawBase64, "base64")
    if (!validateImageSize(buffer.length)) {
      return error("Image size exceeds 5MB limit")
    }

    let url: string
    let publicId: string | null = null

    // Try Cloudinary first, fall back to base64 if not configured
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await uploadImage(base64)
        url = result.url
        publicId = result.publicId
      } catch {
        url = base64
      }
    } else {
      url = base64
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        url,
        publicId,
        filename,
        mimeType,
        size: buffer.length,
      },
    })

    return success(asset)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to upload media")
  }
}

export async function getAllMedia() {
  try {
    await requireAuth()
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    })
    return success(assets)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch media")
  }
}

export async function deleteMedia(id: string) {
  try {
    await requireAuth()
    const asset = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!asset) return error("Media not found")
    if (asset.publicId) {
      const { deleteImage } = await import("@/lib/cloudinary")
      await deleteImage(asset.publicId)
    }
    await prisma.mediaAsset.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete media")
  }
}
