"use client"

import { ReactNode } from "react"
import { LangProvider, useLang } from "@/lib/lang-context"
import Header from "./Header"
import Footer from "./Footer"

export default function RootLayoutClient({
  initialLang,
  children,
}: {
  initialLang: string
  children: ReactNode
}) {
  return (
    <LangProvider initialLang={initialLang}>
      <SiteShell>{children}</SiteShell>
    </LangProvider>
  )
}

function SiteShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang()
  return (
    <>
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer lang={lang} />
    </>
  )
}
