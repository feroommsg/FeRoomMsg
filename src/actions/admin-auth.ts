"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { createToken, verifyToken } from "@/lib/auth"
import { success, error } from "@/lib/utils"

export async function login(email: string, password: string) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return error("Server configuration error")
    }

    if (email !== adminEmail || password !== adminPassword) {
      return error("Invalid email or password")
    }

    const token = await createToken({ email })
    const cookieStore = await cookies()
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    })

    return success({ email })
  } catch (err) {
    return error(err instanceof Error ? err.message : "Login failed")
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
    return success(null)
  } catch (err) {
    return error(err instanceof Error ? err.message : "Logout failed")
  }
}

export async function verifySession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    if (!token) return error("Unauthorized")
    const payload = await verifyToken(token)
    if (!payload) return error("Unauthorized")
    return success({ email: payload.email })
  } catch (err) {
    return error(err instanceof Error ? err.message : "Verification failed")
  }
}
