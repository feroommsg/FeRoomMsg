import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Inter } from "next/font/google"
import "./globals.css"
import RootLayoutClient from "@/components/RootLayoutClient"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "MSG | Engineering Works",
  description: "Premium metal engineering and construction solutions",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const lang = cookieStore.get("lang")?.value || "en"
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0d0d0b] font-sans text-white">
        <RootLayoutClient initialLang={lang}>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
