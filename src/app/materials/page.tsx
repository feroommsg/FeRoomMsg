import { getActiveMaterials } from "@/actions"
import { MaterialViewer } from "@/components/page-content"

export default async function MaterialsPage() {
  const res = await getActiveMaterials()

  return (
    <MaterialViewer
      materials={res.success ? (res.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
