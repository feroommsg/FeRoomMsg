"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { setLanguageCookie } from "@/actions/language"

interface LangContextValue {
  lang: string
  setLang: (lang: string) => void
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
})

export function useLang() {
  return useContext(LangContext)
}

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: string
  children: ReactNode
}) {
  const [lang, setLangState] = useState(initialLang)

  const setLang = useCallback((newLang: string) => {
    setLangState(newLang)
    setLanguageCookie(newLang)
  }, [])

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}
