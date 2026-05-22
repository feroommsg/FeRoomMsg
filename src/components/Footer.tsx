interface FooterProps {
  lang: string
}

const content = {
  en: {
    brand: "El-Gedada",
    tagline: "Engineering Works",
    rights: "All rights reserved.",
  },
  ar: {
    brand: "الجدادا",
    tagline: "أعمال هندسية",
    rights: "جميع الحقوق محفوظة.",
  },
}

export default function Footer({ lang }: FooterProps) {
  const c = lang === "ar" ? content.ar : content.en
  const year = new Date().getFullYear()

  return (
    <footer
      className="w-full border-t border-[#e8e2d6]/5 bg-[#0d0d0b] px-6 py-12"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <p className="text-lg font-bold text-[#c9a35c]">{c.brand}</p>
          <p className="text-sm text-[#e8e2d6]/50">{c.tagline}</p>
        </div>
        <p className="text-xs text-[#e8e2d6]/40">
          &copy; {year} {c.brand}. {c.rights}
        </p>
      </div>
    </footer>
  )
}
