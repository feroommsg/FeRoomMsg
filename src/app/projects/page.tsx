import { getActiveProjects } from "@/actions"
import { ProjectsContent } from "@/components/page-content"

export default async function ProjectsPage() {
  const res = await getActiveProjects()

  return (
    <ProjectsContent
      projects={res.success ? (res.data as Record<string, any>[]) ?? [] : []}
    />
  )
}
