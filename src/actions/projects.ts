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

export async function getActiveProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    return success(projects)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch projects")
  }
}

export async function getAllProjects() {
  try {
    await requireAuth()
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    return success(projects)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to fetch projects")
  }
}

export async function createProject(data: {
  titleEn: string
  titleAr: string
  categoryEn: string
  categoryAr: string
  locationEn: string
  locationAr: string
  year: string
  size: string
  summaryEn: string
  summaryAr: string
  imageUrl?: string
  isFeatured?: boolean
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()

    const project = await prisma.project.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        locationEn: data.locationEn,
        locationAr: data.locationAr,
        year: data.year,
        size: data.size,
        summaryEn: data.summaryEn,
        summaryAr: data.summaryAr,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured ?? false,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    })

    return success(project)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    console.error("createProject error:", err)
    return error(err instanceof Error ? err.message : "Failed to create project")
  }
}

export async function updateProject(id: string, data: {
  titleEn?: string
  titleAr?: string
  categoryEn?: string
  categoryAr?: string
  locationEn?: string
  locationAr?: string
  year?: string
  size?: string
  summaryEn?: string
  summaryAr?: string
  imageUrl?: string
  isFeatured?: boolean
  sortOrder?: number
  isActive?: boolean
}) {
  try {
    await requireAuth()

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        locationEn: data.locationEn,
        locationAr: data.locationAr,
        year: data.year,
        size: data.size,
        summaryEn: data.summaryEn,
        summaryAr: data.summaryAr,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    return success(updatedProject)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    console.error("updateProject error:", err)
    return error(err instanceof Error ? err.message : "Failed to update project")
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    if (!project) return error("Project not found")
    return success(project)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch project")
  }
}

export async function deleteProject(id: string) {
  try {
    await requireAuth()
    await prisma.project.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete project")
  }
}

export async function deleteProjectImage(id: string) {
  try {
    await requireAuth()
    await prisma.projectImage.delete({ where: { id } })
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to delete project image")
  }
}

export async function reorderProjects(items: { id: string; sortOrder: number }[]) {
  try {
    await requireAuth()
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    return success(null)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to reorder projects")
  }
}

export async function toggleFeatured(id: string) {
  try {
    await requireAuth()
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return error("Project not found")
    const updated = await prisma.project.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    })
    return success(updated)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") return error("Unauthorized")
    return error(err instanceof Error ? err.message : "Failed to toggle featured")
  }
}
