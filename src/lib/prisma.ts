import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL
  )
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    throw new Error(
      "Database is not configured. Add DATABASE_URL or POSTGRES_URL in Vercel Environment Variables, redeploy, then run npm run db:setup."
    )
  }

  process.env.DATABASE_URL = databaseUrl

  globalForPrisma.prisma = new PrismaClient()
  return globalForPrisma.prisma as unknown as PrismaClient
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient()
    return Reflect.get(client, prop, client)
  },
})
