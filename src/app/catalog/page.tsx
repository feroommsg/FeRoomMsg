import { getActiveCatalogItems } from "@/actions"
import { CatalogContent } from "@/components/page-content"

export default async function CatalogPage() {
  const res = await getActiveCatalogItems()

  return (
    <CatalogContent
      items={res.success ? (res.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
