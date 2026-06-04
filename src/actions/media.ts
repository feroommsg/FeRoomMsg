"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { uploadImage, uploadFile } from "@/lib/cloudinary"
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

    let mimeType: string
    let rawBase64: string

    const imageMatch = base64.match(/^data:(image\/(\w+));base64,(.+)$/)
    const pdfMatch = base64.match(/^data:(application\/pdf);base64,(.+)$/)

    if (imageMatch) {
      mimeType = imageMatch[1]
      rawBase64 = imageMatch[3]
      if (!validateImageType(mimeType)) {
        return error("Invalid image type. Allowed: jpeg, png, webp, gif, avif")
      }
    } else if (pdfMatch) {
      mimeType = pdfMatch[1]
      rawBase64 = pdfMatch[3]
    } else {
      return error("Invalid file data. Only images and PDFs are supported.")
    }

    const buffer = Buffer.from(rawBase64, "base64")
    if (!validateImageSize(buffer.length, mimeType === "application/pdf" ? 50 : 5)) {
      return error(mimeType === "application/pdf" ? "PDF size exceeds 50MB limit" : "Image size exceeds 5MB limit")
    }

    const isPdf = mimeType === "application/pdf"

    if (isPdf && !process.env.CLOUDINARY_CLOUD_NAME) {
      return error("Cloudinary is required for PDF uploads. Please configure CLOUDINARY_CLOUD_NAME.")
    }

    let url: string
    let publicId: string | null = null

    try {
      const result = isPdf ? await uploadFile(base64) : await uploadImage(base64)
      url = result.url
      publicId = result.publicId
    } catch (err) {
      if (isPdf) {
        return error(err instanceof Error ? err.message : "Failed to upload PDF to Cloudinary")
      }
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
      const { deleteImage, deleteFile } = await import("@/lib/cloudinary")
      try {
        await deleteImage(asset.publicId)
      } catch {
        await deleteFile(asset.publicId)
      }
    }
    await prisma.mediaAsset.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete media")
  }
}
