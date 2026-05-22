"use client"

import { Globe } from "lucide-react"

interface LanguageSwitchProps {
  lang: string
  onChange: (lang: string) => void
}

export default function LanguageSwitch({ lang, onChange }: LanguageSwitchProps) {
  return (
    <button
      onClick={() => onChange(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#e8e2d6]/70 hover:text-[#c9a35c] transition-colors border border-[#e8e2d6]/10 rounded-md"
    >
      <Globe size={14} />
      <span>{lang === "en" ? "العربية" : "English"}</span>
    </button>
  )
}
