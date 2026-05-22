import { getSiteSettings, getActiveTrustItems, getActiveMetrics } from "@/actions"
import { CompanyContent } from "@/components/page-content"

export default async function CompanyPage() {
  const [settingsRes, trustRes, metricsRes] = await Promise.all([
    getSiteSettings(),
    getActiveTrustItems(),
    getActiveMetrics(),
  ])

  return (
    <CompanyContent
      settings={settingsRes.success ? (settingsRes.data as Record<string, any>) ?? null : null}
      trustItems={trustRes.success ? (trustRes.data as Record<string, any>[]) ?? [] : []}
      metrics={metricsRes.success ? (metricsRes.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
