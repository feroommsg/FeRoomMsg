import { getActiveCapabilities, getActiveSectors } from "@/actions"
import { CapabilitiesContent } from "@/components/page-content"

export default async function CapabilitiesPage() {
  const [capsRes, sectorsRes] = await Promise.all([
    getActiveCapabilities(),
    getActiveSectors(),
  ])

  return (
    <CapabilitiesContent
      capabilities={capsRes.success ? (capsRes.data as Record<string, any>[]) ?? [] : []}
      sectors={sectorsRes.success ? (sectorsRes.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
