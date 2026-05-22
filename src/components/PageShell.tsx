"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageShellProps {
  label: string
  title: string
  text: string
  children: React.ReactNode
  light?: boolean
  lang: string
}

export default function PageShell({
  label,
  title,
  text,
  children,
  light = false,
  lang,
}: PageShellProps) {
  const isAr = lang === "ar"

  return (
    <section
      className={`relative w-full px-6 py-24 md:py-32 ${light ? "bg-[#e8e2d6]" : "bg-[#11110f]"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className={`mb-8 flex items-center gap-2 text-sm transition-colors ${
            light
              ? "text-[#7d5a28]/60 hover:text-[#7d5a28]"
              : "text-[#e8e2d6]/50 hover:text-[#e8e2d6]"
          } ${isAr ? "flex-row-reverse" : ""}`}
        >
          <ArrowLeft size={16} className={isAr ? "rotate-180" : ""} />
          {isAr ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        <span
          className={`inline-block text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? "text-[#7d5a28]" : "text-[#c9a35c]"
          }`}
        >
          {label}
        </span>

        <h2
          className={`mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl ${
            light ? "text-[#0d0d0b]" : "text-white"
          }`}
        >
          {title}
        </h2>

        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${
            light ? "text-[#0d0d0b]/70" : "text-[#e8e2d6]/60"
          }`}
        >
          {text}
        </p>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
