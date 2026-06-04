"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Globe,
  Hammer,
  HardHat,
  Factory,
  Users,
  Building2,
  Wrench,
  Package,
  BookOpen,
  Handshake,
  Phone,
  MapPin,
  Ruler,
  ChevronRight,
  FileImage,
  Mail,
  Send,
  ExternalLink,
  Download,
  FileText,
  type LucideIcon,
} from "lucide-react"
import { useLang } from "@/lib/lang-context"
import HeroSection from "./HeroSection"
import PageShell from "./PageShell"
import CatalogGallery from "./CatalogGallery"
import PdfViewer from "./PdfViewer"

const iconMap: Record<string, LucideIcon> = {
  Shield,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Globe,
  Hammer,
  HardHat,
  Factory,
  Users,
  Building2,
  Wrench,
  Package,
  BookOpen,
  Handshake,
  Phone,
}

function Icon({ name, className }: { name?: string | null; className?: string }) {
  if (name && iconMap[name]) {
    const IconComponent = iconMap[name]
    return <IconComponent className={className} />
  }
  return <CheckCircle className={className} />
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold text-white md:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-[#e8e2d6]/60">{subtitle}</p>
      )}
    </div>
  )
}

interface HomeContentProps {
  homeContent: Record<string, any> | null
  metrics: Record<string, any>[]
  trustItems: Record<string, any>[]
  capabilities: Record<string, any>[]
  sectors: Record<string, any>[]
  settings: Record<string, any> | null
}

export function HomeContent({
  homeContent,
  metrics,
  trustItems,
  capabilities,
  sectors,
  settings,
}: HomeContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"

  const badge = isAr ? homeContent?.heroBadgeAr : homeContent?.heroBadgeEn
  const heroTitle = isAr ? homeContent?.heroTitleAr : homeContent?.heroTitleEn
  const heroText = isAr ? homeContent?.heroTextAr : homeContent?.heroTextEn
  const bgImage = homeContent?.heroBgImage || ""
  const overviewTitle = isAr ? homeContent?.overviewTitleAr : homeContent?.overviewTitleEn
  const overviewText = isAr ? homeContent?.overviewTextAr : homeContent?.overviewTextEn
  const overviewText2 = isAr ? homeContent?.overviewText2Ar : homeContent?.overviewText2En

  const heroMetrics = metrics.slice(0, 4).map((m) => ({
    value: m.value,
    label: isAr ? m.labelAr : m.labelEn,
  }))

  return (
    <>
      <HeroSection
        badge={badge || (isAr ? "شركة رائدة" : "Leading Company")}
        title={heroTitle || "MSG"}
        text={heroText || (isAr ? "الحلول الهندسية المتكاملة" : "Complete Engineering Solutions")}
        metrics={heroMetrics}
        bgImage={bgImage}
        lang={lang}
      />

      {trustItems.length > 0 && (
        <section className="border-b border-[#e8e2d6]/5 bg-[#11110f] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {trustItems.slice(0, 4).map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a35c]/10">
                    <Icon name={item.icon} className="h-6 w-6 text-[#c9a35c]" />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-[#e8e2d6]/80">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(overviewTitle || overviewText || overviewText2) && (
        <section className="bg-[#0d0d0b] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className={`flex flex-col gap-12 lg:flex-row ${isAr ? "lg:flex-row-reverse" : ""}`}>
              <div className="flex-1">
                {overviewTitle && (
                  <h2 className="text-3xl font-bold text-white md:text-5xl">{overviewTitle}</h2>
                )}
                {overviewText && (
                  <p className="mt-6 text-base leading-relaxed text-[#e8e2d6]/60 md:text-lg">
                    {overviewText}
                  </p>
                )}
                {overviewText2 && (
                  <p className="mt-4 text-base leading-relaxed text-[#e8e2d6]/60 md:text-lg">
                    {overviewText2}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-6">
                <Link
                  href="/materials"
                  className="group rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-8 transition-colors hover:border-[#c9a35c]/40"
                >
                  <Package className="mb-3 h-8 w-8 text-[#c9a35c]" />
                  <h3 className="text-lg font-bold text-white">
                    {isAr ? "المواد" : "Materials"}
                  </h3>
                  <p className="mt-2 text-sm text-[#e8e2d6]/50">
                    {isAr ? "تعرف على المواد المستخدمة" : "Explore our material selection"}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {capabilities.length > 0 && (
        <section className="border-t border-[#e8e2d6]/5 bg-[#11110f] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title={isAr ? "إمكانياتنا" : "Our Capabilities"}
              subtitle={
                isAr
                  ? "نقدم حلولاً متكاملة في مجالات متعددة"
                  : "Comprehensive solutions across multiple domains"
              }
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {capabilities.slice(0, 4).map((cap, i) => (
                <div
                  key={i}
                  className="group rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-6 transition-all hover:border-[#c9a35c]/40 hover:shadow-lg hover:shadow-[#c9a35c]/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c9a35c]/10">
                    <Icon name={cap.icon} className="h-6 w-6 text-[#c9a35c]" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {isAr ? cap.titleAr : cap.titleEn}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#e8e2d6]/60">
                    {isAr ? cap.descriptionAr : cap.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/capabilities"
                className="inline-flex items-center gap-2 rounded-md border border-[#e8e2d6]/20 px-6 py-3 text-sm font-semibold text-[#e8e2d6] transition-colors hover:border-[#c9a35c] hover:text-[#c9a35c]"
              >
                {isAr ? "عرض الكل" : "View All"}
                <ChevronRight size={16} className={isAr ? "rotate-180" : ""} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {sectors.length > 0 && (
        <section className="border-t border-[#e8e2d6]/5 bg-[#11110f] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title={isAr ? "القطاعات" : "Business Sectors"}
              subtitle={
                isAr
                  ? "نخدم مجموعة واسعة من القطاعات"
                  : "Serving a wide range of industries"
              }
            />
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sectors.map((sector, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] px-5 py-4 transition-colors hover:border-[#c9a35c]/30"
                >
                  <Building2 className="h-5 w-5 flex-shrink-0 text-[#c9a35c]" />
                  <span className="text-sm font-medium text-[#e8e2d6]/80">
                    {isAr ? sector.nameAr : sector.nameEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#0d0d0b] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={isAr ? "تصفح الموقع" : "Site Map"}
            subtitle={
              isAr
                ? "استكشف جميع أقسام موقعنا"
                : "Explore all sections of our site"
            }
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { href: "/company", icon: Building2, labelEn: "Company", labelAr: "الشركة" },
              { href: "/capabilities", icon: Wrench, labelEn: "Capabilities", labelAr: "الإمكانيات" },

              { href: "/materials", icon: Package, labelEn: "Materials", labelAr: "المواد" },
              { href: "/catalog", icon: BookOpen, labelEn: "Catalog", labelAr: "الكتالوج" },
              { href: "/partners", icon: Handshake, labelEn: "Partners", labelAr: "الشركاء" },
              { href: "/contact", icon: Phone, labelEn: "Contact", labelAr: "اتصل بنا" },
            ].map((item, i) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-5 transition-all hover:border-[#c9a35c]/40 hover:shadow-lg hover:shadow-[#c9a35c]/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c9a35c]/10">
                    <IconComponent className="h-6 w-6 text-[#c9a35c]" />
                  </div>
                  <span className="text-base font-semibold text-white group-hover:text-[#c9a35c]">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`ml-auto text-[#e8e2d6]/30 ${isAr ? "rotate-180" : ""}`}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

interface CompanyContentProps {
  settings: Record<string, any> | null
  trustItems: Record<string, any>[]
  metrics: Record<string, any>[]
}

export function CompanyContent({ settings, trustItems, metrics }: CompanyContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"

  const metricItems = metrics.map((m) => ({
    value: m.value,
    label: isAr ? m.labelAr : m.labelEn,
  }))

  return (
    <PageShell
      label={isAr ? "الشركة" : "Company"}
      title={isAr ? "بروفايل الشركة" : "Company Profile"}
      text={
        isAr
          ? "شركة متخصصة في الأعمال الهندسية والحدادة والمقاولات"
          : "A specialized company in engineering works, metal fabrication, and contracting"
      }
      lang={lang}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            {isAr ? "عن الشركة" : "About Us"}
          </h3>
          <p className="text-sm leading-relaxed text-[#e8e2d6]/60">
            {isAr
              ? "نسعى لتقديم أفضل الحلول الهندسية والمعدنية لعملائنا مع الالتزام بأعلى معايير الجودة."
              : "We strive to provide the best engineering and metal solutions to our clients with a commitment to the highest quality standards."}
          </p>
          <p className="text-sm leading-relaxed text-[#e8e2d6]/60">
            {isAr
              ? "نمتلك فريقاً من المهندسين والفنيين المتخصصين لتنفيذ المشاريع بكفاءة واحترافية."
              : "We have a team of specialized engineers and technicians to execute projects efficiently and professionally."}
          </p>
        </div>

        {metricItems.length > 0 && (
          <div className="rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-6">
            <div className="grid grid-cols-2 gap-6">
              {metricItems.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-3xl font-bold text-[#c9a35c]">{m.value}</span>
                  <span className="mt-1 text-sm text-[#e8e2d6]/50">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {trustItems.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-8 text-xl font-bold text-white">
            {isAr ? "لماذا تختارنا" : "Why Choose Us"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-4"
              >
                <Icon name={item.icon} className="h-5 w-5 flex-shrink-0 text-[#c9a35c]" />
                <span className="text-sm text-[#e8e2d6]/80">
                  {isAr ? item.labelAr : item.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 rounded-lg border border-[#c9a35c]/20 bg-[#c9a35c]/5 p-8 text-center">
        <h3 className="text-2xl font-bold text-[#c9a35c]">
          {isAr ? "التزامنا" : "Our Promise"}
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#e8e2d6]/70">
          {isAr
            ? "نلتزم بتقديم أعمال عالية الجودة في الوقت المحدد وبأعلى معايير السلامة المهنية."
            : "We are committed to delivering high-quality work on time and with the highest professional safety standards."}
        </p>
      </div>
    </PageShell>
  )
}

interface CapabilitiesContentProps {
  capabilities: Record<string, any>[]
  sectors: Record<string, any>[]
}

export function CapabilitiesContent({ capabilities, sectors }: CapabilitiesContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"

  return (
    <PageShell
      label={isAr ? "الإمكانيات" : "Capabilities"}
      title={isAr ? "إمكانياتنا الهندسية" : "Our Engineering Capabilities"}
      text={
        isAr
          ? "نمتلك القدرات والمعدات اللازمة لتنفيذ أصعب المشاريع"
          : "We have the capabilities and equipment to execute the most demanding projects"
      }
      lang={lang}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] p-6 transition-all hover:border-[#c9a35c]/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c9a35c]/10">
              <Icon name={cap.icon} className="h-6 w-6 text-[#c9a35c]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              {isAr ? cap.titleAr : cap.titleEn}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#e8e2d6]/60">
              {isAr ? cap.descriptionAr : cap.descriptionEn}
            </p>
          </div>
        ))}
      </div>

      {sectors.length > 0 && (
        <div className="mt-16">
          <h3 className="mb-8 text-xl font-bold text-white">
            {isAr ? "القطاعات التي نخدمها" : "Sectors We Serve"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[#e8e2d6]/10 bg-[#0d0d0b] px-5 py-4"
              >
                <Building2 className="h-5 w-5 flex-shrink-0 text-[#c9a35c]" />
                <span className="text-sm font-medium text-[#e8e2d6]/80">
                  {isAr ? sector.nameAr : sector.nameEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  )
}

interface MaterialViewerProps {
  materials: Record<string, any>[]
}

export function MaterialViewer({ materials }: MaterialViewerProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [viewerTitle, setViewerTitle] = useState("")

  const formatSize = (bytes: number) => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text

  if (materials.length === 0) {
    return (
      <PageShell
        label={isAr ? "المواد" : "Materials"}
        title={isAr ? "المواد المستخدمة" : "Our Materials"}
        text={isAr ? "لا توجد مواد حالياً" : "No materials available"}
        lang={lang}
      >
        <p className="py-12 text-center text-[#e8e2d6]/40">
          {isAr ? "لا توجد مواد حالياً" : "No materials available"}
        </p>
      </PageShell>
    )
  }

  return (
    <PageShell
      label={isAr ? "المواد" : "Materials"}
      title={isAr ? "المواد المستخدمة" : "Our Materials"}
      text={
        isAr
          ? "نستخدم أفضل المواد لضمان الجودة والمتانة"
          : "We use the finest materials to ensure quality and durability"
      }
      lang={lang}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {materials.map((m) => {
          const name = isAr ? m.nameAr : m.nameEn
          const category = isAr ? m.categoryAr : m.categoryEn
          const desc = isAr ? m.descriptionAr : m.descriptionEn
          return (
            <div
              key={m.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] transition-all hover:border-[#c9a35c]/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0b]">
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FileText className="h-10 w-10 text-[#e8e2d6]/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11110f] via-transparent to-transparent" />
                {category && (
                  <span className="absolute right-2 top-2 rounded-full bg-[#c9a35c]/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#0d0d0b]">
                    {category}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-white">{name}</h3>
                {desc && (
                  <p className="mt-1.5 text-xs leading-relaxed text-[#e8e2d6]/50">
                    {truncate(desc, 100)}
                  </p>
                )}

                <div className="mt-auto pt-4">
                  {m.pdfUrl ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-md bg-[#c9a35c]/10 px-2 py-1">
                        <FileText size={11} className="text-[#c9a35c]" />
                        <span className="text-[10px] font-medium text-[#c9a35c]">
                          {m.pdfSize ? formatSize(m.pdfSize) : "PDF"}
                        </span>
                      </div>
                      <div className="ml-auto flex gap-1">
                        <button
                          onClick={() => { setViewerUrl(m.pdfUrl); setViewerTitle(name) }}
                          className="rounded-md border border-[#e8e2d6]/15 px-2.5 py-1 text-[10px] font-medium text-[#e8e2d6]/60 transition-colors hover:border-[#c9a35c]/40 hover:text-[#c9a35c]"
                        >
                          {isAr ? "عرض" : "View"}
                        </button>
                        <a
                          href={m.pdfUrl}
                          download
                          className="rounded-md bg-[#c9a35c] px-2.5 py-1 text-[10px] font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f]"
                        >
                          {isAr ? "تحميل" : "Download"}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#e8e2d6]/20">
                      {isAr ? "لا يوجد ملف PDF" : "No PDF available"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {viewerUrl && (
        <PdfViewer
          url={viewerUrl}
          title={viewerTitle}
          onClose={() => { setViewerUrl(null); setViewerTitle("") }}
        />
      )}
    </PageShell>
  )
}

interface CatalogContentProps {
  items: Record<string, any>[]
}

export function CatalogContent({ items }: CatalogContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"

  return (
    <PageShell
      label={isAr ? "الكتالوج" : "Catalog"}
      title={isAr ? "معرض الصور" : "Image Gallery"}
      text={
        isAr
          ? "مجموعة من صور أعمالنا ومنتجاتنا"
          : "A collection of images showcasing our work and products"
      }
      lang={lang}
    >
      {items.length === 0 ? (
        <p className="py-12 text-center text-[#e8e2d6]/40">
          {isAr ? "لا توجد صور حالياً" : "No images available"}
        </p>
      ) : (
        <CatalogGallery items={items as any} lang={lang} />
      )}
    </PageShell>
  )
}

interface PartnersContentProps {
  partners: Record<string, any>[]
}

export function PartnersContent({ partners }: PartnersContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"

  return (
    <PageShell
      label={isAr ? "الشركاء" : "Partners"}
      title={isAr ? "شركاؤنا" : "Our Partners"}
      text={
        isAr
          ? "نفتخر بالتعاون مع أفضل الشركات والموردين"
          : "We are proud to collaborate with the best companies and suppliers"
      }
      lang={lang}
    >
      {partners.length === 0 ? (
        <p className="py-12 text-center text-[#e8e2d6]/40">
          {isAr ? "لا يوجد شركاء حالياً" : "No partners available"}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partners.map((partner, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-8 text-center transition-colors hover:border-[#c9a35c]/30"
            >
              {partner.logoUrl ? (
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full">
                  <img
                    src={partner.logoUrl}
                    alt={isAr ? partner.nameAr : partner.nameEn}
                    className="h-full w-full rounded-full object-contain"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a35c]/10">
                  <Building2 className="h-8 w-8 text-[#c9a35c]" />
                </div>
              )}
              <h3 className="text-base font-bold text-white">
                {isAr ? partner.nameAr : partner.nameEn}
              </h3>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}

interface ContactContentProps {
  contact: Record<string, any> | null
}

export function ContactContent({ contact }: ContactContentProps) {
  const { lang } = useLang()
  const isAr = lang === "ar"

  return (
    <PageShell
      label={isAr ? "اتصل بنا" : "Contact"}
      title={isAr ? "تواصل معنا" : "Get in Touch"}
      text={
        isAr
          ? "نرحب باستفساراتكم ونشكركم على تواصلكم"
          : "We welcome your inquiries and appreciate your reaching out"
      }
      lang={lang}
    >
      {!contact ? (
        <p className="py-12 text-center text-[#e8e2d6]/40">
          {isAr ? "لا توجد معلومات اتصال متاحة" : "No contact info available"}
        </p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex flex-col items-center rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-8 text-center transition-colors hover:border-[#c9a35c]/30"
              >
                <Phone className="mb-3 h-8 w-8 text-[#c9a35c]" />
                <span className="text-sm font-medium text-white">{contact.phone}</span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex flex-col items-center rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-8 text-center transition-colors hover:border-[#c9a35c]/30"
              >
                <Mail className="mb-3 h-8 w-8 text-[#c9a35c]" />
                <span className="text-sm font-medium text-white">{contact.email}</span>
              </a>
            )}
            {(contact.locationEn || contact.locationAr) && (
              <div className="flex flex-col items-center rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-8 text-center">
                <MapPin className="mb-3 h-8 w-8 text-[#c9a35c]" />
                <span className="text-sm font-medium text-white">
                  {isAr ? contact.locationAr : contact.locationEn}
                </span>
              </div>
            )}
          </div>

          {(contact.addressEn || contact.addressAr) && (
            <div className="mt-8 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c9a35c]">
                {isAr ? "العنوان" : "Address"}
              </h3>
              <p className="mt-2 text-sm text-[#e8e2d6]/70">
                {isAr ? contact.addressAr : contact.addressEn}
              </p>
            </div>
          )}

          {(contact.facebook || contact.instagram || contact.linkedin || contact.twitter) && (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#c9a35c]">
                {isAr ? "تواصل اجتماعي" : "Social Media"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {contact.facebook && (
                  <a
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] px-5 py-3 text-sm text-[#e8e2d6]/70 transition-colors hover:border-[#c9a35c]/30 hover:text-[#c9a35c]"
                  >
                    <Globe size={16} />
                    Facebook
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] px-5 py-3 text-sm text-[#e8e2d6]/70 transition-colors hover:border-[#c9a35c]/30 hover:text-[#c9a35c]"
                  >
                    <Send size={16} />
                    Instagram
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] px-5 py-3 text-sm text-[#e8e2d6]/70 transition-colors hover:border-[#c9a35c]/30 hover:text-[#c9a35c]"
                  >
                    <ExternalLink size={16} />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}

          {contact.mapEmbed && (
            <div className="mt-8 overflow-hidden rounded-lg">
              <div
                className="aspect-video w-full"
                dangerouslySetInnerHTML={{ __html: contact.mapEmbed }}
              />
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
