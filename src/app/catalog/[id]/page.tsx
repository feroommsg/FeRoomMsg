import { notFound } from "next/navigation"
import { getCatalogItemById } from "@/actions"
import CatalogDetailContent from "./CatalogDetailContent"

export default async function CatalogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await getCatalogItemById(id)

  if (!res.success || !res.data) {
    notFound()
  }

  return <CatalogDetailContent item={res.data as Record<string, any>} />
}