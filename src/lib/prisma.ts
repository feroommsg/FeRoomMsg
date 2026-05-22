import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let initAttempted = false

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  if (initAttempted) return globalForPrisma.prisma as unknown as PrismaClient
  initAttempted = true
  try {
    globalForPrisma.prisma = new PrismaClient()
  } catch {
    // PrismaClient not available — likely no database adapter configured
  }
  return globalForPrisma.prisma as unknown as PrismaClient
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient()
    if (!client || client === undefined) {
      return async () => ({ success: false, error: "Database unavailable" })
    }
    return Reflect.get(client, prop, client)
  },
})
