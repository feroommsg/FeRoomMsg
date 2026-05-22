"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Settings,
  Home,
  Building2,
  Cpu,
  FolderKanban,
  Package,
  BookOpen,
  Handshake,
  Phone,
  Image,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react"

interface AdminSidebarProps {
  currentPath: string
}

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/home", label: "Home Content", icon: Home },
  { href: "/admin/company", label: "Company", icon: Building2 },
  { href: "/admin/capabilities", label: "Capabilities", icon: Cpu },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/materials", label: "Materials", icon: Package },
  { href: "/admin/catalog", label: "Catalog", icon: BookOpen },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/contact", label: "Contact", icon: Phone },
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/seo", label: "SEO", icon: Search },
]

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 rounded-md bg-[#11110f] p-2 text-[#e8e2d6]/70 hover:text-[#c9a35c] lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 flex h-full flex-col border-r border-[#e8e2d6]/5 bg-[#0d0d0b] transition-transform lg:static lg:translate-x-0 ${
          collapsed ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flex items-center gap-2 border-b border-[#e8e2d6]/5 px-6 py-5">
          <span className="text-lg font-bold text-[#c9a35c]">Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const active = currentPath === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setCollapsed(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[#c9a35c]/10 text-[#c9a35c]"
                    : "text-[#e8e2d6]/50 hover:bg-[#11110f] hover:text-[#e8e2d6]"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#e8e2d6]/5 px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400/70 transition-colors hover:bg-red-400/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>

      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}
    </>
  )
}
