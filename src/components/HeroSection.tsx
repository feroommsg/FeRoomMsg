"use client"

import Link from "next/link"
import { Globe } from "lucide-react"
import { motion } from "framer-motion"

interface Metric {
  value: string
  label: string
}

interface HeroSectionProps {
  badge: string
  title: string
  text: string
  metrics: Metric[]
  bgImage: string
  lang: string
}

export default function HeroSection({
  badge,
  title,
  text,
  metrics,
  bgImage,
  lang,
}: HeroSectionProps) {
  const isAr = lang === "ar"

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          isAr
            ? "from-[#0d0d0b] via-[#0d0d0b]/95 to-transparent"
            : "from-[#0d0d0b] via-[#0d0d0b]/95 to-transparent"
        }`}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: isAr ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 pt-24"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a35c]/30 bg-[#c9a35c]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#c9a35c]">
            <Globe size={14} />
            {badge}
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl xl:text-9xl">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#e8e2d6]/60 md:text-lg">
            {text}
          </p>

          <div className={`mt-8 flex gap-4 ${isAr ? "flex-row-reverse self-start" : ""}`}>
            <Link
              href="/catalog"
              className="rounded-md bg-[#c9a35c] px-6 py-3 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f]"
            >
              {isAr ? "معرض الصور" : "View Gallery"}
            </Link>
            <Link
              href="/capabilities"
              className="rounded-md border border-[#e8e2d6]/20 px-6 py-3 text-sm font-semibold text-[#e8e2d6] transition-colors hover:border-[#c9a35c] hover:text-[#c9a35c]"
            >
              {isAr ? "الإمكانيات" : "Capabilities"}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isAr ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 pb-16 lg:pb-0"
        >
          <div className="rounded-lg border border-[#e8e2d6]/10 bg-[#11110f]/80 p-6 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-6">
              {metrics.slice(0, 4).map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-bold text-[#c9a35c] md:text-3xl lg:text-4xl">
                    {m.value}
                  </span>
                  <span className="mt-1 text-xs text-[#e8e2d6]/50 md:text-sm">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-[#e8e2d6]/10 pt-4 text-sm italic text-[#e8e2d6]/40">
              {isAr ? "التزام بالجودة والتميز في كل مشروع" : "Commitment to quality and excellence in every project"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
