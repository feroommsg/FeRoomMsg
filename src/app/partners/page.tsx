import { getActivePartners } from "@/actions"
import { PartnersContent } from "@/components/page-content"

export default async function PartnersPage() {
  const res = await getActivePartners()

  return (
    <PartnersContent
      partners={res.success ? (res.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
