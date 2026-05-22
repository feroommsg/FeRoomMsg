import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Database is not configured. Add DATABASE_URL in Vercel Environment Variables, redeploy, then run npm run db:setup."
    )
  }

  globalForPrisma.prisma = new PrismaClient()
  return globalForPrisma.prisma as unknown as PrismaClient
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient()
    return Reflect.get(client, prop, client)
  },
})
