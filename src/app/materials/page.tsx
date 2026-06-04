import type { Metadata } from "next"
import { getActiveMaterials } from "@/actions"
import { MaterialViewer } from "@/components/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const res = await getActiveMaterials()
  const materials = res.success ? (res.data as Record<string, any>[]) ?? [] : []

  return {
    title: "Materials & Technical Catalogs | El-Gedada Engineering Works",
    description: materials[0]
      ? `Browse our ${materials.length} technical catalogs and material specifications including ${materials.slice(0, 3).map((m) => m.nameEn).join(", ")}.`
      : "Browse our technical catalogs and material specifications for engineering and contracting projects.",
    openGraph: {
      title: "Materials & Technical Catalogs | El-Gedada",
      description: "Professional engineering material catalogs and technical documentation.",
    },
  }
}

export default async function MaterialsPage() {
  const res = await getActiveMaterials()

  return (
    <MaterialViewer
      materials={res.success ? (res.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
