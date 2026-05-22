import { defineConfig } from "@prisma/config"

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL ||
  "postgresql://localhost:5432/el-gedada"

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
})
