import { spawnSync } from "node:child_process"

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  console.log("No database URL found. Skipping database setup.")
  process.exit(0)
}

process.env.DATABASE_URL = databaseUrl

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

console.log("Database URL found. Pushing Prisma schema...")
run("npx", ["prisma", "db", "push", "--accept-data-loss"])

console.log("Seeding database defaults...")
run("npx", ["tsx", "prisma/seed.ts"])
