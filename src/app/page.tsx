import {
  getHomeContent,
  getActiveMetrics,
  getActiveTrustItems,
  getActiveCapabilities,
  getActiveProjects,
  getActiveSectors,
  getSiteSettings,
} from "@/actions"
import { HomeContent } from "@/components/page-content"

export default async function HomePage() {
  const [homeRes, metricsRes, trustRes, capsRes, projRes, sectorsRes, settingsRes] =
    await Promise.all([
      getHomeContent(),
      getActiveMetrics(),
      getActiveTrustItems(),
      getActiveCapabilities(),
      getActiveProjects(),
      getActiveSectors(),
      getSiteSettings(),
    ])

  return (
    <HomeContent
      homeContent={homeRes.success ? (homeRes.data as Record<string, any>) ?? null : null}
      metrics={metricsRes.success ? (metricsRes.data as Record<string, any>[]) ?? [] : []}
      trustItems={trustRes.success ? (trustRes.data as Record<string, any>[]) ?? [] : []}
      capabilities={capsRes.success ? (capsRes.data as Record<string, any>[]) ?? [] : []}
      projects={projRes.success ? (projRes.data as Record<string, any>[]) ?? [] : []}
      sectors={sectorsRes.success ? (sectorsRes.data as Record<string, any>[]) ?? [] : []}
      settings={settingsRes.success ? (settingsRes.data as Record<string, any>) ?? null : null}
    />
  )
}
