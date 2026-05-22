"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import LanguageSwitch from "./LanguageSwitch"

interface HeaderProps {
  lang: string
  onLanguageChange: (lang: string) => void
}

const navLinks = [
  { href: "/company", labelEn: "Company", labelAr: "الشركة" },
  { href: "/capabilities", labelEn: "Capabilities", labelAr: "الإمكانيات" },
  { href: "/projects", labelEn: "Projects", labelAr: "المشاريع" },
  { href: "/materials", labelEn: "Materials", labelAr: "المواد" },
  { href: "/catalog", labelEn: "Catalog", labelAr: "الكتالوج" },
  { href: "/partners", labelEn: "Partners", labelAr: "الشركاء" },
  { href: "/contact", labelEn: "Contact", labelAr: "اتصل بنا" },
]

export default function Header({ lang, onLanguageChange }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isAr = lang === "ar"

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 border-b border-[#e8e2d6]/5 bg-[#0d0d0b]/80 backdrop-blur-lg ${isAr ? "rtl" : "ltr"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3.5">
          <span className="relative h-12 w-12 shrink-0 rounded-full bg-[#031f3b] p-0.5 shadow-[0_0_26px_rgba(201,163,92,0.18)] ring-1 ring-[#c9a35c]/25">
            <Image
              src="/msg-logo.svg"
              alt={isAr ? "شعار MSG" : "MSG logo"}
              fill
              priority
              sizes="48px"
              className="rounded-full object-contain"
            />
          </span>
          <span className="flex flex-col justify-center leading-none">
            <span className="text-base font-black tracking-[-0.02em] text-white">MSG</span>
            <span className="mt-1.5 hidden text-[9px] font-black uppercase tracking-[0.34em] text-[#c9a35c] sm:block">
              {isAr ? "الورشة الهندسية" : "Engineering Works"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active
                    ? "text-[#c9a35c]"
                    : "text-[#e8e2d6]/60 hover:text-[#e8e2d6]"
                }`}
              >
                {isAr ? link.labelAr : link.labelEn}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch lang={lang} onChange={onLanguageChange} />
          <Link
            href="/company"
            className="hidden rounded-md bg-[#c9a35c] px-4 py-1.5 text-sm font-medium text-[#0d0d0b] transition-colors hover:bg-[#b8922f] md:block"
          >
            {isAr ? "عن الشركة" : "Company"}
          </Link>
          <button
            className="text-[#e8e2d6]/70 hover:text-[#c9a35c] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e8e2d6]/5 bg-[#0d0d0b] px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm transition-colors ${
                    active
                      ? "text-[#c9a35c]"
                      : "text-[#e8e2d6]/60 hover:text-[#e8e2d6]"
                  }`}
                >
                  {isAr ? link.labelAr : link.labelEn}
                </Link>
              )
            })}
            <Link
              href="/company"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-md bg-[#c9a35c] px-4 py-2 text-center text-sm font-medium text-[#0d0d0b]"
            >
              {isAr ? "عن الشركة" : "Company"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
