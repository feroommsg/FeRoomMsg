"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { verifySession } from "@/actions/admin-auth"
import { getAllProjects, getAllMaterials, getAllCatalogItems, getAllPartners } from "@/actions"
import { LayoutDashboard, Package, BookOpen, Handshake, FolderKanban, Loader2, ArrowUpRight } from "lucide-react"

interface SessionData {
  email: string
}

export default function AdminDashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [counts, setCounts] = useState({ projects: 0, materials: 0, catalog: 0, partners: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const [sessionRes, projectsRes, materialsRes, catalogRes, partnersRes] = await Promise.all([
        verifySession(),
        getAllProjects(),
        getAllMaterials(),
        getAllCatalogItems(),
        getAllPartners(),
      ])
      if (sessionRes.success) {
        setSession(sessionRes.data as SessionData)
      }
      setCounts({
        projects: (projectsRes.data as unknown[])?.length ?? 0,
        materials: (materialsRes.data as unknown[])?.length ?? 0,
        catalog: (catalogRes.data as unknown[])?.length ?? 0,
        partners: (partnersRes.data as unknown[])?.length ?? 0,
      })
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-[#c9a35c]" size={32} />
      </div>
    )
  }

  const cards = [
    { label: "Projects", count: counts.projects, href: "/admin/projects", icon: FolderKanban },
    { label: "Materials", count: counts.materials, href: "/admin/materials", icon: Package },
    { label: "Catalog Items", count: counts.catalog, href: "/admin/catalog", icon: BookOpen },
    { label: "Partners", count: counts.partners, href: "/admin/partners", icon: Handshake },
  ]

  const quickLinks = [
    { label: "Site Settings", href: "/admin/settings" },
    { label: "Home Content", href: "/admin/home" },
    { label: "Company (Trust & Metrics)", href: "/admin/company" },
    { label: "Capabilities & Sectors", href: "/admin/capabilities" },
    { label: "Contact Info", href: "/admin/contact" },
    { label: "Media Library", href: "/admin/media" },
    { label: "SEO Settings", href: "/admin/seo" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e8e2d6]">
          Welcome back{session ? `, ${session.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-[#e8e2d6]/50">Here is an overview of your site content.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-5 transition-all hover:border-[#c9a35c]/30"
            >
              <div className="flex items-center justify-between">
                <Icon className="text-[#c9a35c]" size={24} />
                <ArrowUpRight
                  className="text-[#e8e2d6]/20 transition-colors group-hover:text-[#c9a35c]"
                  size={16}
                />
              </div>
              <p className="mt-3 text-2xl font-bold text-[#e8e2d6]">{card.count}</p>
              <p className="mt-0.5 text-xs text-[#e8e2d6]/50">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#e8e2d6]/60 uppercase tracking-wider">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg border border-[#e8e2d6]/5 bg-[#0d0d0b] px-4 py-3 text-sm text-[#e8e2d6]/70 transition-colors hover:border-[#c9a35c]/20 hover:text-[#c9a35c]"
            >
              <LayoutDashboard size={14} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
